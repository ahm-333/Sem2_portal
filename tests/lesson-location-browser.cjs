const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const output = path.resolve(process.env.PORTAL_TEST_OUTPUT || path.join(root, 'test-results'));
fs.mkdirSync(output, { recursive: true });

const results = [];
let browser, server, base;
const filter = new RegExp(process.env.PORTAL_TEST_FILTER || '.*');

async function scenario(name, fn, options = {}) {
  if (!filter.test(name)) return;
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ...options
  });
  await context.route('https://**', route => route.abort());
  await context.addInitScript(() => {
    if (location.hostname === '127.0.0.1') {
      localStorage.setItem('sem2_first_visit_configured', 'true');
      window.sessionStorage.setItem('sem2-studio-rift-intro-v3', 'seen');
    }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  const go = async route => {
    await page.goto(base + route, { waitUntil: 'load' });
  };

  try {
    await fn({ page, context, go, errors });
    results.push({ name, passed: true });
    console.log('PASS', name);
  } catch (e) {
    results.push({ name, passed: false, error: e.stack, errors });
    await page.screenshot({ path: path.join(output, 'lesson-loc-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.message.slice(0, 180));
  } finally {
    await context.close();
  }
}

async function register({ scenario: testScenario }) {
  // 1. Direct navigation to chapter-1.html#block-3 redirects to lesson.html?lecture=2#topic-block-3
  await testScenario('location-redirect-chapter1-hash', async ({ page, go }) => {
    await go('study/db/chapter-1.html#block-3');
    await page.locator('#topic-block-3').waitFor({ state: 'visible' });

    const url = new URL(page.url());
    assert.equal(url.pathname.endsWith('study/db/lesson.html'), true);
    assert.equal(url.searchParams.get('lecture'), '2');
    assert.equal(url.hash, '#topic-block-3');
    assert.equal(await page.locator('#topic-block-3').isVisible(), true);
  });

  await testScenario('location-redirect-chapter1-section-query', async ({ page, go }) => {
    // The old skip link was ordinal 1, and the additional topic followed block-6.
    for (const [ordinal, block] of [[2, 'block-1'], [7, 'block-6'], [8, 'block-add']]) {
      await go('study/db/chapter-1.html?section=' + ordinal);
      await page.waitForURL('**/study/db/lesson.html?lecture=2&section=' + ordinal);
      await page.waitForFunction(id => document.activeElement.id === id, 'topic-' + block);
      assert.equal(await page.locator('#topic-' + block).isVisible(), true);
    }
    await go('study/db/chapter-1.html?section=9');
    await page.waitForURL('**/study/db/lesson.html?lecture=2&section=9');
    await page.locator('#view-btn-practice[aria-pressed="true"]').waitFor();
  });

  // 3. Old quiz anchor #quiz-section redirects to practice view
  await testScenario('location-redirect-chapter1-quiz-hash', async ({ page, go }) => {
    await go('study/db/chapter-1.html#quiz-section');
    await page.locator('#practice-hub').waitFor({ state: 'visible' });

    const url = new URL(page.url());
    assert.equal(url.pathname.endsWith('study/db/lesson.html'), true);
    assert.equal(url.searchParams.get('lecture'), '2');
    assert.equal(url.searchParams.get('view'), 'practice');
    assert.equal(await page.locator('#practice-hub').isVisible(), true);
    assert.equal(await page.locator('#view-btn-practice').getAttribute('aria-pressed'), 'true');
  });

  // 4. Chapter 2 redirects to lecture 3
  await testScenario('location-redirect-chapter2-hash', async ({ page, go }) => {
    await go('study/db/chapter-2.html#block-4');
    await page.locator('#topic-block-4').waitFor({ state: 'visible' });

    const url = new URL(page.url());
    assert.equal(url.pathname.endsWith('study/db/lesson.html'), true);
    assert.equal(url.searchParams.get('lecture'), '3');
    assert.equal(url.hash, '#topic-block-4');
    assert.equal(await page.locator('#topic-block-4').isVisible(), true);
  });

  // 5. Offline file:// protocol fallback does not redirect
  await testScenario('location-offline-file-protocol-fallback', async ({ page }) => {
    const filePath = require('node:url').pathToFileURL(path.join(root, 'study/db/chapter-1.html')).href;
    await page.goto(filePath);

    // Verifies it stayed on chapter-1.html under file://
    assert.equal(page.url().startsWith('file:'), true);
    assert.equal(page.url().includes('chapter-1.html'), true);
    assert.equal(page.url().includes('lesson.html'), false, 'Must not redirect under file://');
  });

  // 6. Bidirectional flow: Topic -> contextual slide -> zoom image -> practice -> return
  await testScenario('location-bidirectional-flow-preservation', async ({ page, go }) => {
    await go('study/db/lesson.html?lecture=2#topic-block-2');
    await page.locator('#topic-block-2').waitFor({ state: 'visible' });

    // Click contextual slide button in block 2
    const slideBtn = page.locator('#topic-block-2 [data-jump-slide]').first();
    const slideNum = await slideBtn.getAttribute('data-jump-slide');
    await slideBtn.click();

    // Verify slide detail view is active
    await page.locator('#slide-detail-view').waitFor({ state: 'visible' });
    assert.equal(await page.locator(`#slide-card-${slideNum}`).isVisible(), true);

    // Zoom image
    const zoomBtn = page.locator(`#slide-card-${slideNum} [data-zoom-btn]`);
    if (await zoomBtn.count() > 0) {
      await zoomBtn.click();
      await page.locator('#slide-zoom-modal').waitFor({ state: 'visible' });
      await page.keyboard.press('Escape');
      await page.locator('#slide-zoom-modal').waitFor({ state: 'hidden' });
    }

    // Switch to practice view
    await page.locator('#view-btn-practice').click();
    await page.locator('#practice-hub').waitFor({ state: 'visible' });

    // Return to topic view
    await page.locator('#view-btn-topics').click();
    await page.locator('#topic-reading-view').waitFor({ state: 'visible' });

    // Verify topic blocks are readable and active
    assert.equal(await page.locator('.topic-block-wrapper').first().isVisible(), true);
  });

  // 7. Saved state resume from Studio Continue
  await testScenario('location-saved-state-resume-roundtrip', async ({ page, go }) => {
    const contentKey = JSON.stringify(['database-systems', 'lecture', '2']);
    const ts = new Date().toISOString();

    await page.addInitScript(({ k, t }) => {
      localStorage.setItem('sem2_study_v1:meta', JSON.stringify({
        schemaVersion: 1,
        lastUsed: { key: k, actionId: 'standalone-study', updatedAt: t }
      }));
      localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(k) + ':reader', JSON.stringify({
        slideId: 3,
        tab: 'explanation',
        updatedAt: t
      }));
      localStorage.setItem('sem2_standalone_v1:' + encodeURIComponent(k), JSON.stringify({
        version: 1,
        anchor: 'topic-block-3',
        updatedAt: t,
        checks: []
      }));
    }, { k: contentKey, t: ts });

    await go('index.html');
    await page.locator('#studio-resume').waitFor({ state: 'visible' });

    const resumeLink = page.locator('#studio-resume a.studio-resume-link');
    const href = await resumeLink.getAttribute('href');
    assert.ok(href.includes('chapter-1.html'), 'Resume link preserves standalone chapter URL');
    assert.ok(href.includes('topic-block-3'), 'Resume link contains preserved anchor');

    await resumeLink.click();
    await page.locator('#topic-block-3').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#topic-block-3').isVisible(), true);
    assert.ok(page.url().includes('lesson.html?lecture=2'), 'Redirected to unified workspace');
    assert.ok(page.url().includes('topic-block-3'), 'Preserved exact topic block anchor');
  });

  // 8. Corrupt legacy state recovery: loads gracefully without throwing or mutating raw bytes
  await testScenario('location-corrupt-state-recovery-and-isolation', async ({ page, go }) => {
    const contentKey = JSON.stringify(['database-systems', 'lecture', '2']);
    const badBridgeBytes = '{"version":99,"anchor":"invalid:anchor:with:colons","corrupt":true}';

    await page.addInitScript(({ k, bytes }) => {
      localStorage.setItem('sem2_standalone_v1:' + encodeURIComponent(k), bytes);
    }, { k: contentKey, bytes: badBridgeBytes });

    await go('study/db/lesson.html?lecture=2');
    await page.locator('.topic-block-wrapper').first().waitFor({ state: 'visible' });

    // Verify workspace loaded cleanly
    assert.equal(await page.locator('#topic-block-1').isVisible(), true);

    // Verify bad bytes were not silently overwritten or corrupted
    const stored = await page.evaluate(k => localStorage.getItem('sem2_standalone_v1:' + encodeURIComponent(k)), contentKey);
    assert.equal(stored, badBridgeBytes, 'Raw corrupted bytes must be preserved untouched');
  });

  for (const [chapter, bytes] of [
    [1, '{"version":1,'],
    [2, '{"version":2,"anchor":"block-4","updatedAt":"","checks":["kept"],"future":true}']
  ]) {
    await testScenario('location-legacy-redirect-preserves-bridge-' + chapter, async ({ page, go }) => {
      const key = JSON.stringify(['database-systems', 'lecture', String(chapter + 1)]);
      const bridgeKey = 'sem2_standalone_v1:' + encodeURIComponent(key);
      await page.addInitScript(({ bridgeKey, bytes }) => {
        if (location.pathname.endsWith('/chapter-1.html') || location.pathname.endsWith('/chapter-2.html')) {
          localStorage.setItem(bridgeKey, bytes);
        }
      }, { bridgeKey, bytes });

      await go('study/db/chapter-' + chapter + '.html#block-3');
      await page.waitForFunction(() => document.activeElement.id === 'topic-block-3');
      assert.equal(await page.evaluate(key => localStorage.getItem(key), bridgeKey), bytes);
    });
  }

  for (const [anchor, tab, expectedAnchor = anchor] of [
    ['topic-block-4', 'explanation'],
    ['practice', 'quiz'],
    ['topic-block-add', 'explanation'],
    ['topic-add', 'explanation', 'topic-block-add']
  ]) {
    await testScenario('location-bare-workspace-resumes-' + anchor, async ({ page, go }) => {
      const key = JSON.stringify(['database-systems', 'lecture', '2']);
      const bridgeKey = 'sem2_standalone_v1:' + encodeURIComponent(key);
      await page.addInitScript(({ bridgeKey, key, anchor, tab }) => {
        const updatedAt = new Date().toISOString();
        localStorage.setItem(bridgeKey, JSON.stringify({ version: 1, anchor, updatedAt, checks: ['kept'] }));
        localStorage.setItem('sem2_study_v1:meta', JSON.stringify({
          schemaVersion: 1, lastUsed: { key, actionId: 'standalone-study', updatedAt }
        }));
        localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(key) + ':reader', JSON.stringify({
          slideId: 6, tab, updatedAt
        }));
      }, { bridgeKey, key, anchor, tab });

      await go('study/db/lesson.html?lecture=2');
      await page.locator('.topic-block-wrapper').first().waitFor({ state: 'attached' });
      if (tab === 'quiz') {
        await page.locator('#view-btn-practice[aria-pressed="true"]').waitFor();
      } else {
        assert.equal(await page.evaluate(() => document.activeElement.id), expectedAnchor);
      }
      const saved = await page.evaluate(({ bridgeKey, key }) => ({
        bridge: JSON.parse(localStorage.getItem(bridgeKey)),
        reader: window.PortalStudyState.getItem(key).reader
      }), { bridgeKey, key });
      assert.equal(saved.bridge.anchor, expectedAnchor);
      assert.deepEqual(saved.bridge.checks, ['kept']);
      assert.equal(saved.reader.tab, tab);
      assert.equal(saved.reader.slideId, 6);
    });
  }

  await testScenario('location-redirect-additional-topic', async ({ page, go }) => {
    await go('study/db/chapter-1.html#block-add');
    await page.waitForURL('**/study/db/lesson.html?lecture=2#topic-block-add');
    await page.waitForFunction(() => document.activeElement.id === 'topic-block-add');
  });

  await testScenario('location-bare-workspace-resumes-legacy-section-ordinal', async ({ page, go }) => {
    const key = JSON.stringify(['database-systems', 'lecture', '2']);
    const bridgeKey = 'sem2_standalone_v1:' + encodeURIComponent(key);
    await page.addInitScript(key => {
      const updatedAt = '2026-11-01T10:00:00.000Z';
      localStorage.setItem('sem2_study_v1:meta', JSON.stringify({
        schemaVersion: 1, lastUsed: { key, actionId: 'standalone-study', updatedAt }
      }));
      localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(key) + ':reader', JSON.stringify({
        slideId: 8, tab: 'explanation', updatedAt
      }));
    }, key);

    await go('study/db/lesson.html?lecture=2');
    await page.waitForFunction(() => document.activeElement.id === 'topic-block-add');
    const saved = await page.evaluate(({ bridgeKey, key }) => ({
      anchor: JSON.parse(localStorage.getItem(bridgeKey)).anchor,
      slideId: window.PortalStudyState.getItem(key).reader.slideId
    }), { bridgeKey, key });
    assert.deepEqual(saved, { anchor: 'topic-block-add', slideId: 0 });
  });

  await testScenario('location-bare-workspace-keeps-slide-with-protected-bridge', async ({ page, go }) => {
    const key = JSON.stringify(['database-systems', 'lecture', '2']);
    const bridgeKey = 'sem2_standalone_v1:' + encodeURIComponent(key);
    const bytes = '{"version":2,"anchor":"future-slide","checks":["keep"]}';
    await page.addInitScript(({ key, bridgeKey, bytes }) => {
      if (localStorage.getItem(bridgeKey) !== null) return;
      const updatedAt = '2026-11-01T10:00:00.000Z';
      localStorage.setItem(bridgeKey, bytes);
      localStorage.setItem('sem2_study_v1:meta', JSON.stringify({
        schemaVersion: 1, lastUsed: { key, actionId: 'internal-study', updatedAt }
      }));
      localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(key) + ':reader', JSON.stringify({
        slideId: 4, tab: 'explanation', updatedAt
      }));
    }, { key, bridgeKey, bytes });

    await go('study/db/lesson.html?lecture=2');
    await page.locator('#slide-card-4').waitFor();
    await page.reload();
    await page.locator('#slide-card-4').waitFor();
    assert.equal(await page.evaluate(key => localStorage.getItem(key), bridgeKey), bytes);
  });

  for (const tab of ['original', 'quiz']) {
    await testScenario('location-subject-standalone-action-preserves-' + tab, async ({ page, go }) => {
      const key = JSON.stringify(['database-systems', 'lecture', '2']);
      const params = new URLSearchParams({ id: 'database-systems', item: key, action: 'standalone-study', slide: '4', tab });
      await go('subject.html?' + params);
      if (tab === 'quiz') {
        await page.waitForURL('**/study/db/lesson.html?lecture=2&view=practice');
        await page.locator('#view-btn-practice[aria-pressed="true"]').waitFor();
      } else {
        await page.waitForURL('**/study/db/lesson.html?lecture=2&slide=4&tab=original');
        await page.locator('#slide-card-4 img').waitFor({ state: 'visible' });
        const reader = await page.evaluate(key => window.PortalStudyState.getItem(key).reader, key);
        assert.equal(reader.slideId, 4);
        assert.equal(reader.tab, 'original');

        // Let the workspace finish its initial scroll before recording user navigation.
        await page.clock.fastForward(300);
        await page.locator('#view-btn-topics').click();
        await page.waitForURL('**/study/db/lesson.html?lecture=2#topic-block-1');
        await page.reload();
        await page.waitForFunction(() => document.activeElement.id === 'topic-block-1');
      }
    });
  }

  for (const useFile of [false, true]) {
    await testScenario('location-fresh-standalone-saves-topic-' + (useFile ? 'file' : 'raw'), async ({ page, go }) => {
      const key = JSON.stringify(['database-systems', 'lecture', '2']);
      const bridgeKey = 'sem2_standalone_v1:' + encodeURIComponent(key);
      if (useFile) {
        const url = require('node:url').pathToFileURL(path.join(root, 'study/db/chapter-1.html'));
        url.hash = 'block-add';
        await page.goto(url.href);
      } else {
        await go('study/db/chapter-1.html?raw=1#block-add');
      }
      await page.waitForFunction(({ bridgeKey }) =>
        JSON.parse(localStorage.getItem(bridgeKey))?.anchor?.endsWith('block-add'), { bridgeKey });
      assert.match(page.url(), /chapter-1\.html/);
      assert.equal(await page.locator('#study-session-warning').count(), 0);
      const saved = await page.evaluate(key => ({
        item: window.PortalStudyState.getItem(key),
        lastUsed: window.PortalStudyState.getSnapshot().lastUsed
      }), key);
      assert.equal(saved.item.reader.slideId, 0);
      assert.equal(saved.lastUsed.actionId, 'standalone-study');
    });
  }
}

async function runStandalone() {
  server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname).replace(/^\/Sem2_portal\//, '/');
    const target = path.resolve(root, '.' + relative + (relative.endsWith('/') ? 'index.html' : ''));
    if (!target.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(target, (err, bytes) => {
      if (err) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.setHeader('Content-Type', ({
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css',
        '.png': 'image/png',
        '.pdf': 'application/pdf',
        '.svg': 'image/svg+xml'
      })[path.extname(target)] || 'application/octet-stream');
      res.end(bytes);
    });
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/Sem2_portal/`;
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PORTAL_BROWSER_CHANNEL ? { channel: process.env.PORTAL_BROWSER_CHANNEL } : {})
  });

  try {
    await register({ scenario });
  } finally {
    await browser.close();
    server.close();
  }

  const failed = results.filter(r => !r.passed);
  console.log(`\n${results.length - failed.length}/${results.length} lesson location browser scenarios passed`);
  if (failed.length > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runStandalone().catch(err => {
    console.error(err);
    if (browser) browser.close().catch(() => {});
    if (server) server.close();
    process.exit(1);
  });
}

module.exports = { register };
