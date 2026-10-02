/* Admin: users (#admin). Lists everyone who has signed up, read from the
 * profiles table. The database only returns all rows to emails listed in
 * public.admins (see supabase/schema.sql); everyone else gets their own row. */
(function () {
  const App = window.App;
  const esc = App.escapeHtml;
  const root = document.getElementById("admin-root");
  if (!root) return;

  const DAY = 86400000;
  const PROVIDERS = { google: "Google", facebook: "Facebook", email: "Email" };
  let rows = [];
  let query = "";

  const fmt = function (t) {
    return t ? new Date(t).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "–";
  };

  function head(sub) {
    return '<div class="page-head"><p class="kicker">Admin</p><h1>Users</h1><p class="subtitle">' + sub + "</p></div>";
  }

  function notice(title, body) {
    root.innerHTML = head("Everyone who has created an account.") + '<div class="box empty-state"><h2>' + title + "</h2><p>" + body + "</p></div>";
  }

  function paint() {
    const now = Date.now();
    const q = query.toLowerCase();
    const list = rows.filter(function (r) { return !q || [r.full_name, r.email, r.provider].join(" ").toLowerCase().includes(q); });
    const by = {};
    rows.forEach(function (r) { by[r.provider || "email"] = (by[r.provider || "email"] || 0) + 1; });
    root.innerHTML = head("Everyone who has created an account. Also visible in Supabase under Authentication → Users.") +
      '<ul class="kpis">' +
        "<li><span>Total users</span><b>" + rows.length + "</b><small>All time</small></li>" +
        "<li><span>New this week</span><b>" + rows.filter(function (r) { return now - new Date(r.created_at) < 7 * DAY; }).length + "</b><small>Joined in the last 7 days</small></li>" +
        "<li><span>Active this week</span><b>" + rows.filter(function (r) { return r.last_sign_in_at && now - new Date(r.last_sign_in_at) < 7 * DAY; }).length + "</b><small>Signed in, last 7 days</small></li>" +
        "<li><span>Sign-in method</span><b class=\"kpi-split\">" + Object.keys(by).map(function (k) { return '<span class="prov prov-' + esc(k) + '">' + esc(PROVIDERS[k] || k) + " " + by[k] + "</span>"; }).join("") + "</b><small>Accounts by provider</small></li>" +
      "</ul>" +
      '<div class="admin-bar"><input type="search" id="admin-search" placeholder="Search name, email or provider" value="' + esc(query) + '">' +
        '<span class="muted">' + list.length + " shown</span>" +
        '<button class="btn ghost" type="button" id="admin-refresh">Refresh</button>' +
        '<button class="btn" type="button" id="admin-csv">Export CSV</button></div>' +
      '<div class="box admin-table"><table class="plain"><thead><tr><th>User</th><th>Signed up with</th><th>Joined</th><th>Last sign-in</th></tr></thead><tbody>' +
        (list.length ? list.map(function (r) {
          const face = r.avatar_url ? '<img src="' + esc(r.avatar_url) + '" alt="" referrerpolicy="no-referrer">' : "<span>" + esc((r.full_name || r.email || "?")[0].toUpperCase()) + "</span>";
          return '<tr><td><div class="who"><span class="av">' + face + "</span><div><b>" + esc(r.full_name || "—") + "</b><small>" + esc(r.email || "") + "</small></div></div></td>" +
            '<td><span class="prov prov-' + esc(r.provider || "email") + '">' + esc(PROVIDERS[r.provider] || r.provider || "Email") + "</span></td>" +
            "<td>" + fmt(r.created_at) + "</td><td>" + fmt(r.last_sign_in_at) + "</td></tr>";
        }).join("") : '<tr><td colspan="4" class="muted">No users match.</td></tr>') +
      "</tbody></table></div>";
  }

  function load() {
    const sb = App.supabase;
    if (!sb) return notice("Accounts aren't connected yet", "Add your Supabase keys to js/config.js and run supabase/schema.sql. AUTH_SETUP.md walks through it.");
    if (!App.user || App.user.guest) return notice("Sign in first", "Sign in with an admin account to see users.");
    root.innerHTML = head("Loading users…");
    sb.rpc("is_admin").then(function (res) {
      if (!res || res.data !== true) return notice("You don't have access", "Only emails listed in the admins table can see this page. Add yours in Supabase: Table Editor → admins.");
      return sb.from("profiles").select("*").order("created_at", { ascending: false }).limit(5000).then(function (r) {
        if (r.error) return notice("Couldn't load users", esc(r.error.message) + ". Did you run supabase/schema.sql?");
        rows = r.data || [];
        paint();
      });
    });
  }

  function csv() {
    const cols = ["full_name", "email", "provider", "created_at", "last_sign_in_at"];
    const line = function (vals) { return vals.map(function (v) { return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"'; }).join(","); };
    const text = [line(cols)].concat(rows.map(function (r) { return line(cols.map(function (c) { return r[c]; })); })).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
    a.download = "breaking-point-users.csv";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  root.addEventListener("input", function (e) {
    if (e.target.id !== "admin-search") return;
    query = e.target.value;
    const pos = e.target.selectionStart;
    paint();
    const s = document.getElementById("admin-search");
    s.focus(); s.setSelectionRange(pos, pos);
  });
  root.addEventListener("click", function (e) {
    if (e.target.id === "admin-refresh") load();
    if (e.target.id === "admin-csv") csv();
  });

  let onAdmin = false;
  App.onRoute(function (route) { onAdmin = route.tab === "admin"; if (onAdmin) load(); });
  document.addEventListener("bp:user", function () { if (onAdmin) load(); });
})();
