-- tools/paths.lua
--
-- Where the game is, and where this wiki is.
--
-- These used to be one hardcoded absolute path, which was fine while the
-- generator lived inside the game's own repository. It does not any more: the
-- game is private and this repository is public, so they are separate
-- checkouts and the generator has to be told where the game is rather than
-- assuming it is overhead.
--
-- Resolution order:
--   1. RR_GAME  environment variable -- an absolute path to the game checkout
--   2. RR_WIKI  environment variable -- an absolute path to THIS checkout
--   3. the defaults below, which assume the two sit side by side
--
-- Nothing here guesses silently. If the game is not where it is looked for,
-- the caller says so and stops, because a dump that half-works produces a wiki
-- that is confidently wrong about the half it could not read.

local M = {}

-- Normalise to forward slashes with a trailing one, so concatenation is safe
-- however the value arrived (a shell, a Windows env var, a default).
local function norm(p)
    if not p or p == "" then return nil end
    p = p:gsub("\\", "/")
    if p:sub(-1) ~= "/" then p = p .. "/" end
    return p
end

-- Side-by-side defaults. `<parent>/game_jam` and `<parent>/ricochet-ritual-wiki`.
local DEFAULT_WIKI = "C:/Users/user/Desktop/ricochet-ritual-wiki/"
local DEFAULT_GAME = "C:/Users/user/Desktop/game_jam/"

M.wiki = norm(os.getenv("RR_WIKI")) or DEFAULT_WIKI
M.game = norm(os.getenv("RR_GAME")) or DEFAULT_GAME

-- A file that must exist for the path to be the thing it claims to be.
local function exists(p)
    local fh = io.open(p, "rb")
    if fh then fh:close() return true end
    return false
end

-- Check before doing any work, and fail with the fix rather than with a
-- stack trace forty lines into a require chain.
function M.check()
    local problems = {}
    if not exists(M.game .. "main.lua") then
        problems[#problems + 1] = string.format(
            "no game at %s (looked for main.lua)\n" ..
            "    set RR_GAME to the game checkout, e.g.\n" ..
            "      RR_GAME=/path/to/game_jam", M.game)
    end
    if not exists(M.wiki .. "tools/build.mjs") then
        problems[#problems + 1] = string.format(
            "no wiki at %s (looked for tools/build.mjs)\n" ..
            "    set RR_WIKI to this checkout", M.wiki)
    end
    if #problems > 0 then
        return false, table.concat(problems, "\n  ")
    end
    return true
end

return M
