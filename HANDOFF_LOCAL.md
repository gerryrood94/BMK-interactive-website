# HANDOFF → local PC session (from the cloud session of 03.11.2026)

Read this first, then `/BMK-website/HANDOFF.md` (the owner's rules — unchanged), then
`BRIEF_INTERACTIVE.md` (this round's brief). Keep both repositories private: the fact repository
names clients, hospitals and people that must never reach a public page.

## 1. What to clone

```bash
git clone -b claude/modest-dirac-7minqd https://github.com/gerryrood94/BMK-interactive-website.git
```

```bash
git clone https://github.com/gerryrood94/BMK-website.git
```

The fact repository was only read in the cloud session; nothing was changed there. All work is on the
branch `claude/modest-dirac-7minqd` of `BMK-interactive-website`. No pull request was opened.

Prerequisites: Node ≥ 18, `npm i playwright sharp` and `npx playwright install chromium` (the cloud box
had them preinstalled). The tools take paths as arguments; the two workflow scripts take
`args.repo`, `args.facts`, `args.scratch` (defaults are the cloud paths `/home/user/...`).

## 2. Where the work stands

| step | state | where |
|---|---|---|
| Brief for a non-Tilda interactive build | done | `BRIEF_INTERACTIVE.md` |
| Five blind concepts (C1–C5), each gate 0 / render 0 | done | `concepts/C1…C5/` (+ `NOTES.md`, `OWNER_INPUTS.md`, `shots/`) |
| Anonymised panel | done | `panel/draft_1…5`, key in `panel/_key.txt` |
| Review: 5 readers + 15 audits → merge brief | done | `panel/MERGE_BRIEF.md` |
| Merge of the winner + grafts | done | `final/` (built by `final/_build_apply.js` from `concepts/C5`) |
| Context-blind verify → fix → re-verify | **done: 3 rounds, round 3 = 0 BLOCK from all five verifiers**; gate 0, render 0, build audit 0 | `final/`, `final/VERIFY_LOG.md` |

**Panel key** (never show reviewers): draft_1 = C4 «Издание», draft_2 = **C5 «Карта того, что есть»**,
draft_3 = C2 «Прибор, под напряжением», draft_4 = C3 «Тёмный планшет», draft_5 = C1 «Горизонт».

**Readers' result** (Borda over 5 readers; «would engage» out of 5):

| draft | concept | Borda | 1st places | engage |
|---|---|---|---|---|
| draft_2 | C5 | 22 | fund, virology lab, CRO | 5/5 |
| draft_3 | C2 | 18 | quality director | 5/5 |
| draft_1 | C4 | 15 | poultry | 5/5 |
| draft_4 | C3 | 12 | — | 4/5 |
| draft_5 | C1 | 8 | — | 3/5 |

**Final = C5 as base** plus these grafts (MERGE_BRIEF §4): the KP-against-threshold scale from C2;
the sticky section index from C2; the method filter by normative document from C2, with the counter
from C3; the context line under the plate from C1; the margin figures from C4; the stage plate from
C3; the short addressee labels from C1; the repeat of the entry point at the end of /rd from C1.
The verification rounds removed the time slider, the step arrows on the ELISA cycle and the mailto
form.

## 3. Decisions the cloud session made that the owner should look at

The fixer applied these after the context-blind readers and auditors flagged them. Each one is a
deletion, and each is recorded in `final/NOTES.md` §9:

- **/rd 02.3 «Научный задел» was deleted.** A reader judged it deeper than the live /rd text. It was
  verified text from version 2; restore it if the owner disagrees.
- **/rd 02.4 «Целевой профиль»** (shelf life, dissolution, lyophilisate) was deleted. These are
  grant-bid targets, which SUBSTANCE §7.2 forbids.
- **«академик РАН»** was removed from the in-vivo lead's credentials (BLACKLIST row 13). The role,
  degree and title remain.
- **The /rd 01.3 sentence about the isochronous run of 30.10** was removed, because SUBSTANCE has no
  result for it yet.
- **The footer line «Подтверждающие документы предоставляются по запросу и на аудите»** was removed.

These findings were **rejected** because they contradict the owner's rules. The cold readers will
keep raising them:

- delete the photo placeholders (HANDOFF §2.7);
- give a number for anti-HIV-1/2 (§2.8);
- add names (§2.5) or a registration date or number (§2.3);
- remove the logo slot (§2.10);
- rename «лаборатория группы компаний» as the company's own lab, which would be false because
  SUBSTANCE §6.5 says the equipment is leased.

## 4. What is left

1. **Round-3 polish: done** (`final/NOTES.md` §11). The verification is complete; nothing from the
   rounds is open except owner inputs. **Do not apply** the round-3 fact-check WARN that asks to restore
   «работоспособность подхода подлежит экспериментальной проверке» on /rd: it is a hedge (BLACKLIST).
   To run another verify round locally, start Claude Code in the repo and run
   `tools/workflows/final.js` (args `repo`, `facts`, `scratch`, `base: "concepts/C5"`, `grafts`, `round0`);
   its Merge phase rebuilds `final/` from the base, so for a verify-only pass drop that phase.
   `final/_build_apply.js` rebuilds `final/{index,rd}.html` from `concepts/C5` byte for byte; edit it,
   not the HTML, so the build stays reproducible.
2. **Owner inputs.** `final/OWNER_INPUTS.md` carries the 31 original items plus the new ones (49 in
   all). Every one of them is silent on the page until the owner supplies it.
3. **Photos and logo.** Use shots A1, A2, B1, B2, B5, B8, B9, C3, D1, E1 (`PHOTO_SHOTLIST.md`) and
   the logo file. Each `.ph` placeholder is replaced by an `<img>` with the same caption.
4. **Hosting, domain and form backend.** These are owner decisions (OWNER_INPUTS). The site has no
   form now: contact goes by mailto.
5. **Deploy.** Copy `final/index.html` → `/`, `final/rd.html` → `/rd`; `/privacy` stays on the live
   site.

## 5. Checks (all must stay at zero)

```bash
node tools/check_concept2.js final
```

```bash
node tools/render.js final
```

```bash
node tools/audit_build.js final
```

The gate's only expected warning is the 2026–2028 plan dates. Phone renders use Playwright device
emulation, because headless Chrome ignores widths below ~500 px. To shrink new screenshots before
committing, run `node tools/quant.js final/shots/*_1280.png final/shots/*_390.png`. The 320 px and
reduced-motion renders are gitignored.

## 6. Tooling in this repository

| file | what |
|---|---|
| `tools/check_concept2.js` | the gate (blacklist, confidential identifiers, depth, names, species qualifier, numbers, external scripts) |
| `tools/render.js` | Playwright renders 1280 / 390 / 320 / 1280 reduced-motion; overflow, JS errors, external requests |
| `tools/audit_build.js` | no-JS completeness, motion under reduced motion, focus, contrast, type size |
| `tools/textdiff.js` | text diff between two pages |
| `tools/anonymise.js` | seeded shuffle of `concepts/*` into `panel/draft_N` |
| `tools/quant.js` | 256-colour PNG quantisation (needs `sharp`) |
| `tools/workflows/review.js` | review workflow: 5 readers + per-draft blacklist/fact/build audits → `panel/MERGE_BRIEF.md` |
| `tools/workflows/final.js` | final workflow: merge → verify (facts, blacklist, build, 2 readers) → fix, up to 3 rounds + closing check |
| `tools/verified_text/` | the accepted version-2 text, stripped |

The fix prompt in `final.js` lists the owner decisions that outrank every finding. From round 2 on,
readers are told which two points (photo placeholders, anti-HIV wording) are not open for discussion.

## 7. Git conventions used

Commits end with the `Co-Authored-By` and `Claude-Session` trailers. No model names appear in
repository files. No pull request is open: open one only when the owner asks.
