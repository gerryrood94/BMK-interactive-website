// Сборка final/ из базы concepts/C5 (= panel/draft_2): каждая замена обязана совпасть ровно один раз.
// node apply.js  — читает concepts/C5/{index,rd}.html, пишет final/{index,rd}.html
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = '/home/user/BMK-interactive-website';
const BASE = path.join(ROOT, 'concepts/C5');
const OUT = path.join(ROOT, 'final');

function rep(h, from, to, label) {
  const n = h.split(from).length - 1;
  if (n !== 1) throw new Error(`[${label || from.slice(0, 60)}] expected 1 match, got ${n}`);
  return h.replace(from, () => to);
}
function repAll(h, re, to, label, min = 1) {
  const n = (h.match(re) || []).length;
  if (n < min) throw new Error(`[${label}] expected ≥${min} matches, got ${n}`);
  return h.replace(re, typeof to === 'function' ? to : () => to);
}

// ------------------------------------------------------------------ CSS (общий блок обеих страниц)
function css(h) {
  h = rep(h, `/* ---------- заглушка кадра ---------- */`, `/* ---------- поле кадра ---------- */`, 'ph comment');
  // Кегль: всё, что читается как предложение, — не ниже 15 px (§3 п. 21)
  h = rep(h, `.brand__s{display:block;font-family:var(--mono);font-size:var(--t-meta);line-height:20px;`, `.brand__s{display:block;font-family:var(--mono);font-size:var(--t-note);line-height:20px;`, 'brand__s');
  h = rep(h, `.eyebrow{font-family:var(--mono);font-size:var(--t-meta);line-height:20px;`, `.eyebrow{font-family:var(--mono);font-size:var(--t-note);line-height:24px;`, 'eyebrow');
  h = rep(h, `.motif__cap{font-family:var(--mono);font-size:var(--t-meta);line-height:20px;`, `.motif__cap{font-family:var(--mono);font-size:var(--t-note);line-height:24px;`, 'motif__cap');
  h = rep(h, `.ph__n{font-family:var(--mono);font-size:var(--t-meta);line-height:20px;`, `.ph__n{font-family:var(--mono);font-size:var(--t-note);line-height:24px;`, 'ph__n');
  h = rep(h, `.tbl__c3 .mono{font-family:var(--mono);font-size:var(--t-meta);letter-spacing:.02em}`, `.tbl__c3 .mono{font-family:var(--mono);font-size:var(--t-note);letter-spacing:.02em}`, 'tbl__c3');
  h = rep(h, `.card__k{font-family:var(--mono);font-size:var(--t-meta);line-height:20px;`, `.card__k{font-family:var(--mono);font-size:var(--t-note);line-height:24px;`, 'card__k');
  h = rep(h, `.ppl__n span{display:block;font-family:var(--mono);font-size:var(--t-meta);line-height:20px;`, `.ppl__n span{display:block;font-family:var(--mono);font-size:var(--t-note);line-height:24px;`, 'ppl__n span');
  h = rep(h, `.filt__b,.who__b{\n  font-family:var(--mono);font-size:var(--t-meta);line-height:20px;`, `.filt__b,.who__b{\n  font-family:var(--mono);font-size:var(--t-note);line-height:24px;`, 'filt__b');
  h = rep(h, `.ftr__btm{margin-top:var(--s5);padding-top:var(--s5);border-top:var(--hair) solid var(--panel-3);font-family:var(--mono);font-size:var(--t-meta);line-height:20px;`, `.ftr__btm{margin-top:var(--s5);padding-top:var(--s5);border-top:var(--hair) solid var(--panel-3);font-family:var(--mono);font-size:var(--t-note);line-height:24px;`, 'ftr__btm');
  h = rep(h, `.ftr h4{font-family:var(--mono);`, `.ftr h3{font-family:var(--mono);`, 'ftr h3');
  h = rep(h, `letter-spacing:-.025em;max-width:26ch;margin:0 0 var(--s5);`, `letter-spacing:-.025em;max-width:32ch;margin:0 0 var(--s4);`, 'h1 measure');
  h = rep(h, `@media (min-width:700px){.hero{padding:var(--s8) 0}}`, `@media (min-width:700px){.hero{padding:var(--s6) 0 var(--s8)}}`, 'hero pad');
  h = rep(h, `.mapnav{margin-top:var(--s6)}`, `.mapnav{margin-top:var(--s5)}`, 'mapnav');
  h = rep(h, `.tile__k{margin-top:auto;padding-top:var(--s2);font-family:var(--mono);font-size:var(--t-meta);line-height:16px;`, `.tile__k{margin-top:auto;padding-top:var(--s2);font-family:var(--mono);font-size:var(--t-note);line-height:20px;`, 'tile__k');

  // Хроника: ползунок и курсор удалены (§3 п. 14)
  h = rep(h, `.tlx__cur{display:none}\n.js .tlx__cur{display:block}\n`, ``, 'tlx__cur css');
  h = rep(h, `.tlx__ctl{display:grid;grid-template-columns:auto minmax(0,1fr);gap:var(--s2) var(--s4);align-items:center;margin-top:var(--s3);padding-top:var(--s3);border-top:var(--hair) solid var(--rule)}
.tlx__k{font-family:var(--mono);font-size:var(--t-label);line-height:16px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:var(--ink-3)}
.tlx__ctl input[type=range]{width:100%;margin:0;accent-color:var(--ink);cursor:pointer}
.tlx__out{grid-column:1/-1;font-size:var(--t-note);line-height:24px;color:var(--ink);min-height:24px}
.tlx__out b{font-family:var(--mono);font-weight:600;margin-right:var(--s2)}
`, ``, 'tlx__ctl css');
  h = rep(h, `.tlx{background:var(--plate);border:var(--hair) solid var(--rule-2);border-top:var(--edge) solid var(--ink);border-radius:var(--radius);padding:var(--s4) var(--s4) var(--s3)}`,
    `.tlx{background:var(--plate);border:var(--hair) solid var(--rule-2);border-top:var(--edge) solid var(--ink);border-radius:var(--radius);padding:var(--s4) var(--s4) var(--s3)}\n@media (max-width:900px){.tlx__lab:nth-child(2){transform:none}}`, 'tlx labs');

  // Реестр оборудования: квадратики-счётчики удалены (§3 п. 16)
  h = rep(h, `.inv__l>li{margin:0;padding:var(--s2) 0;display:grid;grid-template-columns:minmax(0,1fr);gap:var(--s1) var(--s4);align-items:center;font-size:var(--t-note);line-height:24px;border-top:var(--hair) solid var(--rule)}
.inv__m{display:block;height:10px;width:auto;max-width:100%;justify-self:start}
@media (min-width:460px){.inv__l>li{grid-template-columns:minmax(0,1fr) auto}.inv__m{justify-self:end}}`,
    `.inv__l>li{margin:0;padding:var(--s2) 0;font-size:var(--t-note);line-height:24px;border-top:var(--hair) solid var(--rule)}`, 'inv__m css');

  // Схема цикла ИФА: кнопки «Назад / Далее» удалены (§3 п. 15) — стили пошагового прохода вычищены
  h = rep(h, `.st rect{transition:stroke-width .15s}
.st.is-cur>rect:first-child{stroke:var(--navy);stroke-width:2.5}
.st.is-cur .st__e{fill-opacity:1}
.stp{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:var(--s3);align-items:center;margin-top:var(--s3)}
.stp[hidden]{display:none}
.stp__b{font-family:var(--mono);font-size:var(--t-meta);line-height:20px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ink);background:var(--plate);border:var(--hair) solid var(--ink);border-radius:var(--radius);padding:var(--s2) var(--s3);cursor:pointer}
.stp__b:hover{background:var(--ink);color:var(--paper)}
.stp__b:disabled{color:var(--ink-3);border-color:var(--rule-2);cursor:default;background:var(--plate)}
.stp__o{font-family:var(--mono);font-size:var(--t-note);line-height:24px;color:var(--ink);text-align:center;font-variant-numeric:tabular-nums slashed-zero}
`, `.scheme{margin:0 var(--s5) var(--s5)}
.cycle{display:grid;grid-template-columns:minmax(0,1fr);gap:var(--s3);margin:var(--s4) 0 0;padding:0;list-style:none}
@media (min-width:360px){.cycle{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:860px){.cycle{grid-template-columns:repeat(3,minmax(0,1fr))}}
.cycle>li{margin:0;min-width:0;padding:var(--s3) var(--s3) var(--s4);background:var(--plate);border:var(--hair) solid var(--rule-2);border-top:var(--edge) solid var(--rule-2);border-radius:var(--radius);display:flex;flex-direction:column;gap:var(--s2)}
.cycle>li.cycle--kks{border-top-color:var(--navy);background:var(--band)}
.cycle__n{font-family:var(--mono);font-size:var(--t-meta);line-height:16px;font-weight:600;letter-spacing:.06em;color:#FFFFFF;background:var(--navy);padding:var(--s1) var(--s2);border-radius:var(--radius);align-self:flex-start}
.cycle__t{font-family:var(--mono);font-size:var(--t-note);line-height:24px;font-weight:600;color:var(--ink);margin:0}
.cycle__s{font-size:var(--t-note);line-height:24px;color:var(--ink-2);margin:0}
`, 'stp css');
  h = rep(h, `.scheme{margin:0 var(--s5) var(--s5)}
.scheme__fig{max-width:420px}
.scheme__svg{width:100%;height:auto;display:block}
@media (min-width:860px){.scheme{display:grid;grid-template-columns:420px minmax(0,1fr);gap:var(--s6);align-items:center}}
`, ``, 'scheme css');

  // Покой
  h = rep(h, `@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{transition:none!important;animation:none!important}
}`, `@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{transition:none!important;animation:none!important}
  .js .kpbar__f{transform:none}
}`, 'rm css');

  // Печать (§3 п. 13): тёмные секции и подвал — чернила по белому; состояния интерактива не протекают
  h = rep(h, `@media print{
  .navm,.nav,.filt,.who,.stp,.tlx__ctl,.tile__x,.form{display:none!important}
  .sec,.hero{padding:var(--s5) 0;break-inside:auto}
  .card,.tile,.ph,.dgm{break-inside:avoid}
  a{border-bottom:0}
}`, `@media print{
  .navm,.nav,.pidx,.filt,.who,#mcount,.tile__x,.form,.hero__jump{display:none!important}
  body{background:#FFFFFF;color:var(--ink)}
  .sec--tint,.sec--deep,.ftr{background:#FFFFFF;color:var(--ink);border-bottom-color:var(--rule)}
  .sec--deep .sh{border-bottom-color:var(--ink);background-image:repeating-linear-gradient(to right,var(--rule-2) 0 1px,transparent 1px 8px)}
  .sec--deep .sh__n{background:var(--ink);color:#FFFFFF}
  .sec--deep .sh__t,.sec--deep .lead,.sec--deep .note,.sec--deep p,.sec--deep h3,.sec--deep a,.ftr,.ftr a,.ftr p,.ftr h3,.ftr li,.ftr__note,.ftr__btm{color:var(--ink)}
  .sec--deep .card{border-color:var(--rule-2)}
  .sec--deep .steps{border-top-color:var(--ink)}
  .sec--deep .step{border-color:var(--rule)}
  .sec--deep .step__n{background:var(--ink);color:#FFFFFF}
  .sec--deep .step__k{color:var(--ink-3)}
  .sec--deep .sub{border-bottom-color:var(--rule-2)}
  .sec--deep .sub__n{color:var(--ink);border-color:var(--ink)}
  .ftr__g,.ftr__btm{border-color:var(--rule)}
  .sec,.hero{padding:var(--s5) 0;break-inside:auto}
  .card,.tile,.ph,.dgm,.tbl__r,.tl>li,.ppl>li,.cycle>li{break-inside:avoid}
  a{border-bottom:0}
  .tbl__r[hidden],.ppl>li[hidden]{display:grid!important}
  #pcards.has-sel{grid-template-columns:repeat(2,minmax(0,1fr))}
  #pcards .card{grid-column:auto!important;order:0!important;border-top-color:var(--ink)}
  #pcards .card p{display:block!important}
  .tbl--kp .tbl__r.is-hi,.tbl--kp .tbl__r:hover,.tl>li[aria-current="true"]{background:none;border-left-color:transparent}
  .kprow__a.is-hi .kprow__w{stroke-width:1;stroke-opacity:.45}
  .kpbar__f{transform:none!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .tlx__lab:nth-child(2){transform:none}
  .ph--band{max-height:240px}
  .map>li.is-open .tile__x{display:none}
}`, 'print css');

  // Узкие экраны: на 320/390 дорожка хроники скрыта, остаётся список (§3 п. 14); схема без кнопок
  h = rep(h, `@media (max-width:699px){
  .tlx__lab:first-child{display:none}
  .stp{grid-template-columns:auto auto;justify-content:space-between}
  .stp__o{grid-column:1/-1;order:-1;text-align:left}
}
`, `@media (max-width:699px){
  .tlx{display:none}
}
@media (max-width:420px){
  .dgm__h{padding:var(--s4) var(--s3) 0}
  .scheme{margin:0}
  .cycle{margin:var(--s4) var(--s3) var(--s3)}
  .dgm__out{margin:0;border-left:0;border-top:var(--edge) solid var(--ink)}
}
`, 'narrow css');

  // Новые правила: липкое оглавление (B), шкала КП (A), строка контекста (D), выноски (E), плашка стадии (G), кадры-полосы (§3 п. 23), отступы кадров (§3 п. 22)
  h = rep(h, `\n</style>`, `
/* ---------- оглавление страницы: липкая строка разделов (≥ 1000 px) ---------- */
.pidx{display:none}
@media (min-width:1000px){
  [id]{scroll-margin-top:calc(40px + var(--s5))}
  .hero__jump{display:none}
  .pidx{display:block;position:sticky;top:0;z-index:5;background:var(--paper);border-bottom:var(--hair) solid var(--rule-2)}
  .pidx__in{position:relative;display:flex;align-items:center;min-height:40px}
  .pidx__l{list-style:none;margin:0;padding:0;display:flex;gap:0 var(--s4);flex-wrap:wrap}
  .pidx__l li{margin:0}
  .pidx__l a{display:inline-flex;align-items:center;gap:var(--s2);border:0;padding:var(--s2) 0;font-family:var(--mono);font-size:var(--t-meta);line-height:20px;color:var(--ink-3);white-space:nowrap}
  .pidx__l a:hover,.pidx__l a:focus-visible{color:var(--ink);border:0;padding-bottom:var(--s2)}
  .pidx__n{font-size:var(--t-label);line-height:16px;font-weight:600;letter-spacing:.06em;border:var(--hair) solid currentColor;padding:1px 5px;border-radius:var(--radius)}
  .pidx__l a[aria-current]{color:var(--ink);font-weight:600}
  .pidx__l a[aria-current] .pidx__n{background:var(--ink);color:var(--paper);border-color:var(--ink)}
  .pidx__l a.is-past .pidx__n{background:var(--rule-2);border-color:var(--rule-2);color:var(--ink)}
  .pidx__bar{position:absolute;left:var(--gut);right:var(--gut);bottom:-1px;height:var(--edge);background:var(--ink);transform-origin:left;transform:scaleX(var(--p,0))}
}
/* ---------- выноски-цифры на полях ---------- */
.lr{display:grid;grid-template-columns:minmax(0,1fr);gap:var(--s4) var(--s6);align-items:start}
@media (min-width:900px){.lr{grid-template-columns:minmax(0,1fr) 280px}}
.mn{margin:0;padding:var(--s3) 0 0;border-top:var(--edge) solid var(--ink);font-size:var(--t-note);line-height:24px;color:var(--ink-2);max-width:var(--measure)}
.mn b{display:block;font-family:var(--mono);font-size:23px;font-weight:500;line-height:28px;letter-spacing:-.02em;color:var(--ink);font-variant-numeric:tabular-nums slashed-zero;margin-bottom:var(--s2);overflow-wrap:anywhere}
#kks .mn{border-top-color:var(--navy)}
/* ---------- таблица КП: шкала против порога 3 ---------- */
.kpbar{position:relative;height:24px;min-width:0}
.kpbar::before{content:"";position:absolute;left:0;right:0;top:11px;height:2px;background:var(--rule-2)}
.kpbar::after{content:"";position:absolute;left:25%;top:0;width:2px;height:24px;margin-left:-1px;background:var(--ink)}
.kpbar__f{position:absolute;left:0;top:4px;height:16px;width:var(--w);background:var(--c);border:1px solid var(--navy);z-index:1}
.kpbar--off .kpbar__f{width:100%;border-right:0;background:repeating-linear-gradient(135deg,var(--c) 0 3px,#FFFFFF 3px 6px);clip-path:polygon(0 0,calc(100% - 8px) 0,100% 50%,calc(100% - 8px) 100%,0 100%)}
.js .kpbar__f{transform:scaleX(0);transform-origin:left center}
.js #kptbl.is-on .kpbar__f{transform:none;transition:transform .72s ease-out}
.kpax{position:relative;display:block;height:16px}
.kpax i{position:absolute;top:0;font-style:normal;transform:translateX(-50%);font-family:var(--mono);font-size:var(--t-label);line-height:16px;font-weight:600;letter-spacing:.12em;color:var(--ink-3)}
.kpax i:first-child{transform:none}
.kpax i:nth-child(2){left:25%}
.tbl--kp .tbl__r:hover .kpbar__f,.tbl--kp .tbl__r:focus-within .kpbar__f,.tbl--kp .tbl__r.is-hi .kpbar__f{box-shadow:0 0 0 2px var(--plate),0 0 0 3px var(--navy)}
@media (min-width:860px){.tbl--kp .tbl__h,.tbl--kp .tbl__r{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr) 128px minmax(0,.9fr)}}
.kpread{font-family:var(--mono);font-size:var(--t-note);line-height:24px;color:var(--ink);min-height:24px;margin:var(--s4) 0 0;border-left:var(--edge) solid var(--navy);padding-left:var(--s3);font-variant-numeric:tabular-nums slashed-zero}
.lr.mt-4{margin-top:var(--s6)}
.lr .kpfig{margin:0}
/* ---------- плашка стадии (обе программы) и кадры-полосы ---------- */
.stage{max-width:none;padding:var(--s4);background:var(--plate);border-left:var(--edge) solid var(--blue)}
.ph--band{aspect-ratio:auto;height:clamp(160px,28vw,320px)}
.ph.mt-3{margin-top:var(--s5)}
.ph.mt-4{margin-top:var(--s6)}
.ph__t{box-shadow:0 0 0 4px var(--plate)}
</style>`, 'new css');
  return h;
}

// ------------------------------------------------------------------ шапка: оглавление после <header>
function pidx(h, items) {
  const li = items.map(([id, n, t]) => `      <li><a href="#${id}"><span class="pidx__n">${n}</span>${t}</a></li>`).join('\n');
  return rep(h, `</header>\n\n<main id="top">`, `</header>
<nav class="pidx" aria-label="На этой странице">
  <div class="wrap pidx__in">
    <ol class="pidx__l">
${li}
    </ol>
    <span class="pidx__bar" aria-hidden="true"></span>
  </div>
</nav>

<main id="top">`, 'pidx');
}

// ------------------------------------------------------------------ общий JS: оглавление и плитки
const JS_PIDX = `
  /* Оглавление страницы: текущий раздел (aria-current) и ход чтения; без JS — обычные якоря в липкой строке. */
  var pl = $$('.pidx__l a'), pbar = $('.pidx__bar');
  if (pl.length) {
    var psec = pl.map(function (a) { return doc.getElementById(a.getAttribute('href').slice(1)); }), pt = false;
    function pfr() {
      pt = false;
      var max = root.scrollHeight - window.innerHeight;
      if (pbar) pbar.style.setProperty('--p', max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4) : 0);
      var cur = -1, line = window.innerHeight * 0.34;
      psec.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= line) cur = i; });
      pl.forEach(function (a, i) { if (i === cur) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); a.classList.toggle('is-past', i < cur); });
    }
    function pon() { if (!pt) { pt = true; window.requestAnimationFrame(pfr); } }
    window.addEventListener('scroll', pon, { passive: true });
    window.addEventListener('resize', pon);
    pfr();
  }
`;

const JS_INDEX = `<script>
/* Главная: оглавление, плитки-превью, хроника, фильтр ролей, фильтр методик, выбор адресата. Без JS всё это — обычные якоря и полные списки. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function firstSentence(t) { var m = t.replace(/\\s+/g, ' ').trim().match(/^.*?[.!?](?=\\s|$)/); return m ? m[0] : t; }
${JS_PIDX}
  /* 1. Плитки карты: по наведению и фокусу — первая фраза раздела; предпросмотр накрывает плитку ниже целиком, не режет её текст. Клик — переход к разделу. */
  var lis = $$('.map > li');
  $$('.tile[href^="#"]').forEach(function (a) {
    var sel = a.getAttribute('data-src') || (a.getAttribute('href') + ' .lead');
    var src = $(sel);
    if (!src) return;
    var li = a.parentNode, x = doc.createElement('p');
    x.className = 'tile__x';
    x.textContent = firstSentence(src.textContent);
    li.appendChild(x);
    function open() {
      var r = li.getBoundingClientRect(), bottom = 0;
      lis.forEach(function (o) { var b = o.getBoundingClientRect(); if (b.top > r.bottom - 1 && b.top < r.bottom + 40 && b.bottom > bottom) bottom = b.bottom; });
      x.style.minHeight = bottom ? Math.round(bottom - r.bottom) + 'px' : '';
      li.classList.add('is-open');
    }
    function close() { li.classList.remove('is-open'); }
    a.addEventListener('mouseenter', open);
    a.addEventListener('mouseleave', close);
    a.addEventListener('focus', open);
    a.addEventListener('blur', close);
    a.addEventListener('click', close);
  });

  /* 2. Хроника: статическая ось; наведение или фокус на метке подсвечивает строку списка, и наоборот. */
  var marks = $$('.tlx__m'), items = $$('#tl > li');
  if (marks.length && marks.length === items.length) {
    function show(i) {
      marks.forEach(function (m, j) { m.classList.toggle('is-on', j === i); });
      items.forEach(function (li, j) { if (j === i) li.setAttribute('aria-current', 'true'); else li.removeAttribute('aria-current'); });
    }
    marks.forEach(function (m, j) {
      m.addEventListener('mouseenter', function () { show(j); });
      m.addEventListener('focus', function () { show(j); });
      m.addEventListener('mouseleave', function () { show(-1); });
      m.addEventListener('blur', function () { show(-1); });
    });
    items.forEach(function (li, j) {
      li.addEventListener('mouseenter', function () { show(j); });
      li.addEventListener('mouseleave', function () { show(-1); });
    });
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

  /* 4. Методики: фильтр по нормативному документу и счётчик. Без JS — все девять строк, кнопок нет. */
  var mf = $('#mfilt'), mc = $('#mcount');
  if (mf) {
    mf.hidden = false;
    if (mc) mc.hidden = false;
    var mrows = $$('#mtbl .tbl__r');
    $$('.filt__b', mf).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-doc'), n = 0;
        $$('.filt__b', mf).forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        mrows.forEach(function (r) { var on = k === 'all' || (' ' + (r.getAttribute('data-doc') || '') + ' ').indexOf(' ' + k + ' ') >= 0; r.hidden = !on; if (on) n++; });
        if (mc) mc.textContent = k === 'all' ? 'Показаны все девять методик' : 'Методик с этой привязкой: ' + n + ' из 9';
      });
    });
  }

  /* 5. Партнёрам: выбранный адресат встаёт первым во всю ширину, остальные ужимаются до заголовка. Повторное нажатие возвращает четыре карточки. */
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
</script>`;

const JS_RD = `<script>
/* /rd: оглавление; планшет, перспектива которого следует за прокруткой; шкала КП; связь лунок ближнего ряда со строками таблицы и строкой контекста. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
${JS_PIDX}
  /* 1. Планшет 8 × 12: та же формула, что и в статической разметке; k меняется с положением планшета в окне.
        p = clip((vh − top) / (vh + h), 0, 1); k = 1.1 + 1.6·p; q = 1/(1 + k·r/7); q7 = 1/(1 + k)
        x = 280 + (c − 5.5)·42·q; y = 310 − 250·(1 − q)/(1 − q7); rx = 11q; ry = 7q. При p = 0.4375 k = 1.8 — принятая геометрия.
        Под prefers-reduced-motion обработчик не подключается: планшет стоит при k = 1.8. */
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

  /* 2. Шкала КП: столбики вырастают один раз при входе таблицы в экран; под reduced-motion и без JS — сразу в конечном состоянии. */
  var kt = $('#kptbl');
  if (kt) {
    function kon() { kt.classList.add('is-on'); }
    if (reduce || !('IntersectionObserver' in window)) kon();
    else { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { kon(); io.disconnect(); } }); }, { threshold: 0.2 }); io.observe(kt); }
  }

  /* 3. Лунки ближнего ряда ↔ строки таблицы КП ↔ строка контекста: наведение или фокус на одном подсвечивает другое и выводит строку data-read. Базовое состояние строки — постановка и порог. */
  var links = $$('.kprow__a'), rows = $$('#kptbl .tbl__r'), read = $('#kpread'), base = read ? read.textContent : '';
  if (links.length && rows.length) {
    function hi(id, on) {
      var row = null;
      links.forEach(function (a) { a.classList.toggle('is-hi', on && a.getAttribute('data-kp') === id); });
      rows.forEach(function (r) { var m = on && r.id === id; r.classList.toggle('is-hi', m); if (m) row = r; });
      if (read) read.textContent = row ? (row.getAttribute('data-read') || base) : base;
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
      r.addEventListener('focus', function () { hi(r.id, true); });
      r.addEventListener('blur', function () { hi(r.id, false); });
    });
  }
})();
</script>`;

// ------------------------------------------------------------------ ГЛАВНАЯ
function buildIndex(h) {
  h = css(h);
  h = pidx(h, [['programs', '01', 'Программы'], ['done', '02', 'Сделано'], ['lab', '03', 'Комплектация'], ['biobank', '04', 'Биобанк'], ['quality', '05', 'Качество'], ['park', '06', 'Оборудование'], ['team', '07', 'Команда'], ['partners', '08', 'Партнёрам'], ['contacts', '09', 'Контакты']]);

  // F + §3 п. 19: стадии обеих программ в первом ряду; тайлы без числа — навигация словом
  h = rep(h, `          <li><a class="tile" href="#programs"><span class="tile__v">2</span><span class="tile__t">программы НИОКР с государственным финансированием</span><span class="tile__k">01 · Программы</span></a></li>
          <li><a class="tile" href="#methods" data-src="#methods h3"><span class="tile__v">9</span><span class="tile__t">методик вирусологического тестирования in vitro</span><span class="tile__k">05.1 · Методики</span></a></li>
          <li><a class="tile" href="#lab"><span class="tile__v">155</span><span class="tile__t">наборов для трёх отделений реанимации укомплектованы и промаркированы</span><span class="tile__k">03 · Комплектация</span></a></li>
          <li><a class="tile" href="#biobank"><span class="tile__v">357</span><span class="tile__t">криобоксов учтены в двух низкотемпературных морозильниках</span><span class="tile__k">04 · Биобанк</span></a></li>
          <li><a class="tile" href="#quality"><span class="tile__v">29 СОП</span><span class="tile__t">второго уровня и 81 форма в системе качества; у лабораторных СОП есть английская редакция</span><span class="tile__k">05 · Качество</span></a></li>
          <li><a class="tile" href="#park"><span class="tile__v">−86 °C</span><span class="tile__t">4 низкотемпературных морозильника по 338 л</span><span class="tile__k">06 · Оборудование</span></a></li>
          <li><a class="tile" href="rd.html#kks"><span class="tile__v">ККС-5</span><span class="tile__t">проходит государственную регистрацию как медицинское изделие</span><span class="tile__k">ККС-5 · стадия</span></a></li>
          <li><a class="tile" href="rd.html#avian"><span class="tile__v tile__v--s">16.11.2026 – 31.12.2028</span><span class="tile__t">НИОКТР: пероральные ДНК-вакцины для кур</span><span class="tile__k">Вакцины для кур · план</span></a></li>
          <li><a class="tile" href="#team"><span class="tile__v tile__v--s">Команда</span><span class="tile__t">роли в программах и в лаборатории: роль, степень, институт</span><span class="tile__k">07 · Команда</span></a></li>
          <li><a class="tile" href="#partners"><span class="tile__v">4</span><span class="tile__t">адресата: форматы работы, что сделано и как начать</span><span class="tile__k">08 · Партнёрам</span></a></li>`,
`          <li><a class="tile" href="#programs"><span class="tile__v">2</span><span class="tile__t">программы НИОКР с государственным финансированием</span><span class="tile__k">01 · Программы</span></a></li>
          <li><a class="tile" href="rd.html#kks"><span class="tile__v">ККС-5</span><span class="tile__t">проходит государственную регистрацию как медицинское изделие</span><span class="tile__k">ККС-5 · стадия</span></a></li>
          <li><a class="tile" href="rd.html#avian"><span class="tile__v tile__v--s">16.11.2026 – 31.12.2028</span><span class="tile__t">НИОКТР: пероральные ДНК-вакцины для кур</span><span class="tile__k">Вакцины для кур · план</span></a></li>
          <li><a class="tile" href="#methods" data-src="#methods h3"><span class="tile__v">9</span><span class="tile__t">методик вирусологического тестирования in vitro</span><span class="tile__k">05.1 · Методики</span></a></li>
          <li><a class="tile" href="#lab"><span class="tile__v">155</span><span class="tile__t">наборов для трёх отделений реанимации укомплектованы и промаркированы</span><span class="tile__k">03 · Комплектация</span></a></li>
          <li><a class="tile" href="#biobank"><span class="tile__v">357</span><span class="tile__t">криобоксов учтены в двух низкотемпературных морозильниках</span><span class="tile__k">04 · Биобанк</span></a></li>
          <li><a class="tile" href="#quality"><span class="tile__v">29 СОП</span><span class="tile__t">второго уровня и 81 форма в системе качества; у лабораторных СОП есть английская редакция</span><span class="tile__k">05 · Качество</span></a></li>
          <li><a class="tile" href="#park"><span class="tile__v">−86 °C</span><span class="tile__t">4 низкотемпературных морозильника по 338 л</span><span class="tile__k">06 · Оборудование</span></a></li>
          <li><a class="tile" href="#team"><span class="tile__v tile__v--s">Команда</span><span class="tile__t">роли в программах и в лаборатории: роль, степень, институт</span><span class="tile__k">07 · Команда</span></a></li>
          <li><a class="tile" href="#partners"><span class="tile__v tile__v--s">Партнёрам</span><span class="tile__t">форматы работы, что сделано и как начать</span><span class="tile__k">08 · Партнёрам</span></a></li>`, 'tiles');

  // §3 п. 4: атрибуция субсидии госпрограмме (карточка 01)
  h = rep(h, `<p>Субсидия ИНТЦ «Сириус» — 15&nbsp;000&nbsp;000&nbsp;₽ и 3&nbsp;000&nbsp;000&nbsp;₽ собственных средств на 2026–2028.`,
    `<p>Субсидия по государственной программе «Научно-технологическое развитие федеральной территории „Сириус“» — 15&nbsp;000&nbsp;000&nbsp;₽ и 3&nbsp;000&nbsp;000&nbsp;₽ собственных средств на 2026–2028.`, 'subsidy card');

  // §3 п. 14: хроника без ползунка и курсора
  h = rep(h, `<line class="tlx__cur" x1="24" y1="8" x2="24" y2="64" stroke="#5282BE" stroke-width="2"/>`, ``, 'tlx cur');
  h = rep(h, `        <div class="tlx__ctl" id="tlx-ctl" hidden>
          <label class="tlx__k" for="tlx-range">Шкала</label>
          <input type="range" id="tlx-range" min="0" max="70" value="3" step="1">
          <output class="tlx__out" for="tlx-range" id="tlx-out"></output>
        </div>
`, ``, 'tlx ctl');

  // 03: выноска (E) рядом с лидом; §3 п. 3, 11; §3 п. 10 (подпись B9)
  h = rep(h, `      <p class="lead">Для международного многоцентрового исследования собраны и промаркированы 155 наборов для трёх отделений реанимации: 130 наборов для крови и 25 для плазмы. По всем трём центрам наборы готовы к отправке.</p>
      <ul class="spec">
        <li>8 цветокодированных криобоксов на каждый центр</li>
        <li>27 этикеток на набор для крови и 52 на набор для плазмы</li>
        <li>2&nbsp;400 этикеток криопробирок</li>
        <li>Код криопробирки определяется номером набора</li>
        <li>DataMatrix и линейный штрихкод; код криопробирки определяется номером набора</li>`,
`      <div class="lr">
        <p class="lead">Для международного многоцентрового исследования собраны и промаркированы 155 наборов для трёх отделений реанимации: 130 наборов для крови и 25 для плазмы. По всем трём центрам наборы готовы к отправке.</p>
        <aside class="mn"><b>1&nbsp;400 + 500 + 500</b>этикеток криопробирок; DataMatrix и линейный штрихкод</aside>
      </div>
      <ul class="spec">
        <li>8 цветокодированных криобоксов на каждый центр</li>
        <li>27 этикеток на набор для крови и 52 на набор для плазмы</li>
        <li>1&nbsp;400 + 500 + 500 этикеток криопробирок</li>
        <li>DataMatrix и линейный штрихкод; код криопробирки определяется номером набора</li>`, 'lab spec');
  h = rep(h, `<figcaption class="ph__t">Стойка хранения с мониторингом температуры</figcaption>`, `<figcaption class="ph__t">Стойка хранения криобоксов</figcaption>`, 'B9');

  // 04: §3 п. 5, 17, 23
  h = rep(h, `<h3>Состав коллекций</h3>`, `<h3>Коллекции и поставленные панели</h3>`, 'collections h3');
  h = rep(h, `Материал коллекций для внешнего исследования передаём по соглашению — порядок в разделе «Партнёрам».</p>`, `Материал коллекций для внешнего исследования передаём по соглашению.</p>`, 'dangling link');
  h = rep(h, `      <figure class="ph ph--wide mt-3">
          <span class="ph__code">A1</span>`, `      <figure class="ph ph--wide ph--band mt-3">
          <span class="ph__code">A1</span>`, 'A1 band');

  // 05: выноска 29 + 81 (E); §3 п. 9; фильтр методик (C); §3 п. 23
  h = rep(h, `      <p class="lead">Лаборатория работает по системе СОП группы компаний: 29 СОП второго уровня и 81 форма. У лабораторных СОП есть английская редакция.</p>
      <p class="note">СОПы покрывают цепь сохранности образца, валидацию методов, расследование результатов вне спецификации, LIMS, передачу данных спонсору, внутрилабораторный контроль, постановку ИФА, подготовку наборов и обращение с отходами класса Б. Несоответствия регистрируются и расследуются по СОП.</p>`,
`      <div class="lr">
        <div>
          <p class="lead">Лаборатория работает по системе СОП группы компаний: 29 СОП второго уровня и 81 форма. У лабораторных СОП есть английская редакция.</p>
          <p class="note">СОПы покрывают цепь сохранности образца, валидацию методов, расследование результатов вне спецификации, LIMS, передачу данных спонсору, внутрилабораторный контроль, постановку ИФА, подготовку наборов и обращение с отходами класса Б.</p>
        </div>
        <aside class="mn"><b>29 + 81</b>СОП второго уровня и формы</aside>
      </div>`, 'quality lead');
  h = rep(h, `      <div class="tbl" role="table">
        <div class="tbl__h" role="row">
          <span>Методика</span>
          <span>Что определяет</span>
          <span>Нормативная привязка</span>
        </div>`,
`      <div class="filt" id="mfilt" hidden role="group" aria-label="Показать методики по нормативному документу">
        <span class="filt__k">Документ</span>
        <button type="button" class="filt__b" data-doc="all" aria-pressed="true">Все девять</button>
        <button type="button" class="filt__b" data-doc="ofs" aria-pressed="false">ОФС.1.7.2.0006.15</button>
        <button type="button" class="filt__b" data-doc="eek" aria-pressed="false">ЕЭК № 89</button>
        <button type="button" class="filt__b" data-doc="woah" aria-pressed="false">WOAH 1.1.9</button>
        <button type="button" class="filt__b" data-doc="muk" aria-pressed="false">МУК 4.2.2029-05</button>
      </div>
      <p class="note mt-2" id="mcount" aria-live="polite" hidden>Показаны все девять методик</p>
      <div class="tbl" role="table" id="mtbl">
        <div class="tbl__h" role="row">
          <span>Методика</span>
          <span>Что определяет</span>
          <span>Нормативная привязка</span>
        </div>`, 'methods filter');
  const docs = ['ofs eek', '', '', 'woah', 'ofs muk', '', 'ofs eek woah', 'eek', ''];
  let i = 0;
  h = h.replace(/<div class="tbl__r" role="row">\n          <div class="tbl__c1" data-l="Методика"/g, (m) => {
    const d = docs[i++];
    return `<div class="tbl__r" role="row" data-doc="${d}">\n          <div class="tbl__c1" data-l="Методика"`;
  });
  if (i !== 9) throw new Error('methods rows: ' + i);
  h = rep(h, `      <figure class="ph ph--wide mt-3">
          <span class="ph__code">B2</span>`, `      <figure class="ph ph--wide ph--band mt-3">
          <span class="ph__code">B2</span>`, 'B2 band');

  // 06: §3 п. 16 — квадратики-счётчики удалены
  h = repAll(h, /<svg class="inv__m"[\s\S]*?<\/svg>/g, '', 'inv__m svg', 9);

  // 07: §3 п. 1, 12
  h = rep(h, `<span>доктор ветеринарных наук, профессор, академик РАН</span>`, `<span>доктор ветеринарных наук, профессор</span>`, 'academic');
  h = rep(h, `<div class="ppl__n">Менеджер биобанка</div><div class="ppl__d">Коллекции и учёт низкотемпературного хранения.</div>`, `<div class="ppl__n">Менеджер биобанка</div><div class="ppl__d">Лабораторное сопровождение исследований.</div>`, 'biobank manager');

  // 08: G — короткие подписи адресатов; §3 п. 8; §3 п. 4
  h = rep(h, `        <button type="button" class="who__b" data-who="p1" aria-pressed="false">Производителям тест-систем и лабораториям</button>
        <button type="button" class="who__b" data-who="p2" aria-pressed="false">Птицеводческим компаниям и ветеринарным институтам</button>
        <button type="button" class="who__b" data-who="p3" aria-pressed="false">CRO и научным лабораториям</button>
        <button type="button" class="who__b" data-who="p4" aria-pressed="false">Фондам и госпрограммам</button>`,
`        <button type="button" class="who__b" data-who="p1" aria-pressed="false">Производитель тест-систем</button>
        <button type="button" class="who__b" data-who="p2" aria-pressed="false">Птицеводческая компания</button>
        <button type="button" class="who__b" data-who="p3" aria-pressed="false">CRO или научная лаборатория</button>
        <button type="button" class="who__b" data-who="p4" aria-pressed="false">Фонд или госпрограмма</button>`, 'who buttons');
  h = rep(h, `          <h3>ККС-5: знакомство с материалом и совместная характеризация</h3>
          <p>Техническое знакомство с материалом. Совместная характеризация ККС-5 на наборах партнёра по согласованному плану. Требования к будущей поставке.</p>`,
`          <h3>ККС-5: совместная характеризация на наборах партнёра</h3>
          <p>Совместная характеризация ККС-5 на наборах партнёра по согласованному плану.</p>`, 'p1 card');
  h = rep(h, `<p class="card__done"><b>Сделано</b>Программа — победитель конкурса ИНТЦ «Сириус»; НИОКТР <span class="nw">16.11.2026</span> – <span class="nw">31.12.2028</span>.</p>`,
    `<p class="card__done"><b>Сделано</b>Программа — победитель конкурса <span class="nw">26-803-05360-1-0164</span> государственной программы «Научно-технологическое развитие федеральной территории „Сириус“»; НИОКТР <span class="nw">16.11.2026</span> – <span class="nw">31.12.2028</span>.</p>`, 'p2 done');

  // 09: §3 п. 23
  h = rep(h, `      <figure class="ph ph--wide mt-4">
          <span class="ph__code">E1</span>`, `      <figure class="ph ph--wide ph--band mt-4">
          <span class="ph__code">E1</span>`, 'E1 band');

  // подвал: h4 → h3 (§3 п. 22)
  h = repAll(h, /<footer class="ftr">[\s\S]*?<\/footer>/, (m) => m.replace(/<h4>/g, '<h3>').replace(/<\/h4>/g, '</h3>'), 'footer h3');

  // скрипт
  h = repAll(h, /<script>[\s\S]*<\/script>/, JS_INDEX, 'script index');
  return h;
}

// ------------------------------------------------------------------ /rd
function buildRd(h) {
  h = css(h);
  h = pidx(h, [['kks', '01', 'ККС-5'], ['avian', '02', 'Вакцины для кур'], ['start', '03', 'Как начать']]);

  // §3 п. 7
  h = rep(h, `<p class="note mt-3">Ориентир формы выпуска — импортный контроль Bio-Rad Virotrol: готовая жидкость во флаконе.</p>`, `<p class="note mt-3">Ориентир формы выпуска — импортный контроль Bio-Rad Virotrol.</p>`, 'virotrol');

  // §3 п. 15: схема цикла ИФА — статично, компактно, все шесть шагов видны сразу
  h = repAll(h, /        <div class="scheme">\n          <div class="scheme__fig">[\s\S]*?<\/figcaption>\n        <\/div>\n/, `        <div class="scheme">
          <ol class="cycle" aria-label="Цикл измерения ИФА, шесть шагов">
            <li class="cycle--kks"><span class="cycle__n">1</span><p class="cycle__t">ККС-5</p><p class="cycle__s">5 мл, пять маркеров</p></li>
            <li><span class="cycle__n">2</span><p class="cycle__t">Внесение</p><p class="cycle__s">вместе с образцами</p></li>
            <li><span class="cycle__n">3</span><p class="cycle__t">Инкубация</p><p class="cycle__s">контроль на планшете</p></li>
            <li><span class="cycle__n">4</span><p class="cycle__t">Промывка</p><p class="cycle__s">шаг постановки</p></li>
            <li><span class="cycle__n">5</span><p class="cycle__t">Фотометр</p><p class="cycle__s">чтение ОП</p></li>
            <li class="cycle--kks"><span class="cycle__n">6</span><p class="cycle__t">КП, порог ≥ 3</p><p class="cycle__s">порог договора ≥ 3</p></li>
          </ol>
          <figcaption class="dgm__out">
            <p>Показан порядок цикла ИФА и место в нём ККС-5. Контроль вносят в ту же постановку, что и исследуемые образцы, а коэффициент позитивности считают по отношению оптической плотности контроля к критической (для конкурентного формата анти-HBcore — обратное отношение).</p>
          </figcaption>
        </div>
`, 'scheme');

  // 01.2: выноски (E) у примечания о способе и серии
  h = rep(h, `      <p class="note">Гипериммунная сыворотка содержала избыток HBsAg. Избирательное подавление этого компонента сохранило анти-HBcore в титре не ниже <span class="nw">1:128</span>. Производственный режим зафиксирован 27 августа 2026 года и подтверждён титрованием 31 августа 2026 года. Заявка на изобретение подана в Роспатент.</p>`,
`      <div class="lr">
        <p class="note">Гипериммунная сыворотка содержала избыток HBsAg. Избирательное подавление этого компонента сохранило анти-HBcore в титре не ниже <span class="nw">1:128</span>. Производственный режим зафиксирован 27 августа 2026 года и подтверждён титрованием 31 августа 2026 года. Заявка на изобретение подана в Роспатент.</p>
        <aside class="mn"><b>1:128</b>титр анти-HBcore после подавления избыточного HBsAg</aside>
      </div>`, 'mn 1:128');
  h = rep(h, `      <figure class="kpfig mt-4">`, `      <div class="lr mt-4">
      <figure class="kpfig">`, 'mn series open');
  h = rep(h, `        <figcaption class="motif__cap">Пять маркеров — пять лунок ближнего ряда; белая лунка — отрицательный контроль</figcaption>
      </figure>`, `        <figcaption class="motif__cap">Пять маркеров — пять лунок ближнего ряда; белая лунка — отрицательный контроль</figcaption>
      </figure>
      <aside class="mn"><b>30 × 5 мл</b>серия ККС-5-П01, объём серии <span class="nw">168,7 мл</span></aside>
      </div>`, 'mn series close');

  // A + D: таблица КП — столбец «Шкала КП, порог 3», строки с фокусом и data-read, строка контекста
  h = rep(h, `      <div class="tbl tbl--kp" role="table" id="kptbl">
        <div class="tbl__h" role="row">
          <span>Маркер</span>
          <span>Постановка 03.09.2026</span>
          <span>КП</span>
        </div>`,
`      <p class="kpread" id="kpread" aria-live="polite">Постановка 03.09.2026 · пять маркеров · порог КП ≥ 3</p>
      <div class="tbl tbl--kp" role="table" id="kptbl">
        <div class="tbl__h" role="row">
          <span>Маркер</span>
          <span>Постановка 03.09.2026</span>
          <span>КП</span>
          <span>Шкала КП, порог&nbsp;3<span class="kpax" aria-hidden="true"><i>0</i><i>3</i></span></span>
        </div>`, 'kp head');
  const kp = [
    ['kp1', 'HBsAg · КП 4,4 · n = 3 · ОП 0,498 · ОПкрит 0,114 · 450/620 нм', `<div class="kpbar" role="img" aria-label="КП 4,4 на шкале с порогом 3"><span class="kpbar__f" style="--w:36.67%;--c:#24305F"></span></div>`],
    ['kp2', 'анти-HBcore · КП 6,2 · n = 4 · конкурентный формат', `<div class="kpbar" role="img" aria-label="КП 6,2 на шкале с порогом 3"><span class="kpbar__f" style="--w:51.67%;--c:#5282BE"></span></div>`],
    ['kp3', 'анти-ВИЧ-1/2 · сигнал выше верхнего предела измерения фотометра · n = 4', `<div class="kpbar kpbar--off" role="img" aria-label="сигнал выше верхнего предела измерения фотометра: столбик уходит за край шкалы"><span class="kpbar__f" style="--c:#749BCD"></span></div>`],
    ['kp4', 'анти-ВГС · КП ≈11 · n = 4', `<div class="kpbar" role="img" aria-label="КП около 11 на шкале с порогом 3"><span class="kpbar__f" style="--w:91.67%;--c:#97B5DC"></span></div>`],
    ['kp5', 'анти-T. pallidum · КП 3,8 · n = 4', `<div class="kpbar" role="img" aria-label="КП 3,8 на шкале с порогом 3"><span class="kpbar__f" style="--w:31.67%;--c:#A6B1BE"></span></div>`],
  ];
  const kpv = { kp1: '4,4', kp2: '6,2', kp3: 'выше предела фотометра', kp4: '≈11', kp5: '3,8' };
  for (const [id, read, bar] of kp) {
    h = rep(h, `<div class="tbl__r" role="row" id="${id}">`, `<div class="tbl__r" role="row" id="${id}" tabindex="0" data-read="${read}">`, id);
    h = rep(h, `<div data-l="КП" role="cell"><span class="kp">${kpv[id]}</span></div>\n        </div>`, `<div data-l="КП" role="cell"><span class="kp">${kpv[id]}</span></div>\n          <div data-l="Шкала КП, порог 3" role="cell">${bar}</div>\n        </div>`, id + ' bar');
  }

  // 01.3: выноска (E)
  h = rep(h, `      <p class="note">Исследование стабильности идёт на целых флаконах по 5 мл: плечи +45&nbsp;°C и +37&nbsp;°C плюс реальное время при <span class="nw">+2…+8&nbsp;°C</span>, старт 4 сентября 2026 года. Изохронная постановка всех точек выполнена 30 октября 2026 года на автоматической станции ИФА. Станция введена 28 октября 2026 года.</p>`,
`      <div class="lr">
        <div>
          <p class="note">Исследование стабильности идёт на целых флаконах по 5 мл: плечи +45&nbsp;°C и +37&nbsp;°C плюс реальное время при <span class="nw">+2…+8&nbsp;°C</span>, старт 4 сентября 2026 года. Изохронная постановка всех точек выполнена 30 октября 2026 года на автоматической станции ИФА. Станция введена 28 октября 2026 года.</p>
          <p class="note">Второй этап — характеризация в ИХЛА на внешней площадке по плану исследования v3 от 16 октября 2026 года, слепая, de novo.</p>
        </div>
        <aside class="mn"><b>+45 / +37&nbsp;°C</b>плечи ускоренного старения, старт 04.09.2026</aside>
      </div>`, 'mn stability');
  h = rep(h, `      </div>
      <p class="note">Второй этап — характеризация в ИХЛА на внешней площадке по плану исследования v3 от 16 октября 2026 года, слепая, de novo.</p>
`, `      </div>
`, 'second note moved');

  // 01.4: класс плашки стадии — общий
  h = rep(h, `<p class="lead kks5__stage">ККС-5 проходит государственную регистрацию как медицинское изделие.</p>`, `<p class="lead stage">ККС-5 проходит государственную регистрацию как медицинское изделие.</p>`, 'kks stage');

  h = rep(h, `      <figure class="ph ph--wide mt-3">
          <span class="ph__code">B5</span>`, `      <figure class="ph ph--wide ph--band mt-3">
          <span class="ph__code">B5</span>`, 'B5 band');

  // 02: §3 п. 18 — лид под 02.1, фраза о сдерживании вторым предложением
  h = rep(h, `            <h2 class="sh__t">Пероральные ДНК-вакцины для кур</h2>
          </header>
          <p class="lead">Вакцинировать птицу не инъекцией каждой особи, а с водой или кормом: живой носитель доставляет ДНК-конструкцию в клетки кишечника.</p>
        </div>`, `            <h2 class="sh__t">Пероральные ДНК-вакцины для кур</h2>
          </header>
        </div>`, 'avian hero lead');
  h = rep(h, `      <p class="note">Биологическое сдерживание носителя заложено в конструкцию.</p>`, `      <p class="lead">Вакцинировать птицу не инъекцией каждой особи, а с водой или кормом: живой носитель доставляет ДНК-конструкцию в клетки кишечника. Биологическое сдерживание носителя заложено в конструкцию.</p>`, 'idea');

  // 02.2: §3 п. 6 — только названия болезней
  h = rep(h, `        <li><b>Болезнь Ньюкасла</b> — острая вирусная болезнь кур с поражением дыхательной, пищеварительной и нервной систем</li>
        <li><b>Болезнь Гамборо</b> — инфекционная бурсальная болезнь, вирусное поражение иммунной системы молодняка кур</li>
        <li><b>Инфекционный бронхит кур</b> — вирусная болезнь дыхательных путей и репродуктивного тракта кур</li>`,
`        <li>Болезнь Ньюкасла</li>
        <li>Болезнь Гамборо</li>
        <li>Инфекционный бронхит кур</li>`, 'diseases');

  // 02.3: §3 п. 2
  h = rep(h, `        <li>Собственная система поддержания экспрессии без антибиотиков</li>\n`, ``, 'expression system');

  // 02.5: G — плашка стадии; §3 п. 1
  h = rep(h, `<p class="lead">Стадия программы пероральных ДНК-вакцин для кур — НИОКТР с 16 ноября 2026 года по 31 декабря 2028 года.</p>`, `<p class="lead stage">Стадия программы пероральных ДНК-вакцин для кур — НИОКТР с 16 ноября 2026 года по 31 декабря 2028 года.</p>`, 'avian stage');
  h = rep(h, `Этап in vivo ведёт доктор ветеринарных наук, профессор, академик РАН.`, `Этап in vivo ведёт доктор ветеринарных наук, профессор.`, 'academic rd');

  // 02.6: §3 п. 4
  h = rep(h, `<p class="note">Субсидия ИНТЦ «Сириус» — 15&nbsp;000&nbsp;000&nbsp;₽ и 3&nbsp;000&nbsp;000&nbsp;₽ собственных средств, 2026–2028. График субсидии по годам: 1&nbsp;млн&nbsp;₽, 7&nbsp;млн&nbsp;₽ и 7&nbsp;млн&nbsp;₽. Конкурс <span class="mono"><span class="nw">26-803-05360-1-0164</span></span>. Государственная программа «Научно-технологическое развитие федеральной территории „Сириус“».</p>`,
`<p class="note">Субсидия по государственной программе «Научно-технологическое развитие федеральной территории „Сириус“» — 15&nbsp;000&nbsp;000&nbsp;₽ и 3&nbsp;000&nbsp;000&nbsp;₽ собственных средств, 2026–2028. График субсидии по годам: 1&nbsp;млн&nbsp;₽, 7&nbsp;млн&nbsp;₽ и 7&nbsp;млн&nbsp;₽. Конкурс <span class="mono"><span class="nw">26-803-05360-1-0164</span></span>.</p>`, 'subsidy rd');

  // 03: H — адрес и телефон в той же строке
  h = rep(h, `      <p class="lead">Пришлите задачу, матрицу, объём и сроки. NDA подписываем по запросу.</p>
      <p><a href="mailto:ceo@bmc-gp.com">ceo@bmc-gp.com</a> · <a href="tel:+79086325048">+7&nbsp;908&nbsp;632-50-48</a></p>`,
`      <p class="lead">Пришлите задачу, матрицу, объём и сроки на <a href="mailto:ceo@bmc-gp.com">ceo@bmc-gp.com</a> или по телефону <a href="tel:+79086325048">+7&nbsp;908&nbsp;632-50-48</a>. NDA подписываем по запросу.</p>`, 'start');

  // подвал: h4 → h3
  h = repAll(h, /<footer class="ftr">[\s\S]*?<\/footer>/, (m) => m.replace(/<h4>/g, '<h3>').replace(/<\/h4>/g, '</h3>'), 'footer h3');

  // скрипт
  h = repAll(h, /<script>[\s\S]*<\/script>/, JS_RD, 'script rd');
  return h;
}

// ------------------------------------------------------------------ Раунд 1 слепой проверки (03.11.2026)
function r1Common(h) {
  // Реквизиты: колонки dl не растягивают строки по высоте соседней колонки
  h = rep(h, `.dl{margin:0;display:grid;grid-template-columns:minmax(0,1fr)}`, `.dl{margin:0;display:grid;grid-template-columns:minmax(0,1fr);align-content:start}`, 'r1 dl');
  // Поля кадров: ниже и плотнее, по одному на кадр (HANDOFF §2.7 — поля и номера кадров остаются)
  h = rep(h, `.ph--band{aspect-ratio:auto;height:clamp(160px,28vw,320px)}`, `.ph--band,.ph--wide,.ph--tall{aspect-ratio:auto;height:clamp(120px,14vw,176px)}`, 'r1 ph size');
  // Печать: поля кадров — узкой полосой, мотивы — не больше трети листа, карта и подвал не рвутся
  h = rep(h, `  .ph--band{max-height:240px}\n`, `  .ph,.ph--band,.ph--wide,.ph--tall{height:88px;max-height:88px;background-image:none}\n  .motif,.kks5__plate{max-height:70mm}\n  .map,.ftr,.ftr__g{break-inside:avoid}\n`, 'r1 print');
  // Подвал: строка-оговорка удалена
  h = rep(h, `    <p class="ftr__note">Подтверждающие документы предоставляются по запросу и на аудите.</p>\n`, ``, 'r1 ftr note');
  return h;
}

function r1Index(h) {
  h = r1Common(h);
  // Хроника: метки 01.09 и 04.09 подняты во второй ряд с ножкой к оси — точки не перекрываются
  h = rep(h, `<circle cx="87.086" cy="40" r="6" fill="#24305F" stroke="#FFFFFF" stroke-width="1.5"/>`,
    `<line x1="87.086" y1="22" x2="87.086" y2="36" stroke="#24305F" stroke-width="1"/><circle cx="87.086" cy="16" r="6" fill="#24305F" stroke="#FFFFFF" stroke-width="1.5"/>`, 'r1 ev2 lane');
  h = rep(h, `<circle cx="110.743" cy="40" r="6" fill="#24305F" stroke="#FFFFFF" stroke-width="1.5"/>`,
    `<line x1="110.743" y1="22" x2="110.743" y2="36" stroke="#24305F" stroke-width="1"/><circle cx="110.743" cy="16" r="6" fill="#24305F" stroke="#FFFFFF" stroke-width="1.5"/>`, 'r1 ev4 lane');
  // Подпись кадра B8 — по списку кадров
  h = rep(h, `<figcaption class="ph__t">Лабораторный прибор</figcaption>`, `<figcaption class="ph__t">Приборы с читаемыми моделями</figcaption>`, 'r1 B8');
  // 08: лид о самом разделе удалён; абзац карточки p1, повторявший заголовок, удалён
  h = rep(h, `      <p class="lead">Четыре адресата, у каждого — форматы работы и то, что по ним уже сделано.</p>\n`, ``, 'r1 partners lead');
  h = rep(h, `          <p>Совместная характеризация ККС-5 на наборах партнёра по согласованному плану.</p>\n`, ``, 'r1 p1 para');
  // 08.1: шаг 1 — матрица и объём только для лабораторных работ; форма mailto удалена, тема письма в ссылке
  h = rep(h, `<p>Пришлите задачу, матрицу, объём и сроки на <a href="mailto:ceo@bmc-gp.com">ceo@bmc-gp.com</a>.</p>`,
    `<p>Пришлите задачу и сроки на <a href="mailto:ceo@bmc-gp.com?subject=%D0%97%D0%B0%D0%BF%D1%80%D0%BE%D1%81%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0">ceo@bmc-gp.com</a>; для лабораторных работ — также матрицу и объём.</p>`, 'r1 step1');
  h = repAll(h, /\n      <form class="form"[\s\S]*?<\/form>/, ``, 'r1 form');
  return h;
}

function r1Rd(h) {
  h = r1Common(h);
  h = rep(h, `<p class="hero__lead">Контрольная сыворотка для ИФА и ИХЛА — с собранной серией и измеренными коэффициентами позитивности. Пероральные ДНК-вакцины для кур — с планом НИОКТР, датами и субсидией.</p>`,
    `<p class="hero__lead">Контрольная сыворотка ККС-5 для ИФА и ИХЛА — пять маркеров в одном флаконе: серия ККС-5-П01 собрана, коэффициенты позитивности измерены 03.09.2026. Пероральные ДНК-вакцины для кур — вакцинация птицы с водой или кормом.</p>`, 'r1 rd lead');
  h = rep(h, `<li>Разброс оптической плотности между флаконами — не больше 10&nbsp;% от среднего по серии</li>`, `<li>Договорное требование: разброс оптической плотности между флаконами — не больше 10&nbsp;% от среднего по серии</li>`, 'r1 10pct');
  h = rep(h, `на коммерческих наборах ИФА одного производителя;`, `на коммерческих наборах ИФА;`, 'r1 one maker');
  h = rep(h, ` Изохронная постановка всех точек выполнена 30 октября 2026 года на автоматической станции ИФА. Станция введена 28 октября 2026 года.</p>`, ` Автоматическая станция ИФА введена 28 октября 2026 года.</p>`, 'r1 isochron');
  // 02: подраздел 02.1 «Идея» — в карточку-шапку, как лид в карточке 01; на телефоне — без второй линейки над мотивом
  h = rep(h, `            <h2 class="sh__t">Пероральные ДНК-вакцины для кур</h2>
          </header>
        </div>`, `            <h2 class="sh__t">Пероральные ДНК-вакцины для кур</h2>
          </header>
          <div class="sub">
            <span class="sub__n">02.1</span>
            <h3>Идея</h3>
          </div>
          <p class="lead">Вакцинировать птицу не инъекцией каждой особи, а с водой или кормом: живой носитель доставляет ДНК-конструкцию в клетки кишечника. Биологическое сдерживание носителя заложено в конструкцию.</p>
        </div>`, 'r1 av intro');
  h = rep(h, `      <div class="sub">
        <span class="sub__n">02.1</span>
        <h3>Идея</h3>
      </div>
      <p class="lead">Вакцинировать птицу не инъекцией каждой особи, а с водой или кормом: живой носитель доставляет ДНК-конструкцию в клетки кишечника. Биологическое сдерживание носителя заложено в конструкцию.</p>
`, ``, 'r1 av idea out');
  h = rep(h, `.av__hero{border-top-color:var(--navy)}`, `.av__hero{border-top-color:var(--navy)}\n.av__hero .sub{margin-top:var(--s5)}\n.av__hero .lead{margin-bottom:0}\n@media (max-width:899px){.av__hero .kks5__plate{border-top:0}}`, 'r1 av css');
  // 02.3 «Научный задел» и 02.4 «Целевой профиль, план» удалены; 02.5 → 02.3, 02.6 → 02.4
  h = repAll(h, /      <div class="sub">\n        <span class="sub__n">02\.3<\/span>[\s\S]*?<\/ul>\n\n?      <div class="sub">\n        <span class="sub__n">02\.4<\/span>[\s\S]*?<\/ul>\n\n?/, ``, 'r1 02.3-02.4');
  h = rep(h, `<span class="sub__n">02.5</span>`, `<span class="sub__n">02.3</span>`, 'r1 renum 02.5');
  h = rep(h, `<span class="sub__n">02.6</span>`, `<span class="sub__n">02.4</span>`, 'r1 renum 02.6');
  // 03: «Как начать» без матрицы и объёма — страница для партнёров программ
  h = rep(h, `<p class="lead">Пришлите задачу, матрицу, объём и сроки на <a href="mailto:ceo@bmc-gp.com">`, `<p class="lead">Пришлите задачу и сроки на <a href="mailto:ceo@bmc-gp.com">`, 'r1 rd start');
  return h;
}

const idx = r1Index(buildIndex(fs.readFileSync(path.join(BASE, 'index.html'), 'utf8')));
const rd = r1Rd(buildRd(fs.readFileSync(path.join(BASE, 'rd.html'), 'utf8')));
fs.writeFileSync(path.join(OUT, 'index.html'), idx);
fs.writeFileSync(path.join(OUT, 'rd.html'), rd);
console.log('written', idx.length, rd.length);
