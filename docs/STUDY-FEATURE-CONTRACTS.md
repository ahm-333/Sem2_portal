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
  [key: string]: unknown;
}

interface QuizResultSummary {
  version: string;
  score: number;
  total: number;
  completedAt: string;
}
```

### Physical Storage Representation

- **Physical Namespace:** `sem2_study_v1:`
  - Metadata: `sem2_study_v1:meta` -> `{ schemaVersion: 1, lastUsed?: ... }`
  - Item Base Fields: `sem2_study_v1:item:<encodedKey>:base` -> `{ startedAt, manualComplete, ... }`
  - Item Reader Field: `sem2_study_v1:item:<encodedKey>:reader` -> `{ slideId, tab, updatedAt }`
  - Item Quiz Field: `sem2_study_v1:item:<encodedKey>:quiz` -> `{ version, answers, ... }`
- **Collision-Free Isolation:**
  - Sibling fields (`reader` vs `quiz` vs base properties) live in independent physical subkeys, completely preventing concurrent tabs from clobbering one another's reader/quiz progress.
  - Same-field concurrent writes resolve deterministically via latest `updatedAt` timestamp and standard storage event reconciliation.

### Public API Methods

```typescript
PortalStudyState.getStatus(): 'persistent' | 'session' | 'corrupt' | 'unsupported-version';

PortalStudyState.getSnapshot(): StudySnapshot;

PortalStudyState.getItem(key: string): StudyItemState | null;

PortalStudyState.updateItem(key: string, patch: Partial<StudyItemState>): {
  saved: boolean;
  reason?: 'session' | 'quota' | 'corrupt' | 'unsupported-version' | 'forbidden_key';
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
- **Atomic Replace & Rollback:** `replaceAll` stages writes and snapshots the prior storage state. Any quota or write failure triggers an immediate rollback of storage and in-memory state.
- **Prototype Pollution Defense:** Keys such as `__proto__`, `constructor`, and `prototype` are strictly blocked from prototype injection and stripped from returned snapshots.
