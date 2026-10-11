/* Sign-in: Google, Facebook, or email with a one-time code (Supabase Auth).
 *
 * Until js/config.js has Supabase keys, the sign-in page still shows (so the
 * design can be reviewed) and visitors can continue as a guest. Once keys are
 * set, the app opens only for signed-in users (unless allowGuest is true).
 */
(function () {
  const App = window.App;
  const esc = App.escapeHtml;
  const cfg = window.BP_CONFIG || {};
  const configured = !!(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase && window.supabase.createClient);
  const allowGuest = cfg.allowGuest == null ? !configured : !!cfg.allowGuest;
  const OTP_LEN = Math.max(4, Math.min(10, cfg.otpLength || 6));
  const GUEST_KEY = "bp.guest";
  const RETURN_KEY = "bp.returnTo";
  const RESEND_SECS = 60;

  const client = configured
    ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
        auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      })
    : null;

  const $ = function (id) { return document.getElementById(id); };
  const el = {
    root: $("auth"), start: $("auth-start"), code: $("auth-code"),
    title: $("auth-title"), sub: $("auth-sub"), form: $("auth-form"), nameRow: $("auth-name-row"),
    name: $("auth-name"), email: $("auth-email"), submit: $("auth-submit"), msg: $("auth-msg"),
    switchText: $("auth-switch-text"), switchBtn: $("auth-switch"), social: $("auth-social"),
    codeTo: $("auth-code-to"), otp: $("auth-otp"), verify: $("auth-verify"), codeMsg: $("auth-code-msg"),
    resend: $("auth-resend"), back: $("auth-back"), guest: $("auth-guest"), preview: $("auth-preview"),
    userSlot: $("user-slot")
  };
  if (!el.root) return;

  let mode = "signin";          // "signin" | "signup"
  let pendingEmail = "";
  let resendTimer = null;
  let user = null;

  /* ---------- Gate ---------- */

  function showAuth() {
    document.documentElement.classList.remove("auth-pending");
    document.body.classList.add("auth-open");
    el.root.hidden = false;
    setStep("start");
    renderUser();
  }
  function hideAuth() {
    document.documentElement.classList.remove("auth-pending");
    document.body.classList.remove("auth-open");
    el.root.hidden = true;
  }

  function enter(u) {
    user = u;
    App.user = u;
    hideAuth();
    renderUser();
    const back = sessionStorageGet(RETURN_KEY);
    if (back) { sessionStorageSet(RETURN_KEY, null); if (back !== location.hash) location.hash = back; }
    document.dispatchEvent(new CustomEvent("bp:user", { detail: u }));
  }

  function fromSupabase(su) {
    const m = su.user_metadata || {};
    return {
      id: su.id, email: su.email || "", provider: (su.app_metadata && su.app_metadata.provider) || "email",
      name: m.full_name || m.name || (su.email ? su.email.split("@")[0] : "You"),
      avatar: m.avatar_url || m.picture || ""
    };
  }

  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sessionStorageSet(k, v) { try { if (v == null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  /* ---------- Steps and messages ---------- */

  // Google-only mode (emailSignIn: false): one "Continue with Google" button, no
  // email form, no codes. The first Google sign-in creates the account.
  const emailOn = cfg.emailSignIn !== false;

  function setMode(m) {
    mode = m;
    if (!emailOn) {
      el.title.textContent = "Welcome to Breaking Point";
      el.sub.textContent = "Sign in with your Google account to continue. New here? The same button creates your account.";
      say(el.msg, "");
      return;
    }
    const up = m === "signup";
    el.title.textContent = up ? "Create your account" : "Welcome back";
    el.sub.textContent = up ? "Free to use. Save your progress and pick up on any device." : "Sign in to continue your case prep.";
    el.nameRow.hidden = !up;
    el.name.required = up;
    el.submit.textContent = up ? "Create account" : "Continue with email";
    el.switchText.textContent = up ? "Already have an account?" : "New to Breaking Point?";
    el.switchBtn.textContent = up ? "Sign in" : "Create an account";
    say(el.msg, "");
  }

  function setStep(step) {
    el.start.hidden = step !== "start";
    el.code.hidden = step !== "code";
    if (step === "code") {
      el.codeTo.textContent = pendingEmail;
      el.otp.querySelectorAll("input").forEach(function (i) { i.value = ""; });
      say(el.codeMsg, "");
      el.otp.querySelector("input").focus();
      startResendTimer();
    }
  }

  function say(node, text, kind) {
    node.textContent = text;
    node.className = "auth-msg" + (kind ? " " + kind : "");
    node.hidden = !text;
  }

  function busy(btn, on, label) {
    btn.disabled = on;
    // Keep the button's own markup (e.g. the Google logo) to restore afterwards.
    if (on) { btn._html = btn.innerHTML; btn.innerHTML = '<span class="spin" aria-hidden="true"></span>' + esc(label || "Please wait"); }
    else if (btn._html != null) { btn.innerHTML = btn._html; btn._html = null; }
  }

  function notConnected(node) {
    say(node, "Sign-in isn't connected on this site yet." + (allowGuest ? " You can continue as a guest for now." : ""), "warn");
  }

  function friendly(err) {
    const m = (err && err.message) || String(err || "");
    if (/signups not allowed|user not found/i.test(m)) return "There's no account with this email yet. Create one instead?";
    if (/rate limit|too many|security purposes/i.test(m)) return "Too many attempts. Wait a minute, then try again.";
    if (/expired|invalid/i.test(m) && /token|otp|code/i.test(m)) return "That code is wrong or has expired. Check the latest email, or resend.";
    if (/provider is not enabled|unsupported provider/i.test(m)) return "That sign-in option isn't switched on yet." + (emailOn ? " Use email for now." : allowGuest ? " You can continue as a guest for now." : " Please try again later.");
    if (/fetch|network/i.test(m)) return "Couldn't reach the sign-in service. Check your connection.";
    return m || "Something went wrong. Please try again.";
  }

  /* ---------- Social sign-in ---------- */

  // Once connected, show only providers switched on in config (preview mode shows all);
  // drop the "or" divider if none remain.
  const providers = cfg.providers || {};
  el.social.querySelectorAll("[data-provider]").forEach(function (b) {
    if (configured && providers[b.dataset.provider] !== true) b.hidden = true;
  });
  if (!el.social.querySelector("[data-provider]:not([hidden])")) {
    el.social.hidden = true;
    el.social.nextElementSibling.hidden = true;
  }
  if (!emailOn) {
    el.form.hidden = true;
    el.social.nextElementSibling.hidden = true;   // the "or" divider
    el.switchBtn.parentNode.hidden = true;        // "New to Breaking Point? Create an account"
    el.social.after(el.msg);                      // keep messages visible without the form
  }

  // Ask Supabase which providers are switched on, so a button that isn't set up yet
  // shows a message instead of sending people to an error page.
  function providerEnabled(name) {
    return fetch(cfg.supabaseUrl.replace(/\/$/, "") + "/auth/v1/settings", { headers: { apikey: cfg.supabaseAnonKey } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (s) { return !(s && s.external && s.external[name] === false); })
      .catch(function () { return true; });   // can't tell: try anyway
  }

  el.social.addEventListener("click", function (e) {
    const b = e.target.closest("[data-provider]");
    if (!b) return;
    if (!client) return notConnected(el.msg);
    sessionStorageSet(RETURN_KEY, location.hash || "");
    busy(b, true, "Redirecting…");
    providerEnabled(b.dataset.provider).then(function (on) {
      if (!on) { busy(b, false); say(el.msg, friendly({ message: "provider is not enabled" }), "warn"); return; }
      return client.auth.signInWithOAuth({
        provider: b.dataset.provider,
        options: { redirectTo: location.origin + location.pathname }
      }).then(function (res) {
        if (res.error) { busy(b, false); say(el.msg, friendly(res.error), "err"); }
      });
    });
  });

  /* ---------- Email + one-time code ---------- */

  function sendCode(email, name) {
    return client.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: mode === "signup",
        data: mode === "signup" && name ? { full_name: name } : undefined,
        emailRedirectTo: location.origin + location.pathname
      }
    });
  }

  el.form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = el.email.value.trim().toLowerCase();
    const name = el.name.value.trim();
    if (mode === "signup" && !name) { say(el.msg, "Please enter your name.", "err"); el.name.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say(el.msg, "Please enter a valid email address.", "err"); el.email.focus(); return; }
    if (!client) return notConnected(el.msg);
    busy(el.submit, true, "Sending code…");
    sendCode(email, name).then(function (res) {
      busy(el.submit, false);
      if (res.error) {
        say(el.msg, friendly(res.error), "err");
        if (/no account/i.test(friendly(res.error))) el.switchBtn.classList.add("nudge");
        return;
      }
      pendingEmail = email;
      setStep("code");
    });
  });

  function otpValue() {
    return Array.from(el.otp.querySelectorAll("input")).map(function (i) { return i.value; }).join("");
  }

  function verify() {
    const token = otpValue();
    if (token.length !== OTP_LEN) { say(el.codeMsg, "Enter all " + OTP_LEN + " digits.", "err"); return; }
    busy(el.verify, true, "Verifying…");
    client.auth.verifyOtp({ email: pendingEmail, token: token, type: "email" }).then(function (res) {
      busy(el.verify, false);
      if (res.error) {
        say(el.codeMsg, friendly(res.error), "err");
        el.otp.classList.remove("shake"); void el.otp.offsetWidth; el.otp.classList.add("shake");
        return;
      }
      // onAuthStateChange takes it from here.
    });
  }

  // Build the code boxes: auto-advance, backspace to previous, paste a whole code.
  el.otp.innerHTML = Array.from({ length: OTP_LEN }, function (_, i) {
    return '<input inputmode="numeric" autocomplete="' + (i === 0 ? "one-time-code" : "off") + '" maxlength="1" aria-label="Digit ' + (i + 1) + '">';
  }).join("");
  const boxes = Array.from(el.otp.querySelectorAll("input"));
  boxes.forEach(function (box, i) {
    box.addEventListener("input", function () {
      const digits = box.value.replace(/\D/g, "");
      if (digits.length > 1) { fill(digits, i); return; }
      box.value = digits;
      if (digits && i < boxes.length - 1) boxes[i + 1].focus();
      if (otpValue().length === OTP_LEN) verify();
    });
    box.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !box.value && i > 0) { boxes[i - 1].focus(); boxes[i - 1].value = ""; e.preventDefault(); }
      else if (e.key === "ArrowLeft" && i > 0) boxes[i - 1].focus();
      else if (e.key === "ArrowRight" && i < boxes.length - 1) boxes[i + 1].focus();
      else if (e.key === "Enter") verify();
    });
    box.addEventListener("paste", function (e) {
      const text = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
      if (!text) return;
      e.preventDefault();
      fill(text, 0);
    });
  });
  function fill(digits, from) {
    digits.split("").slice(0, OTP_LEN - from).forEach(function (d, k) { boxes[from + k].value = d; });
    const next = Math.min(OTP_LEN - 1, from + digits.length);
    boxes[next].focus();
    if (otpValue().length === OTP_LEN) verify();
  }

  function startResendTimer() {
    clearInterval(resendTimer);
    let left = RESEND_SECS;
    el.resend.disabled = true;
    el.resend.textContent = "Resend code in " + left + "s";
    resendTimer = setInterval(function () {
      left--;
      if (left <= 0) { clearInterval(resendTimer); el.resend.disabled = false; el.resend.textContent = "Resend code"; }
      else el.resend.textContent = "Resend code in " + left + "s";
    }, 1000);
  }

  el.verify.addEventListener("click", verify);
  el.resend.addEventListener("click", function () {
    if (!client) return;
    el.resend.disabled = true;
    sendCode(pendingEmail, el.name.value.trim()).then(function (res) {
      if (res.error) { say(el.codeMsg, friendly(res.error), "err"); el.resend.disabled = false; return; }
      say(el.codeMsg, "A new code is on its way.", "ok");
      startResendTimer();
    });
  });
  el.back.addEventListener("click", function () { clearInterval(resendTimer); setStep("start"); el.email.focus(); });
  el.switchBtn.addEventListener("click", function () { el.switchBtn.classList.remove("nudge"); setMode(mode === "signin" ? "signup" : "signin"); (mode === "signup" ? el.name : el.email).focus(); });

  /* ---------- Guest access (before Supabase is connected) ---------- */

  el.guest.hidden = !allowGuest;
  el.preview.hidden = configured;
  el.guest.addEventListener("click", function () {
    App.storageSet(GUEST_KEY, "1");
    enter({ id: "guest", guest: true, name: "Guest", email: "", provider: "guest", avatar: "" });
  });

  /* ---------- Header account menu ---------- */

  function initials(n) {
    return String(n || "?").split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  }

  function renderUser() {
    if (!el.userSlot) return;
    if (!user) { el.userSlot.innerHTML = ""; return; }
    const face = user.avatar
      ? '<img src="' + esc(user.avatar) + '" alt="" referrerpolicy="no-referrer">'
      : "<span>" + esc(initials(user.name)) + "</span>";
    el.userSlot.innerHTML =
      '<div class="acct"><button class="acct-btn" type="button" id="acct-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Account">' + face + "</button>" +
      '<div class="acct-menu" id="acct-menu" role="menu" hidden>' +
        '<div class="acct-who"><b>' + esc(user.name) + "</b>" + (user.email ? "<span>" + esc(user.email) + "</span>" : "<span>Not signed in</span>") + "</div>" +
        '<a role="menuitem" href="#progress">Your progress</a>' +
        '<a role="menuitem" href="#firms">Firm prep plans</a>' +
        '<a role="menuitem" href="#admin" id="acct-admin" hidden>Admin: users &amp; visitors</a>' +
        '<button role="menuitem" type="button" id="acct-out">' + (user.guest ? "Sign in or create account" : "Sign out") + "</button>" +
      "</div></div>";
    if (client && !user.guest) {
      client.rpc("is_admin").then(function (res) {
        const a = document.getElementById("acct-admin");
        if (a && res && res.data === true) a.hidden = false;
        App.isAdmin = !!(res && res.data === true);
      });
    }
  }

  document.addEventListener("click", function (e) {
    const btn = document.getElementById("acct-btn");
    const menu = document.getElementById("acct-menu");
    if (!btn || !menu) return;
    if (btn.contains(e.target)) {
      const open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      return;
    }
    if (e.target.id === "acct-out") { signOut(); }
    if (!menu.contains(e.target) || e.target.closest("a")) { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); }
  });
  document.addEventListener("keydown", function (e) {
    const menu = document.getElementById("acct-menu");
    if (e.key === "Escape" && menu && !menu.hidden) { menu.hidden = true; document.getElementById("acct-btn").focus(); }
  });

  function signOut() {
    App.storageSet(GUEST_KEY, null);
    user = null;
    App.user = null;
    if (client) client.auth.signOut().finally(function () { setMode("signin"); showAuth(); });
    else { setMode("signin"); showAuth(); }
  }
  App.signOut = signOut;
  App.supabase = client;
  // Open the sign-in screen from inside the app (e.g. a guest on the Progress tab).
  // The current page is kept, so people land back on it after signing in.
  App.showSignIn = function () {
    App.storageSet(GUEST_KEY, null);
    user = null;
    App.user = null;
    setMode("signin");
    showAuth();
  };

  /* ---------- Start ---------- */

  setMode("signin");
  if (client) {
    client.auth.onAuthStateChange(function (event, session) {
      if (session && session.user) { if (!user || user.id !== session.user.id) enter(fromSupabase(session.user)); }
      else if (event === "SIGNED_OUT") { user = null; showAuth(); }
    });
    client.auth.getSession().then(function (res) {
      const s = res && res.data && res.data.session;
      if (s && s.user) enter(fromSupabase(s.user));
      else if (allowGuest && App.storageGet(GUEST_KEY) === "1") enter({ id: "guest", guest: true, name: "Guest", email: "", provider: "guest", avatar: "" });
      else showAuth();
    }, function () { showAuth(); });
  } else if (allowGuest && App.storageGet(GUEST_KEY) === "1") {
    enter({ id: "guest", guest: true, name: "Guest", email: "", provider: "guest", avatar: "" });
  } else {
    showAuth();
  }
})();
