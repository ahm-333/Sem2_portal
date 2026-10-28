const test = require('node:test');
const assert = require('node:assert/strict');
const attemptModule = require('../js/shared/quiz-attempt.js');

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: 'Which component coordinates disk access?',
    options: ['Storage Manager', 'Query Optimizer', 'Buffer Pool', 'Transaction Manager'],
    correct: 0,
    explanation: 'Storage manager manages disk access.'
  },
  {
    id: 2,
    question: 'What is ACID atomicity?',
    options: ['Consistency', 'All or nothing execution', 'Isolation', 'Durability'],
    correct: 1,
    explanation: 'Atomicity ensures all-or-nothing execution.'
  },
  {
    id: 3,
    question: 'What is a primary key?',
    options: ['Foreign reference', 'Unique row identifier', 'Index table', 'View definition'],
    correct: 1,
    explanation: 'A primary key uniquely identifies each record.'
  }
];

const VERSION_V1 = 'v1-hash-abc';
const VERSION_V2 = 'v2-hash-xyz';

test('quiz-attempt: scoreAnswers derives accurate score from authored identities', () => {
  const { scoreAnswers } = attemptModule;
  const resEmpty = scoreAnswers(SAMPLE_QUESTIONS, {});
  assert.equal(resEmpty.score, 0);
  assert.equal(resEmpty.total, 3);
  assert.equal(resEmpty.answeredCount, 0);
  assert.equal(resEmpty.isComplete, false);

  // Q1 correct (0), Q2 wrong (0 instead of 1)
  const resPartial = scoreAnswers(SAMPLE_QUESTIONS, { '1': 0, '2': 0 });
  assert.equal(resPartial.score, 1);
  assert.equal(resPartial.total, 3);
  assert.equal(resPartial.answeredCount, 2);
  assert.equal(resPartial.isComplete, false);

  // All answered, all wrong: Q1=1, Q2=0, Q3=0
  const resAllWrong = scoreAnswers(SAMPLE_QUESTIONS, { '1': 1, '2': 0, '3': 0 });
  assert.equal(resAllWrong.score, 0);
  assert.equal(resAllWrong.total, 3);
  assert.equal(resAllWrong.answeredCount, 3);
  assert.equal(resAllWrong.isComplete, true);

  // All answered, all correct: Q1=0, Q2=1, Q3=1
  const resAllCorrect = scoreAnswers(SAMPLE_QUESTIONS, { '1': 0, '2': 1, '3': 1 });
  assert.equal(resAllCorrect.score, 3);
  assert.equal(resAllCorrect.total, 3);
  assert.equal(resAllCorrect.answeredCount, 3);
  assert.equal(resAllCorrect.isComplete, true);
});

test('quiz-attempt: hydrateAttempt ignores corrupt/alien inputs and drops unknown IDs / out-of-range choices', () => {
  const { hydrateAttempt } = attemptModule;
  
  const fromNull = hydrateAttempt(null, SAMPLE_QUESTIONS, VERSION_V1);
  assert.equal(fromNull.version, VERSION_V1);
  assert.deepEqual(fromNull.answers, {});
  assert.equal(fromNull.activeQuestionId, 1);

  // Invalid question ID '999' and out-of-range choice 99 on Q1
  const dirty = {
    version: VERSION_V1,
    answers: { '1': 99, '2': 1, '999': 0, 'invalid': 'abc' },
    activeQuestionId: 999
  };
  const cleaned = hydrateAttempt(dirty, SAMPLE_QUESTIONS, VERSION_V1);
  assert.deepEqual(cleaned.answers, { '2': 1 });
  // Fallback to first question or first unanswered
  assert.equal(cleaned.activeQuestionId, 1);
});

test('quiz-attempt: hydrateAttempt archives old version results and never recomputes against changed questions', () => {
  const { hydrateAttempt } = attemptModule;
  const oldStored = {
    version: VERSION_V1,
    answers: { '1': 0, '2': 1, '3': 1 },
    lastCompleted: { version: VERSION_V1, score: 3, total: 3, completedAt: '2026-10-20T10:00:00Z' },
    bestCompleted: { version: VERSION_V1, score: 3, total: 3, completedAt: '2026-10-20T10:00:00Z' },
    completedVersions: [VERSION_V1],
    archivedResults: []
  };

  const migrated = hydrateAttempt(oldStored, SAMPLE_QUESTIONS, VERSION_V2);
  assert.equal(migrated.version, VERSION_V2);
  // Current answers must be empty for changed version
  assert.deepEqual(migrated.answers, {});
  assert.equal(migrated.completedVersions.includes(VERSION_V2), false);
  assert.equal(migrated.completedVersions.includes(VERSION_V1), true);
  // Old result moved to archivedResults
  assert.equal(migrated.archivedResults.length, 1);
  assert.equal(migrated.archivedResults[0].version, VERSION_V1);
  assert.equal(migrated.archivedResults[0].score, 3);
});

test('quiz-attempt: transitionAttempt handles answer, completion idempotency, and reset retaining completed state', () => {
  const { hydrateAttempt, transitionAttempt } = attemptModule;
  let state = hydrateAttempt(null, SAMPLE_QUESTIONS, VERSION_V1);

  // Answer Q1 correctly
  state = transitionAttempt(state, SAMPLE_QUESTIONS, VERSION_V1, { type: 'answer', questionId: 1, choice: 0 });
  assert.deepEqual(state.answers, { '1': 0 });
  assert.equal(state.isComplete, false);

  // Duplicate answer to Q1 is ignored
  const beforeDup = state;
  state = transitionAttempt(state, SAMPLE_QUESTIONS, VERSION_V1, { type: 'answer', questionId: 1, choice: 2 });
  assert.equal(state, beforeDup);

  // Answer Q2 (wrong: choice 0)
  state = transitionAttempt(state, SAMPLE_QUESTIONS, VERSION_V1, { type: 'answer', questionId: 2, choice: 0 });
  // Answer Q3 (correct: choice 1) -> triggers completion!
  state = transitionAttempt(state, SAMPLE_QUESTIONS, VERSION_V1, { type: 'answer', questionId: 3, choice: 1 });

  assert.equal(state.isComplete, true);
  assert.equal(state.score, 2);
  assert.equal(state.total, 3);
  assert.ok(state.lastCompleted);
  assert.equal(state.lastCompleted.score, 2);
  assert.equal(state.lastCompleted.total, 3);
  assert.ok(state.completedVersions.includes(VERSION_V1));

  // Reset retains completion, lastCompleted, and bestCompleted for same version
  const resetState = transitionAttempt(state, SAMPLE_QUESTIONS, VERSION_V1, { type: 'reset' });
  assert.deepEqual(resetState.answers, {});
  assert.equal(resetState.score, 0);
  assert.equal(resetState.isComplete, false);
  assert.ok(resetState.completedVersions.includes(VERSION_V1));
  assert.deepEqual(resetState.lastCompleted, state.lastCompleted);
  assert.deepEqual(resetState.bestCompleted, state.bestCompleted);
});

test('quiz-attempt: wrong-answer extraction provides correct review list and detects all-correct state', () => {
  const { getWrongQuestions } = attemptModule;
  // Q1 correct (0), Q2 wrong (0), Q3 unanswered
  const wrong1 = getWrongQuestions(SAMPLE_QUESTIONS, { '1': 0, '2': 0 });
  assert.equal(wrong1.length, 1);
  assert.equal(wrong1[0].id, 2);

  // All correct
  const wrongNone = getWrongQuestions(SAMPLE_QUESTIONS, { '1': 0, '2': 1, '3': 1 });
  assert.equal(wrongNone.length, 0);
});
