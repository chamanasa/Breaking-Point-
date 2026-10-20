/* Home page: the live taxi estimate in the hero. */
(function () {
  // The estimate follows the model answer to question G077: Mumbai's ~1.3 crore
  // people make ~1.4 trips a day; kaali-peelis take a share of those trips and
  // each taxi does a number of trips a day. Defaults reproduce the model answer.
  const TRIPS = 13000000 * 1.4;
  const share = document.getElementById("est-share");
  const perTaxi = document.getElementById("est-tpt");
  const num = document.getElementById("est-num");
  const shareOut = document.getElementById("est-share-v");
  const perTaxiOut = document.getElementById("est-tpt-v");
  const note = document.getElementById("est-ma");

  function fmt(n) { return n.toLocaleString("en-IN"); }

  function update() {
    const s = Number(share.value) / 100;
    const t = Number(perTaxi.value);
    const taxis = Math.round((TRIPS * s) / t / 1000) * 1000;
    shareOut.textContent = share.value + "%";
    perTaxiOut.textContent = perTaxi.value;
    num.textContent = fmt(taxis);
    note.textContent = taxis >= 30000 && taxis <= 40000
      ? "Within the model answer: 30,000 to 40,000"
      : "Model answer: 30,000 to 40,000";
  }

  if (share && perTaxi && num) {
    share.addEventListener("input", update);
    perTaxi.addEventListener("input", update);
    update();
  }
})();
