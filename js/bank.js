/* Question bank: filtering and rendering. Filter options are derived from
 * the data, so adding a new industry or type in data/questions.js is enough. */
(function () {
  const App = window.App;
  const esc = App.escapeHtml;
  const DIFFICULTIES = ["Easy", "Medium", "Hard"];

  const state = { search: "", difficulty: new Set(), industry: "", type: "", approach: "" };

  const el = {
    search: document.getElementById("f-search"),
    difficulty: document.getElementById("f-difficulty"),
    industry: document.getElementById("f-industry"),
    type: document.getElementById("f-type"),
    approach: document.getElementById("f-approach"),
    clear: document.getElementById("f-clear"),
    count: document.getElementById("result-count"),
    list: document.getElementById("qlist")
  };

  function uniqueSorted(field) {
    return Array.from(new Set(App.questions.map(function (q) { return q[field]; }).filter(Boolean))).sort();
  }

  function fillSelect(select, field, allLabel) {
    select.innerHTML = '<option value="">' + esc(allLabel) + "</option>" +
      uniqueSorted(field).map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + "</option>"; }).join("");
  }

  function buildControls() {
    el.difficulty.innerHTML = DIFFICULTIES.map(function (d) {
      return '<button type="button" class="chip" aria-pressed="false" data-value="' + d + '">' + d + "</button>";
    }).join("");
    fillSelect(el.industry, "industry", "All industries");
    fillSelect(el.type, "type", "All types");
    fillSelect(el.approach, "approach", "All approaches");
  }

  function matches(q) {
    if (state.difficulty.size && !state.difficulty.has(q.difficulty)) return false;
    if (state.industry && q.industry !== state.industry) return false;
    if (state.type && q.type !== state.type) return false;
    if (state.approach && q.approach !== state.approach) return false;
    if (state.search) {
      const hay = [q.id, q.title, q.industry, q.type, q.approach, q.geography].concat(q.tags || []).join(" ").toLowerCase();
      const terms = state.search.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.every(function (t) { return hay.includes(t); })) return false;
    }
    return true;
  }

  function card(q) {
    const diff = (q.difficulty || "").toLowerCase();
    const extras = [];
    if (q.hint) extras.push("<p><em>Hint.</em> " + esc(q.hint) + "</p>");
    if (q.solution) extras.push("<p><em>Solution outline.</em> " + esc(q.solution) + "</p>");
    return (
      '<li class="q">' +
        '<span class="qid">' + esc(q.id) + "</span>" +
        '<p class="qtitle">' + esc(q.title) + "</p>" +
        '<div class="qactions"><a class="btn" href="#ai/' + encodeURIComponent(q.id) + '">Practise with AI</a></div>' +
        '<div class="qmeta">' +
          '<span class="diff ' + esc(diff) + '">' + esc(q.difficulty) + "</span>" +
          "<span>" + esc(q.industry) + "</span>" +
          "<span>" + esc(q.type) + "</span>" +
          "<span>" + esc(q.approach) + "</span>" +
          (q.geography ? "<span>" + esc(q.geography) + "</span>" : "") +
        "</div>" +
        (extras.length ? "<details><summary>Hint &amp; solution outline</summary>" + extras.join("") + "</details>" : "") +
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
  ["industry", "type", "approach"].forEach(function (k) {
    el[k].addEventListener("change", function () { state[k] = el[k].value; render(); });
  });
  el.clear.addEventListener("click", function () {
    state.search = ""; state.industry = ""; state.type = ""; state.approach = "";
    state.difficulty.clear();
    el.search.value = ""; el.industry.value = ""; el.type.value = ""; el.approach.value = "";
    el.difficulty.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
    render();
  });

  render();
})();
