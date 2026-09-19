# Ricochet Ritual — wiki

**→ [thelepr0s.github.io/ricochet-ritual-wiki](https://thelepr0s.github.io/ricochet-ritual-wiki/)**

A wave-survival game about one orb, thrown and recalled. This repository is the reference for it
and the generator that builds it: every enemy, all 104 upgrade cards, the twelve utility
abilities, the four starting classes, wave modifiers, designed waves and all 120 achievements
including the hidden ones.

```
docs/     the built site — GitHub Pages serves this. Generated; do not edit.
tools/    the generator. Edit this.
```

## Rebuilding

The game lives in a **separate, private** repository. The dumper reads it, so it has to be told
where it is — `RR_GAME`, or by default a checkout sitting beside this one.

```sh
tools/dump.sh          # 1. read the game's definition tables  -> tools/data.json
tools/portraits.sh     # 2. render the enemy portraits         -> docs/assets/img/
node tools/build.mjs   # 3. generate the pages                 -> docs/
node tools/check.mjs   #    links, anchors, coverage, assets
node tools/runtime.mjs #    search, filtering and the theme toggle actually work
git commit -am "Regenerate" && git push      # 4. Pages redeploys on push
```

Steps 1 and 2 need [LÖVE](https://love2d.org/) and the game; steps 3–5 need only Node and the
committed `tools/data.json`, which is why CI can rebuild and check this without the game being
available to it.

Step 2 is only needed when the game's sprites or recolour values changed.

| Want to change | Edit |
| --- | --- |
| A stat, cost, cooldown, weight, cap, prerequisite | **the game**, then re-dump |
| Prose — behaviour, notes, boss write-ups, glossary | `tools/content.mjs` |
| Layout, what appears on which page | `tools/build.mjs` |
| Styling | `tools/src/wiki.css` |
| Search / filtering behaviour | `tools/src/wiki.js` |

Nothing in `docs/` — the next build overwrites it, and CI fails if it does not match what the
generator produces.

## How it works

`tools/data.json` holds every number. `tools/content.mjs` holds every sentence. Nothing is in
both. **If a fact could have been derived and was typed instead, it is a bug waiting to drift** —
an earlier version of this reference kept the stack caps, unlock waves and spawn weights by hand,
and three had already gone stale by the time anyone looked.

### Getting at file-locals

Most of the numbers a reader actually wants are *file locals* in their module — `UNLOCK_WAVE` and
`SPAWN_WEIGHTS` in the wave manager, `STACK_CAPS` and `REQUIRES` in the upgrade manager. They are
not on the module table, so a naive dumper cannot see them.

In Lua 5.1 a file-scope local referenced by a function becomes that function's **upvalue**, and
`debug.getupvalue` reads it back by name. Scanning every function on a module table recovers the
union of every file local any exported function touches — exactly the set that governs behaviour.
Nothing in the game is modified to allow this, and a renamed local fails the dump rather than
quietly blanking a column.

`ENEMY_CLASS` needs one more step: it maps an enemy type to a *constructor closure*, not to an AI
module. The module is that closure's only upvalue. Which AI drives a type is otherwise unknowable
from the data, and it is the single most useful fact about an enemy.

### Portraits

Eleven of the eighteen enemies share art with another one — a Brute, a Toadstool and a Sporeling
are all the same mushroom sheet. What tells them apart in play is a recolour applied at draw time:
a hue rotation in YIQ, or a multiply tint for the sprites with no chroma to rotate.

So `tools/portraits_main.lua` renders each frame through *the same shader*, copied character for
character out of the game. Copying the sprite files would have produced a bestiary in which a
third of the roster is the same picture repeated.

### Checks

`check.mjs` resolves **every** cross reference on every page against the pages actually written.
A wiki fails quietly otherwise: a link to a card that was renamed still *looks* like a link, and a
search result landing on a missing anchor just scrolls to the top. Nobody reports either.

It also asserts coverage — every card, enemy, achievement, ability, class, modifier and designed
wave must appear in the search index — so content added to the game but not to a page is a build
failure rather than an omission.

`runtime.mjs` executes the page script against the real generated pages in a small DOM stub.
Markup validation cannot see a thrown exception on load, which leaves a page that looks perfect
and does nothing.

## Hosting

GitHub Pages, from `docs/` on the default branch. No build step at deploy time and no
dependencies — plain HTML, one stylesheet, two scripts and eighteen PNGs, about 400 KB.

`docs/.nojekyll` is committed because Pages otherwise runs Jekyll over the site, which skips files
beginning with an underscore and can rewrite things it mistakes for templates.

### Why this is not in the game's repository

It was, and could not be published from there. GitHub Pages is free on **public** repositories and
unavailable on private ones without Pro, Team or Enterprise on the owning account. The game's
repository is private, so a personal token and the Actions runner's own token were both refused
(`Resource not accessible by integration`) — not a missing scope, the feature simply is not there.

Splitting the wiki out is what makes hosting free, and it keeps the game's repository to the game.
