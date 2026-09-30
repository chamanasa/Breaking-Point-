/* AI Mode: a Gemini-powered guesstimate interviewer.
 *
 * Flow: connect a key (setup steps) → pick a question → chat with the interviewer.
 * Runs entirely in the browser. The user's API key is kept in localStorage
 * and sent only to Google's Generative Language API.
 */
(function () {
  const App = window.App;
  const esc = App.escapeHtml;

  const API_BASE = "https://generativelanguage.googleapis.com/v1beta";
  const DEFAULT_MODEL = "gemini-2.5-flash";
  const KEY_STORE = "bp.geminiKey";
  const MODEL_STORE = "bp.geminiModel";
  const DIFFICULTIES = ["Easy", "Medium", "Hard"];

  const $ = function (id) { return document.getElementById(id); };
  const el = {
    setup: $("ai-setup"), connected: $("ai-connected"), chatShell: $("ai-chat"),
    key: $("api-key"), keyToggle: $("key-toggle"), keySave: $("key-save"),
    keyChange: $("key-change"), keyClear: $("key-clear"), model: $("model"), status: $("key-status"),
    pickSearch: $("pick-search"), pickDiff: $("pick-diff"), pickList: $("pick-list"), pickRandom: $("pick-random"),
    qTitle: $("chat-q-title"), qMeta: $("chat-q-meta"), timer: $("timer"), start: $("ai-start"),
    chat: $("chat"), empty: $("empty-chat"), composer: $("composer"), input: $("ai-input"),
    send: $("ai-send"), hint: $("ai-hint"), feedback: $("ai-feedback")
  };

  // Conversation in Gemini's format: [{ role: "user"|"model", parts: [{ text }] }]
  let session = null; // { question, contents, busy, startedAt }
  let selectedId = null;
  let timerHandle = null;

  /* ---------- Key & model ---------- */

  function getKey() { return (App.storageGet(KEY_STORE) || "").trim(); }
  function getModel() { return (el.model.value || DEFAULT_MODEL).trim(); }

  function setStatus(text, kind) {
    el.status.textContent = text;
    el.status.className = "status" + (kind ? " " + kind : "");
  }

  async function readError(res) {
    try {
      const data = await res.json();
      if (data && data.error && data.error.message) return data.error.message;
    } catch (e) { /* fall through */ }
    return "Request failed with HTTP " + res.status + ".";
  }

  async function testKey(key) {
    const res = await fetch(API_BASE + "/models?pageSize=1", { headers: { "x-goog-api-key": key } });
    if (!res.ok) throw new Error(await readError(res));
  }

  // Setup steps are shown until a key is saved; then the chat takes over.
  function paintConnection() {
    const has = !!getKey();
    el.setup.hidden = has;
    el.connected.hidden = !has;
    el.chatShell.hidden = !has;
  }

  el.key.value = getKey();
  el.model.value = App.storageGet(MODEL_STORE) || DEFAULT_MODEL;

  el.keyToggle.addEventListener("click", function () {
    const show = el.key.type === "password";
    el.key.type = show ? "text" : "password";
    el.keyToggle.textContent = show ? "Hide" : "Show";
  });

  async function connect() {
    const key = el.key.value.trim();
    if (!key) { setStatus("Paste your key first.", "err"); el.key.focus(); return; }
    el.keySave.disabled = true;
    setStatus("Checking your key with Google…");
    try {
      await testKey(key);
      App.storageSet(KEY_STORE, key);
      setStatus("Connected.", "ok");
      paintConnection();
      el.chatShell.scrollIntoView({ block: "start" });
    } catch (err) {
      setStatus("Google didn't accept this key: " + err.message, "err");
    } finally {
      el.keySave.disabled = false;
    }
  }
  el.keySave.addEventListener("click", connect);
  el.key.addEventListener("keydown", function (e) { if (e.key === "Enter") connect(); });

  el.keyChange.addEventListener("click", function () {
    el.setup.hidden = false;
    el.key.value = getKey();
    setStatus("Paste a new key and click Connect.");
    el.key.focus();
  });
  el.keyClear.addEventListener("click", function () {
    App.storageSet(KEY_STORE, null);
    el.key.value = "";
    setStatus("Key removed from this browser.");
    paintConnection();
  });
  el.model.addEventListener("change", function () {
    App.storageSet(MODEL_STORE, el.model.value.trim() || null);
  });

  /* ---------- Question picker ---------- */

  const pick = { search: "", diff: new Set() };

  el.pickDiff.innerHTML = DIFFICULTIES.map(function (d) {
    return '<button type="button" class="chip" aria-pressed="false" data-value="' + d + '">' + d + "</button>";
  }).join("");

  function pickMatches(q) {
    if (pick.diff.size && !pick.diff.has(q.difficulty)) return false;
    if (!pick.search) return true;
    const hay = [q.id, q.title, q.industry, q.firm, q.geography].join(" ").toLowerCase();
    return pick.search.toLowerCase().split(/\s+/).every(function (t) { return hay.includes(t); });
  }

  function renderPicker() {
    const items = App.questions.filter(pickMatches);
    el.pickList.innerHTML = items.length ? items.map(function (q) {
      return '<li><button type="button" data-id="' + esc(q.id) + '" aria-pressed="' + (q.id === selectedId) + '">' +
        esc(q.title.replace(/^Estimate (the )?/i, "").replace(/^./, function (c) { return c.toUpperCase(); })) +
        '<span class="pm"><span class="diff ' + esc(q.difficulty.toLowerCase()) + '">' + esc(q.difficulty) + "</span>" +
        (q.firm ? " · " + esc(q.firm) : "") + " · " + esc(q.id) + "</span></button></li>";
    }).join("") : '<li class="empty" style="padding:1rem">No matches.</li>';
  }

  function metaLine(q) {
    return [q.difficulty, q.firm ? "Asked at " + q.firm : "", q.industry, q.approach].filter(Boolean).join(" · ");
  }

  function select(id, opts) {
    const q = App.findQuestion(id);
    if (!q) return;
    selectedId = id;
    renderPicker();
    if (!session || session.question.id !== id) {
      el.qTitle.textContent = q.title;
      el.qMeta.textContent = metaLine(q);
      el.start.disabled = false;
      el.start.textContent = session ? "Start this one" : "Start interview";
    }
    if (opts && opts.scroll) {
      const btn = el.pickList.querySelector('[data-id="' + id + '"]');
      if (btn) btn.scrollIntoView({ block: "center" });
    }
  }

  el.pickList.addEventListener("click", function (e) {
    const b = e.target.closest("button[data-id]");
    if (b) select(b.dataset.id);
  });
  el.pickSearch.addEventListener("input", function () { pick.search = el.pickSearch.value.trim(); renderPicker(); });
  el.pickDiff.addEventListener("click", function (e) {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const v = chip.dataset.value;
    if (pick.diff.has(v)) pick.diff.delete(v); else pick.diff.add(v);
    chip.setAttribute("aria-pressed", String(pick.diff.has(v)));
    renderPicker();
  });
  el.pickRandom.addEventListener("click", function () {
    const pool = App.questions.filter(pickMatches);
    const list = pool.length ? pool : App.questions;
    select(list[Math.floor(Math.random() * list.length)].id, { scroll: true });
  });

  App.onRoute(function (route) {
    if (route.tab !== "ai") return;
    paintConnection();
    if (route.arg && App.findQuestion(route.arg)) select(route.arg, { scroll: true });
  });

  /* ---------- Prompting ---------- */

  function systemPrompt(q) {
    return [
      "You are a seasoned management-consulting interviewer (McKinsey/BCG/Bain style) running a live guesstimate interview.",
      "",
      "THE QUESTION: " + q.title,
      "Difficulty: " + q.difficulty + ". Industry: " + q.industry + ". Suggested approach: " + q.approach + (q.geography ? ". Geography: " + q.geography : "") + ".",
      q.firm ? "This question has been asked in interviews at " + q.firm + "." : "",
      q.hint ? "A good structure (private; use it to judge and to give hints, never reveal it wholesale): " + q.hint : "",
      "",
      "HOW TO RUN THE INTERVIEW:",
      "- Open by stating the question naturally, as an interviewer would, and invite the candidate to begin. Do not solve anything.",
      "- Answer clarifying questions briefly and decisively (fix scope, geography, time frame, units). If they skip clarification, gently note it.",
      "- Ask them to lay out their structure before any numbers. Probe whether segments are MECE and relevant.",
      "- When they state assumptions, accept reasonable ones and challenge unrealistic ones with a short, specific question.",
      "- Check their arithmetic; if it is wrong, point to the step without giving the answer.",
      "- Never solve the case for them. Only give a hint when they ask for one or are clearly stuck, and keep it minimal.",
      "- Keep every reply short (under 120 words), conversational, one step at a time. Use plain text with occasional bullet lists.",
      "",
      "WHEN THE CANDIDATE FINISHES (or asks for feedback), give structured feedback:",
      "- A score out of 5 for each of: Clarification, Structure, Assumptions, Math, Sanity check & Communication.",
      "- Two things done well and two to improve, each specific to what they said.",
      "- A concise model structure and a reasonable ballpark answer for comparison."
    ].filter(Boolean).join("\n");
  }

  async function callGemini() {
    const key = getKey();
    if (!key) throw new Error("No API key saved. Connect your Gemini key first.");
    const res = await fetch(API_BASE + "/models/" + encodeURIComponent(getModel()) + ":generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt(session.question) }] },
        contents: session.contents,
        generationConfig: { temperature: 0.7 }
      })
    });
    if (!res.ok) throw new Error(await readError(res));
    const data = await res.json();
    const cand = data.candidates && data.candidates[0];
    const text = cand && cand.content && cand.content.parts
      ? cand.content.parts.map(function (p) { return p.text || ""; }).join("").trim()
      : "";
    if (!text) {
      const reason = (data.promptFeedback && data.promptFeedback.blockReason) || (cand && cand.finishReason) || "empty response";
      throw new Error("Gemini returned no text (" + reason + ").");
    }
    return text;
  }

  /* ---------- Rendering ---------- */

  // Minimal, safe markdown: escape first, then paragraphs, lists and **bold** / *italic*.
  function renderMarkdown(src) {
    const inline = function (s) {
      return esc(s)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
    };
    const out = [];
    let list = null;
    let para = [];
    const flushList = function () {
      if (list) { out.push("<" + list.tag + ">" + list.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</" + list.tag + ">"); list = null; }
    };
    const flushPara = function () { if (para.length) { out.push("<p>" + para.join("<br>") + "</p>"); para = []; } };

    src.split(/\r?\n/).forEach(function (line) {
      const ul = line.match(/^\s*[-*•]\s+(.*)$/);
      const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
      const h = line.match(/^\s*#{1,6}\s+(.*)$/);
      if (ul || ol) {
        flushPara();
        const tag = ul ? "ul" : "ol";
        if (!list || list.tag !== tag) { flushList(); list = { tag: tag, items: [] }; }
        list.items.push(inline((ul || ol)[1]));
      } else if (!line.trim()) {
        flushList(); flushPara();
      } else if (h) {
        flushList(); flushPara();
        out.push("<p><strong>" + inline(h[1]) + "</strong></p>");
      } else {
        flushList();
        para.push(inline(line));
      }
    });
    flushList(); flushPara();
    return out.join("");
  }

  function addMessage(role, html) {
    el.empty.hidden = true;
    const div = document.createElement("div");
    div.className = "msg " + role;
    const avatar = role === "model" ? '<span class="avatar" aria-hidden="true">ai</span>'
      : role === "user" ? '<span class="avatar" aria-hidden="true">you</span>' : "";
    div.innerHTML = avatar + '<div class="bubble">' + html + "</div>";
    el.chat.appendChild(div);
    el.chat.scrollTop = el.chat.scrollHeight;
    return div;
  }

  function setBusy(busy) {
    if (session) session.busy = busy;
    const live = !!session && !busy;
    [el.send, el.hint, el.feedback, el.input].forEach(function (b) { b.disabled = !live; });
    el.start.disabled = busy || !selectedId;
  }

  async function exchange(userText, shown) {
    if (!session || session.busy) return;
    session.contents.push({ role: "user", parts: [{ text: userText }] });
    if (shown === "system") addMessage("system", esc(userText));
    else if (typeof shown === "string") addMessage("system", esc(shown));
    else if (shown !== null) addMessage("user", renderMarkdown(userText));
    const typing = addMessage("model", '<span class="typing" aria-label="Interviewer is typing"><i></i><i></i><i></i></span>');
    setBusy(true);
    try {
      const reply = await callGemini();
      session.contents.push({ role: "model", parts: [{ text: reply }] });
      typing.remove();
      addMessage("model", renderMarkdown(reply));
    } catch (err) {
      session.contents.pop(); // let the user retry the same turn
      typing.remove();
      addMessage("model error", "<p>Couldn't reach Gemini: " + esc(err.message) + "</p>");
      if (shown === undefined && userText) el.input.value = userText;
    } finally {
      setBusy(false);
      el.input.focus({ preventScroll: true });
    }
  }

  function tick() {
    if (!session) return;
    const s = Math.floor((Date.now() - session.startedAt) / 1000);
    el.timer.textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }

  /* ---------- Session controls ---------- */

  el.start.addEventListener("click", function () {
    const q = App.findQuestion(selectedId);
    if (!q) return;
    if (session && session.contents.length > 2 && !window.confirm("Start a new interview? The current conversation will be cleared.")) return;
    session = { question: q, contents: [], busy: false, startedAt: Date.now() };
    el.qTitle.textContent = q.title;
    el.qMeta.textContent = metaLine(q);
    el.chat.querySelectorAll(".msg").forEach(function (m) { m.remove(); });
    el.input.placeholder = "Clarify the question, lay out your structure, or walk through your numbers…";
    el.start.textContent = "Restart";
    el.timer.hidden = false;
    clearInterval(timerHandle);
    timerHandle = setInterval(tick, 1000);
    tick();
    // On phones the picker sits above the chat, so jump to the chat window itself.
    (window.innerWidth <= 820 ? el.chat.closest(".chat-window") : el.chatShell).scrollIntoView({ block: "start" });
    exchange("I'm ready. Please begin the interview.", null);
  });

  function autosize() {
    el.input.style.height = "auto";
    el.input.style.height = Math.min(el.input.scrollHeight, 176) + "px";
  }
  el.input.addEventListener("input", autosize);

  el.composer.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = el.input.value.trim();
    if (!text || !session) return;
    el.input.value = "";
    autosize();
    exchange(text);
  });
  el.input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      el.composer.requestSubmit();
    }
  });

  el.hint.addEventListener("click", function () {
    exchange("I'm stuck. Could you give me a small hint for the next step, without solving it?", "You asked for a hint");
  });
  el.feedback.addEventListener("click", function () {
    exchange("I'm done with my answer. Please give me your full structured feedback now.", "You finished the interview and asked for feedback");
    clearInterval(timerHandle);
  });

  renderPicker();
  paintConnection();
  setBusy(false);
})();
