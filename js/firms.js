/* Firm-specific prep (#firms, #firms/<id>): firm directory, profiles, a
 * personalised week-by-week prep plan and firm-style AI mock interviews. */
(function () {
  const App = window.App;
  const esc = App.escapeHtml;
  const root = document.getElementById("firms-root");
  if (!root) return;

  const PLAN_KEY = "bp.plan.";
  const STYLE_KEY = "bp.firmStyle";
  const DAY = 86400000;

  function questionsFor(f) {
    if (!f.bank) return [];
    return App.questions.filter(function (q) { return (q.firm || "").split(" / ").indexOf(f.bank) !== -1; });
  }

  /* ---------- Directory ---------- */

  function card(f) {
    const n = questionsFor(f).length;
    return '<li><a class="firm-card" href="#firms/' + f.id + '">' +
      '<span class="firm-card-top">' + App.firmLogo(f.id, "lg") + '<span class="firm-go" aria-hidden="true">&rarr;</span></span>' +
      '<span class="firm-name">' + esc(f.name) + "</span>" +
      '<span class="firm-tag">' + esc(f.tagline) + "</span>" +
      '<span class="firm-meta"><span>' + esc(f.caseStyle) + "</span>" + (n ? "<span>" + n + " question" + (n > 1 ? "s" : "") + " in the bank</span>" : "") + "</span>" +
      "</a></li>";
  }

  function renderIndex() {
    const global = App.firms.filter(function (f) { return f.group === "global"; });
    const india = App.firms.filter(function (f) { return f.group === "india"; });
    root.innerHTML =
      '<div class="page-head"><p class="kicker">Your prep</p><h1>Firm-Specific Prep</h1>' +
      '<p class="subtitle">Pick your target firm for its interview format, what it screens for, a prep plan built around your interview date, and mock interviews run in that firm&rsquo;s style.</p></div>' +
      '<h3 class="mod-group">Global strategy firms</h3><ul class="firm-grid">' + global.map(card).join("") + "</ul>" +
      '<h3 class="mod-group">India-focused and specialist firms</h3><ul class="firm-grid">' + india.map(card).join("") + "</ul>" +
      '<p class="note firm-note">Formats vary by office and year. Use these profiles as a starting point and confirm the current process on each firm&rsquo;s careers page and with recent candidates. Logos are shown as simple brand-colour marks.</p>';
  }

  /* ---------- Prep plan ---------- */

  function buildPlan(f, days, hours) {
    const weeks = Math.max(1, Math.min(8, Math.ceil(days / 7)));
    const g = hours >= 15 ? 10 : hours >= 10 ? 6 : 3;     // guesstimates per week
    const mocks = hours >= 15 ? 5 : hours >= 10 ? 3 : 2;   // AI mocks per week
    const firmQs = questionsFor(f);
    const fit = f.id === "mckinsey"
      ? "Prepare one Personal Experience Interview story for each dimension: personal impact, entrepreneurial drive, inclusive leadership, courageous change"
      : "Prepare four fit stories (leadership, teamwork, a setback, and why " + f.short + ")";
    const T = {
      found: [
        ["Read the Introduction and Frameworks & Approach guides", "learn/introduction.html"],
        ["Learn the core figures in the India Numbers Bible", "learn/numbers.html"],
        ["Do two Mixed maths sprints and note your weakest skill", "#drill/mixed"],
        ["Read three model interviews end to end", "#bank"]
      ],
      reps: [
        ["Solve " + g + " guesstimates out loud, then compare with the model interview", "#bank"],
        ["Drill your weakest maths skill three times", "#drill"],
        ["Run " + Math.max(1, mocks - 1) + " AI mock interview" + (mocks - 1 > 1 ? "s" : "") + " in " + f.short + " style", "#firms/" + f.id + "/mock"],
        [fit, null]
      ],
      mock: [
        ["Run " + mocks + " AI mock interviews in " + f.short + " style; review each scorecard", "#firms/" + f.id + "/mock"],
        ["Pick your lowest-scoring criterion and fix it in two focused questions", "#progress"],
        ["Rehearse your fit stories out loud with voice mode", "#firms/" + f.id + "/mock"],
        ["Two maths sprints at level 3", "#drill/mixed"]
      ],
      final: [
        ["Two light mock interviews to stay warm", "#firms/" + f.id + "/mock"],
        ["Re-read the Pro Tips cheat sheet", "learn/pro-tips.html"],
        ["Prepare two thoughtful questions to ask your interviewers", null],
        ["Rest the day before. No new material.", null]
      ]
    };
    if (firmQs.length) T.reps.unshift(["Practise questions asked at " + f.short + ": " + firmQs.slice(0, 4).map(function (q) { return q.id; }).join(", "), "#firms/" + f.id + "/questions"]);
    if (f.id === "bain" || f.id === "oliver-wyman") T.mock.push(["Practise a written case: 30 minutes on a data pack, then a three-slide recommendation", null]);
    if (f.id === "ey-parthenon") T.mock.push(["Frame one case as commercial due diligence: market, competition, target, risks", null]);
    if (f.caseStyle === "Interviewer-led") T.reps.push(["Practise interviewer-led drills: answer one focused question at a time, then synthesise", "#firms/" + f.id + "/mock"]);

    const phases = [];
    for (let w = 1; w <= weeks; w++) {
      let key;
      if (w === weeks) key = "final";
      else if (weeks <= 2) key = "mock";
      else if (w <= Math.max(1, Math.round((weeks - 1) * 0.34))) key = "found";
      else if (w <= Math.round((weeks - 1) * 0.7)) key = "reps";
      else key = "mock";
      phases.push(key);
    }
    const NAMES = { found: "Foundations", reps: "Reps", mock: "Mock interviews", final: "Final week" };
    return phases.map(function (key, i) {
      return { week: i + 1, phase: NAMES[key], tasks: T[key].map(function (t, j) { return { id: "w" + (i + 1) + "-" + key + "-" + j, text: t[0], href: t[1] }; }) };
    });
  }

  function loadPlan(id) {
    try { return JSON.parse(App.storageGet(PLAN_KEY + id) || "null"); } catch (e) { return null; }
  }
  function savePlan(id, plan) { App.storageSet(PLAN_KEY + id, plan ? JSON.stringify(plan) : null); }

  function planHtml(f) {
    const saved = loadPlan(f.id);
    const today = new Date().toISOString().slice(0, 10);
    const def = saved ? saved.date : new Date(Date.now() + 28 * DAY).toISOString().slice(0, 10);
    const hours = saved ? saved.hours : 10;
    let body = "";
    if (saved) {
      const days = Math.ceil((new Date(saved.date + "T09:00") - Date.now()) / DAY);
      const plan = buildPlan(f, Math.max(1, days), saved.hours);
      const all = [].concat.apply([], plan.map(function (w) { return w.tasks; }));
      const done = all.filter(function (t) { return saved.done && saved.done[t.id]; }).length;
      const pct = all.length ? Math.round(done / all.length * 100) : 0;
      body = '<div class="plan-status"><div><b>' + (days > 0 ? days + " day" + (days > 1 ? "s" : "") + " to go" : "Interview day") + "</b><span>" + done + " of " + all.length + " tasks done</span></div>" +
        '<div class="plan-meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><i style="width:' + pct + '%"></i></div><span class="plan-pct">' + pct + "%</span></div>" +
        '<ol class="plan-weeks">' + plan.map(function (w) {
          return '<li class="plan-week"><div class="plan-week-head"><span>Week ' + w.week + "</span><b>" + esc(w.phase) + "</b></div><ul>" +
            w.tasks.map(function (t) {
              const on = saved.done && saved.done[t.id];
              return '<li class="' + (on ? "is-done" : "") + '"><label><input type="checkbox" data-task="' + t.id + '"' + (on ? " checked" : "") + "><span>" + esc(t.text) + "</span></label>" +
                (t.href ? '<a href="' + esc(t.href) + '" class="plan-go" aria-label="Open">Open &rarr;</a>' : "") + "</li>";
            }).join("") + "</ul></li>";
        }).join("") + "</ol>";
    }
    return '<section class="box plan" id="plan"><div class="plan-head"><div><h2>Your ' + esc(f.short) + " prep plan</h2>" +
      "<p>Set your interview date and weekly hours; the plan adapts to the time you have. Tick tasks off as you go.</p></div>" +
      '<form class="plan-form" id="plan-form"><div class="field"><label for="plan-date">Interview date</label><input type="date" id="plan-date" min="' + today + '" value="' + def + '"></div>' +
      '<div class="field"><label for="plan-hours">Hours per week</label><select id="plan-hours">' + [5, 10, 15].map(function (h) { return '<option value="' + h + '"' + (h === hours ? " selected" : "") + ">" + h + " hours</option>"; }).join("") + "</select></div>" +
      '<button class="btn" type="submit">' + (saved ? "Update plan" : "Build my plan") + "</button>" + (saved ? '<button class="linkish" type="button" id="plan-reset">Reset</button>' : "") + "</form></div>" + body + "</section>";
  }

  /* ---------- Profile ---------- */

  function renderFirm(f, focus) {
    const qs = questionsFor(f);
    const facts = [["Case style", f.caseStyle], ["Rounds", f.rounds], ["Online test", f.test], ["Fit interview", f.fit]];
    root.innerHTML =
      '<a class="back-link" href="#firms">&larr; All firms</a>' +
      '<section class="firm-hero" style="--fc:' + f.color + '">' +
        '<div class="firm-hero-main">' + App.firmLogo(f.id, "xl") +
          '<div><h1>' + esc(f.name) + '</h1><p class="lead">' + esc(f.tagline) + "</p></div></div>" +
        '<div class="firm-hero-cta"><button class="btn lg" type="button" data-mock="' + f.id + '">Mock interview in ' + esc(f.short) + " style</button>" +
          (qs.length ? '<a class="btn ghost lg" href="#firms/' + f.id + '/questions">' + qs.length + " question" + (qs.length > 1 ? "s" : "") + " asked here</a>" : "") + "</div>" +
      "</section>" +
      '<ul class="facts">' + facts.map(function (x) { return "<li><span>" + x[0] + "</span><b>" + esc(x[1]) + "</b></li>"; }).join("") + "</ul>" +
      '<div class="duo firm-duo"><section class="box"><h2>How the interview works</h2><ul>' + f.format.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></section>" +
      '<section class="box"><h2>What they assess</h2><ul class="ticks">' + f.assesses.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></section></div>" +
      '<section class="box firm-tips"><h2>How to stand out</h2><ol>' + f.tips.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol></section>" +
      planHtml(f) +
      (qs.length ? '<section id="firm-questions"><h2>Questions asked at ' + esc(f.short) + '</h2><ul class="qlist">' + qs.map(function (q) {
        return '<li class="qitem"><span class="qid">' + esc(q.id) + '</span><p class="qtitle">' + esc(q.title) + "</p>" +
          '<div class="qactions"><a class="btn ghost" href="#bank/' + q.id + '">Read model interview</a><button class="btn" type="button" data-mock="' + f.id + '" data-q="' + q.id + '">Mock in ' + esc(f.short) + " style</button></div>" +
          '<div class="qmeta"><span class="diff ' + q.difficulty.toLowerCase() + '">' + esc(q.difficulty) + "</span><span>" + esc(q.industry) + "</span><span>" + esc(q.approach) + "</span></div></li>";
      }).join("") + "</ul></section>" : "") +
      '<p class="note firm-note">Formats vary by office and year; confirm the current process on ' + esc(f.short) + "&rsquo;s careers page.</p>";
    if (focus === "questions") { const s = document.getElementById("firm-questions"); if (s) s.scrollIntoView({ block: "start" }); }
  }

  function startMock(firmId, qid, replace) {
    const f = App.findFirm(firmId);
    if (!f) return;
    App.storageSet(STYLE_KEY, f.id);
    let q = qid ? App.findQuestion(qid) : null;
    if (!q) {
      const pool = questionsFor(f);
      const list = pool.length ? pool : App.questions;
      q = list[Math.floor(Math.random() * list.length)];
    }
    if (replace) location.replace("#ai/" + q.id); else location.hash = "ai/" + q.id;
  }

  /* ---------- Events ---------- */

  root.addEventListener("click", function (e) {
    const m = e.target.closest("[data-mock]");
    if (m) { startMock(m.dataset.mock, m.dataset.q); return; }
    if (e.target.id === "plan-reset") {
      const f = current();
      if (f && window.confirm("Reset your " + f.short + " plan and its ticked tasks?")) { savePlan(f.id, null); renderFirm(f); }
    }
  });
  root.addEventListener("submit", function (e) {
    if (e.target.id !== "plan-form") return;
    e.preventDefault();
    const f = current();
    const date = document.getElementById("plan-date").value;
    if (!f || !date) return;
    const prev = loadPlan(f.id) || {};
    savePlan(f.id, { date: date, hours: Number(document.getElementById("plan-hours").value), done: prev.done || {} });
    renderFirm(f);
    document.getElementById("plan").scrollIntoView({ block: "start" });
  });
  root.addEventListener("change", function (e) {
    const box = e.target.closest("[data-task]");
    const f = current();
    if (!box || !f) return;
    const plan = loadPlan(f.id);
    if (!plan) return;
    plan.done = plan.done || {};
    if (box.checked) plan.done[box.dataset.task] = Date.now(); else delete plan.done[box.dataset.task];
    savePlan(f.id, plan);
    const y = window.scrollY;
    renderFirm(f);
    window.scrollTo(0, y);
  });

  let currentId = null;
  function current() { return App.findFirm(currentId); }

  App.onRoute(function (route) {
    if (route.tab !== "firms") return;
    const parts = (route.arg || "").split("/");
    const f = App.findFirm(parts[0]);
    // "#firms/<id>/mock" is used by plan tasks to launch a mock in that style.
    if (f && parts[1] === "mock") { startMock(f.id, null, true); return; }
    currentId = f ? f.id : null;
    if (f) renderFirm(f, parts[1]); else renderIndex();
    if (!parts[1]) window.scrollTo(0, 0);
  });
})();
