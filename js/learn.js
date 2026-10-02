/* Shared script for the standalone Learn pages (learn/*.html).
 * Each feature runs only if its elements exist on the current page:
 *   - worked-example stepper (#stepper)
 *   - India Numbers Bible tabs, tables and charts (#numbers-tabs)
 */
(function () {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ---------- Charts (monochrome SVG, direct labels, hover titles) ---------- */

  // Sequential ink tints, dark → light. Text on the first two uses paper colour.
  const TINTS = ["#14286b", "#2457f5", "#4a6cf0", "#b8c8ff", "#d9e3ff", "#edf2ff", "#f3f6ff", "#f7f9ff"];
  const fmt = function (v) { return (Math.round(v * 10) / 10).toLocaleString("en-IN"); };

  function hbar(c) {
    const W = 640, labelW = 150, rowH = 30, barH = 16, top = 6;
    const max = Math.max.apply(null, c.rows.map(function (r) { return r[1]; }));
    const plotW = W - labelW - 70;
    const H = top + c.rows.length * rowH;
    let svg = '<svg class="ill" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(c.title) + '">';
    c.rows.forEach(function (r, i) {
      const y = top + i * rowH;
      const w = Math.max(2, (r[1] / max) * plotW);
      svg += '<text x="' + (labelW - 10) + '" y="' + (y + barH - 3) + '" class="end">' + esc(r[0]) + "</text>" +
        '<rect class="hit" x="' + labelW + '" y="' + y + '" width="' + w.toFixed(1) + '" height="' + barH + '" rx="2" fill="#14286b"><title>' +
        esc(r[0] + ": " + fmt(r[1]) + (c.unit || "")) + "</title></rect>" +
        '<text x="' + (labelW + w + 8).toFixed(1) + '" y="' + (y + barH - 3) + '" class="sm">' + fmt(r[1]) + esc(c.unit || "") + "</text>";
    });
    return svg + "</svg>";
  }

  function stack(c) {
    const W = 640, H = 40;
    const total = c.rows.reduce(function (a, r) { return a + r[1]; }, 0);
    let x = 0, svg = '<svg class="ill" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(c.title) + '">';
    c.rows.forEach(function (r, i) {
      const w = (r[1] / total) * W;
      const fill = TINTS[Math.min(i, TINTS.length - 1)];
      svg += '<rect class="hit gap" x="' + x.toFixed(1) + '" y="0" width="' + Math.max(1, w).toFixed(1) + '" height="' + H + '" fill="' + fill + '"><title>' +
        esc(r[0] + ": " + fmt(r[1]) + "%") + "</title></rect>";
      if (w > 78) {
        svg += '<text x="' + (x + 10).toFixed(1) + '" y="' + (H / 2 + 5) + '"' + (i < 2 ? ' class="on-dark"' : "") + ">" +
          esc(r[0]) + " " + fmt(r[1]) + "%</text>";
      }
      x += w;
    });
    svg += "</svg>";
    const legend = '<ul class="legend">' + c.rows.map(function (r, i) {
      return '<li><i style="background:' + TINTS[Math.min(i, TINTS.length - 1)] + ';outline:1px solid #d9e3ff"></i>' + esc(r[0]) + " <b>" + fmt(r[1]) + "%</b></li>";
    }).join("") + "</ul>";
    return svg + legend;
  }

  function pair(c) {
    const W = 640, labelW = 120, groupH = 58, barH = 16, top = 4, plotW = W - labelW - 110;
    const fills = ["#14286b", "#b8c8ff"];
    const H = top + c.rows.length * groupH;
    let svg = '<svg class="ill" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(c.title) + '">';
    c.rows.forEach(function (r, i) {
      const y = top + i * groupH;
      svg += '<text x="' + (labelW - 10) + '" y="' + (y + barH + 6) + '" class="end">' + esc(r[0]) + "</text>";
      [1, 2].forEach(function (k, j) {
        const w = (r[k] / 100) * plotW, by = y + j * (barH + 4);
        svg += '<rect class="hit" x="' + labelW + '" y="' + by + '" width="' + w.toFixed(1) + '" height="' + barH + '" rx="2" fill="' + fills[j] + '"><title>' +
          esc(c.series[j] + " " + r[0].toLowerCase() + ": " + r[k] + "%") + "</title></rect>" +
          '<text x="' + (labelW + w + 8).toFixed(1) + '" y="' + (by + barH - 3) + '" class="sm">' + r[k] + "% " + esc(c.series[j].toLowerCase()) + "</text>";
      });
    });
    svg += "</svg>";
    const legend = '<ul class="legend">' + c.series.map(function (s, j) {
      return '<li><i style="background:' + fills[j] + '"></i>' + esc(s) + "</li>";
    }).join("") + "</ul>";
    return svg + legend;
  }

  function chart(c) {
    const body = c.type === "hbar" ? hbar(c) : c.type === "pair" ? pair(c) : stack(c);
    return '<figure class="fig box' + (c.wide ? " wide" : "") + '" style="margin:0"><p class="fig-title">' + esc(c.title) + "</p>" + body + "</figure>";
  }

  /* ---------- India Numbers Bible ---------- */

  const tabsEl = document.getElementById("numbers-tabs");
  if (tabsEl) {
    const groups = window.INDIA_NUMBERS || [];
    const charts = window.INDIA_CHARTS || {};
    const panelsEl = document.getElementById("numbers-panels");

    const rowHtml = function (r) {
      return "<tr><td>" + esc(r.metric) + "</td><td>" + esc(r.value) +
        (r.approx ? '<span class="flag" title="Working assumption or low-precision figure">approx.</span>' : "") +
        '</td><td class="src">' + esc(r.source) + '</td><td class="yr">' + esc(r.year) + "</td></tr>";
    };

    tabsEl.innerHTML = groups.map(function (g) {
      return '<button type="button" role="tab" id="tab-' + esc(g.id) + '" aria-controls="panel-' + esc(g.id) + '" data-group="' + esc(g.id) + '">' + esc(g.label) + " variables</button>";
    }).join("");

    panelsEl.innerHTML = groups.map(function (g) {
      return '<div class="num-group" role="tabpanel" id="panel-' + esc(g.id) + '" aria-labelledby="tab-' + esc(g.id) + '">' +
        (charts[g.id] ? '<div class="charts">' + charts[g.id].map(chart).join("") + "</div>" : "") +
        '<h2 style="margin-top:2.4rem">All ' + esc(g.label.toLowerCase()) + " figures</h2>" +
        g.sections.map(function (s) {
          return '<div class="box"><h3>' + esc(s.title) + '</h3><table class="plain numbers"><thead><tr><th>Metric</th><th>Value</th><th>Source</th><th>Year</th></tr></thead><tbody>' +
            s.rows.map(rowHtml).join("") + "</tbody></table></div>";
        }).join("") + "</div>";
    }).join("");

    const select = function (id) {
      if (!groups.some(function (g) { return g.id === id; })) id = groups[0].id;
      tabsEl.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.group === id)); });
      panelsEl.querySelectorAll(".num-group").forEach(function (p) { p.hidden = p.id !== "panel-" + id; });
    };
    tabsEl.addEventListener("click", function (e) {
      const b = e.target.closest("button");
      if (!b) return;
      history.replaceState(null, "", "#" + b.dataset.group);
      select(b.dataset.group);
    });
    window.addEventListener("hashchange", function () { select(location.hash.slice(1)); });
    select(location.hash.slice(1));
  }

  /* ---------- Worked example stepper ---------- */

  const stepper = document.getElementById("stepper");
  if (stepper) {
    const steps = Array.from(stepper.querySelectorAll(".step-x"));
    const progress = document.getElementById("stepper-progress");
    const nextBtn = document.getElementById("stepper-next");
    let revealed = 1;

    const setOpen = function (step, open) {
      step.dataset.open = String(open);
      step.querySelector(".body").hidden = !open;
      step.querySelector("button").setAttribute("aria-expanded", String(open));
    };
    const paint = function () {
      steps.forEach(function (step, i) {
        const locked = i >= revealed;
        step.dataset.locked = String(locked);
        step.querySelector("button").disabled = locked;
        if (locked) setOpen(step, false);
      });
      progress.textContent = "Step " + revealed + " of " + steps.length + " revealed";
      nextBtn.disabled = revealed >= steps.length;
    };

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
      paint();
      setOpen(steps[revealed - 1], true);
      steps[revealed - 1].scrollIntoView({ block: "nearest" });
    });
    document.getElementById("stepper-all").addEventListener("click", function () {
      revealed = steps.length;
      paint();
      steps.forEach(function (s) { setOpen(s, true); });
    });
    document.getElementById("stepper-reset").addEventListener("click", function () {
      revealed = 1;
      paint();
      steps.forEach(function (s, i) { setOpen(s, i === 0); });
      window.scrollTo(0, 0);
    });
    paint();
  }
})();
