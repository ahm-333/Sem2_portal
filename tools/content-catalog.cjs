const {createHash} = require('node:crypto');

function computeQuizVersion(questions) {
  if (!Array.isArray(questions) || questions.length === 0) return null;
  const sorted = [...questions].sort((a, b) => {
    const aid = Number(a.id);
    const bid = Number(b.id);
    if (!Number.isNaN(aid) && !Number.isNaN(bid)) return aid - bid;
    return String(a.id).localeCompare(String(b.id));
  });
  const normalized = sorted.map(q => ({
    id: q.id,
    question: String(q.question || '').replace(/\r\n/g, '\n'),
    options: (q.options || []).map(opt => String(opt || '').replace(/\r\n/g, '\n')),
    correct: q.correct
  }));
  return createHash('sha256').update(JSON.stringify(normalized)).digest('hex').slice(0, 12);
}

function extractStudyCatalog(lectureExplanations) {
  const catalog = {};
  for (const [courseId, lectures] of Object.entries(lectureExplanations || {})) {
    catalog[courseId] = {};
    for (const [id, lecture] of Object.entries(lectures || {})) {
      const hasFullQuiz = Array.isArray(lecture.fullQuiz) && lecture.fullQuiz.length > 0;
      const questionCount = hasFullQuiz ? lecture.fullQuiz.length : 0;
      const questionIds = hasFullQuiz ? lecture.fullQuiz.map(q => q.id) : [];
      const optionCounts = hasFullQuiz ? lecture.fullQuiz.map(q => (q.options || []).length) : [];
      const quizVersion = hasFullQuiz ? computeQuizVersion(lecture.fullQuiz) : null;

      catalog[courseId][id] = {
        totalSlides: typeof lecture.totalSlides === 'number' ? lecture.totalSlides : 0,
        hasFullQuiz,
        quizVersion,
        questionCount,
        questionIds,
        optionCounts
      };
    }
  }
  return catalog;
}

module.exports = {
  computeQuizVersion,
  extractStudyCatalog
};
