/* Question bank: filtering and rendering. Filter options are derived from
 * the data, so adding a new industry, firm or source in data/questions.js is enough. */
(function () {
  const App = window.App;
  const esc = App.escapeHtml;
  const DIFFICULTIES = ["Easy", "Medium", "Hard"];

  // Several filters use a derived value: a question can list more than one
  // firm ("Bain / BCG"), and both 180DC volumes group under one book.
  const FIELDS = {
    industry: function (q) { return [q.industry]; },
    type: function (q) { return [q.type]; },
    approach: function (q) { return [q.approach]; },
    firm: function (q) { return (q.firm || "").split(" / ").filter(Boolean); },
    book: function (q) { return [App.bookOf(q)]; }
  };
  const ALL_LABEL = { industry: "All industries", type: "All types", approach: "All approaches", firm: "All firms", book: "All sources" };

  const state = { search: "", difficulty: new Set(), industry: "", type: "", approach: "", firm: "", book: "" };

  const el = {
    search: document.getElementById("f-search"),
    difficulty: document.getElementById("f-difficulty"),
    clear: document.getElementById("f-clear"),
    count: document.getElementById("result-count"),
    list: document.getElementById("qlist")
  };
  Object.keys(FIELDS).forEach(function (k) { el[k] = document.getElementById("f-" + k); });

  function options(key) {
    const seen = new Set();
    App.questions.forEach(function (q) { FIELDS[key](q).forEach(function (v) { if (v) seen.add(v); }); });
    return Array.from(seen).sort();
  }

  function buildControls() {
    el.difficulty.innerHTML = DIFFICULTIES.map(function (d) {
      return '<button type="button" class="chip" aria-pressed="false" data-value="' + d + '">' + d + "</button>";
    }).join("");
    Object.keys(FIELDS).forEach(function (k) {
      el[k].innerHTML = '<option value="">' + esc(ALL_LABEL[k]) + "</option>" +
        options(k).map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + "</option>"; }).join("");
    });
  }

  function matches(q) {
    if (state.difficulty.size && !state.difficulty.has(q.difficulty)) return false;
    for (const k in FIELDS) {
      if (state[k] && FIELDS[k](q).indexOf(state[k]) === -1) return false;
    }
    if (state.search) {
      const hay = [q.id, q.title, q.industry, q.type, q.approach, q.geography, q.firm, q.source].join(" ").toLowerCase();
      const terms = state.search.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.every(function (t) { return hay.includes(t); })) return false;
    }
    return true;
  }

  function card(q) {
    const diff = (q.difficulty || "").toLowerCase();
    return (
      '<li class="qitem">' +
        '<span class="qid">' + esc(q.id) + "</span>" +
        '<p class="qtitle">' + esc(q.title) + "</p>" +
        '<div class="qactions"><a class="btn" href="#ai/' + encodeURIComponent(q.id) + '">Practise with AI</a></div>' +
        '<div class="qmeta">' +
          '<span class="diff ' + esc(diff) + '">' + esc(q.difficulty) + "</span>" +
          (q.firm ? '<span class="firm">Asked at ' + esc(q.firm) + "</span>" : "") +
          "<span>" + esc(q.industry) + "</span>" +
          "<span>" + esc(q.type) + "</span>" +
          "<span>" + esc(q.approach) + "</span>" +
          (q.geography ? "<span>" + esc(q.geography) + "</span>" : "") +
        "</div>" +
        '<details><summary>Hint &amp; source</summary>' +
          (q.hint ? "<p><em>Hint.</em> " + esc(q.hint) + "</p>" : "") +
          '<p class="src"><em>Source.</em> ' + esc(q.source) + "</p>" +
        "</details>" +
      "</li>"
    );
  }

  function render() {
    const results = App.questions.filter(matches);
    el.count.textContent = results.length + " of " + App.questions.length + " questions";
    el.list.innerHTML = results.length
      ? results.map(card).join("")
      : '<li class="empty">No questions match these filters.</li>';
  }

  buildControls();

  el.search.addEventListener("input", function () { state.search = el.search.value.trim(); render(); });
  el.difficulty.addEventListener("click", function (e) {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const v = chip.dataset.value;
    if (state.difficulty.has(v)) state.difficulty.delete(v); else state.difficulty.add(v);
    chip.setAttribute("aria-pressed", String(state.difficulty.has(v)));
    render();
  });
  Object.keys(FIELDS).forEach(function (k) {
    el[k].addEventListener("change", function () { state[k] = el[k].value; render(); });
  });
  el.clear.addEventListener("click", function () {
    state.search = "";
    el.search.value = "";
    Object.keys(FIELDS).forEach(function (k) { state[k] = ""; el[k].value = ""; });
    state.difficulty.clear();
    el.difficulty.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
    render();
  });

  render();
})();
