/* Keeps visitors on the latest release. GitHub Pages lets browsers cache
 * pages for a while, so a returning visitor can see an old copy. This asks
 * for version.txt (never cached) and, if it is newer than the copy running,
 * reloads the page under a new URL so the browser fetches it fresh.
 * Bump BUILD here and the number in version.txt together on every release. */
(function () {
  var BUILD = "9";
  var script = document.currentScript;
  var base = script ? script.src.replace(/js\/update\.js.*$/, "") : "";
  try {
    fetch(base + "version.txt?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (v) {
        v = (v || "").trim();
        if (!v || v === BUILD) return;
        var flag = "bp.updated." + v;
        if (sessionStorage.getItem(flag)) return; // avoid reload loops
        sessionStorage.setItem(flag, "1");
        location.replace(location.pathname + "?v=" + v + location.hash);
      })
      .catch(function () {});
  } catch (e) { /* offline or storage blocked: carry on with this copy */ }
})();
