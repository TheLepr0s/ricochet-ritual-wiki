// tools/runtime.mjs
//
// Execute assets/wiki.js against the real generated pages, in a DOM stub.
//
//   node tools/runtime.mjs
//
// check.mjs validates the MARKUP; this validates the BEHAVIOUR. Search,
// filtering and the theme toggle are the parts a reader actually touches and
// the parts a broken-markup check cannot see: a thrown exception on load
// leaves a page that looks perfect and does nothing.
//
// The stub is deliberately tiny -- enough DOM for this one script, and no
// more. It parses ids, classes and data-* out of the generated HTML rather
// than pretending to be a browser, so anything it reports is about wiki.js.

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const HERE = dirname(fileURLToPath(import.meta.url));
const DOCS = join(HERE, "..", "docs");

let errors = 0;
const fail = (m) => { console.error("  FAIL  " + m); errors++; };
const ok = (m) => console.log("  ok    " + m);

/* ── A very small element ────────────────────────────────────────────── */
class El {
  constructor(tag = "div") {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.dataset = {};
    this.attrs = {};
    this.classList = { _s: new Set(), add(c) { this._s.add(c); }, contains(c) { return this._s.has(c); } };
    this.style = { setProperty() {}, cursor: "" };
    this._hidden = false;
    this._html = "";
    this._text = "";
    this._listeners = {};
    // A real <input> always has a string value. Leaving it undefined would make
    // the stub fail on `.trim()` and report a bug that does not exist.
    this.value = "";
  }
  get hidden() { return this._hidden; }
  set hidden(v) { this._hidden = !!v; }
  get innerHTML() { return this._html; }
  set innerHTML(v) {
    this._html = v;
    // wiki.js builds a result row as innerHTML then reaches back in with
    // querySelector, so the stub has to materialise the simple tags it writes.
    this.children = [];
    for (const m of String(v).matchAll(/<(\w+)\s*>/g)) this.children.push(new El(m[1]));
  }
  get textContent() { return this._text; }
  set textContent(v) { this._text = v; }
  get className() { return [...this.classList._s].join(" "); }
  set className(v) { this.classList._s = new Set(String(v).split(/\s+/).filter(Boolean)); }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  removeAttribute(k) { delete this.attrs[k]; }
  append(...n) { this.children.push(...n); }
  addEventListener(t, f) { (this._listeners[t] ||= []).push(f); }
  fire(t, ev = {}) { for (const f of this._listeners[t] || []) f({ preventDefault() {}, target: this, ...ev }); }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  querySelectorAll(sel) {
    const want = sel.replace(/^\./, "");
    const out = [];
    const walk = (n) => {
      for (const c of n.children) {
        if (sel.startsWith(".") ? c.classList.contains(want) : c.tagName === sel.toUpperCase()) out.push(c);
        walk(c);
      }
    };
    walk(this);
    return out;
  }
  closest() { return this; }
  scrollIntoView() {}
  focus() {}
  select() {}
  blur() {}
}

/* Parse the generated page into just enough of a tree for wiki.js. */
function parse(html) {
  const byId = new Map();
  const all = [];

  for (const m of html.matchAll(/<(\w+)([^>]*?)>/g)) {
    const [, tag, attrStr] = m;
    if (!/\b(id|data-hay|class)=/.test(attrStr)) continue;
    const el = new El(tag);
    for (const a of attrStr.matchAll(/([\w-]+)="([^"]*)"/g)) {
      const [, k, v] = a;
      if (k === "id") { el.id = v; byId.set(v, el); }
      else if (k === "class") el.className = v;
      else if (k.startsWith("data-")) {
        el.dataset[k.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase())] = v;
      } else el.setAttribute(k, v);
    }
    if (!el.id) el.id = "";
    all.push(el);
  }
  return { byId, all };
}

function makeDoc(html) {
  const { byId, all } = parse(html);
  const root = new El("html");
  root.children = all;
  const body = byId.get("__body") || new El("body");
  body.dataset.page = (html.match(/<body data-page="([^"]+)"/) || [, "?"])[1];

  const doc = {
    documentElement: {
      _a: {},
      setAttribute(k, v) { this._a[k] = v; },
      getAttribute(k) { return this._a[k] ?? null; },
      removeAttribute(k) { delete this._a[k]; },
    },
    body,
    getElementById: (id) => byId.get(id) || null,
    querySelector: (s) => root.querySelector(s),
    querySelectorAll: (s) => {
      if (s === "[data-hay]") return all.filter((e) => "hay" in e.dataset);
      if (s === "[data-anchor]") return all.filter((e) => "anchor" in e.dataset);
      if (s === ".group-label") return all.filter((e) => e.classList.contains("group-label"));
      return root.querySelectorAll(s);
    },
    addEventListener() {},
    createElement: (t) => new El(t),
  };
  return { doc, byId, all };
}

/* ── Run it ──────────────────────────────────────────────────────────── */
const script = readFileSync(join(DOCS, "assets", "wiki.js"), "utf8");
const searchSrc = readFileSync(join(DOCS, "assets", "search.js"), "utf8");
const pages = readdirSync(DOCS).filter((f) => f.endsWith(".html"));

const store = () => {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
};

for (const p of pages) {
  const html = readFileSync(join(DOCS, p), "utf8");
  const { doc, byId, all } = makeDoc(html);
  const win = {
    document: doc,
    localStorage: store(),
    sessionStorage: store(),
    location: { origin: "https://example.test", pathname: "/" + p, href: "" },
    history: { replaceState() {} },
    navigator: {},
    console,
  };
  win.window = win;

  try {
    runInNewContext(searchSrc + "\n" + script, win, { timeout: 5000 });
  } catch (e) {
    fail(`${p}: wiki.js threw on load — ${e.message}`);
    continue;
  }

  // The index has to be reachable from the page, not just present on disk.
  if (!Array.isArray(win.SEARCH_INDEX) || !win.SEARCH_INDEX.length) {
    fail(`${p}: SEARCH_INDEX did not load`);
    continue;
  }

  // Search: typing a name that exists must produce a result on every page,
  // since the index is global.
  const input = byId.get("site-search");
  const panel = byId.get("search-results");
  if (!input || !panel) { fail(`${p}: no search box`); continue; }
  input.value = "stoneskin";
  input.fire("input");
  if (panel.dataset.open !== "1") fail(`${p}: search for a known card returned nothing`);

  input.value = "zzzzqqq";
  input.fire("input");
  if (!/Nothing matches/.test(panel.innerHTML)) fail(`${p}: search for nonsense did not report empty`);

  // Filtering: a nonsense filter must hide every row and show the empty state;
  // clearing it must bring them all back.
  const filter = byId.get("page-filter");
  const rows = all.filter((e) => "hay" in e.dataset);
  if (filter && rows.length) {
    filter.value = "zzzzqqq";
    filter.fire("input");
    const visible = rows.filter((r) => !r.hidden).length;
    if (visible !== 0) fail(`${p}: filter left ${visible} rows visible`);
    const empty = byId.get("page-empty");
    if (empty && empty.hidden) fail(`${p}: empty state stayed hidden with nothing matching`);

    filter.value = "";
    filter.fire("input");
    const back = rows.filter((r) => !r.hidden).length;
    if (back !== rows.length) fail(`${p}: clearing the filter restored ${back}/${rows.length}`);

    // And a filter that SHOULD match has to match something.
    const sample = rows[0].dataset.hay.split(" ")[0];
    if (sample && sample.length > 2) {
      filter.value = sample;
      filter.fire("input");
      if (rows.filter((r) => !r.hidden).length === 0) {
        fail(`${p}: filtering on "${sample}" — taken from a row's own haystack — matched nothing`);
      }
      filter.value = "";
      filter.fire("input");
    }
  }

  // Theme toggle: three states, and the explicit ones must persist.
  const btn = byId.get("theme-btn");
  if (btn) {
    btn.fire("click");
    if (doc.documentElement.getAttribute("data-theme") !== "dark") fail(`${p}: theme did not go dark`);
    btn.fire("click");
    if (doc.documentElement.getAttribute("data-theme") !== "light") fail(`${p}: theme did not go light`);
    btn.fire("click");
    if (doc.documentElement.getAttribute("data-theme") !== null) fail(`${p}: theme did not return to auto`);
  } else fail(`${p}: no theme button`);

  ok(`${p} — ${rows.length} rows, search + filter + theme`);
}

console.log(errors ? `\n${errors} FAILED` : "\nruntime ok on every page");
process.exit(errors ? 1 : 0);
