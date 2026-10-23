# Approved OS course extension

23 October 2026. Direct user approval in this implementation chat supersedes the pilot-only stop boundary: the revised OS-01 explanation was accepted, and the user requested the same teaching method for remaining slides/lectures, meaningful diagrams/graphs (motion where useful), and the preview's simpler logo in the original portal. His final instruction is to work in this same chat; do not create another user chat.

Scope: the three currently linked OS theory decks, represented by OS-01 through OS-19 in the existing source map. Keep other subjects, labs/terminal execution, timetable and college watchers separate. No new framework, dependency or storage model. Preserve the accepted OS-01 payload and eight stable question identities. English concepts with concise Egyptian explanations, final glossaries, selection-based feedback and exact source anchors apply throughout.

Create/modify `education-preview/os/**`, the project-local OS skill, new course plan/state/review records and ignored evidence. Logo changes are limited to the original brand-mark component in `js/a1-identity.js` and its CSS in `css/a1.css` / `css/a1-journey.css`, plus relevant checks. Other original portal/catalog/state/source files remain protected unless an observed integration need is scoped explicitly.

Observed build-seam ruling, 24 October: the required existing build regenerates `css/tailwind.css` with five missing utility selectors already referenced by unchanged course data (`from-emerald-600`, `from-rose-600`, `from-violet-600`, `to-pink-600`, `to-red-600`). Include that deterministic generated CSS refresh so CI's regeneration check is reproducible; no catalog content or dependencies change. Four other generated files changed only LF/CRLF byte format and are restored to their exact baseline bytes. Record this extra generated-file scope explicitly in preservation and PR evidence.

CI-seam ruling: add a dependency-free `test:os` script and include it in the existing verify pipeline; add `education-preview/os/**` to the existing quality workflow path filters. Its runner owns an ephemeral loopback server and uses installed Edge on Windows / installed Playwright Chromium on Linux. This is necessary for the new course and logo checks to run in actual CI, including future course-only changes. No dependencies, permissions, secrets, credentials or deployment workflow are added/changed.

Use concept-appropriate graphics: startup/event traces, cache/memory movement, CPU timelines, architecture layers, process-state graphs, queues, fork/exec/wait and IPC paths. Every graphic defines actors/arrows/assumptions; labelled pedagogical examples are not measurements. User-driven steps/motion must have keyboard/touch controls, pause/stop, reduced-motion handling and a readable static explanation.

Chapters can be authored independently in disjoint unit files against the schema below. The root chat owns UI/runtime, integration, independent review, preservation and publication. Each chapter needs fresh independent source/answer/diagram review after authoring; do not use the author's assertion as scientific acceptance. Use reviewed historical items only after exact mapping, preserve originals and withhold unresolved ones. No mandatory typed response or simulated real shell.

The pilot feedback gate is resolved for OS-01 v1.1.0. The existing scoped PR/merge authorization remains in force after relevant review/checks; the expanded course must be genuinely complete and verified before being reported as such. Reuse the existing public Sites project for review delivery; verify actual publication. Account/quota interruption resumes from the durable course checkpoint and does not authorize billing/model/credential workarounds.

## Unit payload contract

Each new file `education-preview/os/units/os-NN.js` assigns `window.OSPilotLesson` in a browser and exports the same plain object via `module.exports` in Node. No imports or framework. Use the OS-01 payload shape in `lesson-data.js`: `id`, `version`, `guideVersion`, `courseId`, `lectureId` (string), `title`, `subtitle`, `sources`, `concepts`, `historicalItems`, `essayReferences`, `questions`, `glossary`.

- Sources use `current-ch1`, `current-ch2` or `current-ch3` and exact Drive ID/raw hash from the source map. `sourceRefs:[{sourceId,slides:[...]}]` reference exact source pages. Every assigned page needs meaningful concept coverage. Original sources remain unchanged.
- Concept: stable unit-prefixed `id`, English `title`, Egyptian `eyebrow`, short English `summary`, Egyptian `paragraphs` (optional trusted local `<bdi lang="en">` markup), `sourceRefs`; optional `terms`, `roles`, `clarification`, `comparison` as in OS-01. Explain immediate prerequisites without a separate long lecture.
- Questions retain existing schema: stable unit-prefixed IDs and option IDs, `type:mcq|true-false`, `placement` (concept ID or `mixed`), `objective`, `prerequisites` (local concept IDs), English prompt/options where suitable, exactly one `correctOptionId`, Egyptian `feedback` for every option, current `sourceRefs`, `provenance:{kind:'new'}` unless a historical item was actually validated. Both formats must occur in a unit; count follows coverage/quality. Essays are supplied references only.
- Glossary: stable `id`, English `term`, Arabic `translation`, concise English `definition`, Egyptian `explanation`, `sourceRefs`, `kind:source-concept|prerequisite`. Cover the terms actually used.
- New units may omit OS-01's `diagram` and `scenario`; instead use `visualizations` below. Do not add dummy copies of its report story.

## Visualization payload contract

At least one meaningful visualization per new unit: `{id,conceptId,title,description,legend,sourceRefs,svg,steps}`. `id` is unit-prefixed; `conceptId` resolves locally. `title` is English; description/legend/step detail use simple Egyptian explanation with English terminology. `legend` defines actors, arrows, direction, boundaries and any hypothetical assumptions.

`svg` is a complete static inline SVG with explicit `viewBox` (normally around 760x400), legible English labels (~18-22px), rectangles/arrows/shapes/text and optional `<g data-node="stable-node-id">` groups. Use no scripts, event attributes, foreignObject, animation, external assets or remote links. Node IDs must be local to the figure. SVG must teach the actual mechanism, not decorative generic boxes. Parent renderer provides horizontal figure scrolling on narrow screens at full label size plus readable steps.

`steps:[{id,title,detail,focus:[nodeId,...]}]` contains a valid authored sequence or comparison, with English title and Egyptian explanation. Focus IDs refer to actual data-node groups; empty focus is allowed where appropriate. Every explanatory step stays readable through the static alternative. Parent provides previous/next and optional one-pass play with pause and reduced-motion behavior; authors supply no runtime code.

## Ownership

- Chapter 1 writer: OS-02..08, source slides 9..30, only corresponding `units/os-02.js`..`os-08.js` and ignored chapter-1 author evidence.
- Chapter 2 writer: OS-09..12, source slides 4..23, only corresponding unit files and ignored chapter-2 author evidence.
- Chapter 3 writer: OS-13..19, source slides 4..30, only corresponding unit files and ignored chapter-3 author evidence.
- Root: catalog, reader/visual controls, checks, original-logo replacement, review integration, checkpoints, publishing and final scoped merge.
