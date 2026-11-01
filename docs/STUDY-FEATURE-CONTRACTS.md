# Study Feature Contracts

This document records the exact signatures, shapes, and failure semantics for the modular Study Hub features. Each feature issue owns its section and establishes its contract before dependent work proceeds.

---

## 1. Study 01 — Content Identity and Lightweight Quiz Metadata

**Owner:** Issue #5 (`[Study 01] Establish stable content identity and lightweight quiz metadata`)

### Browser Singleton & Node Factory

- **Browser Global:** `window.PortalCatalog`
- **Node Factory:** `createCatalog({courses, studyCatalog, presentation})` exported from `js/shared/content-catalog.js`.

### Canonical Key Generator

```typescript
PortalCatalog.key(courseId: string, type: ContentType, id: string | number): string
```

- **Output:** `JSON.stringify([String(courseId), type, String(id)])`
- **Guarantees:**
  - `0` and `"0"` resolve to the exact same key: `JSON.stringify([String(courseId), type, "0"])`.
  - Rejects `null` and `undefined` arguments by throwing a `TypeError`.
  - Punctuation and quotes within IDs are JSON-escaped, preventing key collision.
  - Never keyed by title, translated name, URL, array index or TA.

### Content Types (`ContentType`)

1. `lecture` (from `course.lectures`, track: `lecture`, kind: `lectures`)
2. `section` (from `course.sections`, track: `section`, kind: `sections`)
3. `assignment` (from `course.assignments`, track: `section`, kind: `assignments`)
4. `video` (from `course.videoExplanations`, track: `lecture`, kind: `videos`)
5. `theory-resource` (from `course.resources`, track: `lecture`, kind: `resources`)
6. `practical-resource` (from `course.practicalResources`, track: `section`, kind: `resources`)
7. `explanation-site` (from `course.explanationSite`, id: `'site'`, track: `lecture`, kind: `resources`)

### Entry Schema

```typescript
interface CatalogEntry {
  key: string;               // Canonical key
  courseId: string;          // Authoritative course ID
  type: ContentType;         // One of the 7 types
  id: string | number;       // Original ID (or 'site')
  courseName: string;        // Original course name
  displayCourseName: string; // Presentation display name
  code: string;              // Course code
  title: string;             // Main title
  arabicTitle: string | null;// Arabic title or null
  description: string;       // Searchable description / notes (secrets excluded)
  topics: string[];          // List of topics / features
  ta: string | null;         // Assigned TA or null
  track: 'lecture' | 'section';
  kind: 'lectures' | 'sections' | 'assignments' | 'videos' | 'resources';
  actions: ActionDescriptor[];
  study: StudyMetadata | null;
}

interface ActionDescriptor {
  id: string;                // 'internal-study' or URL field name (e.g., 'driveViewUrl')
  field?: string;            // Source property name
  url?: string;              // Resolved external URL
  type?: 'internal';         // 'internal' for local study modal
  label: string;             // Arabic accessible label
}

interface StudyMetadata {
  totalSlides: number;
  hasFullQuiz: boolean;
  quizVersion: string | null; // 12-char SHA-256 hash
  questionCount: number;
  questionIds: Array<number | string>;
  optionCounts: number[];
}
```

### Public Methods

- `list(): CatalogEntry[]`: Returns a shallow copy array of all catalog entries in deterministic order.
- `get(key: string): CatalogEntry | null`: Returns the matching `CatalogEntry`, or `null` if the key is unknown or malformed.

### Study Catalog & Quiz Version Generation

- Generated in `js/study-catalog.js` via `npm run build`.
- Quiz versions are computed by `tools/content-catalog.cjs` using sorted question IDs and normalized LF text across question body, options, and correct index.
- No quiz question text, answers, or slide content are preloaded on the home page.


---

## 2. Study 02 — Content Links and Safe Row Reveal Navigation

**Owner:** Issue #6 (`[Study 02] Resolve item-level links into the correct resource family and row`)

### Browser Singletons & Factory

- **Browser Globals:** `window.PortalContentLinks`, `window.PortalContentNavigation`
- **Node Factory:** `createContentLinks({catalog})` exported from `js/shared/content-links.js`.

### URL Generation & Parsing

```typescript
PortalContentLinks.href(key: string, options?: {
  actionId?: string;
  slide?: number | string;
  tab?: 'explanation' | 'original' | 'quiz';
}): string

PortalContentLinks.parse(urlOrLocation: string | Location | URL): {
  isValid: boolean;
  courseId: string | null;
  track: string | null;
  kind: string | null;
  item: string | null;       // Canonical content key
  actionId: string | null;
  slide: number | null;
  tab: 'explanation' | 'original' | 'quiz' | null;
}
```

- **Guarantees:**
  - Same-site relative URLs targeting `subject.html`.
  - Preserves course ID, track (`lecture` | `section`), and kind (`lectures` | `sections` | `assignments` | `videos` | `resources`).
  - Canonical item key passed in query parameter `item`.
  - Safe parsing: malformed or unknown keys return `isValid: false` without throwing errors.

### Content Row Navigation & Revelation

```typescript
PortalContentNavigation.reveal(key: string, options?: { focus?: boolean }): Promise<{
  found: boolean;
  reason?: 'invalid_key' | 'not_found' | 'hidden_by_ta_filter' | 'row_not_found';
  element?: HTMLElement;
  ta?: string;
}>
```

- **Guarantees:**
  - Selects the target resource family/track via `PortalJourney.selectFamily(entry.kind)`.
  - Locates rows by exact `data-content-key` attribute comparison, never by fuzzy title matching.
  - Scrolls below the measured fixed navbar (`window.pageYOffset + rect.top - navHeight - 16`).
  - Focuses target element and highlights it temporarily.
  - If target is hidden by a TA filter, displays an explanatory notice offering a labelled route to the TA/all view without modifying the user's saved profile.
  - Unknown keys display a recoverable error notice.
  - The active renderer instance is `PortalSubjectContent.current`; `showForEntry(entry)` reveals a section/assignment/practical target using its TA filter, or reveals all theory resources. It never saves a different student profile. Every practical row carries its canonical key before A1 compaction.

### Event Contracts

- `portal:family-changed`: Dispatched after selecting a resource family:
  ```javascript
  detail: { kind: string, track: string }
  ```
- `portal:content-ready`: Dispatched after rows are rendered or compacted (including after student profile switches):
  ```javascript
  detail: { courseId: string }
  ```


---

## 3. Study 03 — Versioned Study Storage and Safe Multi-Tab Writes

**Owner:** Issue #7 (`[Study 03] Add versioned study storage with failure recovery and safe multi-tab writes`)

### Browser Singleton & Node Factory

- **Browser Globals:** `window.PortalStudyState`, `window.PortalStudySaveStatus`
- **Node Factory:** `createStudyState({ storage })` exported from `js/shared/study-state.js`.

### Logical Snapshot Schema

```typescript
interface StudySnapshot {
  schemaVersion: 1;
  items: Record<string, StudyItemState>;
  lastUsed?: {
    key: string;       // Canonical content key
    actionId: string;  // e.g. 'internal-study' or resource action id
    updatedAt: string; // ISO 8601 timestamp
  } | null;
}

interface StudyItemState {
  startedAt?: string;
  manualComplete?: boolean;
  reader?: {
    slideId: number | string;
    tab: 'explanation' | 'original' | 'quiz';
    updatedAt: string;
  };
  quiz?: {
    version: string;
    answers: Record<string, number>;
    activeQuestionId?: string | number;
    completedVersions?: string[];
    lastCompleted?: QuizResultSummary;
    bestCompleted?: QuizResultSummary;
    archivedResults?: QuizResultSummary[];
  };
}

interface QuizResultSummary {
  version: string;
  score: number;
  total: number;
  completedAt: string;
}
```

### Physical Storage Representation

- **Namespace:** `sem2_study_v1:`; preference keys remain outside it and are never changed.
- **Read-only legacy input:** `meta` and `item:<encodedKey>:base|reader|quiz` from the unfinished implementation remain readable and byte-for-byte unchanged. Invalid or newer legacy metadata blocks writes rather than being silently migrated or overwritten.
- **Atomic publication:** new writes append one complete, validated immutable operation at `sem2_study_v1:op:<writer-id>.<sequence>`. Its JSON envelope is `{schemaVersion:1,clock,id,kind,...payload}`. `kind=update` carries `{key,patch}`, `kind=lastUsed` carries `{value}`, and `kind=replace` carries a complete snapshot as `{value}`. Validation and serialization finish in memory before the single `setItem` commit.
- **Replay/concurrency:** readers validate all inputs, read the legacy baseline, then replay committed operations ordered by Lamport `clock`, with lexicographic unique `id` as a deterministic concurrent-tie breaker. Before a local commit the writer reads current committed operations and advances its clock. This defines a serial outcome even when two tabs have not delivered their storage events. Distinct keys and top-level item fields merge; the later ordered operation wins for the same field. Reader/quiz fields are each whole-field replacements supplied by their owner. `updatedAt` describes an event time; wall-clock skew does not decide commit order.
- **Replacement:** one operation replaces the whole logical snapshot, including deletions. A failed publication changes no durable byte or in-memory study data. A concurrent update is ordered before or after that complete replacement; there is no multi-key partial replacement or best-effort rollback.
- **Reconciliation:** storage events reread committed operations; delayed events cannot revive removed fields. Unsaved local operations stay as a session overlay over current durable state and are never automatically reported as saved. Reload discards that overlay, which the Arabic warning states explicitly.
- **Bounds:** this issue deliberately performs no unsafe journal compaction. Storage grows with use; quota exhaustion invokes session fallback. A future compaction/recovery change must preserve the same atomicity/concurrency guarantees and receive its own reviewed contract.

### Public API Methods

```typescript
PortalStudyState.getStatus(): 'persistent' | 'session' | 'corrupt' | 'unsupported-version';

PortalStudyState.getSnapshot(): StudySnapshot;

PortalStudyState.getItem(key: string): StudyItemState | null;

PortalStudyState.updateItem(key: string, patch: Partial<StudyItemState>): {
  saved: boolean;
  reason?: 'session' | 'quota' | 'corrupt' | 'unsupported-version' | 'invalid_item';
};

PortalStudyState.setLastUsed(value: { key: string; actionId: string; updatedAt?: string }): {
  saved: boolean;
  reason?: string;
};

PortalStudyState.subscribe(listener: (event: { snapshot: StudySnapshot; status: string }) => void): () => void;

PortalStudyState.replaceAll(candidate: StudySnapshot): {
  saved: boolean;
  reason?: string;
};
```

### Degradation & Rollback Guarantees

- **Session Fallback:** Quota exhaustion or storage access exceptions gracefully transition status to `'session'`. Writes continue in memory without crashing; `#study-save-status` announces the condition via accessible Arabic live notices.
- **Corrupt & Unsupported Version Safety:** If existing stored bytes contain invalid JSON or unsupported schema versions, they are preserved untouched without silent overwrites. Writes to storage are blocked.
- **Atomic replacement:** validation/staging occurs in memory; one immutable append is the publication point. A failed replacement retains the entire previous durable and in-memory state. No compensating write/rollback is needed.
- **Validation:** accept only documented fields, canonical keys (including ID `0`), dense arrays and valid nested reader/quiz/result/last-used shapes. Reject unsafe keys, non-JSON values and cycles before mutation. All ingress paths use the same validators. Current quiz answer bounds/version membership are additionally checked by their future consumer, not guessed by this storage layer.
- **Protected bytes:** `replaceAll` also refuses corrupt/unsupported backing state. Explicit recovery authorization and raw-byte export belong to the future backup/recovery contract; it must not bypass this protection implicitly.
- **Accessible status:** warnings are routed into the active dialog when background `main` is inert, and return to the page region after close. Failure notices never weaken background isolation or take keyboard focus.

## 4. Study 04 — DB Reader Full Quiz Attempts, Versioned Results, and Shuffled Choice Identity

### Browser Singletons & Factory

- **Quiz Renderer:** `window.PortalStudyQuiz.create(view)` returning `{ render(data, context?) }`.
- **Pure Attempt Engine:** `window.PortalQuizAttempt` (Node.js CommonJS & browser global) exported from `js/shared/quiz-attempt.js`.

### Interface Contract

```typescript
interface QuizRenderContext {
  key?: string;          // Canonical content key, e.g. '["database-systems","lecture","2"]'
  quizVersion?: string;  // Deterministic catalog quiz version hash
}

interface Question {
  id: number | string;
  question: string;
  options: string[];
  correct: number;       // Authored correct index (0-based)
  explanation?: string;
  topic?: string;
  slideNum?: number;
}

interface QuizResultSummary {
  version: string;
  score: number;
  total: number;
  completedAt: string;
}

interface QuizStorageState {
  version: string;
  answers: Record<string, number>; // Canonical string ID -> Authored option index
  activeQuestionId?: string | number;
  completedVersions?: string[];
  lastCompleted?: QuizResultSummary;
  bestCompleted?: QuizResultSummary;
  archivedResults?: QuizResultSummary[];
}

interface AttemptEvent {
  type: 'answer' | 'reset' | 'navigate';
  questionId?: string | number;
  choice?: number;       // Authored option index
  completedAt?: string;
}
```

### Public Helper Methods (`PortalQuizAttempt`)

- `scoreAnswers(questions: Question[], answers: Record<string, number>): { score: number, total: number, answeredCount: number, isComplete: boolean }`
  Derives score solely from authored option indices matching `q.correct`.
- `hydrateAttempt(storedQuiz: unknown, questions: Question[], currentQuizVersion: string): QuizAttemptState`
  Defensively filters alien IDs and out-of-range choices; archives older version results and resets active answers when `quizVersion` changes.
- `transitionAttempt(previous: QuizAttemptState, questions: Question[], currentQuizVersion: string, event: AttemptEvent): QuizAttemptState`
  Immutable state transition for user actions. Idempotently publishes completed result upon answering the final question.
- `getWrongQuestions(questions: Question[], answers: Record<string, number>): Question[]`
  Identifies questions where the student's answered option does not match `q.correct`.
- `serializeForStorage(attempt: QuizAttemptState): QuizStorageState`
  Extracts only schema-conforming fields accepted by `PortalStudyState` validation.

### Choice Identity & Presentation Invariant

1. **Transient Display Order:** Choices displayed on screen are permuted via `PortalQuizChoices.order(key, options, prompt)`.
2. **Authored Storage Identity:** `quiz.answers[id]` holds the integer authored index within source `q.options`.
3. **Session & Reload Independence:** Changing display seeds, clearing sessionStorage, or inspecting on different devices preserves the recorded authored choice.
4. **Position-Dependent Safety:** Questions containing relative references ("All of the above", "A and B") bypass permutation, preserving authored option positions.

### Completion & Review Policy

- **Earned Completion:** Answering all questions (even with score 0) marks `quizVersion` complete in `completedVersions` and records `lastCompleted`.
- **Reset Invariant:** Resetting an attempt renews choice order, zeroes current score and clears answers, but retains earned `completedVersions`, `lastCompleted`, and `bestCompleted` for that same version.
- **Wrong-Answer Review:** Allows stepping through incorrectly answered questions with feedback preserved, providing an "العودة للنتائج" action to regain results focus. All-correct states display clear praise without displaying a misleading review action.

---

## 5. Study 10 — Per-Item Unavailable Explanation States and Action Recovery

**Owner:** Issue #14 (`[Study 10] Finish per-item unavailable explanation states using the current content map`)

### Availability Semantics

- **Evaluation Basis:** Availability of interactive explanations is derived dynamically from catalog and module mappings:
  1. `entry.study` (or `window.STUDY_CATALOG[courseId][lectureId]`): Interactive modal reader data.
  2. `entry.module` (from `window.PortalStudyModules`): Standalone interactive lesson URL (e.g., `study/arch/chapter-7.html`, `study/ds/lecture-*.html`, `study/db/chapter-*.html`).
  3. `lec.studyManualUrl`: Standalone or external study manual (e.g., Computer Architecture study website).
  4. Course-specific mapped chapter units (e.g., Operating System `education-preview/os/?unit=os-XX`).
- Availability is **never inferred** from course name, hardcoded lecture counts, or obsolete static lists.
- A missing `entry.study` does not imply a lesson is unavailable if a standalone module or external study manual is mapped.

### Per-Item Unavailable UI & Compaction

- Lecture items without a mapped explanation render a non-operable, disabled button:
  - Element: `<button type="button" disabled aria-disabled="true" data-study-unavailable="true" class="btn-study-disabled a1-action-disabled ...">`
  - Text label: `الشرح — قريبًا`
  - Accessible label & title explaining the upcoming state.
  - Sizing meets WCAG 2.2 AA target size (minimum 44px touch target height via `.a1-source-actions > :is(a, button)`).
- **Compaction Contract (`PortalJourney` / `compact`):**
  - Compaction retains the disabled `data-study-unavailable` action with its `الشرح — قريبًا` label.
  - The disabled action is never designated as `.a1-action-primary`.
  - On rows without an available explanation (including ID `0`), the primary action falls back to the operable primary source action (`data-preview-file` for lecture slides or genuine view/download link).
  - Profile re-rendering preserves disabled states and working primary actions across group/section switches.

### Crafted URL & Action Recovery

- Deep links requesting `action=internal-study` or `action=standalone-study` on items lacking that respective capability do not trigger an empty, corrupted, or incorrect lesson view.
- Instead:
  1. An accessible warning notice (`.portal-nav-notice`, `role="alert"`) is rendered at the top of the content area explaining that the requested explanation is coming soon.
  2. The target content row is still revealed and focused (`PortalContentNavigation.reveal`), allowing the student to access the genuine source slides, Drive files, and downloads.

---

## 6. Study 05 — Quiz-Tab Resume, External-Source Activity, and Reader Recovery

**Owner:** Issue #9 (`[Study 05] Finish quiz-tab resume, external-source activity and reader recovery`)

### Browser Singletons & Factories

- **Activity Tracker:** `window.PortalStudyActivity` (Node.js CommonJS & browser global) created via `createStudyActivity({ catalog, state })` from `js/study-activity.js`.
- **Action Resolver & Dispatcher:** `window.PortalContentNavigation.resolveAction(key, actionId, context)` and `dispatchAction(key, actionId, row, parsed)` in `js/content-navigation.js`.
- **Reader Instance API:** `window.PortalStudyReader.current` exposing `{ open(courseId, lectureId), close() }`.
- **Studio Resume Generator:** `resumeOptions(entry, item, last)` in `js/studio.js`.

### Interface Contract

```typescript
interface StudyActivityTracker {
  record(key: string, actionId: string): boolean;
  init(): void;
}

interface ActionResolutionResult {
  valid: boolean;
  reason?: 'catalog_unavailable' | 'not_found' | 'action_required' | 'action_unavailable' | 'invalid_url' | 'unsafe_url_scheme';
  entry?: CatalogEntry;
  action?: ActionDescriptor;
  url?: string;
  isInternal?: boolean;
  isExternal?: boolean;
}

interface ActionDispatchResult {
  dispatched: boolean;
  action?: ActionDescriptor;
  url?: string;
  reason?: string;
}

interface ResumeOptions {
  actionId?: string;
  slide?: number;
  tab?: 'explanation' | 'original' | 'quiz';
  anchor?: string;
}
```

### Methods & Behavior

#### `PortalStudyActivity.record(key: string, actionId: string): boolean`
- Validates that `key` is a canonical JSON string matching an existing catalog entry.
- Validates that `actionId` exists in `entry.actions`.
- Preserves canonical identifiers, including numerical ID `0` (`["data-structure","lecture","0"]`).
- Sets `startedAt` on the item if not already recorded.
- Updates `lastUsed` with `{ key, actionId, updatedAt: ISOString }` via `PortalStudyState.setLastUsed`.
- Returns `true` if saved successfully, `false` otherwise.
- Attached via delegated event listener to clicks on `[data-content-key] [data-action-id]`. Pure hover, render, scroll, copy, and prefetch never trigger recording.

#### `PortalContentNavigation.resolveAction(key: string, actionId: string, context?: object): ActionResolutionResult`
- Resolves catalog action for given `key` and `actionId`.
- Strictly validates URL protocols: only `http:`, `https:`, and relative `materials/` paths are allowed. Rejects executable schemes (`javascript:`, `data:`, `vbscript:`) with `unsafe_url_scheme`.
- Never guesses action IDs, fabricates Drive page numbers, or adds unverified video timestamps.

#### `PortalContentNavigation.dispatchAction(key: string, actionId: string, row?: HTMLElement, parsed?: object): Promise<ActionDispatchResult>`
- Dispatches validated action upon deep-link resolution or programmatic invocation:
  - `internal-study`: Opens modal via `PortalStudyReader.current.open(courseId, id)` or clicks `.btn-open-smart-study`.
  - `drivePreviewUrl`: Clicks modal preview trigger `.btn-preview-pdf`.
  - External URL actions: Highlights and focuses target element with an accessible focus ring (`ring-2 ring-indigo-400`).
- If action is unavailable in catalog, displays accessible `role="alert"` notification via `showUnavailableActionNotice()`.

### Reader State Hierarchy & Quiz-Tab Resume

1. **State Persistence:**
   - Reader actively inspects tab selection on switch: persists `tab: 'quiz'` when `#study-tab-btn-quiz` is active, and `'original'` or `'explanation'` according to `readerMode`.
   - Reader position saving is suspended during initialization (`restoringPosition = true`) until all restored parameters are verified and applied.
2. **Restoration Precedence:**
   - **Priority 1 (Explicit Deep Link):** Valid URL query parameters (`&action=...`, `&tab=...`, `&slide=...`, `&anchor=...`) override saved state.
   - **Priority 2 (Saved State):** Stored `reader.tab` and `reader.slideId` restore the previous workspace session.
   - **Priority 3 (Fallback Default):** If target slide is missing/out of bounds, falls back safely to slide index 0. If saved tab is unavailable, falls back to `'explanation'`.
3. **Recovery Semantics:**
   - Missing/deleted slides, invalid keys, or corrupted reader states do not trigger unhandled exceptions.
   - Storage failures (quota, disabled localStorage) announce status via `#study-save-status` and fall back gracefully to in-memory session state without blocking reader interaction.

### Standalone Bridge & Storage Ownership Invariants

- **Ownership Boundary:** All Study Hub persistence belongs exclusively to `PortalStudyState` under namespace `sem2_study_v1:`.
- **Preserved Namespaces:** Existing standalone markers `sem2_standalone_v1:` and native check preferences `sem2_standalone_check_v1:` remain independent. They are not renamed, migrated, overwritten, or substituted by the Study Hub reader.
- **Bridge Invariant:** Standalone markers are only consumed as a bridge in `resumeOptions` when:
  - `saved.version === 1`
  - `saved.anchor` matches `/^[\w.-]+$/`
  - `saved.updatedAt === item.reader.updatedAt`
  A mismatched or invalid standalone marker is discarded safely and never overrides validated reader state.



---

## 7. Study 06 — Published-Item Completion and Profile-Aware Course Progress

**Owner:** Issue #10 (`[Study 06] Add published-item completion and profile-aware counts around existing lesson checks`)

### Browser Singletons & Factories

- **Progress Engine:** `window.PortalStudyProgress` (Node.js CommonJS & browser global) created via `createStudyProgress({ catalog, state, courses, studentProfile, scheduleConfig })` from `js/shared/study-progress.js`.
- **UI Integration Module:** `window.PortalStudyProgressUI` in `js/study-progress-ui.js`.
- **Course Studio Integration:** Studio progress overview card rendered in `js/studio-course.js`.

### Interface Contract

```typescript
type ItemCompletionStatus = 'not-started' | 'in-progress' | 'completed';

interface ItemProgress {
  key: string;
  status: ItemCompletionStatus;
  isComplete: boolean;
  isInProgress: boolean;
  hasFullQuiz: boolean;
  canManualComplete: boolean;
  score?: number;
  total?: number;
  completedAt?: string;
}

interface TrackSummary {
  total: number;
  completed: number;
  remaining: number;
  inProgress: number;
}

interface CourseSummary {
  courseId: string;
  scope: string; // "المحتوى المنشور على المنصة، ولا يشمل كامل المنهج الجامعي أو إتقان المادة"
  lectures: TrackSummary;
  sections: TrackSummary;
  total: TrackSummary;
  percent: number; // 0 - 100
}

interface ManualCompleteResult {
  saved: boolean;
  reason?: 'invalid_key' | 'has_full_quiz' | 'no_state' | 'session' | 'quota' | 'corrupt' | 'unsupported-version';
}
```

### Public Methods (`PortalStudyProgress`)

- `getStatus(key: string): ItemCompletionStatus`
  Returns `'not-started'`, `'in-progress'`, or `'completed'`.
- `getItemProgress(key: string): ItemProgress`
  Returns detailed progress metadata for a canonical content item.
- `setManualComplete(key: string, value: boolean): ManualCompleteResult`
  Toggles manual completion for items without a full quiz. Disallows manual completion on items with `hasFullQuiz: true`. Dispatches `portal:progress-changed` event.
- `getCourseSummary(courseId: string, explicitProfile?: StudentProfileData): CourseSummary`
  Computes published-item completion counts and percentage tailored to the student's TA.
- `subscribe(listener: Function): Function`
  Subscribes to underlying storage changes and returns an unsubscribe callback.

### Denominator and Counting Invariants

1. **Published Items Only:** Denominators count solely published items:
   - All published lectures (`track: 'lecture'`, `type: 'lecture'`) for the course.
   - Published sections (`track: 'section'`, `type: 'section'`) filtered to the student's active TA (via `StudentProfile.filterItemsForTa(sections, 'my-ta', studentTa)`).
2. **Strict Exclusions:** Videos, assignments, drive resources, practical resources, external explanation sites, and Operating Systems standalone theory-resource units (the 19 OS units) are strictly excluded from denominators.
3. **Deduplication:** Canonical keys are deduplicated with `Set` so identical items are never counted twice.
4. **Numeric ID 0:** Items with numerical ID `0` (e.g. `["data-structure","lecture","0"]`) are valid published catalog items and are counted in denominators.
5. **Orphan Storage Safety:** Storage records belonging to unpublished items, retired keys, or sections belonging to other TAs do not inflate or distort progress totals.
6. **Academic Scope Disclaimer:** Every summary explicitly exposes `scope: 'المحتوى المنشور على المنصة، ولا يشمل كامل المنهج الجامعي أو إتقان المادة'` to prevent students from mistaking published platform coverage for university curriculum mastery.

### Completion Policies & Separation of Concerns

1. **Activity Threshold:** Interacting with an item (opening the reader, recording activity, answering questions) sets `startedAt` and transitions status to `'in-progress'`. It never automatically awards `'completed'`.
2. **Full-Quiz Items:**
   - When `entry.study.hasFullQuiz === true`, completion is earned exclusively by answering all questions of the current `quizVersion`.
   - Manual completion is strictly rejected with `reason: 'has_full_quiz'`.
3. **Non-Quiz Items:**
   - When an item has no full quiz, students can toggle manual completion via `setManualComplete(key, boolean)`.
   - If an item was not started, setting manual complete automatically populates `startedAt`.
4. **Standalone DS2 Check Isolation:** Sub-section local checks in DS2 (`sem2_standalone_check_v1`) remain completely independent and do not mutate or satisfy course-level lesson completion.

### Accessibility (WCAG 2.2 AA) & UI Contracts

1. **Status Badges:** Display clear Arabic visual states (`لم تبدأ`, `قيد المذاكرة`, `مكتمل`) with high contrast text in all themes (Light, Dark, Reading).
2. **Manual Complete Control:** Interactive button `<button type="button" class="btn-study-manual-complete" aria-pressed="true|false">` meets touch target size (minimum 44px height/width) and provides clear accessible labels.
3. **Progress Summary:** Rendered in `#portal-study-progress-card` with `role="region"`, `aria-label="ملخص تقدم المذاكرة"`, and a live progress bar (`role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`).
4. **Reactive Updates:** Listens to `portal:progress-changed`, `portal:profile-changed`, and `portal:study-save-status` to re-render counts and badges dynamically without requiring a page refresh.


---

## 8. Study 07 — Search Ranking, Deterministic Tie-Breaking, and Progress Filtering

**Owner:** Issue #11 (`[Study 07] Add ranking and progress filters to the existing Studio resource search`)

### Browser Singleton & Node Factory

- **Browser Global:** `window.PortalContentSearch`
- **Node Factory:** `createContentSearch({ catalog, progress, studentProfile })` exported from `js/shared/content-search.js`.

### Interface Contract

```typescript
type SearchStatusFilter = 'all' | 'completed' | 'in-progress' | 'not-started';

interface SearchCriteria {
  query?: string;
  courseId?: string;       // Course ID or 'all'
  kind?: string;           // 'all' | 'lectures' | 'sections' | 'videos' | 'assignments' | 'resources' | 'interactive'
  status?: SearchStatusFilter;
  allTas?: boolean;        // If false, filter sections by student's active TA
  explicitProfile?: StudentProfileData | null;
}

interface ContentSearchService {
  normalize(value: unknown): string;
  isProgressEligible(entry: CatalogEntry): boolean;
  getItemStatus(key: string, entry?: CatalogEntry): ItemCompletionStatus | null;
  computeRank(queryNorm: string, tokens: string[], entry: CatalogEntry): number;
  search(criteria?: SearchCriteria): CatalogEntry[];
  createContentSearch(options?: object): ContentSearchService;
}
```

### Public Methods

- `normalize(value: unknown): string`: Normalizes Arabic and English search tokens. Decomposes Unicode (NFKD), strips diacritics/tashkeel (`[\u0300-\u036f\u064b-\u065f\u0670]`), strips tatweel (`\u0640`), unifies alef variants (`[إأآٱ]` -> `ا`), maps `ى` -> `ي` and `ة` -> `ه`, converts to lowercase, and trims.
- `isProgressEligible(entry: CatalogEntry): boolean`: Identifies eligible published lectures and sections (`type: 'lecture' | 'section'`). Videos, assignments, drive/practical resources, external explanation sites, and OS standalone theory units return `false`.
- `getItemStatus(key: string, entry?: CatalogEntry): ItemCompletionStatus | null`: Retrieves current completion status (`'not-started' | 'in-progress' | 'completed'`) via `PortalStudyProgress.getStatus(key)` for eligible entries. Ineligible items return `null`.
- `computeRank(queryNorm: string, tokens: string[], entry: CatalogEntry): number`: Returns integer ranking tier (1 to 7) for matched items.
- `search(criteria: SearchCriteria): CatalogEntry[]`: Executes multi-facet search, filtering by course, kind, TA scope, and progress status, ranking matching items by relevancy tier with deterministic tie-breaking.

### Ranking Tiers & Relevancy Precedence

1. **Tier 1 (Exact code or title):** Exact match on course code (`normCode === queryNorm`) or title (`normTitle === queryNorm || normArabicTitle === queryNorm`).
2. **Tier 2 (Prefix match):** Code or title begins with the normalized query (`startsWith(queryNorm)`).
3. **Tier 3 (Contiguous title phrase):** Full normalized query string appears as a contiguous substring in the title or Arabic title (`includes(queryNorm)`).
4. **Tier 4 (Title terms):** All query tokens appear within title, Arabic title, course code, course name, or presentation display name.
5. **Tier 5 (Topic match):** Query matches any topic or all query tokens appear in topics.
6. **Tier 6 (Description match):** All query tokens appear in the item description.
7. **Tier 7 (General token match):** Query tokens match across combined metadata fields.

### Deterministic Tie-Breaking

- When query is empty, results retain stable catalog order (`catalogIndex`).
- When matching items belong to the same rank tier, original catalog order (`catalogIndex`) breaks ties deterministically. Stable keys, including numerical ID `0` (`["data-structure","lecture","0"]`), are preserved.
- No random, unstable, or locale-variant sorting is applied.

### Progress Status Filtering & Preservation Guarantees

1. **Eligible Items Only:** Progress status filtering (`'completed'`, `'in-progress'`, `'not-started'`) evaluates exclusively against published lecture and section items.
2. **No Fabricated Completion:** Ineligible items (videos, assignments, resources) are excluded when a specific progress status filter is active, preventing fabricated completion badges or false "not-started" indicators.
3. **Compound Filtering:** Filters for course, resource kind (including `interactive` for the 25 local lessons), progress status, and TA scope combine conjunctively (`AND`).
4. **Lazy First Render:** Library rows remain 0 on initial home page load until the library section is actively revealed, ensuring zero overhead for students solely browsing course cards or timetables.
5. **Accessibility & Reactivity:** The search interface provides accessible form labels, `role="status"` with `aria-live="polite"` result announcements, and reacts dynamically to `portal:progress-changed` and `studentProfileChanged` events without full-page reloads.


---

## 9. Study 08 — Complete Existing Continue and Accurate Published-Content Summaries

**Owner:** Issue #12 (`[Study 08] Complete existing Continue and add accurate published-content summaries`)

### Browser Singleton & Exports

- **Browser Global:** `window.PortalStudio` (defined in `js/studio.js`)

### Interface Contract

```typescript
interface PortalStudioService {
  resumeOptions(
    entry: CatalogEntry | null | undefined,
    item: StudyItemState | null | undefined,
    last: LastUsedItem | null | undefined
  ): ResumeOptions;
  readingHistory(): void;
  decorateCourses(): void;
  updateCourseSummaries(): void;
}

type LastUsedItem = NonNullable<StudySnapshot['lastUsed']>;

interface ResumeOptions {
  actionId?: string;
  slide?: number | string;
  tab?: 'explanation' | 'original' | 'quiz';
  anchor?: string;
}
```

### Public Methods & Semantics

- `resumeOptions(entry, item, last): ResumeOptions`:
  - Accepts the catalog entry, its saved `StudyItemState`, and the last-used record for that same entry (or `null` for another history entry).
  - Returns options for `PortalContentLinks.href(entry.key, options)`. It does not construct a URL or an action descriptor.
  - Returns `{}` when `entry` is nullish; `item` and `last` may also be nullish.
  - Preserves `last.actionId` when `PortalContentNavigation.resolveAction(entry.key, last.actionId)` returns a valid result. If that resolver is unavailable, checks membership in `entry.actions` instead.
  - Otherwise selects `standalone-study` when the entry has a module and either no internal study or a valid standalone bridge marker; then `internal-study` when internal study exists; otherwise the first entry action, if any.
  - Copies saved reader `slideId` and `tab` into `slide` and `tab`. A version-1 standalone marker may add an `anchor` only when it matches `/^[\w.-]+$/` and its timestamp matches `item.reader.updatedAt`; malformed markers are ignored.

- `readingHistory(): void`:
  - Reads `lastUsed` and `items` from `PortalStudyState.getSnapshot()` and updates the DOM. Returns `undefined`, including when the state service is unavailable.
  - Resolves the last-used catalog entry via `PortalCatalog.get(last.key)`. An available entry renders its resume link in `#studio-resume`, using `resumeOptions` and `PortalContentLinks.href`.
  - Fresh state: hides and clears `#studio-resume`; `#continue-results` shows an empty state with a link to `#library`.
  - Deleted or unavailable last-used entry: renders `.studio-resume-recovery` with a link to `#library`.
  - Builds `#continue-results` from saved items with `startedAt`, `reader`, or `quiz`, sorted newest first by reader timestamp or start timestamp. Items absent from the current catalog are omitted from the rendered list.
  - **Orphan Preservation:** Does not delete or overwrite stored entries; unavailable records remain in study history storage.

- `decorateCourses(): void`:
  - Applies course palettes and adds lecture/section quick links to `#courses-grid [data-course-id]`, then calls `updateCourseSummaries()`.

- `updateCourseSummaries(): void`:
  - Iterates over `#courses-grid [data-course-id]`.
  - Uses the internal `courseSummaryHtml(courseId)` helper, which queries `PortalStudyProgress.getCourseSummary(courseId)` for the `CourseSummary` defined in Section 7. If the progress service or summary is unavailable, the helper returns an empty string and that card is skipped.
  - Inserts or updates container `.studio-course-summary` without touching parent card headers or timetable sections.
  - Displays completed and remaining counts separately for lectures and sections, the summary's published-content scope, and a disclaimer that progress does not represent grades or mastery.
  - Includes a progress bar (`role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`).

`courseSummaryHtml(courseId: string): string` is an internal helper, not a `PortalStudio` export. There is no `renderResume` export; `readingHistory()` renders both resume and Continue content.

### Reactive Subscriptions & Scope Isolation

1. **Storage & State Subscriptions:**
   - Subscribes to `PortalStudyState.subscribe()` for storage changes.
   - Listens to `window.addEventListener('portal:progress-changed', ...)`.
   - Listens to `window.addEventListener('studentProfileChanged', ...)`.
   - State subscriptions and progress events refresh resume/Continue content and course summaries. Profile changes refresh course summaries; the library has its own profile-change listener.
   - These updates do not reset search input focus or wipe unrelated views.

2. **Schedule & Timetable Isolation:**
   - Dashboard course-card updates are bounded to `#courses-grid [data-course-id]`.
   - Timetable view (`#schedule-section`) is completely untouched and isolated from study progress state.

3. **Fresh State & Recovery UI:**
   - With empty study storage, `#studio-resume` is hidden and `#continue-results` displays an empty state with a library link, without fabricated metrics or a fake last-used item.
   - For unavailable or deleted items, `#studio-resume` renders an explicit recovery notice (`.studio-resume-recovery`) with a safe link to `#library`, preserving the underlying stored item.
