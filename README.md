# bmc-gp.com — interactive version (not built on Tilda)

A hand-built static site for ООО «БМК групп»: two pages (`index.html` → `/`, `rd.html` → `/rd`),
self-contained HTML with inline CSS, inline SVG/canvas graphics and inline JavaScript. The only
external resource is Google Fonts. `/privacy` stays as it is on the live site.

Facts, rules and reviewers are the ones established in the owner's handoff
(`gerryrood94/BMK-website`, `HANDOFF.md`). This repository holds the **build**, not the fact base:
keep both repositories private.

**Continuing on a local PC: start with `HANDOFF_LOCAL.md`.**

## Layout

| folder | what |
|---|---|
| `BRIEF_INTERACTIVE.md` | the brief for this round — what a non-Tilda build may do, interaction rules, deliverables |
| `concepts/C1…C5/` | five independent design concepts written blind to the same brief, each with `index.html`, `rd.html`, `NOTES.md`, `OWNER_INPUTS.md`, `shots/` |
| `panel/` | the anonymised drafts the reviewers saw (`draft_N`), the key (`_key.txt`), and `MERGE_BRIEF.md` — the host's synthesis of five readers and three auditors per draft |
| `final/` | the merged version: pages, `NOTES.md` (structure, devices, formulas, число → пункт SUBSTANCE), `OWNER_INPUTS.md`, `shots/`, `VERIFY_LOG.md` (every verification round, applied and rejected findings) |
| `tools/` | `check_concept2.js` (the gate), `render.js` (Playwright renders at 1280/390/320 and reduced motion), `audit_build.js` (no-JS, keyboard, motion, contrast), `textdiff.js`, `anonymise.js`, `quant.js` (PNG quantisation), `workflows/` (the review and final-build workflow scripts), `verified_text/` (the accepted version-2 text) |

## Checks

```bash
node tools/check_concept2.js final      # 0 blockers; one expected warning (2026–2028 plan dates)
node tools/render.js final              # 0 render problems; screenshots in final/shots/
node tools/audit_build.js final         # 0 build-audit failures
```

Headless Chrome ignores window widths below ~500 px; `render.js` uses Playwright device emulation
for the phone renders.

## Review pipeline used

Blind concepts (five authors, five hypotheses) → anonymised and shuffled → five business readers
(fund expert, university virology lab head, CRO development director, test-kit quality director,
poultry agroholding deputy GD) rank all drafts; a blacklist auditor, a fact checker against
SUBSTANCE and a build auditor examine each → the host writes the merge brief, striking any remedy
that would add an admission → the base is merged with admissible grafts → context-blind
verification (facts, blacklist, build, two cold readers) → fix → re-verify.
