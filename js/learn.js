/* Learn tab: India Numbers Bible tabs, the step-by-step worked example,
 * and sidebar highlighting of the section currently on screen. */
(function () {
  const App = window.App;
  const esc = App.escapeHtml;

  /* ---------- India Numbers Bible ---------- */

  const groups = Array.isArray(window.INDIA_NUMBERS) ? window.INDIA_NUMBERS : [];
  const tabsEl = document.getElementById("numbers-tabs");
  const panelsEl = document.getElementById("numbers-panels");

  function rowHtml(r) {
    return "<tr>" +
      "<td>" + esc(r.metric) + "</td>" +
      "<td>" + esc(r.value) + (r.approx ? '<span class="flag" title="Working assumption or low-precision figure">approx.</span>' : "") + "</td>" +
      '<td class="src">' + esc(r.source) + "</td>" +
      '<td class="yr">' + esc(r.year) + "</td>" +
      "</tr>";
  }

  tabsEl.innerHTML = groups.map(function (g, i) {
    return '<button type="button" role="tab" id="numbers-tab-' + esc(g.id) + '" aria-controls="numbers-panel-' + esc(g.id) +
      '" aria-selected="' + (i === 0) + '" data-group="' + esc(g.id) + '">' + esc(g.label) + " variables</button>";
  }).join("");

  panelsEl.innerHTML = groups.map(function (g, i) {
    return '<div class="num-group" role="tabpanel" id="numbers-panel-' + esc(g.id) + '" aria-labelledby="numbers-tab-' + esc(g.id) + '"' + (i === 0 ? "" : " hidden") + ">" +
      g.sections.map(function (s) {
        return '<div class="box"><h3>' + esc(s.title) + "</h3>" +
          '<table class="plain numbers"><thead><tr><th>Metric</th><th>Value</th><th>Source</th><th>Year</th></tr></thead><tbody>' +
          s.rows.map(rowHtml).join("") +
          "</tbody></table></div>";
      }).join("") +
      "</div>";
  }).join("");

  function selectGroup(id) {
    tabsEl.querySelectorAll("button").forEach(function (b) {
      b.setAttribute("aria-selected", String(b.dataset.group === id));
    });
    panelsEl.querySelectorAll(".num-group").forEach(function (p) {
      p.hidden = p.id !== "numbers-panel-" + id;
    });
  }

  tabsEl.addEventListener("click", function (e) {
    const b = e.target.closest("button");
    if (b) selectGroup(b.dataset.group);
  });

  App.onRoute(function (route) {
    if (route.tab === "learn" && route.arg && route.arg.indexOf("numbers-") === 0) {
      const id = route.arg.slice("numbers-".length);
      if (groups.some(function (g) { return g.id === id; })) selectGroup(id);
    }
  });

  /* ---------- Worked example stepper ---------- */

  const steps = Array.from(document.querySelectorAll("#stepper .step-x"));
  const progress = document.getElementById("stepper-progress");
  const nextBtn = document.getElementById("stepper-next");
  let revealed = 1;

  function setOpen(step, open) {
    step.dataset.open = String(open);
    step.querySelector(".body").hidden = !open;
    step.querySelector("button").setAttribute("aria-expanded", String(open));
  }

  function paintStepper() {
    steps.forEach(function (step, i) {
      const locked = i >= revealed;
      step.dataset.locked = String(locked);
      step.querySelector("button").disabled = locked;
      if (locked) setOpen(step, false);
    });
    progress.textContent = "Step " + revealed + " of " + steps.length + " revealed";
    nextBtn.disabled = revealed >= steps.length;
  }

  steps.forEach(function (step, i) {
    setOpen(step, i === 0);
    step.querySelector("button").addEventListener("click", function () {
      if (i < revealed) setOpen(step, step.dataset.open !== "true");
    });
  });

  nextBtn.addEventListener("click", function () {
    if (revealed >= steps.length) return;
    steps.slice(0, revealed).forEach(function (s) { setOpen(s, false); });
    revealed += 1;
    paintStepper();
    const step = steps[revealed - 1];
    setOpen(step, true);
    step.scrollIntoView({ block: "nearest" });
  });

  document.getElementById("stepper-all").addEventListener("click", function () {
    revealed = steps.length;
    paintStepper();
    steps.forEach(function (s) { setOpen(s, true); });
  });

  document.getElementById("stepper-reset").addEventListener("click", function () {
    revealed = 1;
    paintStepper();
    steps.forEach(function (s, i) { setOpen(s, i === 0); });
    document.getElementById("learn-example").scrollIntoView();
  });

  paintStepper();

  /* ---------- Pages: landing grid, one topic page at a time ---------- */

  const PAGES = [
    { id: "intro", title: "Introduction" },
    { id: "frameworks", title: "Frameworks & Approach" },
    { id: "tips", title: "Pro Tips" },
    { id: "example", title: "Worked Example" },
    { id: "numbers", title: "India Numbers Bible" }
  ];
  const home = document.getElementById("learn-home");
  const crumbs = document.getElementById("learn-crumbs");
  const crumbCurrent = document.getElementById("learn-crumb-current");
  const pager = document.getElementById("learn-pager");

  // Map a route argument (e.g. "fw-mece", "numbers-economic", "structure") to its page.
  function pageFor(arg) {
    if (!arg) return null;
    if (arg === "structure") return "intro";
    if (arg.indexOf("fw-") === 0) return "frameworks";
    if (arg.indexOf("numbers-") === 0) return "numbers";
    return PAGES.some(function (p) { return p.id === arg; }) ? arg : null;
  }

  function pagerLink(page, cls, label) {
    return '<a class="' + cls + '" href="#learn/' + page.id + '"><span class="lbl">' + label + '</span><span class="ttl">' + esc(page.title) + "</span></a>";
  }

  App.onRoute(function (route) {
    if (route.tab !== "learn") return;
    const current = pageFor(route.arg);
    home.hidden = current !== null;
    crumbs.hidden = pager.hidden = current === null;
    document.querySelectorAll("#view-learn .learn-page").forEach(function (sec) {
      sec.hidden = sec.dataset.page !== current;
    });
    if (current === null) { document.title = "Guesstimates · Breaking Point"; return; }

    const i = PAGES.findIndex(function (p) { return p.id === current; });
    crumbCurrent.textContent = PAGES[i].title;
    document.title = PAGES[i].title + " · Breaking Point";
    pager.innerHTML =
      (i > 0 ? pagerLink(PAGES[i - 1], "prev", "&larr; Previous") : "") +
      (i < PAGES.length - 1 ? pagerLink(PAGES[i + 1], "next", "Next &rarr;") : '<a class="next" href="#learn"><span class="lbl">Back to</span><span class="ttl">All topics</span></a>');
  });
})();
