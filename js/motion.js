/* Home page motion: the reel in the hero, entrances that play once, the
   figures in the ledger and the name in the footer. Everything here is an enhancement; without it the
   page shows its finished state (see the .js rules in css/style.css). */
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasIO = "IntersectionObserver" in window;

  /* ---------- The reel: one held stage, four steps ---------- */
  const hero = document.getElementById("hero");
  const reel = document.getElementById("reel");
  if (hero && reel) {
    const frames = Array.prototype.slice.call(reel.querySelectorAll(".frame"));
    const count = document.getElementById("reel-count");
    const form = document.getElementById("est");
    let step = -1;
    let ticking = false;

    const show = function (n) {
      if (n === step) return;
      step = n;
      reel.style.setProperty("--i", n);
      frames.forEach(function (f, i) { f.classList.toggle("is-on", i === n); });
      if (count) count.textContent = n + 1 + " of " + frames.length;
      // The live estimate only takes focus while its frame is the one in view.
      if (form) form.inert = n !== 0;
    };

    const measure = function () {
      ticking = false;
      if (hero.offsetParent === null) return; // home page not showing
      const stage = hero.firstElementChild;
      const travel = hero.offsetHeight - stage.offsetHeight;
      if (travel <= 0) { show(0); return; }
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const p = Math.min(Math.max((top - hero.getBoundingClientRect().top) / travel, 0), 0.9999);
      show(Math.floor(p * frames.length));
    };
    const onScroll = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(measure); }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", function () { setTimeout(measure, 0); });
    show(0);
    measure();
  }

  /* ---------- Entrances, once ---------- */
  const reveal = Array.prototype.slice.call(document.querySelectorAll("[data-reveal], [data-reveal-rows]"));
  reveal.forEach(function (el) {
    if (el.hasAttribute("data-reveal-rows")) {
      Array.prototype.forEach.call(el.children, function (li, i) { li.style.setProperty("--d", Math.min(i, 10)); });
    }
  });
  if (!hasIO || reduced) {
    reveal.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.1 });
    reveal.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Figures in the ledger count up once ---------- */
  const figures = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  const countUp = function (el) {
    const end = Number(el.textContent);
    const start = performance.now();
    const ease = function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }; // expo out
    const tick = function (now) {
      const t = Math.min((now - start) / 1100, 1);
      el.textContent = Math.round(end * ease(t));
      if (t < 1) requestAnimationFrame(tick);
    };
    el.textContent = "0";
    requestAnimationFrame(tick);
  };
  if (hasIO && !reduced) {
    const co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -15% 0px" });
    figures.forEach(function (el) { co.observe(el); });
  }

  /* ---------- The cropped name in the footer fills the width exactly ---------- */
  const mark = document.querySelector(".foot-mark");
  const fit = function () {
    if (!mark || !mark.offsetWidth) return;
    mark.style.fontSize = "";
    const cs = getComputedStyle(mark);
    const room = mark.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const size = parseFloat(cs.fontSize);
    const range = document.createRange();
    range.selectNodeContents(mark);
    const used = range.getBoundingClientRect().width;
    if (used > 0) mark.style.fontSize = (size * room / used).toFixed(2) + "px";
  };
  window.addEventListener("resize", fit);
  window.addEventListener("hashchange", function () { setTimeout(fit, 0); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  document.addEventListener("DOMContentLoaded", function () { requestAnimationFrame(fit); });

  /* ---------- The interviewer's waveform moves only while on screen ---------- */
  const orb = document.querySelector(".slot-orb");
  if (orb && hasIO && !reduced) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { orb.classList.toggle("is-live", e.isIntersecting); });
    }).observe(orb);
  }
})();
