/* Visitor tracking for the admin page (#admin → Visitors).
 *
 * Records one row per page view in the Supabase `visits` table: a random
 * visitor id kept in this browser, the page, where the visitor came from,
 * device type, timezone and language. No IP address and no cookies. Signed-in
 * visitors are linked to their account by the database, not by this script.
 *
 * Skipped when Supabase isn't configured, when the browser sends Do Not Track,
 * or when this browser has opted out (bp.noTrack, set from the admin page so
 * your own visits don't count).
 */
(function () {
  var cfg = window.BP_CONFIG || {};
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || cfg.trackVisits === false) return;
  if (!cfg.trackLocal && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  if (get("bp.noTrack") === "1" || navigator.doNotTrack === "1" || window.doNotTrack === "1") return;

  var vid = get("bp.vid");
  if (!vid) {
    vid = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : "v" + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
    set("bp.vid", vid);
  }

  // The signed-in user's token when there is a valid one, so the database can link the
  // visit to their account. Anonymous visits send only the public key (as `apikey`).
  function userToken() {
    try {
      var key = Object.keys(localStorage).filter(function (k) { return /^sb-.+-auth-token$/.test(k); })[0];
      var s = key && JSON.parse(localStorage.getItem(key));
      if (s && s.access_token && (!s.expires_at || s.expires_at * 1000 > Date.now() + 30000)) return s.access_token;
    } catch (e) { /* ignore */ }
    return null;
  }

  function device() {
    var ua = navigator.userAgent || "";
    if (/iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return "tablet";
    if (/Mobi|iPhone|Android/i.test(ua)) return "mobile";
    return "desktop";
  }

  // A readable page name: "home", "bank", "bank/G013", "learn/pro-tips", "sign-in", "admin"...
  function page() {
    var learn = location.pathname.match(/\/learn\/([^/]+)\.html$/);
    if (learn) return "learn/" + learn[1];
    if (document.body && document.body.classList.contains("auth-open")) return "sign-in";
    var route = decodeURIComponent(location.hash.replace(/^#/, "")).split("/").slice(0, 2).join("/");
    if (!route || route.indexOf("learn") === 0) return "home";
    return route.slice(0, 200);
  }

  // External referrer only, once per browser session.
  function referrer() {
    try {
      if (sessionStorage.getItem("bp.refSent")) return null;
      sessionStorage.setItem("bp.refSent", "1");
    } catch (e) { /* ignore */ }
    var r = document.referrer;
    if (!r) return null;
    try { if (new URL(r).host === location.host) return null; } catch (e) { return null; }
    return r.slice(0, 300);
  }

  var last = "";
  function send() {
    var p = page();
    if (p === last) return;
    last = p;
    var tz = null;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || null; } catch (e) { /* ignore */ }
    var body = {
      visitor_id: vid, path: p, referrer: referrer(), device: device(),
      timezone: tz ? tz.slice(0, 64) : null, language: (navigator.language || "").slice(0, 16) || null
    };
    var headers = { "Content-Type": "application/json", apikey: cfg.supabaseAnonKey, Prefer: "return=minimal" };
    var token = userToken();
    if (token) headers.Authorization = "Bearer " + token;
    try {
      fetch(cfg.supabaseUrl.replace(/\/$/, "") + "/rest/v1/visits", {
        method: "POST",
        keepalive: true,
        headers: headers,
        body: JSON.stringify(body)
      }).catch(function () { /* analytics must never break the page */ });
    } catch (e) { /* ignore */ }
  }

  var timer = null;
  function soon() { clearTimeout(timer); timer = setTimeout(send, 700); }
  window.addEventListener("hashchange", soon);
  // The sign-in page and the app swap without a hash change; watch the body class too.
  if (window.MutationObserver) {
    var start = function () { new MutationObserver(soon).observe(document.body, { attributes: true, attributeFilter: ["class"] }); soon(); };
    if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
  } else {
    window.addEventListener("load", soon);
  }
})();
