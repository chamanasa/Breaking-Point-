/* Progress dashboard (#progress). Reads the activity log written by AI Mode
 * (interviews), the maths driller (drills) and the question bank (model
 * interviews read). Everything lives in this browser; export/import moves it. */
(function () {
  const App = window.App;
  const esc = App.escapeHtml;
  const root = document.getElementById("progress-root");
  if (!root) return;

  const DAY = 86400000;
  const CRITERIA = ["Clarification", "Structure", "Assumptions", "Maths", "Sanity check", "Communication"];
  const ADVICE = {
    "Clarification": ["Pin down scope, geography, time frame and units before any numbers.", "learn/introduction.html", "Re-read the five-step method"],
    "Structure": ["Lay out a MECE tree before calculating, and say why each branch matters.", "learn/frameworks.html", "Review the frameworks"],
    "Assumptions": ["Anchor assumptions in known figures and say them out loud.", "learn/numbers.html", "Study the India Numbers Bible"],
    "Maths": ["Round early, keep units visible and double-check each step.", "#drill/mixed", "Do a maths sprint"],
    "Sanity check": ["End every estimate with an independent cross-check or benchmark.", "learn/pro-tips.html", "Read the Pro Tips"],
    "Communication": ["Signpost each step and finish with a one-line answer and its so-what.", "learn/worked-example.html", "Walk through the worked example"]
  };
  const DRILL_LABEL = { mult: "Multiplication", div: "Division", pct: "Percentages", growth: "Growth & CAGR", units: "Indian units", biz: "Breakeven & margins" };

  const dayKey = function (t) { const d = new Date(t); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
  const fmtDate = function (t) { return new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short" }); };
  const avg = function (arr) { return arr.length ? arr.reduce(function (a, b) { return a + b; }, 0) / arr.length : null; };

  /* ---------- Metrics ---------- */

  function metrics(list) {
    const interviews = list.filter(function (a) { return a.kind === "interview"; });
    const drills = list.filter(function (a) { return a.kind === "drill"; });
    const reads = list.filter(function (a) { return a.kind === "read"; });
    const recent = interviews.slice(-5);
    const crit = {};
    CRITERIA.forEach(function (c) {
      crit[c] = avg(recent.map(function (i) { return i.scores && i.scores[c]; }).filter(function (x) { return x != null; }));
    });
    const drillCat = {};
    drills.forEach(function (d) {
      Object.keys(d.byCat || {}).forEach(function (k) {
        const s = drillCat[k] || (drillCat[k] = { n: 0, ok: 0 });
        s.n += d.byCat[k].n; s.ok += d.byCat[k].ok;
      });
    });
    const recentDrills = drills.slice(-5);
    const drillAcc = recentDrills.length ? recentDrills.reduce(function (a, d) { return a + d.correct; }, 0) / Math.max(1, recentDrills.reduce(function (a, d) { return a + d.n; }, 0)) : null;
    const seen = new Set();
    interviews.concat(reads).forEach(function (a) { if (a.id) seen.add(a.id); });
    const interviewAvg = avg(recent.map(function (i) { return i.overall; }));

    // Readiness: half recent interview scores, a fifth maths accuracy, the rest coverage.
    const readiness = Math.round(
      (interviewAvg != null ? interviewAvg / 10 : 0) * 50 +
      (drillAcc != null ? drillAcc : 0) * 20 +
      Math.min(1, seen.size / 30) * 30);

    // Day streak: consecutive days with any activity, ending today or yesterday.
    const days = new Set(list.map(function (a) { return dayKey(a.at); }));
    let streak = 0;
    let t = Date.now();
    if (!days.has(dayKey(t))) t -= DAY;
    while (days.has(dayKey(t))) { streak++; t -= DAY; }

    return { interviews: interviews, drills: drills, reads: reads, crit: crit, drillCat: drillCat, drillAcc: drillAcc, seen: seen, interviewAvg: interviewAvg, readiness: readiness, streak: streak };
  }

  /* ---------- Charts ---------- */

  function ring(pct) {
    const r = 34, c = 2 * Math.PI * r;
    return '<svg class="ring" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="' + r + '" class="ring-bg"/>' +
      '<circle cx="40" cy="40" r="' + r + '" class="ring-fg" stroke-dasharray="' + (c * pct / 100).toFixed(1) + " " + c.toFixed(1) + '" transform="rotate(-90 40 40)"/></svg>';
  }

  function trendChart(interviews) {
    const pts = interviews.slice(-20);
    if (!pts.length) return '<p class="chart-empty">Your interview scores will appear here after your first AI mock.</p>';
    const W = Math.max(320, Math.min(900, (root.clientWidth || 900) - 60)), H = W < 500 ? 200 : 260, L = 34, R = 16, T = 14, B = 28;
    const x = function (i) { return pts.length === 1 ? (L + W - R) / 2 : L + i * (W - L - R) / (pts.length - 1); };
    const y = function (v) { return T + (10 - v) * (H - T - B) / 10; };
    let svg = '<svg class="ill chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Interview score trend">';
    [0, 5, 10].forEach(function (v) {
      svg += '<line class="grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text class="xs end" x="' + (L - 8) + '" y="' + (y(v) + 4) + '">' + v + "</text>";
    });
    svg += '<path class="trend" d="' + pts.map(function (p, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p.overall).toFixed(1); }).join("") + '"/>';
    pts.forEach(function (p, i) {
      const tip = esc(p.title || p.id) + " · " + p.overall.toFixed(1) + "/10 · " + fmtDate(p.at);
      svg += '<circle class="dot" cx="' + x(i).toFixed(1) + '" cy="' + y(p.overall).toFixed(1) + '" r="4.5"/>' +
        '<circle class="hit" cx="' + x(i).toFixed(1) + '" cy="' + y(p.overall).toFixed(1) + '" r="14" data-tip="' + tip + '"/>';
    });
    const last = pts[pts.length - 1];
    svg += '<text class="sm b" x="' + Math.min(W - R - 4, x(pts.length - 1) + 8) + '" y="' + (y(last.overall) - 10) + '" text-anchor="' + (pts.length > 1 ? "end" : "middle") + '">' + last.overall.toFixed(1) + "</text>";
    svg += '<text class="xs" x="' + L + '" y="' + (H - 6) + '">' + fmtDate(pts[0].at) + '</text><text class="xs end" x="' + (W - R) + '" y="' + (H - 6) + '">' + fmtDate(last.at) + "</text>";
    return svg + "</svg>";
  }

  function bars(rows, max, unit, emptyText) {
    if (!rows.length) return '<p class="chart-empty">' + emptyText + "</p>";
    const low = rows.reduce(function (m, r) { return r.v < m.v ? r : m; }, rows[0]);
    return '<ul class="hbars">' + rows.map(function (r) {
      const pct = Math.max(2, r.v / max * 100);
      return '<li data-tip="' + esc(r.label + ": " + r.text) + '"><span class="hb-label">' + esc(r.label) + (rows.length > 1 && r === low ? ' <span class="badge soon">Focus</span>' : "") + "</span>" +
        '<span class="hb-track"><i style="width:' + pct.toFixed(1) + '%"></i></span><span class="hb-val">' + esc(r.text) + "</span></li>";
    }).join("") + "</ul>";
  }

  function heatmap(list) {
    const counts = {};
    list.forEach(function (a) { const k = dayKey(a.at); counts[k] = (counts[k] || 0) + 1; });
    const weeks = 18;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = new Date(today.getTime() - ((weeks - 1) * 7 + today.getDay()) * DAY);
    let cells = "";
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const t = start.getTime() + (w * 7 + d) * DAY;
        if (t > today.getTime()) { cells += '<i class="future"></i>'; continue; }
        const n = counts[dayKey(t)] || 0;
        const lv = n === 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 5 ? 3 : 4;
        cells += '<i class="h' + lv + '" data-tip="' + n + " session" + (n === 1 ? "" : "s") + " · " + fmtDate(t) + '"></i>';
      }
    }
    return '<div class="heat" style="--weeks:' + weeks + '">' + cells + "</div>" +
      '<div class="heat-legend"><span>Less</span><i class="h0"></i><i class="h1"></i><i class="h2"></i><i class="h3"></i><i class="h4"></i><span>More</span></div>';
  }

  /* ---------- Page ---------- */

  function nextUnseen(seen) {
    return App.questions.find(function (q) { return !seen.has(q.id); });
  }

  function recommendations(m) {
    const recs = [];
    if (!m.interviews.length) recs.push(["Run your first AI mock interview", "It sets your baseline across the six scored criteria.", "#ai", "Start a mock"]);
    const critRows = CRITERIA.filter(function (c) { return m.crit[c] != null; });
    if (critRows.length) {
      const weak = critRows.reduce(function (a, b) { return m.crit[b] < m.crit[a] ? b : a; });
      const adv = ADVICE[weak];
      recs.push(["Lift your " + weak.toLowerCase() + " score (" + m.crit[weak].toFixed(1) + "/5)", adv[0], adv[1], adv[2]]);
    }
    const cats = Object.keys(m.drillCat).filter(function (k) { return m.drillCat[k].n >= 3; });
    if (cats.length) {
      const wk = cats.reduce(function (a, b) { return m.drillCat[b].ok / m.drillCat[b].n < m.drillCat[a].ok / m.drillCat[a].n ? b : a; });
      recs.push(["Weakest maths skill: " + DRILL_LABEL[wk], "Your accuracy here is " + Math.round(m.drillCat[wk].ok / m.drillCat[wk].n * 100) + "%, your lowest maths skill.", "#drill/" + wk, "Drill it now"]);
    } else {
      recs.push(["Warm up your mental maths", "A two-minute sprint shows which skills slow you down.", "#drill/mixed", "Start a sprint"]);
    }
    const q = nextUnseen(m.seen);
    if (q) recs.push(["Try a question you haven't seen", q.title, "#ai/" + q.id, "Practise it"]);
    return recs.slice(0, 3);
  }

  function render() {
    const list = App.activity();
    const m = metrics(list);
    const head = '<div class="page-head"><p class="kicker">Your prep</p><h1>Track Your Progress</h1>' +
      '<p class="subtitle">Every mock interview, maths drill and model interview you read, in one place, with what to work on next. Your data stays in this browser.</p></div>';

    if (!list.length) {
      root.innerHTML = head +
        '<div class="empty-state box"><div class="empty-ico">' + ring(0) + "</div><h2>Nothing tracked yet</h2>" +
        "<p>Your dashboard fills in as you practise. Start with any of these.</p>" +
        '<div class="empty-cta"><a class="btn" href="#ai">Run a mock interview</a><a class="btn ghost" href="#drill">Do a maths drill</a><a class="btn ghost" href="#bank">Read a model interview</a></div></div>' +
        dataControls();
      return;
    }

    const critRows = CRITERIA.filter(function (c) { return m.crit[c] != null; }).map(function (c) {
      return { label: c, v: m.crit[c], text: m.crit[c].toFixed(1) + " / 5" };
    });
    const drillRows = Object.keys(DRILL_LABEL).filter(function (k) { return m.drillCat[k]; }).map(function (k) {
      const s = m.drillCat[k];
      return { label: DRILL_LABEL[k], v: s.ok / s.n * 100, text: Math.round(s.ok / s.n * 100) + "% of " + s.n };
    });
    const recent = list.slice(-8).reverse();

    root.innerHTML = head +
      '<ul class="kpis">' +
        '<li class="kpi-ring">' + ring(m.readiness) + '<div><span>Readiness</span><b>' + m.readiness + '</b><small title="50% recent interview scores, 20% maths accuracy, 30% questions covered">Scores, maths and coverage</small></div></li>' +
        "<li><span>Mock interviews</span><b>" + m.interviews.length + "</b><small>" + (m.interviewAvg != null ? "Recent average " + m.interviewAvg.toFixed(1) + "/10" : "None yet") + "</small></li>" +
        "<li><span>Maths accuracy</span><b>" + (m.drillAcc != null ? Math.round(m.drillAcc * 100) + "%" : "–") + "</b><small>" + m.drills.length + " drill" + (m.drills.length === 1 ? "" : "s") + " done</small></li>" +
        "<li><span>Questions covered</span><b>" + m.seen.size + "<em>/" + App.questions.length + "</em></b><small>Practised or read</small></li>" +
        "<li><span>Day streak</span><b>" + m.streak + "</b><small>" + (m.streak ? "Keep it going" : "Practise today to start one") + "</small></li>" +
      "</ul>" +
      '<h2 class="dash-h">What to work on next</h2>' +
      '<ul class="recs">' + recommendations(m).map(function (r) {
        return '<li><b>' + esc(r[0]) + "</b><p>" + esc(r[1]) + '</p><a href="' + esc(r[2]) + '">' + esc(r[3]) + " &rarr;</a></li>";
      }).join("") + "</ul>" +
      '<div class="dash-grid">' +
        '<section class="box dash-wide"><h3>Interview score</h3><p class="fig-title">Overall score out of 10, last ' + Math.min(20, m.interviews.length || 0) + " interviews</p>" + trendChart(m.interviews) + "</section>" +
        '<section class="box"><h3>Scores by criterion</h3><p class="fig-title">Average of your last five interviews</p>' + bars(critRows, 5, "", "Run an AI mock to see your scores by criterion.") + "</section>" +
        '<section class="box"><h3>Maths by skill</h3><p class="fig-title">Accuracy across all drills</p>' + bars(drillRows, 100, "%", "Do a maths drill to see accuracy by skill.") + "</section>" +
        '<section class="box dash-wide"><h3>Activity</h3><p class="fig-title">Sessions per day, last 18 weeks</p>' + heatmap(list) + "</section>" +
      "</div>" +
      '<section class="box"><h3>Recent sessions</h3><table class="plain recent"><thead><tr><th>When</th><th>What</th><th>Result</th></tr></thead><tbody>' +
        recent.map(function (a) {
          let what = "", res = "";
          if (a.kind === "interview") { what = "Mock interview · " + esc(a.title || a.id) + (a.style ? ' <span class="muted">(' + esc((App.findFirm(a.style) || {}).short || a.style) + " style)</span>" : ""); res = a.overall.toFixed(1) + " / 10"; }
          else if (a.kind === "drill") { what = "Maths drill · " + esc(a.cat === "mixed" ? "Mixed" : DRILL_LABEL[a.cat] || a.cat); res = Math.round(a.correct / a.n * 100) + "% · " + a.n + " questions"; }
          else { const q = App.findQuestion(a.id); what = "Read model interview · " + esc(q ? q.title : a.id); res = "Read"; }
          return "<tr><td>" + fmtDate(a.at) + "</td><td>" + what + "</td><td>" + res + "</td></tr>";
        }).join("") + "</tbody></table></section>" +
      dataControls();
  }

  function dataControls() {
    return '<div class="data-controls"><span class="muted">Your data is stored only in this browser.</span>' +
      '<button class="linkish" type="button" id="pg-export">Export backup</button>' +
      '<label class="linkish" for="pg-import">Import backup</label><input type="file" id="pg-import" accept="application/json" hidden>' +
      '<button class="linkish danger" type="button" id="pg-reset">Reset progress</button></div>';
  }

  /* ---------- Tooltip, data controls ---------- */

  const tip = document.createElement("div");
  tip.className = "tooltip";
  tip.hidden = true;
  document.body.appendChild(tip);
  root.addEventListener("mouseover", function (e) {
    const t = e.target.closest("[data-tip]");
    if (!t) { tip.hidden = true; return; }
    tip.textContent = t.getAttribute("data-tip");
    tip.hidden = false;
    const r = t.getBoundingClientRect();
    tip.style.left = Math.min(window.innerWidth - tip.offsetWidth - 8, Math.max(8, r.left + r.width / 2 - tip.offsetWidth / 2)) + "px";
    tip.style.top = (r.top - tip.offsetHeight - 8 < 0 ? r.bottom + 8 : r.top - tip.offsetHeight - 8) + "px";
  });
  root.addEventListener("mouseleave", function () { tip.hidden = true; });

  root.addEventListener("click", function (e) {
    if (e.target.id === "pg-export") {
      const data = { exported: new Date().toISOString(), activity: App.activity(), storage: {} };
      try {
        Object.keys(localStorage).forEach(function (k) { if (/^bp\.(drillLevels|plan\.)/.test(k)) data.storage[k] = localStorage.getItem(k); });
      } catch (err) { /* ignore */ }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: "application/json" }));
      a.download = "breaking-point-progress.json";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    } else if (e.target.id === "pg-reset") {
      if (window.confirm("Delete all tracked interviews, drills and reading history from this browser?")) {
        App.storageSet("bp.activity", null);
        render();
      }
    }
  });
  root.addEventListener("change", function (e) {
    if (e.target.id !== "pg-import" || !e.target.files[0]) return;
    e.target.files[0].text().then(function (txt) {
      const data = JSON.parse(txt);
      if (!Array.isArray(data.activity)) throw new Error("bad file");
      App.storageSet("bp.activity", JSON.stringify(data.activity));
      Object.keys(data.storage || {}).forEach(function (k) { if (/^bp\./.test(k)) App.storageSet(k, data.storage[k]); });
      render();
    }).catch(function () { window.alert("That file isn't a Breaking Point backup."); });
  });

  App.onRoute(function (route) {
    tip.hidden = true;
    if (route.tab === "progress") render();
  });
})();
