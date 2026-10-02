/* Tab routing and shared helpers.
 *
 * Routes (hash-based so the site works on any static host or from disk):
 *   #learn            Learn tab
 *   #learn/<section>  Learn tab, scrolled to #learn-<section>
 *   #bank             Question bank
 *   #ai               AI mode
 *   #ai/<questionId>  AI mode with that question preselected
 *   #drill            Mental maths driller (#drill/<category> preselects one)
 *   #firms            Firm-specific prep (#firms/<firmId> opens a profile)
 *   #progress         Progress dashboard
 *   #admin            Users (admins only; see js/admin.js)
 */
(function () {
  const TABS = ["learn", "bank", "ai", "drill", "firms", "progress", "admin"];
  const listeners = [];
  let lastTab = null;

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

  // Minimal, safe markdown shared by the chat and the transcript reader:
  // escape first, then paragraphs, lists and **bold** / *emphasis*.
  function renderMarkdown(src) {
    const inline = function (s) {
      return escapeHtml(s)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
    };
    const out = [];
    let list = null;
    let para = [];
    const flushList = function () {
      if (list) { out.push("<" + list.tag + ">" + list.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</" + list.tag + ">"); list = null; }
    };
    const flushPara = function () { if (para.length) { out.push("<p>" + para.join("<br>") + "</p>"); para = []; } };

    src.split(/\r?\n/).forEach(function (line) {
      const ul = line.match(/^\s*[-*•]\s+(.*)$/);
      const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
      const h = line.match(/^\s*#{1,6}\s+(.*)$/);
      if (ul || ol) {
        flushPara();
        const tag = ul ? "ul" : "ol";
        if (!list || list.tag !== tag) { flushList(); list = { tag: tag, items: [] }; }
        list.items.push(inline((ul || ol)[1]));
      } else if (!line.trim()) {
        flushList(); flushPara();
      } else if (h) {
        flushList(); flushPara();
        out.push("<p><strong>" + inline(h[1]) + "</strong></p>");
      } else {
        flushList();
        para.push(inline(line));
      }
    });
    flushList(); flushPara();
    return out.join("");
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
      if (a.dataset.tab === route.tab) {
        a.setAttribute("aria-current", "page");
        // On phones the tab row scrolls sideways: keep the current tab visible.
        const bar = a.parentNode;
        if (bar.scrollWidth > bar.clientWidth) bar.scrollLeft = a.offsetLeft - bar.clientWidth / 2 + a.offsetWidth / 2;
      } else a.removeAttribute("aria-current");
    });

    listeners.forEach(function (fn) { fn(route); });
    if (route.tab !== lastTab) window.scrollTo(0, 0);
    lastTab = route.tab;
  }

  /* ---------- Activity log (feeds the Progress dashboard) ----------
   * Everything stays in this browser's localStorage under bp.activity:
   * { kind: "interview" | "drill" | "read", at: <ms>, ...details } */
  const ACTIVITY_KEY = "bp.activity";
  function activity() {
    try {
      const list = JSON.parse(storageGet(ACTIVITY_KEY) || "[]");
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }
  function log(kind, data) {
    const list = activity();
    list.push(Object.assign({ kind: kind, at: Date.now() }, data));
    storageSet(ACTIVITY_KEY, JSON.stringify(list.slice(-2000)));
  }

  /* ---------- Firm logos ----------
   * A brand-coloured tile per firm (data/firms.js). A firm with `logo` set uses
   * that image file instead; one with `icon` draws that SVG path. */
  const FIRMS = Array.isArray(window.FIRMS) ? window.FIRMS : [];
  function findFirm(key) {
    if (!key) return null;
    const k = String(key).toLowerCase();
    return FIRMS.find(function (f) {
      return f.id === k || f.short.toLowerCase() === k || (f.bank && f.bank.toLowerCase() === k) || f.name.toLowerCase() === k;
    }) || null;
  }
  function firmLogo(key, size) {
    const f = findFirm(key);
    const cls = "flogo" + (size ? " flogo-" + size : "");
    if (!f) {
      const initials = String(key || "?").split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 3).toUpperCase();
      return '<span class="' + cls + '" aria-hidden="true">' + escapeHtml(initials) + "</span>";
    }
    const style = ' style="--fc:' + f.color + (f.ink ? ";--fi:" + f.ink : "") + '"';
    let inner = escapeHtml(f.mark);
    if (f.logo) inner = '<img src="' + escapeHtml(f.logo) + '" alt="">';
    else if (f.icon) inner = '<svg viewBox="0 0 24 24"><path d="' + f.icon + '"/></svg>';
    return '<span class="' + cls + (f.mark.length > 2 ? " is-long" : "") + '"' + style + ' title="' + escapeHtml(f.name) + '" aria-hidden="true">' + inner + "</span>";
  }

  window.App = {
    questions: Array.isArray(window.GUESSTIMATES) ? window.GUESSTIMATES : [],
    escapeHtml: escapeHtml,
    renderMarkdown: renderMarkdown,
    storageGet: storageGet,
    storageSet: storageSet,
    onRoute: function (fn) { listeners.push(fn); },
    log: log,
    activity: activity,
    firms: FIRMS,
    findFirm: findFirm,
    firmLogo: firmLogo,
    findQuestion: function (id) {
      return this.questions.find(function (q) { return q.id === id; }) || null;
    }
  };

  // Keep --header-h equal to the real header height (it wraps on phones), so
  // full-page views like AI Mode can sit exactly beneath it.
  function syncHeader() {
    const h = document.querySelector(".site-header");
    if (h) document.documentElement.style.setProperty("--header-h", h.offsetHeight + "px");
  }
  window.addEventListener("resize", syncHeader);
  document.addEventListener("DOMContentLoaded", syncHeader);

  // In-page jumps (e.g. "Explore modules") scroll without touching the hash router.
  document.addEventListener("click", function (e) {
    const a = e.target.closest("[data-scroll-to]");
    const target = a && document.getElementById(a.dataset.scrollTo);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  window.addEventListener("hashchange", render);
  document.addEventListener("DOMContentLoaded", render);
})();
