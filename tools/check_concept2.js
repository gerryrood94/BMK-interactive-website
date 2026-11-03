// Gate for the "what we have" concepts: the old substantive checks plus the 25-row blacklist.
// usage: node check_concept2.js <folder-with-html> [label]   — exit 1 on any BLOCKER
const fs = require('fs');
const path = require('path');
const dir = process.argv[2];
const label = process.argv[3] || path.basename(dir);
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /\.html$/i.test(f)).map(f => path.join(dir, f)) : [];
if (!files.length) { console.log(`\n### ${label}: NO HTML FILES`); process.exit(1); }
const raw = Object.fromEntries(files.map(f => [path.basename(f), fs.readFileSync(f, 'utf8')]));
const strip = h => h.replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const text = Object.fromEntries(Object.entries(raw).map(([k, h]) => [k, strip(h)]));
const all = Object.values(text).join(' ');
let blockers = 0, warnings = 0;
const say = (lvl, msg) => { if (lvl === 'BLOCK') blockers++; if (lvl === 'WARN') warnings++; console.log(`  [${lvl}] ${msg}`); };
const count = (re, body = all) => (body.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')) || []).length;
const ctx = (re) => { const m = all.match(re); return m ? all.slice(Math.max(0, m.index - 60), m.index + 100) : ''; };
console.log(`\n### ${label}  (${files.map(f => path.basename(f) + ' ' + fs.statSync(f).size + 'B').join(', ')})`);

// A. Blacklist patterns (BLOCK): confession devices and their close kin.
const BL = [
  [/не утвержда\w*/i, 'row 1/16: «не утверждаем»'],
  [/чего (у нас|мы) не/i, 'row 1: absence section'],
  [/чего у нас нет/i, 'row 1: absence section'],
  [/пробел оставлен/i, 'row 2: the empty cell'],
  [/измерено:?\s*ничего|ничего не измерен|измерений нет/i, 'row 2: "nothing measured"'],
  [/как читать (этот )?сайт|как это читать/i, 'row 3: how-to-read preamble'],
  [/под каждой цифрой|напечатано (её|его) основание|без основания/i, 'row 4: proof-apparatus headline'],
  [/решение о доверии|а не покупа/i, 'row 5: telling the reader what decision they make'],
  [/открытый вопрос|расходятся|не сходится|два (наших )?документа/i, 'row 6: unresolved internal question'],
  [/услуг (на этом сайте )?нет|не продаём|нечего купить|нельзя купить|не является продуктом|не предлагается к продаже|заявок .{0,20}не собираем|не коммерческое предложение|не является коммерческим/i, 'row 7: "nothing for sale"'],
  [/2027|2028|2029/, 'row 8: a year in the regulatory-horizon range — check it is a plan date, not a forecast'],
  [/20[–-]30\s?%/, 'row 8: the odds'],
  [/не охарактеризован|не установлен|не выполнен|не проверен|не валидирован|не назначен/i, 'row 9: negative framing of a bounded result'],
  [/арендован|система группы, а не|не наша собственная|чужо\w* (юрлиц|площадк)/i, 'row 10: confessional framing of leased park / group QMS'],
  [/по ошибке|отпечатан|кириллиц|420 /i, 'row 11/20: failure narration / process minutiae'],
  [/это не факт|прогноз, а не факт|не факт/i, 'row 12'],
  [/поставлен\w* на (налоговый )?учёт|13 февраля 2024|13\.02\.2024|два года и восемь/i, 'row 14: announcing youth'],
  [/честно[:,]|откровенно говоря|положа руку/i, 'row 15: the «честно» prefix'],
  [/не подразумеваем|не шестнадцать проблем|для людей .{0,40}не (разрабатыва|производ|планиру)|вакцин\w* для людей/i, 'row 16: arguing with an accuser who is not there'],
  [/не заявля\w*|здесь не заявляется|факт перечисления/i, 'row 17: un-asserting good news'],
  [/, а не (отчёт|вердикт|коммерческое|акт)|заявлено, а не|«заявлено»/i, 'row 18: «это X, а не Y» hedge'],
  [/имен\w* (мы )?(здесь )?не привод|фамили\w* (нет|не публику|не привод)|согласи\w* на публикацию/i, 'row 19: narrating the withholding of names'],
  [/нет микроскопа|нет ТЭМ|нет секвенатора|\bнет\s+(микроскоп|секвенатор)/i, 'row 21: negative rows in a capability list'],
  [/реестр источников|легенда статусов|основание[:\s]/i, 'row 22: evidence-grading machinery on the page'],
  [/спрашивайте|ответим документом|вопрос к организации, а не/i, 'row 23: "ask us" in place of a fact'],
  [/прототип|макет\b|макета\b|эта страница не|задача организации, а не|нарочно|намеренно/i, 'row 24: the page talking about itself'],
  [/не раньше (ноября|декабря|20)/i, 'row 8: worst-case horizon'],
  [/пройдено|аккредитован|сертифицирован\w* (по )?ISO|ISO 13485|GLP/i, 'brief §3.6: verdict word / ISO / GLP — allowed only as an owner-dated plan'],
  [/невыполним|не можем назвать|документа, который|нет документа/i, 'confession of a missing document'],
  [/первой (в России|отечественн)|первая в России|дешевле импорта|в 2[–-]3 раза|в 3[–-]4 раза/i, 'SUBSTANCE §7: "first in Russia" / price claims'],
  [/потенциально инфекцион|инактиваци\w* не|не инактивир/i, 'SUBSTANCE §7.3: biosafety confession'],
];
for (const [re, note] of BL) { const n = count(re); if (n) say(/2027|2028|2029/.test(re.source) ? 'WARN' : 'BLOCK', `${note} ×${n}: …${ctx(re).replace(/\s+/g, ' ')}…`); }

// B. Deleted claims and confidentiality (unchanged from check_concept.js).
for (const [re, note] of [[/\bTRL\b/i, 'B-lymphoma readiness'], [/B-лимфом/i, 'B-lymphoma platform'], [/многолетн\w+ опыт/i, '"many years" (company)'], [/не оказывает ни одн/i, 'exclusivity'], [/НАСБИО/i, 'НАСБИО — allowed only as the association news / a role, never membership']]) {
  const n = count(re); if (n) say(/НАСБИО/.test(re.source) ? 'WARN' : 'BLOCK', `${note} ×${n}`);
}
for (const t of ['Р-Фарм', 'Р-ФАРМ', 'Santersus', 'НуклеоКапче', 'NucleoCap', 'Алкор', 'Форум-Биотех', 'НБС-Волга', 'Нева-Био', 'НЕВА-БИО', 'Боткин', 'Коммунарка', 'Климашевич', 'Ломакин', 'Буров', 'Черкизово', 'Белгранкорм', 'Герофарм', 'Фармсинтез', 'Джинекст', 'ЭпиВакКорона', 'Конвасэл', '780126', 'abiomedica', 'Spinraza', 'Nusinersen', 'СМА', 'SMA']) {
  const n = count(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')); if (n) say('BLOCK', `confidential / third-party identifier ×${n}: "${t}"`);
}
// Forecast numbers from the bid.
for (const re of [/178[,.]6/, /60 млн/, /4[,.]8 ₽|1[,.]97 ₽/, /24 млн/]) { const n = count(re); if (n) say('BLOCK', `bid forecast number on page: ${re.source}`); }

// C. Depth: protocol and construct terms.
const proto = ['дитиотреит', 'Тритон', 'Triton', 'иодацетамид', 'йодацетамид', 'алкилир', 'диафильтрац', 'кДа', 'ретентат', 'ДТТ', 'ИАА', 'центрифуг\\w* \\d+ мин'];
const pHits = proto.map(t => [t, count(new RegExp(t, 'i'))]).filter(([, n]) => n);
const molar = count(/\d[\d\s,.]*\s?мМ\b/i); if (molar) pHits.push(['N мМ', molar]);
if (pHits.length) say('BLOCK', `reproducible protocol detail: ${pHits.map(([t, n]) => t + '×' + n).join(', ')}`);
const constructs = ['infA', 'hlyA', 'LacI', 'LacO', 'NLS', 'CAG', 'Nissle', 'Yersinia', 'Listeria', 'TLR21', 'CpG', 'HD11', 'RecA', 'листериолизин', 'инвазин', 'ауксотроф', 'белок F', 'VP2', 'S1 ', 'KanR', 'канамицин'];
const cHits = constructs.map(t => [t, count(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))]).filter(([, n]) => n);
if (cHits.length) say('BLOCK', `construct architecture beyond the live /rd cap: ${cHits.map(([t, n]) => t + '×' + n).join(', ')}`);

// D. No personal names (owner's ruling 02.11.2026).
const surnames = ['Агалакова', 'Гранстрем', 'Латыпов', 'Джавадов', 'Веретенников', 'Онохин', 'Рудаков', 'Канов', 'Белавина', 'Кондратьева', 'Плотников', 'Чоладзе', 'Савельева', 'Насонова', 'Звягинцев', 'Рахманов', 'Клейнос'];
const nHits = surnames.map(s => [s, count(new RegExp(s, 'i'))]).filter(([, n]) => n);
if (nHits.length) say('BLOCK', `personal names: ${nHits.map(([s, n]) => s + '×' + n).join(', ')}`);

// E. Veterinary-only: species qualifier in every heading / title / menu item / caption that says "вакцин".
const shortForms = Object.values(raw).flatMap(h => [
  ...[...h.matchAll(/<(h[1-6]|title|figcaption|a|li|button)\b[^>]*>([\s\S]{0,220}?)<\/\1>/gi)].map(m => m[2]),
  ...[...h.matchAll(/<img[^>]*alt="([^"]*)"/gi)].map(m => m[1]),
  ...[...h.matchAll(/<meta[^>]*content="([^"]*)"/gi)].map(m => m[1]),
].map(t => t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));
const vac = shortForms.filter(t => /вакцин/i.test(t));
const bad = vac.filter(t => !/кур|птиц|ветеринар|бройлер|несуш|поголовь/i.test(t));
if (!vac.length) say('INFO', 'no short form mentions vaccines');
else if (bad.length) bad.forEach(t => say('BLOCK', `vaccine short form without a species qualifier: "${t.slice(0, 100)}"`));
else say('OK', `all ${vac.length} vaccine short forms carry a species qualifier`);

// F. Numbers that must not drift.
for (const [re, note] of [[/95[,.]8/, '95,8 % — the wrong denominator'], [/357[^.]{0,80}(пробирок|аликвот)/i, '357 boxes multiplied'], [/≈\s?30|КП\s*30/, 'anti-HIV ≈30 — saturation, not a value']]) { const n = count(re); if (n) say('BLOCK', `${note} ×${n}`); }
if (count(/2[,.]3\s?%/)) say('BLOCK', '2,3 % inverts to the preparation volume');

// G. Build constraints.
Object.entries(raw).forEach(([name, h]) => {
  const ext = [...h.matchAll(/<script[^>]*src="([^"]+)"/gi)].map(m => m[1]).filter(u => !/fonts\.(googleapis|gstatic)/.test(u));
  if (ext.length) say('BLOCK', `${name}: external script(s): ${ext.slice(0, 3).join(', ')}`);
  if (/lorem ipsum|здесь будет|текст будет|TODO|TBD|\[\s*(укажите|вставить|placeholder)/i.test(text[name])) say('BLOCK', `${name}: placeholder copy`);
  if (!/viewport/i.test(h)) say('WARN', `${name}: no viewport meta`);
  if (!/--paper|--ink/.test(h)) say('WARN', `${name}: «Прибор» tokens not found in the styles`);
  if (/--alarm/.test(h.replace(/<style[\s\S]*?<\/style>/i, ''))) say('WARN', `${name}: --alarm used outside the shared style block`);
  const imgs = [...h.matchAll(/<img[^>]*src="([^"]+)"/gi)].map(m => m[1]).filter(s => !s.startsWith('data:'));
  if (imgs.length) say('WARN', `${name}: ${imgs.length} real <img> src — placeholders expected`);
});
// H. Stage sentence for ККС-5 present exactly once per page that mentions it.
Object.entries(text).forEach(([name, t]) => { const n = count(/проходит государственную регистрацию/i, t); if (/ККС-5/.test(t)) say(n === 1 ? 'OK' : n === 0 ? 'WARN' : 'WARN', `${name}: registration stage sentence ×${n} (expected once)`); });
// I. Owner-input gaps must not be on the page.
if (count(/OWNER_INPUTS|NOTES\.md|SUBSTANCE/)) say('BLOCK', 'authoring file names on the page');
console.log(`  => ${blockers} blocker(s), ${warnings} warning(s)`);
process.exit(blockers ? 1 : 0);
