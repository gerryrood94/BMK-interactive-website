/* /rd: планшет, перспектива которого следует за прокруткой; пошаговый проход цикла ИФА; связь лунок ближнего ряда с таблицей КП. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }

  /* 1. Планшет 8 × 12: та же формула, что и в статической разметке; k меняется с положением планшета в окне.
        p = clip((vh − top) / (vh + h), 0, 1); k = 1.1 + 1.6·p; q = 1/(1 + k·r/7); q7 = 1/(1 + k)
        x = 280 + (c − 5.5)·42·q; y = 310 − 250·(1 − q)/(1 − q7); rx = 11q; ry = 7q. При p = 0.4375 k = 1.8 — принятая геометрия. */
  var plate = $('[data-scroll-plate]');
  if (plate && !reduce) {
    var wells = $$('ellipse', plate), kNow = 1.8, ticking = false;
    function draw(k) {
      if (Math.abs(k - kNow) < 0.004) return; kNow = k;
      var q7 = 1 / (1 + k);
      for (var i = 0; i < wells.length; i++) {
        var r = (i / 12) | 0, c = i % 12, q = 1 / (1 + k * r / 7);
        var e = wells[i];
        e.setAttribute('cx', (280 + (c - 5.5) * 42 * q).toFixed(2));
        e.setAttribute('cy', (310 - 250 * (1 - q) / (1 - q7)).toFixed(2));
        var neg = r === 0 && c === 0 ? 0.75 : 0;
        e.setAttribute('rx', (11 * q - neg).toFixed(2));
        e.setAttribute('ry', (7 * q - neg).toFixed(2));
      }
    }
    function frame() {
      ticking = false;
      var b = plate.getBoundingClientRect(), vh = window.innerHeight || root.clientHeight;
      var p = (vh - b.top) / (vh + b.height); p = p < 0 ? 0 : p > 1 ? 1 : p;
      draw(1.1 + 1.6 * p);
    }
    function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(frame); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    frame();
  }

  /* 2. Схема цикла ИФА: шаг за шагом. Без JS все шесть шагов видны; кнопок нет. */
  var stp = $('#stp'), steps = $$('.scheme__svg .st');
  if (stp && steps.length) {
    stp.hidden = false;
    var prev = $('#stp-prev'), next = $('#stp-next'), out = $('#stp-out'), i = 0;
    function go(n) {
      i = Math.max(0, Math.min(steps.length - 1, n));
      steps.forEach(function (g, j) { g.classList.toggle('is-cur', j === i); });
      var t = $('text', steps[i]);
      out.textContent = (t ? t.textContent : '') + ' · ' + (i + 1) + ' из ' + steps.length;
      prev.disabled = i === 0; next.disabled = i === steps.length - 1;
    }
    prev.addEventListener('click', function () { go(i - 1); });
    next.addEventListener('click', function () { go(i + 1); });
    steps.forEach(function (g, j) { g.addEventListener('click', function () { go(j); }); });
    go(0);
  }

  /* 3. Лунки ближнего ряда ↔ строки таблицы КП: наведение или фокус на одном подсвечивает другое. Сами лунки — ссылки на строки. */
  var links = $$('.kprow__a'), rows = $$('#kptbl .tbl__r');
  if (links.length && rows.length) {
    function hi(id, on) {
      links.forEach(function (a) { a.classList.toggle('is-hi', on && a.getAttribute('data-kp') === id); });
      rows.forEach(function (r) { r.classList.toggle('is-hi', on && r.id === id); });
    }
    links.forEach(function (a) {
      var id = a.getAttribute('data-kp');
      a.addEventListener('mouseenter', function () { hi(id, true); });
      a.addEventListener('mouseleave', function () { hi(id, false); });
      a.addEventListener('focus', function () { hi(id, true); });
      a.addEventListener('blur', function () { hi(id, false); });
    });
    rows.forEach(function (r) {
      r.addEventListener('mouseenter', function () { hi(r.id, true); });
      r.addEventListener('mouseleave', function () { hi(r.id, false); });
    });
  }
})();
