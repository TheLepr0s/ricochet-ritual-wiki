#!/bin/sh
# Dump the game's definition tables to tools/data.json.
#
#   tools/dump.sh                          # game assumed beside this checkout
#   RR_GAME=C:/path/to/game_jam tools/dump.sh
#
# LOVE runs a FOLDER containing main.lua, so the entry point has to be copied
# into a staging folder under that name. That is all this script does, plus
# supplying a conf.lua that does not open a fullscreen window over the desktop.
set -e

WIKI="$(cd "$(dirname "$0")/.." && pwd)"
export RR_WIKI="$WIKI"

# love.exe on Windows detaches from the console and prints nothing; lovec.exe
# is the console build. Prefer whichever exists.
LOVE="${LOVE:-}"
if [ -z "$LOVE" ]; then
    for c in "/c/Program Files/LOVE/lovec.exe" "/c/Program Files/LOVE/love.exe" lovec love; do
        if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then LOVE="$c"; break; fi
    done
fi
[ -n "$LOVE" ] || { echo "dump: no LOVE found - set LOVE=/path/to/lovec.exe" >&2; exit 1; }

STAGE="$WIKI/tools/.stage-dump"

# set -e means a failing LOVE run would skip a cleanup line at the end, so the
# cleanup is a trap instead -- otherwise a bad run leaves a stray folder behind
# for the next one to trip over.
trap 'rm -rf "$STAGE"' EXIT INT TERM

rm -rf "$STAGE"
mkdir -p "$STAGE"
cp "$WIKI/tools/dump_main.lua"    "$STAGE/main.lua"
cp "$WIKI/tools/harness_conf.lua" "$STAGE/conf.lua"

"$LOVE" "$STAGE"

echo "wrote tools/data.json"
