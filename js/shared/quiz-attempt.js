/* Pure helpers for full-quiz attempt transitions, versioned results, and answer scoring.
 * Preserves authored option identities and validates defensive bounds.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PortalQuizAttempt = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function scoreAnswers(questions, answers) {
    if (!Array.isArray(questions)) return { score: 0, total: 0, answeredCount: 0, isComplete: false };
    const ans = answers && typeof answers === 'object' ? answers : {};
    let score = 0;
    let answeredCount = 0;

    for (const q of questions) {
      const qid = String(q.id);
      const choice = ans[qid];
      if (Number.isInteger(choice) && choice >= 0 && choice < (q.options?.length || 0)) {
        answeredCount++;
        if (choice === q.correct) {
          score++;
        }
      }
    }

    const total = questions.length;
    const isComplete = total > 0 && answeredCount === total;
    return { score, total, answeredCount, isComplete };
  }

  function isValidResult(res) {
    return res && typeof res === 'object' &&
      typeof res.version === 'string' &&
      Number.isInteger(res.score) &&
      Number.isInteger(res.total) &&
      res.score >= 0 &&
      res.score <= res.total &&
      typeof res.completedAt === 'string';
  }

  function hydrateAttempt(storedQuiz, questions, currentQuizVersion) {
    const list = Array.isArray(questions) ? questions : [];
    const firstQid = list[0]?.id !== undefined ? list[0].id : 1;
    const fallback = {
      version: currentQuizVersion,
      answers: {},
      activeQuestionId: firstQid,
      completedVersions: [],
      archivedResults: [],
      score: 0,
      total: list.length,
      answeredCount: 0,
      isComplete: false
    };

    if (!storedQuiz || typeof storedQuiz !== 'object') {
      return fallback;
    }

    // Version mismatch: archive prior completed results, do not hydrate stale answers
    if (storedQuiz.version !== currentQuizVersion) {
      const archivedResults = Array.isArray(storedQuiz.archivedResults)
        ? storedQuiz.archivedResults.filter(isValidResult)
        : [];

      if (isValidResult(storedQuiz.lastCompleted) &&
          !archivedResults.some(r => r.completedAt === storedQuiz.lastCompleted.completedAt && r.version === storedQuiz.lastCompleted.version)) {
        archivedResults.push(storedQuiz.lastCompleted);
      }
      if (isValidResult(storedQuiz.bestCompleted) &&
          !archivedResults.some(r => r.completedAt === storedQuiz.bestCompleted.completedAt && r.version === storedQuiz.bestCompleted.version)) {
        archivedResults.push(storedQuiz.bestCompleted);
      }

      const completedVersions = Array.isArray(storedQuiz.completedVersions)
        ? storedQuiz.completedVersions.filter(v => typeof v === 'string')
        : [];

      return {
        version: currentQuizVersion,
        answers: {},
        activeQuestionId: firstQid,
        completedVersions,
        archivedResults,
        score: 0,
        total: list.length,
        answeredCount: 0,
        isComplete: false
      };
    }

    // Same version: clean answers against authored question bounds
    const rawAnswers = storedQuiz.answers && typeof storedQuiz.answers === 'object' ? storedQuiz.answers : {};
    const answers = {};
    for (const q of list) {
      const qid = String(q.id);
      const choice = rawAnswers[qid];
      if (Number.isInteger(choice) && choice >= 0 && choice < (q.options?.length || 0)) {
        answers[qid] = choice;
      }
    }

    let activeQuestionId = firstQid;
    if (storedQuiz.activeQuestionId !== undefined) {
      const matchingQ = list.find(q => String(q.id) === String(storedQuiz.activeQuestionId));
      if (matchingQ) {
        activeQuestionId = matchingQ.id;
      }
    }

    const completedVersions = Array.isArray(storedQuiz.completedVersions)
      ? storedQuiz.completedVersions.filter(v => typeof v === 'string')
      : [];
    const archivedResults = Array.isArray(storedQuiz.archivedResults)
      ? storedQuiz.archivedResults.filter(isValidResult)
      : [];
    const lastCompleted = isValidResult(storedQuiz.lastCompleted) ? storedQuiz.lastCompleted : undefined;
    const bestCompleted = isValidResult(storedQuiz.bestCompleted) ? storedQuiz.bestCompleted : undefined;

    const scoreInfo = scoreAnswers(list, answers);

    return {
      version: currentQuizVersion,
      answers,
      activeQuestionId,
      completedVersions,
      lastCompleted,
      bestCompleted,
      archivedResults,
      ...scoreInfo
    };
  }

  function transitionAttempt(previous, questions, currentQuizVersion, event) {
    const list = Array.isArray(questions) ? questions : [];
    if (!event || typeof event !== 'object') return previous;

    if (event.type === 'answer') {
      const qid = String(event.questionId);
      const choice = Number(event.choice);
      const question = list.find(q => String(q.id) === qid);

      if (!question || previous.answers[qid] !== undefined || !Number.isInteger(choice) || choice < 0 || choice >= (question.options?.length || 0)) {
        return previous;
      }

      const answers = { ...previous.answers, [qid]: choice };
      const scoreInfo = scoreAnswers(list, answers);

      let { completedVersions = [], lastCompleted, bestCompleted, archivedResults = [] } = previous;
      completedVersions = [...completedVersions];

      if (scoreInfo.isComplete) {
        const completedAt = event.completedAt || new Date().toISOString();
        const resultSummary = {
          version: currentQuizVersion,
          score: scoreInfo.score,
          total: scoreInfo.total,
          completedAt
        };
        lastCompleted = resultSummary;
        if (!bestCompleted || resultSummary.score > bestCompleted.score) {
          bestCompleted = resultSummary;
        }
        if (!completedVersions.includes(currentQuizVersion)) {
          completedVersions.push(currentQuizVersion);
        }
      }

      return {
        ...previous,
        version: currentQuizVersion,
        answers,
        activeQuestionId: event.nextQuestionId !== undefined ? event.nextQuestionId : previous.activeQuestionId,
        completedVersions,
        lastCompleted,
        bestCompleted,
        archivedResults,
        ...scoreInfo
      };
    }

    if (event.type === 'reset') {
      const firstQid = list[0]?.id !== undefined ? list[0].id : 1;
      return {
        version: currentQuizVersion,
        answers: {},
        activeQuestionId: firstQid,
        completedVersions: Array.isArray(previous.completedVersions) ? [...previous.completedVersions] : [],
        lastCompleted: previous.lastCompleted,
        bestCompleted: previous.bestCompleted,
        archivedResults: Array.isArray(previous.archivedResults) ? [...previous.archivedResults] : [],
        score: 0,
        total: list.length,
        answeredCount: 0,
        isComplete: false
      };
    }

    if (event.type === 'navigate') {
      const matching = list.find(q => String(q.id) === String(event.questionId));
      if (matching) {
        return {
          ...previous,
          activeQuestionId: matching.id
        };
      }
    }

    return previous;
  }

  function getWrongQuestions(questions, answers) {
    if (!Array.isArray(questions) || !answers || typeof answers !== 'object') return [];
    return questions.filter(q => {
      const choice = answers[String(q.id)];
      return choice !== undefined && choice !== q.correct;
    });
  }

  function serializeForStorage(attempt) {
    if (!attempt || typeof attempt !== 'object') return null;
    const out = {
      version: attempt.version,
      answers: attempt.answers || {}
    };

    if (attempt.activeQuestionId !== undefined) {
      out.activeQuestionId = attempt.activeQuestionId;
    }
    if (Array.isArray(attempt.completedVersions) && attempt.completedVersions.length) {
      out.completedVersions = attempt.completedVersions;
    }
    if (isValidResult(attempt.lastCompleted)) {
      out.lastCompleted = attempt.lastCompleted;
    }
    if (isValidResult(attempt.bestCompleted)) {
      out.bestCompleted = attempt.bestCompleted;
    }
    if (Array.isArray(attempt.archivedResults) && attempt.archivedResults.length) {
      out.archivedResults = attempt.archivedResults.filter(isValidResult);
    }
    return out;
  }

  return {
    scoreAnswers,
    hydrateAttempt,
    transitionAttempt,
    getWrongQuestions,
    serializeForStorage
  };
});
