export const meta = {
  name: 'bmk-final',
  description: 'Merge the winning draft with admissible grafts into final/, then context-blind verify → fix → re-verify until clean',
  phases: [
    { title: 'Merge', detail: 'host builder assembles final/ from the base and the grafts' },
    { title: 'Verify', detail: 'context-blind facts, blacklist, build, two cold readers' },
    { title: 'Fix', detail: 'apply findings by deletion or correction, re-run tools' },
  ],
}

const REPO = (args && args.repo) || '/home/user/BMK-interactive-website'   // local: pass args.repo
const FACTS = (args && args.facts) || '/home/user/BMK-website'          // local: pass args.facts
const SCR = (args && args.scratch) || (REPO + '/.scratch')                  // local: pass args.scratch
const { base, grafts, round0 } = args   // base: 'concepts/C3'; grafts: [{draft:'draft_2', folder:'concepts/C5'}...]

const BUILD_SCHEMA = { type: 'object', properties: { files: { type: 'array', items: { type: 'string' } }, gate_blockers: { type: 'integer' }, render_problems: { type: 'integer' }, audit_failures: { type: 'integer' }, tool_output_tail: { type: 'string' }, applied: { type: 'array', items: { type: 'string' } }, not_applied: { type: 'array', items: { type: 'string' }, description: 'findings not applied and why' }, summary: { type: 'string' } }, required: ['files', 'gate_blockers', 'render_problems', 'audit_failures', 'tool_output_tail', 'applied', 'not_applied', 'summary'] }

const TOOLS = `
Tools (run from ${REPO}; keep the real output and report the numbers exactly):
  node tools/check_concept2.js final            → must end «0 blocker(s)»; the only expected warning is the 2026–2028 plan dates
  node tools/render.js final                     → must end «0 render problem(s)»; screenshots land in final/shots/
  node tools/audit_build.js final                → must end «0 build-audit failure(s)»
  node tools/textdiff.js ${FACTS}/03_current_prototype/index.html final/index.html   (and rd) → read every «+» line you introduced
Then LOOK at final/shots/index_1280.png, index_390.png, rd_1280.png, rd_390.png and fix visual defects. Iterate until all three tools are clean and the screenshots look right.
Open the pages in Playwright (require('playwright'); chromium.launch(); file:// URL) and exercise every interactive device with pointer and with keyboard; with javaScriptEnabled:false; with reducedMotion:'reduce'.`

phase('Merge')
const built = await agent(`
You are the host builder. Assemble the final interactive version of bmc-gp.com in ${REPO}/final/ from the blind round's winner and the admissible grafts.

Read first: ${REPO}/panel/MERGE_BRIEF.md (the merge brief — binding), ${FACTS}/HANDOFF.md §2 and §6, ${REPO}/BRIEF_INTERACTIVE.md, ${FACTS}/02_briefs/BLACKLIST.md, ${FACTS}/02_briefs/BRIEF2.md, ${FACTS}/02_briefs/KKS5_BRIEF.md, ${FACTS}/01_facts/SUBSTANCE.md (§3–§7), ${FACTS}/01_facts/OWNER_INPUTS.md.

The key (the merge brief uses anonymous names): BASE = ${REPO}/${base} ; GRAFTS = ${JSON.stringify(grafts)}. Every concept folder has index.html, rd.html, NOTES.md, OWNER_INPUTS.md, shots/.

Do:
1. Copy the base's index.html and rd.html into ${REPO}/final/ (start from the base byte for byte; do not rebuild from scratch).
2. Apply every mandatory fix from the merge brief §3 by deletion or correction — never by adding an admission, disclaimer or explanation.
3. Apply the grafts of §4 from the named source folders — only those, only admissible devices; adapt their markup/CSS/JS to the base's system (tokens, type scale, rhythm). If a graft cannot be integrated without breaking the base's system, leave it out and say why.
4. Apply the interactivity verdict of §5: drop devices the readers said distract; keep what helps; everything keyboard-reachable, complete without JS, still under reduced motion.
5. Keep the hard rules: no names; numbers only from SUBSTANCE (same denominator/precision; anti-HIV-1/2 = «выше верхнего предела измерения фотометра»); species qualifier in every short form that mentions vaccines; stage sentence exactly once per page; no blacklist device in any text or interactive state; no protocol/construct depth; no --alarm; no external resources beyond Google Fonts; no AI images; photo placeholders with shot codes; Russian.
6. Write ${REPO}/final/NOTES.md (Russian): структура в пяти строках; что взято откуда (base, each graft, each fix — with the merge brief item); визуальная система — что сохранено из «Прибор», что изменено и почему; каждый интерактивный приём — что делает, что без JS, что при reduced motion; формулы планшета и мотива вакцинной программы; таблица «число → пункт SUBSTANCE» covering EVERY number on both pages (start from the base's NOTES table and from ${FACTS}/03_current_prototype/NOTES_v1.md; verify each); какой текст написан Claude. Write ${REPO}/final/OWNER_INPUTS.md: the 31 items of ${FACTS}/01_facts/OWNER_INPUTS.md kept as they are plus any new ones from the concepts' OWNER_INPUTS.md files (deduplicated, numbered on). Nothing from either file appears on the pages.
${TOOLS}
Report the tool numbers, what you applied, what you did not apply and why.
Write only under ${REPO}/final/ and ${SCR}/final-build/. Do not touch git.
`, { label: 'host:build-final', phase: 'Merge', schema: BUILD_SCHEMA })
log(`built: gate ${built && built.gate_blockers}, render ${built && built.render_problems}, audit ${built && built.audit_failures}`)

const VERIFY_SCHEMA = { type: 'object', properties: { verifier: { type: 'string' }, findings: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string', enum: ['BLOCK', 'WARN', 'NOTE'] }, file: { type: 'string' }, line: { type: 'integer' }, quote: { type: 'string' }, rule: { type: 'string' }, remedy: { type: 'string', description: 'delete or correct — never add an admission' } }, required: ['severity', 'file', 'line', 'quote', 'rule', 'remedy'] } }, checked: { type: 'string' }, verdict: { type: 'string' } }, required: ['verifier', 'findings', 'checked', 'verdict'] }

const VERIFIERS = [
  { key: 'facts', p: `Context-blind fact verification of ${REPO}/final/index.html and rd.html. Your only truth: ${FACTS}/01_facts/SUBSTANCE.md (read fully, in parts), with the owner's corrections in ${FACTS}/HANDOFF.md §2 (ККС-5 is in state registration now; patent application filed; eight cryoboxes per centre) and the depth cap ${FACTS}/01_facts/live_site_rd_text_30.10.2026.txt. Cross-check ${REPO}/final/NOTES.md's table «число → пункт SUBSTANCE»: every number on the pages must be in it and must match SUBSTANCE at the same denominator and precision; every table row must be true. Extract every number, date, sum, document number, count, temperature, titre, programme/competition/standard name, role/degree, achievement claim from both pages (including inline <script> strings and SVG text) and verify each. Report anything not confirmed, wrong, forbidden (§7), beyond the depth cap, or naming a person/client/hospital/subcontractor, with file:line and verbatim quote. Reproduce: node tools/check_concept2.js final from ${REPO}.` },
  { key: 'blacklist', p: `Context-blind blacklist verification of ${REPO}/final/index.html and rd.html against ${FACTS}/02_briefs/BLACKLIST.md (25 rows; read «For the host»), ${FACTS}/05_tools/empty-cell_example.md, ${FACTS}/02_briefs/BRIEF2.md §3 and ${FACTS}/HANDOFF.md §2. Audit all visible text, captions, alt, title, meta, aria-labels, button labels, and every string that appears only in an interactive state (open each page in Playwright — require('playwright'), chromium.launch(), file:// — and operate every control; read strings in inline <script>). Also: species qualifier in every short form mentioning вакцин; no personal names; stage sentence exactly once per page mentioning ККС-5, no forecasts; the page never talks about itself (прототип/макет/заглушка/версия); no «честно», no «это X, а не Y», no absence named; no --alarm. Remedy is always delete or correct; never add.` },
  { key: 'build', p: `Context-blind build verification of ${REPO}/final/. Rules: ${REPO}/BRIEF_INTERACTIVE.md §1, §4, §6. Run from ${REPO}: node tools/check_concept2.js final; node tools/render.js final ${SCR}/verify-build; node tools/audit_build.js final. Look at every screenshot (1280, 390, 320, 1280-rm, both pages) and list visual defects with the file and the section. Open each page in Playwright and exercise every interactive device with pointer and keyboard only; with javaScriptEnabled:false (content complete? headings all present?); with reducedMotion:'reduce' (still?). Check: lang="ru", viewport, exactly one h1, heading order, SVG role/title, no external requests beyond Google Fonts, no console/page errors, print media (page.emulateMedia({media:'print'})) renders readable. Report tool numbers exactly as printed; each defect as a finding with severity (BLOCK = rule break, overflow, JS error, device unusable by keyboard, content missing without JS; WARN = visual defect).` },
  { key: 'reader-fund', p: `Вы — эксперт Фонда содействия инновациям / экспертного совета региональной госпрограммы, читаете холодно новый сайт ООО «БМК групп»: ${REPO}/final/index.html и rd.html (читайте полностью, частями) и снимки ${REPO}/final/shots/index_1280.png, index_390.png, rd_1280.png, rd_390.png; попробуйте интерактивные элементы в Playwright (require('playwright'), chromium.launch(), file://). Контекста предыдущих раундов у вас нет. Ответьте как человек своей должности: тест десяти секунд (чем занимается компания, стадия двух программ, что есть руками) — пройден?; тест предложения (что мне предлагают и как начать) — пройден?; стали бы вы продолжать разговор?; три лучших места и три худших, каждое с дословной цитатой и file:line; помогает ли интерактивность или мешает. Любое самоуничижение, оговорка, пустое место, объяснение сайта о себе — худшее. Каждое замечание — как finding с severity (BLOCK = после этого вы закрываете вкладку; WARN = раздражает; NOTE = пожелание) и remedy (удалить или исправить — никогда «добавить оговорку»). По-русски, коротко.` },
  { key: 'reader-quality', p: `Вы — директор по качеству производителя ИФА-наборов, читаете холодно новый сайт ООО «БМК групп»: ${REPO}/final/index.html и rd.html (полностью, частями) и снимки ${REPO}/final/shots/*.png; попробуйте интерактивные элементы в Playwright (require('playwright'), chromium.launch(), file://). Контекста у вас нет. Вас интересует ККС-5: что это, пять маркеров, КП с условиями постановки, серия, стабильность, стадия одной фразой, что можно обсуждать сейчас, как начать. Ответьте: тест десяти секунд — пройден?; тест предложения — пройден?; написали бы вы письмо?; три лучших и три худших места с дословной цитатой и file:line; помогает ли интерактивность (таблица КП, планшет, схема) или мешает. Любое «не» вместо факта, любая оговорка — худшее. Каждое замечание — finding с severity (BLOCK / WARN / NOTE) и remedy (удалить или исправить — никогда «добавить оговорку»). По-русски, коротко.` },
]

const isBlock = f => f.severity === 'BLOCK'
let round = round0 || 1
let lastVerify = null
while (round <= 3) {
  phase('Verify')
  const vs = (await parallel(VERIFIERS.map(v => () => agent(v.p + `\n(Verification round ${round}.)` + (round > 1 && v.key.startsWith('reader') ? `\nРешения владельца, которые не обсуждаются и не являются замечаниями: места под фотографии подписаны кодами кадров до съёмки; для анти-ВИЧ-1/2 пишется «выше верхнего предела измерения фотометра» без числа. Оценивайте всё остальное.` : ''), { label: `verify:${v.key}:r${round}`, phase: 'Verify', schema: VERIFY_SCHEMA, effort: 'high' })))).filter(Boolean)
  lastVerify = vs
  const blocks = vs.flatMap(v => v.findings.filter(isBlock).map(f => ({ verifier: v.verifier, ...f })))
  const warns = vs.flatMap(v => v.findings.filter(f => f.severity === 'WARN').map(f => ({ verifier: v.verifier, ...f })))
  log(`round ${round}: ${blocks.length} BLOCK, ${warns.length} WARN from ${vs.length} verifiers`)
  if (!blocks.length && round > 1) break
  if (!blocks.length && !warns.length) break
  phase('Fix')
  const fix = await agent(`
You are the host builder fixing ${REPO}/final/ after context-blind verification round ${round}. Read ${REPO}/panel/MERGE_BRIEF.md, ${FACTS}/HANDOFF.md §2, ${FACTS}/02_briefs/BLACKLIST.md, ${REPO}/BRIEF_INTERACTIVE.md, ${REPO}/final/NOTES.md.
Findings (BLOCK must be fixed; WARN fix unless it conflicts with a rule or a reader's explicit preference — then say why):
${JSON.stringify({ blocks, warns }, null, 1)}
OWNER DECISIONS OUTRANK EVERY FINDING, readers included (HANDOFF §2). Reject, and list under not_applied with the HANDOFF item, any finding that asks to: remove or hide the photo placeholders or their shot codes (§2.7: photos are placeholders captioned with shot numbers until the owner supplies them; you MAY improve how a placeholder looks or reads — caption naming what the shot shows, tighter size, fewer placeholders in the first screen — but keep one per shot); change «выше верхнего предела измерения фотометра» for anti-HIV-1/2 or print any number for it (§2.8); add names, forecasts, registration dates, a second stage sentence, or human-vaccine wording; restore anything §2 removed. Facts only the owner can supply go to final/OWNER_INPUTS.md.
Rules for fixing: delete or correct — never add an admission, disclaimer, explanation or «план» that SUBSTANCE does not contain; numbers only from SUBSTANCE; keep the stage sentence once per page; keep species qualifiers; subject to the owner decisions above, a reader's BLOCK outranks an auditor's WARN and where two findings conflict the reader wins; where a finding asks for a fact only the owner can supply, do not invent it — add it to final/OWNER_INPUTS.md and leave the page silent. Update final/NOTES.md (the number table and the «что взято откуда» list) for every change.
${TOOLS}
Report what you applied and what you did not apply and why.`, { label: `host:fix:r${round}`, phase: 'Fix', schema: BUILD_SCHEMA })
  log(`fix round ${round}: applied ${fix ? fix.applied.length : 0}, not applied ${fix ? fix.not_applied.length : 0}; gate ${fix && fix.gate_blockers} render ${fix && fix.render_problems} audit ${fix && fix.audit_failures}`)
  round++
}
if (round > 3) {
  phase('Verify')
  const vs = (await parallel(VERIFIERS.slice(0, 3).map(v => () => agent(v.p + `\n(Closing verification after the last fix round; report only what is still wrong.)`, { label: `verify:${v.key}:closing`, phase: 'Verify', schema: VERIFY_SCHEMA, effort: 'high' })))).filter(Boolean)
  lastVerify = vs
  log(`closing: ${vs.flatMap(v => v.findings.filter(isBlock)).length} BLOCK remain`)
}
return { built, rounds: round, lastVerify }
