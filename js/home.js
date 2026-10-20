/* Home page: the tabbed live demo (taxi estimate, interview, scorecard, a real
 * maths question), the firm logos, the question preview, the FAQ and the
 * counting figures. */
(function () {
  const App = window.App;
  const esc = App.escapeHtml;

  /* ---------- Tabs: the active look is a clipped copy that slides ---------- */
  const tablist = document.querySelector("#demo [role=tablist]");
  if (tablist) {
    const tabs = Array.prototype.slice.call(tablist.querySelectorAll("[role=tab]"));
    const active = tablist.querySelector(".seg-active");
    active.innerHTML = tabs.map(function (t) { return "<span>" + t.innerHTML + "</span>"; }).join("");

    const place = function (tab) {
      const box = active.getBoundingClientRect();
      const r = tab.getBoundingClientRect();
      active.style.setProperty("--clip-l", (r.left - box.left) + "px");
      active.style.setProperty("--clip-r", (box.right - r.right) + "px");
    };
    const select = function (tab, focus) {
      tabs.forEach(function (t) {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).setAttribute("aria-hidden", String(!on));
      });
      place(tab);
      if (focus) tab.focus();
    };
    tablist.addEventListener("click", function (e) {
      const t = e.target.closest("[role=tab]");
      if (t) select(t);
    });
    // Arrow keys move between tabs, as in any tab list.
    tablist.addEventListener("keydown", function (e) {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let j = null;
      if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = tabs.length - 1;
      if (j == null) return;
      e.preventDefault();
      select(tabs[j], true);
    });
    const current = function () { return tabs.find(function (t) { return t.getAttribute("aria-selected") === "true"; }); };
    // Place without animating on first paint and on resize.
    const settle = function () {
      active.style.transition = "none";
      place(current());
      active.offsetWidth;
      active.style.transition = "";
    };
    window.addEventListener("resize", settle);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
    App.onRoute(function (route) { if (route.tab === "learn") requestAnimationFrame(settle); });
    settle();
  }

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

  /* ---------- A real maths question, three in a row ---------- */
  // [question, answer, hint after a wrong try, explanation once right]
  const DRILL = [
    ["45 crore = ? million", 450, "1 crore is 10 million.", "1 crore is 10 million, so 45 crore is 450 million."],
    ["3.2 lakh = ? thousand", 320, "1 lakh is 100 thousand.", "1 lakh is 100 thousand, so 3.2 lakh is 320 thousand."],
    ["15% of 2,400 = ?", 360, "Find 10%, then half of that.", "10% is 240 and 5% is 120, so 15% is 360."]
  ];
  const form = document.getElementById("drill-form");
  if (form) {
    const input = document.getElementById("drill-a");
    const msg = document.getElementById("drill-msg");
    const btn = form.querySelector("button");
    let n = 0;
    let solved = false;
    const show = function () {
      document.getElementById("drill-q").textContent = DRILL[n][0];
      document.getElementById("drill-n").textContent = "Question " + (n + 1) + " of " + DRILL.length;
      input.value = "";
      msg.textContent = "";
      msg.className = "drill-msg";
      btn.textContent = "Check";
      solved = false;
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (solved) {
        if (n < DRILL.length - 1) { n++; show(); input.focus(); }
        else { msg.innerHTML = 'All three done. <a href="#drill">Try a full drill &rarr;</a>'; msg.className = "drill-msg ok"; }
        return;
      }
      const v = parseFloat(input.value.replace(/,/g, ""));
      if (isNaN(v)) { input.focus(); return; }
      if (Math.abs(v - DRILL[n][1]) < 0.001) {
        solved = true;
        msg.textContent = "Correct. " + DRILL[n][3];
        msg.className = "drill-msg ok";
        btn.textContent = n < DRILL.length - 1 ? "Next" : "Finish";
      } else {
        msg.textContent = "Not quite. Hint: " + DRILL[n][2];
        msg.className = "drill-msg bad";
        form.removeAttribute("data-wrong");
        form.offsetWidth; // restart the nudge
        form.setAttribute("data-wrong", "");
      }
    });
  }

  /* ---------- Firm logos ---------- */
  const firmLink = function (f, size) {
    return '<a href="#firms/' + f.id + '" title="' + esc(f.name) + '" aria-label="' + esc(f.name) + '">' + App.firmLogo(f.id, size) + "</a>";
  };
  const wall = document.getElementById("logo-wall");
  if (wall) wall.innerHTML = App.firms.slice(0, 9).map(function (f) { return firmLink(f, "sm"); }).join("");
  const stack = document.getElementById("mod-logos");
  if (stack) stack.innerHTML = App.firms.slice(0, 5).map(function (f) { return App.firmLogo(f.id, "sm"); }).join("");

  /* ---------- Question preview ---------- */
  const rows = document.getElementById("q-rows");
  if (rows) {
    rows.innerHTML = ["G014", "G053", "G015", "G001", "G003"].map(App.findQuestion.bind(App)).filter(Boolean).map(function (q) {
      return '<li><a class="q-row" href="#bank/' + esc(q.id) + '">' + App.firmLogo(String(q.firm).split(" / ")[0], "sm") +
        "<b>" + esc(q.title) + "</b>" +
        '<small><span class="diff ' + q.difficulty.toLowerCase() + '">' + esc(q.difficulty) + "</span>" + (q.firm ? "Asked at " + esc(q.firm) : "") + "</small>" +
        '<span class="q-go" aria-hidden="true">&rarr;</span></a></li>';
    }).join("");
  }

  /* ---------- FAQ, figures, entrances ---------- */
  App.accordion(document.getElementById("faq"));
  const figs = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  figs.forEach(function (el) { App.roll(el, el.dataset.count.replace(/\d/g, "0")); });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { App.roll(e.target, e.target.dataset.count); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    figs.forEach(function (el) { io.observe(el); });
  } else figs.forEach(function (el) { App.roll(el, el.dataset.count); });
  App.reveal(document.getElementById("learn-home"));
})();
