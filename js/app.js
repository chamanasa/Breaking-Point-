/* Tab routing and shared helpers.
 *
 * Routes (hash-based so the site works on any static host or from disk):
 *   #learn            Learn tab
 *   #learn/<section>  Learn tab, scrolled to #learn-<section>
 *   #bank             Question bank
 *   #ai               AI mode
 *   #ai/<questionId>  AI mode with that question preselected
 */
(function () {
  const TABS = ["learn", "bank", "ai"];
  const listeners = [];

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try {
      if (value == null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) { /* private mode etc. — ignore */ }
  }

  function parseRoute() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, ""));
    const [tab, ...rest] = raw.split("/");
    return { tab: TABS.includes(tab) ? tab : "learn", arg: rest.join("/") || null };
  }

  function render() {
    const route = parseRoute();
    TABS.forEach(function (t) {
      document.getElementById("view-" + t).hidden = t !== route.tab;
    });
    document.querySelectorAll(".tabs a").forEach(function (a) {
      if (a.dataset.tab === route.tab) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    // Let tabs react first (e.g. select a Numbers sub-tab), then scroll.
    listeners.forEach(function (fn) { fn(route); });

    const target = route.tab === "learn" && route.arg
      ? document.getElementById("learn-" + route.arg) || document.getElementById("learn-" + route.arg.split("-")[0])
      : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }

  window.App = {
    questions: Array.isArray(window.GUESSTIMATES) ? window.GUESSTIMATES : [],
    escapeHtml: escapeHtml,
    storageGet: storageGet,
    storageSet: storageSet,
    onRoute: function (fn) { listeners.push(fn); },
    findQuestion: function (id) {
      return this.questions.find(function (q) { return q.id === id; }) || null;
    }
  };

  window.addEventListener("hashchange", render);
  document.addEventListener("DOMContentLoaded", render);
})();
