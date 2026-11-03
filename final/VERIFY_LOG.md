# VERIFY_LOG — final build and context-blind verification

Generated from the final-build workflow journal. Severity: BLOCK = must fix; WARN = fix unless it conflicts with an owner rule; NOTE = suggestion. Remedies are always deletion or correction.

## Build / fix pass

Gate blockers 0 · render problems 0 · build-audit failures 0

Applied:

- Base copied byte for byte from concepts/C5 (= draft_2); every change is a named exact-once replacement in final/_build_apply.js (reproducible)
- MERGE_BRIEF §3 p.1: «, академик РАН» removed on index 07 and rd 02.5 (role + degree + responsibility kept)
- §3 p.2: «Собственная система поддержания экспрессии без антибиотиков» removed from rd 02.3
- §3 p.3: 2 400 → «1 400 + 500 + 500 этикеток криопробирок» (spec list and margin note)
- §3 p.4: subsidy attributed to госпрограмма «Научно-технологическое развитие федеральной территории „Сириус“» on index 01, index 08 (p2 card: «победитель конкурса 26-803-05360-1-0164 государственной программы…») and rd 02.6
- §3 p.5: «Состав коллекций» → «Коллекции и поставленные панели»
- §3 p.6: three disease definitions removed; names only
- §3 p.7: Virotrol sentence trimmed to «…импортный контроль Bio-Rad Virotrol.»
- §3 p.8: p1 card body reduced to «Совместная характеризация ККС-5 на наборах партнёра по согласованному плану.»; card heading aligned («ККС-5: совместная характеризация на наборах партнёра») because the old heading carried the struck «знакомство с материалом»
- §3 p.9: «Несоответствия регистрируются и расследуются по СОП.» removed
- §3 p.10: B9 caption → «Стойка хранения криобоксов»
- §3 p.11: duplicate «Код криопробирки определяется номером набора» removed
- §3 p.12: «Менеджер биобанка · Лабораторное сопровождение исследований.»
- §3 p.13: print stylesheet — dark sections and footer white with ink text; nav/index/filters/addressee buttons/form hidden; interactive state reset (hidden rows shown, selected card restored, highlights off)
- §3 p.14: chronicle range slider, output and cursor removed; static axis with 7 title-bearing mark links + list; hover/focus highlight kept; month labels non-overlapping at 700–900 px and in print; track hidden ≤699 px (list only)
- §3 p.15: ELISA cycle scheme rebuilt as a static 3×2 grid of six steps (draft_5 layout, no buttons, no pictograms); caption cut to two sentences; 320 px note 286 px wide
- §3 p.16: nine .inv__m counter SVGs removed from the equipment register
- §3 p.17: dangling «— порядок в разделе «Партнёрам»» removed
- §3 p.18: section-02 lead moved under 02.1 «Идея», containment sentence second
- §3 p.19: «4 / адресата» tile → «Партнёрам / форматы работы, что сделано и как начать» in tile__v--s
- §3 p.20: tile preview opens on focus too and now sizes itself to cover the tile below completely (verified 808–1065 vs 825–1066 px)
- §3 p.21: 13 px → 15 px for addressee/filter buttons, team degree lines, frame captions, ftr__btm, eyebrow, motif captions, card keys, normative column, tile keys, brand subtitle (audit: 0 type-size warnings)
- §3 p.22: .ph/.lr margin fix (E1 now 32 px below the privacy line), footer h4→h3 on both pages, 320 px scheme note ≥280 px
- §3 p.23: A1, B2, E1 (and B5 on /rd) as 160–320 px bands; no «заглушка» anywhere (CSS comment renamed too)
- §4 A: КП bar column from draft_3 (.kpbar CSS only, re-tokenised; 4,4→36.67 %, 6,2→51.67 %, ≈11→91.67 %, 3,8→31.67 %, threshold at 25 %, anti-HIV hatched off-scale with aria-label); grows once via IntersectionObserver, final state under reduced-motion and without JS
- §4 B: sticky section index (.pidx) on both pages ≥1000 px with aria-current and progress bar; rd keeps the static hero__jump line below 1000 px
- §4 C: methods filter (draft_3 buttons via the base .filt component) + draft_4 status line «Показаны все девять методик / Методик с этой привязкой: N из 9», aria-live, hidden without JS and in print
- §4 D: context line «Постановка 03.09.2026 · пять маркеров · порог КП ≥ 3» (aria-live) above the КП table; rows tabindex=0 with data-read; wells ↔ rows ↔ line linked by hover and focus
- §4 E: margin notes from draft_1 — rd: 1:128, 30 × 5 мл, +45 / +37 °C; index: 29 + 81, 1 400 + 500 + 500 — adapted to the base tokens (.lr grid + .mn)
- §4 F: tiles reordered — 2 · ККС-5 stage · 16.11.2026 – 31.12.2028 · 9 · 155 / 357 · 29 СОП · −86 °C · Команда · Партнёрам; hero tightened (H1 32ch = 3 lines) so both stages end at 732 px on 1280×800
- §4 G: vaccine stage as the same .stage plaque as ККС-5; short addressee buttons «Производитель тест-систем · Птицеводческая компания · CRO или научная лаборатория · Фонд или госпрограмма»
- §4 H: rd «Как начать» lead carries ceo@bmc-gp.com and +7 908 632-50-48 as links in the same sentence
- §5 verdict: slider, stepper arrows, counter squares dropped; map previews, addressee selection, methods filter, КП bar, sticky index, well↔row link, scroll plate perspective (off under reduced-motion), team filter kept
- NOTES.md (Russian): 5-line structure, source of every fix/graft with brief item, visual system, every device with JS/no-JS/reduced-motion behaviour, plate/wells/bar/flock/axis formulas, number → SUBSTANCE table covering both pages, Claude-written text, real tool output
- OWNER_INPUTS.md: the 31 items verbatim + new 32–46 (brief §6–§7 questions and the concepts' items deduplicated)

Not applied (with reason):

- draft_3 «По реестру / По категориям» toggle, category tags, draft_1 track switcher, draft_1/draft_5 step switchers — excluded by MERGE_BRIEF §4 («не прививать»)
- Dark theme, canvas parallax, nipple-line steps, well chronicle/well stripes, «Курсор по датам», radio-hidden cards / collapsed <details>, well buttons over the КП table, full-screen poultry house drawing, «в перспективе» caption — excluded by §5 («выбросить»)
- draft_5 pictograms inside the six scheme tiles — only the layout was taken (brief: «брать раскладку, не кнопки»); pictograms would reintroduce the clip-art feel readers criticised
- Names, kit manufacturer, missing run conditions for four markers, first stability-point numbers, step-2 end date, biomaterial transfer procedure, disease definitions, registration sub-stage — not on the page (§6), routed to OWNER_INPUTS 32–38 / existing 8, 22, 30
- Six form inputs still flagged «without accessible name» by audit_build (WARN, not FAIL): they are labelled with <label for>; the audit heuristic only reads innerText/aria-label, so no change was made
- The gate's single WARN now counts ×7 instead of the base's ×6 because the «МУК 4.2.2029-05» document number appears once more (filter button); it is a document number, not a forecast year

```
node tools/check_concept2.js final
### final  (index.html 102849B, rd.html 83568B)
  [WARN] row 8: a year in the regulatory-horizon range — check it is a plan date, not a forecast ×7: …ю как медицинское изделие ККС-5 · стадия 16.11.2026 – 31.12.2028 НИОКТР: пероральные ДНК-вакцины для кур Вакцины для кур · план 9 методик вирусологического тест…
  [OK] all 21 vaccine short forms carry a species qualifier
  [OK] index.html: registration stage sentence ×1 (expected once)
  [OK] rd.html: registration stage sentence ×1 (expected once)
  => 0 blocker(s), 1 warning(s)
(×7 = пять дат плана 2026–2028 + два вхождения номера документа «МУК 4.2.2029-05»: строка таблицы и кнопка фильтра; в базе было ×6)

node tools/render.js final
### index.html
  [OK] 1280: scrollWidth 1280 / clientWidth 1280, height 13439 → final/shots/index_1280.png
  [OK] 390: scrollWidth 390 / clientWidth 390, height 19962 → final/shots/index_390.png
  [OK] 320: scrollWidth 320 / clientWidth 320, height 22673 → final/shots/index_320.png
  [OK] 1280-rm: scrollWidth 1280 / clientWidth 1280, height 13439 → final/shots/index_1280-rm.png
### rd.html
  [OK] 1280: scrollWidth 1280 / clientWidth 1280, height 6983 → final/shots/rd_1280.png
  [OK] 390: scrollWidth 390 / clientWidth 390, height 10317 → final/shots/rd_390.png
  [OK] 320: scrollWidth 320 / clientWidth 320, height 11705 → final/shots/rd_320.png
  [OK] 1280-rm: scrollWidth 1280 / clientWidth 1280, height 6983 → final/shots/rd_1280-rm.png
=> 0 render problem(s)

node tools/audit_build.js final
### index.html  (89 KB; inline script 6 KB; <svg> 3; <canvas> 0)
  [OK] no-JS: visible text 15188 vs 15430 with JS (1.6 % lost); hidden headings without JS: none
  [OK] motion: 0 running, 0 infinite animation(s) 1.5 s after load+scroll
  [WARN] focusable: 77; tabindex>0: 0; without accessible name: 6   (шесть полей формы базы, подписанные <label for>)
  [OK] visible focus: 40/40 of first tab stops show outline or box-shadow
  [OK] contrast: 325 text elements sampled; 0 below 4.5:1
  [OK] type size: 0 multi-word text element(s) below 15 px
  [OK] reduced-motion: 0 animation(s) still running after 1.5 s (0 infinite)
### rd.html  (75 KB; inline script 5 KB; <svg> 8; <canvas> 0)
  [OK] no-JS: visible text 7007 vs 7007 with JS (0.0 % lost); hidden headings without JS: none
  [OK] motion: 0 running, 0 infinite animation(s) 1.5 s after load+scroll
  [OK] focusable: 45; tabindex>0: 0; without accessible name: 0
  [OK] visible focus: 39/39 of first tab stops show outline or box-shadow
  [OK] contrast: 186 text elements sampled; 0 below 4.5:1
  [OK] type size: 0 multi-word text element(s) below 15 px
  [OK] reduced-motion: 0 animation(s) still running after 1.5 s (0 infinite)
=> 0 build-audit failure(s)

node tools/textdiff.js 03_current_prototype/index.html final/index.html → lines original 328 | candidate 389 | missing from candidate 23 | new in candidate 65
node tools/textdiff.js 03_current_prototype/rd.html final/rd.html → lines original 183 | candidate 219 | missing from candidate 13 | new in candidate 36
(all «+» lines read and listed in NOTES §7; all «−» lines are the §3 fixes or base C5 changes)

Playwright interact.js (pointer + keyboard, javaScriptEnabled:false, reducedMotion:'reduce', emulateMedia print, 720/800/390/320 px): 36 checks → 0 interaction failure(s); console/page errors 0; external requests beyond Google Fonts 0.
```

## blacklist-context-blind (round 1)

BLOCK 0 · WARN 0 · NOTE 6

Verdict: PASS — no BLOCK, no WARN. No row of the 25-row blacklist is matched in rendered, attribute, meta or interactive-state text on either page. Six NOTEs: a field legend in the team tile, a publication count and a misplaced lab-certificate sentence in one team row, authoring comments in page source, three links to a non-existent /privacy page, one duplicated diagram string, and the poultry programme's stage dates repeated on the home page.

| sev | where | quote | rule | remedy |
|---|---|---|---|---|
| NOTE | final/index.html:589 | роли в программах и в лаборатории: роль, степень, институт | BLACKLIST row 19 (nothing about the name or its absence) / row 22 (no legend of the list's fields on the page) | Correct: shorten the tile text to «Роли в программах и в лаборатории» — delete «: роль, степень, институт». The enumeration of fields is a column legend and, by listing what is given, points at the field that is not. |
| NOTE | final/index.html:850 | Четыре рецензируемые публикации 2022–2024. В лаборатории два сертификата ICH GCP E6(R3) от 18.06.2026. | BLACKLIST row 13 (roles with responsibilities, not biographical trivia); BRIEF2 §3.4 (publications only by DOI where they do not identify a person) | Delete the publication count (a bare count is credential trivia; if publications are wanted, they appear as DOIs per §3.4). The ICH GCP certificate sentence is a laboratory fact placed inside one person's row — move it to section 05 «Система качества» or delet |
| NOTE | final/index.html:13 | редакция C5 «Карта того, что есть» … Красный «отсутствие» в системе отсутствует. | BLACKLIST row 24 (authoring notes live in NOTES.md, never in the page) — not rendered, present in page source of both index.html:13–16 and rd.html:13–16 | Delete the CSS header comment (lines 13–16) in both files; keep the tokens. Same for the design-note comments at index.html:431/1029/1057 and rd.html:431/853/880–883 if the source is to be clean. |
| NOTE | final/index.html:986 | <a href="/privacy">Порядок обработки персональных данных</a> | BLACKLIST row 6 / row 24 (a privacy page carries the owner's real text or does not exist); link target absent from the deliverable (also index.html:1020, rd.html:844) | Correct the href to an existing page carrying the owner's approved text, or delete the three links until that page exists. Do not publish a page that narrates its own drafting. |
| NOTE | final/rd.html:616 | <p class="cycle__t">КП, порог ≥ 3</p><p class="cycle__s">порог договора ≥ 3</p> | Duplicate string in one diagram cell (title and subtitle say the same thing) | Correct: keep «КП, порог ≥ 3» as title and change the subtitle to what step 6 does (e.g. «расчёт по ОП/ОПкрит») or delete the subtitle. |
| NOTE | final/index.html:887 | НИОКТР 16.11.2026 – 31.12.2028 | empty-cell_example.md: the stage of a programme is stated once, where the programme is introduced (home page already carries it in the hero tile at line 583: «16.11.2026 – 31.12.2028 · НИОКТР: перорал | Correct: in the p2 «Сделано» line keep only the competition win («Программа — победитель конкурса 26-803-05360-1-0164 …») and delete the repeated НИОКТР dates; the stage stays in the tile. |

## Context-blind fact check of final/index.html and final/rd.html against 01_facts/SUBSTANCE.md (read in full), HANDOFF.md §2 owner corrections

BLOCK 0 · WARN 1 · NOTE 6

Verdict: PASS with no blockers. One WARN: rd.html 02.4 prints bid target-specification figures (shelf life ≥ 12 months, dissolution 5–10 min) that SUBSTANCE §7.2 names as grant-bid forecasts and that lie beyond the live-text depth cap, even though labelled as plan — delete the two rows. Six NOTES (groundwork claim §4.11 APPLICATION strength, корпус 7 pitch-deck source, 'Научный руководитель' open §10 question, certificate number INTERNAL-WORKING until scan read, 04.09 start event omits the closed +55 °C arm, 'клетки кишечника' one step deeper than the cap's 'клетки птицы'). Every other number, date, sum, document number, count, temperature, titre, programme/standard name, role/degree and achievement claim on both pages is confirmed in SUBSTANCE (or the owner's dated corrections) at the same denominator and precision; no §7 name, identifier or forbidden claim appears; NOTES §6 table is complete and true; gate output reproduces exactly.

| sev | where | quote | rule | remedy |
|---|---|---|---|---|
| WARN | final/rd.html:768 | <li>Срок годности не менее 12 месяцев при <span class="nw">+2…+8&nbsp;°C</span></li> | SUBSTANCE §7.2: shelf life is explicitly named among the vaccine 'target specifications in a grant bid, not results' (source §4.8, strength APPLICATION); HANDOFF §2.6 caps the vaccine platform at the  | correct — delete the shelf-life (768) and dissolution (769) rows; keep 02.4 only as «Лиофилизат для выпаивания» or drop 02.4 entirely |
| NOTE | final/rd.html:758 | <li>Опыт рекомбинационной инженерии бактериальных штаммов</li> | SUBSTANCE §4.11 is APPLICATION strength ('existing technical groundwork claimed' in the bid); the experience belongs to a consultant at another employer (§5, Латыпов) and §9 Q19 leaves open who holds  | correct — keep only if the owner confirms the group may claim this groundwork as its own; otherwise delete the row |
| NOTE | final/rd.html:799 | <p class="note mt-3">Локализация производства, план: технопарк «Сириус», корпус 7.</p> | SUBSTANCE §4.12: source is one pitch-deck slide ('commercial proposals requested, area being calculated'); beyond the live /rd text. Admissible as a dated plan under HANDOFF §2.3, but the weakest-sour | correct — delete if the owner does not confirm корпус 7; otherwise keep as is |
| NOTE | final/index.html:846 | Научный руководитель вакцин для птицы<span>кандидат биологических наук, микробиолог, СПбГУ</span> | SUBSTANCE §4 (end) and §10 record an unresolved conflict: Приложение 5 of the signed bid names Латыпов 'Научный руководитель', while the live site and news name Гранстрем; status 'Ask'. The page follo | correct — keep per the signed bid; confirm with the owner (OWNER_INPUTS п. 10) before publication |
| NOTE | final/index.html:576 | свидетельство <span class="nw">АА № 000093</span> от 05.04.2024 | SUBSTANCE §1.9: the certificate scan is image-only (created 09.04.2024) and the number АА № 000093 от 05.04.2024 is INTERNAL-WORKING 'until the scan is read'. Repeated at index.html:1000 (contacts), i | correct — read the scan and confirm number and date; until then either keep (sourced) or drop the number and keep «участник проекта ИНТЦ «Сириус»» |
| NOTE | final/index.html:645 | <b>Старт исследования стабильности ККС-5:</b> ускоренное старение целыми флаконами 5 мл при +45 и +37&nbsp;°C и реальное время при <span class="nw">+2…+8&nbsp;° | SUBSTANCE §3.1.8: on 04.09.2026 the programme started with three arms (+55 / +45 / +37 °C); the +55 °C arm was closed 14.09.2026. A start-dated event listing only two arms is incomplete (not false). r | correct — rephrase the 04.09 event to the present tense («идёт при +45 и +37 °C») or drop the arm list from the start event («ускоренное старение целыми флаконами 5 мл и реальное время при +2…+8 °C») |
| NOTE | final/rd.html:741 | живой носитель доставляет ДНК-конструкцию в клетки кишечника | Depth cap: the live /rd text says «доставки плазмидной ДНК … в клетки птицы»; 'клетки кишечника' is a generalisation of the bid's M-cell detail (SUBSTANCE §4.2) and one step deeper than the cap. Same  | correct — use the cap's own wording «в клетки птицы» in both places, or keep if the owner accepts this level |

## Эксперт ФСИ / экспертного совета региональной госпрограммы (холодное чтение, раунд 1)

BLOCK 1 · WARN 11 · NOTE 6

Verdict: Тест десяти секунд пройден, тест предложения пройден с оговорками, разговор продолжил бы — но не по сайту, а по досье. Один BLOCK: восемь пустых рамок «Кадр …» делают главную похожей на макет; пока они есть, сайт нельзя показывать эксперту. Остальное — WARN: оговорка в подвале, заглушка логотипа, безымянная команда, неназванная «группа компаний», недоказанная «госрегистрация», mailto-форма и мёртвая /privacy, четыре методики без нормативной привязки, пустой «научный задел» вакцин. Интерактивность не мешает; полезна только связка лунок с таблицей КП; фильтры и перспектива планшета — лишние.

| sev | where | quote | rule | remedy |
|---|---|---|---|---|
| BLOCK | final/index.html:676 | Кадр B1 · крупный план | Пустое место: восемь сетчатых рамок без фотографий с кодами съёмки (B1, B9, A1, B2, C3, B8, D1, E1; строки 673–682, 708–712, 791–795, 816–825, 854–858, 989–993; rd.html:700–705 «Кадр B5»). Для эксперт | Удалить все figure.ph до появления фотографий; когда фото есть — вставить их и убрать подписи «Кадр …». |
| WARN | final/index.html:1024 | Подтверждающие документы предоставляются по запросу и на аудите. | Оговорка. Читается как «показать не можем». То же rd.html:848. | Удалить строку в обоих подвалах. |
| WARN | final/index.html:530 | <span class="logoslot">БМК</span> | Пустое место: вместо логотипа — сетчатая заглушка с тремя буквами в шапке обеих страниц (rd.html:530). | Заменить на логотип или оставить одну текстовую строку «БМК групп» без сетчатого слота. |
| WARN | final/index.html:845 | Руководитель программы ККС-5<span>кандидат биологических наук, СПбГУ</span> | Команда без имён (845–852). Для экспертного совета ключевой персонал — именной; безымянные роли нельзя сверить с заявкой и публикациями. | Исправить: указать ФИО по каждой роли, либо удалить раздел и плитку «Команда» (589). |
| WARN | final/index.html:578 | Лаборатория группы компаний выполняет работы по протоколу заказчика | «Группа компаний» не названа нигде (повтор: 602, 724, 805, 1003; rd.html:827). Эксперт не понимает, принадлежит ли лаборатория и парк оборудования получателю гранта ООО «БМК групп» или другому юрлицу. | Исправить: «лаборатория ООО «БМК групп»» либо назвать юрлицо-владельца лаборатории и основание пользования. |
| WARN | final/rd.html:711 | ККС-5 проходит государственную регистрацию как медицинское изделие. | Заявление без даты и номера, при этом стабильность стартовала 04.09.2026, характеризация в ИХЛА только запланирована (696–697). Эксперт по «Старт-Медизделия» спросит: подано ли заявление в Росздравнад | Исправить: указать дату и № заявления/вх. номер либо заменить стадию на фактическую («подготовка регистрационного досье», «технические испытания с …»). |
| WARN | final/index.html:925 | <form class="form" action="mailto:ceo@bmc-gp.com" method="post" enctype="text/plain"> | Форма на mailto: в корпоративном браузере без почтового клиента нажатие «Отправить запрос» ничего не делает; данные никуда не сохраняются. Дублирует шаг «1 Письмо». | Удалить форму (925–952); оставить шаги «Как начать» и ссылку mailto с предзаполненной темой. |
| WARN | final/index.html:986 | <a href="/privacy">Порядок обработки персональных данных</a> | Мёртвая ссылка: страницы privacy в final/ нет (также 1020, rd.html:844). Пустое место, к тому же рядом с формой сбора данных. | Удалить ссылки, пока страницы нет; либо создать privacy.html и ссылаться относительным путём. |
| WARN | final/index.html:753 | <div class="tbl__r" role="row" data-doc=""> | Четыре из девяти методик (Гемадсорбция, Гемагглютинация, Cofal, LAMP; 752–757, 770–775, 784–787) без нормативной привязки — пустые клетки в столбце «Нормативная привязка». Фильтр по документу это подч | Исправить: проставить документ по каждой методике либо убрать столбец и фильтр. |
| WARN | final/rd.html:758 | Опыт рекомбинационной инженерии бактериальных штаммов | «Научный задел» для программы на 15 млн ₽ — два слова «опыт» без штаммов, конструкций, публикаций, патентов. Эксперт совета читает это как отсутствие задела. | Исправить: перечислить конкретные результаты (штаммы, конструкции, публикации, патенты) либо удалить подраздел 02.3. |
| WARN | final/rd.html:572 | Пероральные ДНК-вакцины для кур — с планом НИОКТР, датами и субсидией. | Сайт объясняет сам себя: лид описывает содержимое страницы («с датами и субсидией»), а не продукт. | Исправить: одно предложение о продукте и стадии: «Контрольная сыворотка на пять маркеров, серия ККС-5-П01 измерена 03.09.2026. ДНК-вакцины для кур через выпаивание, НИОКТР с 16.11.2026». |
| WARN | final/index.html:868 | Четыре адресата, у каждого — форматы работы и то, что по ним уже сделано. | Объяснение сайта о себе. Карточки ниже говорят то же сами. | Удалить лид. |
| NOTE | final/index.html:589 | роли в программах и в лаборатории: роль, степень, институт | Плитки «Команда» и «Партнёрам» (589–590) описывают структуру раздела, а не факт; выбиваются из ряда числовых плиток. | Исправить: дать факт («8 ролей, 5 со степенью; 2 сертификата ICH GCP E6(R3)») либо удалить две плитки. |
| NOTE | final/index.html:805 | Парк лаборатории группы компаний. | Пустые лиды-заглушки (805, 836 «Роли в программах и в лаборатории.»). | Удалить оба лида. |
| NOTE | final/index.html:838 | Показать | Фильтры на 8 ролей и 9 методик (838–842, 734–739) — интерактивность ради интерактивности; списки целиком читаются быстрее. | Удалить оба фильтра и счётчик «Показаны все девять методик» (741). |
| NOTE | final/index.html:630 | Что сделано в 2026 году | Хроника покрывает только 27.08–30.10.2026, при договоре от 07.10.2025. Эксперт спросит, что было десять месяцев. | Исправить: заголовок «Что сделано с августа 2026» либо добавить события по этапу 1 (октябрь 2025 — август 2026). |
| NOTE | final/rd.html:594 | Разброс оптической плотности между флаконами — не больше 10 % от среднего по серии | Требование заявлено, результат по серии П01 не показан (в таблице КП нет межфлаконного разброса). | Исправить: привести измеренный разброс по серии либо убрать пункт из спецификации до измерения. |
| NOTE | final/index.html:581 | 2программы НИОКР с государственным финансированием | Плитка дублирует заголовок h1 строкой выше. | Удалить плитку, оставить девять. |

## Директор по качеству производителя ИФА-наборов, холодное чтение (раунд 1)

BLOCK 2 · WARN 8 · NOTE 6

Verdict: Тест десяти секунд: rd.html — пройден (лид «Жидкая комбинированная контрольная сыворотка для ИФА и ИХЛА: пять маркеров в одной матрице. HBsAg, анти-HBcore, анти-ВИЧ-1/2, анти-ВГС и анти-T. pallidum» отвечает на «что это» сразу); index.html — не пройден: первый экран о компании, плитка ККС-5 даёт только стадию («проходит государственную регистрацию»), а что это — ниже сгиба. Тест предложения — не пройден: «Совместная характеризация ККС-5 на наборах партнёра по согласованному плану» повторяет заголовок и не говорит, что я получу (флаконы? протокол? сроки? кто платит), а «Как начать» просит «задачу, матрицу, объём и сроки» — язык CRO, не поставщика контроля. Письмо написал бы — серия, цифры КП с ОП/ОПкрит по HBsAg и ориентир на Virotrol этого стоят, — но письмо будет состоять из вопросов, на которые сайт обязан был ответить: на чьих наборах мерили, какой КП по ВИЧ, что показала стабильность 30.10. Три лучших места: rd.html:585 лид с пятью маркерами; rd.html:656 «n = 3 · ОП 0,498 · ОПкрит 0,114 · 450/620 нм» (цифры сходятся: 0,498/0,114 = 4,4); rd.html:598 «Ориентир формы выпуска — импортный контроль Bio-Rad Virotrol». Три худших: rd.html:668 «сигнал выше верхнего предела измерения фотометра» — один маркер из пяти без числа; rd.html:688 «на коммерческих наборах ИФА одного производителя» — производитель скрыт, а КП зависит от набора; rd.html:704 «Кадр B5» — пустые сетки-заглушки с внутренними кодами на боевом сайте. Интерактивность: таблица КП с лунками ближнего ряда — помогает (строка-контекст и подсветка работают мышью и с клавиатуры, шкала с порогом 3 читается мгновенно); планшет, следящий за прокруткой, — декорация, не мешает и не помогает; схема «ККС-5 в цикле измерения» — мешает: тривиальна для любого ИФА-специалиста, дублирует «порог ≥ 3» дважды и отодвигает данные вниз. Выбор адресата в «Партнёрам» работает, но раскрывает пустую карточку.

| sev | where | quote | rule | remedy |
|---|---|---|---|---|
| BLOCK | final/rd.html:668 | сигнал выше верхнего предела измерения фотометра | «Не» вместо факта: у контроля на пять маркеров один маркер (анти-ВИЧ-1/2) не имеет числа КП; строка таблицы, лунка и примечание повторяют это трижды, столбик уходит за край шкалы | Исправить: дать число — КП в разведении либо ОП при насыщении с указанием предела фотометра и ОПкрит (например «ОП > 3,0 при ОПкрит 0,2») |
| BLOCK | final/rd.html:704 | Кадр B5 | Пустые сетки-заглушки с внутренними кодами съёмки (B5 на rd.html; B1, B9, A1, B2, D1, E1 на index.html) и логотип-заглушка «БМК» в шапке (rd.html:530, index.html:530) — сайт читается как недоделанный | Удалить все рамки «Кадр …» и заглушку логотипа до появления фотографий |
| WARN | final/rd.html:688 | Измерение 03.09.2026 на коммерческих наборах ИФА одного производителя | Скрытый факт: КП контрольной сыворотки зависит от набора; производитель наборов не назван, хотя адресат раздела — производитель тест-систем | Исправить: назвать производителя, наименования и серии наборов по каждому маркеру — или удалить оборот «одного производителя» |
| WARN | final/rd.html:696 | Изохронная постановка всех точек выполнена 30 октября 2026 года на автоматической станции ИФА | Процесс вместо результата: постановка стабильности выполнена, а ни одного КП по плечам +45/+37/+2…+8 °C на странице нет | Исправить: привести КП по маркерам и плечам на 30.10.2026 (или удалить фразу о выполненной постановке до публикации данных) |
| WARN | final/rd.html:594 | Разброс оптической плотности между флаконами — не больше 10 % от среднего по серии | Требование подано в списке фактов серии; измеренного разброса (CV, n флаконов) для ККС-5-П01 нет | Исправить: заменить на измеренное значение по серии П01 (CV %, n флаконов, дата) |
| WARN | final/rd.html:711 | ККС-5 проходит государственную регистрацию как медицинское изделие. | Стадия без факта: нет даты подачи, номера заявления и органа; при серии от сентября 2026 и незавершённой характеризации в ИХЛА холодный читатель не верит | Исправить: указать дату подачи и регистрирующий орган — либо заменить на фактическую стадию (досье готовится / подано …) |
| WARN | final/index.html:880 | Совместная характеризация ККС-5 на наборах партнёра по согласованному плану. | Тест предложения не пройден: абзац дословно повторяет заголовок карточки; не сказано, что получает партнёр (сколько флаконов, протокол, сроки, кто платит) | Исправить: заменить на конкретное предложение — объём передаваемых флаконов серии П01, черновик плана характеризации, срок, условия |
| WARN | final/rd.html:816 | Пришлите задачу, матрицу, объём и сроки | «Как начать» написано для заказчика CRO-услуг («матрица», «объём»); производителю наборов нужны флаконы ККС-5 и план, а не матрица (то же index.html:909) | Исправить: для ККС-5 — «запросите флаконы серии П01 и план характеризации», оставив матрицу/объём только для лабораторных услуг |
| WARN | final/rd.html:674 | анти-ВГС · КП ≈11 · n = 4 | Неравная детализация: по HBsAg даны ОП, ОПкрит и длины волн, по анти-HBcore, анти-ВГС и анти-T. pallidum — только n; по анти-ВГС КП приблизительный | Исправить: точный КП и ОП/ОПкрит по всем пяти строкам, как в строке HBsAg |
| WARN | final/rd.html:844 | <a href="/privacy">Персональные данные</a> | Битая ссылка: страницы /privacy в final/ нет (то же index.html:986, 1020) | Удалить ссылку или исправить на существующую страницу |
| NOTE | final/rd.html:616 | КП, порог ≥ 3</p><p class="cycle__s">порог договора ≥ 3 | Схема 01.1 тривиальна для ИФА-специалиста, дублирует порог в одной плитке дважды и отодвигает таблицу КП ниже | Удалить схему «ККС-5 в цикле измерения» (пояснение про обратное отношение для конкурентного формата перенести в примечание к таблице) |
| NOTE | final/rd.html:593 | Договорной порог: коэффициент позитивности не ниже 3 по каждому маркеру | Порог гранта подан как спецификация продукта; для QA это разные вещи | Исправить: «Требование ТЗ гранта: КП ≥ 3» и отдельно — спецификация продукта, если она есть |
| NOTE | final/rd.html:697 | характеризация в ИХЛА на внешней площадке по плану исследования v3 от 16 октября 2026 года, слепая, de novo | Площадка и система ИХЛА не названы; «de novo» непонятно без контекста | Исправить: назвать площадку и анализатор ИХЛА — либо удалить «слепая, de novo» |
| NOTE | final/rd.html:717 | вся сумма отнесена к 2025 году | Бухгалтерская деталь, не нужная партнёру | Удалить |
| NOTE | final/rd.html:643 | <svg class="kprow" viewBox="0 0 560 200" role="img" | Зона наведения ссылок-лунок — только линия, лунка и подпись; указатель между ними попадает в пустой SVG, подсветка гаснет (воспроизведено в Playwright) | Исправить: добавить ссылке невидимый прямоугольник-подложку от лунки до подписи |
| NOTE | final/index.html:925 | <form class="form" action="mailto:ceo@bmc-gp.com" method="post" enctype="text/plain"> | Форма на mailto: открывает почтовый клиент, на части устройств молча не срабатывает | Удалить форму, оставив явную ссылку на почту, — либо исправить на серверный обработчик |

## Context-blind build verification, round 1, /home/user/BMK-interactive-website/final/ (index.html, rd.html), against BRIEF_INTERACTIVE.md §1,

BLOCK 0 · WARN 4 · NOTE 2

Verdict: PASS with warnings, 0 BLOCK. Gate: 0 blockers and only the expected plan-date warning. Render: 0 problems. Audit: 0 failures. No overflow at 320/390, no JS or console errors, no external requests beyond Google Fonts, content complete without JS. Every interactive device works with keyboard alone and with pointer, and the pages are still under reduced motion. Four visual WARNs: chronicle marker overlap at 27.08–04.09; unbalanced /rd 02 header card; misaligned contact columns in index 09; print pagination and blank photo frames in print. One audit WARN, «without accessible name: 6», is a false positive: all six are the labelled form fields. Under §1/§4/§6 the build can be pushed as final; the WARNs are cosmetic fixes for the next round.

| sev | where | quote | rule | remedy |
|---|---|---|---|---|
| WARN | final/index.html:633 | <circle cx="87.086" ...> (ev2) / <circle cx="94.971" ...> (ev3) / <rect x="94.971" width="15.772"> + <circle cx="110.743"> (ev4), r=6 | Visual defect, section 02 «Что сделано в 2026 году», chronicle axis at 1280 px: four markers fall within 27.08–04.09. The ev2 and ev3 circles overlap (their centres are 7.9 viewBox units apart against | Correct: offset the overlapping markers vertically (stagger them in two lanes), or shrink r for clustered events, so no two dots or range bars overlap at 1280 px |
| WARN | final/rd.html:728 | <h2 class="sh__t">Пероральные ДНК-вакцины для кур</h2> | Visual defect, /rd section 02 header card at 1280 px: the left half has only the heading and about 150 px of empty space under it. Card 01 has a lead paragraph in the same place, so the two programme  | Correct: move the 02.1 «Идея» lead into the card as card 01 does, or vertically centre or shrink the card; drop the duplicated top rule on phones |
| WARN | final/index.html:979 | <dt>Почта</dt> | Visual defect, section 09 «Контакты и реквизиты» at 1280 px: right-column values (почта, телефон, ИНТЦ, персональные данные) sit about 18 px lower under their labels than left-column values (label-to- | Correct: use the same dd top margin for link values as for text values |
| WARN | final/rd.html:438 | @media print{ | Print media, both pages: text is readable (white background, ink text, nav, pidx, filters and form hidden, every heading present). Layout problems: on rd.html the 9th PDF page carries only the one-lin | Correct: in @media print hide .ph placeholders, add break-inside:avoid to .map and to the footer block, and cap the .motif height |
| NOTE | final/index.html:925 | <form class="form" action="mailto:ceo@bmc-gp.com" method="post" enctype="text/plain"> | Not a defect, recorded so the WARN is not re-chased: audit_build reported «focusable: 77; tabindex>0: 0; without accessible name: 6». The six are the form's inputs and textarea. Its check is innerText | None needed in the page |
| NOTE | final/index.html:633 | кадры B1, B9, A1, B2, C3, B8, D1, E1, B5 — поля с кодом кадра и подписью снимаемого | The nine empty grid photo frames on both pages are intentional placeholders (NOTES §23, OWNER_INPUTS #29). They are not counted as defects, but until the photos arrive they are the most visible gaps i | None in this round; replace when the owner supplies the photos |

## Build / fix pass

Gate blockers 0 · render problems 0 · build-audit failures 0

Applied:

- Photo placeholders (BLOCK ×2): I kept one per shot with its shot code. Each is now a lower band, height clamp(120px,14vw,176px), instead of 16:9 or 3:4. The B8 caption now names what the shot shows: «Приборы с читаемыми моделями», from PHOTO_SHOTLIST.
- Print (WARN): photo placeholders print as an 88 px band without the grid (not hidden); motifs are capped at 70 mm; .map, .ftr and .ftr__g get break-inside:avoid.
- Removed the footer line «Подтверждающие документы предоставляются по запросу и на аудите.» from both pages.
- rd 02.4: deleted the shelf-life and dissolution rows, and also «Лиофилизат» (SUBSTANCE §7.2: these are bid targets). I dropped 02.4 entirely.
- rd 02.3 «Научный задел»: deleted the subsection (reader's remedy; it was deeper than the live /rd text). Renumbered 02.5 to 02.3 and 02.6 to 02.4.
- Chronicle axis: the 01.09 and 04.09 markers now sit in a second lane (cy=16) with a stem down to the axis. No dots or range bars overlap at 1280. Formula updated in NOTES §5.5.
- rd section 02 header card: moved the 02.1 «Идея» subhead and lead inside the card, the same way card 01 holds its lead. It stays «под 02.1», as MERGE_BRIEF §3 п.18 requires. On phones the plate's top border is dropped, so only one rule sits above the flock motif.
- Contacts: added .dl{align-content:start}. The right-column values now sit the same distance under their labels as the left column's (the cause was grid stretch, not the dd margin).
- Deleted the mailto form on index section 08. Step 1 now links mailto with the subject «Запрос с сайта».
- rd hero lead rewritten to describe the product and its state, with no numbers outside SUBSTANCE and the stage sentence not repeated.
- Deleted the index section 08 lead «Четыре адресата…».
- Deleted «одного производителя» from the rd 01.2 note.
- rd 01.3: deleted the sentence about the isochronous run of 30.10. The remaining sentence now reads «Автоматическая станция ИФА введена 28 октября 2026 года.»
- rd 01: the 10 % line is now labelled «Договорное требование:», matching SUBSTANCE §3.1.2 and the live /rd text. The measured CV went to the owner list.
- Partner card p1: deleted the paragraph that repeated the heading.
- «Как начать»: rd now reads «Пришлите задачу и сроки…». Index step 1 now reads «Пришлите задачу и сроки…; для лабораторных работ — также матрицу и объём».
- NOTES.md: updated the number table, structure, formula §5.5 and checks, and added §9 for round 1. OWNER_INPUTS.md: new items 47–49, and re-confirmed items 2, 6, 8, 14, 18, 20, 22, 29, 32 and 33.

Not applied (with reason):

- BLOCK: delete the photo placeholders and their shot codes (fund expert; quality director). Rejected under HANDOFF §2.7 and BRIEF_INTERACTIVE §2.7. Only their size and captions were improved.
- BLOCK: give a number or OD for anti-HIV-1/2 (quality director). Rejected under HANDOFF §2.8. The wording «выше верхнего предела измерения фотометра» stays.
- Logo placeholder (BLOCK part, plus the WARN): BRIEF_INTERACTIVE §2.10 says «the logo slot is a given» (HANDOFF §2.10). The logo file is OWNER_INPUTS #29.
- Names for the team, or delete the team section: rejected under HANDOFF §2.5. Consents are OWNER_INPUTS #8.
- Date or number of the KKS-5 registration application (fund expert and quality director): rejected under HANDOFF §2.3 (one stage sentence, no dates). OWNER_INPUTS #2.
- Name the «группа компаний» or write «лаборатория ООО «БМК групп»»: SUBSTANCE §6.5 says the equipment is leased, so that wording would be false. The legal entity has to come from the owner: OWNER_INPUTS #6.
- Dead /privacy link (×2): rejected. HANDOFF and BRIEF2 keep /privacy as the live page on bmc-gp.com, so the link resolves when deployed. Hosting is OWNER_INPUTS #41.
- Four methods without a normative document, or remove the column and filter: removing them conflicts with BRIEF_INTERACTIVE §1 («a method matrix you can filter»). The documents are OWNER_INPUTS #14.
- Exact KP and OD/ODcrit for anti-HBcore, anti-HCV and anti-T. pallidum: these numbers are not in SUBSTANCE §3.1.5. OWNER_INPUTS #32.
- Measured inter-vial CV: not in SUBSTANCE (§11 item 11). The line is relabelled as a requirement instead. OWNER_INPUTS #18.
- Concrete offer to the kit maker (vials, plan, timing, who pays) and «запросите флаконы П01»: this is an owner decision. OWNER_INPUTS #22.
- Name the kit manufacturer: took the reader's other remedy and deleted «одного производителя». Naming it is OWNER_INPUTS #20.
- KP values for the stability arms: none exist in SUBSTANCE. Took the remedy of deleting the 'run completed' sentence on /rd. The index chronicle entry ev7 is unchanged, because the finding cited /rd only. OWNER_INPUTS #33.
- Not pushed: the user asked to push once the final is verified, and verification round 2 has not run yet. The final/ folder is still untracked in git.

```
check_concept2: "### final  (index.html 101702B, rd.html 82885B) [WARN] row 8: a year in the regulatory-horizon range ... ×7 [OK] all 21 vaccine short forms carry a species qualifier [OK] index.html: registration stage sentence ×1 [OK] rd.html: registration stage sentence ×1 => 0 blocker(s), 1 warning(s)" | render: "index 1280/390/320/1280-rm OK; rd 1280/390/320/1280-rm OK => 0 render problem(s)" | audit_build: "index: no-JS 14959 vs 15201 (1.6 %), focusable 70, without accessible name 0, focus 40/40, contrast 315 sampled 0 below 4.5:1, type 0 <15px; rd: no-JS 6674 vs 6674, focusable 45, focus 39/39, contrast 175 sampled 0 below => 0 build-audit failure(s)" | Playwright: timeline 7/7 marks by pointer and by keyboard select the right row, 0 mismatches. Method filter gives 3/3/2/1/9 with the counter, and works from the keyboard. Role filter gives 3/4/3/8. Audience buttons work by click and Enter. Tile previews open on hover and focus. The 5 wells and the KP rows highlight each other and update kpread on hover and focus. The plate's perspective changes on scroll. The /rd page index sets aria-current on 01/02/03. With JS off: 9 methods, 4 cards, 7 events, 8 roles, 5 KP rows. The same checks pass under reducedMotion. 0 page errors. Print to PDF: index 14 A4 pages (was 15), rd 8 (was 9), the rd footer prints whole.
```

## Context-blind blacklist verifier, round 2. Checked against BLACKLIST.md (25 rows plus «For the host»), empty-cell_example.md, BRIEF2 §3 and 

BLOCK 0 · WARN 2 · NOTE 5

Verdict: PASS WITH 2 WARN. Nothing blocks shipping. Fix before push: (1) at 1280 px the methods table shows 4 blank «Нормативная привязка» cells; restructure so no empty cell renders. (2) Delete «: роль, степень, институт» from the Команда tile. The 5 NOTEs are optional cleanups and need no confession added anywhere. Every remedy deletes or corrects; none adds text.

| sev | where | quote | rule | remedy |
|---|---|---|---|---|
| WARN | final/index.html:755 | Гемадсорбция \| гемадсорбирующие вирусы на монослое \| [пусто под «Нормативная привязка»] (так же Гемагглютинация l.759, Cofal l.773, LAMP l.787) | BLACKLIST rows 2 and 21 (no visible empty cell, no absence shown in a capability list). In the 1280 px table, 4 of the 9 rows leave the «Нормативная привязка» column blank, so for those methods the re | Correct the layout so no blank cell renders. Drop the third column and print the binding as a trailing clause under «Что определяет» only on the five rows that have one. Do not invent bindings: SUBSTANCE §… lists none for these four. |
| WARN | final/index.html:591 | Команда — роли в программах и в лаборатории: роль, степень, институт | BLACKLIST rows 3, 19 and 22, and BRIEF2 §3.4 (say nothing about why names are absent and show no reading instructions). The tile announces how the team section is formatted, and the format list itself | Delete «: роль, степень, институт». Keep «роли в программах и в лаборатории». |
| NOTE | final/index.html:1095 | 'Методик с этой привязкой: ' + n + ' из 9' | BLACKLIST row 21 («9 методик из 12»). This interactive-state string turns each filter result into a minority count («1 из 9», «2 из 9», «3 из 9»). | Delete « из 9» so the string reads «Методик с этой привязкой: N». |
| NOTE | final/index.html:13 | стиль «ПРИБОР», редакция C5 «Карта того, что есть». … Красный «отсутствие» в системе отсутствует. | BLACKLIST row 24 (the page talks about its own production). The text is only a CSS comment and does not render, but anyone who opens view-source reads it. The same comment is in rd.html line 13. | Delete the authoring comment from both files before publishing. It belongs in NOTES.md. |
| NOTE | final/index.html:695 | 357 криобоксов … учтены пофотографно и сверены со справочным списком. | BLACKLIST rows 20 and 22 (process detail used as proof of rigour). The same applies to l.672 «Аллокатор номеров сверяет реестры перед выдачей номера». This is borderline: neither is a war story, but b | Optionally delete «пофотографно и сверены со справочным списком» and the allocator bullet. Keep «357 криобоксов … учтены». |
| NOTE | final/index.html:678 | Кадр B1 · крупный план (also A1, B2, B8, B9, C3, D1, E1; rd.html B5) | Page self-reference. These shot-number captions on grid placeholders are sanctioned by HANDOFF §2.7. They contain no прототип/макет/заглушка/версия wording, so they pass. | When the photos arrive, delete the «Кадр …» labels together with the placeholders. |
| NOTE | final/rd.html:739 | Вакцинировать птицу не инъекцией каждой особи, а с водой или кормом | The «X, а не Y» check. This is a contrast that describes the product, not a status hedge welded to a fact (row 18), so it passes. Same wording at index.html l.620. | No change needed. |
