/* AI Mode: a Gemini-powered guesstimate interviewer.
 *
 * Flow: connect a key (setup steps) → full-page chat: pick a question in the
 * sidebar, interview in the main column, finish with a scorecard.
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

  // Scored criteria for the feedback scorecard, with what a 5 and a 1 look like.
  const RUBRIC = [
    ["Clarification", "5: pinned down scope, geography, time frame and units before starting. 1: jumped straight into numbers."],
    ["Structure", "5: a clear MECE tree laid out before calculating, with segments that genuinely drive the answer. 1: no visible structure."],
    ["Assumptions", "5: realistic, justified and stated out loud. 1: arbitrary, unrealistic or unstated."],
    ["Maths", "5: correct, sensibly rounded and easy to follow. 1: errors left uncorrected."],
    ["Sanity check", "5: cross-checked with an independent method or benchmark and reflected on the gap. 1: no check."],
    ["Communication", "5: signposted, concise, ended with a crisp answer. 1: hard to follow."]
  ];

  const $ = function (id) { return document.getElementById(id); };
  const el = {
    setup: $("ai-setup"), chatShell: $("ai-chat"),
    key: $("api-key"), keyToggle: $("key-toggle"), keySave: $("key-save"), keyCancel: $("key-cancel"),
    keyChange: $("key-change"), keyClear: $("key-clear"), model: $("model"), status: $("key-status"),
    pickerPanel: $("picker-panel"), pickerToggle: $("picker-toggle"),
    pickSearch: $("pick-search"), pickDiff: $("pick-diff"), pickList: $("pick-list"), pickCount: $("pick-count"), pickRandom: $("pick-random"),
    qTitle: $("chat-q-title"), qMeta: $("chat-q-meta"), timer: $("timer"), start: $("ai-start"),
    messages: $("messages"), chat: $("chat"), empty: $("empty-chat"), composer: $("composer"), input: $("ai-input"),
    send: $("ai-send"), hint: $("ai-hint"), feedback: $("ai-feedback"),
    voiceBtn: $("ai-voice"), voiceBar: $("voice-bar"), orb: $("voice-orb"), vState: $("voice-state"), vLive: $("voice-live"),
    firmStyle: $("firm-style"),
    vHint: $("voice-hint"), vFinish: $("voice-finish"), vEnd: $("voice-end"), hintLine: $("hint-line"), voiceHintText: $("voice-hint-text")
  };

  // Conversation in Gemini's format: [{ role: "user"|"model", parts: [{ text }] }]
  let session = null; // { question, contents, busy, startedAt, endedAt, hints, feedback }
  let selectedId = null;
  let timerHandle = null;
  let onAiTab = false;
  let changingKey = false;

  /* ---------- Key, model and page mode ---------- */

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

  // Setup steps until a key is saved; then the chat fills the page.
  function paintMode() {
    const chatMode = !!getKey() && !changingKey;
    el.setup.hidden = chatMode;
    el.chatShell.hidden = !chatMode;
    el.keyCancel.hidden = !(changingKey && getKey());
    document.body.classList.toggle("ai-full", onAiTab && chatMode);
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
      changingKey = false;
      paintMode();
    } catch (err) {
      setStatus("Google didn't accept this key: " + err.message, "err");
    } finally {
      el.keySave.disabled = false;
    }
  }
  el.keySave.addEventListener("click", connect);
  el.key.addEventListener("keydown", function (e) { if (e.key === "Enter") connect(); });

  el.keyChange.addEventListener("click", function () {
    changingKey = true;
    el.key.value = getKey();
    setStatus("Paste a new key and click Connect.");
    paintMode();
    window.scrollTo(0, 0);
    el.key.focus();
  });
  el.keyCancel.addEventListener("click", function () { changingKey = false; setStatus(""); paintMode(); });
  el.keyClear.addEventListener("click", function () {
    if (!window.confirm("Remove your Gemini key from this browser?")) return;
    App.storageSet(KEY_STORE, null);
    el.key.value = "";
    setStatus("Key removed from this browser.");
    paintMode();
  });
  el.model.addEventListener("change", function () {
    App.storageSet(MODEL_STORE, el.model.value.trim() || null);
  });

  /* ---------- Interviewer style (standard or a specific firm's format) ---------- */

  const STYLE_STORE = "bp.firmStyle";
  el.firmStyle.innerHTML = '<option value="">Standard</option>' + App.firms.map(function (f) {
    return '<option value="' + esc(f.id) + '">' + esc(f.short) + " style</option>";
  }).join("");
  function currentStyle() { return App.findFirm(App.storageGet(STYLE_STORE)); }
  function syncStyle() {
    const f = currentStyle();
    el.firmStyle.value = f ? f.id : "";
    const q = App.findQuestion(selectedId);
    if (q && (!session || session.question.id === q.id)) el.qMeta.textContent = metaLine(q);
  }
  el.firmStyle.addEventListener("change", function () {
    App.storageSet(STYLE_STORE, el.firmStyle.value || null);
    syncStyle();
  });

  /* ---------- Question picker (sidebar; a drawer on phones) ---------- */

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

  function shortTitle(q) {
    return q.title.replace(/^Estimate (the )?/i, "").replace(/^./, function (c) { return c.toUpperCase(); });
  }

  function renderPicker() {
    const items = App.questions.filter(pickMatches);
    el.pickCount.textContent = items.length + " of " + App.questions.length + " questions";
    el.pickList.innerHTML = items.length ? items.map(function (q) {
      return '<li><button type="button" data-id="' + esc(q.id) + '" aria-pressed="' + (q.id === selectedId) + '">' +
        esc(shortTitle(q)) +
        '<span class="pm"><span class="diff ' + esc(q.difficulty.toLowerCase()) + '">' + esc(q.difficulty) + "</span>" +
        (q.firm ? " · " + esc(q.firm) : "") + " · " + esc(q.id) + "</span></button></li>";
    }).join("") : '<li class="empty" style="padding:1rem">No matches.</li>';
  }

  function metaLine(q) {
    const f = currentStyle();
    return [q.difficulty, q.firm ? "Asked at " + q.firm : "", q.industry, f ? f.short + "-style interviewer" : q.approach].filter(Boolean).join(" · ");
  }

  function setDrawer(open) {
    el.chatShell.classList.toggle("show-picker", open);
    el.pickerToggle.setAttribute("aria-expanded", String(open));
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
      el.voiceBtn.disabled = !!(session && session.busy);
      el.start.textContent = session ? "Start this one" : "Start interview";
    }
    if (opts && opts.scroll) {
      const btn = el.pickList.querySelector('[data-id="' + id + '"]');
      if (btn) btn.scrollIntoView({ block: "center" });
    }
    setDrawer(false);
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
  el.pickerToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    setDrawer(!el.chatShell.classList.contains("show-picker"));
  });
  $("empty-browse").addEventListener("click", function (e) {
    e.stopPropagation();
    setDrawer(true);
  });
  // Tapping the dimmed area beside the drawer closes it.
  el.chatShell.addEventListener("click", function (e) {
    if (el.chatShell.classList.contains("show-picker") && !el.pickerPanel.contains(e.target)) setDrawer(false);
  });

  App.onRoute(function (route) {
    onAiTab = route.tab === "ai";
    if (!onAiTab) exitVoice();
    paintMode();
    if (onAiTab) syncStyle();
    if (onAiTab && route.arg && App.findQuestion(route.arg)) select(route.arg, { scroll: true });
  });

  /* ---------- Gemini calls ---------- */

  function interviewerPrompt(q) {
    return [
      "You are a seasoned management-consulting interviewer (McKinsey/BCG/Bain style) running a live guesstimate interview.",
      "",
      "THE QUESTION: " + q.title,
      "Difficulty: " + q.difficulty + ". Industry: " + q.industry + ". Suggested approach: " + q.approach + (q.geography ? ". Geography: " + q.geography : "") + ".",
      q.firm ? "This question has been asked in interviews at " + q.firm + "." : "",
      session && session.style ? "\nFIRM STYLE (" + session.style.name + "): " + session.style.style : "",
      q.hint ? "A good structure (private; use it to judge and to give hints, never reveal it wholesale): " + q.hint : "",
      "",
      "HOW TO RUN THE INTERVIEW:",
      "- Open by stating the question naturally, as an interviewer would, and invite the candidate to begin. Do not solve anything.",
      "- Answer clarifying questions briefly and decisively (fix scope, geography, time frame, units). If they skip clarification, gently note it.",
      "- Ask them to lay out their structure before any numbers. Probe whether segments are MECE and relevant.",
      "- When they state assumptions, accept reasonable ones and challenge unrealistic ones with a short, specific question.",
      "- Check their arithmetic; if it is wrong, point to the step without giving the answer.",
      "- Never solve the case for them. Only give a hint when they ask for one or are clearly stuck, and keep it minimal.",
      "- Keep every reply short (under 120 words), conversational, one step at a time. Use plain text with occasional bullet lists."
    ].filter(Boolean).join("\n");
  }

  function evaluatorPrompt(q) {
    return [
      "You are a strict but fair consulting interviewer scoring a candidate's guesstimate interview. The transcript follows.",
      "QUESTION: " + q.title,
      q.hint ? "Reference structure: " + q.hint : "",
      "",
      "Score each criterion from 1 to 5 using this rubric:",
      RUBRIC.map(function (r) { return "- " + r[0] + " — " + r[1]; }).join("\n"),
      "",
      "Rules: judge only what the candidate actually said. If they never reached a step, score it 1–2 and say so.",
      "Each comment must reference something specific the candidate did. Keep comments to one sentence.",
      "Give 2–3 strengths and 2–3 improvements, each concrete and actionable.",
      "model_structure: 4–6 short steps of a strong solution path with rough numbers.",
      "ballpark: a reasonable answer range with units. candidate_answer: the candidate's final number, or 'No final answer given'.",
      "next_steps: 2 specific drills or habits to practise before the next interview."
    ].filter(Boolean).join("\n");
  }

  const FEEDBACK_SCHEMA = {
    type: "OBJECT",
    properties: {
      verdict: { type: "STRING", description: "One-sentence summary of the performance" },
      scores: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            criterion: { type: "STRING", enum: RUBRIC.map(function (r) { return r[0]; }) },
            score: { type: "INTEGER" },
            comment: { type: "STRING" }
          },
          required: ["criterion", "score", "comment"]
        }
      },
      strengths: { type: "ARRAY", items: { type: "STRING" } },
      improvements: { type: "ARRAY", items: { type: "STRING" } },
      model_structure: { type: "ARRAY", items: { type: "STRING" } },
      ballpark: { type: "STRING" },
      candidate_answer: { type: "STRING" },
      next_steps: { type: "ARRAY", items: { type: "STRING" } }
    },
    required: ["verdict", "scores", "strengths", "improvements", "model_structure", "ballpark", "candidate_answer", "next_steps"]
  };

  async function gemini(system, contents, generationConfig) {
    const key = getKey();
    if (!key) throw new Error("No API key saved. Connect your Gemini key first.");
    const res = await fetch(API_BASE + "/models/" + encodeURIComponent(getModel()) + ":generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: contents, generationConfig: generationConfig })
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

  const renderMarkdown = App.renderMarkdown;

  function scrollToEnd() { el.messages.scrollTop = el.messages.scrollHeight; }

  function addMessage(role, html) {
    el.empty.hidden = true;
    const div = document.createElement("div");
    div.className = "msg " + role;
    const who = role.indexOf("model") === 0 ? "Interviewer" : role === "user" ? "You" : "";
    div.innerHTML = (who ? '<div class="who">' + who + "</div>" : "") + '<div class="bubble">' + html + "</div>";
    el.chat.appendChild(div);
    scrollToEnd();
    return div;
  }

  function typingBubble() {
    return addMessage("model", '<span class="typing" aria-label="Interviewer is typing"><i></i><i></i><i></i></span>');
  }

  function setBusy(busy) {
    if (session) session.busy = busy;
    const live = !!session && !busy;
    [el.send, el.hint, el.feedback, el.input].forEach(function (b) { b.disabled = !live; });
    el.start.disabled = busy || !selectedId;
    el.voiceBtn.disabled = busy || !selectedId;
  }

  function elapsed() {
    if (!session) return "00:00";
    const s = Math.floor(((session.endedAt || Date.now()) - session.startedAt) / 1000);
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }
  function tick() { el.timer.textContent = elapsed(); }

  async function exchange(userText, shown) {
    if (!session || session.busy) return;
    session.contents.push({ role: "user", parts: [{ text: userText }] });
    if (typeof shown === "string") addMessage("system", esc(shown));
    else if (shown !== null) addMessage("user", renderMarkdown(userText));
    const typing = typingBubble();
    setBusy(true);
    try {
      const reply = await gemini(interviewerPrompt(session.question), session.contents, { temperature: 0.7 });
      session.contents.push({ role: "model", parts: [{ text: reply }] });
      typing.remove();
      addMessage("model", renderMarkdown(reply));
      voiceAfterReply(reply);
    } catch (err) {
      session.contents.pop(); // let the user retry the same turn
      typing.remove();
      addMessage("model error", "<p>Couldn't reach Gemini: " + esc(err.message) + "</p>");
      voicePause("Couldn't reach Gemini. Tap the mic to try again.");
      if (shown === undefined && userText) el.input.value = userText;
    } finally {
      setBusy(false);
      el.input.focus({ preventScroll: true });
    }
  }

  /* ---------- Feedback scorecard ---------- */

  function signal(avg) {
    if (avg >= 4) return ["Strong performance", "good"];
    if (avg >= 3) return ["On track", "mid"];
    return ["Needs work", "low"];
  }

  function listHtml(items, tag) {
    return "<" + tag + ">" + (items || []).map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</" + tag + ">";
  }

  function scorecardHtml(fb, q) {
    const byName = {};
    (fb.scores || []).forEach(function (s) { byName[s.criterion] = s; });
    const rows = RUBRIC.map(function (r) {
      const s = byName[r[0]] || { score: 1, comment: "Not assessed." };
      const n = Math.max(1, Math.min(5, Math.round(s.score)));
      return { name: r[0], n: n, comment: s.comment };
    });
    const avg = rows.reduce(function (a, r) { return a + r.n; }, 0) / rows.length;
    const sig = signal(avg);
    return '<div class="scorecard">' +
      '<div class="sc-top"><div class="sc-overall">' + (avg * 2).toFixed(1) + "<small> / 10</small></div>" +
      '<div><h3>Interview feedback</h3><span class="sc-signal ' + sig[1] + '">' + sig[0] + "</span>" +
      '<p class="sc-verdict">' + esc(fb.verdict) + "</p>" +
      '<p class="sc-meta">' + esc(q.title) + " · Time " + elapsed() + " · Hints used: " + session.hints + "</p></div></div>" +
      '<div class="sc-rows">' + rows.map(function (r) {
        let pips = "";
        for (let i = 1; i <= 5; i++) pips += "<i" + (i <= r.n ? ' class="on"' : "") + "></i>";
        return '<div class="sc-row"><span class="name">' + esc(r.name) + '</span><span class="pips" aria-hidden="true">' + pips +
          '</span><span class="num">' + r.n + '/5</span><span class="cmt">' + esc(r.comment) + "</span></div>";
      }).join("") + "</div>" +
      '<div class="sc-compare"><div><h4>Your answer</h4><p>' + esc(fb.candidate_answer) + "</p></div>" +
      "<div><h4>Reasonable ballpark</h4><p>" + esc(fb.ballpark) + "</p></div></div>" +
      '<div class="sc-cols"><div class="sc-block"><h4>What went well</h4>' + listHtml(fb.strengths, "ul") + "</div>" +
      '<div class="sc-block"><h4>What to improve</h4>' + listHtml(fb.improvements, "ul") + "</div></div>" +
      '<div class="sc-cols"><div class="sc-block"><h4>A strong solution path</h4>' + listHtml(fb.model_structure, "ol") + "</div>" +
      '<div class="sc-block"><h4>Practise next</h4>' + listHtml(fb.next_steps, "ul") + "</div></div>" +
      '<div class="sc-actions"><button class="btn" type="button" data-act="similar">Try a similar question</button>' +
      '<button class="btn ghost" type="button" data-act="retry">Retry this one</button>' +
      '<button class="btn ghost" type="button" data-act="copy">Copy feedback</button></div>' +
      "</div>";
  }

  function scorecardText(fb) {
    return [
      "Feedback: " + session.question.title,
      fb.verdict,
      "",
      (fb.scores || []).map(function (s) { return s.criterion + ": " + s.score + "/5 — " + s.comment; }).join("\n"),
      "",
      "Your answer: " + fb.candidate_answer + " | Ballpark: " + fb.ballpark,
      "",
      "What went well:\n- " + (fb.strengths || []).join("\n- "),
      "What to improve:\n- " + (fb.improvements || []).join("\n- "),
      "Solution path:\n- " + (fb.model_structure || []).join("\n- "),
      "Practise next:\n- " + (fb.next_steps || []).join("\n- ")
    ].join("\n");
  }

  async function finish() {
    if (!session || session.busy) return;
    session.endedAt = Date.now();
    clearInterval(timerHandle);
    tick();
    addMessage("system", "You finished the interview. Scoring it now…");
    const typing = typingBubble();
    setBusy(true);
    const ask = "The interview is over. Evaluate the candidate. Time taken: " + elapsed() + ". Hints requested: " + session.hints + ".";
    const contents = session.contents.concat([{ role: "user", parts: [{ text: ask }] }]);
    try {
      const raw = await gemini(evaluatorPrompt(session.question), contents, {
        temperature: 0.3, responseMimeType: "application/json", responseSchema: FEEDBACK_SCHEMA
      });
      const fb = JSON.parse(raw);
      session.feedback = fb;
      typing.remove();
      const card = addMessage("model", scorecardHtml(fb, session.question));
      card.classList.add("feedback");
      const avg = (fb.scores || []).reduce(function (a, x) { return a + (x.score || 0); }, 0) / Math.max(1, (fb.scores || []).length);
      const byCrit = {};
      (fb.scores || []).forEach(function (x) { byCrit[x.criterion] = Math.max(1, Math.min(5, Math.round(x.score))); });
      App.log("interview", {
        id: session.question.id, title: session.question.title, scores: byCrit,
        overall: Math.round(RUBRIC.reduce(function (t, r) { return t + (byCrit[r[0]] || 1); }, 0) / RUBRIC.length * 20) / 10,
        secs: Math.round((session.endedAt - session.startedAt) / 1000), hints: session.hints, style: session.style ? session.style.id : null
      });
      if (voice.active) {
        setVoiceState("speaking", "Reading your score…");
        speak("Your overall score is " + (avg * 2).toFixed(1) + " out of 10. " + (fb.verdict || "") + " The full scorecard is on screen.", exitVoice);
      }
      el.messages.scrollTop = card.offsetTop - 12;
    } catch (err) {
      // Fall back to plain-text feedback if structured output isn't available.
      try {
        const text = await gemini(evaluatorPrompt(session.question) + "\nWrite the feedback as short headed sections with bullet points.", contents, { temperature: 0.3 });
        typing.remove();
        addMessage("model", renderMarkdown(text));
        if (voice.active) speak("Your feedback is on screen.", exitVoice);
      } catch (err2) {
        typing.remove();
        addMessage("model error", "<p>Couldn't get feedback from Gemini: " + esc(err2.message) + "</p>");
        voicePause("Couldn't get feedback. Try Finish again, or end voice.");
        session.endedAt = null;
        timerHandle = setInterval(tick, 1000);
      }
    } finally {
      setBusy(false);
    }
  }

  el.chat.addEventListener("click", function (e) {
    const b = e.target.closest("[data-act]");
    if (!b || !session) return;
    if (b.dataset.act === "copy" && session.feedback) {
      const text = scorecardText(session.feedback);
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
        function () { b.textContent = "Copied"; },
        function () { b.textContent = "Copy failed"; });
    } else if (b.dataset.act === "retry") {
      startInterview(true);
    } else if (b.dataset.act === "similar") {
      const cur = session.question;
      const pool = App.questions.filter(function (q) { return q.id !== cur.id && (q.approach === cur.approach || q.industry === cur.industry); });
      const list = pool.length ? pool : App.questions;
      select(list[Math.floor(Math.random() * list.length)].id, { scroll: true });
      startInterview(true);
    }
  });

  /* ---------- Session controls ---------- */

  function startInterview(skipConfirm) {
    const q = App.findQuestion(selectedId);
    if (!q) return;
    if (!skipConfirm && session && !session.feedback && session.contents.length > 2 &&
        !window.confirm("Start a new interview? The current conversation will be cleared.")) return;
    stopSpeaking();
    stopListening();
    session = { question: q, contents: [], busy: false, startedAt: Date.now(), endedAt: null, hints: 0, feedback: null, style: currentStyle() };
    el.qTitle.textContent = q.title;
    el.qMeta.textContent = metaLine(q);
    el.chat.querySelectorAll(".msg").forEach(function (m) { m.remove(); });
    el.input.placeholder = window.innerWidth <= 820 ? "Type your answer…" : "Clarify the question, lay out your structure, or walk through your numbers…";
    el.start.textContent = "Restart";
    el.timer.hidden = false;
    clearInterval(timerHandle);
    timerHandle = setInterval(tick, 1000);
    tick();
    exchange("I'm ready. Please begin the interview.", null);
  }
  el.start.addEventListener("click", function () { startInterview(false); });

  function autosize() {
    el.input.style.height = "auto";
    el.input.style.height = Math.min(el.input.scrollHeight, 192) + "px";
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
    if (!session) return;
    session.hints += 1;
    exchange("I'm stuck. Could you give me a small hint for the next step, without solving it?", "You asked for a hint");
  });
  el.feedback.addEventListener("click", finish);

  /* ---------- Voice interview (like ChatGPT / Gemini voice mode) ----------
   * Tap the waveform: the interviewer speaks, then listens; when you pause,
   * your answer is sent and the reply is spoken, and so on until you finish.
   * Uses the browser's Web Speech API: speechSynthesis (interviewer's voice)
   * and SpeechRecognition (your voice). Chrome, Edge and Safari support both;
   * elsewhere the voice button hides and typing works as normal. */

  const synth = window.speechSynthesis || null;
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const voice = { active: false, state: "idle", rec: null, heard: "", silence: null, idle: null, speakToken: 0 };
  const SILENCE_MS = 2200;   // pause this long after speaking and your answer is sent
  const NO_SPEECH_MS = 12000; // nothing said for this long: pause and wait for a tap

  const STATE_TEXT = {
    speaking: "Interviewer is speaking… tap to interrupt",
    listening: "Listening… pause when you're done",
    thinking: "Thinking…",
    paused: "Paused. Tap the mic when you're ready."
  };

  function setVoiceState(state, text) {
    voice.state = state;
    el.orb.dataset.state = state;
    el.vState.textContent = text || STATE_TEXT[state] || "";
    el.orb.setAttribute("aria-label", state === "speaking" ? "Interrupt and answer" : state === "listening" ? "Send my answer now" : "Tap to talk");
  }

  // Make replies sound natural: drop markdown and read symbols and units as words.
  function forSpeech(text) {
    return String(text)
      .replace(/\*\*|`|#+/g, "")
      .replace(/^\s*[-*•]\s+/gm, "")
      .replace(/~/g, "about ")
      .replace(/≈/g, " approximately ")
      .replace(/×/g, " times ")
      .replace(/÷/g, " divided by ")
      .replace(/→/g, ", then ")
      .replace(/₹\s?/g, "rupees ")
      .replace(/(\d)\s?Cr\b/g, "$1 crore")
      .replace(/(\d)\s?M\b/g, "$1 million")
      .replace(/(\d)\s?B\b/g, "$1 billion")
      .replace(/(\d)\s?k\b/g, "$1 thousand")
      .replace(/\s+/g, " ")
      .replace(/\s+([,.;:!?])/g, "$1")
      .trim();
  }

  function pickVoice() {
    const voices = synth ? synth.getVoices() : [];
    return voices.find(function (v) { return /en[-_]IN/i.test(v.lang); }) ||
      voices.find(function (v) { return /en[-_]GB/i.test(v.lang); }) ||
      voices.find(function (v) { return /^en/i.test(v.lang); }) || null;
  }

  // Speak text sentence by sentence (long utterances get cut off in some
  // browsers), then call done once. A watchdog covers browsers that never
  // fire the final "end" event.
  function speak(text, done) {
    if (!synth) { if (done) done(); return; }
    synth.cancel();
    const token = ++voice.speakToken;
    let finished = false;
    const finish = function () {
      if (finished || token !== voice.speakToken) return;
      finished = true;
      if (done) done();
    };
    const parts = forSpeech(text).replace(/([.!?])\s+/g, "$1\u0000").split("\u0000").filter(function (t) { return t.trim(); });
    if (!parts.length) { finish(); return; }
    const v = pickVoice();
    parts.forEach(function (t, i) {
      const u = new SpeechSynthesisUtterance(t.trim());
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "en-IN"; }
      u.rate = 1.03;
      if (i === parts.length - 1) { u.onend = finish; u.onerror = finish; }
      synth.speak(u);
    });
    const words = parts.join(" ").split(/\s+/).length;
    setTimeout(finish, words * 450 + 4000);
  }

  function stopSpeaking() {
    voice.speakToken++;
    if (synth) synth.cancel();
  }

  function stopListening() {
    clearTimeout(voice.silence);
    clearTimeout(voice.idle);
    if (voice.rec) {
      const r = voice.rec;
      voice.rec = null;
      r.onresult = r.onerror = r.onend = null;
      try { r.abort(); } catch (e) { /* already stopped */ }
    }
  }

  function voicePause(text) {
    if (!voice.active) return;
    stopListening();
    setVoiceState("paused", text);
  }

  function sendHeard() {
    const text = voice.heard.trim();
    stopListening();
    if (!text) { voicePause(); return; }
    el.vLive.textContent = "";
    setVoiceState("thinking");
    exchange(text);
  }

  function listen() {
    if (!voice.active || !session || session.busy || session.feedback) return;
    stopSpeaking();
    stopListening();
    const rec = new Recognition();
    rec.lang = "en-IN";
    rec.continuous = true;
    rec.interimResults = true;
    voice.rec = rec;
    voice.heard = "";
    el.vLive.textContent = "";
    rec.onresult = function (e) {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) voice.heard += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      el.vLive.textContent = (voice.heard + interim).trim();
      clearTimeout(voice.idle);
      clearTimeout(voice.silence);
      voice.silence = setTimeout(sendHeard, SILENCE_MS);
    };
    rec.onerror = function (e) {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        exitVoice();
        addMessage("system", "Microphone access is blocked. Allow it in your browser's site settings to use voice, or keep typing.");
      } else if (e.error === "no-speech") {
        voicePause("Didn't hear anything. Tap the mic when you're ready.");
      } else if (e.error !== "aborted") {
        voicePause("Voice input stopped. Tap the mic to continue.");
      }
    };
    // Browsers end recognition on their own after long silences.
    rec.onend = function () { if (voice.rec === rec) { voice.rec = null; if (voice.heard.trim()) sendHeard(); else voicePause(); } };
    try { rec.start(); } catch (err) { voicePause("Couldn't start the microphone. Tap to try again."); return; }
    setVoiceState("listening");
    voice.idle = setTimeout(function () { if (!voice.heard.trim()) voicePause("Didn't hear anything. Tap the mic when you're ready."); }, NO_SPEECH_MS);
  }

  // Called after every interviewer reply: speak it, then hand the turn back.
  function voiceAfterReply(reply) {
    if (!voice.active) return;
    setVoiceState("speaking");
    el.vLive.textContent = "";
    speak(reply, function () {
      if (voice.active && session && !session.busy && !session.feedback) listen();
    });
  }

  function enterVoice() {
    if (!Recognition || !synth || !selectedId) return;
    voice.active = true;
    el.composer.hidden = true;
    el.voiceBar.hidden = false;
    try { synth.speak(new SpeechSynthesisUtterance("")); } catch (e) { /* iOS: unlock speech on this tap */ }
    if (!session || session.feedback || session.question.id !== selectedId) {
      setVoiceState("thinking", "Starting the interview…");
      startInterview(true);
    } else if (!session.busy) {
      listen();
    } else {
      setVoiceState("thinking");
    }
  }

  function exitVoice() {
    if (!voice.active) return;
    voice.active = false;
    stopListening();
    stopSpeaking();
    el.voiceBar.hidden = true;
    el.composer.hidden = false;
    setVoiceState("idle", "");
  }

  if (!Recognition || !synth) {
    el.voiceBtn.hidden = true;
    el.voiceHintText.parentNode.innerHTML = "<kbd>Enter</kbd> to send &middot; <kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line";
  }

  el.voiceBtn.addEventListener("click", enterVoice);
  el.orb.addEventListener("click", function () {
    if (voice.state === "speaking") listen();           // barge in
    else if (voice.state === "listening") sendHeard();  // done talking
    else if (voice.state === "paused" || voice.state === "idle") listen();
  });
  el.vHint.addEventListener("click", function () {
    if (!session || session.busy) return;
    stopListening(); stopSpeaking();
    session.hints += 1;
    setVoiceState("thinking");
    exchange("I'm stuck. Could you give me a small hint for the next step, without solving it?", "You asked for a hint");
  });
  el.vFinish.addEventListener("click", function () {
    if (!session || session.busy) return;
    stopListening(); stopSpeaking();
    setVoiceState("thinking", "Scoring your interview…");
    finish();
  });
  el.vEnd.addEventListener("click", exitVoice);

  renderPicker();
  paintMode();
  setBusy(false);
})();
