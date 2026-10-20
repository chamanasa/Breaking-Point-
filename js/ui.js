/* Shared interface pieces: the header's scroll edge, toasts, hold-to-confirm,
 * draggable bottom sheets, rolling digits, accordions and entrances.
 *
 * Motion rules followed throughout (Emil Kowalski):
 *   - transform and opacity only; transitions (interruptible), not keyframes,
 *     for anything that can fire twice in a second
 *   - enter and exit along the same path; exits faster than entrances
 *   - drags track the finger 1:1, dismiss on a flick (velocity > 0.11px/ms)
 *     as well as on distance, and resist past their edges instead of stopping
 *   - reduced motion keeps the fades and drops the movement
 */
(function () {
  const App = window.App;
  const reduced = function () { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; };

  /* ---------- Header: show its edge only once content scrolls under it ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    let ticking = false;
    const edge = function () {
      ticking = false;
      header.toggleAttribute("data-scrolled", window.scrollY > 4);
    };
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(edge); } }, { passive: true });
    edge();
  }

  /* ---------- Rubber band: past an edge, move less the further you pull ---------- */
  function rubberband(overshoot, dimension) {
    const c = 0.55;
    return (overshoot * dimension * c) / (dimension + c * Math.abs(overshoot));
  }

  /* ---------- Toasts ----------
   * App.toast("Saved to your account", { type: "ok" | "err" | "info" })
   * Up to three stack; timers pause while the tab is hidden or a toast is
   * hovered; swipe down (or flick) to dismiss. */
  const ICONS = {
    ok: '<svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>',
    err: '<svg viewBox="0 0 24 24"><path d="M12 7v6M12 17h.01"/></svg>',
    info: '<svg viewBox="0 0 24 24"><path d="M12 11v6M12 7h.01"/></svg>'
  };
  let toaster = null;
  const live = [];

  function restack() {
    live.forEach(function (t, i) {
      const depth = live.length - 1 - i;
      if (depth) t.el.setAttribute("data-stacked", Math.min(depth, 3)); else t.el.removeAttribute("data-stacked");
    });
  }

  function dismiss(t) {
    if (t.gone) return;
    t.gone = true;
    clearTimeout(t.timer);
    const i = live.indexOf(t);
    if (i >= 0) live.splice(i, 1);
    t.el.style.transform = "";
    t.el.setAttribute("data-leaving", "");
    setTimeout(function () { t.el.remove(); }, reduced() ? 200 : 260);
    restack();
  }

  function arm(t) {
    clearTimeout(t.timer);
    t.started = Date.now();
    t.timer = setTimeout(function () { dismiss(t); }, t.left);
  }
  function pause(t) {
    clearTimeout(t.timer);
    t.left = Math.max(800, t.left - (Date.now() - t.started));
  }

  function toast(message, opts) {
    opts = opts || {};
    if (!toaster) {
      toaster = document.createElement("section");
      toaster.className = "toaster";
      toaster.setAttribute("aria-label", "Notifications");
      toaster.setAttribute("aria-live", "polite");
      document.body.appendChild(toaster);
    }
    const type = opts.type || "ok";
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.setAttribute("role", type === "err" ? "alert" : "status");
    el.innerHTML = '<span class="t-ico" aria-hidden="true">' + ICONS[type] + "</span><p></p>";
    el.querySelector("p").textContent = message;
    toaster.appendChild(el);
    const t = { el: el, left: opts.duration || 4000, timer: null, started: 0 };
    live.push(t);
    while (live.length > 4) dismiss(live[0]);
    restack();
    arm(t);

    el.addEventListener("mouseenter", function () { live.forEach(pause); });
    el.addEventListener("mouseleave", function () { live.forEach(arm); });

    // Swipe down to dismiss: 1:1 tracking, dismiss on distance or a quick flick.
    let start = null;
    el.addEventListener("pointerdown", function (e) {
      if (start) return; // ignore a second finger
      start = { y: e.clientY, t: Date.now(), id: e.pointerId };
      el.setPointerCapture(e.pointerId);
      el.style.transition = "none";
      pause(t);
    });
    el.addEventListener("pointermove", function (e) {
      if (!start || e.pointerId !== start.id) return;
      const dy = e.clientY - start.y;
      el.style.transform = "translateY(" + (dy > 0 ? dy : rubberband(dy, 60)) + "px)";
    });
    const end = function (e) {
      if (!start || e.pointerId !== start.id) return;
      const dy = e.clientY - start.y;
      const v = Math.abs(dy) / Math.max(1, Date.now() - start.t);
      start = null;
      el.style.transition = "";
      if (dy > 40 || (dy > 0 && v > 0.11)) dismiss(t);
      else { el.style.transform = ""; arm(t); }
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    return { dismiss: function () { dismiss(t); } };
  }

  document.addEventListener("visibilitychange", function () {
    live.forEach(document.hidden ? pause : arm);
  });

  /* ---------- Hold to confirm ----------
   * For destructive actions: the fill sweeps across over 2s while held (linear,
   * because it is progress) and snaps back in 200ms on release. */
  function holdToConfirm(btn, onConfirm, label) {
    if (!btn || btn.dataset.hold) return;
    btn.dataset.hold = "1";
    btn.classList.add("hold");
    const text = btn.textContent;
    btn.innerHTML = '<span class="hold-fill" aria-hidden="true"></span><span class="hold-label"></span>';
    const lab = btn.querySelector(".hold-label");
    lab.textContent = text;
    btn.setAttribute("aria-label", label || "Press and hold to " + text.toLowerCase());
    btn.title = "Press and hold";
    let timer = null;
    const DURATION = 2000;
    const begin = function (e) {
      if (timer || (e.button != null && e.button !== 0)) return;
      btn.setAttribute("data-holding", "");
      lab.textContent = "Keep holding…";
      timer = setTimeout(function () {
        timer = null;
        btn.removeAttribute("data-holding");
        lab.textContent = text;
        onConfirm();
      }, DURATION);
    };
    const cancel = function () {
      if (!timer) return;
      clearTimeout(timer);
      timer = null;
      btn.removeAttribute("data-holding");
      lab.textContent = text;
    };
    btn.addEventListener("pointerdown", begin);
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { btn.addEventListener(ev, cancel); });
    btn.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && !e.repeat) { e.preventDefault(); begin(e); } });
    btn.addEventListener("keyup", function (e) { if (e.key === "Enter" || e.key === " ") cancel(); });
    btn.addEventListener("click", function (e) { e.preventDefault(); });
    btn.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  }

  /* ---------- Sheet and drawer drag ----------
   * Drag a sheet (down) or a side drawer (left) to dismiss it. Tracks the
   * finger 1:1 from where it was grabbed, rubber-bands the wrong way, and
   * dismisses on a flick or past a quarter of its size. Phone widths only.
   * opts: { axis: "y" | "x", sign: 1 (down/right) | -1 (up/left) } */
  function sheetDrag(panel, handle, onDismiss, opts) {
    opts = opts || {};
    const axis = opts.axis || "y";
    const sign = opts.sign || 1;
    const fn = axis === "y" ? "translateY" : "translateX";
    let s = null;
    const pos = function (e) { return axis === "y" ? e.clientY : e.clientX; };
    handle.addEventListener("pointerdown", function (e) {
      if (s || e.button > 0 || !window.matchMedia("(max-width: 820px)").matches) return;
      if (e.target.closest("button, a, input, select, textarea, [role=tab]")) return;
      s = { p: pos(e), q: axis === "y" ? e.clientX : e.clientY, t: Date.now(), id: e.pointerId,
        size: axis === "y" ? panel.offsetHeight : panel.offsetWidth, moved: false, dead: false };
    });
    handle.addEventListener("pointermove", function (e) {
      if (!s || s.dead || e.pointerId !== s.id) return;
      const d = (pos(e) - s.p) * sign;
      if (!s.moved) {
        const cross = Math.abs((axis === "y" ? e.clientX : e.clientY) - s.q);
        if (Math.abs(d) < 8 && cross < 8) return;       // a little hysteresis before committing
        if (cross > Math.abs(d)) { s.dead = true; return; } // the other axis won: let it scroll
        s.moved = true;
        handle.setPointerCapture(e.pointerId);
        panel.style.transition = "none";
      }
      const moved = d > 0 ? d : rubberband(d, s.size);
      panel.style.transform = fn + "(" + (moved * sign) + "px)";
    });
    const end = function (e) {
      if (!s || e.pointerId !== s.id) return;
      const d = (pos(e) - s.p) * sign;
      const v = d / Math.max(1, Date.now() - s.t);
      const was = s;
      s = null;
      if (!was.moved) return;
      panel.style.transition = "transform 300ms var(--ease-drawer)";
      if (d > was.size * 0.25 || v > 0.11) {
        panel.style.transform = fn + "(" + (sign * 100) + "%)";
        setTimeout(function () { panel.style.transition = ""; panel.style.transform = ""; onDismiss(); }, 280);
      } else {
        panel.style.transform = "";
        setTimeout(function () { panel.style.transition = ""; }, 300);
      }
    };
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  }

  /* ---------- Rolling digits ----------
   * App.roll(el, "30,000"): each digit is a column that slides to its value.
   * Transitions retarget, so dragging a slider fast never queues animations. */
  function roll(el, text) {
    text = String(text);
    let view = el.querySelector(".roll");
    let said = el.querySelector(".sr-only");
    if (!view) {
      el.textContent = "";
      said = document.createElement("span");
      said.className = "sr-only";
      view = document.createElement("span");
      view.className = "roll";
      view.setAttribute("aria-hidden", "true");
      el.append(said, view);
    }
    said.textContent = text;
    const shape = text.replace(/\d/g, "0");
    if (view.dataset.shape !== shape) {
      // New length: rebuild, start every column at 0 and roll up next frame.
      view.dataset.shape = shape;
      view.innerHTML = Array.prototype.map.call(text, function (ch) {
        if (!/\d/.test(ch)) return '<span class="roll-sep">' + ch + "</span>";
        return '<span class="roll-col">' + "0123456789".split("").map(function (d) { return "<span>" + d + "</span>"; }).join("") + "</span>";
      }).join("");
      view.offsetWidth; // commit the starting position
    }
    const cols = view.querySelectorAll(".roll-col");
    let c = 0;
    Array.prototype.forEach.call(text, function (ch) {
      if (/\d/.test(ch)) cols[c++].style.transform = "translateY(" + (-Number(ch)) + "em)";
    });
  }

  /* ---------- Accordion: height and opacity together, 200ms ---------- */
  function accordion(list) {
    if (!list) return;
    list.addEventListener("click", function (e) {
      const btn = e.target.closest("button[aria-expanded]");
      if (!btn) return;
      const panel = btn.nextElementSibling;
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      const from = panel.offsetHeight;
      panel.style.height = from + "px";
      panel.toggleAttribute("data-open", open);
      const to = open ? panel.scrollHeight : 0;
      requestAnimationFrame(function () { panel.style.height = to + "px"; });
      const done = function (ev) {
        if (ev.propertyName !== "height") return;
        panel.removeEventListener("transitionend", done);
        if (btn.getAttribute("aria-expanded") === "true") panel.style.height = "auto";
      };
      panel.addEventListener("transitionend", done);
      if (reduced()) panel.style.height = open ? "auto" : "0px";
    });
  }

  /* ---------- Entrances: once, children staggered 60ms ---------- */
  function reveal(root) {
    const els = Array.prototype.slice.call((root || document).querySelectorAll("[data-reveal]"));
    els.forEach(function (el) {
      Array.prototype.forEach.call(el.children, function (c, i) { c.style.setProperty("--i", Math.min(i, 6)); });
    });
    if (!("IntersectionObserver" in window) || reduced()) { els.forEach(function (el) { el.classList.add("is-in"); }); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  App.toast = toast;
  App.holdToConfirm = holdToConfirm;
  App.sheetDrag = sheetDrag;
  App.roll = roll;
  App.accordion = accordion;
  App.reveal = reveal;
})();
