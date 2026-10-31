const assert = require('node:assert/strict');

async function settled(page) {
  await page.addInitScript(() => {
    localStorage.setItem('sem2_first_visit_configured', 'true');
    window.sessionStorage.setItem('sem2-studio-rift-intro-v3', 'seen');
  });
}

exports.register = async ({ scenario }) => {
  await scenario('search-ranking-prioritizes-exact-code-and-title', async ({ page, go }) => {
    await settled(page);
    await go('index.html#library');
    await page.locator('#library-query').waitFor({ state: 'visible' });

    // 1. Search exact code 'IS211'
    await page.locator('#library-query').fill('IS211');
    await page.waitForTimeout(100);
    const rows = page.locator('#library-results .studio-library-row');
    assert(await rows.count() > 0);
    const firstRowText = await rows.first().innerText();
    assert.match(firstRowText, /Database Systems|نظم قواعد البيانات/i);

    // 2. Search Arabic title with diacritics / variants
    await page.locator('#library-query').fill('أَنْظِمَةُ');
    await page.waitForTimeout(100);
    assert(await rows.count() > 0, 'Diacritics and Alef variants are normalized');

    // 3. Search with tatweel
    await page.locator('#library-query').fill('قــــاعـــدة');
    await page.waitForTimeout(100);
    assert(await rows.count() > 0, 'Tatweel is stripped and normalized');
  });

  await scenario('search-status-filter-combines-with-course-and-kind', async ({ page, go }) => {
    await settled(page);
    await go('index.html#library');
    await page.locator('#library-status').waitFor({ state: 'visible' });

    // 1. Status 'completed' when nothing is done yields empty state
    await page.locator('#library-course').selectOption('database-systems');
    await page.locator('#library-status').selectOption('completed');
    await page.waitForTimeout(100);

    const emptyMsg = page.locator('#library-results .studio-empty');
    assert.equal(await emptyMsg.isVisible(), true, 'Completed filter on empty state shows no results');

    // 2. Mark DB lecture 4 complete via PortalStudyProgress
    const lecKey = '["database-systems","lecture","4"]';
    await page.evaluate(k => {
      window.PortalStudyProgress.setManualComplete(k, true);
    }, lecKey);

    // Filter now reflects completed item
    await page.waitForTimeout(150);
    const rows = page.locator('#library-results .studio-library-row');
    assert.equal(await rows.count(), 1, 'Only the completed item is shown');
    assert.match(await rows.first().innerText(), /مكتمل/);

    // 3. Switch status to 'not-started': completed item must NOT appear
    await page.locator('#library-status').selectOption('not-started');
    await page.waitForTimeout(100);
    const notStartedKeys = await page.evaluate(() => {
      return [...document.querySelectorAll('#library-results .studio-library-row')].map(r => r.getAttribute('href'));
    });
    assert.ok(!notStartedKeys.some(href => href.includes(encodeURIComponent(lecKey))));

    // 4. Reset button clears all filters and restores focus to query
    await page.locator('#library-query').fill('non-existent-xyz-keyword');
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#library-reset').isVisible(), true);
    await page.locator('#library-reset').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#library-status').inputValue(), 'all');
    assert.equal(await page.locator('#library-course').inputValue(), 'all');
    assert.equal(await page.locator('#library-kind').inputValue(), 'all');
    assert.equal(await page.locator('#library-query').inputValue(), '');
    assert.equal(await page.evaluate(() => document.activeElement === document.getElementById('library-query')), true);
  });

  await scenario('search-preserves-lazy-first-render-and-zero-initial-rows', async ({ page, go }) => {
    await settled(page);
    await go('index.html');

    // On home view, studio-library is hidden and has 0 rows
    const librarySection = page.locator('#studio-library');
    assert.equal(await librarySection.getAttribute('hidden'), '');
    assert.equal(await page.locator('#library-results .studio-library-row').count(), 0);

    // Navigating to library triggers first render
    await page.locator('.studio-rail nav a[href="#library"]').click();
    await librarySection.waitFor({ state: 'visible' });
    await page.locator('#library-results .studio-library-row').first().waitFor({ state: 'visible' });
    assert(await page.locator('#library-results .studio-library-row').count() > 0);
  });
};
