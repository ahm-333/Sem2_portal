# Production-readiness planning handoff

**Decision pending in [upstream #77](https://github.com/ahm-333/Sem2_portal/issues/77).** [Draft PR #76](https://github.com/ahm-333/Sem2_portal/pull/76) carries the [reviewed master plan](../../docs/plans/2026-11-18-production-ready-master-audit.md). The accepted runtime baseline was `68d516c6abe3ec74f7468a808bb8941b26acdf32`. The review input was `cd0ecc401df735f52a783c60ec79c2490248aa4f` on `ahm-333:plan/production-ready-master-audit`. Re-read live GitHub state at dispatch.

## What needs a maintainer decision

- Approve the package scopes and confirm accountable issue owners before implementation. Argon orchestrates. **All audit, fixer and review workers run on `Hydrogen` (`High` setting ONLY).** An unavailable configuration stays queued. Wave 1 deploys **Fleet A (`7` partitioned line-by-line `Hydrogen High` code auditors across `L1`–`L7`)** and **Fleet B (`3` holistic `Hydrogen High` architecture/production auditors `S1`–`S3`)** feeding a single Defect Ledger scheduled via `production-scheduling`. Every completed package requires **at least two independent `Hydrogen High` review agents** (Spec/Defect/Preservation Reviewer + Architecture/Clean Code/Security/WCAG Reviewer).
- Confirm the intended public hosts, release format and owner of any hosting correction. On 18 November the advertised Vercel alias returned 404 for home, the DB lesson and shell CSS. The historical Vercel alias served home and returned 404 for the lesson and stylesheet. GitHub Pages served both lesson files matching the source on `main:/`. Local packaged verification passed 101 checks. Each public target needs revision-bound evidence under #15.
- Retain the append-only journal and existing backup coverage in this release. Compaction and importing standalone CG/DS state would require separate, reviewed contracts.

## Dispatch order

| Wave | Package(s) | Handoff |
|---|---|---|
| 1 | WP-01 | Run Fleet A (`L1`–`L7` line-by-line audit) + Fleet B (`S1`–`S3` full system/architecture audit), pin baselines, freeze budgets and build the central Defect Ledger via `production-scheduling`. |
| 2 | WP-05 | Diagnose the canonical browser failure and validate the response-header policy before broad code verification. |
| 3 | WP-02 and WP-07 | Cross-platform generator checks and current persistence evidence have disjoint file ownership. |
| 4 | WP-03 and WP-04 | Fix delayed lesson resume and characterize helper semantics; isolate power-tool behavior behind stable interfaces. |
| 5 | WP-06 | Characterize one keyed course-resource family, including action priority, profile changes and history. |
| 6 | WP-08 | Use existing #39 for combined lessons, protected content and packaged interaction evidence. |
| 7 | WP-09 | Use existing #15 for the four named browsers, accessibility, performance and host evidence. |
| 8 | WP-10 | Maintainers record actual phone/provider and five-student evidence, the release/rollback decision and any separately authorized live verification on #15. |

The master plan specifies exact file locks, dependencies, acceptance and stop conditions. #4 and #27 supply context. Upstream #2 supplies maintainer evidence. The fork's content-discovery issues have a separate approval process.

## First regressions to verify

1. **Practice can overwrite the last selected DB view.** Delaying the first practice chunk, returning to Topics and completing the load left Topics visible but wrote `view=practice`. Reload reopened Practice. WP-03 owns the repair and WP-08 verifies the integrated reader.
2. **Full browser order matters.** On Windows the canonical run stopped on `quiz-scoring-completion-and-reset` at navigation (22/23). The isolated case passed (1/1). Preserve the failure evidence, behavioral assertions and a bounded readiness check.
3. **A pass needs executed cases.** Register-only modules can exit silently when run directly. The study runner also falls back to Chromium on an unknown engine and accepts an empty scenario filter. Record the actual binary, channel and case IDs.

Each approved implementation issue gets one worktree and linked PR, RED → GREEN at a public seam, up to five silent verification attempts and **at least two sequential independent `Hydrogen High` review gates** (Spec/Defect/Preservation Reviewer + System Architecture/Clean Code/Security/WCAG Reviewer) using the full required tooling matrix (`eslint`, `node --test`, coverage, Playwright multi-engine, CDP probes, contrast audits, `package-site.cjs`). A fifth failure goes to a Draft PR with logs. A fresh passing canonical run, four-browser evidence, manual accessibility checks, real phone/pilot results and live parity remain release gates.
