const assert = require('node:assert/strict');

async function register({ scenario }) {
  await scenario('ds-trees-portal-and-index-navigation', async ({ page, go, errors }) => {
    await go('subject.html?id=data-structure&kind=lectures');
    for (const number of [7, 8]) {
      const url = 'study/ds/lecture-' + number + '.html';
      const link = page.locator('[data-standalone-study-link="' + number + '"]:visible');
      assert.equal(await link.getAttribute('href'), url);
      const catalogUrl = await page.evaluate(id => {
        const catalog = window.PortalCatalog;
        return catalog.get(catalog.key('data-structure', 'lecture', id)).module.url;
      }, number);
      assert.equal(catalogUrl, url);
    }

    await page.locator('[data-standalone-study-link="7"]:visible').press('Enter');
    await page.waitForURL('**/study/ds/lecture-7.html');
    await page.locator('a[href="lecture-8.html"]').press('Enter');
    await page.waitForURL('**/study/ds/lecture-8.html');
    await page.locator('a[href="lecture-7.html"]').first().press('Enter');
    await page.waitForURL('**/study/ds/lecture-7.html');
    await page.locator('a[href="index.html"]').press('Enter');
    await page.waitForURL('**/study/ds/index.html');
    assert.equal(await page.locator('a[href="lecture-7.html"]').count(), 1);
    await page.locator('a[href="lecture-8.html"]').press('Enter');
    await page.waitForURL('**/study/ds/lecture-8.html');
    assert.deepEqual(errors, []);
  });

  await scenario('ds-trees-keyboard-filters-drawer-quiz-and-spacing', async ({ page, go, errors }) => {
    for (const [number, target, correct] of [[7, 'part6', 2], [8, 'part8', 1]]) {
      await go('study/ds/lecture-' + number + '.html');
      const lineHeight = () => page.locator('#part1 .academic-quote').first().evaluate(el => parseFloat(getComputedStyle(el).lineHeight));
      const initialHeight = await lineHeight();
      const spacing = page.locator('#btnLineSpacing');
      await spacing.press('Enter');
      assert(await lineHeight() > initialHeight);
      await spacing.press('Enter');
      assert(await lineHeight() < initialHeight);

      const quizPill = page.locator('button[data-target="section-quiz"]');
      await quizPill.press('Space');
      assert.equal(await quizPill.getAttribute('aria-pressed'), 'true');
      const savedAnchor = await page.evaluate(() => {
        const key = 'sem2_standalone_v1:' + encodeURIComponent(window.PortalStudySession.module.key);
        return JSON.parse(localStorage.getItem(key))?.anchor;
      });
      assert.equal(savedAnchor, 'section-quiz');
      assert.equal(await page.locator('#' + target).isVisible(), false);

      const opener = page.locator('#btn-open-toc');
      const close = page.locator('#btn-close-toc');
      const last = page.locator('#sidebar-toc nav a').last();
      const focused = locator => locator.evaluate(el => el === document.activeElement);
      await opener.press('Enter');
      assert.equal(await opener.getAttribute('aria-expanded'), 'true');
      assert(await focused(close));
      await page.keyboard.press('Shift+Tab');
      assert(await focused(last));
      await page.keyboard.press('Tab');
      assert(await focused(close));
      await page.keyboard.press('Escape');
      assert.equal(await opener.getAttribute('aria-expanded'), 'false');
      assert(await focused(opener));

      await opener.press('Enter');
      await page.locator('#sidebar-toc a[href="#' + target + '"]').press('Enter');
      await page.waitForURL('**#' + target);
      const section = page.locator('#' + target);
      assert(await section.isVisible());
      assert(await focused(section));
      assert.equal(await page.locator('button[data-target="' + target + '"]').getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('#section-quiz').isVisible(), false);

      await quizPill.press('Enter');
      const chosen = page.locator('.quiz-option[data-qid="1"][data-opt="' + correct + '"]');
      const firstOrder = await page.locator('.quiz-option[data-qid="1"]').evaluateAll(options => options.map(el => el.dataset.opt));
      await chosen.press('Enter');
      assert(await focused(chosen));
      assert.equal(await chosen.getAttribute('aria-disabled'), 'true');
      if (number === 8) {
        assert(await chosen.evaluate(el => getComputedStyle(el.lastElementChild).color === getComputedStyle(el).color));
      }
      assert.equal(await page.locator('.quiz-feedback').count(), 1);
      assert.match(await page.locator('#quizStatus').textContent(), /إجابة صحيحة.*1 من 16/);
      assert.deepEqual(await page.locator('.quiz-option[data-qid="1"]').evaluateAll(options => options.map(el => el.dataset.opt)), firstOrder);
      await page.keyboard.press('Tab');
      assert(await page.locator('.quiz-option[data-qid="2"]:focus').count());
      await page.keyboard.press('Space');
      assert.equal(await page.locator('.quiz-feedback').count(), 2);
      const category = page.locator('.quiz-filter-btn').nth(1);
      await category.press('Enter');
      assert(await focused(category));
      assert.equal(await category.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('.quiz-option[data-qid="1"][aria-disabled="true"]').count(), 4);
      assert.deepEqual(await page.locator('.quiz-option[data-qid="1"]').evaluateAll(options => options.map(el => el.dataset.opt)), firstOrder);
      await page.locator('#btnResetQuiz').press('Enter');
      assert.equal(await page.locator('.quiz-feedback').count(), 0);
      assert.match(await page.locator('#quizStatus').textContent(), /0 من 16/);
    }
    assert.deepEqual(errors, []);
  }, { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
}

module.exports = { register };
