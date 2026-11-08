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

  /* Motion switch: lets visitors stop all movement (needed for ongoing animation).
     Every effect below checks motionOK() each time it runs. */
  var mBtn = document.getElementById("motion-toggle");
  function motionOK() { return !reduce && root.getAttribute("data-motion") !== "off"; }
  function setMotion(on) {
    root.setAttribute("data-motion", on ? "on" : "off");
    if (mBtn) mBtn.textContent = "Motion: " + (on ? "on" : "off");
  }
  var savedMotion = null;
  try { savedMotion = localStorage.getItem("motion"); } catch (e) {}
  setMotion(!reduce && savedMotion !== "off");
  if (mBtn) {
    if (reduce) mBtn.disabled = true;
    mBtn.addEventListener("click", function () {
      var on = root.getAttribute("data-motion") === "off";
      setMotion(on);
      try { localStorage.setItem("motion", on ? "on" : "off"); } catch (e) {}
    });
  }

  /* ---------- 4. Mouse trail: sparkles that follow the cursor and fade ---------- */
  if (!reduce) {
    var canvas = document.createElement("canvas");
    canvas.className = "trail";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [], running = false, last = null, spawned = 0;
    var MAX_PARTICLES = 160;   /* raise for a denser trail */
    var FADE = 0.022;          /* lower = the trail lingers longer */

    function sizeCanvas() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    function trailColors() {
      var cs = getComputedStyle(root);
      return ["--pro", "--class", "--game"].map(function (v) { return cs.getPropertyValue(v).trim(); });
    }

    function tick() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.life -= FADE;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.rot += p.vr;
        var s = p.s * p.life;
        ctx.globalAlpha = Math.min(1, p.life * 1.4);
        ctx.fillStyle = p.c;
        if (p.diamond) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillRect(-s, -s, s * 2, s * 2);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (particles.length) requestAnimationFrame(tick);
      else { running = false; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
    }

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse" || !motionOK()) return;
      root.style.setProperty("--bx", (e.clientX / window.innerWidth - 0.5).toFixed(3));
      root.style.setProperty("--by", (e.clientY / window.innerHeight - 0.5).toFixed(3));
      var colors = trailColors();
      var x = e.clientX, y = e.clientY;
      if (last) {
        var dx = x - last.x, dy = y - last.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var n = Math.min(6, Math.floor(dist / 9));
        for (var i = 1; i <= n; i++) {
          if (particles.length >= MAX_PARTICLES) break;
          spawned++;
          particles.push({
            x: last.x + (dx * i) / n + (Math.random() - 0.5) * 6,
            y: last.y + (dy * i) / n + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2 - 0.3,
            s: 3 + Math.random() * 5,
            life: 1,
            rot: Math.random() * 3,
            vr: (Math.random() - 0.5) * 0.2,
            diamond: Math.random() < 0.5,
            c: colors[spawned % 3]      /* cycles blue, green, red */
          });
        }
        if (n > 0 && !running) { running = true; requestAnimationFrame(tick); }
      }
      last = { x: x, y: y };
    });
    document.documentElement.addEventListener("pointerleave", function () { last = null; });
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
      if (e.pointerType !== "mouse" || !motionOK()) return;
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
      if (!motionOK()) return;
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
        if (e.pointerType === "mouse" && title && motionOK()) scramble(title);
      });
      door.addEventListener("focus", function () { if (title && motionOK()) scramble(title); });

      door.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse" || !motionOK()) return;
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

  /* ---------- 7. Typewriter: "Dante builds ..." (edit the words here) ---------- */
  var rot = document.getElementById("rotator");
  if (rot) {
    var words = ["websites.", "games.", "AI tools.", "game engine mods."];
    var wi = 0, ci = words[0].length, erasing = true;
    var step = function () {
      if (!motionOK()) { rot.textContent = words[0]; wi = 0; ci = words[0].length; erasing = true; setTimeout(step, 800); return; }
      var w = words[wi], delay = erasing ? 40 : 85;
      ci += erasing ? -1 : 1;
      rot.textContent = w.slice(0, ci);
      if (!erasing && ci === w.length) { erasing = true; delay = 1500; }
      else if (erasing && ci === 0) { erasing = false; wi = (wi + 1) % words.length; delay = 250; }
      setTimeout(step, delay);
    };
    setTimeout(step, 1800);
  }

  /* ---------- 8. Door-opening wipe: a colored circle grows from the click, then the page loads ---------- */
  doors.forEach(function (door) {
    door.addEventListener("click", function (e) {
      var href = door.getAttribute("href");
      if (e.defaultPrevented || !href || !motionOK() || e.button !== 0 ||
          e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      var r = door.getBoundingClientRect();
      var wipe = document.createElement("div");
      wipe.className = "wipe";
      wipe.style.setProperty("--wx", (e.detail ? e.clientX : r.left + r.width / 2) + "px");
      wipe.style.setProperty("--wy", (e.detail ? e.clientY : r.top + r.height / 2) + "px");
      wipe.style.background = getComputedStyle(door).getPropertyValue("--accent");
      document.body.appendChild(wipe);
      requestAnimationFrame(function () { wipe.classList.add("go"); });
      setTimeout(function () { window.location.href = href; }, 480);
    });
  });
  /* if the visitor comes back with the Back button, clear the wipe */
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) document.querySelectorAll(".wipe").forEach(function (w) { w.remove(); });
  });
})();
