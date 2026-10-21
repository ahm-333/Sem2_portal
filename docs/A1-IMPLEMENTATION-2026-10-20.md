# A1 production integration — 20 October 2026

## Approved objective

Apply the approved A1 visual design to the existing static portal and every currently implemented feature. Flex is the selected cursor. The processor intro must occupy the viewport without the navbar; the navbar becomes fixed after exit. Improve course-card hierarchy with the existing Alexandria and Segoe UI families (English titles 20px desktop / 18px mobile, Arabic 14px, metadata 12px, actions 14px).

Keep the existing two HTML entrypoints, data, URLs, profile, filters, themes, media, reader and quiz behavior. Do not import the prototype core, demo progress, resume, backup or expanded search. No new study persistence. The earlier feature plan is separate. No worktree, branch switch, commit, push or deployment. Keep all exploration and parent planning notes.

## Tasks

- [x] 1. Capture immutable content/link baseline; correct the A1 prototype navbar, cursor default and typography.
- [x] 2. Integrate A1 shell, course grid, existing search/filter/profile/schedule and mobile navigation.
- [x] 3. Restyle both subject tracks, all sources, filters, media and actions without removing functionality.
- [x] 4. Restyle real reader/quiz/profile/media dialogs; integrate intro lifecycle and Flex.
- [x] 5. Run regression suites, viewport/accessibility review, content hashes and final independent review; deliver locally.

## Interfaces and compatibility

Retain `StudentProfile`, `PortalTheme`, `PortalMedia`, `PortalDialog`, `PortalStudyLoader`, reader and quiz interfaces; retain DOM IDs and delegated data-action hooks. Add a presentation-only course map and an intro lifecycle owner. The owner publishes `portal:intro-end` for deferred first-visit profile opening, and always clears hidden/inert shell state on completion, skip, failure, resize or reduced-motion change. Use local fonts and pinned GSAP already present, load processor plugins on eligible home entry only.

## Acceptance / review focus

1. Intro hidden-navbar state never survives failure, skip, natural completion, viewport changes or browser history restoration.
2. First-visit profile cannot appear over intro; storage failure cannot block entry.
3. Every source/action and 6×12 course/section combination remains available after restyling.
4. Both real study lectures retain content, images, all quiz behavior, lazy load/retry/late-close protection and focus lifecycle.
5. Mobile card labels, toolbar controls and dialogs remain readable and operable at 360–1440px and enlarged text.

Run existing build, syntax, data, lint, Node and browser checks plus A1 behavior tests and rendered evidence. Check `/`, `/Sem2_portal/`, direct-file use, blocked storage, motion-library failure, all themes, keyboard and native editing cursors. Keep source/scientific/timetable/slide hashes unchanged. The three pending timetable records remain pending.

## Execution ledger

- Startup: current checkout main at 729f29150f95f580f4f12678223fdbfc62a338a6; only pre-existing untracked exploration/docs. The user explicitly authorized local production edits on this checkout.
- Ruling: use this durable document for task records instead of commit-based skill scratch tooling, because the approved plan forbids commits and worktree changes. No effect on shipped behavior.
- Pre-flight: shared presentation map must be loaded before app/subject renderers; lifecycle owner before profile first-visit timer; stylesheet after legacy CSS. Existing data and study loader remain the authorities.

- Task 1: baseline 77 protected content/assets files saved; original prototype modules backed up; Flex/intro/type reference updated. New browser regressions observed RED (sticky navbar, missing intro/Flex) before implementation.
- Tasks 2–4: initial real-page integration complete; first GREEN pass found legacy intro start fallback of 150px. Fixed the root cause in both prototype and production instead of compensating scene position.

- Tasks 2–4: current-feature URL/action parity passed for all six courses; 30 Node tests and 23 original browser scenarios passed. A1 mobile rendered checks found hidden original font zoom controls; these now remain available in a wrapped reader toolbar (360px RED→GREEN).
- Independent final review: two Important findings, no Critical or Minor findings. Reproduced both as failing tests: subject navbar brand/profile overlap at 360px; partial SVG initialization failure leaves an orphan intro. Single fix pass compacts the mobile subject brand to its named home mark and makes processor mounting exception-safe (DOM, observers, tweens, draggers and trigger rollback). No future features added.

- Final verification: npm run verify passed (build, syntax, data, lint, 30 Node tests, 23 original browser scenarios, 21 A1 scenarios). Final spacing-only CSS pass followed by all 21 A1 cases passing again. Expanded source parity passed 144 course/profile/track states; final lint and diff whitespace check passed.
- Final review findings: both Important items fixed RED→GREEN; no unresolved review findings or deferred minors. Original scientific/source/timetable/assets/parent notes match all 77 protected hashes. Primary palette contrast checked in the live page: 27 pairs, minimum 4.97:1.
- Delivery and evidence: docs/A1-LOCAL-DELIVERY-2026-10-20.md and docs/a1-evidence/evidence.json. Evidence checker passed. Existing server reused; no commit, push, branch/worktree change, deployment or automation action.
