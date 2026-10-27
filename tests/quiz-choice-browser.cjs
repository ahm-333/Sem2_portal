const assert = require('node:assert/strict');
async function settled(page) {
  await page.addInitScript(() => {
    localStorage.setItem('sem2_first_visit_configured', 'true');
    window.sessionStorage.setItem('sem2-studio-rift-intro-v3', 'seen');
    Math.random = () => .314159;
  });
}
exports.register = async ({scenario}) => {
  await scenario('choices-os-final-review-varies-options-with-correct-feedback-and-reset', async ({page, go}) => {
    await settled(page); await go('education-preview/os/index.html?unit=os-01');
    const userView = page.locator('#mixed-questions [data-question="view-response"]');
    const kernel = page.locator('#mixed-questions [data-question="historical-kernel"]');
    await userView.waitFor();
    const before = [await userView.locator('fieldset label').allTextContents(), await kernel.locator('fieldset label').allTextContents()];
    assert.notDeepEqual([before[0].findIndex(text => text.includes('User view: convenience and performance')), before[1].findIndex(text => text.includes('To manage the system’s CPU'))], [0,1], 'final-review questions vary their authored correct-answer positions too');
    await userView.getByLabel('User view: convenience and performance', {exact:true}).check();
    await userView.getByRole('button', {name:'راجع الإجابة'}).click();
    assert.match(await userView.locator('.feedback').innerText(), /إجابة صحيحة/);
    assert.match(await userView.locator('.feedback').innerText(), /User view/);
    assert.deepEqual(await userView.locator('fieldset label').allTextContents(), before[0], 'answering keeps final-review choices stable');
    await page.getByRole('button', {name:'ابدأ المحاولة من جديد'}).click();
    assert.equal(await userView.locator('input:checked').count(), 0);
    assert.notDeepEqual([await userView.locator('fieldset label').allTextContents(), await kernel.locator('fieldset label').allTextContents()], before, 'final-review reset starts a fresh presentation');
    await userView.getByLabel('User view: convenience and performance', {exact:true}).check();
    await userView.getByRole('button', {name:'راجع الإجابة'}).click();
    assert.match(await userView.locator('.feedback').innerText(), /إجابة صحيحة/);
  });
  await scenario('choices-reader-slide-check-keeps-the-authored-answer-text-correct', async ({page, go}) => {
    await settled(page); await go('subject.html?id=database-systems');
    await page.locator('[data-open-study-lecture="2"]').first().click();
    await page.locator('[data-jump-to="slide-card-3"]').click();
    const card = page.locator('.slide-study-card:not([hidden]) .quiz-card');
    const texts = await card.locator('.quiz-opt-text').allTextContents();
    assert.notEqual(texts.findIndex(text => text.includes('Traditional applications')), 0, 'slide-check choices should not remain in source order');
    await card.getByRole('button', {name: /Traditional applications/}).click();
    assert.match(await card.locator('.quiz-feedback').innerText(), /صحيحة/);
    assert.match(await card.locator('.quiz-feedback').innerText(), /traditional applications/);
    assert.deepEqual(await card.locator('.quiz-opt-text').allTextContents(), texts);
    await page.locator('[data-reader-step="next"]').click();
    await page.locator('[data-reader-step="prev"]').click();
    assert.deepEqual(await card.locator('.quiz-opt-text').allTextContents(), texts);
  });
  await scenario('choices-os-radio-options-shuffle-with-keyed-feedback-and-restart', async ({page, go}) => {
    await settled(page); await go('education-preview/os/index.html?unit=os-01');
    const card = page.locator('.question').filter({has: page.locator('input[value="app"]')}).first();
    await card.waitFor();
    const before = await card.locator('fieldset label').allTextContents();
    assert.notEqual(before.findIndex(text => text.includes('Application program')), 2, 'radio choices move from their original third position');
    await card.getByLabel('Application program', {exact: true}).check();
    await card.getByRole('button', {name: 'راجع الإجابة'}).click();
    assert.match(await card.locator('.feedback').innerText(), /إجابة صحيحة/);
    assert.match(await card.locator('.feedback').innerText(), /Word/);
    assert.deepEqual(await card.locator('fieldset label').allTextContents(), before);
    await page.getByRole('button', {name: 'ابدأ المحاولة من جديد'}).click();
    assert.equal(await card.locator('input:checked').count(), 0);
    assert.notDeepEqual(await card.locator('fieldset label').allTextContents(), before, 'explicit restart produces a fresh choice order');
  });
  await scenario('choices-other-standalone-button-quizzes-preserve-answer-identity', async ({page, go}) => {
    await settled(page);
    for (const [route, selector, correct, original] of [
      ['study/ds/lecture-3.html', '#quizQuestionsContainer article', 'To provide a direct solution and terminate the recursion.', 1],
      ['study/db/chapter-1.html', '#quizContainer > div', 'Data', 2],
      ['study/db/chapter-2.html', '#quizContainer > div', 'Data Abstraction', 1]
    ]) {
      await go(route);
      const card = page.locator(selector).first();
      const buttons = card.locator('button');
      const texts = await buttons.allTextContents();
      const quizOrder = await page.locator(selector).evaluateAll(cards => cards.slice(0, 3).map(item => [...item.querySelectorAll('button > span:first-child')].map(span => span.textContent)));
      assert.notEqual(texts.findIndex(text => text.replace(/^\s*(?:\([A-D]\)|[A-D][).])\s*/, '').trim() === correct), original, route + ': correct textual choice should move under the fixed test seed');
      await card.getByRole('button', {name: new RegExp('^\\s*(?:\\([A-D]\\)|[A-D][).])?\\s*' + correct.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$')}).click();
      assert.match(await page.locator('#quizScoreDisplay').innerText(), /^1\s*\//);
      assert.match(await card.innerText(), /التعريف|تجريد البيانات|Base Case/);
      await page.locator('#btnResetQuiz').click();
      assert.match(await page.locator('#quizScoreDisplay').innerText(), /^0\s*\//);
      const freshOrder = await page.locator(selector).evaluateAll(cards => cards.slice(0, 3).map(item => [...item.querySelectorAll('button > span:first-child')].map(span => span.textContent)));
      assert.notDeepEqual(freshOrder, quizOrder, route + ': a fresh attempt renews choice order');
      await card.getByRole('button', {name: new RegExp('^\\s*(?:\\([A-D]\\)|[A-D][).])?\\s*' + correct.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$')}).click();
      assert.match(await page.locator('#quizScoreDisplay').innerText(), /^1\s*\//);
    }
  });
  await scenario('choices-reader-full-quiz-keeps-scoring-after-answer-permutation', async ({page, go}) => {
    await settled(page); await go('subject.html?id=database-systems');
    await page.locator('[data-open-study-lecture="2"]').first().click();
    await page.locator('#study-tab-btn-quiz').click();
    const card = page.locator('#full-q-1');
    const originalCorrect = 'Traditional applications (Numeric and Textual databases)';
    const text = await card.locator('.full-quiz-opt-btn > span:first-child').allTextContents();
    const second = await page.locator('#full-q-2 .full-quiz-opt-btn > span:first-child').allTextContents();
    assert(!(text[0].trim() === originalCorrect && second[0].trim() === 'For searching and indexing purposes'), 'the first authored A answers must not remain a fixed presentation pattern');
    await card.getByRole('button', {name: /Traditional applications/}).click();
    assert.equal((await page.locator('#full-quiz-score-val').innerText()).trim(), '1 / 20');
    assert.match(await card.innerText(), /إجابة صحيحة/);
    assert.match(await card.innerText(), /Our course focuses on traditional applications/);
    assert.deepEqual(await card.locator('.full-quiz-opt-btn > span:first-child').allTextContents(), text);
    await page.locator('#full-quiz-reset-btn').click();
    assert.equal((await page.locator('#full-quiz-score-val').innerText()).trim(), '0 / 20');
    const fresh = await card.locator('.full-quiz-opt-btn > span:first-child').allTextContents();
    assert.notDeepEqual(fresh, text, 'restart renews full-quiz choice order');
    await card.getByRole('button', {name: /Traditional applications/}).click();
    assert.equal((await page.locator('#full-quiz-score-val').innerText()).trim(), '1 / 20');
  });
  await scenario('choices-ds-native-quiz-keeps-explanation-choice-references-consistent', async ({page, go}) => {
    await settled(page); await go('study/ds/lecture-1.html');
    const first = page.locator('#quizQuestionsContainer article').first();
    const before = await first.locator('.quiz-option').allTextContents();
    assert.notEqual(before.findIndex(text => text.includes('WHAT operations')), 1, 'the native quiz must shuffle the authored second answer');
    await first.getByRole('button', {name: /WHAT operations/}).click();
    assert.match(await page.locator('#quizScoreDisplay').innerText(), /^1 \/ 16/);
    assert.match(await first.innerText(), /إجابة صحيحة/);
    const reference = page.locator('#quizQuestionsContainer article').filter({has: page.locator('.quiz-option', {hasText: 'Runtime heap compression'})});
    await reference.getByRole('button', {name: /Runtime heap compression/}).click();
    const correctText = await reference.locator('.quiz-option.correct').innerText();
    assert.match(correctText, /Runtime heap compression/);
    const displayedLetter = correctText.trim()[0];
    assert((await reference.innerText()).includes('خيار ' + displayedLetter + ' لا علاقة له بالقوالب.'));
  });
  await scenario('choices-architecture-shuffles-display-preserving-the-correct-text', async ({page, go}) => {
    await settled(page); await go('study/arch/chapter-7.html');
    await page.locator('#tab-quiz').click();
    const correct = ['Video Display Terminal (VDT / Monitor)', 'Machine-readable devices', '128', 'Control characters', 'Due to huge speed disparities', 'Data buffering', 'Processor communication', 'Error detection'];
    const positions = [];
    for (let i = 0; i < correct.length; i++) {
      const texts = await page.locator(`#q-card-${i + 1} button`).allTextContents();
      positions.push(texts.findIndex(text => text.includes(correct[i])));
    }
    assert.notDeepEqual(positions, [1, 2, 1, 1, 1, 2, 1, 2], 'displayed answers must not repeat the fixed authored positions');
    const first = page.locator('#q-card-1');
    const before = await first.locator('button').allTextContents();
    await first.getByRole('button', {name: /Video Display Terminal/}).click();
    assert.equal(await page.locator('#quiz-score').innerText(), '1');
    assert.match(await first.innerText(), /Human-Readable/);
    const after = await first.locator('button > span:first-child').allTextContents();
    assert.deepEqual(after.map(text => text.trim()), before.map(text => text.trim()));
    await page.reload(); await page.locator('#tab-quiz').click();
    assert.deepEqual((await first.locator('button').allTextContents()).map(text => text.trim()), before.map(text => text.trim()), 'reload keeps the same attempt choice order');
  });
};
