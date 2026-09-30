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

  // Old in-page Learn links (#learn/intro, #learn/fw-mece, ...) now live on their own pages.
  const LEARN_PAGES = { intro: "introduction", structure: "introduction", frameworks: "frameworks", tips: "pro-tips", example: "worked-example", numbers: "numbers" };
  function learnPageFor(arg) {
    if (arg.indexOf("fw-") === 0) return "learn/frameworks.html#" + arg;
    if (arg.indexOf("numbers-") === 0) return "learn/numbers.html#" + arg.slice("numbers-".length);
    return LEARN_PAGES[arg] ? "learn/" + LEARN_PAGES[arg] + ".html" : null;
  }

  function render() {
    const route = parseRoute();
    if (route.tab === "learn" && route.arg && learnPageFor(route.arg)) {
      location.replace(learnPageFor(route.arg));
      return;
    }
    TABS.forEach(function (t) {
      document.getElementById("view-" + t).hidden = t !== route.tab;
    });
    document.querySelectorAll(".tabs a").forEach(function (a) {
      if (a.dataset.tab === route.tab) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    listeners.forEach(function (fn) { fn(route); });
    window.scrollTo(0, 0);
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
