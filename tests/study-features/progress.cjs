const assert = require('node:assert/strict');

async function settled(page) {
  await page.addInitScript(() => {
    localStorage.setItem('sem2_first_visit_configured', 'true');
    window.sessionStorage.setItem('sem2-studio-rift-intro-v3', 'seen');
  });
}

exports.register = async ({ scenario }) => {
  await scenario('progress-summary-shows-published-counts-and-scope', async ({ page, go }) => {
    await settled(page);
    await go('subject.html?id=database-systems');

    // Progress panel / chip exists
    const chip = page.locator('#atlas-progress-percent-chip');
    await chip.waitFor({ state: 'visible' });

    // Open disclosure panel to view details
    await page.locator('#atlas-course-progress-panel summary').click();

    // Scope text is visible and declared accurately
    const scope = page.locator('#atlas-progress-scope');
    assert.match(await scope.innerText(), /المحتوى المنشور على المنصة/);

    // Initial percent is 0%
    assert.match(await chip.innerText(), /0%/);

    // Check lecture stats: 4 published lectures in Database Systems
    const lecCard = page.locator('#atlas-progress-lectures-card');
    assert.match(await lecCard.innerText(), /4/);
  });

  await scenario('manual-completion-toggles-persists-on-reload-and-updates-summary', async ({ page, go }) => {
    await settled(page);
    await go('subject.html?id=database-systems');

    const key = '["database-systems","lecture","4"]';
    const row = page.locator(`[data-content-key='${key}']`);
    await row.waitFor({ state: 'visible' });

    // Initial status badge is not-started
    const badge = row.locator('.atlas-progress-badge');
    assert.match(await badge.innerText(), /لم يبدأ/);

    // Click manual complete button
    const toggleBtn = row.locator('[data-progress-manual]');
    await toggleBtn.click();

    // Badge updates to completed
    await page.waitForTimeout(100);
    assert.match(await badge.innerText(), /مكتمل/);
    assert.equal(await toggleBtn.getAttribute('aria-pressed'), 'true');

    // Course summary chip increments
    const chip = page.locator('#atlas-progress-percent-chip');
    assert.notEqual((await chip.innerText()).trim(), '0%');

    // Reload page: state persists!
    await page.reload();
    const reloadedRow = page.locator(`[data-content-key='${key}']`);
    await reloadedRow.waitFor({ state: 'visible' });
    const reloadedBadge = reloadedRow.locator('.atlas-progress-badge');
    assert.match(await reloadedBadge.innerText(), /مكتمل/);

    // Undo completion
    const reloadedToggle = reloadedRow.locator('[data-progress-manual]');
    await reloadedToggle.click();
    await page.waitForTimeout(100);
    assert.match(await reloadedBadge.innerText(), /جارٍ/);
  });

  await scenario('lecture-with-full-quiz-has-no-manual-toggle-and-preserves-quiz-policy', async ({ page, go }) => {
    await settled(page);
    await go('subject.html?id=database-systems');

    // Lecture 2 has a full quiz
    const fullQuizKey = '["database-systems","lecture","2"]';
    const row = page.locator(`[data-content-key='${fullQuizKey}']`);
    await row.waitFor({ state: 'visible' });

    // Manual complete button must NOT exist on a row with a full quiz
    const toggleBtn = row.locator('[data-progress-manual]');
    assert.equal(await toggleBtn.count(), 0, 'Rows with full quiz must not render a manual completion button');
  });

  await scenario('profile-switching-preserves-prior-progress-and-recalculates-summary', async ({ page, go }) => {
    await settled(page);
    await go('subject.html?id=computer-architecture');

    // Complete lecture 1
    const lec1Key = '["computer-architecture","lecture","1"]';
    const lecRow = page.locator(`[data-content-key='${lec1Key}']`);
    await lecRow.waitFor({ state: 'visible' });
    await lecRow.locator('[data-progress-manual]').click();
    await page.waitForTimeout(100);

    // Switch profile to B2 / Section 6 via StudentProfile
    await page.evaluate(() => window.StudentProfile.set('B2', 6));
    await page.waitForTimeout(150);

    // Lecture 1 is still completed!
    assert.match(await lecRow.locator('.atlas-progress-badge').innerText(), /مكتمل/);

    // Summary reflects completed lecture 1
    const lecCard = page.locator('#atlas-progress-lectures-card');
    assert.match(await lecCard.textContent(), /1/);
  });

  await scenario('two-tabs-synchronize-progress-via-storage-events', async ({ page, context, go }) => {
    await settled(page);
    await go('subject.html?id=database-systems');

    const page2 = await context.newPage();
    await settled(page2);
    await page2.goto(page.url(), { waitUntil: 'load' });

    const key = '["database-systems","lecture","4"]';
    const row1 = page.locator(`[data-content-key='${key}']`);
    await row1.waitFor({ state: 'visible' });

    // Mark complete in Tab 1
    await row1.locator('[data-progress-manual]').click();
    await page.waitForTimeout(200);

    // Tab 2 should update dynamically via storage event
    const row2 = page2.locator(`[data-content-key='${key}']`);
    await row2.waitFor({ state: 'visible' });
    const badge2 = row2.locator('.atlas-progress-badge');
    await badge2.waitFor({ state: 'visible' });
    assert.match(await badge2.innerText(), /مكتمل/);

    await page2.close();
  });
};
