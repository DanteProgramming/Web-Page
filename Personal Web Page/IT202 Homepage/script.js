/* script.js: IT 202 homepage behavior
   Paths are set in index.html (look for the TODO comments above each link).
   Nothing needs editing here. */

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

  applyTheme(savedTheme() ||
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked: ignore */ }
    });
  }

  /* ---------- 3. Catch links that still have no path ---------- */
  var missing = [];
  document.querySelectorAll(".link").forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || !href.trim()) {
      link.classList.add("unset");
      link.setAttribute("aria-disabled", "true");
      link.addEventListener("click", function (e) { e.preventDefault(); });
      missing.push(link.getAttribute("data-label") || "A link");
    }
  });

  /* Shows only while paths are empty; disappears once every href is filled in. */
  var notice = document.getElementById("path-notice");
  if (notice && missing.length) {
    notice.textContent = "Path not set yet for " + missing.length + " link" +
      (missing.length === 1 ? "" : "s") + ": " + missing.join(", ") +
      ". Add each folder path to its href in index.html.";
    notice.hidden = false;
  }
})();
