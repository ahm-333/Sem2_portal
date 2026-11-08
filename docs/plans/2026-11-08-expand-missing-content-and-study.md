# Expand Missing Course Materials and Interactive Study Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expand Sem2_portal with newly discovered Google Drive materials across all courses in two decoupled tracks: Part 1 (portal links, drives, and directory indexing) and Part 2 (interactive educational lessons and quizzes following strict maintainer approval on GitHub).

**Architecture:** 
- Part 1 updates the central portal data (`js/courses-data.js`) with verified Google Drive IDs and section resources so students can access materials immediately.
- Part 2 uses the GitHub-native approval loop: publish atomic `[Content Discovery]` issues tagging `@Eyad-Ahmed-Kamal` and `@ahm-333`. Once approved via issue comments, isolated workers implement interactive lessons in `study/` following Red-Green TDD and 5-attempt silent verification.

**Tech Stack:** Vanilla ES6+, Node.js 24 LTS, Playwright test harness, GitHub REST API, Google Drive CLI.

---

### Scout Summary (Mode A)

- **Affected Data Modules:** `js/courses-data.js`, `js/shared/content-catalog.js`, `js/content-navigation.js`
- **Affected Presentation Modules:** `study/ds/`, `study/os/`, `study/db/`, `study/arch/`
- **Verification Harness:** `npm run verify` (`npm test`, `test:browser`, `test:study`, `test:os`, `test:lesson`, `test:practice`)
- **Key Seam Rule:** Never alter existing tests in `tests/` or invent course content without explicit maintainer comment on GitHub.

---

### Task 1: Part 1 - Portal Directory and Resource Links Indexing

**Files:**
- Modify: `js/courses-data.js`
- Test: `tests/lesson-content.test.cjs`, `tests/content-catalog.test.cjs`

**Step 1: Write verification test for missing course lecture links**
Ensure that newly discovered files (e.g. Data Structures Lectures 7 & 8, OS Chapters 6 & 7, Database Chapter 4) have valid entry records and drive URLs without corrupting existing IDs.

**Step 2: Update `js/courses-data.js`**
Add missing lecture objects and section metadata for:
- Data Structures: Lectures 7 & 8
- Operating Systems: Chapters 6 & 7
- Database Systems: Lecture 1 & Lecture 6 (Chapter 4)
- Report Writing: Chapters 5 & 6

**Step 3: Run validation**
Run: `npm run validate && npm test`
Expected: PASS with 0 errors.

---

### Task 2: Part 2 - Publish GitHub Content Discovery Issues

**Files:**
- GitHub Issues via `tools/content-monitor.cjs` / GitHub REST API

**Step 1: Create atomic issues per course**
1. Data Structures: `[Content Discovery] Data Structures: Lectures 7 & 8 and Lab Sections`
2. Operating Systems: `[Content Discovery] Operating Systems: Chapters 6 & 7 and Lab Exercises`
3. Database Systems: `[Content Discovery] Database Systems: Lectures 1 & 6 and Lab Sections`
4. Report Writing: `[Content Discovery] Report Writing: Chapters 5 & 6 and Test Banks`

**Step 2: Tag maintainers and request approval**
Body must explicitly tag `@Eyad-Ahmed-Kamal` and `@ahm-333` asking:
1. Desired lesson structure and sections.
2. Explanations depth, visual diagrams, and quiz coverage.
3. Authoritative reference files from Google Drive.

---

### Task 3: Part 2 - Automated Maintainer Reply Execution

**Files:**
- Isolated branch: `codex/content-issue-<NUMBER>`
- Dedicated lesson files in `study/<course>/`

**Step 1: Poll maintainer reply**
`node tools/content-monitor.cjs` detects authorized comment from `@Eyad-Ahmed-Kamal` or `@ahm-333`.

**Step 2: Implement strictly to specification**
Follow `sem2-os-teaching`, `frontend-design`, and `wcag-audit-patterns`.

**Step 3: Silent 5-Attempt Verification**
Run `npm run verify`. Never weaken assertions.

**Step 4: Two-Stage Review & PR Creation**
Open Pull Request linking the issue and request human review.
