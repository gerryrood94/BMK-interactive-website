/* Главная: плитки-превью, скраббер хроники, фильтр ролей, выбор адресата. Без JS всё это — обычные якоря и полные списки. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function firstSentence(t) { var m = t.replace(/\s+/g, ' ').trim().match(/^.*?[.!?](?=\s|$)/); return m ? m[0] : t; }

  /* 1. Плитки карты: по наведению и фокусу — первая строка раздела, по клику — переход к разделу (плавная прокрутка — CSS). */
  $$('.tile[href^="#"]').forEach(function (a) {
    var sel = a.getAttribute('data-src') || (a.getAttribute('href') + ' .lead');
    var src = $(sel);
    if (!src) return;
    var li = a.parentNode, x = doc.createElement('p');
    x.className = 'tile__x';
    x.textContent = firstSentence(src.textContent);
    li.appendChild(x);
    function open() { li.classList.add('is-open'); }
    function close() { li.classList.remove('is-open'); }
    a.addEventListener('mouseenter', open);
    a.addEventListener('mouseleave', close);
    a.addEventListener('focus', open);
    a.addEventListener('blur', close);
    a.addEventListener('click', close);
  });

  /* 2. Хроника: скраббер по шкале 24.08.2026 → 02.11.2026 (день d → x = 24 + 552·d/70). Ближайшее событие подсвечивается в SVG и в списке. */
  var ctl = $('#tlx-ctl'), range = $('#tlx-range'), out = $('#tlx-out'), cur = $('.tlx__cur');
  var marks = $$('.tlx__m'), items = $$('#tl > li');
  if (ctl && range && marks.length === items.length) {
    ctl.hidden = false;
    var days = marks.map(function (m) { return +m.getAttribute('data-d'); });
    var last = -1;
    function show(i) {
      if (i === last) return; last = i;
      marks.forEach(function (m, j) { m.classList.toggle('is-on', j === i); });
      items.forEach(function (li, j) { if (j === i) li.setAttribute('aria-current', 'true'); else li.removeAttribute('aria-current'); });
      var d = $('.tl__d', items[i]), b = $('.tl__t b', items[i]);
      out.innerHTML = '';
      var bd = doc.createElement('b'); bd.textContent = d ? d.textContent : '';
      out.appendChild(bd);
      out.appendChild(doc.createTextNode(b ? b.textContent.replace(/[.:]\s*$/, '') : ''));
    }
    function update() {
      var d = +range.value, best = 0, bd = 1e9;
      days.forEach(function (x, j) { var dd = Math.abs(x - d); if (dd < bd) { bd = dd; best = j; } });
      if (cur) { var x = 24 + 552 * d / 70; cur.setAttribute('x1', x); cur.setAttribute('x2', x); }
      show(best);
    }
    range.addEventListener('input', update);
    marks.forEach(function (m, j) {
      m.addEventListener('click', function () { range.value = days[j]; update(); });
      m.addEventListener('mouseenter', function () { show(j); });
    });
    items.forEach(function (li, j) { li.addEventListener('mouseenter', function () { range.value = days[j]; update(); }); });
    update();
  }

  /* 3. Команда: фильтр по программе. Кнопки появляются только с JS; без них список полный. */
  var filt = $('#filt');
  if (filt) {
    filt.hidden = false;
    var roles = $$('#ppl > li');
    $$('.filt__b', filt).forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-f');
        $$('.filt__b', filt).forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        roles.forEach(function (li) { li.hidden = f !== 'all' && (' ' + li.getAttribute('data-p') + ' ').indexOf(' ' + f + ' ') < 0; });
      });
    });
  }

  /* 4. Партнёрам: выбранный адресат встаёт первым во всю ширину, остальные ужимаются до заголовка. Повторное нажатие возвращает четыре карточки. */
  var who = $('#who'), pc = $('#pcards');
  if (who && pc) {
    who.hidden = false;
    var bs = $$('.who__b', who);
    bs.forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-who'), on = b.getAttribute('aria-pressed') !== 'true';
        bs.forEach(function (o) { o.setAttribute('aria-pressed', on && o === b ? 'true' : 'false'); });
        $$('.card', pc).forEach(function (c) { c.classList.toggle('is-sel', on && c.id === id); });
        pc.classList.toggle('has-sel', on);
        if (on && !reduce) { var c = doc.getElementById(id); if (c && c.scrollIntoView) c.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      });
    });
  }
})();
