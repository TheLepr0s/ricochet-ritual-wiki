# Ricochet Ritual — wiki

**→ [thelepr0s.github.io/ricochet-ritual-wiki](https://thelepr0s.github.io/ricochet-ritual-wiki/)**

A wave-survival game about one orb, thrown and recalled. This repository is the published
reference for it: every enemy, all 104 upgrade cards, the twelve utility abilities, the four
starting classes, wave modifiers, designed waves and all 120 achievements including the hidden
ones.

## This repository is build output

Nothing here is written by hand, and **an edit made here will be overwritten** by the next
publish. The generator lives with the game, in a separate private repository, because it needs
the game's own source to read from:

| | |
| --- | --- |
| `Tools/wiki/dump_main.lua` | runs under LÖVE, loads the game's modules, writes every definition table to JSON |
| `Tools/wiki/portraits_main.lua` | renders each enemy portrait through the game's own recolour shader |
| `Tools/wiki/content.mjs` | the prose — behaviour, boss write-ups, glossary |
| `Tools/wiki/build.mjs` | renders the pages |
| `Tools/wiki/check.mjs` | resolves every cross-reference and asserts coverage |
| `Tools/wiki/runtime.mjs` | executes the page script against the real pages in a DOM stub |
| `Tools/wiki/publish.mjs` | copies the result here and pushes |

Every number on these pages is dumped out of the game rather than transcribed. That includes the
ones that are *file locals* in their module — unlock waves, spawn weights, stack caps,
prerequisites — which are recovered through `debug.getupvalue` rather than retyped. An earlier
version of this reference kept them by hand and three had already gone stale.

Portraits are rendered rather than copied, too: eleven of the eighteen enemies share art with
another one, and what tells them apart in play is a recolour applied at draw time. Copying the
sprite files would have produced a bestiary in which a third of the roster is the same picture
repeated.

## Hosting

GitHub Pages, from the default branch root. `.nojekyll` is committed because Pages otherwise runs
Jekyll over the site, which skips files beginning with an underscore and can rewrite things it
mistakes for templates.

There is no build step here and no dependencies — it is plain HTML, one stylesheet, two scripts
and eighteen PNGs, about 400 KB in total.
