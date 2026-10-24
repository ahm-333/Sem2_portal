# Release verification

Validated on 24 October 2026 from an isolated checkout based on `origin/main` at `aeb7ed6`. The existing hosting branch and its two local commits are outside this change.

## Installation and full checks

`npm ci --ignore-scripts --no-audit --no-fund` succeeded with Node.js 24.13.0 and the committed lockfile.

`PORTAL_BROWSER_CHANNEL=chrome npm run verify` completed successfully:

| Check | Result |
| --- | --- |
| Asset build, JavaScript syntax and ESLint | Passed |
| Data validation | Zero errors; three existing pending timetable records |
| Unit tests | 64 passed |
| Functional browser scenarios | 23 passed |
| Portal UX, source parity, contrast, responsive and Rift scenarios | 55 passed |
| Study/catalog/links/storage scenarios | 14 passed |
| OS course validation, browser/motion, shared identity and portal entry | All five stages passed |

The 55 portal scenarios include shader rendering, reverse scrolling, context loss, module failure, cancellation, session/replay, onboarding and return to Studio. The existing content baseline verifies the original data, scientific explanations, slide assets and source links.

## CI renderer

The focused WebGL/reverse-scroll/pointer/context-loss scenario also passed with `CI=true`, which selects an isolated SwiftShader software renderer for GPU-less hosted CI. Normal browser behavior is unchanged. GPU fallback tests exercise the separate Canvas path; a static capture is not a physical-device frame-rate guarantee.

## Scope and reproducibility

- Only the Studio/Atlas/Rift implementation, its tests, design record and selected evidence are included.
- No scientific content, timetable records, automation, hosting-account configuration or old experimental archives are changed.
- Three.js is pinned to `0.186.1`; the two vendored modules match the installed package bytes, with its MIT license preserved. Git marks these generated upstream files as vendored and preserves their line endings.
- Generated captures and local test diagnostics are ignored; the five selected PNGs in this folder are intentional review assets.
- The asset regeneration check is part of the existing GitHub workflow.

See [the review guide](../../STUDIO-REVIEW.md) for the manual walkthrough and supported entry/replay behavior.
