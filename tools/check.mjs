// tools/check.mjs
//
// Validate the generated site before it is published.
//
//   node tools/check.mjs
//
// A wiki fails quietly: a link to a card that was renamed still LOOKS like a
// link, and a search result that lands on a missing anchor just scrolls to the
// top. Nobody reports either. So every cross reference on every page is
// resolved here against the pages that were actually written.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as C from "./content.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DOCS = join(HERE, "..", "docs");

let errors = 0;
let warnings = 0;
const fail = (m) => { console.error("  FAIL  " + m); errors++; };
const warn = (m) => { console.warn("  warn  " + m); warnings++; };
const ok = (m) => console.log("  ok    " + m);

/* ── Load ────────────────────────────────────────────────────────────── */
const pages = readdirSync(DOCS).filter((f) => f.endsWith(".html"));
if (!pages.length) { fail("no pages in docs/"); process.exit(1); }

const html = {};
const ids = {};
for (const p of pages) {
  html[p] = readFileSync(join(DOCS, p), "utf8");
  ids[p] = new Set([...html[p].matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
}
ok(`${pages.length} pages loaded`);

/* ── Internal links ──────────────────────────────────────────────────── */
let linkCount = 0;
for (const p of pages) {
  for (const m of html[p].matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|data:|#$)/.test(href)) continue;
    if (href.startsWith("assets/")) continue;   // covered by the asset pass below
    linkCount++;
    const [file, anchor] = href.split("#");
    const target = file || p;
    if (!pages.includes(target)) {
      fail(`${p} → ${href} (no such page)`);
      continue;
    }
    if (anchor && !ids[target].has(anchor)) {
      fail(`${p} → ${href} (no such anchor on ${target})`);
    }
  }
}
ok(`${linkCount} internal links resolve`);

/* ── Assets ──────────────────────────────────────────────────────────── */
let assetCount = 0;
for (const p of pages) {
  for (const m of html[p].matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) {
    assetCount++;
    const f = join(DOCS, m[1]);
    if (!existsSync(f)) fail(`${p} → ${m[1]} (missing file)`);
    else if (statSync(f).size === 0) fail(`${p} → ${m[1]} (empty file)`);
  }
}
ok(`${assetCount} asset references resolve`);

/* ── Search index ────────────────────────────────────────────────────── */
const searchSrc = readFileSync(join(DOCS, "assets", "search.js"), "utf8");
const INDEX = JSON.parse(searchSrc.replace(/^[\s\S]*?window\.SEARCH_INDEX=/, "").replace(/;\s*$/, ""));
let bad = 0;
const seen = new Set();
for (const e of INDEX) {
  const [file, anchor] = e.u.split("#");
  if (!pages.includes(file)) { fail(`search "${e.n}" → ${e.u} (no such page)`); bad++; continue; }
  if (!ids[file].has(anchor)) { fail(`search "${e.n}" → ${e.u} (no such anchor)`); bad++; continue; }
  // A duplicate key means two things answer to the same name, and search will
  // silently show whichever sorted first.
  const key = e.n + "|" + e.s;
  if (seen.has(key)) warn(`search: duplicate entry "${e.n}" in ${e.s}`);
  seen.add(key);
  if (!e.h || !e.h.includes(e.n.toLowerCase())) warn(`search: "${e.n}" has a haystack that omits its own name`);
}
if (!bad) ok(`${INDEX.length} search entries resolve`);

/* ── Coverage: everything in the data has a page ─────────────────────── */
const D = JSON.parse(readFileSync(join(HERE, "data.json"), "utf8"));
const indexedNames = new Set(INDEX.map((e) => e.n));
const cover = (list, label, nameOf) => {
  const miss = list.filter((x) => !indexedNames.has(nameOf(x))).map(nameOf);
  if (miss.length) fail(`${label}: ${miss.length} not searchable — ${miss.slice(0, 6).join(", ")}`);
  else ok(`${label}: all ${list.length} searchable`);
};
cover(D.upgrades, "cards", (u) => u.n);
cover(D.achievements, "achievements", (a) => a.n);
cover(D.abilities, "abilities", (a) => a.n);
cover(D.archetypes, "classes", (a) => a.n);
cover(D.compositions, "designed waves", (c) => c.n);
cover(D.modifiers, "modifiers", (m) => m.n);
cover(D.enemies, "enemies", (e) => e.x.boss_name || e.k);

// Every enemy is driven by a known AI class, and that class has a behaviour
// row. A type the dumper could not resolve used to publish with a "—" badge
// and no behaviour at all, and nothing here noticed.
{
  const noAi = D.enemies.filter((e) => !e.ai).map((e) => e.k);
  const bestiary = html["bestiary.html"] || "";
  const noRow = [...new Set(D.enemies.map((e) => e.ai).filter(Boolean))]
    .filter((a) => !bestiary.includes(`<span class="r-key">${a}</span>`));
  if (noAi.length) fail(`enemies with no AI class: ${noAi.join(", ")}`);
  if (noRow.length) fail(`AI classes with no behaviour row: ${noRow.join(", ")}`);
  if (!noAi.length && !noRow.length) ok(`every enemy has an AI class with a behaviour row`);
}

// A note keyed by a card or enemy that has since been renamed renders nowhere
// and says nothing about it.
{
  const cards = new Set(D.upgrades.map((u) => u.k));
  const enemies = new Set(D.enemies.map((e) => e.k));
  const stale = [
    ...Object.keys(C.CARD_NOTE || {}).filter((k) => !cards.has(k)).map((k) => `CARD_NOTE.${k}`),
    ...Object.keys(C.ENEMY_NOTE || {}).filter((k) => !enemies.has(k)).map((k) => `ENEMY_NOTE.${k}`),
    ...Object.keys(C.ENEMY_EXTRA || {}).filter((k) => !enemies.has(k)).map((k) => `ENEMY_EXTRA.${k}`),
  ];
  if (stale.length) fail(`notes for things that do not exist: ${stale.join(", ")}`);
  else ok(`every hand-written note names a real card or enemy`);
}

/* ── Portraits ───────────────────────────────────────────────────────── */
const imgDir = join(DOCS, "assets", "img");
const imgs = existsSync(imgDir) ? readdirSync(imgDir) : [];
const missingArt = D.enemies.filter((e) => !imgs.includes(e.k + ".png")).map((e) => e.k);
if (missingArt.length) fail(`portraits missing: ${missingArt.join(", ")}`);
else ok(`${D.enemies.length} portraits present`);

/* ── Structural sanity ───────────────────────────────────────────────── */
for (const p of pages) {
  const h = html[p];
  if (!/<title>[^<]+<\/title>/.test(h)) fail(`${p}: no <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(h)) fail(`${p}: no description`);
  const opens = (h.match(/<div\b/g) || []).length;
  const closes = (h.match(/<\/div>/g) || []).length;
  if (opens !== closes) fail(`${p}: ${opens} <div> vs ${closes} </div>`);
  // An unsubstituted template hole is the failure mode of a string-built page.
  if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(h)) {
    const m = h.match(/.{0,60}(undefined|NaN|\[object Object\]).{0,60}/);
    fail(`${p}: unsubstituted value — …${m[0].replace(/\s+/g, " ")}…`);
  }
  if (!/aria-current="page"/.test(h)) warn(`${p}: not marked current in its own nav`);
}
ok("structure");

/* ── .nojekyll ───────────────────────────────────────────────────────── */
if (!existsSync(join(DOCS, ".nojekyll"))) {
  fail(".nojekyll missing — GitHub Pages would run Jekyll over this");
} else ok(".nojekyll present");

/* ── Weight ──────────────────────────────────────────────────────────── */
const total = pages.reduce((n, p) => n + statSync(join(DOCS, p)).size, 0);
const imgBytes = imgs.reduce((n, f) => n + statSync(join(imgDir, f)).size, 0);
ok(`${(total / 1024).toFixed(0)} KB of HTML, ${(imgBytes / 1024).toFixed(0)} KB of portraits`);

console.log(
  errors ? `\n${errors} FAILED${warnings ? `, ${warnings} warnings` : ""}` : `\nall checks pass${warnings ? ` (${warnings} warnings)` : ""}`
);
process.exit(errors ? 1 : 0);
