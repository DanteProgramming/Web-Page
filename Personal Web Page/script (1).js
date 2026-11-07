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

  /* =================== FLARE =================== */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 4. Cursor glow ---------- */
  if (!reduce) {
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      root.style.setProperty("--mx", e.clientX + "px");
      root.style.setProperty("--my", e.clientY + "px");
    });
  }

  /* ---------- 5. Ruffle headline: letters scatter away from the cursor ---------- */
  var hero = document.querySelector(".hero");
  var h1 = document.querySelector(".hero h1");
  if (h1 && !reduce) {
    var text = h1.textContent.trim();
    var chars = [];
    h1.setAttribute("aria-label", text);
    h1.textContent = "";
    text.split(" ").forEach(function (word, i, all) {
      var w = document.createElement("span");
      w.className = "w";
      w.setAttribute("aria-hidden", "true");
      word.split("").forEach(function (c) {
        var s = document.createElement("span");
        s.className = "ch";
        s.textContent = c;
        s._r = Math.random() * 2 - 1;   /* each letter spins its own way */
        s._dx = 0; s._dy = 0;
        w.appendChild(s);
        chars.push(s);
      });
      h1.appendChild(w);
      if (i < all.length - 1) h1.appendChild(document.createTextNode(" "));
    });

    var RADIUS = 150;   /* how far the cursor's effect reaches, in pixels */

    function calm() {
      chars.forEach(function (ch) {
        ch.style.transform = "";
        ch.classList.remove("hot");
        ch._dx = 0; ch._dy = 0;
      });
    }

    hero.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      chars.forEach(function (ch) {
        var r = ch.getBoundingClientRect();
        var cx = r.left + r.width / 2 - ch._dx;
        var cy = r.top + r.height / 2 - ch._dy;
        var dx = cx - e.clientX, dy = cy - e.clientY;
        var d = Math.sqrt(dx * dx + dy * dy);
        var k = Math.max(0, 1 - d / RADIUS);
        var push = (k * 22) / (d || 1);
        ch._dx = dx * push; ch._dy = dy * push;
        ch.style.transform = k
          ? "translate(" + ch._dx + "px," + ch._dy + "px) rotate(" + (ch._r * 40 * k) + "deg) scale(" + (1 + k * 0.2) + ")"
          : "";
        ch.classList.toggle("hot", k > 0.45);
      });
    });
    hero.addEventListener("pointerleave", calm);

    /* click the headline: letters explode, then settle back */
    h1.addEventListener("click", function () {
      chars.forEach(function (ch) {
        ch._dx = 0; ch._dy = 0;
        ch.style.transform = "translate(" + (Math.random() * 80 - 40) + "px," + (Math.random() * -70) +
          "px) rotate(" + (Math.random() * 140 - 70) + "deg)";
        ch.classList.add("hot");
      });
      setTimeout(calm, 450);
    });
  }

  /* ---------- 6. Doors: scramble title, 3D tilt, spotlight, staggered entrance ---------- */
  var GLYPHS = "!<>-_/[]{}=+*^?#";

  function scramble(el) {
    var final = el.getAttribute("data-text") || el.textContent;
    var frame = 0, total = 14;
    el.setAttribute("data-text", final);
    clearInterval(el._t);
    el._t = setInterval(function () {
      var out = "";
      for (var i = 0; i < final.length; i++) {
        var c = final.charAt(i);
        out += (c === " " || i < (frame / total) * final.length)
          ? c : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
      }
      el.textContent = out;
      if (++frame > total) { clearInterval(el._t); el.textContent = final; }
    }, 35);
  }

  if (!reduce) {
    doors.forEach(function (door) {
      var title = door.querySelector(".door-title");

      door.addEventListener("pointerenter", function (e) {
        if (e.pointerType === "mouse" && title) scramble(title);
      });
      door.addEventListener("focus", function () { if (title) scramble(title); });

      door.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var r = door.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        door.style.setProperty("--px", (px * 100) + "%");
        door.style.setProperty("--py", (py * 100) + "%");
        door.style.transform = "perspective(900px) rotateX(" + ((0.5 - py) * 8) + "deg) rotateY(" +
          ((px - 0.5) * 10) + "deg) translateY(-3px)";
      });
      door.addEventListener("pointerleave", function () { door.style.transform = ""; });
    });

    if ("IntersectionObserver" in window) {
      root.classList.add("js-reveal");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.15 });
      doors.forEach(function (d, i) {
        d.style.setProperty("--d", (i * 120) + "ms");
        io.observe(d);
      });
    }
  }
})();
