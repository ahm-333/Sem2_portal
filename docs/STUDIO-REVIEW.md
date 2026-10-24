# Study Studio, Atlas and Rift

This revision replaces the A1 shell with Study Studio, adds an Atlas course workspace and replaces the processor opening with Study Rift. Course IDs, scientific explanations, original slides, source URLs and timetable records remain authoritative.

## Run locally

Requires Node.js 24 or later for development. Ordinary static browsing does not require Node.js.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm start
```

Open `http://127.0.0.1:8765/`. To replay the opening on an eligible desktop, use `http://127.0.0.1:8765/?intro=rift`. Older `?intro=processor` links replay the new Rift scene too.

## Review the experience

1. **Home:** six real courses, category filters, course search and direct lecture/section entry. Desktop uses a right navigation rail; phones use bottom navigation.
2. **Library:** press `/`, search Arabic/English metadata, and filter by course/resource type. TA scope follows the selected profile, with an explicit all-TAs option. Search covers metadata rather than external PDF/video contents.
3. **Course:** the five-branch map selects lectures, sections, videos, assignments or references. Counts follow course/profile data. The first-source action starts the real explanation where available; staff and schedule details remain in the disclosure. Switching courses retains the source family.
4. **Continue:** open an internal Database Systems explanation, change slide or original/explanation mode, return home and resume. The stored slide and reader mode survive reload. This revision does not add quiz-answer persistence or cloud sync.
5. **Rift:** scroll forward/backward, move the pointer, skip and resize. The sequence appears once per eligible desktop session and yields to onboarding afterward. Direct library/history/timetable links, phones and system reduced motion bypass it.
6. **Reading and quizzes:** verify outline, original slides, zoom, fullscreen, answer feedback, question navigation, reset and focus restoration. Open the three OS chapter links from their original course rows.
7. **Themes/profiles:** try light/dark/reading modes and groups B1-B3 / sections 1-12. Existing saved preferences and learning state are retained. New visitors receive the light theme.

Motion starts automatically. The rejected hero play button and header lightning toggle are absent. Canvas scenes pause rendering offscreen or in a hidden tab and resume on return. System reduced motion provides a static alternative. Reading text remains still.

## Build and verify

```sh
npx --no-install playwright install chromium
npm run verify
git diff --exit-code -- css js/vendor js/study-catalog.js
```

On Linux use `npx --no-install playwright install --with-deps chromium`, as CI does. On Windows, installed Chrome may be selected with `PORTAL_BROWSER_CHANNEL=chrome`.

The build regenerates Tailwind, the lightweight study catalog and locally vendored Three.js modules/license from the exact lockfile version. No runtime CDN is required. Three.js loads only for an eligible Rift entry. Failed imports, unavailable WebGL or context loss use a scroll-responsive Canvas fallback. Cancellation and exit release renderer resources, callbacks and navigation locks.

The suite covers syntax, data, lint, unit tests, functional browsing, source-action parity, contrast, responsive layouts, learning storage and OS entry. Rift cases additionally exercise real WebGL, reverse scroll, pointer input, module/context failure, cancellation, onboarding, skip and replay.

Selected captures and the release verification record are in [review/studio-rift](review/studio-rift/README.md). Raw captures and diagnostics remain outside Git. Historical A1 documents describe the earlier version.

## Implementation map

- `css/studio.css`, `css/studio-motion.css`, `css/studio-atlas.css`: themes, shell, motion and course workspace.
- `js/studio.js`, `js/studio-course.js`, `js/studio-energy.js`, `js/studio-motion.js`: navigation, real source map and bounded interactions.
- `js/a1-ui.js`, `js/rift-intro.js`, `css/rift-intro.css`: opening lifecycle and 3D/Canvas scene. The historical processor implementation is not loaded.
- `js/study-reader.js`: local reader-position persistence/restoration through existing content identities.
- `DESIGN.md`, `.impeccable/design.json`: final design-system record.
- `tests/studio-features.cjs`, `tests/studio-scroll-intro.cjs`: UX and renderer regressions alongside preserved suites.

External Drive/YouTube availability and three already-pending timetable records need their existing maintainer/provider verification. Browser emulation does not certify every physical device/GPU. No database migration or hosting-account change is part of this revision.
