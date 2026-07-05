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

// ナビのスクロールスパイ（スクロール位置ベース）
// ・読み込み時（ヒーロー表示中）はどこも強調しない
// ・実際にそのセクションへ差し掛かって初めて強調する
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.navlinks a[href^="#"]'));
  if (!links.length) return;
  var map = {}, sections = [];
  links.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var sec = document.getElementById(id);
    if (sec) { map[id] = a; sections.push(sec); }
  });
  if (!sections.length) return;

  var current;
  function setActive(id) {
    if (current === id) return;
    current = id;
    links.forEach(function (a) { a.removeAttribute('aria-current'); });
    if (id && map[id]) map[id].setAttribute('aria-current', 'page');
  }
  function topOf(el) { return el.getBoundingClientRect().top + window.scrollY; }

  var ticking = false;
  function update() {
    ticking = false;
    // 画面の35%ラインを判定基準にする
    var line = window.scrollY + window.innerHeight * 0.35;
    var active = null;
    for (var i = 0; i < sections.length; i++) {
      if (topOf(sections[i]) <= line) active = sections[i].id;
    }
    // 最初のセクションより手前（＝ヒーロー表示中）は active=null のまま
    setActive(active);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update(); // 初期評価：トップならどこも強調されない
})();

// メンバー一覧のアコーディオン（もっと見る／閉じる）
(function () {
  var btn = document.getElementById('memberToggle');
  var wrap = document.getElementById('membersExtra');
  if (!btn || !wrap) return;
  btn.addEventListener('click', function () {
    var open = wrap.classList.toggle('show');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? '閉じる ↑' : 'もっと見る ↓';
  });
})();
