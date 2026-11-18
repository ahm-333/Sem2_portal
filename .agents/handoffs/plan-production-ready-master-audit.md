# Production-readiness planning handoff

**Decision pending in [upstream #77](https://github.com/ahm-333/Sem2_portal/issues/77).** [Draft PR #76](https://github.com/ahm-333/Sem2_portal/pull/76) carries the [reviewed and self-audited master plan](../../docs/plans/2026-11-18-production-ready-master-audit.md). The accepted runtime baseline was `68d516c6abe3ec74f7468a808bb8941b26acdf32`. This plan supersedes the initial `cd0ecc4` draft after four independent internal plan audits. Re-read live GitHub state at dispatch.

## What needs a maintainer decision

- Approve the **eleven bounded package scopes (`WP-01`–`WP-11` across `10` serialized/parallel waves)** and confirm accountable issue owners before implementation. **Argon** orchestrates (`User-authorized override of AGENTS.md §2`). **All audit, fixer, and sequential Stage 1 / Stage 2 review workers run on `Hydrogen` (`High` setting ONLY).** An unavailable configuration stays queued. Wave 1 deploys **Fleet A (`7` line-by-line `Hydrogen High` auditors covering `100%` of all `649` tracked files across `L1`–`L7`)** and **Fleet B (`3` holistic `Hydrogen High` architects `S1`–`S3`)** feeding a Defect Ledger scheduled via `production-scheduling`.
- Confirm the intended public hosts, release format and owner of any hosting correction. On 18 November the advertised Vercel alias returned 404 (`DEPLOYMENT_NOT_FOUND`), the historical Vercel alias served home (200) and returned 404 for the DB lesson and shell CSS, and GitHub Pages served unbundled source files from `main:/`. Local packaged verification passed 101 checks. Each public target needs revision-bound evidence under `#15`.
- Retain the append-only v1 journal (`js/shared/study-state.js`) and existing `Study 09` exclusions (`js/shared/study-backup.js`) in this release (`R4`). Compaction and importing standalone CG/DS state require separate, reviewed future contracts.

## Dispatch order (`10` waves, `11` zero-overlap packages)

| Wave | Package(s) | Handoff |
|---|---|---|
| 1 | `WP-01` | Run Fleet A (`L1`–`L7`, 649/649 tracked files) + Fleet B (`S1`–`S3`), measure V8/performance scratch baselines, freeze route budgets and post the central `P0`–`P3` Defect Ledger on `#77` (`none` tracked writes). |
| 2 | `WP-05` | Fix `tests/browser.cjs` full-order timeout & MIME/PNG hygiene, honor `PORTAL_BROWSER_CHANNEL` / `PORTAL_TEST_OUTPUT` across `a1-browser.cjs`/`lesson-theme-browser.cjs`/`browser-options.cjs`, and upgrade `performance-probe.cjs` & `study-page-probe.cjs` before refactoring starts. |
| 3 | `WP-02` + `WP-07` | Parallel & disjoint: fix cross-OS EOL/build determinism & ESLint hygiene (`WP-02`), and add synthetic long-history/invariant tests keeping `study-state.js` & `study-backup.js` untouched (`WP-07`). |
| 4 | `WP-03` | Fix delayed DB practice resume (`switchView` race), unify `escapeHtml`/`safeURL` helpers safely, keep DB/DS HTML edits strictly to wiring, and expand lesson/media coverage. |
| 5 | `WP-04` | Consumes finalized `PortalUI.escapeHtml` from `WP-03`; split Power Tools into orthogonal engines behind `course-power-tools.js` + `course-power-data.js`, cache timer completion (`O(1)`), and keep `css/studio-atlas.css` & `css/processor.css` intact on `index.html`. |
| 6 | `WP-06` | Implement keyed course presenter seam (`PortalCatalog.key`), fix raw `innerHTML` sinks in `subject-content.js`, and batch `MutationObserver` / `PortalUI.icons()` / `drawConnections()` into single `rAF` passes across `subject.js`/`studio.js`/`studio-motion.js`. |
| 7 | `WP-11` | Serialized consolidation: external `content-visibility` containment (`css/study-shell.css`, `css/lesson-workspace.css`), unified DB Tailwind styles without losing JS/chapter classes, expanded `package-site.cjs` (`study/db/lesson.html` bundling + minified lazy data), strict `vercel.json` CSP enforcement (`response-policy.test.cjs`), `whatsapp-portal-sync.yml` / `add_material_from_webhook.js` Stored XSS/PR-only fix, and final serialized `npm run build` asset sync. |
| 8 | `WP-08` | Execute existing `#39` (`[Learning UI 12]`) on the frozen post-`WP-11` candidate, verifying all 30 modules, 4 indexes, DB preservation, `#13` backup round-trip, and newly minified `dist/` interactive lessons. |
| 9 | `WP-09` | Execute existing `#15` (`[Study 11]`) technical slice: wire `#39` & updated `lint` into `package.json`, run the 4-browser matrix (`chromium`, `msedge`, `firefox`, `webkit`) with strict nonzero checks, full Before/After telemetry (`measure-study-performance.cjs`), WCAG 2.2 AA checks, and live Vercel/Pages host parity. |
| 10 | `WP-10` | Maintainers record real-phone/provider check, five-student pilot outcomes, target/rollback decision and authorized live smoke check on `#15`. |

The master plan specifies exact zero-overlap file locks, dependencies, acceptance, `R6` aggressive dead-code pruning, and Before/After telemetry gates. `#4` and `#27` supply context. Upstream `#2` supplies maintainer evidence. The fork's content-discovery issues have a separate approval process.

## First regressions to verify

1. **Practice can overwrite the last selected DB view.** Delaying the first practice chunk, returning to Topics and completing the load left Topics visible but wrote `view=practice`. Reload reopened Practice. `WP-03` owns the repair and `WP-08` verifies the integrated reader.
2. **Full browser order matters.** On Windows the initial canonical run stopped on `quiz-scoring-completion-and-reset` at navigation (`22/23`), while an immediate rerun passed (`23/23`). `WP-05` repairs full-order readiness, MIME types, stale PNG cleanup, and channel/output isolation across all runners before code work starts.
3. **A pass needs executed cases & clean outputs.** `tests/control-contrast.cjs` and `tests/study-features/*.cjs` are `register`/helper modules (`0` checks if run directly). `study-features-browser.cjs` falls back to Chromium on unknown engine and exits `0` on `0/0` filtered cases. Also `tests/lesson-ds3-browser.cjs`, `lesson-cg1-browser.cjs`, `lesson-cg3-browser.cjs`, and `static-package.test.cjs` write `js/course-question-bank.js` or `dist/` during runs.

Each approved implementation issue gets one worktree and linked PR, RED → GREEN at a public seam, up to five silent verification attempts and **sequential Stage 1 (Spec/Defect/Preservation) then Stage 2 (System Architecture/Clean Code/Security/Performance/WCAG) `Hydrogen High` review gates** using the full tooling matrix. A fifth failure goes to a Draft PR with logs. A fresh passing canonical run, four-browser evidence, manual accessibility checks, real phone/pilot results and live parity remain release gates.
