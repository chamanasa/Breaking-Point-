/* Home page: the live taxi estimate, the firm logos on the Firm prep card,
 * the FAQ and the entrances. */
(function () {
  const App = window.App;

  /* ---------- The live estimate (model answer to question G077) ----------
   * Mumbai's ~1.3 crore people make ~1.4 trips a day; kaali-peelis take a
   * share of those trips and each taxi does a number of trips a day. The
   * defaults reproduce the model answer of about 30,000. */
  const TRIPS = 13000000 * 1.4;
  const MAX = 80000;
  const share = document.getElementById("est-share");
  const perTaxi = document.getElementById("est-tpt");
  if (share && perTaxi) {
    const num = document.getElementById("est-num");
    const dot = document.getElementById("est-dot");
    const band = document.getElementById("est-band");
    const verdict = document.getElementById("est-verdict");
    band.style.transform = "translateX(" + (30000 / MAX * 100) + "%) scaleX(" + (10000 / MAX) + ")";
    const update = function () {
      const taxis = Math.round((TRIPS * Number(share.value) / 100) / Number(perTaxi.value) / 1000) * 1000;
      document.getElementById("est-share-v").textContent = share.value + "%";
      document.getElementById("est-tpt-v").textContent = perTaxi.value;
      App.roll(num, taxis.toLocaleString("en-IN"));
      // The dot rides a full-width carrier so it moves with transform alone.
      dot.style.transform = "translateX(" + (Math.min(taxis, MAX) / MAX * dot.parentNode.offsetWidth) + "px)";
      const inside = taxis >= 30000 && taxis <= 40000;
      verdict.toggleAttribute("data-in", inside);
      verdict.querySelector("span").textContent = inside
        ? "Inside the model answer of 30,000 to 40,000"
        : (taxis < 30000 ? "Below" : "Above") + " the model answer of 30,000 to 40,000";
    };
    share.addEventListener("input", update);
    perTaxi.addEventListener("input", update);
    window.addEventListener("resize", update);
    App.onRoute(function (route) { if (route.tab === "learn") requestAnimationFrame(update); });
    update();
  }

  /* ---------- Firm logos on the Firm prep card ---------- */
  const logos = document.getElementById("firm-logos");
  if (logos) logos.innerHTML = App.firms.slice(0, 5).map(function (f) { return App.firmLogo(f.id, "sm"); }).join("");

  App.accordion(document.getElementById("faq"));
  App.reveal(document.getElementById("learn-home"));
})();
