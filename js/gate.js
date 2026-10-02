/* Guide pages (learn/*.html) open only for signed-in visitors once accounts
 * are connected. The full sign-in flow lives on the main page (js/auth.js);
 * this just sends anyone without a session there. */
(function () {
  var cfg = window.BP_CONFIG || {};
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) return;
  var allowGuest = cfg.allowGuest == null ? false : !!cfg.allowGuest;
  try {
    var keys = Object.keys(localStorage);
    var signedIn = keys.some(function (k) { return /^sb-.+-auth-token$/.test(k); });
    var guest = allowGuest && localStorage.getItem("bp.guest") === "1";
    if (!signedIn && !guest) location.replace("../index.html");
  } catch (e) { /* storage blocked: let them read */ }
})();
