# A1 student journey correction — 21 October 2026

## Binding clarification

Eyad rejected a visual skin over the old information architecture. He explicitly confirmed: transfer A1's actual student journey using the current features; the separate future study-feature plan remains deferred. Execute locally in the current checkout, without branches, commits, pushes or deployment.

## Implementation contract

- Home is a quiet course chooser, with one clear course entry per card. Staff, detailed external-site descriptions and multiple source actions belong inside the course, not on every home tile. Existing task signals remain reachable.
- The university timetable is a separate home navigation view, preserving its existing data, profile behavior and fragment link. No personal study planner.
- A course opens directly on its published lecture list. A1 resource-type navigation reveals one source family at a time: lectures, sections, videos, assignments, sources/reference/tools. Preserve both legacy track URLs and every current source/filter/media action; provide a clearly named place for each.
- Context (group/section, staff and schedule) is secondary to finding the material. Source rows are compact; detailed metadata is progressively disclosed rather than repeated as full cards.
- Reader is a focused slide/explanation workspace: one slide at a time, outline/next/previous, original-slide versus explanation view, all original rich content and slide questions retained. Both actual DB lectures work.
- Full quiz is one question at a time with map, next/previous, immediate existing correction/explanations, unchanged scoring/reset and final result. No new persistence, resume, progress or backup.
- Keep A1/Flex/fixed-navbar/full-viewport intro, three themes, keyboard access, current storage keys, all source/scientific/timetable/asset hashes and delayed profile onboarding.

## UI defects found while auditing

- Actual versus hover background classes were conflated; nested panel flattening erased control backgrounds, producing white-on-white labels/icons. Corrected with exact actual class tokens and explicit primary/secondary interaction colors.
- Legacy important active-track/reader-tab styles overrode A1; checked section controls, quiz-map error colors and inactive theme opacity had low contrast. Corrected; custom radio keyboard focus is now visible.
- The installed Lucide distribution has no Youtube icon. Replaced presentation references with the verified MonitorPlay icon; no data or external URLs changed.
- New action audits check composited background/opacity, text/icon contrast and default/hover/focus/active states across 78 page/theme/viewport combinations. Six dialog configurations and the user's three original examples were also verified. The last complete pre-journey suite passed 30 Node + 23 original browser + 35 A1 cases; icon-specific RED→GREEN was added afterward. These counts do not establish acceptance of the new journey changes.

## Work ledger

- [x] Diagnose and fix the reported control-visibility defects; preserve before/after evidence under docs/a1-controls-fix/.
- [x] Transfer the course chooser and dedicated timetable view.
- [x] Transfer resource-family navigation and compact source rows while preserving all actions.
- [x] Transfer focused reader and single-question quiz using real content.
- [x] Update meaningful journey/compatibility tests, run full verification, inspect desktop/mobile journeys and deliver the corrected experience.

- Current implementation: js/a1-journey.js and css/a1-journey.css handle home/timetable navigation, source families, context and DOM-based compact rows. Real reader and quiz modules now show a single selected item, retain original content/actions and offer original-slide, map and next/previous navigation. All 23 original functional browser scenarios passed after updating only their navigation to the new UI.
- Meaningful journey RED→GREEN: quiet course grid/separate timetable; one source family; one real slide/question; bare subject default; actual font enlargement; source kind surviving browser back and course switching.
- Independent review confirmed the actual journey, both DB lectures and mobile quiz completion. It found toolbar-jumping Tab behavior for programmatically focused articles and an offscreen selected mobile outline item. Both were reproduced RED and fixed GREEN; quiz reset focus was also corrected. Boundary containment and old modal focus behavior remain tested.
- Final full verification is running in test-results/a1-student-journey-final.log. Do not treat older passing counts or first-round screenshots as final evidence for this revision.

- Final visual correction: source-family introductions were still too tall on a 360px course entry. They now use compact headings/counts and an accessible folder action. A real first-lecture-action viewport test was observed RED then GREEN. All source-action parity checks and the 360px rendered journey passed after the change.
- Microsoft Edge isolated smoke at 1440 and 360px passed course selection, source family, course-kind retention, actual reader navigation, native keyboard continuation and single-question quiz with no page errors. This supplements Chrome; it is not a full Edge certification.
- Final delivery verification now runs in test-results/a1-student-journey-delivery.log. The settled real-interface captures live in docs/a1-student-journey-evidence/; course/source captures will be refreshed after compact-heading verification.

- COMPLETE: final `npm run verify` passed: build, syntax, data validation, lint, 30 Node tests, 23 original browser scenarios and 45 A1 scenarios. Action audit: 192 page/theme/viewport combinations, 198 distinct interaction variants across hover/focus/active, zero reported contrast failures. All 77 protected hashes unchanged. Edge smoke passed two viewport configurations. Evidence checker passed.
- Current reviewable delivery: docs/A1-STUDENT-JOURNEY-DELIVERY-2026-10-21.md and docs/a1-student-journey-evidence/evidence.json. Both independent review findings and reset focus are fixed and verified; no unresolved review findings were deferred. Earlier stage-only counts/screenshots are historical.
- No branch/worktree change, commit, push, deployment, automation action or future study-feature implementation occurred.
