# Performance and production review — 25 October 2026

Audited source: `547b084330cb744bf9bd6dfc363243c49deafc8e` from `ahm-333/Sem2_portal`. The earlier local checkout contained unrelated work; this change was made in an isolated checkout. Design, course/source records, quizzes, schedules and explanations are preserved.

## Findings and fixes

1. **A legacy course layout could paint before Studio/Atlas initialized.** Holding `studio-course.js` for 900 ms reproduced 196 visible legacy frames. Application scripts now download with `defer`, retain dependency order, and reveal the completed shell in one animation frame after DOM initialization. Script-error and JavaScript-disabled fallbacks remain visible. Regression: `performance-no-legacy-course-paint-during-slow-boot`.
2. **The home page built 91 invisible library rows on startup.** Library rows are created on first entry and invalidated by profile/filter changes. Search metadata is normalized once per page. Regression: `performance-library-is-created-on-first-use` and existing library/profile/history tests.
3. **Canvas continued rendering under modal readers.** The shared dialog lifecycle now signals background visibility. Energy scenes stop when inert or covered by the opening and resume when usable. The regression observes actual Canvas draws, not just CSS classes.
4. **Every visit downloaded the complete icon registry.** The build uses Lucide's official renderer with icons discovered in runtime sources. Its local bundle shrank from 454,638 to 41,160 bytes. Existing six-course/icon coverage validates the subset. Exact dependency versions remain in the lockfile.
5. **Production published the repository root.** A checked `dist` build now admits runtime assets only, including all standalone study pages, OS units, slide images, licenses and app icons. Development, automation, research, manifests and credentials are excluded from the public artifact. A guarded marker prevents replacing an unrelated directory.
6. **Production used many independent script/style requests.** The packager preserves execution/cascade order, produces a single deferred application bundle and one combined stylesheet per entry, and serves their content-hashed URLs with immutable caching. Lazy explanation/intro assets remain lazy; stable asset URLs retain revalidation behavior.
7. **Nine standalone teaching pages compiled Tailwind in the browser.** Their original configurations now generate local CSS during the build. Stylesheet precedence and exact translucent RGB values are preserved. Ten-page browser comparison found zero differences in the recorded computed properties across 8,816 class-bearing elements. This is a measured style comparison, not certification of every browser/GPU.
8. **Standalone fonts, icons and diagrams required third-party CDNs.** Existing Google Fonts responses and licenses are mirrored locally with the same families, weights and subsets. Font Awesome 6.5.1 and Mermaid 10.9.8 match the previous CDN versions and are vendored from pinned dependencies. The upstream Mermaid license omitted from its npm package is included from release commit `49c1a1c7d1faa995b07cc7224543bd0d9a7a9e70`. Builds do not fetch fonts or executable code from CDNs.
9. **Opening assets formed an unnecessary network waterfall.** Independent GSAP plugins now load concurrently after the core, before the unchanged processor composition is mounted. Cancellation checks remain between stages.
10. **New study/release changes did not all trigger CI.** The quality workflow includes `study/**` and deployment configuration. `npm run verify` now tests the actual packaged artifact as well as source behavior.
11. **Four navigation links in Architecture chapter 1 returned 404.** Home links now point to the real portal root and chapter-index links point to the existing Architecture index. A static link regression checks every standalone page. The content baseline records exactly these four permitted opening-tag changes; all teaching bodies still match the original after normalizing those navigation targets and line endings.

## Evidence and limits

- `tests/performance-browser.cjs`: reproducible RED before fixes; four passing regressions afterward, covering slow boot, lazy library, Canvas suspension, script failure and no-JS fallback.
- `tests/static-package.test.cjs`: publication boundary, original teaching-body hashes and mirrored font integrity. The baseline record is `content-baseline.json`.
- `tests/production-browser.cjs`: actual minified release, root and GitHub Pages prefixes, 390/1440 px layouts, six courses, reader/quiz lazy loading, all 19 OS units, ten standalone pages and private-file 404s. External requests are blocked and must remain absent for these core routes.
- `tools/performance-probe.cjs`: controlled Chrome runs, configured profile, intro dismissed. Initial resource requests fell from 36/41 to 10 for home/course. Initial decoded resource bytes were approximately halved. The measured course legacy-frame count fell to zero. These are local controlled observations, not field data or a promise of latency on every connection.
- `tools/study-page-probe.cjs`: compares original and revised computed layout properties and captures images. Raw logs, captures and measurements stay in ignored `test-results/performance/`.
- Existing suites cover source actions, all groups/sections, themes, search, back/forward, intro/drag/cancellation, reader/quiz focus, storage restrictions/synchronization, OS content and responsive behavior.
- No authentication, payments, backend database, AI endpoint or migration exists in the runtime being released. No such infrastructure was added. Existing automation was excluded from publishing and otherwise left alone.

## Release and rollback

The supplied temporary URL and the README's old `sem2portal.vercel.app` URL were different deployments; the latter served an older portal. Neither deployment was accessible under the authenticated Vercel team. This release uses the permanent `kernal-study-portal` project in `eyad-ahmed-kamals-projects` (`prj_81oyYfZTQBZhQvZA3YCyqbUF6noj`). It is a direct source upload; GitHub merging does not imply that automatic Vercel Git integration is configured.

```powershell
npm ci --ignore-scripts --no-audit --no-fund
npm run verify
vercel deploy --prod --skip-domain --scope eyad-ahmed-kamals-projects
# Test the returned public deployment before assigning the production domain.
$env:PORTAL_RELEASE_URL = 'https://<verified-deployment>.vercel.app/'
$env:PORTAL_BROWSER_CHANNEL = 'chrome'
node tests/production-browser.cjs
vercel promote https://<verified-deployment>.vercel.app --scope eyad-ahmed-kamals-projects
```

Use `vercel rollback <previous-production-deployment-url> --scope eyad-ahmed-kamals-projects` for subsequent releases. This is the first production release on the permanent project; the original temporary deployment is preserved, and source commit `547b084` is the pre-review recovery point. A different origin has its own browser storage; this release does not pretend to transfer study progress from another domain.

The three pre-existing pending timetable records still require authoritative university confirmation. Drive/YouTube access depends on their owners; no course link or timetable entry was guessed. The site is still an online static portal, not a new offline service or cloud progress account.
