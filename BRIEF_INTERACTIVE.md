# BRIEF — интерактивная версия bmc-gp.com (03.11.2026, облачная сессия)

Written by Claude for this round. The owner's decisions it rests on are in
`/home/user/BMK-website/HANDOFF.md` §2 — read that file first, then this one. Nothing here
overrides HANDOFF, BRIEF2, BLACKLIST, KKS5_BRIEF or SUBSTANCE; this brief only adds what the
cloud session is free to do now that the site is **not built on Tilda**.

## 1. Task

Design and build a new version of the company site as a **hand-built static site with inline
JavaScript**: two pages, `index.html` (`/`) and `rd.html` (`/rd`); `/privacy` stays as it is on
the live site. Same facts, same rules, same reviewers as the accepted version 2
(`/home/user/BMK-website/03_current_prototype/`) — a different build, and freedom to use what
Tilda could not:

- real responsive layout (CSS grid, container queries, `clamp()`), 320–1280 px without
  horizontal scroll, phone first;
- **interactive, formula-built graphics**: inline SVG and `<canvas>` driven by inline JS —
  scroll-driven perspective, hover/focus exploration of diagrams and tables, animated
  transitions, a chronicle you can scrub, a method matrix you can filter. All of it must
  **degrade to a complete static page** without JS and under `prefers-reduced-motion: reduce`;
- variable fonts via Google Fonts (one `<link>`), self-hosted none;
- print stylesheet; dark mode optional (if used, every text role ≥ 4.5:1 on its background);
- any build step you like, but the **deliverable is self-contained HTML** that opens by double
  click: no external scripts, no external CSS, no external images, no analytics, no fonts other
  than Google Fonts. The gate (`tools/check_concept2.js`) blocks any `<script src>` that is not
  Google Fonts. Inline `<script>` is allowed and expected.

## 2. What does not move (summary — the full text is in HANDOFF §2)

1. **«Tell the reader what we have.»** No absences, no empty cells, no «how to read», no
   «честно», no «это X, а не Y», no page talking about itself. `02_briefs/BLACKLIST.md` — 25
   rows — is law. Interactive devices are subject to it too: an animation that dramatises a gap,
   a counter that stops at zero, a "nothing measured yet" state — all inadmissible.
2. Audience: fund / state-programme experts and scientific partners.
3. ККС-5 **проходит государственную регистрацию как медицинское изделие** — one sentence of
   stage per page, no forecasts, no dates of registration.
4. Veterinary vaccines **for poultry only**: a species qualifier («для кур», «для птицы») in
   every heading, nav item, `<title>`, `<meta>`, caption, link text, button and `alt` that
   mentions vaccines. No human-vaccine disclaimers.
5. **No personal names.** Roles + degrees + institutions. Nothing about why names are absent.
6. Depth: achievement and numbers, never protocol; vaccine platform no deeper than
   `01_facts/live_site_rd_text_30.10.2026.txt`. Diseases by name, not antigens.
7. **No ККС-5 photo; no AI images; no raster where SVG will do.** Photos are placeholders
   captioned with shot numbers from `02_briefs/PHOTO_SHOTLIST.md` (shot C1 cancelled). Keep
   the `.ph` idea: a gridded field with the shot code and a caption that names what the shot
   will show — not the word «заглушка».
8. **Numbers only from SUBSTANCE**, same denominator and precision. anti-HIV-1/2 is «выше
   верхнего предела измерения фотометра», never ≈30. Eight cryoboxes per centre. Do not
   multiply 357 by anything. Every number on the page must appear in your NOTES.md table
   «число → пункт SUBSTANCE».
9. **ККС-5 brand motif**: the 96-well plate receding to a horizon, colour scheme № 3 —
   navy `#24305F`, blue `#5282BE`, light blue `#97B5DC`, grey `#A6B1BE`; one white outlined
   well = negative control; SeraMatrix wordmark not used; the plate is deterministic
   (formula-built SVG, formula in NOTES). The accepted formula is in
   `03_current_prototype/NOTES_v2_kks5_motif.md`. You may animate it (perspective changes with
   scroll, wells light up as the КП table is explored, the horizon moves) — the geometry stays
   formula-built. The **vaccine programme needs its own motif** of the same discipline (a
   formula-built SVG that reads as poultry husbandry / laboratory, not medicine; not a bird
   clip-art; not a syringe; drinking-line, flock grid, feed line, lab bench, plate are fair).
10. Style «Прибор» (`02_briefs/TOKENS_pribor_style.md`) is the current visual system. **You may
    propose a different system**, but say in NOTES what you keep and why. The brand blue
    `#244191` and the logo slot are givens. `--alarm` red is not used anywhere.

## 3. Text

The text of the accepted version 2 is verified line by line and **may be reused verbatim**:
`tools/verified_text/index.txt` and `tools/verified_text/rd.txt` are the stripped texts;
`/home/user/BMK-website/03_current_prototype/{index,rd}.html` is the markup. If you rewrite or
restructure, every number must still trace to SUBSTANCE and the blacklist still applies; say in
NOTES which text Claude wrote. Russian, real text, no lorem ipsum, no «здесь будет».

Structure is a recommendation (BRIEF2 §5), not dogma: home — hero (who, where, two programmes
with stage), two programme cards → /rd, operational practice, biobank, quality & methods,
equipment, team by roles, partners & funds, contacts; /rd — ККС-5 (task → done with numbers and
dates → in progress → stage → funding; application diagram instead of photo) and the poultry
platform (idea → target diseases → groundwork → plan with dates → funding → stage) → how to start.

## 4. Interaction rules

- Every interactive element is reachable by keyboard and has a visible focus state; every SVG
  that carries meaning has `role="img"` and a `<title>`; decorative ones `aria-hidden="true"`.
- No scroll-jacking, no fixed full-screen overlays that trap scrolling, no autoplay that cannot
  be paused, nothing that moves for more than 5 s without user action unless
  `prefers-reduced-motion` is respected (it must be).
- No JS errors in the console; the page renders complete with JS disabled.
- Phone: 320 and 390 px without horizontal scroll, type never below 15 px for sentences.
- Contrast ≥ 4.5:1 for all text; ≥ 3:1 for meaningful graphics.
- Performance: the two pages together under 600 KB of HTML; no per-frame layout thrash
  (use `requestAnimationFrame`, `IntersectionObserver`, CSS transforms).

## 5. What you deliver (in your concept folder)

- `index.html`, `rd.html` — self-contained;
- `NOTES.md` — structure in five lines; what you kept from «Прибор» and what you changed;
  every interactive device and what it does without JS / under reduced motion; plate formula;
  table «число → пункт SUBSTANCE»; which text Claude wrote;
- `OWNER_INPUTS.md` — only **new** questions beyond `01_facts/OWNER_INPUTS.md` (31 items);
- gate output: `node tools/check_concept2.js <your folder>` → **0 blockers**, the 2026–2028
  plan-date warning is the only expected one;
- render output: `node tools/render.js <your folder>` → 0 problems, screenshots in `shots/`.

Phone renders: headless Chrome ignores window sizes below ~500 px; `tools/render.js` uses
Playwright device emulation, which is correct.

## 6. Acceptance tests (BRIEF2 §7, adapted)

1. Ten seconds: after the first screen the reader knows what the company does, the stage of
   both programmes and what the lab has.
2. Species test: hide the body text, keep headings/menu/captions — human vaccines cannot be
   thought of.
3. Blacklist: no match in 25 rows — including in interactive states and animations.
4. Stage test: each programme's stage is named once per page, in words, no forecasts.
5. Numbers test: every number on the page is in NOTES with its SUBSTANCE item.
6. Phone test: 320 and 390 px.
7. Build test: opens by double click, no external scripts, no JS errors, complete without JS.
8. Offer test: a partner and a fund expert find what they are offered and how to start.
9. Motion test: with reduced motion the page is complete and still; without it, nothing moves
   that the reader did not cause, except one entrance animation per section at most.
