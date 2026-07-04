// セクションのスクロール表示アニメーション
(function () {
  if (!('IntersectionObserver' in window)) return;
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll('section').forEach(function (s) {
    obs.observe(s);
  });
})();
