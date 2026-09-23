-- tools/dump_main.lua
--
-- Dump every definition table in the game as JSON, so the wiki under docs/ is
-- GENERATED from the game's source rather than transcribed from it.
--
--   tools/dump.sh          (see README.md)
--
-- ── Why upvalues ─────────────────────────────────────────────────────────────
-- Most of the numbers a reader actually wants -- which wave an enemy unlocks
-- on, its spawn weight, a card's stack cap, what a card requires -- are FILE
-- LOCALS in their module. They are not on the module table, so a naive dumper
-- cannot see them, and the previous reference page carried them as a
-- hand-typed copy with a footnote admitting it. Three of them had already
-- drifted.
--
-- In Lua 5.1 a file-scope local referenced by a function becomes that
-- function's upvalue, and debug.getupvalue can read it by name. Scanning every
-- function on a module table therefore recovers the union of every file local
-- any exported function touches -- which is exactly the set that governs
-- behaviour. Nothing in the game is modified, and a renamed local turns into a
-- missing key at build time rather than a page that quietly lies.

io.stdout:setvbuf("no")

local BS = string.char(92)          -- a backslash, built rather than written

-- Where the game and this checkout are. See tools/paths.lua.
--
-- The harness copies this file elsewhere to run it, so it cannot reach its own
-- siblings relatively. paths.lua is loaded by absolute path, and where THAT is
-- comes from RR_WIKI or the default beside it.
local WIKI_HINT = (os.getenv("RR_WIKI") or "C:/Users/user/Desktop/ricochet-ritual-wiki")
    :gsub(BS, "/"):gsub("/+$", "")
local PATHS = dofile(WIKI_HINT .. "/tools/paths.lua")

-- Fail here, with the fix, rather than forty lines into a require chain.
local pathsOk, pathsWhy = PATHS.check()
if not pathsOk then
    print("paths:\n  " .. pathsWhy)
    os.exit(1)
end

local ROOT = PATHS.game
local OUT  = PATHS.wiki .. "tools/data.json"

local LOG = io.open(PATHS.wiki .. "tools/dump.log", "wb")
local function say(s)
    LOG:write(tostring(s) .. "\n")
    LOG:flush()
    print(s)
end

-- ── require shim: load the game's modules by absolute path ───────────────────
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
    cache[name] = true                    -- break require cycles
    local ok, res = pcall(chunk, name)
    if not ok then
        say("!! require failed: " .. name .. " -- " .. tostring(res))
        return true
    end
    if res == nil then res = true end
    cache[name] = res
    return res
end

-- ── Minimal ordered-JSON writer ──────────────────────────────────────────────
local function esc(s)
    s = s:gsub("[" .. BS .. BS .. '"]', BS .. "%0")
    s = s:gsub("\n", BS .. "n"):gsub("\r", BS .. "r"):gsub("\t", BS .. "t")
    return s
end

local function encNum(v)
    if v ~= v or v == math.huge or v == -math.huge then return "null" end
    if v == math.floor(v) and math.abs(v) < 1e14 then return string.format("%d", v) end
    return string.format("%.6g", v)
end

local enc
enc = function(v)
    local t = type(v)
    if v == nil then return "null"
    elseif t == "boolean" then return tostring(v)
    elseif t == "number" then return encNum(v)
    elseif t == "string" then return '"' .. esc(v) .. '"'
    elseif t == "table" then
        if v.__arr then
            local parts = {}
            for i = 1, #v do parts[#parts + 1] = enc(v[i]) end
            return "[" .. table.concat(parts, ",") .. "]"
        end
        local parts = {}
        for _, k in ipairs(v.__keys or {}) do
            parts[#parts + 1] = '"' .. esc(k) .. '":' .. enc(v[k])
        end
        return "{" .. table.concat(parts, ",") .. "}"
    end
    return "null"
end

local function obj(...)
    local a = { ... }
    local n = select("#", ...)
    local o = { __keys = {} }
    for i = 1, n, 2 do
        local k, val = a[i], a[i + 1]
        o.__keys[#o.__keys + 1] = k
        o[k] = val
    end
    return o
end
local function put(o, k, v)
    o.__keys[#o.__keys + 1] = k
    o[k] = v
end
local function arr(t) t.__arr = true; return t end

-- Sorted keys of a plain table, so the JSON is stable across runs and a diff
-- of data.json is a diff of the GAME rather than of hash order.
local function sortedKeys(t)
    local ks = {}
    for k in pairs(t or {}) do
        if type(k) == "string" then ks[#ks + 1] = k end
    end
    table.sort(ks)
    return ks
end

-- A flat { key = scalar } table, in key order.
local function scalarMap(t)
    local o = obj()
    for _, k in ipairs(sortedKeys(t)) do
        local v = t[k]
        local ty = type(v)
        if ty == "number" or ty == "string" or ty == "boolean" then put(o, k, v) end
    end
    return o
end

-- ── Upvalue recovery ─────────────────────────────────────────────────────────
-- Direct functions only, deliberately: recursing into an upvalue that happens
-- to be a function would walk into whatever module it came from and start
-- reporting another file's locals under this file's name.
local function fileLocals(mod)
    local found, order = {}, {}
    local function scan(fn)
        local i = 1
        while true do
            local ok, name, val = pcall(debug.getupvalue, fn, i)
            if not ok or not name then break end
            if found[name] == nil and name ~= "_ENV" then
                found[name] = val
                order[#order + 1] = name
            end
            i = i + 1
        end
    end
    if type(mod) == "table" then
        for _, v in pairs(mod) do
            if type(v) == "function" then scan(v) end
        end
        local mt = getmetatable(mod)
        if mt and type(mt.__index) == "table" then
            for _, v in pairs(mt.__index) do
                if type(v) == "function" then scan(v) end
            end
        end
    elseif type(mod) == "function" then
        scan(mod)
    end
    return found
end

-- Pull a named local, loudly. A rename upstream should break the BUILD, not
-- silently blank a column in the published page.
local REQUIRED_MISSING = {}
local function need(locals, name, what)
    local v = locals[name]
    if v == nil then
        REQUIRED_MISSING[#REQUIRED_MISSING + 1] = (what or "?") .. "." .. name
        say("!! missing local: " .. (what or "?") .. "." .. name)
    end
    return v
end

-- ── Build ────────────────────────────────────────────────────────────────────
local function build()
    local UPGRADETP      = require("ENUMS/UPGRADETP")
    local UpgradeList    = require("Utilities/systems/UpgradeList")
    local UpgradeManager = require("Utilities/systems/UpgradeManager")
    local Achievements   = require("Utilities/systems/Achievements")
    local Utility        = require("Utilities/systems/UtilityAbility")
    local WaveModifier   = require("Utilities/systems/WaveModifier")
    local WaveComposition= require("Utilities/systems/WaveComposition")
    local WaveManager    = require("Utilities/systems/WaveManager")
    local Archetype      = require("Utilities/systems/Archetype")
    local Difficulty     = require("Utilities/systems/Difficulty")
    local Pickup         = require("Objects/Pickups/Pickup")
    require("Objects/Entities/Enemies/EnemyTypes")

    local TPNAME = {}
    for k, v in pairs(UPGRADETP) do TPNAME[v] = k end

    local umLocals = fileLocals(UpgradeManager)
    local wmLocals = fileLocals(WaveManager)
    local pkLocals = fileLocals(Pickup)
    local wcLocals = fileLocals(WaveComposition)

    -- ── Upgrade cards ────────────────────────────────────────────────────────
    local STACK_CAPS = need(umLocals, "STACK_CAPS", "UpgradeManager") or {}
    local REQUIRES   = need(umLocals, "REQUIRES",   "UpgradeManager") or {}
    local CONFLICTS  = need(umLocals, "CONFLICTS",  "UpgradeManager") or {}
    local RARITY_W   = need(umLocals, "RARITY_WEIGHT", "UpgradeManager") or {}

    -- CONFLICTS is a list of mutually-exclusive GROUPS. Flatten it to
    -- "card -> everything it locks out" so a row can state its own exclusions.
    local conflictOf = {}
    for _, group in ipairs(CONFLICTS) do
        for _, a in ipairs(group) do
            for _, b in ipairs(group) do
                if a ~= b then
                    conflictOf[a] = conflictOf[a] or {}
                    conflictOf[a][#conflictOf[a] + 1] = b
                end
            end
        end
    end

    local ups = arr({})
    for _, k in ipairs(sortedKeys(UpgradeList)) do
        local u = UpgradeList[k]
        if type(u) == "table" and u.name then
            local row = obj(
                "k", k, "n", u.name, "r", u.rarity,
                "t", TPNAME[u.type] or tostring(u.type),
                "v", (type(u.variable) == "string") and u.variable or nil,
                "val", (type(u.value) == "number") and u.value or nil,
                "s", u.stackable and true or false,
                "cap", STACK_CAPS[k],
                "req", REQUIRES[k],
                "d", u.description)
            if conflictOf[k] then
                local c = arr({})
                table.sort(conflictOf[k])
                for _, x in ipairs(conflictOf[k]) do c[#c + 1] = x end
                put(row, "con", c)
            end
            ups[#ups + 1] = row
        end
    end

    -- ── Achievements ─────────────────────────────────────────────────────────
    local achs = arr({})
    for _, a in ipairs(Achievements.DEFS) do
        achs[#achs + 1] = obj("id", a.id, "n", a.name, "d", a.desc,
            "stat", a.stat, "scope", a.scope, "t", a.target,
            "md", a.minDiff, "h", a.hidden and true or false)
    end

    -- ── Utility abilities ────────────────────────────────────────────────────
    local abis = arr({})
    for _, a in ipairs(Utility.DEFS) do
        abis[#abis + 1] = obj("id", a.id, "n", a.name,
            "cd", a.cooldown, "dur", a.duration, "d", a.desc or a.description)
    end

    -- ── Wave modifiers ───────────────────────────────────────────────────────
    local SKIP_MOD = { id = true, name = true, desc = true, color = true, colour = true }
    local mods = arr({})
    for _, m in ipairs(WaveModifier.DEFS) do
        local f = obj()
        local fkeys = {}
        for fk, val in pairs(m) do
            if not SKIP_MOD[fk] and type(val) ~= "table" and type(val) ~= "function" then
                fkeys[#fkeys + 1] = fk
            end
        end
        table.sort(fkeys)
        for _, fk in ipairs(fkeys) do put(f, fk, m[fk]) end
        mods[#mods + 1] = obj("id", m.id, "n", m.name, "d", m.desc, "f", f)
    end

    -- ── Enemies ──────────────────────────────────────────────────────────────
    local UNLOCK_WAVE   = need(wmLocals, "UNLOCK_WAVE",    "WaveManager") or {}
    local SPAWN_WEIGHTS = need(wmLocals, "SPAWN_WEIGHTS",  "WaveManager") or {}
    local CONC_CAP      = need(wmLocals, "CONCURRENT_CAP", "WaveManager") or {}
    local ENEMY_CLASS   = need(wmLocals, "ENEMY_CLASS",    "WaveManager") or {}
    local BOSS_ROTATION = need(wmLocals, "BOSS_ROTATION",  "WaveManager") or {}

    -- ENEMY_CLASS maps a type to a CONSTRUCTOR CLOSURE, not to the AI module --
    -- `function(x, y) return MeleeEnemy.new(x, y, "Mushroom") end`. The module
    -- is that closure's only upvalue, so reading the upvalue and matching it by
    -- identity against a re-require of each AI file recovers the class name.
    -- Which AI drives a type is otherwise unknowable from the data, and it is
    -- the single most useful fact about an enemy.
    --
    -- A type whose module is not in this list dumps with ai = nil and the page
    -- shows it with no behaviour at all -- which is what happened to the
    -- Blightspore and the Siphon for a day. So an unresolved constructor is
    -- recorded as MISSING below and fails the dump, the same as a renamed local.
    local AI_FILES = {
        "MeleeEnemy", "RangedEnemy", "BomberEnemy", "VampireEnemy", "CasterEnemy",
        "ChargerEnemy", "SplitterEnemy", "ShieldEnemy", "SupportEnemy",
        "EvilWizardEnemy", "BossEnemy", "RevenantBoss", "BlightsporeEnemy",
        "SiphonEnemy", "BaseEnemy",
    }
    local aiName = {}
    for _, f in ipairs(AI_FILES) do
        local mod = require("Objects/Entities/Enemies/" .. f)
        if type(mod) == "table" then aiName[mod] = f end
    end
    local function aiOf(ctor)
        if type(ctor) ~= "function" then return nil end
        local i = 1
        while true do
            local ok, _, val = pcall(debug.getupvalue, ctor, i)
            if not ok or val == nil and i > 8 then break end
            if aiName[val] then return aiName[val] end
            i = i + 1
            if i > 8 then break end
        end
        return nil
    end

    -- SPAWN_WEIGHTS[name] is a five-column ramp, one weight per wave, with the
    -- column index clamped at 5 -- so column 5 is the weight a type carries for
    -- the rest of the run and the one worth printing as "how common is this".
    local function lateWeight(ws)
        if type(ws) ~= "table" then return nil end
        return ws[5]
    end
    local function weightRamp(ws)
        if type(ws) ~= "table" then return nil end
        local a = arr({})
        for i = 1, 5 do a[#a + 1] = ws[i] or 0 end
        return a
    end

    local KNOWN = { animations = true, hitbox = true, glow = true, health = true,
                    speed = true, damage = true, attackRange = true, scale = true,
                    hue = true, tint = true, projectile = true,
                    explosion_radius = true, explosion_damage = true }
    local ens = arr({})
    for _, k in ipairs(sortedKeys(EnemyTypes)) do
        local e = EnemyTypes[k]
        local hb = e.hitbox or {}
        local ai = aiOf(ENEMY_CLASS[k])
        if ENEMY_CLASS[k] and not ai then
            REQUIRED_MISSING[#REQUIRED_MISSING + 1] = "AI module for " .. k .. " (add it to AI_FILES)"
            say("!! unresolved AI module for " .. k)
        end
        local row = obj(
            "k", k,
            "hp", e.health, "spd", e.speed, "dmg", e.damage,
            "range", e.attackRange,
            "rx", hb.rx, "ry", hb.ry,
            "scale", e.scale or 1,
            "hue", e.hue,
            "glow", e.glow and true or false,
            "proj", e.projectile,
            "br", e.explosion_radius, "bd", e.explosion_damage,
            -- Straight off WaveManager's own tables rather than retyped.
            "ai", ai,
            "unlock", UNLOCK_WAVE[k],
            "weight", lateWeight(SPAWN_WEIGHTS[k]),
            "ramp", weightRamp(SPAWN_WEIGHTS[k]),
            "cap", CONC_CAP[k])
        if e.tint then
            put(row, "tint", arr({ e.tint[1], e.tint[2], e.tint[3] }))
        end
        -- The sheet a type draws from. A recoloured variant points at the
        -- original's art, which is the fact the bestiary needs to explain why
        -- two rows share a silhouette.
        local anim = (e.animations and e.animations[1]) or {}
        local walk = anim.walkAnim or {}
        if walk.sprite then
            put(row, "sheet", walk.sprite)
            put(row, "frames", walk.frames)
        end
        local xk = {}
        for fk, val in pairs(e) do
            if not KNOWN[fk] and type(val) ~= "table" and type(val) ~= "function" then
                xk[#xk + 1] = fk
            end
        end
        table.sort(xk)
        local extra = obj()
        for _, fk in ipairs(xk) do put(extra, fk, e[fk]) end
        put(row, "x", extra)
        ens[#ens + 1] = row
    end

    -- ── Archetypes ───────────────────────────────────────────────────────────
    local arcs = arr({})
    for i = 1, Archetype:count() do
        local a = Archetype:get(i)
        local bias = arr({})
        for _, k in ipairs(sortedKeys(a.bias)) do
            bias[#bias + 1] = obj("k", k, "w", a.bias[k])
        end
        local grants = arr({})
        for _, g in ipairs(a.grant or {}) do grants[#grants + 1] = g end
        local col = a.color or {}
        arcs[#arcs + 1] = obj("id", a.id, "n", a.label, "d", a.blurb,
                              "tag", a.tag, "grant", grants, "bias", bias,
                              "col", arr({ col[1] or 1, col[2] or 1, col[3] or 1 }))
    end

    -- ── Designed waves ───────────────────────────────────────────────────────
    local comps = arr({})
    for _, c in ipairs(WaveComposition.DEFS) do
        local pool = arr({})
        for _, k in ipairs(sortedKeys(c.pool)) do
            pool[#pool + 1] = obj("k", k, "w", c.pool[k])
        end
        comps[#comps + 1] = obj("id", c.id, "n", c.name, "d", c.desc,
                                "minWave", c.minWave, "pool", pool,
                                "countMult", c.countMult,
                                "maxAliveMult", c.maxAliveMult,
                                "scoreMult", c.scoreMult)
    end

    -- ── Difficulty ───────────────────────────────────────────────────────────
    local diffs = arr({})
    for _, p in ipairs(Difficulty.PRESETS) do
        local row = obj("id", p.id, "n", p.label, "d", p.blurb, "tag", p.tag)
        for _, fk in ipairs({ "healthMult", "damageMult", "speedMult", "rampMult",
                              "spawnIntervalMult", "maxAliveMult",
                              "healFrac", "healFlat", "rerolls", "banishes" }) do
            put(row, fk, p[fk])
        end
        diffs[#diffs + 1] = row
    end

    -- ── Loose constants, each read from the module that owns it ──────────────
    local consts = obj()
    put(consts, "bossRotation", (function()
        local a = arr({})
        for _, b in ipairs(BOSS_ROTATION) do a[#a + 1] = b end
        return a
    end)())
    put(consts, "upgrade", scalarMap({
        UTILITY_EVERY      = need(umLocals, "UTILITY_EVERY",      "UpgradeManager"),
        REROLL_EVERY_WAVES = need(umLocals, "REROLL_EVERY_WAVES", "UpgradeManager"),
        BANISH_EVERY_WAVES = need(umLocals, "BANISH_EVERY_WAVES", "UpgradeManager"),
        REROLL_CAP         = need(umLocals, "REROLL_CAP",         "UpgradeManager"),
        BANISH_CAP         = need(umLocals, "BANISH_CAP",         "UpgradeManager"),
    }))
    put(consts, "rarityWeight", scalarMap(RARITY_W))
    put(consts, "pickup", scalarMap({
        LIFETIME     = need(pkLocals, "LIFETIME",     "Pickup"),
        BLINK_AT     = need(pkLocals, "BLINK_AT",     "Pickup"),
        MAGNET_RANGE = need(pkLocals, "MAGNET_RANGE", "Pickup"),
        MAGNET_SPEED = need(pkLocals, "MAGNET_SPEED", "Pickup"),
        PICKUP_RANGE = need(pkLocals, "PICKUP_RANGE", "Pickup"),
        MAX_ACTIVE   = need(pkLocals, "MAX_ACTIVE",   "Pickup"),
    }))
    put(consts, "composition", scalarMap({
        FIRST_WAVE = need(wcLocals, "FIRST_WAVE", "WaveComposition"),
        CHANCE     = need(wcLocals, "CHANCE",     "WaveComposition"),
    }))


    -- ── Out ──────────────────────────────────────────────────────────────────
    local root = obj("upgrades", ups, "achievements", achs,
                     "abilities", abis, "modifiers", mods, "enemies", ens,
                     "archetypes", arcs, "compositions", comps,
                     "difficulties", diffs, "consts", consts)

    local fh = assert(io.open(OUT, "wb"))
    fh:write(enc(root))
    fh:close()
    say(string.format("wrote %s", OUT))
    say(string.format("%d upgrades, %d achievements, %d abilities, %d modifiers, " ..
        "%d enemies, %d classes, %d compositions, %d difficulties",
        #ups, #achs, #abis, #mods, #ens, #arcs, #comps, #diffs))
    if #REQUIRED_MISSING > 0 then
        say("MISSING " .. #REQUIRED_MISSING .. ": " .. table.concat(REQUIRED_MISSING, ", "))
    end
end

function love.load()
    local ok, err = xpcall(build, debug.traceback)
    if not ok then say("ERROR:\n" .. tostring(err)) end
    LOG:close()
    love.event.quit(#REQUIRED_MISSING > 0 and 1 or 0)
end

function love.draw() end
