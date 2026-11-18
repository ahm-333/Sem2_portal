# Sem2_portal (Study Hub) — 0-to-100 Production-Ready Audit, Clean Architecture & Agent Orchestration Master Plan

> **Status:** `[ChatGPT-Architect-Handoff]` — Drafted for external architectural review & hardening by `Codex / ChatGPT` before execution.
> **Baseline Commit:** `68d516c6abe3ec74f7468a808bb8941b26acdf32` (`ahm-333/Sem2_portal` `main`, PR #75)
> **Related Epics & Open Gates:** `#4` (Study Roadmap), `#27` (Learning UI Epic), **`#39`** (`[Learning UI 12]`), **`#15`** (`[Study 11]`)
> **Related Content Discovery Issues (`Eyad-Ahmed-Kamal/Sem2_portal`):** `#2` (OS Ch 6–7), `#3` (DB Lec 1 & 6), `#4` (Report Writing Ch 5–6)

---

## 0. Governance, Execution Topology & Mandatory Skills

This plan strictly obeys `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, and `docs/STUDY-FEATURE-CONTRACTS.md`.

### 0.1 Orchestration & Agent Hierarchy (Strict Model Routing)
- **Central Orchestrator & Deep Architect:** **`Argon`**
  - Owns architectural governance, work-package sequencing, parallel file-ownership locks, `Hydrogen` worker deployment, live progress supervision, and final Two-Stage Independent Review.
  - Never delegates architectural redesign decisions without preserving public seams and content hashes.
- **Execution Worker Agents:** **`Hydrogen` on `High` setting ONLY (strictly `High`, NOT `Extra High`)**
  - Each `Hydrogen (High)` worker receives **one bounded Work Package (`WP-XX`)** in an isolated `git worktree` / `Workspace: "share"` branch from `origin/main`.
  - Workers are **strictly forbidden** from editing files outside their `Allowed Files` contract or touching shared files concurrently.
  - Workers execute **RED → GREEN TDD** at public seams and run the **5-Attempt Silent Verification Loop** (`npm run verify` on an isolated port) without weakening or skipping any existing assertion (**Anti-Oracle-Bias**).
- **Independent Review Gate (Two-Stage — No Self-Grading):**
  1. **Stage 1 (`spec-reviewer`):** Verifies line-by-line acceptance criteria, allowed-file boundaries, and preservation guards.
  2. **Stage 2 (`code-quality-reviewer`):** Audits Clean Code, Clean Architecture (`Orthogonality`, `ETC`, `DRY`), RTL/LTR bidirectional isolation, 3-theme sync, and `WCAG 2.2 AA` compliance.

### 0.2 Mandatory Bundled Skills per Phase
- **Orchestration & Planning:** `.agents/skills/sem2-superagent-workflow/SKILL.md`, `.agents/skills/writing-plans/SKILL.md`, `.agents/skills/dispatching-parallel-agents/SKILL.md`, `.agents/skills/subagent-driven-development/SKILL.md`
- **Architecture & Code Quality:** `.agents/skills/codebase-design/SKILL.md`, `.agents/skills/code-review-excellence/SKILL.md`, `.agents/skills/javascript-pro/SKILL.md`, `.agents/skills/modern-javascript-patterns/SKILL.md`
- **UI & Accessibility:** `.agents/skills/frontend-design/SKILL.md`, `.agents/skills/wcag-audit-patterns/SKILL.md`, `.agents/skills/ui-visual-validator/SKILL.md`
- **Verification & Debugging:** `.agents/skills/tdd/SKILL.md`, `.agents/skills/testing-qa/SKILL.md`, `.agents/skills/playwright-skill/SKILL.md`, `.agents/skills/webapp-testing/SKILL.md`, `.agents/skills/systematic-debugging/SKILL.md`, `.agents/skills/diagnosing-bugs/SKILL.md`, `.agents/skills/verification-loop/SKILL.md`, `.agents/skills/verification-before-completion/SKILL.md`

---

## 1. Verified Pre-Plan Discovery Snapshot (Facts Observed on `68d516c`)

Before drafting this plan, baseline discovery directly verified the following exact state on `68d516c6abe3ec74f7468a808bb8941b26acdf32`:

### 1.1 Already Passing Baseline Gates
| Check | Command | Observed Result |
|---|---|---|
| Deterministic Build | `npm run build` | `202` Lucide icons (`48,835` bytes), `10` static study CSS files, `276` source questions (`DS=28, Arch=25, DB=104, OS=107, CG=8, RW=4`) |
| Syntax Check | `npm run check` | `133` JS/CJS files passed |
| Data Validation | `npm run validate` | `0` errors; `0` pending timetable records (`tools/pending-schedule.json` = `[]`) |
| Linter | `npm run lint` | `0` errors, `0` warnings (`--max-warnings=0`) |
| DB Preservation Guard | `node tools/check-lesson-content.cjs` | `62` images, `7 + 6` blocks, `30 + 32` slides, `166` DB questions verified |
| Unit Tests + Coverage | `npm test` & `npm run test:coverage` | `138/138` pass (`1222ms`); `js/shared/*.js` = `85.93%` lines, `75.04%` branches, `89.88%` functions |
| OS Course Suite | `npm run test:os` | `19` units, `74` source slides, `107` questions, motion & logo entry passed |
| Study Features Suite | `npm run test:study` | `43/43` scenarios passed |

### 1.2 Concrete Gaps, Architectural Smells & Risks Directly Observed
1. **Transient Browser Test Fragility (`tests/browser.cjs`):**
   - First run failed `1/23` (`quiz-scoring-completion-and-reset`: `Timeout 6000ms exceeded` at `waitUntil: 'load'` immediately after the 72-case `all-courses-profile-matrix` loop); immediate rerun passed `23/23`. Indicates tight default `6000ms` `load` coupling rather than readiness-based waits.
2. **Windows Line-Ending Churn After `npm run build` (`.gitattributes` vs `tools/build-assets.cjs`):**
   - Running `npm run build` on Windows marks `18` generated/vendored files (`css/TAILWIND-LICENSE`, `css/study/*.css`, `js/study-catalog.js`, `js/course-question-bank.js`, `js/vendor/*`) as modified due to LF vs CRLF checkout unless reset (`git checkout -- css js`) or normalized via `.gitattributes`.
3. **Uncovered Shared Module Branches (`npm run test:coverage`):**
   - `js/shared/media.js` (`35.45%` lines in Node tests — DOM preview/copy paths untested in unit harness)
   - `js/shared/lesson-location.js` (`74.41%` lines — legacy alias & conflict branches partially uncovered in unit tests)
   - `js/shared/db-lesson-map.js` (`76.22%` lines)
   - `js/shared/quiz-attempt.js` (`84.25%` lines)
   - `js/shared/study-progress.js` (`85.44%` lines)
4. **DRY & Orthogonality Violations (Duplicated Helpers Across Modules):**
   - `PortalUI.escapeHtml` exists in `js/shared/ui.js:3`, yet `5` other files duplicate it (`js/course-power-tools.js:21`, `js/lesson-practice.js:19`, `js/lesson-slide-view.js:24`, `js/lesson-workspace.js:33`, `study/ds/question-bank.js:82`).
   - `PortalMedia.safeURL` exists in `js/shared/media.js:3`, yet `js/lesson-workspace.js:46` defines a separate `safeHref`.
   - `PortalStorage` wrappers (`getStorage` / `readSaved`) are re-implemented in `js/theme.js:11`, `js/course-power-tools.js:16`, and `study/ds/question-bank.js:14`.
5. **Monolithic Multi-Domain Coupling (`js/course-power-tools.js`, `1,161` lines):**
   - Couples three orthogonal subsystems in one IIFE: **Midterm Exam Simulator**, **Pomodoro Study Timer**, and **Notification Feed**, sharing mutable state and event listeners.
6. **3-Generation Subject Rendering Pipeline (`ETC` Friction):**
   - `subject.html` runs `js/subject.js` (`574` lines) + `js/subject-content.js` (`911` lines) → then `js/a1-journey.js` mutates/compacts the DOM → then `js/studio-course.js` decorates Atlas branches & counts. Adding or changing a single course resource type or action currently requires understanding and touching multiple cascading layers.
7. **Split Persistence & Excluded Student Progress (`study/cg/*`, `study/ds/question-bank.js` vs `PortalStudyState`):**
   - `study/cg/chapter-1.js:15` (`sem2_cg_chapter1_answers_v1`), `study/cg/chapter-2.js:646` (`sem2_cg_chapter2_answers_v1`), `study/cg/chapter-3.js:15` (`sem2_cg_chapter3_answers_v1`), and `study/ds/question-bank.js:11` (`sem2_ds_question_bank_bookmarks`) write directly to un-versioned `localStorage` keys outside `PortalStudyState` (`sem2_study_v1:*`) and are excluded from `PortalStudyBackup` (`Study 09`).
8. **Unbounded Append-Only Op-Log (`js/shared/study-state.js`, `500` lines):**
   - Deliberately omits compaction (`docs/STUDY-FEATURE-CONTRACTS.md` §3). Long-term heavy usage appends `sem2_study_v1:op:*` keys monotonically until `localStorage` quota triggers session fallback.
9. **Giant Inline HTML Lesson Monoliths & Unlinted Legacy Tools:**
   - `study/ds/lecture-2.html` (`7,162` lines), `study/ds/lecture-4.html` (`4,233` lines), `study/ds/lecture-1.html` (`2,635` lines), `study/arch/chapter-7.html` (`2,305` lines), `study/ds/lecture-3.html` (`1,972` lines) embed large inline styles/scripts outside ESLint coverage; `eslint.config.cjs` also ignores `tools/*.js`.
10. **Remaining Release Evidence Gaps (`Issue #39` & `Issue #15`):**
    - `firefox` and `webkit` engines are not installed locally in `%LOCALAPPDATA%\ms-playwright` (`chromium-1234` only).
    - Full audit of `test:a1`, `test:lesson`, `test:practice`, `test:location`, `test:lesson-entry`, `test:production`, `performance-probe.cjs`, `control-contrast.cjs`, live host parity (`https://sem2portall.vercel.app/` vs GitHub Pages), and human/real-device pilot coordination (`Issue #15`) must be executed and recorded cleanly.

---

## 2. Part A — Complete 8-Pillar 0-to-100 Production-Readiness Audit

### Pillar 1: Build Determinism, Static Hygiene, Data Integrity & Cryptographic Content Preservation
- Verify `npm run build`, `npm run check`, `npm run validate`, `npm run lint`, and `node tools/check-lesson-content.cjs`.
- Verify every local path referenced in `js/courses-data.js` (`materials/**`, `study/**`, `education-preview/os/**`) exists on disk and ships cleanly inside `tools/package-site.cjs`.
- Verify `.gitattributes` and `tools/build-assets.cjs` produce zero dirty working-tree noise across Windows and Linux (`LF`/`CRLF` determinism).
- Verify all `tools/*.js` legacy scripts are either modernized/linted or explicitly archived/documented outside runtime scope.

### Pillar 2: Deep Module Architecture, Unit Tests & Contract Verification (`docs/STUDY-FEATURE-CONTRACTS.md`)
- Audit all 13 modules in `js/shared/` against `codebase-design` principles (deep modules, minimal interfaces, clean seams, dependency injection).
- Verify all 11 feature contracts (`Study 01`–`Study 09`, `Study 10`, `Learning UI 07`):
  - Canonical keys including numeric ID `0` (`["data-structure","lecture","0"]`).
  - Lamport-clock operation replay & `replaceBundle` cross-store atomic single-`setItem` commit.
  - Pre-parse `1,048,576`-byte guard, prototype-pollution immunity, and `corrupt`/`unsupported-version` protection.
- Raise `js/shared/*.js` test coverage on edge branches (`lesson-location.js`, `db-lesson-map.js`, `quiz-attempt.js`, `study-progress.js`, `media.js`).

### Pillar 3: Combined Educational Content & All 30 Local Interactive Modules (`Issue #39` Gate)
- Verify all 30 registered modules in `js/study-modules.js` plus the 4 course study indexes (`study/arch/index.html`, `study/db/index.html`, `study/ds/index.html`, `study/cg/index.html`) and `study/ds/question-bank.html`:
  - **Database Systems (`study/db/lesson.html`, `chapter-1.html`, `chapter-2.html`):** Lossless reachability of `13` topic blocks (`7 + 6`), `62` slide explanations/images (`30 + 32`), `54` topic questions, `50` full-quiz questions, `62` micro-questions. Verify `topic → slide detail → original image → practice → back`, old URL/hash/ordinal aliases, explicit-location precedence, reload/back/`pageshow`, and `#13` backup round-trip.
  - **Data Structures (`study/ds/`):** Lectures `1`, `2`, `3`, `4` (Stack simulator), `7` (Trees), plus `question-bank.html`.
  - **Computer Graphics (`study/cg/`):** Chapters `1`, `2`, `3` (Bresenham simulator & interactive practice).
  - **Computer Architecture (`study/arch/`):** Chapter `7` (I/O & DMA syllabus + interactive checks).
  - **Operating Systems (`education-preview/os/`):** All `19` units (`os-01`..`os-19`), `74` source slides, `107` stable questions, visual motion + reduced-motion static path.
  - **Unavailable States (`Study 10`):** Verify `الشرح — قريبًا` disabled state on unmapped items (Computer Graphics / Report Writing lectures) while preserving working primary source actions (`drivePreviewUrl` / `Midterm`).

### Pillar 4: Full Student Journey, Studio/Atlas/Rift & Power Tools
- Run and inspect `tests/browser.cjs`, `tests/a1-browser.cjs`, `tests/studio-features.cjs`, `tests/studio-scroll-intro.cjs`, `tests/power-tools-browser.cjs`, `tests/course-refinements-browser.cjs`, `tests/quiz-choice-browser.cjs`, `tests/release-features-browser.cjs`, `tests/study-integration-browser.cjs`, `tests/study-shell-browser.cjs`.
- Verify end-to-end journey: Cold start → Rift 3D scroll intro & skip → Profile selection (`B1`–`B3`, `Sections 1`–`12`, `72`-case TA matrix) → Home course cards & Continue/Resume → Ranked library search (`/`) with Arabic normalization & status filters → Atlas 5-branch map → Reader/Native lesson → Quiz submission & wrong-answer review → Midterm simulator (frozen/restored clock, unfinished submit confirmation) → Pomodoro multi-tab timer → Notification bell → Backup export/preview/restore → Profile switch.

### Pillar 5: UI/UX, 3-Theme Sync, Responsive Layout & WCAG 2.2 AA Accessibility
- Verify bidirectional theme sync (`light`, `dark`, `reading`) across `index.html`, `subject.html`, and all `30` local modules + `4` indexes across reload, browser Back/Forward, and multi-tab `storage` events without losing quiz answers or reading positions.
- Verify responsive widths `320px`, `360px`, `390px`, `412px`, `768px`, `1024px`, `1440px`, and `200%` zoom reflow (`720×450`, DPR `2`) with zero horizontal overflow (`scrollWidth <= innerWidth + 1`).
- Run `tests/control-contrast.cjs` and `tests/lesson-theme-browser.cjs` across all themes and code/table/diagram/feedback surfaces.
- Verify keyboard accessibility: Skip links, `PortalDialog` `inert` background isolation, `Tab`/`Shift+Tab` trapping, `Escape` closing, trigger focus restoration, `44×44px` minimum touch targets, RTL Arabic isolation with `dir="ltr"` for code/scores/timers.

### Pillar 6: Security, Privacy, Offline Resilience & Fault Recovery
- Static & runtime security audit:
  - Strict URL protocol allowlist (`http:`, `https:`, relative `materials/`, `file:` where safe) rejecting `javascript:`, `data:`, `vbscript:` in `PortalMedia.safeURL`, `PortalContentNavigation.resolveAction`, `PortalLessonLocation`, and `PortalStudyBackup`.
  - Audit all `innerHTML` sinks across `js/` and `study/` for proper `escapeHtml` usage on dynamic/user-derived strings.
  - Prototype-pollution (`__proto__`, `constructor`, `prototype`), cyclic object, own-accessor (`toJSON`/getters), and 1 MiB DoS guards in `study-state.js` & `study-backup.js`.
  - CSP readiness audit (`vercel.json` currently sets `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`; evaluate adding `X-Frame-Options` / `Content-Security-Policy` compatible with inline `<head>` theme init and Drive/YouTube iframes).
  - Zero runtime CDN dependencies (`https://**` aborted in tests); analytics (`js/analytics.js`) isolated strictly to `vercel.app` or explicit opt-in.
  - Fault recovery under blocked `localStorage`, `QuotaExceededError`, corrupt JSON, unsupported future `schemaVersion`, failed lazy chunk load (`#study-retry`), and `file://` direct open.

### Pillar 7: Performance, Network Budgets & Resource Lifecycle
- Run `tests/performance-browser.cjs` and `tools/performance-probe.cjs` against `docs/review/performance/content-baseline.json`.
- Verify: `legacyFrames === 0`, `libraryRows === 0` before user opens `#library`, `window.LECTURE_EXPLANATIONS === undefined` and question banks lazy-loaded only on demand, `CLS` near `0`, `Three.js` only loaded on eligible desktop Rift intro, and GPU/animation frames cleanly paused on `visibilitychange` / exit.
- Measure total JS/CSS/font transfer bytes in `dist/` and check image/asset optimization opportunities across `materials/` and `study/`.

### Pillar 8: Production Packaging (`dist/`), Cross-Browser Matrix & Live Host Parity (`Issue #15` Gate)
- Run `npm run test:production` and full `npm run verify` on the final integrated commit.
- Verify `dist/` boundary (`404` on `automation/`, `tools/`, `docs/`, `tests/`, `package.json`), single minified JS/CSS bundle per core entrypoint, root `/` and `/Sem2_portal/` subpath parity.
- Install/test cross-browser matrix (`Chromium`, `Microsoft Edge`, `Firefox`, `WebKit`) and explicitly log engine versions, pass/fail, and any genuine platform/real-device gaps (`Issue #15` requires honest disclosure + coordinating the 5-student pilot and real-phone external-provider check with `@Eyad-Ahmed-Kamal` and `@ahm-333`).
- Inspect live deployed parity (`https://sem2portall.vercel.app/` and GitHub Pages if enabled) against `dist/` headers, routes, and shared `study-shell.css`/`js` assets.

---

## 3. Part B — Clean Code, Clean Architecture, Orthogonality & ETC Refactoring Tracks

> **Architectural Rule:** Every refactoring track MUST preserve all existing public globals/contracts (`STUDY-FEATURE-CONTRACTS.md`), scientific content hashes (`DB-CONTENT-MANIFEST.json`), and passing assertions in `tests/` (never edit or weaken existing test expectations unless fixing a genuinely broken timeout mechanism without altering behavioral assertions).

### Track R1: Decompose `js/course-power-tools.js` (`1,161` Lines) by Orthogonal Domain
- **Problem:** Midterm Exam Simulator, Pomodoro Multi-Tab Timer, and Notification Feed live in one `1,161`-line closure, reducing **Orthogonality** and increasing blast radius when editing any single tool.
- **Target Clean Architecture (`ETC`):**
  - Split internal engines into cohesive, single-purpose modules with injected storage/clock/catalog dependencies (or clean submodules under `js/power-tools/` bundled cleanly or loaded deterministically):
    - `midterm-engine.js` (exam state machine, question sampling, scoring, clock resilience)
    - `study-timer-engine.js` (Pomodoro state, idempotent multi-tab completion keys, cross-tab reconciliation)
    - `notifications-feed.js` (feed catalog, scoped read markers, badge updates)
    - `course-power-tools.js` becomes a thin UI coordinator/modal shell wiring tabs, keyboard navigation, and lifecycle events.
  - Reuse `PortalUI.escapeHtml` and `PortalStorage` instead of local duplicates.

### Track R2: Unify Shared Utilities (`DRY` & Single Source of Truth)
- **Problem:** `escapeHtml` is duplicated 6 times; `safeURL`/`safeHref` and `getStorage` wrappers are duplicated across modules.
- **Target Clean Architecture:**
  - Standardize `PortalUI.escapeHtml` (`js/shared/ui.js`), `PortalMedia.safeURL` (`js/shared/media.js`), and `PortalStorage` (`js/shared/storage.js`) as the canonical dependency seam across `js/course-power-tools.js`, `js/lesson-workspace.js`, `js/lesson-practice.js`, `js/lesson-slide-view.js`, and `study/ds/question-bank.js` (with safe fallback only if a standalone script can run without `ui.js`).

### Track R3: Simplify the 3-Generation Course Rendering Pipeline (`ETC — Easy To Change`)
- **Problem:** `js/subject.js` (`574` lines) + `js/subject-content.js` (`911` lines) render original DOM → `js/a1-journey.js` restructures & compacts rows → `js/studio-course.js` decorates Atlas counts & progress badges via `MutationObserver`.
- **Target Clean Architecture:**
  - Extract a clean, declarative **Course Resource ViewModel / Presenter Seam** (`CatalogEntry` + `StudentProfile` + `PortalStudyModules` → normalized row descriptor with primary/secondary actions and canonical `data-content-key`/`data-action-id` attributes), decoupling data rules from DOM presentation.
  - Eliminate fragile DOM-scraping during compaction (`a1-journey.js`) and avoid redundant `MutationObserver` re-decorations where direct callbacks/events (`portal:sources-changed`, `portal:content-ready`) suffice.

### Track R4: Safe Journal Compaction & Unified Practice Persistence
- **Problem:**
  1. `PortalStudyState` (`js/shared/study-state.js`) appends `sem2_study_v1:op:*` indefinitely without compaction.
  2. Standalone CG practice (`study/cg/chapter-1..3.js`: `sem2_cg_chapter*_answers_v1`) and DS Question Bank bookmarks (`study/ds/question-bank.js`: `sem2_ds_question_bank_bookmarks`) sit outside `PortalStudyState` and `PortalStudyBackup`.
- **Target Clean Architecture:**
  - **R4a (Journal Compaction Contract):** Add a reviewed contract in `docs/STUDY-FEATURE-CONTRACTS.md` and implement atomic, Lamport-clock-safe checkpoint compaction in `js/shared/study-state.js` when op-log size crosses a safe threshold, preserving multi-tab merge invariants and corrupt/future-version protection.
  - **R4b (Optional/Scoped Adapter):** Evaluate bridging CG practice answers and DS question-bank bookmarks cleanly into `PortalStudyState` / `PortalStudyBackup` under an explicit additive schema extension (`Study 09` coverage expansion, only after contract sign-off).

### Track R5: Build Determinism, Test Reliability & Legacy Hygiene
- **Problem:**
  1. `tests/browser.cjs` hit a `6000ms` timeout at `waitUntil: 'load'` right after the 72-case loop (`quiz-scoring-completion-and-reset`).
  2. `npm run build` leaves 18 line-ending-modified files in `git status` on Windows.
  3. ESLint ignores `tools/*.js`; obsolete `css/processor.css` / historical scripts sit alongside active code without clear boundary documentation.
- **Target Clean Architecture:**
  - Harden `tests/browser.cjs` navigation readiness (without relaxing any behavioral assertion or timeout guard that catches real hangs—investigate why `load` stalled after 72 synchronous profile mutations!).
  - Align `.gitattributes` (`* text=auto eol=lf` or targeted build-output `eol=lf` rules verified on both Windows and Linux CI) so `npm run build` produces `0` git status churn on Windows.
  - Audit and clean up / explicitly quarantine obsolete legacy scripts in `tools/*.js` and unused CSS (`css/processor.css` if confirmed unreferenced outside historical tests).

---

## 4. Part C — Non-Overlapping Work Packages for `Argon` → `Hydrogen (High)` Dispatch

> **Dispatch Rule:** `Argon` spawns `Hydrogen (High)` subagents per wave in isolated `git worktree`s. No two concurrent workers may touch the same file. Every package finishes with `npm run verify` + Two-Stage Review (`spec-reviewer` + `code-quality-reviewer`).

| Wave | WP ID | Title & Scope | Owner Model | Allowed Files (Strict Boundary) | Blocked By | Primary Verification |
|---|---|---|---|---|---|---|
| **Wave 1** *(Parallel Audit)* | `WP-01` | **Full Baseline Audit Execution & Gap Evidence (`#39` + `#15` Pre-Check)** — Execute `test:a1`, `test:lesson*`, `test:practice`, `test:location`, `test:production`, `performance-probe.cjs`, `control-contrast.cjs`, live host parity check, and security/XSS grep audit; report exact pass/fail/metrics. | `Hydrogen (High)` | Read-only across codebase; outputs evidence only to `docs/review/` or `test-results/` | None | All `npm run test:*` + `performance-probe.cjs` |
| **Wave 1** *(Parallel Hygiene)* | `WP-02` | **Windows/CI Line-Ending Determinism & Tooling Hygiene** — Fix `.gitattributes` / `build-assets.cjs` EOL consistency; audit `tools/*.js` and dead CSS (`css/processor.css`) against test references. | `Hydrogen (High)` | `.gitattributes`, `tools/build-assets.cjs`, `eslint.config.cjs`, `docs/` (only audit notes) | None | `npm run build`, `git status`, `npm run lint`, `npm test` |
| **Wave 2** *(Parallel Core Refactor)* | `WP-03` | **Shared Utility DRY Unification (`escapeHtml`, `safeURL`, `PortalStorage`)** — Eliminate duplicated helpers across lesson/tool modules; expand unit tests for `media.js`, `lesson-location.js`, `quiz-attempt.js`, `study-progress.js` to >90% coverage. | `Hydrogen (High)` | `js/shared/ui.js`, `js/shared/media.js`, `js/lesson-slide-view.js`, `js/lesson-practice.js`, `js/lesson-workspace.js`, `study/ds/question-bank.js`, `tests/*.test.cjs` | `WP-01` | `npm test`, `npm run test:coverage`, `npm run verify` |
| **Wave 2** *(Parallel Core Refactor)* | `WP-04` | **Decompose `js/course-power-tools.js` (Orthogonality Split)** — Extract Midterm Simulator, Pomodoro Timer, and Notification Feed behind clean internal module seams + `package-site.cjs` inclusion, preserving 100% of `power-tools-browser.cjs` contracts. | `Hydrogen (High)` | `js/course-power-tools.js`, `js/power-tools/*.js` (new), `index.html`, `subject.html`, `tools/package-site.cjs`, `tools/check-syntax.cjs`, `tests/power-tools-browser.cjs` | `WP-01` | `node tests/power-tools-browser.cjs`, `npm run test:production`, `npm run verify` |
| **Wave 2** *(Parallel Core Refactor)* | `WP-05` | **Browser Test Determinism & Security Header Hardening** — Root-cause & fix the post-72-loop `load` delay in `tests/browser.cjs` (`quiz-scoring-completion-and-reset`), audit CSP/security headers in `vercel.json`. | `Hydrogen (High)` | `vercel.json`, `js/subject.js` (if load bottleneck found), `tests/browser.cjs` (only stability/diagnostics, zero relaxed assertions) | `WP-01` | `npm run test:browser` (x3 consecutive runs), `npm run test:production` |
| **Wave 3** *(Sequential Architecture)* | `WP-06` | **Course Rendering Pipeline Seam Simplification (`ETC`)** — Introduce unified course row/action presenter seam across `subject.js`, `subject-content.js`, `a1-journey.js`, `studio-course.js` so adding/modifying actions requires editing one place. | `Hydrogen (High)` | `js/subject.js`, `js/subject-content.js`, `js/a1-journey.js`, `js/studio-course.js` | `WP-03`, `WP-04` | `npm run test:browser`, `npm run test:a1`, `npm run test:study` |
| **Wave 3** *(Sequential Storage)* | `WP-07` | **Safe Atomic Journal Compaction (`Study 03/09` Evolution)** — Update `docs/STUDY-FEATURE-CONTRACTS.md`, implement Lamport-safe op-log compaction in `study-state.js`, add concurrent/quota/corrupt compaction tests, and audit CG/DS standalone key bridging. | `Hydrogen (High)` | `docs/STUDY-FEATURE-CONTRACTS.md`, `js/shared/study-state.js`, `js/shared/study-backup.js`, `tests/study-state.test.cjs`, `tests/study-backup.test.cjs` | `WP-03` | `npm test`, `npm run test:study` |
| **Wave 4** *(Final Verification Gates)* | `WP-08` | **Close `#39` (`[Learning UI 12]`)** — Produce `tests/lesson-integration-browser.cjs`, `docs/review/lesson-unification/REVIEW.md`, `docs/review/lesson-unification/acceptance.json`, and update `tests/production-browser.cjs` per `#39` bounded ownership. | `Hydrogen (High)` | `tests/lesson-integration-browser.cjs`, `tests/production-browser.cjs`, `docs/review/lesson-unification/REVIEW.md`, `docs/review/lesson-unification/acceptance.json` | `WP-06`, `WP-07` | `npm run verify`, `node tests/lesson-integration-browser.cjs` |
| **Wave 4** *(Cross-Browser & Performance)* | `WP-09` | **Cross-Browser Matrix (`Chromium`, `Edge`, `Firefox`, `WebKit`) & Performance Verification (`#15`)** — Install & execute engines, record exact browser versions/results/limits, run `performance-probe.cjs` vs baseline, verify live deployed parity (`sem2portall.vercel.app` & GitHub Pages). | `Hydrogen (High)` | `.github/workflows/portal-quality.yml`, `package.json`, `tests/study-features-browser.cjs`, `tools/measure-study-performance.cjs`, `docs/STUDY-FEATURE-ACCEPTANCE.md`, `docs/study-feature-evidence/` | `WP-08` | `npm run verify`, `node tools/performance-probe.cjs` |
| **Wave 5** *(Human + Maintainer Sign-Off)* | `WP-10` | **Maintainer Release Coordination & 100% Sign-Off** — Coordinate 5-student pilot + real-phone/external Drive/YouTube check (`#15`), resolve open content discovery issues (`#2`, `#3`, `#4` on fork) if authorized, finalize `README.md` & release checklist. | `Argon` + Human Maintainers (`@Eyad-Ahmed-Kamal`, `@ahm-333`) | `README.md`, GitHub Issues `#39` & `#15` | `WP-09` | Final `npm run verify` on release SHA + live deployment parity check |

---

## 5. Part D — 100% Production-Ready Definition of Done (DoD)

The repository reaches **100% Production Ready** ONLY when all of the following hold simultaneously with fresh command/screenshot/artifact evidence on the exact release `HEAD`:
1. `npm run verify` passes 100% consecutively across clean runs with zero `git diff` drift in generated assets (`css/`, `js/vendor/`, `js/study-catalog.js`, `js/course-question-bank.js`).
2. Zero ESLint warnings/errors, zero console/page errors across all 6 courses, 30 interactive modules, 4 course indexes, DS question bank, Studio/Rift/Atlas, and power tools.
3. All Clean Architecture / Orthogonality / ETC refactoring tracks (`R1`–`R5`) pass Two-Stage Independent Review (`spec-reviewer` + `code-quality-reviewer`) with `js/shared/*.js` unit coverage ≥ 90% and zero duplicated sanitizer helpers.
4. `dist/` packaged artifact passes `npm run test:production` across `/` and `/Sem2_portal/`, security boundary (`404` on dev/test/doc files), and verified response/security headers.
5. `Issue #39` (`[Learning UI 12]`) and `Issue #15` (`[Study 11]`) acceptance checklists are completely evidenced (including multi-browser engine runs, `320px`–`1440px` + `200%` zoom, WCAG 2.2 AA contrast/keyboard checks, live deployment parity, and honest maintainer-executed real-device/5-student pilot outcomes).
