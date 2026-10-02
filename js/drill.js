/* Mental Maths Driller (#drill, #drill/<category>).
 * Consulting-style arithmetic with adaptive difficulty: each skill has its own
 * level (1–3) that rises after three fast correct answers in a row and drops
 * after two misses. Answers accept shorthand such as 4.2k, 1.5m, 3l, 12cr. */
(function () {
  const App = window.App;
  const esc = App.escapeHtml;
  const root = document.getElementById("drill-root");
  if (!root) return;

  const LEVEL_KEY = "bp.drillLevels";
  const fmt = function (n, dp) {
    return Number(n).toLocaleString("en-IN", { maximumFractionDigits: dp == null ? 2 : dp });
  };
  const rnd = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  const pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };

  /* ---------- Question generators ---------- */

  const CATS = [
    {
      id: "mult", label: "Multiplication", example: "35 × 48", target: [6, 12, 20],
      tip: "Split one factor into friendly parts: 35 × 48 = 35 × 50 − 35 × 2. Strip trailing zeros, multiply, then add them back.",
      make: function (lv) {
        let a, b;
        if (lv === 1) { a = rnd(12, 99); b = rnd(3, 9); }
        else if (lv === 2) { a = rnd(12, 99); b = rnd(12, 99); }
        else { a = rnd(12, 99) * pick([10, 100]); b = rnd(12, 99) * pick([10, 100, 1000]); }
        return { text: fmt(a) + " × " + fmt(b), answer: a * b, tol: lv === 3 ? { rel: 0.01 } : null, unit: "",
          solution: fmt(a) + " × " + fmt(b) + " = " + fmt(a * b) };
      }
    },
    {
      id: "div", label: "Division", example: "1,856 ÷ 32", target: [6, 12, 20],
      tip: "Simplify first: divide both sides by a common factor (1,856 ÷ 32 = 464 ÷ 8 = 58). For estimates, round the divisor to a friendly number.",
      make: function (lv) {
        let b, q, a;
        if (lv === 1) { b = rnd(3, 9); q = rnd(6, 25); }
        else if (lv === 2) { b = rnd(12, 48); q = rnd(15, 95); }
        else { b = rnd(12, 75); q = rnd(150, 9500); }
        a = b * q;
        return { text: fmt(a) + " ÷ " + fmt(b), answer: q, tol: lv === 3 ? { rel: 0.01 } : null, unit: "",
          solution: fmt(a) + " ÷ " + fmt(b) + " = " + fmt(q) };
      }
    },
    {
      id: "pct", label: "Percentages", example: "15% of 2,400", target: [6, 12, 18],
      tip: "Build from 10% and 1%: 15% = 10% + half of 10%. For 'what % is x of y', write x/y and scale the denominator to 100.",
      make: function (lv) {
        if (lv === 1) {
          const p = pick([10, 20, 25, 50, 5]), n = rnd(2, 90) * pick([20, 40, 100]);
          return { text: p + "% of " + fmt(n), answer: n * p / 100, unit: "", solution: p + "% of " + fmt(n) + " = " + fmt(n * p / 100) };
        }
        if (lv === 2) {
          const p = pick([12, 15, 18, 35, 45, 65, 8, 6]), n = rnd(4, 95) * 50;
          return { text: p + "% of " + fmt(n), answer: n * p / 100, tol: { rel: 0.005 }, unit: "", solution: p + "% of " + fmt(n) + " = " + fmt(n * p / 100) };
        }
        const y = rnd(12, 95) * 10, x = Math.round(y * rnd(4, 85) / 100);
        const ans = x / y * 100;
        return { text: fmt(x) + " is what % of " + fmt(y) + "?", answer: ans, tol: { abs: 1 }, unit: "%",
          solution: fmt(x) + " ÷ " + fmt(y) + " ≈ " + fmt(ans, 1) + "% (within 1 point counts)" };
      }
    },
    {
      id: "growth", label: "Growth & CAGR", example: "800 grows 15% for 2 years", target: [8, 15, 25],
      tip: "Compound by stacking: +15% twice is ×1.15 × 1.15 ≈ ×1.32. For CAGR, use the rule of 72 (doubling time ≈ 72 ÷ rate) or try candidate rates.",
      make: function (lv) {
        if (lv === 1) {
          const n = rnd(2, 40) * 50, g = pick([5, 10, 20, 25, 50]);
          const ans = n * (1 + g / 100);
          return { text: fmt(n) + " grows " + g + "%. New value?", answer: ans, tol: { rel: 0.005 }, unit: "", solution: fmt(n) + " × " + (1 + g / 100) + " = " + fmt(ans) };
        }
        if (lv === 2) {
          const n = rnd(2, 20) * 100, g = pick([8, 10, 12, 15, 20]), y = pick([2, 3]);
          const ans = n * Math.pow(1 + g / 100, y);
          return { text: fmt(n) + " grows " + g + "% a year for " + y + " years. Final value?", answer: ans, tol: { rel: 0.02 }, unit: "",
            solution: fmt(n) + " × " + (1 + g / 100) + "^" + y + " ≈ " + fmt(ans, 0) + " (within 2% counts)" };
        }
        const g = pick([5, 8, 10, 12, 15, 20, 25]), y = pick([3, 4, 5]), a = rnd(2, 9) * 100;
        const b = Math.round(a * Math.pow(1 + g / 100, y));
        return { text: "Revenue goes from " + fmt(a) + " to " + fmt(b) + " in " + y + " years. CAGR?", answer: g, tol: { abs: 1.5 }, unit: "%",
          solution: "(" + fmt(b) + " ÷ " + fmt(a) + ")^(1/" + y + ") − 1 ≈ " + g + "% (within 1.5 points counts)" };
      }
    },
    {
      id: "units", label: "Indian units", example: "45 crore = ? million", target: [6, 12, 20],
      tip: "1 lakh = 100 thousand; 1 crore = 100 lakh = 10 million; 100 crore = 1 billion. Convert once, then do the maths in one system.",
      make: function (lv) {
        if (lv === 1) {
          const t = pick([
            function () { const n = rnd(2, 95); return [n + " lakh = ? thousand", n * 100, "thousand"]; },
            function () { const n = rnd(2, 95); return [n + " crore = ? lakh", n * 100, "lakh"]; },
            function () { const n = rnd(2, 95) * 100; return [fmt(n) + " thousand = ? lakh", n / 100, "lakh"]; }
          ])();
          return { text: t[0], answer: t[1], unit: t[2], solution: t[0].replace("?", fmt(t[1])) };
        }
        if (lv === 2) {
          const t = pick([
            function () { const n = rnd(2, 95); return [n + " crore = ? million", n * 10, "million"]; },
            function () { const n = rnd(2, 95) * 10; return [fmt(n) + " million = ? crore", n / 10, "crore"]; },
            function () { const n = rnd(2, 40) * 50; return [fmt(n) + " crore = ? billion", n / 100, "billion"]; },
            function () { const n = rnd(2, 95); return [n + " lakh = ? million", n / 10, "million"]; }
          ])();
          return { text: t[0], answer: t[1], unit: t[2], solution: t[0].replace("?", fmt(t[1])) };
        }
        const people = rnd(2, 60), spend = rnd(2, 40) * 50;
        const ans = people * 1e5 * spend / 1e7;
        return { text: people + " lakh customers × ₹" + fmt(spend) + " each = ? crore", answer: ans, tol: { rel: 0.01 }, unit: "crore",
          solution: people + " lakh × ₹" + fmt(spend) + " = ₹" + fmt(people * spend) + " lakh = ₹" + fmt(ans) + " crore" };
      }
    },
    {
      id: "biz", label: "Breakeven & margins", example: "Breakeven units", target: [10, 15, 20],
      tip: "Breakeven units = fixed cost ÷ (price − variable cost). Margin = profit ÷ revenue. Payback = investment ÷ annual profit.",
      make: function (lv) {
        if (lv === 1) {
          const v = rnd(2, 12) * 5, c = rnd(1, 6) * 5, f = c * rnd(2, 40) * 100;
          return { text: "Price ₹" + (v + c) + ", variable cost ₹" + v + ", fixed costs ₹" + fmt(f) + ". Breakeven units?", answer: f / c, unit: "units",
            solution: "₹" + fmt(f) + " ÷ (₹" + (v + c) + " − ₹" + v + ") = " + fmt(f / c) + " units" };
        }
        if (lv === 2) {
          const r = rnd(4, 40) * 20, m = pick([10, 15, 20, 25, 30, 40]);
          const cost = r * (1 - m / 100);
          return { text: "Revenue ₹" + fmt(r) + " crore, total costs ₹" + fmt(cost) + " crore. Profit margin?", answer: m, tol: { abs: 0.5 }, unit: "%",
            solution: "(" + fmt(r) + " − " + fmt(cost) + ") ÷ " + fmt(r) + " = " + m + "%" };
        }
        const p = rnd(2, 12) * 0.5, y = rnd(3, 12), inv = p * y;
        return { text: "Invest ₹" + fmt(inv) + " crore; annual profit ₹" + fmt(p) + " crore. Payback in years?", answer: y, tol: { abs: 0.1 }, unit: "years",
          solution: fmt(inv) + " ÷ " + fmt(p) + " = " + y + " years" };
      }
    }
  ];
  const CAT = {};
  CATS.forEach(function (c) { CAT[c.id] = c; });

  const MODES = [
    { id: "sprint", label: "Sprint", sub: "2 minutes" },
    { id: "set", label: "Set of 10", sub: "10 questions" },
    { id: "zen", label: "Untimed", sub: "Stop any time" }
  ];

  /* ---------- Answer parsing ---------- */

  const SUFFIX = { k: 1e3, thousand: 1e3, l: 1e5, lac: 1e5, lakh: 1e5, lakhs: 1e5, m: 1e6, mn: 1e6, million: 1e6, cr: 1e7, crore: 1e7, crores: 1e7, b: 1e9, bn: 1e9, billion: 1e9 };
  function parseAnswer(raw) {
    const s = String(raw).toLowerCase().replace(/[,₹\s]/g, "").replace(/%$/, "");
    const m = s.match(/^(-?\d*\.?\d+)([a-z]*)$/);
    if (!m) return NaN;
    const mult = m[2] ? SUFFIX[m[2]] : 1;
    return mult ? parseFloat(m[1]) * mult : NaN;
  }
  function isCorrect(q, v) {
    if (!isFinite(v)) return false;
    if (q.tol && q.tol.abs != null) return Math.abs(v - q.answer) <= q.tol.abs + 1e-9;
    const rel = q.tol && q.tol.rel != null ? q.tol.rel : 0.0001;
    return Math.abs(v - q.answer) <= Math.abs(q.answer) * rel + 1e-9;
  }

  /* ---------- Adaptive levels ---------- */

  let levels = {};
  try { levels = JSON.parse(App.storageGet(LEVEL_KEY) || "{}") || {}; } catch (e) { levels = {}; }
  const levelOf = function (id) { return Math.max(1, Math.min(3, levels[id] || 1)); };
  const saveLevels = function () { App.storageSet(LEVEL_KEY, JSON.stringify(levels)); };

  /* ---------- State & rendering ---------- */

  const choice = { cat: "mixed", mode: "sprint" };
  let run = null;
  let timer = null;

  function catStats() {
    const out = {};
    App.activity().forEach(function (a) {
      if (a.kind !== "drill" || !a.byCat) return;
      Object.keys(a.byCat).forEach(function (k) {
        const s = out[k] || (out[k] = { n: 0, ok: 0 });
        s.n += a.byCat[k].n; s.ok += a.byCat[k].ok;
      });
    });
    return out;
  }

  function levelDots(lv) {
    return '<span class="lvl" title="Level ' + lv + ' of 3">' + [1, 2, 3].map(function (i) { return "<i" + (i <= lv ? ' class="on"' : "") + "></i>"; }).join("") + "</span>";
  }

  function renderHome() {
    clearInterval(timer);
    run = null;
    const stats = catStats();
    const card = function (id, label, example, extra) {
      return '<button type="button" class="dcat" data-cat="' + id + '" aria-pressed="' + (choice.cat === id) + '">' +
        '<span class="dcat-top"><span class="dcat-name">' + label + "</span>" + extra + "</span>" +
        '<span class="dcat-ex">' + esc(example) + "</span></button>";
    };
    root.innerHTML =
      '<div class="page-head"><p class="kicker">Skill builder</p><h1>Mental Maths Driller</h1>' +
      '<p class="subtitle">The arithmetic consulting interviews actually test, in Indian and global units. Difficulty adapts to you: answer fast and right to level up.</p></div>' +
      '<div class="drill-setup">' +
        '<h2 class="step-h"><span>1</span>Pick a skill</h2>' +
        '<div class="dcats">' +
          card("mixed", "Mixed", "A bit of everything", '<span class="badge live">Recommended</span>') +
          CATS.map(function (c) {
            const s = stats[c.id];
            const acc = s && s.n ? '<span class="dcat-acc">' + Math.round(s.ok / s.n * 100) + "%</span>" : "";
            return card(c.id, c.label, "e.g. " + c.example, acc + levelDots(levelOf(c.id)));
          }).join("") +
        "</div>" +
        '<h2 class="step-h"><span>2</span>Pick a mode</h2>' +
        '<div class="seg" role="radiogroup" aria-label="Mode">' + MODES.map(function (m) {
          return '<button type="button" role="radio" data-mode="' + m.id + '" aria-checked="' + (choice.mode === m.id) + '"><b>' + m.label + "</b><span>" + m.sub + "</span></button>";
        }).join("") + "</div>" +
        '<div class="drill-go"><button class="btn lg" type="button" id="drill-start">Start drill</button>' +
        '<p class="note">Type answers like <kbd>4.2k</kbd>, <kbd>1.5m</kbd>, <kbd>3l</kbd> or <kbd>12cr</kbd>. Press <kbd>Enter</kbd> to submit.</p></div>' +
      "</div>";
  }

  function nextQuestion() {
    const id = choice.cat === "mixed" ? pick(CATS).id : choice.cat;
    const lv = levelOf(id);
    const q = CAT[id].make(lv);
    q.cat = id; q.level = lv; q.shownAt = Date.now();
    run.q = q;
    paintRun();
  }

  function paintRun(flash) {
    const q = run.q;
    const c = CAT[q.cat];
    const done = run.items.length;
    let meter = "";
    if (run.mode === "sprint") {
      const left = Math.max(0, Math.ceil((run.endsAt - Date.now()) / 1000));
      meter = '<span class="d-time" id="d-time">' + Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0") + "</span>";
    } else if (run.mode === "set") {
      meter = '<span class="d-time">' + Math.min(done + 1, 10) + " / 10</span>";
    }
    const pct = run.mode === "sprint" ? Math.max(0, (run.endsAt - Date.now()) / 120000) * 100 : run.mode === "set" ? done / 10 * 100 : 0;
    root.innerHTML =
      '<div class="drill-run">' +
        '<div class="d-bar"><div class="d-bar-fill" id="d-fill" style="width:' + pct.toFixed(1) + '%"></div></div>' +
        '<div class="d-top"><span class="d-cat">' + esc(c.label) + levelDots(q.level) + "</span>" +
          '<span class="d-score"><b>' + run.correct + "</b> correct" + (run.streak > 1 ? ' · <span class="d-streak">' + run.streak + " streak</span>" : "") + "</span>" + meter + "</div>" +
        '<p class="d-q">' + esc(q.text) + "</p>" +
        '<form class="d-form" id="d-form" autocomplete="off">' +
          '<input id="d-input" inputmode="decimal" aria-label="Your answer" placeholder="' + (q.unit ? "Answer in " + esc(q.unit) : "Your answer") + '">' +
          '<button class="btn lg" type="submit">Check</button>' +
        "</form>" +
        '<p class="d-flash' + (flash ? " " + flash.kind : "") + '" id="d-flash" aria-live="polite">' + (flash ? flash.html : "&nbsp;") + "</p>" +
        '<div class="d-actions"><button class="linkish" type="button" id="d-skip">Skip</button><button class="linkish" type="button" id="d-end">End drill</button></div>' +
      "</div>";
    const input = document.getElementById("d-input");
    input.focus({ preventScroll: true });
  }

  function record(value, skipped) {
    const q = run.q;
    const ms = Date.now() - q.shownAt;
    const ok = !skipped && isCorrect(q, value);
    run.items.push({ cat: q.cat, level: q.level, text: q.text, answer: q.answer, unit: q.unit, given: skipped ? null : value, ok: ok, ms: ms, solution: q.solution });
    // Adaptive level: three fast right answers in a row step up; two misses step down.
    const c = CAT[q.cat];
    const st = run.adapt[q.cat] || (run.adapt[q.cat] = { up: 0, down: 0 });
    if (ok && ms / 1000 <= c.target[q.level - 1]) { st.up++; st.down = 0; } else if (!ok) { st.down++; st.up = 0; } else { st.up = 0; }
    if (st.up >= 3 && q.level < 3) { levels[q.cat] = q.level + 1; st.up = 0; run.levelUps++; }
    if (st.down >= 2 && q.level > 1) { levels[q.cat] = q.level - 1; st.down = 0; }
    saveLevels();
    if (ok) { run.correct++; run.streak++; run.best = Math.max(run.best, run.streak); } else run.streak = 0;
    return ok;
  }

  function submit(raw) {
    if (!run) return;
    const v = parseAnswer(raw);
    if (!isFinite(v)) {
      const f = document.getElementById("d-flash");
      f.className = "d-flash warn"; f.textContent = "Enter a number, e.g. 4,200 or 4.2k.";
      return;
    }
    const q = run.q;
    const ok = record(v, false);
    const flash = ok
      ? { kind: "ok", html: "Correct · " + (run.items[run.items.length - 1].ms / 1000).toFixed(1) + "s" }
      : { kind: "bad", html: "Not quite. " + esc(q.solution) };
    afterAnswer(flash);
  }

  function afterAnswer(flash) {
    if (run.mode === "set" && run.items.length >= 10) return finish();
    if (run.mode === "sprint" && Date.now() >= run.endsAt) return finish();
    nextQuestion();
    if (flash) {
      const f = document.getElementById("d-flash");
      f.className = "d-flash " + flash.kind; f.innerHTML = flash.html;
    }
  }

  function start() {
    run = { mode: choice.mode, cat: choice.cat, items: [], correct: 0, streak: 0, best: 0, levelUps: 0, adapt: {}, startedAt: Date.now(), endsAt: Date.now() + 120000 };
    clearInterval(timer);
    if (run.mode === "sprint") {
      timer = setInterval(function () {
        if (!run) return clearInterval(timer);
        const left = Math.max(0, run.endsAt - Date.now());
        const t = document.getElementById("d-time");
        const fill = document.getElementById("d-fill");
        const secs = Math.ceil(left / 1000);
        if (t) t.textContent = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
        if (fill) fill.style.width = (left / 120000 * 100).toFixed(1) + "%";
        if (left <= 0) finish();
      }, 250);
    }
    nextQuestion();
  }

  function finish() {
    clearInterval(timer);
    if (!run) return;
    const r = run;
    run = null;
    const n = r.items.length;
    if (!n) return renderHome();
    const byCat = {};
    r.items.forEach(function (it) {
      const s = byCat[it.cat] || (byCat[it.cat] = { n: 0, ok: 0, ms: 0 });
      s.n++; if (it.ok) s.ok++; s.ms += it.ms;
    });
    const acc = n ? Math.round(r.correct / n * 100) : 0;
    const avg = n ? r.items.reduce(function (a, it) { return a + it.ms; }, 0) / n / 1000 : 0;
    if (n) App.log("drill", { mode: r.mode, cat: r.cat, n: n, correct: r.correct, avgSec: Math.round(avg * 10) / 10, best: r.best, byCat: byCat });

    const misses = r.items.filter(function (it) { return !it.ok; });
    const weakest = Object.keys(byCat).sort(function (a, b) { return byCat[a].ok / byCat[a].n - byCat[b].ok / byCat[b].n; })[0];
    root.innerHTML =
      '<div class="page-head"><p class="kicker">Drill complete</p><h1>' + (acc >= 85 ? "Sharp work." : acc >= 60 ? "Solid round." : "Good reps. Keep going.") + "</h1></div>" +
      '<ul class="kpis">' +
        '<li><span>Accuracy</span><b>' + acc + "%</b><small>" + r.correct + " of " + n + " correct</small></li>" +
        "<li><span>Average time</span><b>" + avg.toFixed(1) + "s</b><small>per question</small></li>" +
        "<li><span>Best streak</span><b>" + r.best + "</b><small>in a row</small></li>" +
        "<li><span>Level-ups</span><b>" + r.levelUps + "</b><small>difficulty adapts to you</small></li>" +
      "</ul>" +
      (n ? '<div class="box d-break"><h3>By skill</h3><table class="plain"><thead><tr><th>Skill</th><th class="num">Accuracy</th><th class="num">Avg time</th><th>Level now</th></tr></thead><tbody>' +
        Object.keys(byCat).map(function (k) {
          const s = byCat[k];
          return "<tr><td>" + esc(CAT[k].label) + '</td><td class="num">' + Math.round(s.ok / s.n * 100) + "% <span class=\"muted\">(" + s.ok + "/" + s.n + ')</span></td><td class="num">' + (s.ms / s.n / 1000).toFixed(1) + "s</td><td>" + levelDots(levelOf(k)) + "</td></tr>";
        }).join("") + "</tbody></table>" +
        (weakest ? '<p class="d-tip"><b>Method tip · ' + esc(CAT[weakest].label) + ":</b> " + esc(CAT[weakest].tip) + "</p>" : "") +
        "</div>" : "") +
      (misses.length ? '<div class="box d-review"><h3>Review your misses</h3><ol>' + misses.slice(0, 12).map(function (it) {
        return "<li><span class=\"q\">" + esc(it.text) + "</span><span class=\"a\">" + (it.given == null ? "Skipped" : "You said " + esc(fmt(it.given))) + " · " + esc(it.solution) + "</span></li>";
      }).join("") + "</ol></div>" : "") +
      '<div class="d-end-actions"><button class="btn lg" type="button" id="drill-again">Go again</button><button class="btn ghost lg" type="button" id="drill-back">Change skill or mode</button><a class="btn ghost lg" href="#progress">See your progress</a></div>';
  }

  /* ---------- Events ---------- */

  root.addEventListener("click", function (e) {
    const cat = e.target.closest("[data-cat]");
    if (cat) { choice.cat = cat.dataset.cat; root.querySelectorAll("[data-cat]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === cat)); }); return; }
    const mode = e.target.closest("[data-mode]");
    if (mode) { choice.mode = mode.dataset.mode; root.querySelectorAll("[data-mode]").forEach(function (b) { b.setAttribute("aria-checked", String(b === mode)); }); return; }
    const id = e.target.id;
    if (id === "drill-start" || id === "drill-again") start();
    else if (id === "drill-back") renderHome();
    else if (id === "d-skip" && run) { record(null, true); afterAnswer({ kind: "bad", html: "Skipped. " + esc(run.items[run.items.length - 1].solution) }); }
    else if (id === "d-end") finish();
  });
  root.addEventListener("submit", function (e) {
    if (e.target.id !== "d-form") return;
    e.preventDefault();
    submit(document.getElementById("d-input").value);
  });

  App.onRoute(function (route) {
    if (route.tab !== "drill") { if (run) { clearInterval(timer); run = null; } return; }
    if (route.arg && (CAT[route.arg] || route.arg === "mixed")) choice.cat = route.arg;
    if (!run) renderHome();
  });

  // Exposed for tests.
  window.Drill = { parseAnswer: parseAnswer, isCorrect: isCorrect, cats: CATS, current: function () { return run && run.q; } };
})();
