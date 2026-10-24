# Current status — 24 October 2026

The pilot-only narrative below is historical. OS-01 was accepted and the full current theory extension is implemented, independently reviewed and published on the existing Sites preview. Original portal entry/logo changes passed local checks. The connector returned 403, but ordinary Git push subsequently succeeded with the existing Eyad-Ahmed-Kamal Git Credential Manager login; no owner permission change is required. The feature branch is remote and scoped PR/CI/merge/Pages verification is in progress. See os-course-review.md and os-course-state.json for current evidence. The continuation remains at its observed PAUSED state until final completion.

# OS-01 pilot review and delivery

Updated: 23 October 2026 (Africa/Cairo); initial delivery: 22 October. Slice: `os-01-review-preview`, current lesson `os-01` v1.1.0 and guide `sem2-os-teaching` v1.1.0, accepted design v0.3 with the user's subsequent language/glossary feedback applied within the same slice.

Status: **local preview ready; awaiting Eyad's teaching/usability feedback**. Independent AI content review and its substantive recheck passed. Fresh technical review findings were fixed and the focused checks passed. Feedback is still required before the already-authorized scoped PR/merge. No publication, root integration or later lesson is complete.

## Use the preview

From the repository root run `npm start` if the existing local server is not running, then open:

http://127.0.0.1:8765/education-preview/os/

The existing server also serves the `/Sem2_portal/education-preview/os/` prefix for the future Pages subpath. All runtime assets are local, including the existing font CSS at `../../css/fonts/fonts.css`. No package, vendor, catalog, production HTML or storage contract was changed. Sources on Drive remain external links.

The student can read prerequisite vocabulary and four role explanations, operate a labelled role diagram, follow a report-writing scenario, compare allocation/control and kernel/bundle distinctions, answer eight selection-based checks, read correction/reasoning, reset the page session, consult an essay answer, open the selected source slides and use a final glossary of 19 terms with English definitions and Egyptian explanations. Attempts are only in the open page; reload/reset clears them. No typed answer, AI grading, durable progress or mastery claim exists.

## Sources and coverage

Current course/lecture identity is `operating-system` / `1`.

- [Current Chapter 1 original PPTX](https://drive.google.com/file/d/14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M/view), SHA-256 `c81ae8d50d261ffbd4c78ebf75b42f3f980c50298bba19b32f5779b3d1745e7b`.
- [Historical question sheet](https://drive.google.com/file/d/1WkxnixBAGrYr-G9Nzv5FOuurlRsUZxm3/view), downloaded PDF SHA-256 `9691266905ffab485ccaf40449348830a12c8c5da4d72d2a98519597034e10e9`.

Original bytes were preserved. Slides 4-8 were rendered from the existing 31-page PDF conversion at 1600×1200, visually inspected and compared with source text/PPTX XML. Their titles, numbering and textbook credit remain visible. These are local conversion renderings, not native slide exports. Full-size PNG links support small screens; the Arabic text explains the concepts without requiring students to read a tiny image.

| Current slide | Learner location | Coverage |
| --- | --- | --- |
| 4 | `#roles`, `#role-map`, report story | User/program/OS/hardware abstraction; explicit direction/meaning/limits of authored arrows |
| 5 | `#resources`, `#roles`, report story | Bounded CPU/RAM/storage/I/O vocabulary; resource provider, coordination, application task and human/non-human users |
| 6 | `#purpose` | Intermediary role, execution/convenience/efficiency goals |
| 7 | `#purpose`, allocation/control checks | User/system views; resource conflicts, efficient/fair allocation, control goals rather than an error-free guarantee |
| 8 | `#kernel`, mixed checks | Kernel versus bundled system/application programs; no universal OS boundary; always-present does not mean exclusive/100% CPU execution |

The kernel resource-purpose paragraph is an introductory synthesis of slides 5/7/8, and now links to all three. No scheduling algorithms, syscall mechanics, fork, IPC or practical terminal runner was added. Covers/objectives/end pages are not trivia targets.

## Assessment record

| Stable item ID | Type / objective | Current slides | Provenance / independently solved answer |
| --- | --- | --- | --- |
| `roles-report` | MCQ / application role in report formatting | 5 | New / `app` (C) |
| `users-machines` | True/false / non-human user | 5 | New / `true` |
| `allocation-conflict` | MCQ / coordination of limited resources | 5,7 | New / `os` (B) |
| `control-guarantee` | True/false / control goal versus absolute guarantee | 7 | New / `false` |
| `view-response` | MCQ / identify user view in a new observation | 6,7 | New / `user-view` (A) |
| `historical-kernel` | MCQ / broad kernel purpose | 5,7,8 | Original sheet Q1, PDF page 1 / `resources` (B) |
| `bundle-kernel` | MCQ / diagnose bundle implies kernel inference | 8 | New, substantively revised and rechecked / `system-program` (D) |
| `four-components-adapted` | MCQ / distinguish role list from hardware subcomponents | 4,5 | Adapted from sheet Q14, PDF page 2 / `four-roles` (C) |

Q1's original wording/options are preserved in its disclosure; its displayed solution is independently reviewed, not labelled an official key. Q14's original essay wording is preserved separately, with a supplied authored answer. Its MCQ adaptation explicitly labels the change and new distractors. Archive location/title do not establish exam date, official authorship or an official answer key. Only Q1/Q14 were accepted for this slice; other archive items were not imported.

All 28 selectable options have feedback. The six MCQ correct positions are C/B/A/B/D/C; true/false includes one true and one false. Four inline questions and four mixed checks cover different observations rather than repeating all stems. The count follows coverage, not a per-slide target.

## Independent AI content review

Reviewer: a separate context (`/root/content_review`), without the author's conversation. It visually inspected all five source slides and both historical PDF pages, checked fingerprints and original PPTX XML, then applied the accepted rubric and project-local teaching guide.

It first solved the eight candidate items from a snapshot with keys/feedback removed and saved those solutions **before** reading the authored keys. The snapshot still included teaching prose and Q14's essay answer, so this is independent key solving, not complete blinding. Initial solutions remain unchanged, SHA-256 `ba474fe31b00aa3437a1c0164593b8582c320e0fa4582abbbfbadb0fa3cdd4d8`.

All eight initial keys and 28 feedback entries agreed scientifically. Two required findings were addressed:

1. **C1: `bundle-kernel` gave away its answer and used weak distractors.** Replaced with diagnosis of a student's bundle-implies-kernel claim and plausible taught software distinctions. Reviewer independently selected D before comparing the revised key, then checked all four revised options and rendered feedback paths.
2. **C2: the kernel resource-purpose paragraph needed combined evidence.** Added slides 5/7/8 anchors in the payload and rendered section. The reviewer verified them.

The recheck passed both findings and inspected eight desktop/mobile screenshots: diagram semantics/limits, qualified kernel wording, correction states and source access. No required content issue remains. An optional refinement to the first stem's “defines the text-formatting task” wording was not required: its intended application answer and user/application distinction are explained.

This is evidence-based AI review, not lecturer/TA approval, scientific certification, official marking or measured learning effectiveness. Eyad's clarity/student-experience review remains separate.

Durable detailed evidence, kept in the ignored local QA directory rather than published as runtime content:

- `test-results/education/os-pilot/independent-solutions.json`
- `test-results/education/os-pilot/independent-content-review.md`
- `test-results/education/os-pilot/independent-content-recheck.md`
- `test-results/education/os-pilot/independent-ui-observations.json`
- `test-results/education/os-pilot/independent-*.png`

## Focused technical evidence

Executed with installed Node 24.13.0 and Playwright 1.62.1 using installed Edge (`channel: msedge`). No browser/runtime dependency upgrade was needed. The default Playwright downloaded browser was absent, so the installed browser channel was selected. The generic skill validator required PyYAML; it was installed only into ignored QA support files and passed with a scoped `PYTHONPATH`.

| Command/check | Observed result |
| --- | --- |
| `node education-preview/os/validate.cjs` | Pass: four concepts, exact slides 4-8, eight items, stable unique IDs, valid keys, complete feedback, supported formats and source/provenance links |
| `node --check` on new JS/CJS files | Pass |
| Skill creator `quick_validate.py` | `Skill is valid!` |
| `node education-preview/os/verify.cjs --practice` | Pass: reading, original/local source links, keyboard role controls, correct/incorrect MCQ/TF feedback, empty-answer guidance, locking/score/reset, fresh reload/no stored attempts |
| `node education-preview/os/verify-language.cjs` | Pass: English language contexts for all 28 options; Arabic true/false glosses, including incorrect-answer correction, retain Arabic language |
| `node education-preview/os/verify-layout.cjs` | Pass: 360/390/412/1280px, 112 option paths, touch/keyboard focus, no horizontal overflow, source disclosure/image access and no page/resource errors |
| Text resizing | Pass: simulated 200% computed text sizes at 390px; 200% desktop-page-zoom equivalent 640px CSS viewport. These are simulations, not a physical mobile/browser zoom certification |
| Pages prefix / JavaScript disabled | Pass: relative asset path at `/Sem2_portal/education-preview/os/`; visible no-JS notice and usable source fallback |
| Preservation comparison | Pass: all 282 tracked and 326 pre-existing local files byte-identical; all accepted planning hashes and original source still match; new files restricted to allowed paths |

Meaningful initial failures were retained: validator missing payload; preview route 404 before page implementation; absent feedback before correction/reset behavior. Layout checks initially raced a lazy image decode and then used a Playwright text selector that skips NOSCRIPT; the image wait and direct visible-notice assertion corrected the verification, with no preservation-test weakening.

Screenshots were actually viewed by the executor at desktop/mobile, including role labels/arrows, correction and text resize, plus the independent reviewer screenshots. Generated captures/logs and JSON results are under `test-results/education/os-pilot/`. Focused checks establish software behavior, not scientific correctness or actual student learning. The broader production suite was not rerun because this isolated slice preserves production bytes and introduces no production seam.

### Fresh technical review and corrections

A separate reviewer context (`/root/technical_review`) read the actual untracked feature against the plan/spec and independently exercised 112 option paths, 360px keyboard MCQ/TF/reset, all five subpath assets and preservation hashes. It found no Critical issue. Its initial verdict was With fixes:

- **Important: English answer options inherited Arabic language metadata.** Corrected English option spans and retained explicit Arabic language on the true/false glosses, including the displayed correct answer. `verify-language.cjs` failed first, then passed. This verifies semantics; actual screen-reader voice output was not measured.
- **Minor: a repeated source anchor left the same slide closed after manual collapse.** Fixed within the same bounded pass because source comparison is a core learner action in this preview. `verify.cjs` reproduced the closed-disclosure failure, then passed with click activation opening the matching source even when the URL hash is unchanged. This small extra fix/check was chosen instead of carrying a known source-navigation defect into the review preview; no external scope changed.

Both fixes were made by the executor. The reviewer preserved its original findings and inspected the separate RED/GREEN logs; it did not perform a second independent implementation review. The executor reran the full focused layout/practice/language/data checks after the fixes. Detailed original review: `test-results/education/os-pilot/independent-technical-review.md`.

The review explicitly set aside broader claims: scientific/human learning certification is not established by technical checks; production integration/durable state remain outside this slice; merge/live hosting wait for feedback; unrelated production behavior is covered here by byte preservation rather than new regression claims. These boundaries are accepted, and their cost is that this preview is neither a learning-effectiveness study nor a deployed/integrated release. No required technical finding remains; no optional technical finding is left unresolved.

## Changes and execution decisions

New preview files: `index.html`, `style.css`, `lesson.js`, `lesson-data.js`, five `sources/slide-0N.png` images, `validate.cjs`, `verify.cjs`, `verify-layout.cjs`, `verify-language.cjs`, `verify-glossary.cjs`, all under `education-preview/os/`.

New authoring guide: `.agents/skills/sem2-os-teaching/SKILL.md` and `references/os-01.md`. New delivery records: this report and `docs/education/os-pilot-state.json`. Generated logs/screenshots/raw historical download/helper dependencies are ignored QA output. No raw deck, unrelated design exploration or manager planning record is staged for publication.

The requested existing checkout is retained on `codex/os-education-pilot`; no worktree copy, reset or dependency reinstall occurred. The dispatch's exact allowlist/checkpoint and focused checks take precedence over generic skill scratch paths or broad suite/commit conventions. Feature output remains uncommitted until preview acceptance. Cost/limit: preservation relies on the saved byte hashes, and unrelated runtime behavior was not newly exercised. This plan's evidence is retained through feedback rather than deleted by a generic finish workflow.

The existing target-thread hourly continuation (`os`) was read back, not duplicated. The reviewer encountered an allowance failure; after the user's explicit continuation instruction, live usage reported ordinary usage allowed and the reviewer resumed. This demonstrates a resumed review after allowance became available; it does not prove exact reset-triggered automatic recovery. The automation stays quiet at the human feedback gate.

## Remaining gates

The checkpoint is `awaiting_preview_feedback`. Wait for Eyad's teaching/usability feedback. Only after that feedback is accepted/resolved and checks pass may the executor use the existing final-merge authorization: scoped commit/push/PR (attach it), required CI, merge, actual Pages deployment/core-interaction verification, checkpoint completion and continuation removal. Root navigation/reader integration and all later OS units/subjects remain outside this slice.

## Hosted friend-review preview — separately authorized 22 October 2026

Eyad subsequently requested an online link so a friend can test the preview and explicitly allowed either Vercel or ChatGPT Sites. This authorizes a separate hosted review copy; it does not resolve the teaching/usability feedback gate or merge the feature into the existing portal.

Published and verified URL: https://sem2-os-lesson-preview.wintrymoose17.chatgpt.site

- Provider: ChatGPT Sites; audience: public, verified through both the access-control response and a fresh anonymous browser context.
- Site ID: `appgprj_6ad99418c1d88191852da594e2ed1532`.
- Saved version 1: `appgprj_6ad99418c1d88191852da594e2ed1532~appgver_bbf913448c988191a387ea6743110436`.
- Deployment: `appgdep_6ad99480e61081918fa664373ecd77ea`, native status `succeeded`.
- Separate Sites source commit: `eef2ca715dd3a04e0a6dc69e85f7aad61fc9e0a4`. This is not a commit or merge in the portal repository.
- The hosted package contains exact copies of the lesson runtime, five selected slide renderings and local fonts/license. A root redirect opens `/education-preview/os/`; a robots file requests no indexing. No planning records, checkpoint, credentials, QA scripts, raw decks or unrelated design artifacts were published.
- Vercel's project-creation call returned a 403 team-scope authorization error. No Vercel project was created and no credential/permission workaround was attempted; the user-approved Sites alternative was used.
- Remote focused practice and language checks passed. Anonymous root access, 390px layout, touch role control, repeated slide-link opening and all 15 copied runtime/asset hashes passed; no page errors. The current hosted mobile screenshot was visually inspected.

Evidence: ignored `hosting-source-manifest.json`, `hosted-practice.log`, `hosted-practice-results.json`, `hosted-sharing-results.json`, `hosted-mobile.png`, and `hosting-deployment.json` under `test-results/education/os-pilot/`. Root portal HEAD remains `199ce9baf0e129abbd59d89f517600229f98b9d3`; the feature is still awaiting feedback.

## Language and glossary revision — 23 October 2026

Eyad rejected dense, literal Arabic wording such as `العتاد`, `هدف المستخدم اتحوّل لمهمة تطبيق`, and `التطبيق يحدد الشغل`. He asked for visible English terminology explained naturally and concisely in Egyptian Arabic, plus a final section with each term's English definition and Arabic meaning. This is scoped preview feedback, not final preview acceptance.

Version 1.1.0 changes the main copy, role labels, story and all authored option feedback to that style. English concept headings and short idea lines now precede the Egyptian explanation. The concrete story says `في Word بتكتب جملة وتكبّر الخط` under Application program. The glossary is the final lesson section, with 19 English terms, English definitions, Arabic meanings and Egyptian explanations; bounded prerequisite definitions are identified in the payload. Inline English terms retain English language and left-to-right isolation within Arabic text. The guide is updated to preserve this authoring style.

All eight question IDs, every option ID, keys, source IDs, slide coverage and historical-original wording remain stable. The first authored MCQ now clearly asks which component provides text-formatting functions. The main concept/diagram/story Arabic word-group count decreased from 738 to approximately 470 (excluding the requested new glossary); this is a copy-size observation, not a measured readability or learning result.

A fresh `/root/language_review` context independently solved all eight no-key candidate items before reading authored keys, then checked all 28 feedback entries and all 19 glossary entries against the current slides, native PPTX XML and historical sheet. It flagged an imprecise System-program/Kernel distinction, a gender agreement error and ambiguous CPU-use wording. These were corrected and independently rechecked. Its optional concrete file-program/RAM/system-view copy suggestions were also applied and narrowly rechecked. No finding from this review remains outstanding. Candidate prose/essay were visible before solutions, so this is independent key solving rather than complete blinding. Final reviewed lesson-data SHA-256: `00d16d4ac71e7faf11e3a1418e6a2b510badc047b4fb359c95ade05235d07947`.

Actual revised checks passed: data validation; glossary data/UI RED before addition and GREEN afterwards; inline-language isolation RED/GREEN; `verify-glossary.cjs` at 390/1280px; practice/reset; option languages; full 360/390/412/1280px layout with 112 answer paths, source navigation and zoom simulations; syntax and UTF-8 skill validation; byte preservation. This is no new broad production-regression or human learning claim. Review and captures are in ignored `test-results/education/os-pilot/language-revision-20261023/`. The user-facing hosted preview is updated through the same existing Sites project; the portal merge gate remains open until Eyad accepts the revised preview.

The revised preview is live at the same URL. Sites version 2 is `appgprj_6ad99418c1d88191852da594e2ed1532~appgver_44ae2df8bb388191ad65639aa4a2690b`, from separate Sites source commit `cfad8baa4fe10533d322b38ceb5b90300f787e90`; deployment `appgdep_6adb933977548191b76be58ca6329004` returned `succeeded`. Fresh anonymous mobile verification saw lesson v1.1.0 and all 19 glossary entries. All 15 hosted runtime/asset hashes match the local reviewed package. Hosted glossary and practice checks passed; current hosted captures were visually inspected. The site's public audience was preserved and no second Site was created.
