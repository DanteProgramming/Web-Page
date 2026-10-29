/* script.js: games page
   ================================================================
   ADDING A NEW GAME: copy one { ... }, block in the GAMES list
   below, paste it at the TOP of the list (newest first), and fill in:

     title:  name shown on the card
     year:   year you made it (optional)
     tag:    short label like "Unity", "Quake", "JavaScript" (optional)
     text:   one or two sentences about the game
     url:    link to play it. A full https:// link opens in a new tab.
             A folder on your own site works too, e.g. "my-game/"
     image:  path to a screenshot, e.g. "images/my-game.png" (optional;
             leave "" and the card shows the first letter of the title)
     playable: set to false for games that cannot run in a browser.
             The card is shown without a link. (optional, default true)

   Save the file. That is all. Do not edit index.html.
   ================================================================ */

var GAMES = [
  /* ---- Example of something that can't be played online (delete the
          comment marks around it to use it) ----
  {
    title: "My Quake Map",
    year: "2025",
    tag: "Quake",
    text: "A custom Quake level. It needs the Quake engine, so it can't run in a browser.",
    url: "",
    image: "",
    playable: false
  },
  */

  {
    title: "RAB Expansion 5",
    year: "",
    tag: "Unity",
    text: "My first ever game, built in Unity.",
    url: "https://play.unity.com/en/games/ea7eb452-038c-42e7-b180-357cf4d5e557/rab-expansion-5",
    image: "",
    playable: true
  }
];

/* ================= Nothing below needs editing ================= */

(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme (remembers the visitor's choice) ---------- */
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
      try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- Build the game cards ---------- */
  var list = document.getElementById("games");
  if (!list) return;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  GAMES.forEach(function (game) {
    var playable = game.playable !== false && !!game.url;
    var item = document.createElement("li");
    var card = document.createElement(playable ? "a" : "div");
    card.className = "card" + (playable ? "" : " static");

    if (playable) {
      card.href = game.url;
      if (/^https?:\/\//i.test(game.url)) {
        card.target = "_blank";
        card.rel = "noopener noreferrer";
      }
    }

    var thumb = el("div", "thumb");
    if (game.image) {
      var img = document.createElement("img");
      img.src = game.image;
      img.alt = "";
      img.loading = "lazy";
      thumb.appendChild(img);
    } else {
      thumb.textContent = (game.title || "?").charAt(0).toUpperCase();
      thumb.setAttribute("aria-hidden", "true");
    }
    card.appendChild(thumb);

    var body = el("div", "card-body");
    var meta = [game.tag, game.year].filter(Boolean).join(" / ");
    if (meta) body.appendChild(el("span", "card-meta", meta));
    body.appendChild(el("h2", "card-title", game.title));
    if (game.text) body.appendChild(el("p", "card-text", game.text));
    body.appendChild(el("span", "card-go",
      playable ? (/^https?:\/\//i.test(game.url) ? "Play (opens in new tab)" : "Play now") : "Not playable online"));
    card.appendChild(body);

    item.appendChild(card);
    list.appendChild(item);
  });
})();
