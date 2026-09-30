/* Question bank: filtering and rendering. Filter options are derived from
 * the data, so adding a new industry or firm in data/questions.js is enough. */
(function () {
  const App = window.App;
  const esc = App.escapeHtml;
  const DIFFICULTIES = ["Easy", "Medium", "Hard"];

  // A question can list more than one firm ("Bain / BCG"); each counts for filtering.
  const FIELDS = {
    industry: function (q) { return [q.industry]; },
    type: function (q) { return [q.type]; },
    approach: function (q) { return [q.approach]; },
    firm: function (q) { return (q.firm || "").split(" / ").filter(Boolean); }
  };
  const ALL_LABEL = { industry: "All industries", type: "All types", approach: "All approaches", firm: "All firms" };

  const state = { search: "", difficulty: new Set(), industry: "", type: "", approach: "", firm: "" };

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
      const hay = [q.id, q.title, q.industry, q.type, q.approach, q.geography, q.firm].join(" ").toLowerCase();
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
        '<div class="qactions">' +
          (window.TRANSCRIPTS && window.TRANSCRIPTS[q.id] ? '<a class="btn ghost" href="#bank/' + encodeURIComponent(q.id) + '">Read model interview</a>' : "") +
          '<a class="btn" href="#ai/' + encodeURIComponent(q.id) + '">Practise with AI</a>' +
        "</div>" +
        '<div class="qmeta">' +
          '<span class="diff ' + esc(diff) + '">' + esc(q.difficulty) + "</span>" +
          (q.firm ? '<span class="firm">Asked at ' + esc(q.firm) + "</span>" : "") +
          "<span>" + esc(q.industry) + "</span>" +
          "<span>" + esc(q.type) + "</span>" +
          "<span>" + esc(q.approach) + "</span>" +
          (q.geography ? "<span>" + esc(q.geography) + "</span>" : "") +
        "</div>" +
        (q.hint ? "<details><summary>Show hint</summary><p>" + esc(q.hint) + "</p></details>" : "") +
      "</li>"
    );
  }

  let results = App.questions;

  function render() {
    results = App.questions.filter(matches);
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

  /* ---------- Model interview reader (#bank/<id>) ---------- */

  const T = window.TRANSCRIPTS || {};
  const rd = {
    root: document.getElementById("reader"),
    kicker: document.getElementById("reader-kicker"),
    title: document.getElementById("reader-title"),
    meta: document.getElementById("reader-meta"),
    body: document.getElementById("reader-body"),
    prev: document.getElementById("reader-prev"),
    next: document.getElementById("reader-next"),
    practise: document.getElementById("reader-practise")
  };
  let openId = null;
  let returnFocus = null;

  // Prev/next follow the list as currently filtered, so readers can work through a set.
  function neighbours(id) {
    const list = results.filter(function (q) { return T[q.id]; });
    const i = list.findIndex(function (q) { return q.id === id; });
    return { prev: i > 0 ? list[i - 1] : null, next: i >= 0 && i < list.length - 1 ? list[i + 1] : null };
  }

  function openReader(id) {
    const q = App.findQuestion(id);
    const t = T[id];
    if (!q || !t) return closeReader();
    if (!openId) returnFocus = document.activeElement;
    openId = id;
    rd.kicker.innerHTML = "Model interview · " + esc(q.id) + ' <a href="#" class="skip" id="reader-skip">Skip to answer</a>';
    rd.title.textContent = q.title;
    rd.meta.textContent = [q.difficulty, q.firm ? "Asked at " + q.firm : "", q.industry, q.approach].filter(Boolean).join(" · ");
    rd.body.innerHTML =
      '<ol class="transcript">' + t.turns.map(function (turn) {
        const who = turn[0] === "I" ? "Interviewer" : "Candidate";
        return '<li class="turn ' + (turn[0] === "I" ? "is-i" : "is-c") + '"><span class="spk">' + who + '</span><div class="txt">' + App.renderMarkdown(turn[1]) + "</div></li>";
      }).join("") + "</ol>" +
      '<section class="reader-answer" id="reader-answer"><h3 class="lbl">Final answer</h3><p>' + esc(t.answer) + "</p>" +
      '<h3 class="lbl">Key takeaway</h3><p>' + esc(t.takeaway) + "</p></section>" +
      '<p class="reader-note">A model answer with illustrative assumptions. In a real interview, your numbers can differ; the structure and reasoning are what count.</p>';
    const n = neighbours(id);
    rd.prev.disabled = !n.prev;
    rd.next.disabled = !n.next;
    rd.prev.dataset.id = n.prev ? n.prev.id : "";
    rd.next.dataset.id = n.next ? n.next.id : "";
    rd.practise.href = "#ai/" + encodeURIComponent(id);
    rd.root.hidden = false;
    document.body.classList.add("reader-open");
    rd.body.scrollTop = 0;
    rd.body.focus({ preventScroll: true });
    document.getElementById("reader-skip").addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("reader-answer").scrollIntoView({ block: "start" });
    });
  }

  function closeReader() {
    if (!openId && rd.root.hidden) return;
    openId = null;
    rd.root.hidden = true;
    document.body.classList.remove("reader-open");
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
  }

  function leaveReader() { location.hash = "bank"; }

  rd.root.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) leaveReader();
  });
  rd.prev.addEventListener("click", function () { if (rd.prev.dataset.id) location.hash = "bank/" + rd.prev.dataset.id; });
  rd.next.addEventListener("click", function () { if (rd.next.dataset.id) location.hash = "bank/" + rd.next.dataset.id; });
  document.addEventListener("keydown", function (e) {
    if (!openId) return;
    if (e.key === "Escape") leaveReader();
    else if (e.key === "ArrowRight" && !rd.next.disabled) rd.next.click();
    else if (e.key === "ArrowLeft" && !rd.prev.disabled) rd.prev.click();
  });

  App.onRoute(function (route) {
    if (route.tab === "bank" && route.arg) openReader(route.arg);
    else closeReader();
  });
})();
