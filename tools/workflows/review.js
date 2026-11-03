export const meta = {
  name: 'bmk-review',
  description: 'Blind review of anonymised drafts: five business readers rank all drafts; per-draft blacklist, fact and build audits; host writes the merge brief',
  phases: [
    { title: 'Review', detail: 'five readers over all drafts + three auditors per draft' },
    { title: 'Merge brief', detail: 'host synthesises, strikes blacklist remedies, names the base and the grafts' },
  ],
}

const REPO = (args && args.repo) || '/home/user/BMK-interactive-website'   // local: pass args.repo
const FACTS = (args && args.facts) || '/home/user/BMK-website'          // local: pass args.facts
const SCR = (args && args.scratch) || (REPO + '/.scratch')                  // local: pass args.scratch
const DRAFTS = args.drafts  // e.g. ['draft_1', ...]

const READERS = [
  { key: 'fund', who: `эксперт Фонда содействия инновациям / экспертного совета региональной госпрограммы. Вы читаете сайт компании при следующей заявке: вам нужно понять за минуту, что сделано по уже профинансированной работе (есть ли закрытые этапы, отчёты, измерения с датами), кто выполняет (роли и квалификации), что у лаборатории есть руками, и можно ли этой компании доверить следующий этап. Самореклама вас раздражает, но ещё больше — самоуничижение и пустые места.` },
  { key: 'virolab', who: `заведующий лабораторией вирусологии университета / института. Вы решаете, можно ли с этой лабораторией выполнять совместную работу: какие методики реально стоят (культуры, ПЦР, ИФА, РГА), какой парк, какие коллекции биоматериала, какие СОП, есть ли автоматизация ИФА, достаточно ли глубины в разделе ККС-5, чтобы судить о компетенции, и не слишком ли много болтовни. Вы терпеть не можете маркетинговый тон и клип-арт.` },
  { key: 'cro', who: `директор по развитию CRO. Вам нужен оффер: какие работы берут как соисполнитель (методики по протоколу заказчика, комплектация и маркировка наборов, хранение −86 °C, биоматериал), доказательства операционной культуры (прослеживаемость, СОП, формы передачи), кто договорная сторона, как начать (что прислать, куда). Вы заняты, у вас нет вечера, и вам нужно понять, писать ли письмо.` },
  { key: 'quality', who: `директор по качеству производителя ИФА-наборов. Вас интересует ККС-5: что это, пять маркеров, измеренные КП с условиями постановки (n, ОП, ОПкрит, длина волны), серия, стабильность, стадия регистрации одной фразой, что можно обсуждать уже сейчас (техническое знакомство, совместная характеризация на ваших наборах). Любая оговорка, любое «не» вместо факта — минус. Таблица без условий постановки — минус.` },
  { key: 'poultry', who: `заместитель генерального директора птицеводческого агрохолдинга. Вас интересует только пероральная ДНК-вакцина для кур: идея в одной фразе, целевые болезни (Ньюкасла, Гамборо, инфекционный бронхит), стадия и даты НИОКТР, план работ с этапами «лаборатория / птица», кто ведёт этап in vivo (роль), что от вас хотят и когда возвращаться к разговору. Медицинская образность, шприцы, «вакцина» без видового определителя — минус. Вам некогда.` },
]

const READER_SCHEMA = {
  type: 'object',
  properties: {
    reader: { type: 'string' },
    ranking: { type: 'array', items: { type: 'string' }, description: 'draft names best → worst' },
    per_draft: { type: 'array', items: { type: 'object', properties: {
      draft: { type: 'string' },
      would_engage: { type: 'boolean' },
      ten_second_test: { type: 'boolean' },
      offer_test: { type: 'boolean' },
      best: { type: 'array', items: { type: 'string' }, description: 'up to 3; each with a verbatim quote and file:line' },
      worst: { type: 'array', items: { type: 'string' }, description: 'up to 3; each with a verbatim quote and file:line' },
      interactivity: { type: 'string', description: 'helps / neutral / distracts — and one sentence why' },
      one_line_verdict: { type: 'string' },
    }, required: ['draft', 'would_engage', 'ten_second_test', 'offer_test', 'best', 'worst', 'interactivity', 'one_line_verdict'] } },
    carry_into_winner: { type: 'array', items: { type: 'string' }, description: 'devices or sections from non-winning drafts worth grafting, with draft and quote' },
  },
  required: ['reader', 'ranking', 'per_draft', 'carry_into_winner'],
}

const readerPrompt = r => `
Вы — ${r.who}

Перед вами ${DRAFTS.length} анонимных черновика нового сайта ООО «БМК групп» (bmc-gp.com), сделанных разными авторами по одному и тому же заданию. Папки: ${DRAFTS.map(d => `${REPO}/panel/${d}/`).join(', ')} — в каждой index.html (главная) и rd.html (страница программ) и папка shots/ со снимками (index_1280.png, index_390.png, rd_1280.png, rd_390.png — смотрите их, это то, что видит читатель; 390 — телефон). Читайте текст страниц полностью (файлы большие — читайте частями), смотрите снимки, и — обязательно — попробуйте интерактивные элементы: откройте страницу в Playwright (require('playwright') работает из любой папки; chromium.launch() без опций; file:// URL), прокрутите, наведите, нажмите Tab и Enter на интерактивных элементах, посмотрите, что меняется (делайте скриншоты в ${SCR}/readers/${r.key}/ и смотрите их). Вы оцениваете сайт как человек своей должности: не как дизайнер и не как аудитор.

Правила оценки:
- Вы исходите из того, что компания честна — это норма, а не достижение. Самоуничижение, оговорки, пустые места, объяснения, «как читать», «честно», «это X, а не Y», рассказ о том, чего нет, вы читаете как слабость или как отсутствие содержания — и говорите об этом прямо.
- Вы хвалите только то, что отвечает на ваш рабочий вопрос, и ругаете только то, что мешает ответить. Каждое «лучшее» и «худшее» — с дословной цитатой и file:line (grep -n по файлу).
- Интерактивность и графика: ответьте по каждому черновику, помогает ли она вам (быстрее нашли ответ, лучше поняли), нейтральна или мешает (отвлекает, тормозит, ломается, выглядит несерьёзно). Фокус не на «красиво», а на «мне, в моём кресле, это нужно?».
- Тест десяти секунд: пробежав первый экран, знаете ли вы, чем занимается компания, на какой стадии две программы и что у лаборатории есть руками. Тест предложения: находите ли вы, что вам предлагают и как начать.
- Ранжируйте все черновики от лучшего к худшему. Скажите по каждому, написали бы вы письмо или позвонили. Назовите приёмы или разделы из непобедивших черновиков, которые стоит перенести в победителя (с цитатой).
Отвечайте по-русски, коротко, без вежливости. Цитаты дословно.`

const AUDITS = [
  { key: 'blacklist', schema: {
    type: 'object', properties: { draft: { type: 'string' }, findings: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, line: { type: 'integer' }, quote: { type: 'string' }, row: { type: 'string', description: 'blacklist row number or rule name' }, severity: { type: 'string', enum: ['BLOCK', 'WARN'] }, remedy: { type: 'string', description: 'delete or correct — never add an admission' } }, required: ['file', 'line', 'quote', 'row', 'severity', 'remedy'] } }, interactive_states_checked: { type: 'string' }, verdict: { type: 'string' } }, required: ['draft', 'findings', 'interactive_states_checked', 'verdict'] },
    prompt: d => `
You are the blacklist auditor for one anonymous draft of the bmc-gp.com site: ${REPO}/panel/${d}/index.html and rd.html.
Read ${FACTS}/02_briefs/BLACKLIST.md (25 rows) and ${FACTS}/05_tools/empty-cell_example.md first, then ${FACTS}/02_briefs/BRIEF2.md §3 (what is forbidden) and HANDOFF.md §2 in ${FACTS}.
Audit the visible text of both pages (strip tags; read the files in parts), every caption, alt, title, meta, button, aria-label, and every text that appears only in an interactive state (open the page with Playwright — require('playwright'), chromium.launch(), file:// URL — click/tab through every interactive element and read what appears; also read strings inside inline <script> that are inserted into the DOM). Also check the species qualifier rule (every short form mentioning вакцин carries кур/птиц), the no-names rule, the stage sentence («проходит государственную регистрацию как медицинское изделие» exactly once per page that mentions ККС-5, no forecasts), the «page talks about itself» rule, and that --alarm red / «нет данных» states are absent.
Run: cd ${REPO} && node tools/check_concept2.js panel/${d} — include its real output in your verdict.
Every finding: file, line (grep -n), verbatim quote, blacklist row or rule, severity (BLOCK = a row match or rule break; WARN = borderline), and the admissible remedy — delete or correct to what the evidence supports; you may NEVER recommend adding an admission, a disclaimer or an explanation. Zero findings is a valid result; do not invent.` },
  { key: 'facts', schema: {
    type: 'object', properties: { draft: { type: 'string' }, findings: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, line: { type: 'integer' }, quote: { type: 'string' }, substance_item: { type: 'string' }, verdict: { type: 'string', enum: ['confirmed', 'not confirmed', 'wrong', 'forbidden'] }, note: { type: 'string' } }, required: ['file', 'line', 'quote', 'substance_item', 'verdict', 'note'] } }, numbers_checked: { type: 'integer' }, verdict: { type: 'string' } }, required: ['draft', 'findings', 'numbers_checked', 'verdict'] },
    prompt: d => `
You are the fact checker for one anonymous draft of the bmc-gp.com site: ${REPO}/panel/${d}/index.html and rd.html.
Your only source of truth is ${FACTS}/01_facts/SUBSTANCE.md (long; read it fully, in parts) plus the owner's corrections in ${FACTS}/HANDOFF.md §2 and ${FACTS}/02_briefs/BRIEF2.md §1 (ККС-5 is in state registration now — the owner's words outrank SUBSTANCE §3.3; the patent application is filed; eight cryoboxes are per centre). The depth cap for the vaccine platform is ${FACTS}/01_facts/live_site_rd_text_30.10.2026.txt. ${FACTS}/03_current_prototype/NOTES_v1.md has the accepted number → item table of version 2, which you may use as a shortcut, but verify against SUBSTANCE when in doubt.
Extract EVERY number, date, sum, document number, count, temperature, titre, name of programme/competition/standard, role/degree, and every claim of achievement from both pages (including text inside inline <script> and SVG <text>/<title>). For each one that is NOT confirmed by SUBSTANCE at the same denominator and precision, or that is in SUBSTANCE §7 (must not be published), or that exceeds the depth cap (protocol detail, construct architecture, antigens instead of diseases), or that names a person, client, hospital or subcontractor, or that forecasts registration — report it: file, line, verbatim quote, SUBSTANCE item, verdict (not confirmed / wrong / forbidden), note. Also report «confirmed» for anything that looks suspicious but checks out, so the host can see what you examined. Report how many distinct numbers you checked. A claim you cannot reproduce from SUBSTANCE is «not confirmed», never «probably fine».` },
  { key: 'build', schema: {
    type: 'object', properties: { draft: { type: 'string' }, gate_blockers: { type: 'integer' }, render_problems: { type: 'integer' }, audit_failures: { type: 'integer' }, tool_output_tail: { type: 'string' }, interactive_devices: { type: 'array', items: { type: 'object', properties: { device: { type: 'string' }, works: { type: 'boolean' }, keyboard: { type: 'boolean' }, no_js_fallback: { type: 'boolean' }, reduced_motion_ok: { type: 'boolean' }, note: { type: 'string' } }, required: ['device', 'works', 'keyboard', 'no_js_fallback', 'reduced_motion_ok', 'note'] } }, visual_defects: { type: 'array', items: { type: 'string' } }, verdict: { type: 'string' } }, required: ['draft', 'gate_blockers', 'render_problems', 'audit_failures', 'tool_output_tail', 'interactive_devices', 'visual_defects', 'verdict'] },
    prompt: d => `
You are the build auditor for one anonymous draft of the bmc-gp.com site: ${REPO}/panel/${d}/index.html and rd.html. Read ${REPO}/BRIEF_INTERACTIVE.md §1, §4, §6 for the rules.
Run, from ${REPO}, and keep the real outputs:
  node tools/check_concept2.js panel/${d}
  node tools/render.js panel/${d} ${SCR}/build/${d}
  node tools/audit_build.js panel/${d}
Then LOOK at the screenshots the renderer produced (1280, 390, 320, 1280-rm for each page) and list visual defects: overlapping text, clipped graphics, labels that collide, stacked phone layouts that break, type below 15 px for sentences, illegible SVG text, placeholders that read as broken.
Then open each page in Playwright (require('playwright') works from anywhere; chromium.launch() without options; file:// URL) and exercise every interactive device you can find (scroll-driven graphics, hover/focus on tables and diagrams, sliders/scrubbers, filters, choosers, steppers, details): for each device record whether it works with pointer, whether it works with keyboard alone (Tab/Enter/Space/arrows), whether the content is complete with javaScriptEnabled:false, and whether under reducedMotion:'reduce' the page is still and complete. Note JS errors from page.on('pageerror') and console errors. Check that no request goes anywhere but fonts.googleapis.com / fonts.gstatic.com. Check <html lang="ru">, viewport meta, one <h1> per page, headings in order, SVG with role="img"+<title> where meaningful, and the print stylesheet if claimed (page.emulateMedia({media:'print'}) and screenshot).
Report numbers from the tools exactly as printed. A device that only works with a mouse is «keyboard: false». Do not grade the design; grade whether it is built right.` },
]

phase('Review')
const readerJobs = READERS.map(r => () => agent(readerPrompt(r), { label: `reader:${r.key}`, phase: 'Review', schema: READER_SCHEMA, effort: 'high' }))
const auditJobs = DRAFTS.flatMap(d => AUDITS.map(a => () => agent(a.prompt(d), { label: `${a.key}:${d}`, phase: 'Review', schema: a.schema })))
const all = await parallel([...readerJobs, ...auditJobs])
const readers = all.slice(0, READERS.length).filter(Boolean)
const audits = all.slice(READERS.length).filter(Boolean)
log(`readers returned: ${readers.length}/${READERS.length}; audits returned: ${audits.length}/${auditJobs.length}`)

// Borda count from the readers
const borda = {}
for (const r of readers) r.ranking.forEach((d, i) => { borda[d] = (borda[d] || 0) + (DRAFTS.length - i) })
const engage = {}
for (const r of readers) for (const p of r.per_draft) engage[p.draft] = (engage[p.draft] || 0) + (p.would_engage ? 1 : 0)
log('Borda: ' + Object.entries(borda).sort((a, b) => b[1] - a[1]).map(([d, s]) => `${d}=${s} (engage ${engage[d] || 0}/${readers.length})`).join(', '))

phase('Merge brief')
const MERGE_SCHEMA = { type: 'object', properties: { base: { type: 'string' }, borda: { type: 'object' }, struck: { type: 'array', items: { type: 'string' } }, merge_brief_path: { type: 'string' }, summary: { type: 'string' } }, required: ['base', 'struck', 'merge_brief_path', 'summary'] }
const merge = await agent(`
You are the host of a blind design review for bmc-gp.com. Five business readers ranked ${DRAFTS.length} anonymous drafts and three auditors (blacklist, facts, build) examined each. The raw results are below as JSON. Read ${FACTS}/HANDOFF.md §6 (the review pipeline and its rules), ${FACTS}/02_briefs/BLACKLIST.md («For the host» at the end), ${FACTS}/06_review_history/MERGE_BRIEF_v1.md (the shape of the last merge brief), and ${REPO}/BRIEF_INTERACTIVE.md.

Rules: quotes verbatim with file:line; a claim that cannot be reproduced is «not confirmed»; reader fitness outranks everything; never add an admission as a remedy — delete or correct; strike any reader or auditor recommendation that would add a confession device and list it under ===STRUCK===; a draft whose lead rests on a struck device is re-ranked without it; a draft with a BLOCK-level blacklist or fact finding can still be the base if the finding is fixable by deletion, but say so.

Write ${REPO}/panel/MERGE_BRIEF.md in Russian, in the shape of MERGE_BRIEF_v1.md: (1) the Borda table and «would engage» counts, with the readers' one-line verdicts; (2) the base draft and why — «сохранить как есть» list with quotes; (3) mandatory fixes of the base from the three audits (each with file:line, quote, remedy); (4) grafts from other drafts — only admissible devices, each with the source draft, the quote or device name, and the reader who asked for it; (5) interactivity verdict: which devices the readers said help, which distract, which to drop; (6) «Чего НЕ делать»; (7) what the final must deliver. Keep the anonymous draft names; the key is not yours to see.

Borda (computed by the host script): ${JSON.stringify(borda)}; would-engage counts: ${JSON.stringify(engage)}.

READERS:
${JSON.stringify(readers, null, 1)}

AUDITS:
${JSON.stringify(audits, null, 1)}
`, { label: 'host:merge-brief', phase: 'Merge brief', schema: MERGE_SCHEMA, effort: 'high' })

return { borda, engage, readers, audits, merge }
