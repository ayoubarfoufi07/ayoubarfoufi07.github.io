// ============================================================
// LE BALCON D'ORELLE — main.js
// Menu mobile, accordéon FAQ, filtre + lightbox galerie, WhatsApp
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      var expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* ---------- Accordéon FAQ ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (el) {
        if (el !== item) el.classList.remove('open');
      });
      item.classList.toggle('open', !wasOpen);
    });
  });

  /* ---------- Filtre galerie ---------- */
  var tabs = document.querySelectorAll('.gallery-tab');
  var items = document.querySelectorAll('.gallery-grid .gallery-item');
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var cat = tab.getAttribute('data-cat');
        items.forEach(function (item) {
          var figure = item.closest('figure');
          var show = cat === 'tout' || item.getAttribute('data-cat') === cat;
          figure.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    var lbCap = lightbox.querySelector('.lightbox-cap');
    var visibleItems = [];
    var currentIndex = 0;

    function getVisible() {
      return Array.prototype.filter.call(
        document.querySelectorAll('.gallery-item'),
        function (el) { return el.closest('figure').style.display !== 'none'; }
      );
    }

    function openLightbox(index) {
      visibleItems = getVisible();
      currentIndex = index;
      show();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function show() {
      var el = visibleItems[currentIndex];
      if (!el) return;
      var img = el.querySelector('img');
      lbImg.src = img.getAttribute('src');
      lbImg.alt = img.getAttribute('alt') || '';
      lbCap.textContent = img.getAttribute('alt') || '';
    }

    document.querySelectorAll('.gallery-item').forEach(function (el, i) {
      el.addEventListener('click', function () {
        var all = getVisible();
        var idx = all.indexOf(el);
        openLightbox(idx < 0 ? 0 : idx);
      });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function () {
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      show();
    });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function () {
      currentIndex = (currentIndex + 1) % visibleItems.length;
      show();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
      if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
    });
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /* ---------- Formulaire de contact -> pré-remplit WhatsApp ---------- */
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#c-name').value.trim();
      var arrival = form.querySelector('#c-arrival').value;
      var departure = form.querySelector('#c-departure').value;
      var guests = form.querySelector('#c-guests').value;
      var message = form.querySelector('#c-message').value.trim();

      var text = 'Bonjour, je m\'appelle ' + (name || '—') +
        '. Je souhaiterais connaître les disponibilités de l\'appartement à Orelle' +
        (arrival ? ' du ' + arrival : '') +
        (departure ? ' au ' + departure : '') +
        (guests ? ' pour ' + guests + ' personne(s)' : '') + '.' +
        (message ? ' ' + message : '');

      var waNumber = document.body.getAttribute('data-wa-number') || '33600000000';
      var url = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank');
    });
  }

  /* ---------- Cookie / RGPD notice ---------- */
  var consent = document.querySelector('.cookie-banner');
  if (consent) {
    var KEY = 'lbo_cookie_consent';
    if (localStorage.getItem(KEY)) {
      consent.remove();
    } else {
      consent.style.display = 'flex';
      consent.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          localStorage.setItem(KEY, btn.getAttribute('data-choice'));
          consent.remove();
        });
      });
    }
  }
});
