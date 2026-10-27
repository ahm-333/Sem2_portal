const assert = require('node:assert/strict');

async function settled(page) {
  await page.addInitScript(() => {
    localStorage.setItem('sem2_first_visit_configured', 'true');
    window.sessionStorage.setItem('sem2-studio-rift-intro-v3', 'seen');
  });
}

exports.register = async ({ scenario }) => {
  await scenario('quiz-reader-hydrates-answers-score-and-active-question-on-reload', async ({ page, go }) => {
    await settled(page);
    await go('subject.html?id=database-systems');

    // Open Lecture 2
    await page.locator('[data-open-study-lecture="2"]').first().click();
    await page.locator('#study-tab-btn-quiz').click();

    // Verify initial score is 0 / 20
    assert.equal((await page.locator('#full-quiz-score-val').innerText()).trim(), '0 / 20');

    // Answer Q1 with Traditional applications
    const cardQ1 = page.locator('#full-q-1');
    await cardQ1.getByRole('button', { name: /Traditional applications/ }).click();
    assert.equal((await page.locator('#full-quiz-score-val').innerText()).trim(), '1 / 20');

    // Move to next question (Q2)
    await page.locator('[data-quiz-step="next"]').click();
    assert.match(await page.locator('[data-quiz-position]').innerText(), /السؤال 2 من 20/);

    // Verify state in PortalStudyState before reload
    const key = '["database-systems","lecture","2"]';
    const stateBefore = await page.evaluate(k => window.PortalStudyState.getItem(k), key);
    assert.ok(stateBefore?.quiz, 'PortalStudyState must contain quiz state');
    assert.equal(stateBefore.quiz.answers['1'], 0, 'Q1 authored answer index 0 must be stored');
    assert.equal(stateBefore.quiz.activeQuestionId, 2, 'Active question ID 2 must be stored');

    // Reload page
    await page.reload();
    await page.locator('[data-open-study-lecture="2"]').first().click();
    await page.locator('#study-tab-btn-quiz').click();

    // Verify score is hydrated as 1 / 20 (not 0 / 20)
    assert.equal((await page.locator('#full-quiz-score-val').innerText()).trim(), '1 / 20');
    assert.equal((await page.locator('#full-quiz-answered-count').innerText()).trim(), '1 من 20 تم حله');

    // Verify Q2 is the active question
    assert.match(await page.locator('[data-quiz-position]').innerText(), /السؤال 2 من 20/);

    // Navigate back to Q1 and check that it is already answered with feedback
    await page.locator('[data-quiz-step="prev"]').click();
    assert.match(await page.locator('#full-q-1').innerText(), /إجابة صحيحة/);
    assert.equal(await page.locator('#full-q-1 .full-quiz-opt-btn[disabled]').count(), 4, 'Answered question options must be disabled');
  });

  await scenario('quiz-reader-completion-and-wrong-answer-review', async ({ page, go }) => {
    await settled(page);
    const key = '["database-systems","lecture","2"]';
    const catalogVersion = '0f77d6ceae5a';

    // Seed state with 19 questions answered (Q1 wrong, Q2-Q19 correct), Q20 unanswered
    await page.addInitScript(({ k, ver }) => {
      const answers = {};
      // Q1 wrong (choice 1)
      answers['1'] = 1;
      // Q2 to Q19 correct (choice 0 for simplicity, or dummy valid authored index)
      for (let i = 2; i <= 19; i++) {
        answers[String(i)] = 0;
      }
      localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(k) + ':quiz', JSON.stringify({
        version: ver,
        answers,
        activeQuestionId: 20
      }));
    }, { k: key, ver: catalogVersion });

    await go('subject.html?id=database-systems');
    await page.locator('[data-open-study-lecture="2"]').first().click();
    await page.locator('#study-tab-btn-quiz').click();

    // Should be on Q20
    assert.match(await page.locator('[data-quiz-position]').innerText(), /السؤال 20 من 20/);

    // Answer Q20 to complete the quiz
    const cardQ20 = page.locator('#full-q-20');
    await cardQ20.locator('.full-quiz-opt-btn').first().click();

    // Summary card should now be visible
    const summaryCard = page.locator('#full-quiz-summary-card');
    await summaryCard.waitFor({ state: 'visible' });

    // Review wrong answers button should exist
    const reviewBtn = page.locator('#full-quiz-review-wrong-btn');
    assert.equal(await reviewBtn.isVisible(), true, 'Review wrong answers button must be visible');
    await reviewBtn.click();

    // Focus / active question should now be on the wrong question (Q1)
    assert.match(await page.locator('[data-quiz-position]').innerText(), /السؤال 1 من 20/);

    // Return to results button
    const returnBtn = page.locator('#full-quiz-back-to-results-btn');
    assert.equal(await returnBtn.isVisible(), true, 'Back to results button must be visible');
    await returnBtn.click();
    assert.equal(await summaryCard.isVisible(), true, 'Summary card must become visible again');

    // Reset quiz
    await page.locator('#full-quiz-reset-btn').click();
    assert.equal((await page.locator('#full-quiz-score-val').innerText()).trim(), '0 / 20');
    assert.equal(await summaryCard.isVisible(), false, 'Summary card hidden after reset');

    // Verify in storage that completedVersions and lastCompleted were preserved
    const afterReset = await page.evaluate(k => window.PortalStudyState.getItem(k), key);
    assert.ok(afterReset.quiz.completedVersions.includes(catalogVersion), 'completedVersions must retain version after reset');
    assert.ok(afterReset.quiz.lastCompleted, 'lastCompleted must be retained after reset');
    assert.deepEqual(afterReset.quiz.answers, {}, 'answers must be reset to empty');
  });
};
