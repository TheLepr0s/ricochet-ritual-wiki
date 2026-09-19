#!/bin/sh
# Render the enemy portraits into docs/assets/img/.
#
#   tools/portraits.sh                          # game assumed beside this checkout
#   RR_GAME=C:/path/to/game_jam tools/portraits.sh
#
# Only needed when the game's sprites or its recolour values changed. The
# portraits are rendered through the game's own shader rather than copied --
# see portraits_main.lua for why that matters.
set -e

WIKI="$(cd "$(dirname "$0")/.." && pwd)"
export RR_WIKI="$WIKI"

LOVE="${LOVE:-}"
if [ -z "$LOVE" ]; then
    for c in "/c/Program Files/LOVE/lovec.exe" "/c/Program Files/LOVE/love.exe" lovec love; do
        if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then LOVE="$c"; break; fi
    done
fi
[ -n "$LOVE" ] || { echo "portraits: no LOVE found - set LOVE=/path/to/lovec.exe" >&2; exit 1; }

STAGE="$WIKI/tools/.stage-portraits"
trap 'rm -rf "$STAGE"' EXIT INT TERM

rm -rf "$STAGE"
mkdir -p "$STAGE"
cp "$WIKI/tools/portraits_main.lua" "$STAGE/main.lua"
cp "$WIKI/tools/harness_conf.lua"   "$STAGE/conf.lua"

"$LOVE" "$STAGE"

echo "wrote docs/assets/img/*.png"
