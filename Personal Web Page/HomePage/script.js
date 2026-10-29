/* script.js: homepage behavior
   Paths for your three links are set in index.html (look for the TODO
   comments on each <a class="door"> tag). Nothing needs editing here. */

(function () {
  "use strict";

  /* ---------- 1. Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 2. Dark / light theme (remembers the visitor's choice) ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");

  function savedTheme() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) toggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  }

  var startTheme = savedTheme() ||
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(startTheme);

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked: ignore */ }
    });
  }

  /* ---------- 3. Catch links that still have no path ---------- */
  var doors = document.querySelectorAll(".door");
  var missing = [];

  doors.forEach(function (door) {
    var href = door.getAttribute("href");
    if (!href || !href.trim()) {
      door.classList.add("unset");
      door.setAttribute("aria-disabled", "true");
      door.addEventListener("click", function (e) { e.preventDefault(); });
      missing.push(door.getAttribute("data-label") || "A link");
    }
  });

  /* This notice only shows while a path is empty. Once you fill in
     all three hrefs in index.html, it disappears on its own. */
  var notice = document.getElementById("path-notice");
  if (notice && missing.length) {
    notice.textContent = "Path not set yet for: " + missing.join(", ") +
      ". Add the folder path to the href in index.html.";
    notice.hidden = false;
  }
})();
