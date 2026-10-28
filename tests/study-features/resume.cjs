const assert = require('node:assert/strict');

exports.register = async ({ scenario }) => {
  await scenario('resume-quiz-tab-persistence-and-continue', async ({ page, go }) => {
    page.setDefaultTimeout(15000);
    await go('subject.html?id=database-systems');

    // Open study modal for Lecture 2
    await page.locator('[data-open-study-lecture="2"]').first().click();
    await page.locator('#lecture-study-modal').waitFor({ state: 'visible' });

    // Switch to quiz tab
    await page.locator('#study-tab-btn-quiz').click();
    await page.waitForFunction(() => {
      const btn = document.getElementById('study-tab-btn-quiz');
      const view = document.getElementById('study-full-quiz-view');
      return btn && btn.classList.contains('active') && view && !view.classList.contains('hidden');
    });

    // Verify PortalStudyState saved quiz tab
    const key = '["database-systems","lecture","2"]';
    const state = await page.evaluate(k => window.PortalStudyState.getItem(k), key);
    assert.equal(state?.reader?.tab, 'quiz', 'Reader tab must be persisted as quiz');

    // Close modal with Escape
    await page.keyboard.press('Escape');
    await page.locator('#lecture-study-modal').waitFor({ state: 'hidden' });

    // Reload page to simulate resuming later
    await page.reload();

    // Reopen study modal on Lecture 2
    await page.locator('[data-open-study-lecture="2"]').first().click();
    await page.locator('#lecture-study-modal').waitFor({ state: 'visible' });
    await page.locator('#study-tab-btn-quiz.active').waitFor({ state: 'visible' });

    // Verify it automatically restored the Quiz tab
    const isQuizActive = await page.evaluate(() => {
      const btn = document.getElementById('study-tab-btn-quiz');
      const view = document.getElementById('study-full-quiz-view');
      return Boolean(btn && btn.classList.contains('active') && view && !view.classList.contains('hidden'));
    });
    assert.equal(isQuizActive, true, 'Reopening study modal must restore saved quiz tab');
  });

  await scenario('resume-explicit-parameters-override-saved-state', async ({ page, go }) => {
    page.setDefaultTimeout(15000);
    const key = '["database-systems","lecture","2"]';

    // Seed state so saved reader tab is 'quiz'
    await page.addInitScript(k => {
      localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(k) + ':reader', JSON.stringify({
        slideId: 0,
        tab: 'quiz',
        updatedAt: new Date().toISOString()
      }));
    }, key);

    // Deep link with explicit tab=explanation and slide=2
    await go(`subject.html?id=database-systems&track=lecture&kind=lectures&item=${encodeURIComponent(key)}&action=internal-study&tab=explanation&slide=2`);

    await page.locator('#lecture-study-modal').waitFor({ state: 'visible' });

    // Verify explicit tab=explanation took precedence over saved quiz tab
    const readerState = await page.evaluate(() => {
      const slidesBtn = document.getElementById('study-tab-btn-slides');
      const quizBtn = document.getElementById('study-tab-btn-quiz');
      const slidesView = document.getElementById('study-slides-view');
      const quizView = document.getElementById('study-full-quiz-view');
      return {
        slidesActive: slidesBtn?.classList.contains('active'),
        quizActive: quizBtn?.classList.contains('active'),
        slidesVisible: Boolean(slidesView && !slidesView.classList.contains('hidden')),
        quizHidden: Boolean(quizView && quizView.classList.contains('hidden'))
      };
    });

    assert.equal(readerState.slidesActive, true, 'Explicit tab=explanation must override saved quiz tab');
    assert.equal(readerState.quizActive, false);
    assert.equal(readerState.slidesVisible, true);
    assert.equal(readerState.quizHidden, true);
  });

  await scenario('resume-safe-recovery-missing-slide-and-unavailable-action', async ({ page, go }) => {
    page.setDefaultTimeout(15000);
    const key = '["database-systems","lecture","2"]';

    // 1. Recover gracefully when slide parameter is out of range (slide=999)
    await go(`subject.html?id=database-systems&track=lecture&kind=lectures&item=${encodeURIComponent(key)}&action=internal-study&slide=999`);
    await page.locator('#lecture-study-modal').waitFor({ state: 'visible' });

    const activeSlide = await page.evaluate(() => {
      const activeCard = document.querySelector('#study-slides-feed .slide-study-card.active, #study-slides-feed .slide-study-card');
      return activeCard ? Number(activeCard.dataset.slideIndex || 0) : null;
    });
    assert.equal(activeSlide, 0, 'Missing slide must safely fall back to first slide');

    await page.keyboard.press('Escape');
    await page.locator('#lecture-study-modal').waitFor({ state: 'hidden' });

    // 2. Recover gracefully when action is unavailable/unknown
    await go(`subject.html?id=database-systems&track=lecture&kind=lectures&item=${encodeURIComponent(key)}&action=non-existent-action`);

    const alertNotice = page.locator('.portal-nav-notice[role="alert"]');
    await alertNotice.waitFor({ state: 'visible' });
    const noticeText = await alertNotice.innerText();
    assert.match(noticeText, /الإجراء المطلوب غير متوفر حالياً/);
  });

  await scenario('resume-external-source-activity-and-continue-card', async ({ page, go }) => {
    page.setDefaultTimeout(15000);
    const key = '["data-structure","lecture","0"]';

    await go('subject.html?id=data-structure&track=lecture&kind=lectures');

    // Find row for Lecture 0
    const row = page.locator(`[data-content-key='${key}']`);
    await row.waitFor({ state: 'visible' });

    // Click on drive preview action button
    const previewBtn = row.locator('[data-action-id="drivePreviewUrl"]');
    await previewBtn.waitFor({ state: 'visible' });
    await previewBtn.click();

    // Verify activity recorded canonical key including ID 0 and actionId
    const lastUsed = await page.evaluate(() => window.PortalStudyState.getSnapshot().lastUsed);
    assert.ok(lastUsed, 'lastUsed must be recorded');
    assert.equal(lastUsed.key, key, 'Canonical key with ID 0 must be preserved');
    assert.equal(lastUsed.actionId, 'drivePreviewUrl');

    // Verify item startedAt was recorded
    const item = await page.evaluate(k => window.PortalStudyState.getItem(k), key);
    assert.ok(item?.startedAt, 'startedAt must be set on activity');

    // Go to index.html and verify home resume banner
    await go('index.html');
    await page.locator('#studio-resume').waitFor({ state: 'visible' });

    const resumeLink = page.locator('#studio-resume a.studio-resume-link');
    const href = await resumeLink.getAttribute('href');
    assert.ok(href, 'Resume link must have href');
    assert.match(href, /item=%5B%22data-structure%22%2C%22lecture%22%2C%220%22%5D/);
    assert.match(href, /action=drivePreviewUrl/);

    // Switch to continue view in-page
    await page.evaluate(() => { window.location.hash = '#continue'; });
    await page.locator('#continue-results').waitFor({ state: 'visible' });
    const continueItem = page.locator('#continue-results .studio-library-row').first();
    await continueItem.waitFor({ state: 'visible' });
    const continueHref = await continueItem.getAttribute('href');
    assert.match(continueHref, /item=%5B%22data-structure%22%2C%22lecture%22%2C%220%22%5D/);
  });

  await scenario('resume-standalone-section-and-bridge-preservation', async ({ page, go }) => {
    page.setDefaultTimeout(15000);
    const key = '["data-structure","lecture","1"]';
    const nowIso = new Date().toISOString();

    // Seed reader item state, lastUsed, and valid standalone bridge marker
    await page.addInitScript(({ k, ts }) => {
      localStorage.setItem('sem2_study_v1:meta', JSON.stringify({
        schemaVersion: 1,
        lastUsed: { key: k, actionId: 'standalone-study', updatedAt: ts }
      }));
      localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(k) + ':reader', JSON.stringify({
        slideId: 4,
        tab: 'explanation',
        updatedAt: ts
      }));
      localStorage.setItem('sem2_standalone_v1:' + encodeURIComponent(k), JSON.stringify({
        version: 1,
        anchor: 'sec-4',
        updatedAt: ts
      }));
    }, { k: key, ts: nowIso });

    await go('index.html');
    await page.locator('#studio-resume').waitFor({ state: 'visible' });

    const resumeLink = page.locator('#studio-resume a.studio-resume-link');
    const href = await resumeLink.getAttribute('href');
    assert.match(href, /#sec-4/, 'Bridge anchor must be preserved as URL hash');

    // Switch to continue view in-page
    await page.evaluate(() => { window.location.hash = '#continue'; });
    await page.locator('#continue-results').waitFor({ state: 'visible' });
    const continueItem = page.locator('#continue-results .studio-library-row').first();
    const continueHref = await continueItem.getAttribute('href');
    assert.match(continueHref, /#sec-4/, 'Bridge anchor must be preserved as URL hash in continue results');
  });
};
