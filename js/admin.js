/* Admin (#admin, #admin/visitors). Two tabs:
 *   Users    — everyone who has signed up (profiles table), with last activity.
 *   Visitors — page views and unique visitors from the visits table, computed
 *              in the database by admin_visitor_stats().
 * The database only returns this data to emails listed in public.admins
 * (see supabase/schema.sql); everyone else gets nothing. */
(function () {
  const App = window.App;
  const esc = App.escapeHtml;
  const root = document.getElementById("admin-root");
  if (!root) return;

  const DAY = 86400000;
  const PROVIDERS = { google: "Google", facebook: "Facebook", email: "Email" };
  const state = { tab: "users", days: 30, users: null, stats: null, query: "", loading: false, error: null };

  const fmt = function (t) {
    return t ? new Date(t).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "–";
  };
  const ago = function (t) {
    if (!t) return "–";
    const s = (Date.now() - new Date(t)) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + " min ago";
    if (s < 86400) return Math.floor(s / 3600) + " h ago";
    if (s < 30 * 86400) return Math.floor(s / 86400) + " d ago";
    return new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };
  const num = function (n) { return Number(n || 0).toLocaleString("en-IN"); };

  function pageLabel(p) {
    if (!p) return "Unknown";
    const parts = p.split("/");
    const q = parts[1];
    const LABELS = { home: "Home", bank: "Question bank", ai: "AI interview", drill: "Maths drills", firms: "Firm prep", progress: "Progress", admin: "Admin", "sign-in": "Sign-in page" };
    if (parts[0] === "learn") return "Guide: " + (q || "").replace(/-/g, " ").replace(/^./, function (c) { return c.toUpperCase(); });
    if (parts[0] === "bank" && q) return "Model interview " + q;
    if (parts[0] === "ai" && q) return "AI interview · " + q;
    if (parts[0] === "firms" && q) { const f = App.findFirm(q); return "Firm: " + (f ? f.short : q); }
    if (parts[0] === "drill" && q) return "Maths drills · " + q;
    return LABELS[parts[0]] || p;
  }
  function zone() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch (e) { return "UTC"; } }
  function host(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return url; } }

  /* ---------- Shell ---------- */

  function shell(body) {
    const noTrack = App.storageGet("bp.noTrack") === "1";
    root.innerHTML =
      '<div class="page-head admin-head"><div><h1>' + (state.tab === "users" ? "Users" : "Visitors") + "</h1>" +
        '<p class="subtitle">' + (state.tab === "users"
          ? "Everyone who has created an account. Also in Supabase under Authentication → Users."
          : "Everyone who opens the site, signed in or not. Counted with a random id per browser; no IP addresses are stored.") + "</p></div>" +
        '<label class="admin-optout"><input type="checkbox" id="admin-notrack"' + (noTrack ? " checked" : "") + "> Don&rsquo;t count my visits from this browser</label></div>" +
      '<div class="admin-tabs" role="tablist">' +
        '<a role="tab" href="#admin" aria-selected="' + (state.tab === "users") + '">Users' + (state.users ? " <span>" + num(state.users.length) + "</span>" : "") + "</a>" +
        '<a role="tab" href="#admin/visitors" aria-selected="' + (state.tab === "visitors") + '">Visitors' + (state.stats ? " <span>" + num(state.stats.totals.visitors) + "</span>" : "") + "</a>" +
      "</div>" + body;
  }

  function notice(title, body) {
    shell('<div class="box empty-state"><h2>' + title + "</h2><p>" + body + "</p></div>");
  }

  /* ---------- Users tab ---------- */

  function paintUsers() {
    const rows = state.users || [];
    const activity = {};
    ((state.stats && state.stats.users) || []).forEach(function (u) { activity[u.user_id] = u; });
    const now = Date.now();
    const q = state.query.toLowerCase();
    const list = rows.filter(function (r) { return !q || [r.full_name, r.email, r.provider].join(" ").toLowerCase().includes(q); });
    const by = {};
    rows.forEach(function (r) { by[r.provider || "email"] = (by[r.provider || "email"] || 0) + 1; });
    shell(
      '<ul class="kpis">' +
        "<li><span>Total users</span><b>" + num(rows.length) + "</b><small>All time</small></li>" +
        "<li><span>New this week</span><b>" + num(rows.filter(function (r) { return now - new Date(r.created_at) < 7 * DAY; }).length) + "</b><small>Joined in the last 7 days</small></li>" +
        "<li><span>Active this week</span><b>" + num(rows.filter(function (r) { const a = activity[r.id]; const t = Math.max(r.last_sign_in_at ? +new Date(r.last_sign_in_at) : 0, a ? +new Date(a.last_seen) : 0); return now - t < 7 * DAY; }).length) + "</b><small>Used the site, last 7 days</small></li>" +
        '<li><span>Sign-in method</span><b class="kpi-split">' + (Object.keys(by).length ? Object.keys(by).map(function (k) { return '<span class="prov prov-' + esc(k) + '">' + esc(PROVIDERS[k] || k) + " " + by[k] + "</span>"; }).join("") : "–") + "</b><small>Accounts by provider</small></li>" +
      "</ul>" +
      '<div class="admin-bar"><input type="search" id="admin-search" placeholder="Search name, email or provider" value="' + esc(state.query) + '">' +
        '<span class="muted">' + num(list.length) + " shown</span>" +
        '<button class="btn ghost" type="button" id="admin-refresh">Refresh</button>' +
        '<button class="btn" type="button" id="admin-csv">Export CSV</button></div>' +
      '<div class="box admin-table"><table class="plain"><thead><tr><th>User</th><th>Signed up with</th><th>Joined</th><th>Last active</th><th class="num">Page views</th></tr></thead><tbody>' +
        (list.length ? list.map(function (r) {
          const a = activity[r.id];
          const last = [r.last_sign_in_at, a && a.last_seen].filter(Boolean).sort().pop();
          const face = r.avatar_url ? '<img src="' + esc(r.avatar_url) + '" alt="" referrerpolicy="no-referrer">' : "<span>" + esc((r.full_name || r.email || "?")[0].toUpperCase()) + "</span>";
          return '<tr><td><div class="who"><span class="av">' + face + "</span><div><b>" + esc(r.full_name || "—") + "</b><small>" + esc(r.email || "") + "</small></div></div></td>" +
            '<td><span class="prov prov-' + esc(r.provider || "email") + '">' + esc(PROVIDERS[r.provider] || r.provider || "Email") + "</span></td>" +
            '<td title="' + esc(fmt(r.created_at)) + '">' + esc(ago(r.created_at)) + '</td><td title="' + esc(fmt(last)) + '">' + esc(ago(last)) + "</td>" +
            '<td class="num">' + (a ? num(a.views) : "–") + "</td></tr>";
        }).join("") : '<tr><td colspan="5" class="muted">' + (rows.length ? "No users match." : "No sign-ups yet. They'll appear here as soon as someone creates an account.") + "</td></tr>") +
      "</tbody></table></div>");
  }

  /* ---------- Visitors tab ---------- */

  function dailyChart(stats) {
    const byDay = {};
    (stats.daily || []).forEach(function (d) { byDay[d.day] = d; });
    const days = [];
    const start = new Date(stats.since); start.setHours(0, 0, 0, 0);
    for (let t = start.getTime(); t <= Date.now(); t += DAY) {
      const d = new Date(t);
      const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      days.push({ key: key, t: t, v: byDay[key] ? byDay[key].visitors : 0, views: byDay[key] ? byDay[key].views : 0 });
    }
    const max = Math.max(1, Math.max.apply(null, days.map(function (d) { return d.v; })));
    const W = Math.max(320, Math.min(1100, (root.clientWidth || 900) - 60)), H = 180, L = 30, B = 22, T = 10;
    const bw = (W - L) / days.length;
    const y = function (v) { return T + (H - T - B) * (1 - v / max); };
    let svg = '<svg class="ill chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Unique visitors per day">';
    [0, max].forEach(function (v) { svg += '<line class="grid" x1="' + L + '" x2="' + W + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text class="xs end" x="' + (L - 6) + '" y="' + (y(v) + 4) + '">' + v + "</text>"; });
    days.forEach(function (d, i) {
      const x = L + i * bw;
      const h = Math.max(d.v ? 2 : 0, (H - T - B) * d.v / max);
      const label = new Date(d.t).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      svg += '<rect class="bar" x="' + (x + bw * 0.15).toFixed(1) + '" y="' + (H - B - h).toFixed(1) + '" width="' + Math.max(1, bw * 0.7).toFixed(1) + '" height="' + h.toFixed(1) + '" rx="' + Math.min(4, bw * 0.3).toFixed(1) + '"/>' +
        '<rect class="hit" x="' + x.toFixed(1) + '" y="' + T + '" width="' + bw.toFixed(1) + '" height="' + (H - T - B) + '" data-tip="' + esc(label + " · " + d.v + " visitor" + (d.v === 1 ? "" : "s") + " · " + d.views + " views") + '"/>';
    });
    const first = new Date(days[0].t).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    svg += '<text class="xs" x="' + L + '" y="' + (H - 4) + '">' + first + '</text><text class="xs end" x="' + W + '" y="' + (H - 4) + '">Today</text>';
    return svg + "</svg>";
  }

  function barList(rows, labelFn, valueKey, unit) {
    if (!rows.length) return '<p class="chart-empty">Nothing yet.</p>';
    const max = Math.max.apply(null, rows.map(function (r) { return r[valueKey]; }));
    return '<ul class="hbars hbars-wide">' + rows.map(function (r) {
      return '<li><span class="hb-label" title="' + esc(labelFn(r)) + '">' + esc(labelFn(r)) + '</span><span class="hb-track"><i style="width:' + Math.max(2, r[valueKey] / max * 100).toFixed(1) + '%"></i></span><span class="hb-val">' + num(r[valueKey]) + " " + unit + "</span></li>";
    }).join("") + "</ul>";
  }

  function paintVisitors() {
    const s = state.stats;
    const t = s.totals;
    const conv = t.visitors ? Math.round(s.signups / t.visitors * 1000) / 10 : 0;
    const q = state.query.toLowerCase();
    const list = (s.visitors || []).filter(function (v) {
      return !q || [v.email, v.full_name, v.visitor_id, v.referrer, v.device, v.timezone].join(" ").toLowerCase().includes(q);
    });
    shell(
      '<div class="admin-bar"><div class="seg seg-sm" role="radiogroup" aria-label="Date range">' + [7, 30, 90].map(function (d) {
        return '<button type="button" role="radio" data-days="' + d + '" aria-checked="' + (state.days === d) + '"><b>' + d + " days</b></button>";
      }).join("") + '</div><span class="muted">Since ' + esc(new Date(s.since).toLocaleDateString("en-IN", { day: "numeric", month: "short" })) + '</span><button class="btn ghost" type="button" id="admin-refresh">Refresh</button></div>' +
      '<ul class="kpis">' +
        "<li><span>Unique visitors</span><b>" + num(t.visitors) + "</b><small>" + num(s.today.visitors) + " today</small></li>" +
        "<li><span>Page views</span><b>" + num(t.views) + "</b><small>" + (t.visitors ? (t.views / t.visitors).toFixed(1) : "0") + " per visitor</small></li>" +
        "<li><span>Sign-ups</span><b>" + num(s.signups) + "</b><small>" + conv + "% of visitors</small></li>" +
        "<li><span>Signed-in visitors</span><b>" + num(t.signed_in_visitors) + "</b><small>Used the site while signed in</small></li>" +
      "</ul>" +
      '<section class="box"><h3 class="box-h">Visitors per day</h3>' + dailyChart(s) + "</section>" +
      '<div class="dash-grid admin-grid">' +
        '<section class="box"><h3 class="box-h">Top pages</h3>' + barList(s.pages || [], function (r) { return pageLabel(r.path); }, "views", "views") + "</section>" +
        '<section class="box"><h3 class="box-h">Where visitors come from</h3>' + barList(s.referrers || [], function (r) { return host(r.referrer); }, "visitors", "") +
          '<h3 class="box-h" style="margin-top:1.4rem">Devices</h3>' + barList(s.devices || [], function (r) { return r.device.replace(/^./, function (c) { return c.toUpperCase(); }); }, "visitors", "") + "</section>" +
      "</div>" +
      '<div class="admin-bar"><input type="search" id="admin-search" placeholder="Search visitors by email, source, device or timezone" value="' + esc(state.query) + '">' +
        '<span class="muted">' + num(list.length) + " shown" + ((s.visitors || []).length >= 500 ? " (latest 500)" : "") + "</span>" +
        '<button class="btn" type="button" id="admin-csv">Export CSV</button></div>' +
      '<div class="box admin-table"><table class="plain"><thead><tr><th>Visitor</th><th>First seen</th><th>Last seen</th><th class="num">Views</th><th>Device</th><th>Came from</th><th>Timezone</th></tr></thead><tbody>' +
        (list.length ? list.map(function (v) {
          const who = v.email
            ? '<div class="who"><span class="av"><span>' + esc((v.full_name || v.email)[0].toUpperCase()) + "</span></span><div><b>" + esc(v.full_name || v.email) + '</b><small>' + esc(v.email) + ' · <span class="tag-in">Signed up</span></small></div></div>'
            : '<div class="who"><span class="av anon"><span>?</span></span><div><b>Anonymous</b><small>' + esc(String(v.visitor_id).slice(0, 8)) + "</small></div></div>";
          return "<tr><td>" + who + '</td><td title="' + esc(fmt(v.first_seen)) + '">' + esc(ago(v.first_seen)) + '</td><td title="' + esc(fmt(v.last_seen)) + '">' + esc(ago(v.last_seen)) + "</td>" +
            '<td class="num">' + num(v.views) + "</td><td>" + esc(v.device || "–") + "</td><td>" + esc(v.referrer ? host(v.referrer) : "Direct") + "</td><td>" + esc(v.timezone || "–") + "</td></tr>";
        }).join("") : '<tr><td colspan="7" class="muted">' + ((s.visitors || []).length ? "No visitors match." : "No visits recorded yet. They appear here within seconds of someone opening the site.") + "</td></tr>") +
      "</tbody></table></div>");
  }

  /* ---------- Loading ---------- */

  function paint() {
    if (state.error) return notice(state.error[0], state.error[1]);
    if (state.tab === "users" ? !state.users : !state.stats) return shell('<div class="box empty-state"><p>Loading…</p></div>');
    if (state.tab === "users") paintUsers(); else paintVisitors();
  }

  // Supabase returns at most 1,000 rows per request, so page through profiles.
  async function fetchAllProfiles(sb) {
    const out = [];
    for (let from = 0; from < 100000; from += 1000) {
      const r = await sb.from("profiles").select("*").order("created_at", { ascending: false }).range(from, from + 999);
      if (r.error) throw r.error;
      out.push.apply(out, r.data || []);
      if (!r.data || r.data.length < 1000) break;
    }
    return out;
  }

  // This page doesn't exist for anyone but admins: nothing is shown while
  // checking, and everyone else is sent to the home page.
  let adminFor = null; // id of the signed-in user confirmed as an admin
  function leave() {
    root.innerHTML = "";
    if (location.hash.indexOf("#admin") === 0) location.replace("#learn");
  }

  async function load() {
    const sb = App.supabase;
    state.error = null;
    if (!App.user) { root.innerHTML = ""; return; }   // sign-in still being restored; bp:user calls load again
    if (!sb || !App.signedIn()) return leave();
    const uid = App.user.id;
    if (adminFor !== uid) {
      root.innerHTML = "";
      let admin = null;
      try { admin = await sb.rpc("is_admin"); } catch (e) { admin = null; }
      if (!App.user || App.user.id !== uid) return;   // account changed while checking
      if (!admin || admin.data !== true) return leave();
      adminFor = uid;
    }
    if (!onAdmin) return;
    paint();
    try {
      const results = await Promise.all([fetchAllProfiles(sb), sb.rpc("admin_visitor_stats", { num_days: state.days, tz: zone() })]);
      state.users = results[0];
      if (results[1].error) throw results[1].error;
      state.stats = results[1].data;
    } catch (err) {
      state.error = ["Couldn't load the data", esc(err.message || String(err)) + ". If you set up accounts before visitor tracking existed, run the latest supabase/schema.sql again."];
    }
    paint();
  }

  async function reloadStats() {
    const r = await App.supabase.rpc("admin_visitor_stats", { num_days: state.days, tz: zone() });
    if (r.error) state.error = ["Couldn't load visitors", esc(r.error.message)]; else state.stats = r.data;
    paint();
  }

  function csv() {
    const line = function (vals) { return vals.map(function (v) { return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"'; }).join(","); };
    let cols, rows, name;
    if (state.tab === "users") {
      cols = ["full_name", "email", "provider", "created_at", "last_sign_in_at"];
      rows = state.users || []; name = "breaking-point-users.csv";
    } else {
      cols = ["visitor_id", "email", "full_name", "first_seen", "last_seen", "views", "pages", "device", "referrer", "timezone"];
      rows = (state.stats && state.stats.visitors) || []; name = "breaking-point-visitors.csv";
    }
    const text = [line(cols)].concat(rows.map(function (r) { return line(cols.map(function (c) { return r[c]; })); })).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
    a.download = name;
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ---------- Events ---------- */

  root.addEventListener("input", function (e) {
    if (e.target.id !== "admin-search") return;
    state.query = e.target.value;
    const pos = e.target.selectionStart;
    paint();
    const s = document.getElementById("admin-search");
    s.focus(); s.setSelectionRange(pos, pos);
  });
  root.addEventListener("change", function (e) {
    if (e.target.id === "admin-notrack") App.storageSet("bp.noTrack", e.target.checked ? "1" : null);
  });
  root.addEventListener("click", function (e) {
    if (e.target.closest("#admin-refresh")) load();
    else if (e.target.closest("#admin-csv")) csv();
    const d = e.target.closest("[data-days]");
    if (d) { state.days = Number(d.dataset.days); state.stats = null; paint(); reloadStats(); }
  });

  const tip = document.createElement("div");
  tip.className = "tooltip";
  tip.hidden = true;
  document.body.appendChild(tip);
  root.addEventListener("mouseover", function (e) {
    const t = e.target.closest("[data-tip]");
    if (!t) { tip.hidden = true; return; }
    tip.textContent = t.getAttribute("data-tip");
    tip.hidden = false;
    const r = t.getBoundingClientRect();
    tip.style.left = Math.min(window.innerWidth - tip.offsetWidth - 8, Math.max(8, r.left + r.width / 2 - tip.offsetWidth / 2)) + "px";
    tip.style.top = Math.max(8, r.top - tip.offsetHeight - 8) + "px";
  });
  root.addEventListener("mouseleave", function () { tip.hidden = true; });

  let onAdmin = false;
  App.onRoute(function (route) {
    tip.hidden = true;
    const was = onAdmin;
    onAdmin = route.tab === "admin";
    if (!onAdmin) { root.innerHTML = ""; return; }
    const tab = route.arg === "visitors" ? "visitors" : "users";
    if (tab !== state.tab) { state.tab = tab; state.query = ""; }
    // Switching between the Users and Visitors tabs reuses what's loaded; anything else re-checks.
    if (was && App.user && adminFor === App.user.id && (state.users || state.error)) paint(); else load();
  });
  // A different account (or signing out) never sees the previous admin's data.
  document.addEventListener("bp:user", function () {
    adminFor = null;
    state.users = null; state.stats = null; state.error = null; state.query = "";
    root.innerHTML = "";
    if (onAdmin) load();
  });
})();
