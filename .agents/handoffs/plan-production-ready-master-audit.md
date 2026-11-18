# [ChatGPT-Architect-Handoff] 0-to-100 Production-Ready & Clean Architecture Master Audit Plan

- **Branch:** `plan/production-ready-master-audit`
- **Base Commit:** `68d516c6abe3ec74f7468a808bb8941b26acdf32` (`ahm-333/Sem2_portal` `main`)
- **Full Master Plan:** [`docs/plans/2026-11-18-production-ready-master-audit.md`](../../docs/plans/2026-11-18-production-ready-master-audit.md)
- **Execution Model Contract:**
  - **Orchestrator / Architect:** `Argon`
  - **Worker Agents:** `Hydrogen` on **`High` setting only** (NOT `Extra High`)
  - **Verification & Review Gates:** RED→GREEN TDD, 5-Attempt Silent Verification Loop (`npm run verify`), Anti-Oracle-Bias (zero test weakening), Two-Stage Independent Review (`spec-reviewer` + `code-quality-reviewer`).

## Summary of Requested External Architectural Review (`Codex / ChatGPT`)

1. Stress-test the **8-Pillar Production Readiness Audit** (`WP-01`, `WP-08`, `WP-09`, `WP-10`) for completeness against `Issue #39`, `Issue #15`, `PRODUCT.md`, `DESIGN.md`, and `docs/STUDY-FEATURE-CONTRACTS.md`.
2. Deepen and sharpen the **5 Clean Code / Clean Architecture / Orthogonality / ETC (`Easy To Change`) Refactoring Tracks** (`R1`–`R5`, mapped to `WP-02`–`WP-07`):
   - `R1`: Decomposing `js/course-power-tools.js` (`1,161` lines) into orthogonal Midterm, Timer, and Notifications engines.
   - `R2`: Eliminating duplicated `escapeHtml` (`6` copies), `safeURL`/`safeHref`, and `PortalStorage` wrappers across `js/` and `study/`.
   - `R3`: Simplifying the 3-generation course rendering pipeline (`js/subject.js` + `js/subject-content.js` + `js/a1-journey.js` + `js/studio-course.js`) into an ETC viewmodel/presenter seam.
   - `R4`: Designing safe Lamport-clock journal compaction in `js/shared/study-state.js` and evaluating unified persistence for `study/cg/*` & `study/ds/question-bank.js`.
   - `R5`: Eliminating the post-72-loop `6000ms` timeout flakiness in `tests/browser.cjs`, resolving Windows LF/CRLF `npm run build` churn in `.gitattributes`, and auditing ignored legacy `tools/*.js` & unused CSS.
3. Verify zero file-ownership overlaps across `WP-01`..`WP-10` so `Argon` can deploy `Hydrogen (High)` workers cleanly in parallel waves.
