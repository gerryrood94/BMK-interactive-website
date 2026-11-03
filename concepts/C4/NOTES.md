# C4 «Издание» — NOTES

Author: Claude (cloud session, 03.11.2026). Pages: `index.html`, `rd.html`. Built deterministically by
one script (scratchpad `C4/build.js`); the plate, the ELISA run and the vaccine motif are generated from
the formulas below, not drawn by hand.

## 1. Structure in five lines

1. **System**: an editorial page — IBM Plex Serif for display (h1/h2/h3, card titles, role names), IBM Plex Sans for
   running text, IBM Plex Mono for every figure, date, label and code. Wide measure (68ch) with **numbered margin notes**
   in a 232-px column at ≥ 1000 px; on phone each note folds under its paragraph as a hairline-topped block.
2. **index.html**: masthead → hero (serif title, lead, three figures in the margin, two programme cards with their
   motifs) → 01 Две программы → 02 Что сделано (chronicle, dates in the margin column) → 03 Комплектация → 04 Биобанк
   (`<details>` rows) → 05 Качество + method table → 06 Оборудование → 07 Команда → 08 Партнёрам (chooser) + Как начать +
   form → 09 Контакты.
3. **rd.html**: hero → 01 ККС-5 (plate motif as the opening image, spec list; 01.1 ELISA stepper; 01.2 chronicle + КП
   table with five wells; 01.3 stability/ИХЛА; 01.4 stage — once; 01.5 funding) → 02 Пероральные ДНК-вакцины для кур
   (02.1–02.4 verbatim; 02.5 plan as a route with a lane switch over the vaccine motif; 02.6 funding) → 03 Как начать.
4. **Interaction** = explanatory diagrams only: stepper, lane switch, expandable rows, chooser, one entrance animation.
   Nothing scrolls the reader, nothing loops, nothing overlays.
5. **Text**: the accepted v2 text verbatim; Claude wrote only the items listed in §7.

## 2. What is kept from «Прибор» and why; what changed

Kept: the colour roles and values (`--paper #F3F3EF`, `--plate`, `--band`, `--ink/--ink-2/--ink-3`, `--rule/--rule-2`,
`--ref #244191` as the only accent outside scheme № 3, the dark `--panel` footer with its light inks), the 8-px rhythm, the
15-px floor for any sentence (12/13-px mono only for uppercase labels and the ch/sub numbers), tabular figures, zero
radius, hairline tables with `data-l` labels on phone, the `.ph` gridded photo placeholder with shot code and caption,
the logo slot and brand blue, the mobile `<details>` menu. These are the parts readers already accepted and the parts
that make numbers legible.

Changed: typography (serif display instead of sans-600 headings), section headers (a 2-px rule + small mono number
instead of the ink plate and scale ticks), the margin-note column (new), the chronicle dates moved into the margin column,
cards get a serif title and more air, `--alarm` and status chips do not exist in this stylesheet at all. Fonts: Google
Fonts, one `<link>`: IBM Plex Sans 400/500/600, IBM Plex Serif 400/500 + italic 400, IBM Plex Mono 400/500/600 (the
Plex family keeps the Прибор mono/sans and adds the serif of the same family rather than mixing Inter Tight + Source
Serif).

## 3. Interactive devices — behaviour with JS, without JS, under reduced motion

JS adds `html.js`; every interactive rule is scoped to `html.js …`, so the markup alone is the complete page.

| device | with JS | without JS | reduced motion |
|---|---|---|---|
| **ККС-5 plate entrance** (rd 01) | `IntersectionObserver` adds `.in` when the plate is 35 % visible; rows fade in from the horizon (far row first), `--i`·0.13 s delay, 0.55 s each, once | plate fully drawn, static | `animation:none`, wells at opacity 1; JS also skips the observer and sets `.in` immediately |
| **ELISA stepper** (rd 01.1) | six `aria-pressed` buttons + Prev/Next (+ ← → keys on the control group) set `data-step` 1…6; the SVG groups of the current step go to opacity 1, the others 0.22 (plate 0.5); the list of six sentences collapses to the current one (`aria-live="polite"`) | buttons hidden; all six numbered sentences visible in sequence; the SVG shows the whole run (vial, plate with control well, wash, reader, result) | opacity transition disabled; otherwise identical |
| **Vaccine route lane switch** (rd 02.5) | three radios (весь маршрут / лаборатория / птица) set `data-lane`; the other lane's motif, nodes and step cards dim to 0.22 / 0.35 | radios hidden; all four steps with their lane labels visible, full motif | transition disabled |
| **Biobank rows** (index 04) | native `<details>`; first row open | identical (native) | the chevron rotation transition is disabled |
| **Partners chooser** (index 08) | four radios set `data-who`; only the matching offer card stays, a «Показать всех четырёх адресатов» button resets | all four cards visible; radios are plain form controls that do nothing | n/a |
| **Mobile menu** | `<details>` closes after a link is chosen | native `<details>` | n/a |

Keyboard: every control is a native `<button>`, `<input type=radio>` or `<summary>`; `:focus-visible` draws a 2-px
`--ref` outline (labels wrapping radios use `:has(input:focus-visible)`). Meaningful SVGs have `role="img"` + `<title>`
(+ `<desc>` for the two diagrams); the five table wells are `aria-hidden`. No autoplay, no scroll-jacking, no overlay.
Build audit (`tools/audit_build.js`): 0 failures; no-JS visible text equals with-JS on index and exceeds it on rd (the
stepper shows one sentence with JS, six without).

## 4. The ККС-5 plate formula (accepted, `NOTES_v2_kks5_motif.md`, unchanged)

Row r = 0…7 (near → far), column c = 0…11, t = r/7:

    q  = 1 / (1 + 1.8·t),  q₇ = 1 / 2.8
    x  = 280 + (c − 5.5)·42·q
    y  = 310 − 250·(1 − q)/(1 − q₇)
    rx = 11·q,  ry = 7·q

Control points reproduced by the build script: well(0,0).cx = 49, well(7,0).cy = 60, rx₇ = 3.929. Colours by column:
c 0–2 `#24305F` navy, 3–5 `#5282BE` blue, 6–8 `#97B5DC` light blue, 9–11 `#A6B1BE` grey (scheme № 3). Well (r 0, c 0)
is white with a 1.5-px navy stroke, rx/ry reduced by 0.75 so the outer size matches — the negative control. A 1-px
`#97B5DC` horizon line at y = 60. viewBox `0 40 560 290`. Each row is a `<g class="pr" style="--i:7−r">` so the entrance
runs from the horizon. The same SVG stands in the index «Программа 1» card (static) and as the opening image of rd 01
(with entrance). The КП table uses one 16 × 11 ellipse per marker: navy / blue / `#749BCD` / light blue / grey.

## 5. The vaccine-programme motif (formula-built, same discipline)

One SVG, viewBox `0 0 720 270`, two lanes:

- **Laboratory lane** (left, above the bench line): a flat 12 × 8 plate, `cx = 60 + 12c`, `cy = 40 + 10r`, r = 3.6,
  columns 0–5 `--ink-3`, 6–11 `--c-grey`; plate frame 160 × 92 at (40, 26); bench line y = 126 from x 24 to 330.
- **Bird lane** (right, below): a drinking line — pipe y = 170 from x 400 to 700 with end posts; nipples k = 0…9 at
  `x = 418 + 30k` (8-px stems) with a drop ellipse (rx 2.6, ry 4) at y = 184 in brand blue `#244191`; the flock as a
  staggered grid of 3 × 10 dots, `cx = 418 + 30i + 15·(j mod 2)`, `cy = 208 + 18j`, r = 3.4, `--ink-3`.
- **Route**: a brand-blue path from node 1 (100, 212) → node 2 (220, 212), rising to node 3 (480, 60) → node 4 (620, 60);
  nodes are 16-px white circles with mono numbers. Nodes 1–2 carry class `ln-lab`, 3–4 `ln-bird`.

It reads as bench + poultry house: plate, bench, drinking line, flock. No bird clip-art, no syringe. In the index card the
same SVG is used without labels and without the route path (`.route__svg--card`); on phone the lane labels are hidden
(the step cards carry them).

The ELISA stepper SVG (viewBox `0 0 720 300`): vial at x 40–84; flat plate 348 × 208 at (130, 52) with wells
`cx = 150 + 28c`, `cy = 72 + 24r`, r = 8 — control well (0,0) navy, sample wells grey; four wash waves; reader 160 × 200
at (520, 60) with a dashed threshold line and two bars; text only «ККС-5», «фотометр», «КП ≥ 3».

## 6. Число → пункт SUBSTANCE (every number on both pages)

| число на странице | где | пункт SUBSTANCE |
|---|---|---|
| ООО «БМК групп», ОГРН 1242300007586, ИНН 2378000096, КПП 237801001 | contacts, footer | §1.1, §1.2 |
| 354340 … Триумфальный пр-д, д. 1, помещ. № 2-036, раб. место 2-036/45 | contacts | §1.4 |
| +7 908 632-50-48, ceo@bmc-gp.com | contacts, footer, partners | §1.5 |
| свидетельство АА № 000093 от 05.04.2024 | eyebrow, contacts, footer | §1.9 |
| 9 методик | hero figure, partners | §6.2 (nine ready methods) |
| 155 наборов; 130 для крови и 25 для плазмы; три отделения реанимации (три центра) | hero, 02, 03, margin note 1, partners | §6.3 |
| 8 цветокодированных криобоксов на каждый центр | 02, 03 | §6.3 (eight per site; HANDOFF §2.8) |
| 27 и 52 этикетки на набор | 03 | §6.3 |
| 2 400 этикеток криопробирок (margin note 2) | 03 | §6.3: 1 400 + 500 + 500 |
| −70…−86 °C | 03 | §6.3 |
| 357 криобоксов, два морозильника | hero, 04, margin note 3 | §6.4 (357 boxes; freezers #1 and #3) |
| 29 СОП, 81 форма (margin «29 + 81») | 05, note 4 | §6.1 |
| ОФС.1.7.2.0006.15; ЕЭК № 89; WOAH 1.1.9; МУК 4.2.2029-05; ЕЭК № 89, гл. 2 | 05.1 | §6.2 rows 1, 4, 5, 7, 8 |
| 28.10.2026 (станция ИФА), 30.10.2026 (изохронная постановка) | 02, 05, 06, rd 01.3, note 5 | §3.1.9, §3.1.8 |
| 2 бокса БМБ-II «Ламинар-С»-1,5 NEOTERIC; ПЦР-бокс; 2 STE-23-D; Sartorius arium mini; Millipore Direct-Q 3; Eppendorf 5424R/5804R; 4 × Haier DW-86L338, 338 л, −86 °C; 2 × Thermo CY50935-70; 5 сосудов Дьюара; ППА-01 ПРОПЛАН; Mindray MW-12A; Thermo Multiskan FC; «Лазурит»; Biosan TS-100/TS-100C; 15 DEZAR-KRONT | 06, note 6 | §6.5 |
| III–IV группы ПБА; четыре публикации 2022–2024; два сертификата ICH GCP E6(R3) от 18.06.2026 | 07 | §5.1 |
| 5 000 000 ₽; договор № 2ГС1МедС26/106630 от 07.10.2025 (7 октября 2025 года); «Старт», «Старт-Медизделия-1»; вся сумма в 2025 году; федеральный проект | 01, rd 01.5, rd note 4 | §2.1, §2.2, §3.3 (programme-name correction) |
| 15 000 000 ₽ + 3 000 000 ₽; 2026–2028; 1 / 7 / 7 млн ₽; конкурс 26-803-05360-1-0164; госпрограмма «…Сириус» | 01, rd 02.6, rd note 7 | §2.3 |
| НИОКТР 16.11.2026 – 31.12.2028 (16 ноября 2026 – 31 декабря 2028) | hero card, partners, rd 02.5, rd note 6 | §2.3 |
| пять маркеров; флакон 5 мл; +2…+8 °C; КП ≥ 3 (не ниже 3); разброс ОП ≤ 10 % | rd 01, 01.1, stepper | §3.1.1, §3.1.2, §3.1.12 |
| ККС-5-П01: 30 флаконов × 5 мл, 168,7 мл; 2–4 (02–04) сентября 2026 | 01, 02, rd 01.2, rd note 2, partners | §3.1.4 |
| 03.09.2026; КП 4,4 (n = 3, ОП 0,498, ОПкрит 0,114, 450/620 нм); 6,2 (n = 4); анти-ВИЧ-1/2 «выше верхнего предела измерения фотометра» (n = 4); ≈11 (n = 4); 3,8 (n = 4) | rd 01.2 table | §3.1.5, §3.1.6 (wavelength); HANDOFF §2.8 for the anti-HIV wording |
| 27.08.2026, 31.08.2026, титр не ниже 1:128 | 02, rd 01.2, rd note 1 | §3.2 |
| 01.09.2026; ГОСТ 7.32-2017; рег. № 1/26 | 02, rd 01.2, partners | §3.1.10 |
| 04.09.2026; +45 и +37 °C; целые флаконы 5 мл | 02, rd 01.3, rd note 3 | §3.1.8 (the +55 °C arm is closed and is not printed) |
| 16.10.2026, план v3 (редакция 3), слепая, de novo | 02, rd 01.3 | §3.1.11 |
| к 08.10.2026 | 02 | §6.3 (kit summary file dated 08.10.2026) |
| 12 месяцев при +2…+8 °C; 5–10 минут (margin note 5) | rd 02.4 | §4.8 (target profile, printed as a plan) |
| технопарк «Сириус», корпус 7 | rd 02.5 | §4.12 |
| три целевые инфекции кур; четыре шага плана | rd 02.2, 02.5 | §4.6 (diseases by name), BRIEF2 §4 plan steps |
| форум V «Сильные идеи для нового времени» | 04 | §2.6 |
| ordinal numbers 01…09, 01.1…02.6, step numbers 1–6 / 1–4, margin-note numbers 1–7 | — | page structure, not facts |

Not on the page: ≈30, 95,8 %, 343/357, 420 labels, 11 encodings, residual HBsAg titre, +55 °C arm, any bid forecast,
any registration date, any name, the donation ID, any client / sponsor / hospital / subcontractor.

## 7. Which text Claude wrote (everything else is v2 verbatim)

- ELISA stepper sentences 1, 3, 4, 5 (`«В постановку материал вносят готовой жидкостью из флакона: один флакон 5 мл
  закрывает пять маркеров»`, `«Контроль проходит инкубацию на том же планшете и в тех же условиях, что и образцы»`,
  `«Промывка планшета — шаг постановки, общий для контроля и образцов»`, `«Фотометр читает оптическую плотность лунок
  контроля и образцов»`); sentences 2 and 6 are v2 sentences from the scheme caption. Step names: ККС-5, Внесение,
  Инкубация, Промывка, Фотометр, КП / Коэффициент позитивности (from the v2 scheme labels). Buttons «← Предыдущий шаг»,
  «Следующий шаг →».
- Lane switch: «Показать дорожку маршрута», «Весь маршрут», «Лаборатория», «Птица»; caption «Маршрут плана работ по
  вакцинам для кур: два шага в лаборатории, два шага на птице»; index card caption «Планшет лаборатории, линия поения и
  поголовье — маршрут плана по вакцинам для кур».
- Biobank row titles: «Состав коллекций» (v2), «Протоколы и передача материала», «Биобанк клеточных культур».
- Chooser: «Выберите адресата», «Производителю тест-систем», «Птицеводческой компании», «CRO и лаборатории», «Фонду и
  госпрограмме», «Показать всех четырёх адресатов».
- Margin-note captions (all figures already on the v2 page): «наборов: 130 для крови и 25 для плазмы», «этикеток
  криопробирок; DataMatrix и линейный штрихкод», «криобоксов в двух низкотемпературных морозильниках», «СОП второго
  уровня и формы», «введена автоматическая станция ИФА», «низкотемпературных морозильника −86 °C», «титр анти-HBcore
  после подавления избыточного HBsAg», «серия ККС-5-П01, объём серии 168,7 мл», «плечи ускоренного старения, старт
  04.09.2026», «грант Фонда содействия инновациям, договор от 07.10.2025», «целевой срок годности при +2…+8 °C»,
  «НИОКТР по программе вакцин для кур», «субсидия ИНТЦ «Сириус», график 1 / 7 / 7 млн ₽».
- Plate caption «белая лунка — отрицательный контроль»; skip link «К содержанию»; `<meta name="description">` on both pages.
- Removed from v2: the scheme header «Схема / ККС-5 в цикле измерения» (the stepper replaces it) and the «04.1» sub-number
  (the rows replace it). Nothing else is missing (textdiff: index 0 missing, rd 2 missing — those two).

## 8. Checks (actual output, final build)

```
> node tools/check_concept2.js concepts/C4
### C4  (index.html 70 KB, rd.html 69 KB)
  [WARN] row 8: a year in the regulatory-horizon range … ×7   (2026–2028 plan dates — expected)
  [OK] all 22 vaccine short forms carry a species qualifier
  [OK] index.html: registration stage sentence ×1 (expected once)
  [OK] rd.html: registration stage sentence ×1 (expected once)
  => 0 blocker(s), 1 warning(s)
> node tools/render.js concepts/C4      → 0 render problem(s) (1280 / 390 / 320 / 1280 reduced-motion, both pages)
> node tools/audit_build.js concepts/C4 → 0 build-audit failure(s); contrast 0 below 4.5:1 on both pages
```

Screenshots in `shots/`: `index_1280.png`, `index_390.png`, `index_320.png`, `index_1280-rm.png`, `rd_1280.png`,
`rd_390.png`, `rd_320.png`, `rd_1280-rm.png`. Three visual passes: pass 1 fixed the 16:9 placeholder overflow on
phones (aspect-ratio + min-height), raised all metadata lines to 15 px, added accessible names; pass 2 capped placeholder
height at 1280, stopped nav wrapping, hid the brand tagline on phones, shortened margin notes, hid SVG labels where the
drawing is small; pass 3 lowered the h1 minimum to 30 px so «финансированием» does not break at 320 px.
