---
name: sem2-superagent-workflow
description: "Master GitHub-native Super-Agent workflow for Sem2_portal (Study Hub). Enforces the DeepSeek Router-Worker hierarchy, 3.8 vs Argon/ChatGPT GitHub handoffs, isolated worktrees, 5-attempt verification loop, and Google Drive content approval via GitHub Issues."
---

# Sem2_portal Super-Agent Workflow Skill

Use this skill at the start of every task in `Sem2_portal` (`ahm-333/Sem2_portal` and `Eyad-Ahmed-Kamal/Sem2_portal`).

## 1. Identify Operating Mode

Determine which of the 4 workflows applies to the current trigger:

### Mode A: Feature Discovery & Architectural Planning
1. **Scout Phase (`Model 3.8` Workers):**
   - Spawn parallel read-only subagents to inspect affected modules (`js/`, `study/`, `css/`, `tests/`) using `.agents/roles/router-38.md`.
   - Keep each scout summary under 25 lines to prevent context pollution.
2. **Architectural Decomposition (`Argon High` or `ChatGPT` via GitHub PR/Issue):**
   - If **Argon High** is active: synthesize the scout reports using `multi-agent-brainstorming`, `writing-plans`, and `codebase-design`, then publish atomic, non-overlapping GitHub Issues with explicit **Allowed Files**, **Dependencies**, **Acceptance Criteria**, and **Required Skills**.
   - If **Argon High is out of quota**: commit the scout reports into `.agents/handoffs/plan-<slug>.md` on branch `plan/<slug>`, push to GitHub, and open a **Draft PR / Planning Issue** titled `[ChatGPT-Architect-Handoff] <Feature Name>` tagging `@Eyad-Ahmed-Kamal` and `@ahm-333` so ChatGPT can finalize the architectural issues directly on GitHub.

### Mode B: Parallel Issue Execution (The Universal Issue Runner)
1. **Pre-Flight Check:**
   - Read target Issue `#NUMBER`, shared rules in Issue `#4`, and (if applicable) parent Epic `#27`.
   - Verify no open blocker exists and no other active worker is touching the same **Allowed Files**.
2. **Isolated Worktree Creation:**
   - Create an isolated worktree/branch (`codex/issue-<NUMBER>-<slug>`) from latest `origin/main`.
3. **TDD Implementation & 5-Attempt Silent Loop (`Model 3.8`):**
   - Follow `.agents/roles/worker-tdd-loop.md`.
   - Load `tdd`, `codebase-design`, `wcag-audit-patterns`, and `verification-loop`.
   - Run `npm run verify` on a dedicated port. Fix failures silently up to 5 times without weakening any existing test in `tests/`.
   - If still failing after 5 attempts, open a **Draft PR on GitHub** with full failure logs for ChatGPT review and stop.
4. **Two-Stage Review & PR Creation:**
   - Follow `.agents/roles/reviewer-two-stage.md`.
   - Run Stage 1 (Spec Compliance) and Stage 2 (Code Quality & WCAG).
   - Open one linked PR (`pr-writer`) targeting `ahm-333/Sem2_portal` (or fork `main`), request review from `@Eyad-Ahmed-Kamal` / `@ahm-333`, and stop before merging.

### Mode C: Scheduled Google Drive Content Sync (`Model 3.8` Cron)
1. Follow `.agents/roles/content-gdrive-monitor.md`.
2. Scan mounted Google Drive directories (`ZU-FCI Batch Archive/`, `FCI_ZU_Second_General_2.1/`, `ZU-FCI Sections/`).
3. For any new untracked file, open a GitHub Issue asking `@Eyad-Ahmed-Kamal` and `@ahm-333` how to write and structure it.
4. For any existing Content Issue where `@Eyad-Ahmed-Kamal` or `@ahm-333` has replied in a comment, execute their exact instructions in a dedicated branch, verify, and open a linked PR.

### Mode D: Watchdog & Stale Branch Cleanup
1. Check `gh pr list` and `gh issue list` on GitHub.
2. Detect stalled Draft PRs or abandoned branches and report their status cleanly on GitHub.
