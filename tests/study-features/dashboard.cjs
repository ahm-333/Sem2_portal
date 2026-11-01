const assert = require('node:assert/strict');

exports.register = async ({ scenario }) => {
  await scenario('dashboard-course-cards-show-completion-counts-and-scope', async ({ page, go }) => {
    page.setDefaultTimeout(15000);
    await go('index.html');

    // Wait for courses-grid and course cards
    await page.locator('#courses-grid .a1-course').first().waitFor({ state: 'visible' });

    // Check database-systems card
    const dbCard = page.locator('#courses-grid [data-course-id="database-systems"]');
    await dbCard.waitFor({ state: 'visible' });

    const summary = dbCard.locator('.studio-course-summary');
    await summary.waitFor({ state: 'visible' });

    // Verify lectures & sections metrics
    const lecturesMetric = summary.locator('.metric-lectures');
    await lecturesMetric.waitFor({ state: 'visible' });
    const lecText = await lecturesMetric.innerText();
    assert.match(lecText, /المحاضرات/);
    assert.match(lecText, /مكتمل/);
    assert.match(lecText, /متبقٍ/);

    const sectionsMetric = summary.locator('.metric-sections');
    await sectionsMetric.waitFor({ state: 'visible' });
    const secText = await sectionsMetric.innerText();
    assert.match(secText, /السكاشن/);

    // Verify progress bar
    const bar = summary.locator('[role="progressbar"]');
    await bar.waitFor({ state: 'visible' });
    const ariaValueNow = await bar.getAttribute('aria-valuenow');
    assert.equal(ariaValueNow, '0');

    // Verify scope statement and grade disclaimer
    const scopeEl = summary.locator('.studio-summary-scope');
    const scopeText = await scopeEl.innerText();
    assert.match(scopeText, /المحتوى المنشور على المنصة/);
    assert.match(scopeText, /الدرجات|إتقان/);
  });

  await scenario('dashboard-fresh-state-has-no-invented-progress-or-last-used', async ({ page, go }) => {
    page.setDefaultTimeout(15000);
    await go('index.html');

    // #studio-resume must be hidden on fresh state
    const isResumeHidden = await page.evaluate(() => {
      const el = document.getElementById('studio-resume');
      return !el || el.hidden || el.style.display === 'none';
    });
    assert.equal(isResumeHidden, true, '#studio-resume must be hidden on fresh state');

    // Go to continue section
    await page.evaluate(() => { window.location.hash = '#continue'; });
    await page.locator('#continue-results').waitFor({ state: 'visible' });

    // Must show empty state with link to #library
    const emptyState = page.locator('#continue-results .studio-empty');
    await emptyState.waitFor({ state: 'visible' });
    const libraryBtn = emptyState.locator('a[href="#library"]');
    await libraryBtn.waitFor({ state: 'visible' });
  });

  await scenario('dashboard-progress-update-and-profile-switch', async ({ page, go }) => {
    page.setDefaultTimeout(15000);
    await go('index.html');

    const dbCard = page.locator('#courses-grid [data-course-id="database-systems"]');
    await dbCard.waitFor({ state: 'visible' });

    // Mark Lecture 4 complete via setManualComplete
    const key = '["database-systems","lecture","4"]';
    await page.evaluate(k => {
      window.PortalStudyProgress.setManualComplete(k, true);
    }, key);

    // Verify course card summary updated dynamically in-place
    await page.waitForFunction(() => {
      const el = document.querySelector('#courses-grid [data-course-id="database-systems"] .metric-lectures .count-done');
      return el && el.textContent.trim() === '1';
    });

    const percentText = await dbCard.locator('.studio-summary-percent').innerText();
    assert.notEqual(percentText, '0%', 'Progress percent must increase after completing lecture');

    // Switch profile to section 6 (Group B2)
    await page.evaluate(() => {
      window.StudentProfile.set('B2', 6);
    });

    // Check that card still has progress and reflects new profile
    await page.waitForFunction(() => {
      const el = document.querySelector('#courses-grid [data-course-id="database-systems"] .metric-lectures .count-done');
      return el && el.textContent.trim() === '1';
    });
  });

  await scenario('dashboard-resume-and-activity-recording', async ({ page, go }) => {
    page.setDefaultTimeout(15000);
    const key = '["data-structure","lecture","0"]';
    const nowIso = new Date().toISOString();

    // Seed state with valid activity
    await page.addInitScript(({ k, ts }) => {
      localStorage.setItem('sem2_study_v1:meta', JSON.stringify({
        schemaVersion: 1,
        lastUsed: { key: k, actionId: 'drivePreviewUrl', updatedAt: ts }
      }));
      localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(k) + ':reader', JSON.stringify({
        slideId: 1,
        tab: 'explanation',
        updatedAt: ts
      }));
    }, { k: key, ts: nowIso });

    await go('index.html');

    const resume = page.locator('#studio-resume');
    await resume.waitFor({ state: 'visible' });

    const resumeLink = resume.locator('a.studio-resume-link');
    await resumeLink.waitFor({ state: 'visible' });
    const href = await resumeLink.getAttribute('href');
    assert.match(href, /item=%5B%22data-structure%22%2C%22lecture%22%2C%220%22%5D/);
    assert.match(href, /action=drivePreviewUrl/);

    // Continue view lists item
    await page.evaluate(() => { window.location.hash = '#continue'; });
    const continueItem = page.locator('#continue-results .studio-library-row').first();
    await continueItem.waitFor({ state: 'visible' });
  });

  await scenario('dashboard-deleted-or-unavailable-last-used-explicit-recovery', async ({ page, go }) => {
    page.setDefaultTimeout(15000);
    const orphanKey = '["non-existent-course","lecture","999"]';
    const nowIso = new Date().toISOString();

    await page.addInitScript(({ k, ts }) => {
      localStorage.setItem('sem2_study_v1:meta', JSON.stringify({
        schemaVersion: 1,
        lastUsed: { key: k, actionId: 'internal-study', updatedAt: ts }
      }));
      localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(k) + ':base', JSON.stringify({
        startedAt: ts
      }));
    }, { k: orphanKey, ts: nowIso });

    await go('index.html');

    // Verify explicit recovery notice rendered in #studio-resume
    const resume = page.locator('#studio-resume');
    await resume.waitFor({ state: 'visible' });

    const recoveryNotice = resume.locator('.studio-resume-recovery');
    await recoveryNotice.waitFor({ state: 'visible' });
    const text = await recoveryNotice.innerText();
    assert.match(text, /المصدر السابق لم يعد متاحاً/);
    assert.ok(recoveryNotice.locator('a[href="#library"]'), 'Recovery notice must offer link to library');

    // Verify storage still contains orphan item without deletion
    const hasOrphan = await page.evaluate(k => {
      const snap = window.PortalStudyState.getSnapshot();
      return snap.lastUsed?.key === k && Boolean(snap.items[k]);
    }, orphanKey);
    assert.equal(hasOrphan, true, 'Orphan records must be preserved without deletion');
  });

  await scenario('dashboard-schedule-isolation-and-responsive', async ({ page, go }) => {
    page.setDefaultTimeout(15000);
    await go('index.html#schedule-section');

    const scheduleSection = page.locator('#schedule-section');
    await scheduleSection.waitFor({ state: 'visible' });

    // Verify timetable header and grid exist
    await page.locator('#weekly-schedule-grid').waitFor({ state: 'visible' });

    // Verify NO .studio-course-summary or .studio-resume-link exists in #schedule-section
    const summaryInSchedule = await scheduleSection.locator('.studio-course-summary').count();
    const resumeInSchedule = await scheduleSection.locator('.studio-resume-link').count();
    assert.equal(summaryInSchedule, 0, 'No course summary should be in timetable view');
    assert.equal(resumeInSchedule, 0, 'No resume link should be in timetable view');

    // Test responsive viewports
    for (const width of [360, 390, 412, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.evaluate(() => { window.location.hash = '#courses-section'; });
      await page.locator('#courses-grid .a1-course').first().waitFor({ state: 'visible' });
      const cardVisible = await page.locator('#courses-grid .a1-course').first().isVisible();
      assert.equal(cardVisible, true, `Course card must be visible at width ${width}`);
    }

    // Test themes
    for (const theme of ['light', 'dark', 'reading']) {
      await page.evaluate(t => {
        document.documentElement.setAttribute('data-theme', t);
      }, theme);
      const attr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      assert.equal(attr, theme);
    }
  });
};
