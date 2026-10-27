# Study feature repairs — 26 October 2026

Baseline: `0700072420a248070a4ab27b4de50d07345298ed`. Implementation branch: `codex/portal-quality-fixes`.

The student can read the local lessons within Kernal's visual shell, discover them in the interactive library, return to the last reading section, keep a timed attempt across navigation, and download the actual Stack source. Graphics and Report Writing lessons remain explicitly coming soon; their existing practice questions remain available.

## Approved scope and design

The user approved fixing the audited findings, GitHub delivery and full verification. The agreed public test seams are the real browser interface, student-visible saved state, and the files/links in the published static artifact. Scientific content review was excluded from this change. Parallel work was split by file ownership and independently reviewed before integration.

The shell adopts the existing Studio tokens and Alexandria family: light paper `#f5f6fb/#fff`, ink `#252642`, accent `#4653d6`; corresponding dark and reading palettes remain selectable. Reading stays RTL with English/code direction preserved. Existing academic cards, diagrams, source anchors and native controls remain in place, inside a consistent Kernal navigation and preference layer. Semantic diagram/answer colours retain distinct paired surfaces and foregrounds.

## Finding disposition

- **F01:** unavailable Graphics/Report Writing study links are disabled and labelled coming soon; their midterms still open.
- **F02:** all five overflowing reading toolbars now wrap within a phone viewport.
- **F03/F05/F19:** persisted, validated deadlines and attempts survive modal close, navigation and reload; pause is explicit.
- **F04:** OS chapter links select actual units `os-01/os-09/os-13`.
- **F06/F07:** selected lecture groups use balanced shuffled sampling. A lazy generated bank copies the existing question text, options, correct answer identities and source URLs; no scientific answers were rewritten.
- **F08/F09/F22:** ten standalone entrypoints share the Kernal shell, persisted light/dark/reading preference and local font. Contrast checks cover action labels, static Architecture syllabus cards and actual OS/DB answer feedback.
- **F10/F17/F18:** mobile modal chrome leaves the start action visible; tabs support keyboard navigation, answer focus is retained and unfinished submission has an accessible confirmation.
- **F11/F16/F26:** library/history includes DS3, Architecture1 and OS19 local lessons. Continue restores clicked/visible sections and native lesson tabs. Per-control completion values survive reload and synchronize independent checks/unchecks across tabs. Directory/index aliases work under a nested Pages prefix.
- **F12/F13/F21:** notifications use item-level links, retain target focus after layout settles, mark only the visible scope read and refresh sibling-tab badges.
- **F14:** repository homepage verification identified `https://sem2portall.vercel.app/` as the active Vercel site; its tools matched `origin/main`. README now points to it instead of the older Kernal alias. New branch changes still require normal PR merge/deployment and post-release byte/browser checks; this document does not claim a production promotion.
- **F15:** the analytics bootstrap requests the platform endpoint on Vercel hosts only (or explicit custom-domain opt-in), avoiding missing endpoint requests on Pages/local previews. Real-browser fixtures also verify single initialization on a supported host.
- **F23/F24:** CPP educational files ship in `dist`, and all three Stack download actions target the CPP source rather than MP4 recordings.
- **F25/F27:** closed contents leave the Tab order; opened contents contain focus and close on Escape. Atlas counts now follow the displayed TA scope.

## Additional review findings resolved

- Two restored timer tabs initially counted one completion twice. Stable session identities and immutable completion markers make completion idempotent; distinct sessions still count separately.
- A stale timer tab initially overwrote another tab's pause/reset/new session. Validated active-state reconciliation occurs on storage, page return, controls and ticks, including a last check before completion publication.
- Two standalone tabs initially overwrote independent completion checks. Independent per-control atomic values and native-control replay now preserve both checks and explicit unchecks.
- An Architecture native lesson tab initially reopened hidden content in Continue. Resume now activates the actual existing control before scrolling.
- Static light surfaces and OS feedback needed further paired contrast corrections after independent screenshot review; action-only contrast tests had missed them.

## Verification

The complete command is `npm run verify` with Node 24+ and Playwright Chromium (Chrome channel locally). It runs generated assets, syntax, authoritative data validation, ESLint, all unit tests, functional/browser/Studio/study/storage/OS suites, and actual `dist` packaging/browser checks. New scenarios are registered in the existing A1 runner, not a separate optional manual checklist.

Focused RED/GREEN evidence includes frozen/restored exam clocks, missing/incomplete banks and retry, lecture coverage, scoped notifications, phone layout, hidden-drawer keyboard focus, download identity, library discovery, saved reading positions, two-tab completion/timer conflicts and storage refusal. Expected symptoms were observed failing before their fixes. Existing smoke expectations were updated only for intentional changed contracts (unfinished-submit confirmation and host-conditional analytics).

The attached PR's checks and `portal-quality-evidence` artifact provide the final integrated verdict. Local detailed logs live under `test-results/`, which is excluded from the public website. Focused runs passed 71 unit tests, 15 power-tool scenarios, 11 integration scenarios and 10 shell scenarios; these overlap the complete verification command rather than representing independent student learning outcomes. The separate unit coverage command covers only its configured `js/shared/*.js` scope, not the whole website.

The first integrated run caught a stale performance expectation that the interactive library contained only two old DB lessons. It now expects the independently specified 25 available local lessons while retaining the zero-rows-before-first-open performance guard. The OS entry test now clicks the visible shared Kernal brand instead of its replaced hidden header; its identity check compares the actual visible 28px favicon mark, including the image URL. These are intentional interface-contract updates, not relaxed failure thresholds.

Linux CI subsequently exposed three power-suite navigation waits for the full window `load` event despite visible controls and no application exceptions. These functional contexts now use reduced motion and wait for DOM readiness plus the actual study controls; separate motion cases still exercise animations. Repeated software-renderer checks then exposed a test-clock setup race: Playwright clocks are context-wide, and installing the second page's clock rewound both tabs. A single context clock now covers both pages. Finally, software rendering on Linux CI surfaced continuous reflow in flex layout caused by unconstrained CSS transitions on modal tabs when the live study timer ticked; narrow property transitions, tabular digits, and isolated reduced motion in studio-features ensure modal stability under headless software rendering without modifying study behavior. The behavior assertions and six-second limits remain unchanged; CI logs and failed runs are retained as evidence.

Selected reviewed captures: [phone/light](evidence/contact-mobile-light.png), [phone/dark](evidence/contact-mobile-dark.png), [desktop/light](evidence/contact-desktop-light.png), [readable Architecture syllabus](evidence/study-arch-chapter-7-desktop-dark.png), [DB answer states](evidence/interaction-study-db-chapter-2-mobile-light.png), [DS memory stepping](evidence/interaction-study-ds-lecture-2-desktop-dark.png).

## Preservation and limits

Original content hashes remain pinned. The source-data guard reverses only three explicit reviewed download-target substitutions before comparing with its original hash. The standalone guard removes only the exact six added shared runtime tags before comparing with the unchanged original teaching-body hashes. Slide files, OS lesson payloads, scientific inline code/text and original quiz data are otherwise protected.

The old audit and its 42 captures remain in [the original report](../latest-features-2026-10-26/REPORT.md). New test failures/captures and resolved two-tab cases are implementation evidence, not a new scientific or instructor certification. Existing uncertain timetable records remain unchanged. Drive/YouTube permissions and platform/account analytics availability remain external provider concerns. No account, backend, paid service or storage schema replacement was added.
