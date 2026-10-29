/* ============================================================
   DANTE LUGLIO PORTFOLIO - SCRIPT
   You do not need to edit this file to add pictures.
   Pictures are added in index.html (look for "PICTURE LINK GOES HERE").
   ============================================================ */

/* 1. Picture slots
   If an <img> has an empty src (or the file fails to load), the slot shows
   its label (from data-label) instead of a broken-image icon. */
document.querySelectorAll('.photo').forEach(function (slot) {
  var img = slot.querySelector('img');
  var label = document.createElement('span');
  label.className = 'slot-label';
  label.textContent = slot.dataset.label || 'Add a photo';
  slot.appendChild(label);

  function check() {
    var src = (img.getAttribute('src') || '').trim();
    slot.classList.toggle('is-empty', src === '');
  }
  check();
  img.addEventListener('error', function () { slot.classList.add('is-empty'); });
  img.addEventListener('load', function () { slot.classList.remove('is-empty'); });
});

/* Hide the label once a real image is showing */
var style = document.createElement('style');
style.textContent = '.photo:not(.is-empty) > .slot-label { display: none; }';
document.head.appendChild(style);

/* 2. Mobile menu */
var toggle = document.querySelector('.nav-toggle');
var nav = document.getElementById('nav');
toggle.addEventListener('click', function () {
  var open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close' : 'Menu';
});
nav.querySelectorAll('a').forEach(function (a) {
  a.addEventListener('click', function () {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu';
  });
});

/* 3. Highlight the current section in the nav while scrolling */
var links = Array.from(nav.querySelectorAll('a'));
var sections = links
  .map(function (a) { return document.querySelector(a.getAttribute('href')); })
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(function (s) { observer.observe(s); });
}

/* 4. Footer year */
document.getElementById('year').textContent = new Date().getFullYear();
