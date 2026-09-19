-- tools/portraits_main.lua
--
-- Cut one frame out of each enemy's walk sheet and write it to
-- docs/assets/img/<Type>.png for the bestiary.
--
--   tools/portraits.sh     (see README.md)
--
-- ── Why this is not just a file copy ─────────────────────────────────────────
-- Eleven of the eighteen enemies share art with another one. A Brute, a
-- Toadstool and a Sporeling are all the same mushroom sheet, and what tells
-- them apart in play is the recolour BaseEnemy:draw applies at render time --
-- a YIQ hue rotation, or a multiply tint for the sprites with no chroma to
-- rotate. Copying the PNGs out would therefore produce a bestiary in which a
-- third of the roster is the same picture repeated, which is worse than having
-- no pictures.
--
-- So the shader here is the same one, character for character, lifted from
-- BaseEnemy.lua. If the game's recolouring changes, these regenerate different
-- and the wiki keeps matching what the player sees.

io.stdout:setvbuf("no")

-- The sprites come from the GAME; the portraits are written into THIS
-- repository. See tools/paths.lua.
local WIKI_HINT = (os.getenv("RR_WIKI") or "C:/Users/user/Desktop/ricochet-ritual-wiki")
    :gsub(string.char(92), "/"):gsub("/+$", "")
local PATHS = dofile(WIKI_HINT .. "/tools/paths.lua")

local pathsOk, pathsWhy = PATHS.check()
if not pathsOk then
    print("paths:\n  " .. pathsWhy)
    os.exit(1)
end

local ROOT = PATHS.game
local OUT  = PATHS.wiki .. "docs/assets/img/"

local LOG = io.open(PATHS.wiki .. "tools/portraits.log", "wb")
local function say(s)
    LOG:write(tostring(s) .. "\n")
    LOG:flush()
    print(s)
end

local cache = {}
local baseRequire = require
function require(name)
    if cache[name] ~= nil then return cache[name] end
    local path = ROOT .. tostring(name):gsub("%.", "/") .. ".lua"
    local chunk = loadfile(path)
    if not chunk then
        local ok, mod = pcall(baseRequire, name)
        cache[name] = (ok and mod ~= nil) and mod or true
        return cache[name]
    end
    cache[name] = true
    local ok, res = pcall(chunk, name)
    if not ok then
        say("!! require failed: " .. name .. " -- " .. tostring(res))
        return true
    end
    if res == nil then res = true end
    cache[name] = res
    return res
end

-- Verbatim from Objects/Entities/Enemies/BaseEnemy.lua. Copied rather than
-- required because pulling BaseEnemy in drags the whole entity graph with it.
local hueShader = love.graphics.newShader([[
    extern number hue;
    const float SAT_LOW  = 0.06;
    const float SAT_HIGH = 0.18;
    vec4 effect(vec4 color, Image tex, vec2 uv, vec2 sc) {
        vec4 px = Texel(tex, uv);
        float y  = dot(px.rgb, vec3(0.299, 0.587, 0.114));
        float i  = dot(px.rgb, vec3(0.596, -0.274, -0.322));
        float q  = dot(px.rgb, vec3(0.211, -0.523, 0.312));

        float chroma = length(vec2(i, q));
        float amount = smoothstep(SAT_LOW, SAT_HIGH, chroma);
        float a = hue * amount;

        float c = cos(a);
        float s = sin(a);
        float i2 = i * c - q * s;
        float q2 = i * s + q * c;
        vec3 rgb = vec3(
            y + 0.956 * i2 + 0.621 * q2,
            y - 0.272 * i2 - 0.647 * q2,
            y - 1.106 * i2 + 1.703 * q2
        );
        return vec4(clamp(rgb, 0.0, 1.0), px.a) * color;
    }
]])

-- Load a PNG by absolute OS path.
--
-- love.graphics.newImage reads through LÖVE's virtual filesystem, which is
-- rooted at the harness folder and cannot see the game tree beside it. Reading
-- the bytes with plain io and handing them over as FileData sidesteps the VFS,
-- so the harness stays a two-file copy instead of needing the whole Sprites
-- directory duplicated into it.
local function imageFromDisk(absPath)
    local fh = io.open(absPath, "rb")
    if not fh then return nil, "cannot open " .. absPath end
    local bytes = fh:read("*a")
    fh:close()
    local ok, img = pcall(function()
        local fd = love.filesystem.newFileData(bytes, absPath:match("[^/]+$"))
        return love.graphics.newImage(love.image.newImageData(fd))
    end)
    if not ok then return nil, tostring(img) end
    return img
end

-- Which frame of the walk cycle reads best as a standing portrait. Frame 1 of
-- a run cycle is usually mid-stride with a leg occluding the body; a frame a
-- third of the way in is a cleaner silhouette.
local function portraitFrame(frames)
    if frames <= 1 then return 0 end
    return math.floor(frames / 3)
end

-- Trim fully transparent margins, so a 128px frame holding a 40px creature
-- does not publish as mostly empty space.
local function tightBounds(data)
    local w, h = data:getWidth(), data:getHeight()
    local x0, y0, x1, y1 = w, h, -1, -1
    for y = 0, h - 1 do
        for x = 0, w - 1 do
            local _, _, _, a = data:getPixel(x, y)
            if a > 0.02 then
                if x < x0 then x0 = x end
                if y < y0 then y0 = y end
                if x > x1 then x1 = x end
                if y > y1 then y1 = y end
            end
        end
    end
    if x1 < 0 then return 0, 0, w, h end
    return x0, y0, (x1 - x0 + 1), (y1 - y0 + 1)
end

local function build()
    require("Objects/Entities/Enemies/EnemyTypes")
    love.filesystem.createDirectory("img")

    local keys = {}
    for k in pairs(EnemyTypes) do keys[#keys + 1] = k end
    table.sort(keys)

    local written = 0
    for _, key in ipairs(keys) do
        local e = EnemyTypes[key]
        local anim = (e.animations and e.animations[1]) or {}
        local walk = anim.walkAnim
        if walk and walk.sprite then
            local img, err = imageFromDisk(ROOT .. walk.sprite)
            if not img then error(err) end
            img:setFilter("nearest", "nearest")
            local sheetW, sheetH = img:getDimensions()
            local n  = walk.frames or 1
            local fw = math.floor(sheetW / n)
            local fi = portraitFrame(n)

            -- Render the single frame, recoloured exactly as the game would.
            local canvas = love.graphics.newCanvas(fw, sheetH)
            love.graphics.setCanvas(canvas)
            love.graphics.clear(0, 0, 0, 0)
            love.graphics.setBlendMode("alpha")

            if e.hue then
                hueShader:send("hue", e.hue)
                love.graphics.setShader(hueShader)
            end
            if e.tint then
                love.graphics.setColor(e.tint[1], e.tint[2], e.tint[3], 1)
            else
                love.graphics.setColor(1, 1, 1, 1)
            end
            love.graphics.draw(img,
                love.graphics.newQuad(fi * fw, 0, fw, sheetH, sheetW, sheetH), 0, 0)
            love.graphics.setShader()
            love.graphics.setColor(1, 1, 1, 1)
            love.graphics.setCanvas()

            local data = canvas:newImageData()
            local bx, by, bw, bh = tightBounds(data)
            local trimmed = love.image.newImageData(bw, bh)
            trimmed:paste(data, 0, 0, bx, by, bw, bh)

            local fileData = trimmed:encode("png")
            local fh = assert(io.open(OUT .. key .. ".png", "wb"))
            fh:write(fileData:getString())
            fh:close()
            written = written + 1
            say(string.format("%-16s %3dx%-3d  frame %d/%d  %s%s",
                key, bw, bh, fi + 1, n,
                e.hue and string.format("hue %.2f", e.hue) or "",
                e.tint and "tint" or ""))
        else
            say("!! no walk sheet: " .. key)
        end
    end
    say(written .. " portraits written to " .. OUT)
end

function love.load()
    local ok, err = xpcall(build, debug.traceback)
    if not ok then say("ERROR:\n" .. tostring(err)) end
    LOG:close()
    love.event.quit()
end

function love.draw() end
