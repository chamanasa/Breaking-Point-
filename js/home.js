/* Home page: firm logo wall and the logo strip on the Firm-Specific Prep row. */
(function () {
  const App = window.App;
  const esc = App.escapeHtml;
  const wall = document.getElementById("logo-wall");
  if (wall) {
    wall.innerHTML = App.firms.filter(function (f) { return f.group === "global"; }).slice(0, 6).map(function (f) {
      return '<a href="#firms/' + f.id + '" title="' + esc(f.name) + '">' + App.firmLogo(f.id, "sm") + "</a>";
    }).join("");
  }
  const strip = document.getElementById("mod-logos");
  if (strip) {
    const top = App.firms.filter(function (f) { return f.group === "global"; });
    strip.innerHTML = top.map(function (f) {
      return '<a href="#firms/' + f.id + '" title="' + esc(f.name) + '">' + App.firmLogo(f.id, "sm") + "</a>";
    }).join("") + '<a class="more" href="#firms">+' + (App.firms.length - top.length) + " more</a>";
  }
})();
