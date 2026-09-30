/* AI Mode: a Gemini-powered guesstimate interviewer.
 *
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

  const el = {
    key: document.getElementById("api-key"),
    keyToggle: document.getElementById("key-toggle"),
    keySave: document.getElementById("key-save"),
    keyClear: document.getElementById("key-clear"),
    model: document.getElementById("model"),
    status: document.getElementById("key-status"),
    question: document.getElementById("ai-question"),
    start: document.getElementById("ai-start"),
    caseCard: document.getElementById("case-card"),
    chat: document.getElementById("chat"),
    composer: document.getElementById("composer"),
    input: document.getElementById("ai-input"),
    send: document.getElementById("ai-send"),
    hint: document.getElementById("ai-hint"),
    feedback: document.getElementById("ai-feedback")
  };

  // Conversation in Gemini's format: [{ role: "user"|"model", parts: [{ text }] }]
  let session = null; // { question, contents, busy }

  /* ---------- Key & model ---------- */

  function getKey() { return (App.storageGet(KEY_STORE) || "").trim(); }
  function getModel() { return (el.model.value || DEFAULT_MODEL).trim(); }

  function setStatus(text, kind) {
    el.status.textContent = text;
    el.status.className = "status" + (kind ? " " + kind : "");
  }

  async function testKey(key) {
    const res = await fetch(API_BASE + "/models?pageSize=1", { headers: { "x-goog-api-key": key } });
    if (!res.ok) throw new Error(await readError(res));
  }

  async function readError(res) {
    try {
      const data = await res.json();
      if (data && data.error && data.error.message) return data.error.message;
    } catch (e) { /* fall through */ }
    return "Request failed with HTTP " + res.status + ".";
  }

  el.key.value = getKey();
  el.model.value = App.storageGet(MODEL_STORE) || DEFAULT_MODEL;
  if (getKey()) setStatus("A key is saved in this browser.", "ok");
  else setStatus("No key saved yet.");

  el.keyToggle.addEventListener("click", function () {
    const show = el.key.type === "password";
    el.key.type = show ? "text" : "password";
    el.keyToggle.textContent = show ? "Hide" : "Show";
  });

  el.keySave.addEventListener("click", async function () {
    const key = el.key.value.trim();
    if (!key) { setStatus("Paste your key first.", "err"); return; }
    el.keySave.disabled = true;
    setStatus("Testing key…");
    try {
      await testKey(key);
      App.storageSet(KEY_STORE, key);
      setStatus("Key works and is saved in this browser.", "ok");
    } catch (err) {
      setStatus("Google rejected this key: " + err.message, "err");
    } finally {
      el.keySave.disabled = false;
    }
  });

  el.keyClear.addEventListener("click", function () {
    App.storageSet(KEY_STORE, null);
    el.key.value = "";
    setStatus("Key removed from this browser.");
  });

  el.model.addEventListener("change", function () {
    App.storageSet(MODEL_STORE, el.model.value.trim() || null);
  });

  /* ---------- Question picker ---------- */

  el.question.innerHTML = '<option value="">Choose a guesstimate…</option>' +
    App.questions.map(function (q) {
      return '<option value="' + esc(q.id) + '">' + esc(q.id + " · " + q.difficulty + " · " + q.title) + "</option>";
    }).join("");

  App.onRoute(function (route) {
    if (route.tab !== "ai" || !route.arg) return;
    if (App.findQuestion(route.arg)) el.question.value = route.arg;
  });

  /* ---------- Prompting ---------- */

  function systemPrompt(q) {
    return [
      "You are a seasoned management-consulting interviewer (McKinsey/BCG/Bain style) running a live guesstimate interview.",
      "",
      "THE QUESTION: " + q.title,
      "Difficulty: " + q.difficulty + ". Industry: " + q.industry + ". Suggested approach: " + q.approach + (q.geography ? ". Geography: " + q.geography : "") + ".",
      q.hint ? "Hint you may give if asked: " + q.hint : "",
      q.solution ? "Reference solution outline (private, never reveal unless the candidate has finished and asks for it): " + q.solution : "",
      "",
      "HOW TO RUN THE INTERVIEW:",
      "- Open by stating the question naturally, as an interviewer would, and invite the candidate to begin. Do not solve anything.",
      "- Answer clarifying questions briefly and decisively (fix scope, geography, time frame, units). If they skip clarification, gently note it.",
      "- Ask them to lay out their structure before any numbers. Probe whether segments are MECE and relevant.",
      "- When they state assumptions, accept reasonable ones and challenge unrealistic ones with a short, specific question.",
      "- Check their arithmetic silently; if it is wrong, point to the step without giving the answer.",
      "- Never solve the case for them. Only give a hint when they ask for one or are clearly stuck, and keep it minimal.",
      "- Keep every reply short (under 120 words), conversational, one step at a time. Use plain text with occasional bullet lists.",
      "",
      "WHEN THE CANDIDATE FINISHES (or asks for feedback), give structured feedback:",
      "- A score out of 5 for each of: Clarification, Structure, Assumptions, Math, Sanity check & Communication.",
      "- Two things done well and two to improve, each specific to what they said.",
      "- A concise model structure and a reasonable ballpark answer for comparison.",
    ].filter(function (line) { return line !== null; }).join("\n");
  }

  async function callGemini() {
    const key = getKey();
    if (!key) throw new Error("No API key saved. Add your Gemini key above first.");
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
    let list = null; // { tag, items }
    const flush = function () {
      if (list) { out.push("<" + list.tag + ">" + list.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</" + list.tag + ">"); list = null; }
    };
    let para = [];
    const flushPara = function () { if (para.length) { out.push("<p>" + para.join("<br>") + "</p>"); para = []; } };

    src.split(/\r?\n/).forEach(function (line) {
      const ul = line.match(/^\s*[-*•]\s+(.*)$/);
      const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
      const h = line.match(/^\s*#{1,6}\s+(.*)$/);
      if (ul || ol) {
        flushPara();
        const tag = ul ? "ul" : "ol";
        if (!list || list.tag !== tag) { flush(); list = { tag: tag, items: [] }; }
        list.items.push(inline((ul || ol)[1]));
      } else if (!line.trim()) {
        flush(); flushPara();
      } else if (h) {
        flush(); flushPara();
        out.push("<p><strong>" + inline(h[1]) + "</strong></p>");
      } else {
        flush();
        para.push(inline(line));
      }
    });
    flush(); flushPara();
    return out.join("");
  }

  function addMessage(role, text, opts) {
    opts = opts || {};
    const div = document.createElement("div");
    div.className = "msg " + role + (opts.pending ? " pending" : "");
    const who = role === "user" ? "You" : "Interviewer";
    div.innerHTML = '<div class="who">' + who + '</div><div class="body">' +
      (opts.pending ? "<p>Thinking…</p>" : opts.italic ? "<p><em>" + esc(text) + "</em></p>" : renderMarkdown(text)) +
      "</div>";
    el.chat.appendChild(div);
    el.chat.scrollTop = el.chat.scrollHeight;
    return div;
  }

  function setBusy(busy) {
    session.busy = busy;
    [el.send, el.hint, el.feedback, el.start].forEach(function (b) { b.disabled = busy; });
  }

  async function exchange(userText, displayText) {
    if (!session || session.busy) return;
    session.contents.push({ role: "user", parts: [{ text: userText }] });
    if (displayText !== null) addMessage("user", displayText || userText, { italic: displayText !== undefined });
    const pending = addMessage("model", "", { pending: true });
    setBusy(true);
    try {
      const reply = await callGemini();
      session.contents.push({ role: "model", parts: [{ text: reply }] });
      pending.remove();
      addMessage("model", reply);
    } catch (err) {
      session.contents.pop(); // let the user retry the same turn
      pending.remove();
      const div = addMessage("model", "");
      div.querySelector(".body").innerHTML = '<p class="status err">Error: ' + esc(err.message) + "</p>";
      if (displayText === undefined && userText) el.input.value = userText;
    } finally {
      setBusy(false);
      el.input.focus();
    }
  }

  /* ---------- Session controls ---------- */

  el.start.addEventListener("click", function () {
    const q = App.findQuestion(el.question.value);
    if (!q) { el.question.focus(); return; }
    if (!getKey()) {
      setStatus("Add and save your Gemini API key before starting.", "err");
      el.key.focus();
      return;
    }
    session = { question: q, contents: [], busy: false };
    el.caseCard.hidden = false;
    el.caseCard.innerHTML =
      '<p class="qtitle">' + esc(q.title) + "</p>" +
      '<div class="qmeta muted" style="font-size:1.1rem">' +
        '<span class="diff ' + esc(q.difficulty.toLowerCase()) + '">' + esc(q.difficulty) + "</span> · " +
        esc(q.industry) + " · " + esc(q.type) +
      "</div>";
    el.chat.innerHTML = "";
    el.chat.hidden = false;
    el.composer.hidden = false;
    el.start.textContent = "Restart interview";
    exchange("I'm ready. Please begin the interview.", null);
  });

  el.composer.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = el.input.value.trim();
    if (!text) return;
    el.input.value = "";
    exchange(text);
  });

  el.input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      el.composer.requestSubmit();
    }
  });

  el.hint.addEventListener("click", function () {
    exchange("I'm stuck. Could you give me a small hint for the next step, without solving it?", "Asked for a hint");
  });

  el.feedback.addEventListener("click", function () {
    exchange("I'm done with my answer. Please give me your full structured feedback now.", "Finished; requested feedback");
  });
})();
