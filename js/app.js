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

  /* ---------- User data (progress, drill levels, plans, preferences) ----------
   * Signed-in users: kept in memory and saved to their account (Supabase
   * user_data table) by js/auth.js through the saver it registers.
   * Guests: kept in memory only and never saved; gone on reload or sign-out.
   * Nothing here is stored in the browser.
   *   activity: [{ kind: "interview" | "drill" | "read", at: <ms>, ...details }] */
  function blankData() { return { activity: [], drillLevels: {}, plans: {}, settings: {} }; }
  let userData = blankData();
  let saver = null;      // function(data) registered while a real user is signed in
  let dataReady = false; // true once a signed-in user's saved data has loaded

  // Older versions kept progress in the browser; remove it so nothing carries over.
  try {
    Object.keys(localStorage).forEach(function (k) {
      if (/^bp\.(activity|drillLevels|plan\.|firmStyle)/.test(k)) localStorage.removeItem(k);
    });
  } catch (e) { /* storage blocked */ }

  function signedIn() { return !!(window.App && App.user && !App.user.guest); }
  function activity() { return userData.activity; }
  function saveData() { if (saver && signedIn()) saver(userData); }
  function log(kind, data) {
    if (!signedIn()) return; // guests: nothing is saved
    userData.activity.push(Object.assign({ kind: kind, at: Date.now() }, data));
    if (userData.activity.length > 2000) userData.activity = userData.activity.slice(-2000);
    saveData();
  }
  function setUserData(saved, saveFn) {
    const d = blankData();
    if (saved) {
      if (Array.isArray(saved.activity)) d.activity = saved.activity;
      ["drillLevels", "plans", "settings"].forEach(function (k) {
        if (saved[k] && typeof saved[k] === "object") d[k] = saved[k];
      });
    }
    userData = d;
    saver = saveFn || null;
    dataReady = true;
    document.dispatchEvent(new CustomEvent("bp:data"));
  }
  /* ---------- Sign-in prompts ----------
   * A standard card shown in place of anything that needs an account (Progress,
   * firm prep plans). Its "Continue with Google" button is handled by js/auth.js. */
  const GOOGLE_G = '<svg class="g-logo" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';

  // opts: { title, text, points: [..], compact: bool, id }
  function signInCard(opts) {
    const points = (opts.points || []).map(function (p) { return "<li>" + escapeHtml(p) + "</li>"; }).join("");
    return '<div class="signin-card' + (opts.compact ? " is-compact" : "") + '" data-signin-card' + (opts.id ? ' id="' + opts.id + '"' : "") + ">" +
      '<span class="signin-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></span>' +
      "<h2>" + escapeHtml(opts.title) + "</h2>" +
      (opts.text ? "<p>" + escapeHtml(opts.text) + "</p>" : "") +
      (points ? '<ul class="signin-points">' + points + "</ul>" : "") +
      '<button class="social-btn signin-google" type="button" data-google-signin>' + GOOGLE_G + "Continue with Google</button>" +
      '<p class="auth-msg" hidden></p>' +
      '<p class="signin-note">Free. We only use your name, email and photo from Google. <a href="privacy.html">Privacy</a></p>' +
      "</div>";
  }

  function resetUserData() {
    userData = blankData();
    saver = null;
    dataReady = false;
    document.dispatchEvent(new CustomEvent("bp:data"));
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
    data: function () { return userData; },
    saveData: saveData,
    setUserData: setUserData,
    resetUserData: resetUserData,
    signedIn: signedIn,
    GOOGLE_G: GOOGLE_G,
    signInCard: signInCard,
    dataReady: function () { return dataReady; },
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
