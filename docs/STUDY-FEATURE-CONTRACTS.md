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
