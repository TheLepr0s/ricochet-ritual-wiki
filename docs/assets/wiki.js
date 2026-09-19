/* Ricochet Ritual wiki — shared behaviour.
   Generated site: see Tools/wiki/README.md. Edit this file, not docs/.

   Three things, all of which have to work with the page served from a plain
   static host and no build step at runtime:
     1. a cross-page search over an index baked in at build time,
     2. per-page filtering of the .row / .beast lists,
     3. the mobile nav and the theme toggle.

   Every localStorage access is wrapped, because it throws in a private window
   and the page has to render correctly without it. */

(function () {
  "use strict";

  /* ── Theme ───────────────────────────────────────────────────────────
     Default is the OS preference; the button cycles to an explicit choice and
     remembers it. Applied in a blocking inline script in <head> as well, so
     there is no flash of the wrong scheme before this file loads. */
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-btn");
  function setTheme(t) {
    if (t) root.setAttribute("data-theme", t);
    else root.removeAttribute("data-theme");
    try { t ? localStorage.setItem("rr-theme", t) : localStorage.removeItem("rr-theme"); } catch (e) {}
    if (themeBtn) themeBtn.textContent = t === "light" ? "☀" : t === "dark" ? "☾" : "◐";
  }
  if (themeBtn) {
    let cur = null;
    try { cur = localStorage.getItem("rr-theme"); } catch (e) {}
    setTheme(cur);
    themeBtn.addEventListener("click", () => {
      const now = root.getAttribute("data-theme");
      setTheme(now === "dark" ? "light" : now === "light" ? null : "dark");
    });
  }

  /* ── Mobile nav ──────────────────────────────────────────────────── */
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.dataset.open = sidebar.dataset.open === "1" ? "0" : "1";
    });
    sidebar.addEventListener("click", (e) => {
      if (e.target.closest("a")) sidebar.dataset.open = "0";
    });
  }

  /* ── Cross-page search ───────────────────────────────────────────────
     SEARCH_INDEX is written by the generator into assets/search.js: one entry
     per documented thing, with the page and anchor it lives at. It is the only
     reason this is a wiki rather than nine unrelated pages — a reader who knows
     the name of a card should not have to know which page it is filed under. */
  const input = document.getElementById("site-search");
  const panel = document.getElementById("search-results");
  const INDEX = window.SEARCH_INDEX || [];

  function score(entry, q) {
    const n = entry.n.toLowerCase();
    if (n === q) return 0;
    if (n.startsWith(q)) return 1;
    if (n.includes(q)) return 2;
    if ((entry.k || "").toLowerCase().includes(q)) return 3;
    if (entry.h.includes(q)) return 4;
    return 99;
  }

  function search(q) {
    q = q.trim().toLowerCase();
    if (q.length < 2) return [];
    const hits = [];
    for (const e of INDEX) {
      const s = score(e, q);
      if (s < 99) hits.push([s, e]);
    }
    hits.sort((a, b) => a[0] - b[0] || a[1].n.length - b[1].n.length);
    return hits.slice(0, 40).map((h) => h[1]);
  }

  let sel = -1;
  function render(list) {
    if (!panel) return;
    panel.innerHTML = "";
    sel = -1;
    if (!list.length) {
      if (input && input.value.trim().length >= 2) {
        panel.innerHTML = '<div class="sr-empty">Nothing matches.</div>';
        panel.dataset.open = "1";
      } else {
        panel.dataset.open = "0";
      }
      return;
    }
    for (const e of list) {
      const a = document.createElement("a");
      a.className = "sr-item";
      a.href = e.u;
      a.innerHTML = "<b></b><i></i>";
      a.querySelector("b").textContent = e.n;
      a.querySelector("i").textContent = e.s;
      panel.append(a);
    }
    panel.dataset.open = "1";
  }

  if (input && panel) {
    input.addEventListener("input", () => render(search(input.value)));
    input.addEventListener("focus", () => { if (input.value.trim()) render(search(input.value)); });

    input.addEventListener("keydown", (e) => {
      const items = [...panel.querySelectorAll(".sr-item")];
      if (e.key === "Escape") { panel.dataset.open = "0"; input.blur(); return; }
      if (!items.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (sel >= 0) items[sel].removeAttribute("data-sel");
        sel = e.key === "ArrowDown"
          ? (sel + 1) % items.length
          : (sel - 1 + items.length) % items.length;
        items[sel].setAttribute("data-sel", "1");
        items[sel].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" && sel >= 0) {
        e.preventDefault();
        window.location.href = items[sel].href;
      }
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrap")) panel.dataset.open = "0";
    });

    // "/" focuses search from anywhere, the way every reference site behaves.
    document.addEventListener("keydown", (e) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      input.focus();
      input.select();
    });
  }

  /* ── Per-page filtering ──────────────────────────────────────────────
     Rows carry data-hay (everything searchable, lowercased) and whatever
     boolean attributes their page declared. A chip only constrains rows that
     carry the attribute it reads, so "hidden" narrows achievements without
     emptying a list that has no such concept. */
  const filterBox = document.getElementById("page-filter");
  const chipBox = document.getElementById("page-chips");
  const hitsEl = document.getElementById("page-hits");
  const rows = [...document.querySelectorAll("[data-hay]")];

  if (rows.length && (filterBox || chipBox)) {
    const active = new Set();
    const chips = chipBox ? [...chipBox.querySelectorAll(".chip")] : [];

    for (const c of chips) {
      c.addEventListener("click", () => {
        const id = c.dataset.attr;
        active.has(id) ? active.delete(id) : active.add(id);
        c.setAttribute("aria-pressed", active.has(id) ? "true" : "false");
        apply();
      });
    }

    function apply() {
      const q = filterBox ? filterBox.value.trim().toLowerCase() : "";
      let shown = 0;
      for (const r of rows) {
        let ok = !q || r.dataset.hay.includes(q);
        if (ok) {
          for (const attr of active) {
            // Only rows that declare the attribute are judged by it.
            if (attr in r.dataset && r.dataset[attr] !== "1") { ok = false; break; }
          }
        }
        r.hidden = !ok;
        if (ok) shown++;
      }
      // A heading whose whole group filtered out is noise.
      for (const g of document.querySelectorAll(".group-label")) {
        let n = g.nextElementSibling, any = false;
        while (n && !n.classList.contains("group-label")) {
          if (n.dataset && "hay" in n.dataset && !n.hidden) { any = true; break; }
          n = n.nextElementSibling;
        }
        g.hidden = !any;
      }
      const empty = document.getElementById("page-empty");
      if (empty) empty.hidden = shown > 0;
      if (hitsEl) {
        hitsEl.textContent = (q || active.size)
          ? shown + " of " + rows.length
          : rows.length + " entries";
      }
    }

    if (filterBox) {
      filterBox.addEventListener("input", apply);
      // Remember the filter per page, so a back-button return lands where the
      // reader left off rather than on an unfiltered list.
      const key = "rr-filter-" + document.body.dataset.page;
      try {
        const saved = sessionStorage.getItem(key);
        if (saved) filterBox.value = saved;
        filterBox.addEventListener("input", () => {
          try { sessionStorage.setItem(key, filterBox.value); } catch (e) {}
        });
      } catch (e) {}
    }
    apply();
  }

  /* ── Anchor affordance ───────────────────────────────────────────────
     Every row has an id. Clicking its name copies a link to it, which is the
     thing people actually want from a wiki page listing 104 of something. */
  for (const el of document.querySelectorAll("[data-anchor]")) {
    el.style.cursor = "pointer";
    el.title = "Copy link to this entry";
    el.addEventListener("click", () => {
      const url = location.origin + location.pathname + "#" + el.closest("[id]").id;
      history.replaceState(null, "", "#" + el.closest("[id]").id);
      if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
    });
  }
})();
