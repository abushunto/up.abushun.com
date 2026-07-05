// スクロールで要素をふわっと表示
(function () {
  var els = document.querySelectorAll('.reveal');
  if (els.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (el) { obs.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }
})();

// ナビのスクロールスパイ（表示中のセクションを強調）
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.navlinks a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  var map = {};
  var sections = [];
  links.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var sec = document.getElementById(id);
    if (sec) { map[id] = a; sections.push(sec); }
  });
  var current = null;
  function setActive(id) {
    if (current === id) return;
    current = id;
    links.forEach(function (a) { a.removeAttribute('aria-current'); });
    if (map[id]) map[id].setAttribute('aria-current', 'page');
  }
  var spy = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(e.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach(function (s) { spy.observe(s); });
})();
