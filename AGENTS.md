# Study Hub (`Sem2_portal`) — Autonomous Super-Agent System Constitution

This repository uses a **GitHub-Native Super-Agent Architecture** modeled on the **DeepSeek Super-Agent Router-Worker design** and **Anthropic/OpenAI Orchestrator-Worker-Evaluator loops**.

Every agent session (Antigravity Local, Antigravity Remote Cloud `zero project auto`, or ChatGPT/Codex) MUST read and obey this constitution before taking any action.

---

## 1. Core Principles & Repository Authority

- **Upstream Repository:** `ahm-333/Sem2_portal`
- **Cloud Fork Repository:** `Eyad-Ahmed-Kamal/Sem2_portal`
- **Authorized Human Maintainers:** `@Eyad-Ahmed-Kamal` and `@ahm-333` (both have equal authority to approve plans, answer content questions, and review PRs on GitHub).
- **Shared Native Project Board:** `https://github.com/users/Eyad-Ahmed-Kamal/projects/2` (`لاحقًا → جاهز → قيد التنفيذ → للمراجعة → مكتمل`).
- **GitHub is the Single Source of Truth:** All task assignments, file ownership boundaries, questions, escalations, and handoffs happen officially on GitHub via Issues and Pull Requests. Never rely on manual text copy-pasting between chat windows.
- **Language Rule for Direct User Chat:** When speaking directly to `@Eyad-Ahmed-Kamal` in chat, write pure Arabic sentences without mixing Latin characters on the same line (to prevent LTR/RTL line-splitting in the chat UI). Place English commands, skill names, or code inside separate fenced code blocks.

---

## 2. Two-Layer Super-Agent Hierarchy & 3-Tier Model Routing

Because **Gemini 4 Argon (High)** has a strict quota limit while **Model 3.8 (Flash / Pro tier)** has high availability, the system separates continuous routing/execution from deep architectural reasoning:

### Layer A: The Router & Daily Operational Engine (`Model 3.8`)
- **Handles 85% of system operations** to preserve Argon quota:
  - Runs all scheduled cron/heartbeat checks (monitoring Google Drive folders and GitHub Issue/PR comments).
  - Scans the codebase and prepares concise file-impact summaries before architectural planning.
  - Dispatches isolated worker subagents (`invoke_subagent` with `Workspace: "share"` or dedicated `git worktree`).
  - Executes bounded issues using strict skills and runs the **5-Attempt Silent Verification Loop**.
- **Guardrail:** Model 3.8 never invents architectural scope outside an approved GitHub Issue contract.

### Layer B: Strategic Architect & Deep Final Reviewer (`Argon High` ↔ `ChatGPT` GitHub Handoff)
- **Used strictly for 15% high-leverage decisions:**
  1. Decomposing a new multi-file feature into non-overlapping GitHub Issues.
  2. Performing final deep architectural review on complex Pull Requests.
- **Official GitHub Handoff to ChatGPT (When Argon Quota is Exhausted or Unavailable):**
  - **Never ask the human to copy-paste text prompts to ChatGPT.**
  - **Planning Handoff:** If Argon is unavailable when planning a new feature, the 3.8 Router dispatches read-only scout workers to map affected files, commits the structured discovery report to a planning branch (`plan/<feature-slug>`), and opens a **Planning Issue or Draft Pull Request on GitHub** tagging `@Eyad-Ahmed-Kamal` and `@ahm-333` with label/title `[ChatGPT-Architect-Handoff]`. ChatGPT then interacts directly with that GitHub Issue/PR to publish the final child issues.
  - **Review / Escalation Handoff:** If a worker fails verification after 5 attempts or requires deep architectural review when Argon is unavailable, the agent pushes the branch, opens a **Draft Pull Request on GitHub** containing the exact failure logs and diff context, and tags `@Eyad-Ahmed-Kamal` so ChatGPT can review and repair the PR directly on GitHub.

---

## 3. Universal Issue Execution Protocol (One Issue = One Worktree = One PR)

When executing any assigned GitHub Issue `#NUMBER` in `ahm-333/Sem2_portal`:

1. **Read Authority Context First:**
   - Read the live description and comments of Issue `#NUMBER`.
   - Use **Issue `#4`** only as the shared work reference for project rules and dependencies.
   - Use **Issue `#27`** as the parent plan for educational presentation/DB/DS unification tasks.
   - Do **not** execute the full roadmap in `#4` or `#27`, implement sibling issues, or start another issue.
2. **Dependency & Ownership Pre-Flight:**
   - Check live assignees, native `blocked-by` edges, existing PRs, and open branches first.
   - If an unfinished dependency blocks `#NUMBER`, report the blocker on the issue/chat and stop immediately.
   - Enforce **strict file-ownership boundaries**: two parallel workers must NEVER modify the same file simultaneously. If two ready issues touch a shared file (e.g., `js/studio.js` or `js/study-session.js`), serialize them sequentially.
3. **Isolated Workspace & Worktree:**
   - Always use a dedicated Git worktree and branch (`codex/issue-<NUMBER>-<slug>`) branched from the latest accepted `main` (or `Workspace: "share"` when spawning a subagent).
   - Preserve existing dirty checkouts; never switch, reset, or overwrite another session's worktree.
   - Always clean up orphaned temporary artifacts before finishing.
4. **Automatic Phase-Based Skill Routing:**
   Load and obey the bundled skills in `.agents/skills/<skill-name>/SKILL.md` automatically at each phase without waiting for stage-by-stage human prompting:
   - **Meta & Dispatch:** `using-superpowers`, `subagent-driven-development`, `dispatching-parallel-agents`, `executing-plans`, `sem2-superagent-workflow`
   - **Feature Brainstorming & Planning:** `multi-agent-brainstorming`, `writing-plans`, `codebase-design`
   - **Implementation (Red-Green TDD & Frontend):** `tdd`, `javascript-pro`, `modern-javascript-patterns`, `frontend-design`, `wcag-audit-patterns`
   - **Silent 5-Attempt Verification Loop:** `verification-loop`, `diagnosing-bugs`, `systematic-debugging`, `testing-qa`, `test-automator`, `playwright-skill`, `webapp-testing`, `ui-visual-validator`
   - **Two-Stage Review & PR Delivery:** `verification-before-completion`, `code-review-excellence`, `requesting-code-review`, `receiving-code-review`, `finishing-a-development-branch`, `github`, `github-ops`, `pr-writer`

---

## 4. The Silent 5-Attempt Verification Loop & Anti-Cheat Guardrails

Every implementation worker runs inside a strict verification loop before reporting back to the Router:

1. **Run Canonical Verification:**
   - Execute `npm run verify` (and targeted Playwright specs in `tests/`) using an isolated dynamic local port so parallel workers never collide on the same port.
2. **Anti-Oracle-Bias Rule (No Test Tampering):**
   - The implementation worker is **strictly forbidden** from deleting, skipping, or weakening existing assertions in `tests/` to make a failing run pass.
   - New tests must follow RED → GREEN vertical slices at public seams (`tdd` skill).
3. **Loop Policy (Max 5 Attempts):**
   - If verification fails, use `diagnosing-bugs` and `systematic-debugging` to fix the implementation code and re-run verification.
   - Repeat silently up to **5 attempts**.
   - **If all checks pass (0 errors):** Proceed to the Two-Stage Review Gate.
   - **If checks still fail after 5 attempts:** Stop looping, commit the current state to the issue branch, open a **Draft Pull Request on GitHub** with the exact failure output and reproduction steps, and escalate for **ChatGPT / Human review**.

---

## 5. Two-Stage Independent Review Gate

No worker may grade its own work. Before a Pull Request is marked ready for merge:

1. **Stage 1 — Spec Compliance Gate (`spec-reviewer`):**
   - An independent subagent verifies line-by-line that the diff satisfies every acceptance criterion of Issue `#NUMBER`, respects the allowed file boundary, and has not tampered with existing preservation tests.
2. **Stage 2 — Code Quality & WCAG Gate (`code-quality-reviewer` — Argon High or 3.8 + ChatGPT Escalation):**
   - Reviews code depth (`codebase-design`), RTL/Arabic layout integrity, light/dark/reading theme sync, and `WCAG 2.2 AA` touch/keyboard accessibility (`wcag-audit-patterns`).
   - Once approved, opens/marks one clean linked Pull Request (`pr-writer`), moves the card on the shared Project board to `للمراجعة`, requests review from the other collaborator (`@Eyad-Ahmed-Kamal` or `@ahm-333`), and **stops before merging or deploying**.

---

## 6. Scheduled Google Drive Content Agent & Dual-Maintainer Protocol

In the Remote Cloud environment (`zero project auto`), three Google Drive folders are mounted as workspace resources:
- `ZU-FCI Batch Archive/`
- `FCI_ZU_Second_General_2.1/`
- `ZU-FCI Sections/`

The Content Monitor Agent operates on a recurring schedule (`Model 3.8`) under these strict rules:

1. **Never Invent or Auto-Publish Content:**
   - The Content Agent must **NEVER** decide on its own how to write, summarize, or structure new course content, nor rely on autonomous assumptions.
2. **Step A — Detect New Files & Ask on GitHub:**
   - Scan the mounted Google Drive folders and compare against existing tracked materials/lessons.
   - When a new lecture, section, or resource file is found that has no corresponding GitHub Issue, open an official **GitHub Issue** titled `[Content Discovery] <Course> - <File Name>` tagging both `@Eyad-Ahmed-Kamal` and `@ahm-333` with label `content-approval-needed`.
   - Inside the Issue body, list the file path, course, and ask the maintainers:
     1. How should this content be added and structured?
     2. What writing style, depth, and sections should be used?
     3. Which exact source files/references should it rely on?
3. **Step B — Poll for Maintainer Reply (`@Eyad-Ahmed-Kamal` OR `@ahm-333`):**
   - On each scheduled run, inspect open `content-approval-needed` Issues on GitHub.
   - If **either `@Eyad-Ahmed-Kamal` or `@ahm-333`** posts a comment with instructions, treat that comment as authoritative approval.
4. **Step C — Execute & Open PR:**
   - Create a dedicated branch (`codex/content-issue-<NUMBER>`), implement the content strictly following the maintainer's comment instructions, run `npm run verify`, and open a Pull Request linked to the Content Issue for final approval.
