const assert = require('node:assert/strict');

async function register({ scenario }) {
  await scenario('storage-warning-remains-accessible-in-reader-and-quiz', async ({page, go}) => {
    await go('subject.html?id=database-systems');
    await page.locator('[data-open-study-lecture="2"]').first().click();
    await page.locator('#study-slides-feed .slide-study-card').first().waitFor();
    await page.evaluate(() => {
      const write = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        if (key.startsWith('sem2_study_v1:')) throw new window.DOMException('Full', 'QuotaExceededError');
        return write.call(this, key, value);
      };
      window.PortalStudyState.updateItem('["database-systems","lecture","2"]', {manualComplete: true});
    });
    const notice = page.locator('#lecture-study-modal [data-study-save-notice]');
    await notice.waitFor({state: 'visible'});
    assert.equal(await notice.evaluate(el => !!el.closest('[inert]')), false);
    assert.equal(await notice.getAttribute('role'), 'status');
    await page.locator('#study-tab-btn-quiz').click();
    assert(await notice.isVisible());
    await page.keyboard.press('Escape');
    await page.locator('#study-save-status').waitFor({state: 'visible'});
  });

  await scenario('storage-concurrent-base-writes-replacement-and-new-schema', async ({page, context, go}) => {
    await go('index.html');
    const other = await context.newPage(); await other.goto(page.url());
    const key = '["data-structure","lecture","0"]';
    await Promise.all([
      page.evaluate(k => window.PortalStudyState.updateItem(k, {startedAt: '2026-10-21T12:00:00Z'}), key),
      other.evaluate(k => window.PortalStudyState.updateItem(k, {manualComplete: true}), key)
    ]);
    await other.reload();
    const value = await other.evaluate(k => window.PortalStudyState.getItem(k), key);
    assert.equal(value.startedAt, '2026-10-21T12:00:00Z'); assert.equal(value.manualComplete, true);
    await page.evaluate(() => window.PortalStudyState.replaceAll({schemaVersion: 1, items: {}}));
    await other.waitForFunction(k => window.PortalStudyState.getItem(k) === null, key);
    await page.evaluate(() => localStorage.setItem('sem2_study_v1:meta', JSON.stringify({schemaVersion: 99})));
    await other.waitForFunction(() => window.PortalStudyState.getStatus() === 'unsupported-version');
    assert.equal(await other.evaluate(k => window.PortalStudyState.updateItem(k, {manualComplete: true}).saved, key), false);
    assert.equal(await other.evaluate(() => JSON.parse(localStorage.getItem('sem2_study_v1:meta')).schemaVersion), 99);
    await other.close();
  });
  await scenario('storage-normal-load-and-item-persistence', async ({ page, go }) => {
    await go('index.html');

    const result = await page.evaluate(async () => {
      if (!window.PortalStudyState) return { hasGlobal: false };

      const key = JSON.stringify(['computer-architecture', 'lecture', '0']);
      const writeRes = window.PortalStudyState.updateItem(key, {
        manualComplete: true,
        reader: { slideId: 3, tab: 'explanation', updatedAt: new Date().toISOString() }
      });

      const item = window.PortalStudyState.getItem(key);
      const status = window.PortalStudyState.getStatus();
      return {
        hasGlobal: true,
        writeSaved: writeRes.saved,
        status,
        manualComplete: item?.manualComplete,
        slideId: item?.reader?.slideId
      };
    });

    assert.equal(result.hasGlobal, true);
    assert.equal(result.writeSaved, true);
    assert.equal(result.status, 'persistent');
    assert.equal(result.manualComplete, true);
    assert.equal(result.slideId, 3);
  });

  await scenario('storage-session-fallback-warning-when-denied', async ({ page, go }) => {
    // Inject storage failure before page load
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem() { throw new Error('SecurityError: Access is denied'); },
          setItem() { throw new Error('SecurityError: Access is denied'); },
          removeItem() { throw new Error('SecurityError: Access is denied'); },
          clear() {},
          key() { return null; },
          length: 0
        },
        configurable: true
      });
    });

    await go('index.html');

    const result = await page.evaluate(() => {
      const state = window.PortalStudyState;
      if (!state) return { hasState: false };

      const status = state.getStatus();
      const warningHost = document.getElementById('study-save-status');
      const isVisible = warningHost && !warningHost.hidden && getComputedStyle(warningHost).display !== 'none';
      const warningText = warningHost?.textContent?.trim() || '';

      // Test that updating in memory still works without throwing
      const key = JSON.stringify(['database-systems', 'lecture', '0']);
      const writeRes = state.updateItem(key, { manualComplete: true });
      const item = state.getItem(key);

      return {
        hasState: true,
        status,
        hasWarningHost: Boolean(warningHost),
        warningVisible: isVisible,
        warningText,
        writeSaved: writeRes.saved,
        itemManualComplete: item?.manualComplete
      };
    });

    assert.equal(result.hasState, true);
    assert.equal(result.status, 'session');
    assert.equal(result.hasWarningHost, true);
    assert.equal(result.warningVisible, true);
    assert.match(result.warningText, /جلسة|تخزين/);
    assert.equal(result.writeSaved, false);
    assert.equal(result.itemManualComplete, true);
  });

  await scenario('storage-cross-tab-item-synchronization', async ({ page, context, go }) => {
    await go('index.html');
    const page2 = await context.newPage();
    await page2.goto(page.url());

    const key = JSON.stringify(['multimedia-systems', 'lecture', '1']);

    // Tab 1 writes an item
    const tab1Write = await page.evaluate(targetKey => {
      return window.PortalStudyState.updateItem(targetKey, {
        manualComplete: true,
        reader: { slideId: 7, tab: 'quiz', updatedAt: new Date().toISOString() }
      });
    }, key);
    assert.equal(tab1Write.saved, true);

    // Wait for cross-tab storage event reconciliation in Tab 2
    await page2.waitForTimeout(150);

    // Tab 2 should see the update without reloading
    const tab2Item = await page2.evaluate(targetKey => {
      return window.PortalStudyState.getItem(targetKey);
    }, key);

    assert.equal(tab2Item?.manualComplete, true);
    assert.equal(tab2Item?.reader?.slideId, 7);

    await page2.close();
  });
}

module.exports = { register };
