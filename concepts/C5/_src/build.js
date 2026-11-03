// Build script for concept C5 «Карта того, что есть». Deterministic: every SVG is computed here
// from the formulas written in NOTES.md; the inline JS on the pages re-uses the same formulas.
// usage: node build.js <outdir>
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2];
const r3 = n => Math.round(n * 1000) / 1000;

/* ---------------------------------------------------------------- colours (scheme № 3) */
const NAVY = '#24305F', BLUE = '#5282BE', SKY = '#97B5DC', GREY = '#A6B1BE', MID = '#749BCD';
const colOf = c => c < 3 ? NAVY : c < 6 ? BLUE : c < 9 ? SKY : GREY;

/* ---------------------------------------------------------------- plate: 8 × 12, accepted formula */
// r = 0…7 near→far, c = 0…11, t = r/7, q = 1/(1+k·t), q7 = 1/(1+k)
// x = 280 + (c−5.5)·42·q ; y = 310 − 250·(1−q)/(1−q7) ; rx = 11q ; ry = 7q ; well(0,0) white, navy stroke
function plateWells(k) {
  const q7 = 1 / (1 + k); let s = '';
  for (let r = 0; r < 8; r++) {
    const q = 1 / (1 + k * r / 7);
    const y = r3(310 - 250 * (1 - q) / (1 - q7));
    for (let c = 0; c < 12; c++) {
      const x = r3(280 + (c - 5.5) * 42 * q);
      if (r === 0 && c === 0) s += `<ellipse cx="${x}" cy="${y}" rx="${r3(11 * q - 0.75)}" ry="${r3(7 * q - 0.75)}" fill="#FFFFFF" stroke="${NAVY}" stroke-width="1.5"/>`;
      else s += `<ellipse cx="${x}" cy="${y}" rx="${r3(11 * q)}" ry="${r3(7 * q)}" fill="${colOf(c)}"/>`;
    }
  }
  return s;
}
function plate({ id, cls, title, k = 1.8, scroll = false }) {
  return `<svg class="${cls}" viewBox="0 0 560 340" role="img" aria-labelledby="${id}-t" focusable="false" xmlns="http://www.w3.org/2000/svg" data-grid="8x12" data-k="${k}"${scroll ? ' data-scroll-plate=""' : ''}><title id="${id}-t">${title}</title>${plateWells(k)}</svg>`;
}

/* ---------------------------------------------------------------- flock: poultry-house motif, same discipline */
// R = 6 rows near→far, C = 10 columns, t = r/5, q = 1/(1+k·t), k = 1.1, q5 = 1/(1+k)
// x = 280 + (c − 4.5 + s_r)·52·q, s_r = +0.25 on odd rows, −0.25 on even rows (staggered flock)
// y = 300 − 210·(1−q)/(1−q5) ; rx = 14q ; ry = 6q ; fill: r=0 blue, r=1 sky, r≥2 grey
// drinking line: x = 280, height above floor H = 48q, nipple length 14q at every row; horizon at y5 − 12
function flock({ id, cls, title, k = 1.1 }) {
  const R = 6, C = 10, qR = 1 / (1 + k); let wells = '', nip = '';
  const ys = [], Hs = [];
  for (let r = 0; r < R; r++) {
    const q = 1 / (1 + k * r / (R - 1));
    const y = r3(300 - 210 * (1 - q) / (1 - qR)); ys.push(y); Hs.push(48 * q);
    const sr = r % 2 ? 0.25 : -0.25;
    const fill = r === 0 ? BLUE : r === 1 ? SKY : GREY;
    for (let c = 0; c < C; c++) {
      const x = r3(280 + (c - 4.5 + sr) * 52 * q);
      wells += `<ellipse cx="${x}" cy="${y}" rx="${r3(14 * q)}" ry="${r3(6 * q)}" fill="${fill}"/>`;
    }
    nip += `<line x1="280" y1="${r3(y - 48 * q)}" x2="280" y2="${r3(y - 48 * q + 14 * q)}" stroke="${NAVY}" stroke-width="${r3(1 + 1.2 * q)}"/>`;
  }
  const hz = r3(ys[R - 1] - 12);
  return `<svg class="${cls}" viewBox="0 0 560 320" role="img" aria-labelledby="${id}-t" focusable="false" xmlns="http://www.w3.org/2000/svg" data-grid="6x10" data-k="${k}"><title id="${id}-t">${title}</title>` +
    `<line x1="0" y1="${hz}" x2="560" y2="${hz}" stroke="${SKY}" stroke-width="1"/>` +
    wells +
    `<line x1="280" y1="${r3(ys[0] - Hs[0])}" x2="280" y2="${r3(ys[R - 1] - Hs[R - 1])}" stroke="${NAVY}" stroke-width="2"/>` + nip + `</svg>`;
}

/* ---------------------------------------------------------------- near row with the five КП wells */
// r = 0 of the plate formula at k = 1.8: cx = 49 + 42c, cy = 170 (own viewBox), rx 11, ry 7
const KP = [
  ['HBsAg', '4,4', NAVY, 'kp1'],
  ['анти-HBcore', '6,2', BLUE, 'kp2'],
  ['анти-ВИЧ-1/2', 'выше предела фотометра', MID, 'kp3'],
  ['анти-ВГС', '≈11', SKY, 'kp4'],
  ['анти-T. pallidum', '3,8', GREY, 'kp5'],
];
function kpRow() {
  let s = `<svg class="kprow" viewBox="0 0 560 200" role="img" aria-labelledby="kprow-t" focusable="false" xmlns="http://www.w3.org/2000/svg"><title id="kprow-t">Ближний ряд планшета: пять лунок — пять маркеров ККС-5 с коэффициентами позитивности 03.09.2026</title>`;
  const Y = 170;
  for (let c = 5; c < 11; c++) s += `<ellipse cx="${49 + 42 * c}" cy="${Y}" rx="11" ry="7" fill="${GREY}" fill-opacity=".4"/>`;
  s += `<ellipse cx="${49 + 42 * 11}" cy="${Y}" rx="10.25" ry="6.25" fill="#FFFFFF" stroke="${NAVY}" stroke-width="1.5"/>`;
  KP.forEach(([m, v, col, id], i) => {
    const cx = 49 + 42 * i, ly = 28 + 30 * i;
    s += `<a href="#${id}" class="kprow__a" data-kp="${id}" aria-label="${m}: КП ${v}"><title>${m}: КП ${v}</title>` +
      `<line x1="${cx}" y1="${ly + 6}" x2="${cx}" y2="${Y - 8}" stroke="${NAVY}" stroke-width="1" stroke-opacity=".5"/>` +
      `<ellipse class="kprow__w" cx="${cx}" cy="${Y}" rx="11" ry="7" fill="${col}" stroke="${NAVY}" stroke-opacity=".45" stroke-width="1"/>` +
      `<text x="${cx + 8}" y="${ly}" font-family="IBM Plex Mono, monospace" font-size="15" fill="#14171C">${m.replace('T. pallidum', '<tspan font-style="italic">T. pallidum</tspan>')} <tspan font-weight="600">${v}</tspan></text></a>`;
  });
  return s + `</svg>`;
}

/* ---------------------------------------------------------------- chronicle: time axis 24.08.2026 → 02.11.2026 */
// x = 24 + 552·d/70, d = days since 24.08.2026 (70 days to 02.11.2026)
const D0 = Date.UTC(2026, 7, 24), SPAN = 70;
const dayOf = iso => Math.round((Date.parse(iso + 'T00:00:00Z') - D0) / 864e5);
const xOf = d => r3(24 + 552 * d / SPAN);
const EV = [ // [start, end|null, id]
  ['2026-08-27', '2026-08-31', 'ev1'], ['2026-09-01', null, 'ev2'], ['2026-09-02', '2026-09-04', 'ev3'],
  ['2026-09-04', null, 'ev4'], ['2026-10-08', null, 'ev5'], ['2026-10-16', null, 'ev6'], ['2026-10-28', '2026-10-30', 'ev7'],
];
const EVTITLES = ['Способ подготовки сырья для ККС-5', 'Первый этап гранта по ККС-5 закрыт', 'Серия ККС-5-П01 собрана и разлита',
  'Старт исследования стабильности ККС-5', '155 наборов для трёх отделений реанимации', 'План исследования для характеризации ККС-5 в ИХЛА', 'Введена автоматическая станция ИФА'];
function timeline() {
  let s = `<svg class="tlx__svg" viewBox="0 0 600 72" role="img" aria-labelledby="tlx-t" focusable="false" xmlns="http://www.w3.org/2000/svg"><title id="tlx-t">Хроника 2026 года на шкале времени: с 27 августа по 30 октября</title>`;
  s += `<rect x="0" y="0" width="600" height="72" fill="#FFFFFF"/>`;
  s += `<line x1="24" y1="40" x2="576" y2="40" stroke="#14171C" stroke-width="2"/>`;
  for (const m of ['2026-09-01', '2026-10-01', '2026-11-01']) s += `<line x1="${xOf(dayOf(m))}" y1="30" x2="${xOf(dayOf(m))}" y2="50" stroke="#14171C" stroke-width="1"/>`;
  for (let d = 0; d <= SPAN; d += 7) s += `<line x1="${xOf(d)}" y1="40" x2="${xOf(d)}" y2="46" stroke="#B0B2AA" stroke-width="1"/>`;
  s += `<line class="tlx__cur" x1="24" y1="8" x2="24" y2="64" stroke="${BLUE}" stroke-width="2"/>`;
  EV.forEach(([a, b, id], i) => {
    const x1 = xOf(dayOf(a)), x2 = b ? xOf(dayOf(b)) : null;
    s += `<a href="#${id}" class="tlx__m" data-i="${i}" data-d="${dayOf(a)}" aria-label="${EVTITLES[i]}"><title>${EVTITLES[i]}</title>`;
    if (x2) s += `<rect x="${x1}" y="36" width="${r3(x2 - x1)}" height="8" fill="${NAVY}" fill-opacity=".35"/>`;
    s += `<circle cx="${x1}" cy="40" r="6" fill="${NAVY}" stroke="#FFFFFF" stroke-width="1.5"/></a>`;
  });
  return s + `</svg>`;
}
const pct = d => r3(100 * (24 + 552 * d / SPAN) / 600);

/* ---------------------------------------------------------------- unit marks: one 10 × 10 square per unit, pitch 14 */
function marks(n) {
  let s = `<svg class="inv__m" viewBox="0 0 ${14 * n - 4} 10" width="${14 * n - 4}" height="10" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">`;
  for (let i = 0; i < n; i++) s += `<rect x="${14 * i}" y="0" width="10" height="10" fill="${NAVY}"/>`;
  return s + `</svg>`;
}

/* ================================================================ CSS */
const CSS = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');

/* ================================================================ shared chrome */
const head = (title, desc) => `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
${CSS}
</style>
</head>
<body>`;

const NAV = [['index.html#programs', 'Программы'], ['index.html#done', 'Что сделано'], ['index.html#lab', 'Лаборатория'], ['rd.html#kks', 'ККС-5'], ['rd.html#avian', 'Вакцины для птицы'], ['index.html#partners', 'Партнёрам'], ['index.html#contacts', 'Контакты']];
const header = page => `<header class="hdr">
  <div class="wrap hdr__in">
    <a class="brand" href="index.html">
      <span class="logoslot">БМК</span>
      <span class="brand__t">БМК групп<span class="brand__s">исследования и разработки · ИНТЦ «Сириус»</span></span>
    </a>
    <nav class="nav" aria-label="Разделы">
      ${NAV.map(([h, t]) => `<a href="${h}"${h.startsWith(page) ? ' class="is-page"' : ''}>${t}</a>`).join('\n      ')}
    </nav>
    <details class="navm">
      <summary>Разделы</summary>
      <div class="navm__list">
        ${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('\n        ')}
      </div>
    </details>
  </div>
</header>`;

const footer = `<footer class="ftr">
  <div class="wrap">
    <div class="ftr__g">
      <div>
        <h4>ООО «БМК групп»</h4>
        <p>Лаборатория группы компаний. Участник проекта ИНТЦ «Сириус».</p>
        <p>ОГРН <span class="mono">1242300007586</span><br>ИНН <span class="mono">2378000096</span></p>
      </div>
      <div>
        <h4>Страницы</h4>
        <ul>
          <li><a href="index.html">Главная</a></li>
          <li><a href="rd.html#kks">ККС-5</a></li>
          <li><a href="rd.html#avian">Вакцины для птицы</a></li>
          <li><a href="index.html#partners">Партнёрам</a></li>
        </ul>
      </div>
      <div>
        <h4>Связь</h4>
        <ul>
          <li><a href="mailto:ceo@bmc-gp.com">ceo@bmc-gp.com</a></li>
          <li><a href="tel:+79086325048">+7 908 632-50-48</a></li>
          <li><a href="/privacy">Персональные данные</a></li>
        </ul>
      </div>
    </div>
    <p class="ftr__note">Подтверждающие документы предоставляются по запросу и на аудите.</p>
    <p class="ftr__btm">ООО «БМК групп» · пгт Сириус · свидетельство <span class="nw">АА № 000093</span> от 05.04.2024</p>
  </div>
</footer>`;

const ph = (code, cap, meta, cls = 'ph--wide', extra = '') => `<figure class="ph ${cls}${extra}">
          <span class="ph__code">${code}</span>
          <figcaption class="ph__t">${cap}</figcaption>
          <span class="ph__n">${meta}</span>
        </figure>`;

/* ================================================================ INDEX */
const TILES = [
  ['2', 'программы НИОКР с государственным финансированием', '#programs', '01 · Программы', ''],
  ['9', 'методик вирусологического тестирования in vitro', '#methods', '05.1 · Методики', ' data-src="#methods h3"'],
  ['155', 'наборов для трёх отделений реанимации укомплектованы и промаркированы', '#lab', '03 · Комплектация', ''],
  ['357', 'криобоксов учтены в двух низкотемпературных морозильниках', '#biobank', '04 · Биобанк', ''],
  ['29 СОП', 'второго уровня и 81 форма в системе качества; у лабораторных СОП есть английская редакция', '#quality', '05 · Качество', ''],
  ['−86 °C', '4 низкотемпературных морозильника по 338 л', '#park', '06 · Оборудование', ''],
  ['ККС-5', 'проходит государственную регистрацию как медицинское изделие', 'rd.html#kks', 'ККС-5 · стадия', ''],
  ['16.11.2026 – 31.12.2028', 'НИОКТР: пероральные ДНК-вакцины для кур', 'rd.html#avian', 'Вакцины для кур · план', ''],
  ['Команда', 'роли в программах и в лаборатории: роль, степень, институт', '#team', '07 · Команда', ''],
  ['4', 'адресата: форматы работы, что сделано и как начать', '#partners', '08 · Партнёрам', ''],
];
const tiles = `<nav class="mapnav" aria-label="Карта разделов">
        <ul class="map">
          ${TILES.map(([v, t, h, k, x]) => `<li><a class="tile" href="${h}"${x}><span class="tile__v${v.length > 6 ? ' tile__v--s' : ''}">${v}</span><span class="tile__t">${t}</span><span class="tile__k">${k}</span></a></li>`).join('\n          ')}
        </ul>
      </nav>`;

const INV = [
  ['Боксы', [[2, '<span class="mono">2</span> бокса биобезопасности II класса, БМБ-II «Ламинар-С»-1,5 NEOTERIC'], [1, 'ПЦР-бокс БАВ-ПЦР-«Ламинар-С»']]],
  ['Стерилизация и вода', [[2, '<span class="mono">2</span> паровых стерилизатора класса B, STE-23-D'], [2, 'Водоподготовка: Sartorius arium mini и Millipore Direct-Q 3']]],
  ['Центрифуги', [[2, 'Центрифуги с охлаждением: Eppendorf 5424R и Eppendorf 5804R']]],
  ['Холод', [[4, '<span class="mono">4</span> низкотемпературных морозильника −86&nbsp;°C по <span class="nw">338&nbsp;л</span>, Haier DW-86L338'], [2, '<span class="mono">2</span> криохранилища Thermo CY50935-70'], [5, '<span class="mono">5</span> сосудов Дьюара']]],
  ['ИФА', [[2, 'Промыватели планшетов ППА-01 ПРОПЛАН и Mindray MW-12A'], [1, 'Планшетный фотометр Thermo Multiskan FC'], [1, 'Автоматическая станция ИФА «Лазурит», введена 28.10.2026']]],
  ['Термошейкеры', [[2, 'Термошейкеры Biosan TS-100 и TS-100C']]],
  ['Обеззараживание воздуха', [[15, '<span class="mono">15</span> UV-рециркуляторов DEZAR-KRONT']]],
];
const inventory = `<div class="inv">
        ${INV.map(([g, items]) => `<section class="inv__g"><h3 class="inv__h">${g}</h3><ul class="inv__l">${items.map(([n, t]) => `<li><span class="inv__t">${t}</span>${marks(n)}</li>`).join('')}</ul></section>`).join('\n        ')}
      </div>`;

const TEAM = [
  ['Руководитель программы ККС-5', 'кандидат биологических наук, СПбГУ', 'Ведёт программу комбинированной контрольной сыворотки для ИФА и ИХЛА.', 'kks'],
  ['Научный руководитель вакцин для птицы', 'кандидат биологических наук, микробиолог, СПбГУ', 'Научное руководство программой пероральных ДНК-вакцин для кур.', 'avian'],
  ['Руководитель этапа in vivo', 'доктор ветеринарных наук, профессор, академик РАН', 'Оценка иммунного ответа и защитной эффективности на птице.', 'avian'],
  ['Специалист по эффективности in vivo', 'кандидат ветеринарных наук', 'Эффективность на птице в программе вакцин для кур.', 'avian'],
  ['Организация доклинических исследований', 'специалист ICH GCP', 'Организация исследований in vitro и in vivo.', 'kks avian'],
  ['Инженер-исполнитель ККС-5', 'MSc, Wageningen University', 'Допуск к работе с патогенными биологическими агентами III–IV групп. Четыре рецензируемые публикации 2022–2024. В лаборатории два сертификата ICH GCP E6(R3) от 18.06.2026.', 'kks lab'],
  ['Менеджер по качеству', 'аудит клинических исследований и CSV', 'Аудит исследований и валидация компьютеризированных систем.', 'lab'],
  ['Менеджер биобанка', '', 'Коллекции и учёт низкотемпературного хранения.', 'lab'],
];
const team = `<ul class="ppl" id="ppl">
        ${TEAM.map(([r, d, t, p]) => `<li data-p="${p}"><div class="ppl__n">${r}${d ? `<span>${d}</span>` : ''}</div><div class="ppl__d">${t}</div></li>`).join('\n        ')}
      </ul>`;

const PARTNERS = [
  ['Производителям тест-систем и лабораториям', 'ККС-5: знакомство с материалом и совместная характеризация', 'Техническое знакомство с материалом. Совместная характеризация ККС-5 на наборах партнёра по согласованному плану. Требования к будущей поставке.', 'Серия ККС-5-П01, 30 флаконов × 5 мл, измерена по ИФА 03.09.2026.', 'p1'],
  ['Птицеводческим компаниям и ветеринарным институтам', 'Вакцины для кур: требования к продукту и целевой профиль', 'Требования к продукту и схеме применения через систему поения. Участие в постановке целевого профиля. Условия будущих испытаний на птице — после лабораторной проверки доставки.', 'Программа — победитель конкурса ИНТЦ «Сириус»; НИОКТР <span class="nw">16.11.2026</span> – <span class="nw">31.12.2028</span>.', 'p2'],
  ['CRO и научным лабораториям', 'Работы по протоколу заказчика, хранение, наборы', 'Девять методик вирусологического тестирования in vitro по протоколу заказчика. Хранение −86&nbsp;°C. Биоматериал коллекций по соглашению. Комплектация и маркировка наборов для многоцентровых исследований.', '155 наборов для трёх отделений реанимации укомплектованы и промаркированы.', 'p3'],
  ['Фондам и госпрограммам', 'Соисполнение НИОКР и совместные заявки', 'Соисполнение НИОКР по грантам и субсидиям: лабораторная часть, отчётность по этапам. Совместные заявки с фондом, госпрограммой или научным партнёром.', 'Первый этап гранта закрыт отчётом о НИР 01.09.2026.', 'p4'],
];
const partners = `<div class="who" id="who" hidden>
        <span class="who__k">Кому</span>
        ${PARTNERS.map(([k, , , , id]) => `<button type="button" class="who__b" data-who="${id}" aria-pressed="false">${k}</button>`).join('\n        ')}
      </div>
      <div class="cards cards--2" id="pcards">
        ${PARTNERS.map(([k, h, p, d, id]) => `<article class="card" id="${id}">
          <p class="card__k">${k}</p>
          <h3>${h}</h3>
          <p>${p}</p>
          <p class="card__done"><b>Сделано</b>${d}</p>
        </article>`).join('\n        ')}
      </div>`;

const INDEX = head('Две программы НИОКР и лаборатория — ООО «БМК групп»', 'ООО «БМК групп», участник проекта ИНТЦ «Сириус». Две программы НИОКР с государственным финансированием: ККС-5 для ИФА и ИХЛА, пероральные ДНК-вакцины для кур. Лаборатория группы компаний: ИФА, ПЦР, коллекции биоматериала, комплектация наборов.') + `
${header('index.html')}

<main id="top">
  <section class="hero">
    <div class="wrap">
      <p class="eyebrow">ООО «БМК групп» · пгт Сириус · свидетельство <span class="nw">АА № 000093</span> от 05.04.2024</p>
      <h1>Две программы НИОКР с государственным финансированием — и&nbsp;лаборатория, которая их выполняет</h1>
      <p class="hero__lead">Лаборатория группы компаний выполняет работы по протоколу заказчика: ИФА, ПЦР, культуры клеток и вирусологическое тестирование in vitro. Рядом — коллекции биоматериала, комплектация наборов для многоцентровых исследований и две программы с государственным финансированием.</p>
      ${tiles}
    </div>
  </section>

  <section class="sec" id="programs">
    <div class="wrap">
      <header class="sh">
        <span class="sh__n">01</span>
        <h2 class="sh__t">Две программы</h2>
      </header>
      <p class="lead">Контрольная сыворотка для ИФА и ИХЛА и пероральные ДНК-вакцины для кур. Обе программы ведёт лаборатория группы компаний.</p>
      <div class="cards cards--2">
        <article class="card kks5-card">
          <p class="card__k">ИФА и ИХЛА</p>
          ${plate({ id: 'kks5-motif-1', cls: 'motif', title: 'Планшет ИФА, 8 × 12 лунок, в перспективе' })}
          <p class="motif__cap">Планшет ИФА, 8 × 12 лунок</p>
          <h3>ККС-5 — пять маркеров в одном флаконе</h3>
          <p>Серия ККС-5-П01 собрана 2–4 сентября 2026 года. Розлито 30 флаконов по 5 мл, объём серии <span class="nw">168,7 мл</span>. 3 сентября 2026 года по ИФА четыре маркера дали коэффициент позитивности не ниже договорного порога 3. По анти-ВИЧ-1/2 сигнал выше верхнего предела измерения фотометра.</p>
          <p>Грант Фонда содействия инновациям — 5&nbsp;000&nbsp;000&nbsp;₽. Договор <span class="mono">№ 2ГС1МедС26/106630</span> от 7 октября 2025 года, программа «Старт», конкурс «Старт-Медизделия-1». Получатель и исполнитель по договору — ООО «БМК групп».</p>
          <p class="card__more"><a href="rd.html#kks">Измерения, схема применения и ход работ</a></p>
        </article>
        <article class="card">
          <p class="card__k">Птица</p>
          ${flock({ id: 'flock-1', cls: 'motif', title: 'Птичник в перспективе: ряды поголовья и линия поения' })}
          <p class="motif__cap">Ряды поголовья и линия поения</p>
          <h3>Пероральные ДНК-вакцины для кур</h3>
          <p>Идея: вакцинировать птицу не инъекцией каждой особи, а с водой или кормом. Живой носитель доставляет ДНК-конструкцию в клетки кишечника. Первая очередь — болезнь Ньюкасла, болезнь Гамборо и инфекционный бронхит кур.</p>
          <p>Субсидия ИНТЦ «Сириус» — 15&nbsp;000&nbsp;000&nbsp;₽ и 3&nbsp;000&nbsp;000&nbsp;₽ собственных средств на 2026–2028. График субсидии: 1&nbsp;млн&nbsp;₽, 7&nbsp;млн&nbsp;₽ и 7&nbsp;млн&nbsp;₽. Конкурс <span class="mono"><span class="nw">26-803-05360-1-0164</span></span>.</p>
          <p class="card__more"><a href="rd.html#avian">План вакцин для кур</a></p>
        </article>
      </div>
    </div>
  </section>

  <section class="sec sec--tint" id="done">
    <div class="wrap">
      <header class="sh">
        <span class="sh__n">02</span>
        <h2 class="sh__t">Что сделано в 2026 году</h2>
      </header>
      <div class="tlx">
        ${timeline()}
        <div class="tlx__labs" aria-hidden="true">
          <span class="tlx__lab" style="left:${pct(0)}%">август</span>
          <span class="tlx__lab" style="left:${pct(dayOf('2026-09-01'))}%">сентябрь</span>
          <span class="tlx__lab" style="left:${pct(dayOf('2026-10-01'))}%">октябрь</span>
          <span class="tlx__lab" style="left:${pct(dayOf('2026-11-01'))}%">ноябрь</span>
        </div>
        <div class="tlx__ctl" id="tlx-ctl" hidden>
          <label class="tlx__k" for="tlx-range">Шкала</label>
          <input type="range" id="tlx-range" min="0" max="${SPAN}" value="3" step="1">
          <output class="tlx__out" for="tlx-range" id="tlx-out"></output>
        </div>
      </div>
      <ol class="tl" id="tl">
        <li id="ev1"><span class="tl__d">27–31.08.2026</span><span class="tl__t"><b>Способ подготовки сырья для ККС-5.</b> Производственный режим избирательного подавления избыточного компонента гипериммунной сыворотки зафиксирован 27.08.2026 и подтверждён титрованием 31.08.2026: анти-HBcore сохраняется в титре не ниже <span class="nw">1:128</span>. Заявка на изобретение подана в Роспатент.</span></li>
        <li id="ev2"><span class="tl__d">01.09.2026</span><span class="tl__t"><b>Первый этап гранта по ККС-5 закрыт.</b> Отчёт о НИР по <span class="nw">ГОСТ 7.32-2017</span>, <span class="nw">рег. № 1/26</span>, подписан.</span></li>
        <li id="ev3"><span class="tl__d">2–4.09.2026</span><span class="tl__t"><b>Серия ККС-5-П01 собрана и разлита:</b> 30 флаконов × 5 мл, объём серии <span class="nw">168,7 мл</span>. 03.09.2026 измерены коэффициенты позитивности по пяти маркерам: по четырём — не ниже договорного порога 3, по анти-ВИЧ-1/2 сигнал выше верхнего предела измерения фотометра.</span></li>
        <li id="ev4"><span class="tl__d">04.09.2026</span><span class="tl__t"><b>Старт исследования стабильности ККС-5:</b> ускоренное старение целыми флаконами 5 мл при +45 и +37&nbsp;°C и реальное время при <span class="nw">+2…+8&nbsp;°C</span>.</span></li>
        <li id="ev5"><span class="tl__d">к 08.10.2026</span><span class="tl__t"><b>155 наборов для трёх отделений реанимации</b> международного многоцентрового исследования укомплектованы, промаркированы и готовы к отправке: 130 наборов для крови и 25 для плазмы, по 8 цветокодированных криобоксов на каждый центр, формы передачи по каждому центру.</span></li>
        <li id="ev6"><span class="tl__d">16.10.2026</span><span class="tl__t"><b>План исследования для характеризации ККС-5 в ИХЛА</b> — редакция 3 от 16.10.2026: внешняя площадка, слепое исполнение, de novo.</span></li>
        <li id="ev7"><span class="tl__d">28–30.10.2026</span><span class="tl__t"><b>Введена автоматическая станция ИФА</b> (28.10.2026); 30.10.2026 на ней за один день изохронно поставлены все точки исследования стабильности ККС-5.</span></li>
      </ol>
    </div>
  </section>

  <section class="sec" id="lab">
    <div class="wrap">
      <header class="sh">
        <span class="sh__n">03</span>
        <h2 class="sh__t">Комплектация и прослеживаемость</h2>
      </header>
      <p class="lead">Для международного многоцентрового исследования собраны и промаркированы 155 наборов для трёх отделений реанимации: 130 наборов для крови и 25 для плазмы. По всем трём центрам наборы готовы к отправке.</p>
      <ul class="spec">
        <li>8 цветокодированных криобоксов на каждый центр</li>
        <li>27 этикеток на набор для крови и 52 на набор для плазмы</li>
        <li>2&nbsp;400 этикеток криопробирок</li>
        <li>Код криопробирки определяется номером набора</li>
        <li>DataMatrix и линейный штрихкод; код криопробирки определяется номером набора</li>
        <li>Формы передачи заполнены по каждому центру</li>
        <li>Хранение <span class="nw">−70…−86&nbsp;°C</span></li>
        <li>Аллокатор номеров сверяет реестры перед выдачей номера</li>
      </ul>
      <div class="phrow phrow--2">
        ${ph('B1', 'Криовиалы в штативе', 'Кадр B1 · крупный план')}
        ${ph('B9', 'Стойка хранения с мониторингом температуры', 'Кадр B9 · система хранения')}
      </div>
    </div>
  </section>

  <section class="sec sec--tint" id="biobank">
    <div class="wrap">
      <header class="sh">
        <span class="sh__n">04</span>
        <h2 class="sh__t">Коллекции биобанка</h2>
      </header>
      <p class="lead">357 криобоксов в двух низкотемпературных морозильниках учтены пофотографно и сверены со справочным списком.</p>
      <div class="sub">
        <span class="sub__n">04.1</span>
        <h3>Состав коллекций</h3>
      </div>
      <ul class="spec">
        <li>Плазма и моча при черепно-мозговой травме</li>
        <li>Кровь условно здоровых доноров</li>
        <li>Свежие биопсии кожи при миодистрофии Дюшенна</li>
        <li>Ликвор здоровых доноров</li>
        <li>Охарактеризованный опухолевый блок лёгкого, PD-L1-положительный</li>
        <li>Панель сывороток с антителами к ВИЧ, ВГВ, ВГС и возбудителю сифилиса — поставлена по договору</li>
      </ul>
      <p class="note mt-3">Протоколы работы с ликвором, плазмой и сывороткой подготовлены. Материал коллекций для внешнего исследования передаём по соглашению — порядок в разделе «Партнёрам».</p>
      <p class="note">Проект биобанка клеточных культур поддержан Агентством стратегических инициатив на форуме V «Сильные идеи для нового времени», номинация «Национальная предпринимательская инициатива».</p>
      ${ph('A1', 'Криохранилище', 'Кадр A1 · общий план', 'ph--wide', ' mt-3')}
    </div>
  </section>

  <section class="sec" id="quality">
    <div class="wrap">
      <header class="sh">
        <span class="sh__n">05</span>
        <h2 class="sh__t">Система качества и методики</h2>
      </header>
      <p class="lead">Лаборатория работает по системе СОП группы компаний: 29 СОП второго уровня и 81 форма. У лабораторных СОП есть английская редакция.</p>
      <p class="note">СОПы покрывают цепь сохранности образца, валидацию методов, расследование результатов вне спецификации, LIMS, передачу данных спонсору, внутрилабораторный контроль, постановку ИФА, подготовку наборов и обращение с отходами класса Б. Несоответствия регистрируются и расследуются по СОП.</p>
      <div class="sub" id="methods">
        <span class="sub__n">05.1</span>
        <h3>Девять методик вирусологического тестирования in vitro</h3>
      </div>
      <div class="tbl" role="table">
        <div class="tbl__h" role="row">
          <span>Методика</span>
          <span>Что определяет</span>
          <span>Нормативная привязка</span>
        </div>
        ${[
          ['Заражение индикаторных культур с учётом цитопатического действия', 'посторонние вирусные агенты в клеточных культурах', 'ОФС.1.7.2.0006.15; ЕЭК № 89'],
          ['Гемадсорбция', 'гемадсорбирующие вирусы на монослое', ''],
          ['Гемагглютинация', 'гемагглютинирующие вирусы в культуральной жидкости', ''],
          ['Гистохимическое окрашивание монослоёв', 'морфология и включения в клетках', 'WOAH 1.1.9'],
          ['ИФА антигенов', 'вирусные антигены', 'ОФС.1.7.2.0006.15; МУК 4.2.2029-05'],
          ['Реакция связывания комплемента (Cofal)', 'группоспецифический антиген лейкозно-саркомного комплекса птиц', ''],
          ['ПЦР и ОТ-ПЦР', 'нуклеиновые кислоты вирусов', 'ОФС.1.7.2.0006.15; ЕЭК № 89; WOAH 1.1.9'],
          ['Активность обратной транскриптазы (PERT)', 'ретровирусы, в том числе эндогенные, в банках клеток', 'ЕЭК № 89, гл. 2'],
          ['Изотермическая амплификация (LAMP)', 'нуклеиновые кислоты вирусов без термоциклера', ''],
        ].map(([a, b, c]) => `<div class="tbl__r" role="row">
          <div class="tbl__c1" data-l="Методика" role="cell">${a}</div>
          <div class="tbl__c2" data-l="Что определяет" role="cell">${b}</div>${c ? `
          <div class="tbl__c3" data-l="Нормативная привязка" role="cell"><span class="mono">${c}</span></div>` : ''}
        </div>`).join('\n        ')}
      </div>
      <p class="note mt-3">ИФА автоматизирована: станция введена 28 октября 2026 года.</p>
      ${ph('B2', 'Клеточные культуры', 'Кадр B2', 'ph--wide', ' mt-3')}
    </div>
  </section>

  <section class="sec sec--tint" id="park">
    <div class="wrap">
      <header class="sh">
        <span class="sh__n">06</span>
        <h2 class="sh__t">Оборудование</h2>
      </header>
      <p class="lead">Парк лаборатории группы компаний.</p>
      ${inventory}
      <div class="phrow phrow--2">
        ${ph('C3', 'Молекулярно-биологический стол', 'Кадр C3')}
        ${ph('B8', 'Лабораторный прибор', 'Кадр B8')}
      </div>
    </div>
  </section>

  <section class="sec" id="team">
    <div class="wrap">
      <header class="sh">
        <span class="sh__n">07</span>
        <h2 class="sh__t">Команда</h2>
      </header>
      <p class="lead">Роли в программах и в лаборатории.</p>
      <div class="filt" id="filt" hidden>
        <span class="filt__k">Показать</span>
        <button type="button" class="filt__b" data-f="all" aria-pressed="true">Все роли</button>
        <button type="button" class="filt__b" data-f="kks" aria-pressed="false">ККС-5</button>
        <button type="button" class="filt__b" data-f="avian" aria-pressed="false">Вакцины для кур</button>
        <button type="button" class="filt__b" data-f="lab" aria-pressed="false">Лаборатория</button>
      </div>
      ${team}
      ${ph('D1', 'Сотрудник за лабораторной работой', 'Кадр D1', 'ph--tall ph--cap', ' mt-3')}
    </div>
  </section>

  <section class="sec sec--deep" id="partners">
    <div class="wrap">
      <header class="sh">
        <span class="sh__n">08</span>
        <h2 class="sh__t">Партнёрам и фондам</h2>
      </header>
      <p class="lead">Четыре адресата, у каждого — форматы работы и то, что по ним уже сделано.</p>
      ${partners}
      <div class="sub" id="start">
        <span class="sub__n">08.1</span>
        <h3>Как начать</h3>
      </div>
      <div class="steps">
        <div class="step">
          <p class="step__h"><span class="step__n">1</span><span class="step__k">Письмо</span></p>
          <p>Пришлите задачу, матрицу, объём и сроки на <a href="mailto:ceo@bmc-gp.com">ceo@bmc-gp.com</a>.</p>
        </div>
        <div class="step">
          <p class="step__h"><span class="step__n">2</span><span class="step__k">NDA</span></p>
          <p>Соглашение о конфиденциальности подписываем по запросу.</p>
        </div>
        <div class="step">
          <p class="step__h"><span class="step__n">3</span><span class="step__k">План</span></p>
          <p>Согласуем объём работ и сроки под ваш протокол.</p>
        </div>
        <div class="step">
          <p class="step__h"><span class="step__n">4</span><span class="step__k">Договор</span></p>
          <p>Фиксируем работу договором и приступаем.</p>
        </div>
      </div>
      <p class="mt-4">Почта <a href="mailto:ceo@bmc-gp.com">ceo@bmc-gp.com</a>, телефон <a href="tel:+79086325048">+7&nbsp;908&nbsp;632-50-48</a>.</p>
      <form class="form" action="mailto:ceo@bmc-gp.com" method="post" enctype="text/plain">
        <div>
          <label for="org">Организация</label>
          <input id="org" name="Организация" type="text" autocomplete="organization">
        </div>
        <div>
          <label for="who-f">Контакт</label>
          <input id="who-f" name="Контакт" type="text" autocomplete="name">
        </div>
        <div class="form__wide">
          <label for="task">Задача</label>
          <textarea id="task" name="Задача"></textarea>
        </div>
        <div>
          <label for="matrix">Матрица</label>
          <input id="matrix" name="Матрица" type="text">
        </div>
        <div>
          <label for="volume">Объём</label>
          <input id="volume" name="Объём" type="text">
        </div>
        <div class="form__wide">
          <label for="when">Сроки</label>
          <input id="when" name="Сроки" type="text">
        </div>
        <div class="form__wide">
          <button class="btn" type="submit">Отправить запрос</button>
        </div>
      </form>
    </div>
  </section>

  <section class="sec" id="contacts">
    <div class="wrap">
      <header class="sh">
        <span class="sh__n">09</span>
        <h2 class="sh__t">Контакты и реквизиты</h2>
      </header>
      <div class="cont">
        <dl class="dl">
          <dt>Полное наименование</dt>
          <dd>Общество с ограниченной ответственностью «БМК групп»</dd>
          <dt>Сокращённое наименование</dt>
          <dd>ООО «БМК групп»</dd>
          <dt>ОГРН</dt>
          <dd class="mono">1242300007586</dd>
          <dt>ИНН</dt>
          <dd class="mono">2378000096</dd>
          <dt>КПП</dt>
          <dd class="mono">237801001</dd>
          <dt>Адрес</dt>
          <dd>354340, Краснодарский край, пгт Сириус, Триумфальный пр-д, д.&nbsp;1, помещ.&nbsp;№&nbsp;2-036, раб.&nbsp;место&nbsp;2-036/45</dd>
        </dl>
        <dl class="dl">
          <dt>Почта</dt>
          <dd><a href="mailto:ceo@bmc-gp.com">ceo@bmc-gp.com</a></dd>
          <dt>Телефон</dt>
          <dd><a href="tel:+79086325048">+7&nbsp;908&nbsp;632-50-48</a></dd>
          <dt>ИНТЦ «Сириус»</dt>
          <dd>Участник проекта. Свидетельство <span class="nw">АА №&nbsp;000093</span> от 05.04.2024</dd>
          <dt>Персональные данные</dt>
          <dd><a href="/privacy">Порядок обработки персональных данных</a></dd>
        </dl>
      </div>
      ${ph('E1', 'Вход и вывеска площадки', 'Кадр E1', 'ph--wide', ' mt-4')}
    </div>
  </section>
</main>

${footer}
<script>
${fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8')}
</script>
</body>
</html>
`;

/* ================================================================ RD */
const SCHEME = [
  ['1 · ККС-5', '5 мл, пять маркеров', true], ['2 · Внесение', 'вместе с образцами', false], ['3 · Инкубация', 'контроль на планшете', false],
  ['4 · Промывка', 'шаг постановки', false], ['5 · Фотометр', 'чтение ОП', false], ['6 · КП, порог ≥ 3', 'порог договора ≥ 3', true],
];
const scheme = `<svg class="scheme__svg" viewBox="0 0 280 540" role="img" aria-labelledby="scheme-title">
            <title id="scheme-title">ККС-5 в цикле измерения ИФА</title>
            <desc>Порядок цикла ИФА: флакон, внесение вместе с образцами, инкубация, промывка, чтение оптической плотности, коэффициент позитивности.</desc>
            <defs>
              <marker id="arr" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M0 0 L8 4 L0 8 Z" fill="#14171C"/>
              </marker>
            </defs>
            ${SCHEME.map(([a, b, edge], i) => { const y = 8 + 92 * i; return `<g class="st" id="st${i + 1}">
              <rect x="8" y="${y}" width="264" height="64" fill="#FFFFFF" stroke="#14171C"/>${edge ? `
              <rect class="st__e" x="8" y="${y}" width="4" height="64" fill="${BLUE}"/>` : `
              <rect class="st__e" x="8" y="${y}" width="4" height="64" fill="${BLUE}" fill-opacity="0"/>`}
              <text x="24" y="${y + 26}" fill="#14171C" font-family="${i === 5 ? 'IBM Plex Mono, monospace' : 'IBM Plex Sans, sans-serif'}" font-size="15" font-weight="600">${a}</text>
              <text x="24" y="${y + 46}" fill="#454B55" font-family="IBM Plex Sans, sans-serif" font-size="15">${b}</text>
            </g>${i < 5 ? `
            <line x1="28" y1="${y + 64}" x2="28" y2="${y + 88}" stroke="#14171C" stroke-width="1.5" marker-end="url(#arr)"/>` : ''}`; }).join('\n            ')}
          </svg>`;

const RD = head('ККС-5 и вакцины для кур — ООО «БМК групп»', 'ККС-5 — жидкая комбинированная контрольная сыворотка для ИФА и ИХЛА. Пероральные ДНК-вакцины для кур: болезнь Ньюкасла, болезнь Гамборо, инфекционный бронхит.') + `
${header('rd.html')}

<main id="top">
  <section class="hero">
    <div class="wrap">
      <p class="eyebrow">ООО «БМК групп» · две программы с государственным финансированием</p>
      <h1>ККС-5 и вакцины для кур</h1>
      <p class="hero__lead">Контрольная сыворотка для ИФА и ИХЛА — с собранной серией и измеренными коэффициентами позитивности. Пероральные ДНК-вакцины для кур — с планом НИОКТР, датами и субсидией.</p>
      <p class="hero__jump"><a href="#kks">01 · ККС-5</a> · <a href="#avian">02 · Вакцины для кур</a> · <a href="#start">03 · Как начать</a></p>
    </div>
  </section>

  <section class="sec kks5" id="kks">
    <div class="wrap">
      <div class="kks5__hero">
        <div class="kks5__intro">
          <header class="sh">
            <span class="sh__n">01</span>
            <h2 class="sh__t">Контрольная сыворотка ККС-5</h2>
          </header>
          <p class="lead">Жидкая комбинированная контрольная сыворотка для ИФА и ИХЛА: пять маркеров в одной матрице. HBsAg, анти-HBcore, анти-ВИЧ-1/2, анти-ВГС и анти-<i>T.&nbsp;pallidum</i>. В постановку материал вносят готовой жидкостью из флакона.</p>
        </div>
        <figure class="kks5__fig">
          ${plate({ id: 'kks5-plate', cls: 'kks5__plate', title: 'Планшет ИФА, 8 × 12 лунок, в перспективе', scroll: true })}
          <figcaption class="motif__cap">Планшет ИФА, 8 × 12 лунок</figcaption>
        </figure>
      </div>
      <ul class="spec">
        <li>Договорной порог: коэффициент позитивности не ниже 3 по каждому маркеру</li>
        <li>Разброс оптической плотности между флаконами — не больше 10&nbsp;% от среднего по серии</li>
        <li>Хранение <span class="nw">+2…+8&nbsp;°C</span></li>
        <li>Форма выпуска: флакон 5&nbsp;мл</li>
      </ul>
      <p class="note mt-3">Ориентир формы выпуска — импортный контроль Bio-Rad Virotrol: готовая жидкость во флаконе.</p>

      <div class="sub">
        <span class="sub__n">01.1</span>
        <h3>Место в постановке ИФА</h3>
      </div>
      <figure class="dgm">
        <div class="dgm__h">
          <span class="dgm__k">Схема</span>
          <h4>ККС-5 в цикле измерения</h4>
        </div>
        <div class="scheme">
          <div class="scheme__fig">
            ${scheme}
            <div class="stp" id="stp" hidden>
              <button type="button" class="stp__b" id="stp-prev">Назад</button>
              <output class="stp__o" id="stp-out" aria-live="polite"></output>
              <button type="button" class="stp__b" id="stp-next">Далее</button>
            </div>
          </div>
          <figcaption class="dgm__out">
            <p>Показан порядок цикла ИФА и место в нём ККС-5. Контроль вносят в ту же постановку, что и исследуемые образцы. После инкубации, промывки и чтения оптической плотности коэффициент позитивности считают по отношению оптической плотности контроля к критической (для конкурентного формата анти-HBcore — обратное отношение). Один флакон закрывает пять маркеров: HBsAg, анти-HBcore, анти-ВИЧ-1/2, анти-ВГС и анти-<i>T. pallidum</i>. Договорной порог — не ниже 3.</p>
          </figcaption>
        </div>
      </figure>

      <div class="sub">
        <span class="sub__n">01.2</span>
        <h3>Что сделано</h3>
      </div>
      <p class="note">Гипериммунная сыворотка содержала избыток HBsAg. Избирательное подавление этого компонента сохранило анти-HBcore в титре не ниже <span class="nw">1:128</span>. Производственный режим зафиксирован 27 августа 2026 года и подтверждён титрованием 31 августа 2026 года. Заявка на изобретение подана в Роспатент.</p>
      <ul class="flist">
        <li><span class="mono">27.08.2026</span><span>Зафиксирован производственный режим подавления избыточного HBsAg</span></li>
        <li><span class="mono">31.08.2026</span><span>Титрование подтвердило режим: анти-HBcore не ниже <span class="nw">1:128</span></span></li>
        <li><span class="mono">01.09.2026</span><span>Закрыт первый этап — характеризация сырья. Отчёт о НИР по <span class="nw">ГОСТ 7.32-2017</span>, <span class="nw">рег. № 1/26</span></span></li>
        <li><span class="mono">02–04.09.2026</span><span>Собрана серия ККС-5-П01. Розлито 30 флаконов по 5 мл, объём серии <span class="nw">168,7 мл</span></span></li>
        <li><span class="mono">03.09.2026</span><span>Измерены коэффициенты позитивности по ИФА</span></li>
        <li><span class="mono">04.09.2026</span><span>Стартовало исследование стабильности целыми флаконами по 5 мл</span></li>
      </ul>

      <figure class="kpfig mt-4">
        ${kpRow()}
        <figcaption class="motif__cap">Пять маркеров — пять лунок ближнего ряда; белая лунка — отрицательный контроль</figcaption>
      </figure>
      <div class="tbl tbl--kp" role="table" id="kptbl">
        <div class="tbl__h" role="row">
          <span>Маркер</span>
          <span>Постановка 03.09.2026</span>
          <span>КП</span>
        </div>
        ${[
          ['kp1', NAVY, 'HBsAg', 'n = 3 · ОП 0,498 · ОПкрит 0,114 · 450/620 нм', '4,4'],
          ['kp2', BLUE, 'анти-HBcore', 'n = 4 · конкурентный формат', '6,2'],
          ['kp3', MID, 'анти-ВИЧ-1/2', 'n = 4 · сигнал выше верхнего предела измерения фотометра', 'выше предела фотометра'],
          ['kp4', SKY, 'анти-ВГС', 'n = 4', '≈11'],
          ['kp5', GREY, 'анти-<i>T. pallidum</i>', 'n = 4', '3,8'],
        ].map(([id, col, m, s, v]) => `<div class="tbl__r" role="row" id="${id}">
          <div class="tbl__c1" data-l="Маркер" role="cell"><svg class="well" viewBox="0 0 16 11" width="16" height="11" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><ellipse cx="8" cy="5.5" rx="7" ry="4.5" fill="${col}" stroke="${NAVY}" stroke-opacity=".45" stroke-width="1"/></svg>${m}</div>
          <div class="tbl__c2" data-l="Постановка" role="cell">${s}</div>
          <div data-l="КП" role="cell"><span class="kp">${v}</span></div>
        </div>`).join('\n        ')}
      </div>
      <p class="note mt-3">По HBsAg, анти-HBcore, анти-ВГС и анти-<i>T. pallidum</i> измеренный КП не ниже договорного порога 3. По анти-ВИЧ-1/2 сигнал выше верхнего предела измерения фотометра.</p>
      <p class="note">Измерение 03.09.2026 на коммерческих наборах ИФА одного производителя; анти-HBcore — в конкурентном формате; контроли наборов в каждой постановке в норме.</p>

      <div class="sub">
        <span class="sub__n">01.3</span>
        <h3>Стабильность и ИХЛА</h3>
      </div>
      <p class="note">Исследование стабильности идёт на целых флаконах по 5 мл: плечи +45&nbsp;°C и +37&nbsp;°C плюс реальное время при <span class="nw">+2…+8&nbsp;°C</span>, старт 4 сентября 2026 года. Изохронная постановка всех точек выполнена 30 октября 2026 года на автоматической станции ИФА. Станция введена 28 октября 2026 года.</p>
      <p class="note">Второй этап — характеризация в ИХЛА на внешней площадке по плану исследования v3 от 16 октября 2026 года, слепая, de novo.</p>
      ${ph('B5', 'Планшет в ридере', 'Кадр B5', 'ph--wide', ' mt-3')}

      <div class="sub">
        <span class="sub__n">01.4</span>
        <h3>Стадия</h3>
      </div>
      <p class="lead kks5__stage">ККС-5 проходит государственную регистрацию как медицинское изделие.</p>

      <div class="sub">
        <span class="sub__n">01.5</span>
        <h3>Финансирование</h3>
      </div>
      <p class="note">Грант Фонда содействия инновациям — 5&nbsp;000&nbsp;000&nbsp;₽, вся сумма отнесена к 2025 году. Договор <span class="mono">№ 2ГС1МедС26/106630</span> от 7 октября 2025 года. Программа «Старт», конкурс «Старт-Медизделия-1». Получатель и исполнитель НИОКР по договору — ООО «БМК групп». Договор относится к федеральному проекту «Развитие производства наиболее востребованных лекарственных препаратов и медицинских изделий».</p>
      <p class="mt-3"><a href="index.html#partners">Обсудить характеризацию на наборах партнёра</a></p>
    </div>
  </section>

  <section class="sec sec--tint" id="avian">
    <div class="wrap">
      <div class="kks5__hero av__hero">
        <div class="kks5__intro">
          <header class="sh">
            <span class="sh__n">02</span>
            <h2 class="sh__t">Пероральные ДНК-вакцины для кур</h2>
          </header>
          <p class="lead">Вакцинировать птицу не инъекцией каждой особи, а с водой или кормом: живой носитель доставляет ДНК-конструкцию в клетки кишечника.</p>
        </div>
        <figure class="kks5__fig">
          ${flock({ id: 'flock-2', cls: 'kks5__plate', title: 'Птичник в перспективе: ряды поголовья и линия поения' })}
          <figcaption class="motif__cap">Ряды поголовья и линия поения</figcaption>
        </figure>
      </div>

      <div class="sub">
        <span class="sub__n">02.1</span>
        <h3>Идея</h3>
      </div>
      <p class="note">Биологическое сдерживание носителя заложено в конструкцию.</p>

      <div class="sub">
        <span class="sub__n">02.2</span>
        <h3>Инфекции первой очереди</h3>
      </div>
      <ul class="spec">
        <li><b>Болезнь Ньюкасла</b> — острая вирусная болезнь кур с поражением дыхательной, пищеварительной и нервной систем</li>
        <li><b>Болезнь Гамборо</b> — инфекционная бурсальная болезнь, вирусное поражение иммунной системы молодняка кур</li>
        <li><b>Инфекционный бронхит кур</b> — вирусная болезнь дыхательных путей и репродуктивного тракта кур</li>
      </ul>

      <div class="sub">
        <span class="sub__n">02.3</span>
        <h3>Научный задел</h3>
      </div>
      <ul class="spec">
        <li>Опыт рекомбинационной инженерии бактериальных штаммов</li>
        <li>Собственная система поддержания экспрессии без антибиотиков</li>
        <li>Опыт разработки наборов ИФА</li>
      </ul>

      <div class="sub">
        <span class="sub__n">02.4</span>
        <h3>Целевой профиль, план</h3>
      </div>
      <ul class="spec">
        <li>Лиофилизат для выпаивания</li>
        <li>Срок годности не менее 12 месяцев при <span class="nw">+2…+8&nbsp;°C</span></li>
        <li>Растворение за 5–10 минут</li>
      </ul>

      <div class="sub">
        <span class="sub__n">02.5</span>
        <h3>План работ и стадия</h3>
      </div>
      <p class="lead">Стадия программы пероральных ДНК-вакцин для кур — НИОКТР с 16 ноября 2026 года по 31 декабря 2028 года.</p>
      <div class="steps">
        <div class="step">
          <p class="step__w">лаборатория</p>
          <p class="step__h"><span class="step__n">1</span><span class="step__k">Конструкции</span></p>
          <p>Сборка ДНК-конструкций под три целевые инфекции кур.</p>
        </div>
        <div class="step">
          <p class="step__w">лаборатория</p>
          <p class="step__h"><span class="step__n">2</span><span class="step__k">Доставка</span></p>
          <p>Лабораторная проверка доставки ДНК-конструкции в клетки птицы in vitro.</p>
        </div>
        <div class="step">
          <p class="step__w">птица</p>
          <p class="step__h"><span class="step__n">3</span><span class="step__k">Иммунный ответ</span></p>
          <p>Оценка иммунного ответа на птице. Этап in vivo ведёт доктор ветеринарных наук, профессор, академик РАН.</p>
        </div>
        <div class="step">
          <p class="step__w">птица</p>
          <p class="step__h"><span class="step__n">4</span><span class="step__k">Защита</span></p>
          <p>Оценка защитной эффективности на птице.</p>
        </div>
      </div>
      <p class="note mt-3">Локализация производства, план: технопарк «Сириус», корпус 7.</p>

      <div class="sub">
        <span class="sub__n">02.6</span>
        <h3>Финансирование</h3>
      </div>
      <p class="note">Субсидия ИНТЦ «Сириус» — 15&nbsp;000&nbsp;000&nbsp;₽ и 3&nbsp;000&nbsp;000&nbsp;₽ собственных средств, 2026–2028. График субсидии по годам: 1&nbsp;млн&nbsp;₽, 7&nbsp;млн&nbsp;₽ и 7&nbsp;млн&nbsp;₽. Конкурс <span class="mono"><span class="nw">26-803-05360-1-0164</span></span>. Государственная программа «Научно-технологическое развитие федеральной территории „Сириус“».</p>
      <p class="mt-3"><a href="index.html#partners">Обсудить требования к вакцинам для кур</a></p>
    </div>
  </section>

  <section class="sec" id="start">
    <div class="wrap">
      <header class="sh">
        <span class="sh__n">03</span>
        <h2 class="sh__t">Как начать</h2>
      </header>
      <p class="lead">Пришлите задачу, матрицу, объём и сроки. NDA подписываем по запросу.</p>
      <p><a href="mailto:ceo@bmc-gp.com">ceo@bmc-gp.com</a> · <a href="tel:+79086325048">+7&nbsp;908&nbsp;632-50-48</a></p>
      <p class="mt-2"><a href="index.html#partners">Форматы сотрудничества</a> · <a href="index.html#contacts">Реквизиты</a></p>
    </div>
  </section>
</main>

${footer}
<script>
${fs.readFileSync(path.join(__dirname, 'rd.js'), 'utf8')}
</script>
</body>
</html>
`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), INDEX);
fs.writeFileSync(path.join(OUT, 'rd.html'), RD);
console.log('index.html', INDEX.length, 'B; rd.html', RD.length, 'B');
// self-check of the plate formula against the accepted numbers (NOTES_v2_kks5_motif.md)
const chk = plateWells(1.8);
if (!/cx="49" cy="310"/.test(chk) || !/cy="60"/.test(chk) || !/rx="3.929"/.test(chk)) throw new Error('plate formula drifted');
