# Study Hub: A1 implementation review

This is the current implementation handoff. Earlier dated documents describe the local design and verification stages; their local-only restrictions were superseded by Eyad's explicit request to upload this work for review on 21 October 2026. No merge or deployment is requested.

## What changed

- Study Hub branding, with the home headline **اختار مادتك وابدأ.**
- A compact course chooser and a separate university timetable view.
- One resource family at a time: lectures, sections, videos, assignments, and references/tools. Existing source actions and old lecture/section URLs remain available.
- Focused reading of the two real Database Systems explanations, one slide at a time, with outline, original slides, font size and fullscreen controls.
- One quiz question at a time, retaining the existing answer feedback, explanations, map, results and reset behavior.
- Local Alexandria fonts, the Flex pointer, three themes, a fixed navbar after the eligible desktop intro, and corrections to invisible button labels/icons.

The scientific data, original slide images, source links and timetable records are unchanged. The content hash test accepts Git's LF/CRLF checkout conversion for text files only; binary assets still require their exact original hashes. The separately discussed progress/resume/backup features are not implemented.

The first GitHub CI run exposed two host-dependent UI failures: late theme initialization animated from the default palette, and wider fallback font metrics pushed the first lecture action below a 360×900 viewport. Theme initialization now runs in the head before styles/body paint, and mobile pre-source spacing is smaller while controls and font sizes remain intact. Both failures were reproduced locally before fixing them; regressions include delayed theme loading and Arial fallback metrics.

## Run and continue work

Use Node.js 24 or newer. From the repository:

```sh
git fetch origin
git switch --track origin/codex/study-hub-a1-review
npm ci --ignore-scripts --no-audit --no-fund
npm start
```

Open http://127.0.0.1:8765/. If the branch already exists locally, use `git switch codex/study-hub-a1-review`. Review fixes can be committed and pushed to this same branch; they will update the pull request.

For the complete checks:

```sh
npx playwright install chromium
npm run verify
```

On Linux, Playwright may need `npx playwright install --with-deps chromium`, as used by the existing CI workflow. Build assets are committed, so normal static browsing does not require Node.js.

## Suggested review walkthrough

1. Open a fresh eligible desktop session: intro fills the viewport; navigation appears only after completion/skip. Try resizing, reduced motion, and keyboard navigation.
2. Choose B1/B2/B3 and sections 1–12. Check the timetable, staff context and repeated profile changes.
3. Search the six courses using their original and display names. Check the empty-search state.
4. Enter a course, switch resource families, switch courses, and use browser Back. Check the source type and old `track` links.
5. Exercise real preview, external open, download and copy actions, including the originally reported Computer Architecture video and Computer Graphics slide buttons in all themes.
6. Open Database Systems lectures 2 and 3. Navigate explanation/original slides, outline and keyboard; try text zoom and fullscreen.
7. Complete/reset both quizzes and check their maps, explanations, scoring, and focus restoration.
8. Check narrow layouts and a real phone, especially text wrapping, touch targets, controls and media behavior. Review at 200% zoom.

## Items needing maintainer decisions or wider verification

- Confirm the three pending timetable records and missing staff/time data against an authoritative schedule. See [PENDING-TIMETABLE.md](PENDING-TIMETABLE.md). Do not infer corrections from the old `-2` keys.
- Check access and availability of external Drive, YouTube and explanation resources with the intended student accounts. Automated functional checks intentionally block external providers.
- Review on real phones and additional browsers. Existing evidence is Chrome automation with phone emulation plus an Edge smoke check; it does not certify Firefox, WebKit or screen readers.
- Add concrete visual/usability feedback to the review issue, ideally with viewport, theme, profile, URL, reproduction steps and expected behavior.

## Where to edit

- `js/a1-journey.js`, `css/a1-journey.css`: course chooser, timetable view, source families and compact rows.
- `css/a1.css`, `js/a1-ui.js`, `js/a1-cursor.js`: appearance, navbar lifecycle and Flex cursor.
- `js/processor-intro.js`, `css/processor.css`: intro scene; libraries and licenses are local.
- `js/study-reader.js`, `js/study-quiz.js`: real study interactions.
- `js/subject.js`, `js/app.js`: original course/profile/search rendering.
- `tests/a1-browser.cjs`, `tests/browser.cjs`: new journey checks and preserved original behavior.

The minimal historical reference under `design-exploration/2026-10-20/` is included only because an existing regression checks the approved prototype. It contains mock progress screens and is not the live application. Start at root `index.html`; production pages do not load its `core.js`.

See [the delivery report](A1-STUDENT-JOURNEY-DELIVERY-2026-10-21.md) and [review evidence](a1-student-journey-evidence/) for screenshots and recorded validation. Current verification for the upload is recorded in `a1-student-journey-evidence/github-review-verify.txt`; older captures/logs retain their dated context.
