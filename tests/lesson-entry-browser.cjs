const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const results = [];

function createStaticServer(serveRoot = root) {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname).replace(/^\/Sem2_portal\//, '/');
    const cleanRel = relative === '/' ? '/index.html' : relative;
    const candidate = path.resolve(serveRoot, '.' + cleanRel + (cleanRel.endsWith('/') ? 'index.html' : ''));
    if (!candidate.startsWith(serveRoot + path.sep) && candidate !== serveRoot) {
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(candidate, (err, bytes) => {
      if (err) {
        res.writeHead(404);
        res.end();
        return;
      }
      const ext = path.extname(candidate).toLowerCase();
      res.setHeader('Content-Type', ({
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.json': 'application/json; charset=utf-8',
        '.woff2': 'font/woff2'
      })[ext] || 'application/octet-stream');
      res.end(bytes);
    });
  });
}

async function runScenario(name, browser, baseUrl, fn, options = {}) {
  const context = await browser.newContext({
    viewport: options.viewport || { width: 1280, height: 860 },
    reducedMotion: 'reduce'
  });
  await context.route('https://**', route => route.abort());
  await context.addInitScript(() => {
    if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
      localStorage.setItem('sem2_first_visit_configured', 'true');
      window.sessionStorage.setItem('sem2-studio-rift-intro-v3', 'seen');
    }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      if (!txt.includes('ERR_FAILED') && !txt.includes('net::ERR_BLOCKED_BY_CLIENT')) errors.push(txt);
    }
  });

  const go = async (route, waitUntil = 'load') => {
    const url = /^https?:|^file:/i.test(route) ? route : baseUrl + route;
    await page.goto(url, { waitUntil });
  };

  try {
    await fn({ page, context, go, errors, baseUrl });
    assert.deepEqual(errors, [], `Unexpected runtime errors in ${name}: ${errors.join(' | ')}`);
    results.push({ name, passed: true });
    console.log('PASS', name);
  } catch (err) {
    results.push({ name, passed: false, error: err.stack });
    console.log('FAIL', name, err.message);
  } finally {
    await context.close();
  }
}

async function main() {
  const server = createStaticServer(root);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const rootBase = `http://127.0.0.1:${server.address().port}/`;
  const pagesBase = `http://127.0.0.1:${server.address().port}/Sem2_portal/`;

  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PORTAL_BROWSER_CHANNEL ? { channel: process.env.PORTAL_BROWSER_CHANNEL } : {})
  });

  try {
    await runScenario('slice1-library-search-db-unified-entry', browser, pagesBase, async ({ page, go }) => {
      await go('index.html#library');
      await page.locator('#library-results .studio-library-row').first().waitFor({ state: 'visible' });

      const db2Href = await page.locator('#library-results a[href*="lecture=2"]').first().getAttribute('href').catch(() => null);
      const db3Href = await page.locator('#library-results a[href*="lecture=3"]').first().getAttribute('href').catch(() => null);
      assert.equal(db2Href, 'study/db/lesson.html?lecture=2', 'Library must link DB L2 directly to lesson.html?lecture=2');
      assert.equal(db3Href, 'study/db/lesson.html?lecture=3', 'Library must link DB L3 directly to lesson.html?lecture=3');
      assert.equal(await page.locator('#library-results a[href*="study/db/chapter-1.html"], #library-results a[href*="study/db/chapter-2.html"]').count(), 0);

      await page.locator('#library-course').selectOption('all');
      await page.locator('#library-kind').selectOption('all');
      await page.locator('#library-query').fill('Databases and Database Users');
      await page.waitForTimeout(200);
      const searchLinks = await page.locator('#library-results a').evaluateAll(els => els.map(e => e.getAttribute('href')));
      assert.ok(searchLinks.includes('study/db/lesson.html?lecture=2'),
        'Search results must link DB L2 directly to lesson.html?lecture=2');
      assert.equal(searchLinks.some(h => h && (h.includes('study/db/chapter-1.html') || h.includes('study/db/chapter-2.html'))), false);

      // Root / parity for Library DB unified entries
      await go(rootBase + 'index.html#library');
      await page.locator('#library-results a[href="study/db/lesson.html?lecture=2"]').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#library-results a[href="study/db/lesson.html?lecture=3"]').count(), 1);
    });

    await runScenario('slice1-continue-resume-and-legacy-upgrade-db-entry', browser, pagesBase, async ({ page, go }) => {
      // 1. Slide switch after workspace boot settle persists canonical continue target directly to lesson.html?lecture=2&slide=5
      await go('study/db/lesson.html?lecture=2');
      await page.locator('#view-btn-slides').waitFor({ state: 'visible' });
      await page.waitForTimeout(300);
      await page.locator('#view-btn-slides').click();
      await page.locator('#slide-card-1').waitFor({ state: 'visible' });
      await page.locator('#slide-stepper-counter').waitFor({ state: 'visible' });
      await page.waitForFunction(() => new URLSearchParams(location.search).get('slide') === '1');
      for (const expectedSlide of ['2', '3', '4', '5']) {
        await page.locator('[data-slide-nav="next"]').first().click();
        await page.waitForFunction(n => new URLSearchParams(location.search).get('slide') === n, expectedSlide);
      }

      // Root / parity for #continue and #studio-resume alongside /Sem2_portal/
      await go(rootBase + 'index.html');
      await page.locator('#studio-resume a.studio-resume-link').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#studio-resume a.studio-resume-link').getAttribute('href'), 'study/db/lesson.html?lecture=2&slide=5');

      await go('index.html');
      await page.locator('#studio-resume a.studio-resume-link').waitFor({ state: 'visible' });
      const liveHref = await page.locator('#studio-resume a.studio-resume-link').getAttribute('href');
      assert.equal(liveHref, 'study/db/lesson.html?lecture=2&slide=5');

      await page.evaluate(() => { window.location.hash = '#continue'; });
      const continueHref = await page.locator('#continue-results a.studio-library-row').first().getAttribute('href');
      assert.equal(continueHref, 'study/db/lesson.html?lecture=2&slide=5');

      // 2. Pre-existing legacy internal-study lastUsed for DB upgrades cleanly to unified workspace
      await page.evaluate(() => {
        for (const k of Object.keys(localStorage)) {
          if (k.startsWith('sem2_study_') || k.startsWith('sem2_standalone_')) localStorage.removeItem(k);
        }
        const key = '["database-systems","lecture","3"]';
        const ts = new Date(Date.now() + 5000).toISOString();
        localStorage.setItem('sem2_study_v1:meta', JSON.stringify({
          schemaVersion: 1,
          lastUsed: { key, actionId: 'internal-study', updatedAt: ts }
        }));
        localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(key) + ':reader', JSON.stringify({
          slideId: 4,
          tab: 'quiz',
          updatedAt: ts
        }));
      });
      await go('index.html');
      const upgradedHref = await page.locator('#studio-resume a.studio-resume-link').getAttribute('href');
      assert.equal(upgradedHref, 'study/db/lesson.html?lecture=3&view=practice');

      // 3. Legacy standalone-study DB state without bridge preserves section ordinal (e.g. section=4 -> topic-block-3)
      await page.evaluate(() => {
        for (const k of Object.keys(localStorage)) {
          if (k.startsWith('sem2_study_') || k.startsWith('sem2_standalone_')) localStorage.removeItem(k);
        }
        const key = '["database-systems","lecture","2"]';
        const ts = new Date(Date.now() + 6000).toISOString();
        localStorage.setItem('sem2_study_v1:meta', JSON.stringify({
          schemaVersion: 1,
          lastUsed: { key, actionId: 'standalone-study', updatedAt: ts }
        }));
        localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(key) + ':reader', JSON.stringify({
          slideId: 4,
          tab: 'explanation',
          updatedAt: ts
        }));
      });
      await go('index.html');
      const sectionResumeHref = await page.locator('#studio-resume a.studio-resume-link').getAttribute('href');
      assert.equal(sectionResumeHref, 'study/db/lesson.html?lecture=2&section=4');
      await page.locator('#studio-resume a.studio-resume-link').click();
      await page.waitForURL('**/study/db/lesson.html?lecture=2&section=4');
      await page.waitForFunction(() => document.activeElement?.id === 'topic-block-3');
      const savedAfterSectionResume = await page.evaluate(() => ({
        anchor: JSON.parse(localStorage.getItem('sem2_standalone_v1:' + encodeURIComponent('["database-systems","lecture","2"]')))?.anchor,
        reader: window.PortalStudyState.getItem('["database-systems","lecture","2"]')?.reader
      }));
      assert.equal(savedAfterSectionResume.anchor, 'topic-block-3');
      assert.equal(savedAfterSectionResume.reader?.slideId, 0);
      assert.equal(savedAfterSectionResume.reader?.tab, 'explanation');
    });

    await runScenario('slice1-session-alias-and-file-protocol-preservation', browser, rootBase, async ({ page, go }) => {
      await go('study/db/chapter-1.html?raw=1#block-add');
      await page.waitForTimeout(300);
      const rawBridge = await page.evaluate(() => localStorage.getItem('sem2_standalone_v1:' + encodeURIComponent('["database-systems","lecture","2"]')));
      assert.ok(rawBridge && JSON.parse(rawBridge).version === 1, 'chapter-1.html?raw=1 must still record standalone bridge via alias');
      const rawSnap = await page.evaluate(() => window.PortalStudyState.getSnapshot());
      assert.equal(rawSnap?.lastUsed?.key, '["database-systems","lecture","2"]');
      assert.equal(rawSnap?.lastUsed?.actionId, 'standalone-study');

      await go(pathToFileURL(path.join(root, 'study/db/chapter-2.html')).href + '#block-3');
      await page.waitForTimeout(300);
      const fileBridge = await page.evaluate(() => localStorage.getItem('sem2_standalone_v1:' + encodeURIComponent('["database-systems","lecture","3"]')));
      assert.ok(fileBridge && JSON.parse(fileBridge).version === 1, 'file:// chapter-2.html must record standalone bridge via alias');
    });

    await runScenario('slice2-single-lesson-entry-and-six-course-recognition', browser, pagesBase, async ({ page, go }) => {
      // 1. Database Systems: single unified workspace entry on L2 & L3, preserved Drive/unavailable on L4 & L5
      await go('subject.html?id=database-systems');
      await page.locator('#lectures-list .a1-source-row').first().waitFor();

      const readDbRows = () => page.evaluate(() => {
        const inspect = id => {
          const row = document.querySelector(`[data-content-key='${JSON.stringify(['database-systems', 'lecture', String(id)])}']`);
          const links = [...(row?.querySelectorAll('.a1-source-actions a, .a1-source-actions button') || [])];
          const primary = row?.querySelector('.a1-source-actions .a1-action-primary');
          return {
            exists: Boolean(row),
            modalButtons: document.querySelectorAll(`[data-open-study-lecture="${id}"]`).length,
            studyLinks: [...(row?.querySelectorAll('[data-standalone-study-link]') || [])].map(a => ({
              href: a.getAttribute('href'),
              text: a.textContent.trim(),
              actionId: a.dataset.actionId
            })),
            primaryHref: primary?.getAttribute('href') || null,
            hasExplanationClass: row?.classList.contains('atlas-has-explanation') || false,
            meta: row?.querySelector('.a1-source-meta')?.textContent.trim() || '',
            unavailableCount: row?.querySelectorAll('[data-study-unavailable]').length || 0,
            actionLabels: links.map(x => x.textContent.trim())
          };
        };
        return {
          atlasStartText: document.querySelector('[data-atlas-start]')?.textContent.trim() || null,
          l2: inspect(2),
          l3: inspect(3),
          l4: inspect(4),
          l5: inspect(5)
        };
      });

      for (const passName of ['initial', 'after-profile-rerender', 'after-family-switch']) {
        const db = await readDbRows();
        assert.equal(db.atlasStartText, 'ابدأ الشرح', passName);
        for (const [lec, expectedHref] of [[db.l2, 'study/db/lesson.html?lecture=2'], [db.l3, 'study/db/lesson.html?lecture=3']]) {
          assert.equal(lec.modalButtons, 0, `${passName} must expose zero legacy modal buttons`);
          assert.deepEqual(lec.studyLinks, [{ href: expectedHref, text: 'فتح الشرح', actionId: 'standalone-study' }], passName);
          assert.equal(lec.primaryHref, expectedHref, passName);
          assert.equal(lec.hasExplanationClass, true, passName);
          assert.ok(lec.meta.includes('شرح داخلي متاح'), passName);
          assert.equal(lec.actionLabels.filter(t => t === 'فتح الشرح').length, 1, passName);
          assert.ok(lec.actionLabels.some(t => t.includes('معاينة') || t.includes('عرض')), passName);
        }
        assert.equal(db.l4.unavailableCount, 1, passName);
        assert.equal(db.l5.unavailableCount, 1, passName);
        if (passName === 'initial') {
          await page.evaluate(() => window.StudentProfile.set('B2', 6));
          await page.waitForTimeout(100);
        } else if (passName === 'after-profile-rerender') {
          await page.locator('[data-resource-kind="sections"]').click();
          await page.locator('[data-resource-kind="lectures"]').click();
        }
      }

      // Clicking primary L2 entry navigates directly to study/db/lesson.html?lecture=2
      await page.locator(`[data-content-key='${JSON.stringify(['database-systems', 'lecture', '2'])}'] .a1-action-primary`).click();
      await page.waitForURL('**/study/db/lesson.html?lecture=2');
      await page.locator('#workspace-paper').waitFor({ state: 'visible' });

      // 2. Data Structures: L1,2,3,4,7 recognized as local study; L0,L5 unavailable with preview primary
      await go('subject.html?id=data-structure');
      await page.locator('#lectures-list .a1-source-row').first().waitFor();
      const ds = await page.evaluate(() => ({
        atlasStart: document.querySelector('[data-atlas-start]')?.textContent.trim(),
        available: [1, 2, 3, 4, 7].map(id => {
          const row = document.querySelector(`[data-content-key='${JSON.stringify(['data-structure', 'lecture', String(id)])}']`);
          return {
            id,
            hasExp: row?.classList.contains('atlas-has-explanation'),
            meta: row?.querySelector('.a1-source-meta')?.textContent,
            primaryHref: row?.querySelector('.a1-action-primary')?.getAttribute('href')
          };
        }),
        unavailable: [0, 5].map(id => {
          const row = document.querySelector(`[data-content-key='${JSON.stringify(['data-structure', 'lecture', String(id)])}']`);
          return {
            id,
            hasDisabled: Boolean(row?.querySelector('[data-study-unavailable]:disabled')),
            hasExp: row?.classList.contains('atlas-has-explanation'),
            primaryIsPreview: Boolean(row?.querySelector('.a1-action-primary[data-preview-file]'))
          };
        })
      }));
      assert.equal(ds.atlasStart, 'افتح أول مصدر');
      for (const item of ds.available) {
        assert.equal(item.hasExp, true, `DS L${item.id} atlas-has-explanation`);
        assert.ok(item.meta?.includes('شرح داخلي متاح'), `DS L${item.id} meta`);
        assert.equal(item.primaryHref, `study/ds/lecture-${item.id}.html`);
      }
      for (const item of ds.unavailable) {
        assert.equal(item.hasDisabled, true, `DS L${item.id} disabled`);
        assert.equal(item.hasExp, false);
        assert.equal(item.primaryIsPreview, true);
      }

      // 3. Computer Graphics: Ch1..3 local lessons + ابدأ الشرح; Ch4..5 unavailable
      await go('subject.html?id=computer-graphics');
      await page.locator('#lectures-list .a1-source-row').first().waitFor();
      const cg = await page.evaluate(() => ({
        atlasStart: document.querySelector('[data-atlas-start]')?.textContent.trim(),
        available: [1, 2, 3].map(id => {
          const row = document.querySelector(`[data-content-key='${JSON.stringify(['computer-graphics', 'lecture', String(id)])}']`);
          return {
            id,
            hasExp: row?.classList.contains('atlas-has-explanation'),
            meta: row?.querySelector('.a1-source-meta')?.textContent || '',
            primaryHref: row?.querySelector('.a1-action-primary')?.getAttribute('href')
          };
        }),
        unavailable: [4, 5].map(id => {
          const row = document.querySelector(`[data-content-key='${JSON.stringify(['computer-graphics', 'lecture', String(id)])}']`);
          return Boolean(row?.querySelector('[data-study-unavailable]:disabled'));
        })
      }));
      assert.equal(cg.atlasStart, 'ابدأ الشرح');
      for (const ch of cg.available) {
        assert.equal(ch.hasExp, true, `CG Ch${ch.id} atlas-has-explanation`);
        assert.ok(ch.meta.includes('شرح داخلي متاح'), `CG Ch${ch.id} meta`);
        assert.equal(ch.primaryHref, `study/cg/chapter-${ch.id}.html`);
      }
      assert.deepEqual(cg.unavailable, [true, true]);

      // 4. Computer Architecture: L1..4 keep external site (not marked internal), L5 local chapter-7
      await go('subject.html?id=computer-architecture');
      await page.locator('#lectures-list .a1-source-row').first().waitFor();
      const arch = await page.evaluate(() => ({
        atlasStart: document.querySelector('[data-atlas-start]')?.textContent.trim(),
        externalRows: [1, 2, 3, 4].map(id => {
          const row = document.querySelector(`[data-content-key='${JSON.stringify(['computer-architecture', 'lecture', String(id)])}']`);
          return {
            id,
            meta: row?.querySelector('.a1-source-meta')?.textContent || '',
            hasExp: row?.classList.contains('atlas-has-explanation'),
            href: row?.querySelector('[data-standalone-study-link]')?.getAttribute('href')
          };
        }),
        l5Href: document.querySelector(`[data-content-key='${JSON.stringify(['computer-architecture', 'lecture', '5'])}'] .a1-action-primary`)?.getAttribute('href'),
        l5Exp: document.querySelector(`[data-content-key='${JSON.stringify(['computer-architecture', 'lecture', '5'])}']`)?.classList.contains('atlas-has-explanation')
      }));
      assert.equal(arch.atlasStart, 'افتح أول مصدر');
      for (const row of arch.externalRows) {
        assert.equal(row.hasExp, false, `Arch L${row.id} should not mark internal`);
        assert.equal(row.meta.includes('شرح داخلي متاح'), false, `Arch L${row.id} meta`);
        assert.equal(row.href, 'https://ahm-333.github.io/computer-architecture-study/');
      }
      assert.equal(arch.l5Href, 'study/arch/chapter-7.html');
      assert.equal(arch.l5Exp, true);

      // Verify root / prefix parity on subject.html DB course
      await go(rootBase + 'subject.html?id=database-systems');
      await page.locator('#lectures-list .a1-source-row').first().waitFor();
      assert.equal(
        await page.locator(`[data-content-key='${JSON.stringify(['database-systems', 'lecture', '2'])}'] .a1-action-primary`).getAttribute('href'),
        'study/db/lesson.html?lecture=2'
      );
    });

    await runScenario('slice3-power-tools-single-interactive-entry', browser, pagesBase, async ({ page, go }) => {
      // Database Systems Power Tools interactive hub routes cleanly to lesson.html?lecture=2 & 3 with no legacy modal reader button
      await go('subject.html?id=database-systems');
      await page.locator('[data-open-power-tool="interactive"]').waitFor({ state: 'visible' });
      await page.locator('[data-open-power-tool="interactive"]').click();
      await page.locator('#interactive-units-list').waitFor({ state: 'visible' });

      const dbHub = await page.evaluate(() => {
        const list = document.getElementById('interactive-units-list');
        const mainHref = document.getElementById('interactive-hub-main-link')?.getAttribute('href');
        const hrefs = Array.from(list?.querySelectorAll('a') || []).map(a => a.getAttribute('href'));
        const legacyReaderBtns = list?.querySelectorAll('[data-launch-internal-reader]').length || 0;
        const perCardActions = Array.from(list?.querySelectorAll('article.smart-card') || [])
          .map(card => card.querySelectorAll('a, button').length);
        return { mainHref, hrefs, legacyReaderBtns, perCardActions };
      });
      assert.equal(dbHub.mainHref, 'study/db/index.html');
      assert.equal(dbHub.legacyReaderBtns, 0, 'Power Tools DB hub must not render legacy modal trigger buttons');
      assert.deepEqual(dbHub.hrefs, ['study/db/lesson.html?lecture=2', 'study/db/lesson.html?lecture=3']);
      assert.deepEqual(dbHub.perCardActions, [1, 1], 'Each DB hub item must expose exactly one lesson entry');

      // DS, CG, Arch, OS, RW Power Tools entry contracts preserved (every hub item checked)
      for (const [courseId, expectedMain, expectedUnits] of [
        ['data-structure', 'study/ds/index.html', ['study/ds/lecture-1.html', 'study/ds/lecture-2.html', 'study/ds/lecture-3.html', 'study/ds/lecture-4.html', 'study/ds/lecture-7.html', 'study/ds/question-bank.html']],
        ['computer-graphics', 'study/cg/index.html', ['study/cg/chapter-1.html', 'study/cg/chapter-2.html', 'study/cg/chapter-3.html']],
        ['computer-architecture', 'study/arch/index.html', ['https://ahm-333.github.io/computer-architecture-study/', 'study/arch/chapter-7.html']],
        ['operating-system', 'education-preview/os/index.html', ['education-preview/os/index.html?unit=os-01', 'education-preview/os/index.html?unit=os-09', 'education-preview/os/index.html?unit=os-13']]
      ]) {
        await go(`subject.html?id=${courseId}`);
        await page.locator('[data-open-power-tool="interactive"]').click();
        await page.locator('#interactive-units-list').waitFor({ state: 'visible' });
        assert.equal(await page.locator('#interactive-hub-main-link').getAttribute('href'), expectedMain);
        for (const expectedUnit of expectedUnits) {
          assert.equal(await page.locator(`#interactive-units-list a[href="${expectedUnit}"]`).count(), 1, `${courseId} expected ${expectedUnit}`);
        }
        if (courseId === 'data-structure') {
          const tagState = await page.evaluate(() => {
            const tag = document.querySelector('#interactive-units-list .smart-card-tag.is-practice');
            return { exists: Boolean(tag), inlineStyle: tag?.getAttribute('style') || '' };
          });
          assert.equal(tagState.exists, true, 'DS practiceBank tag must use CSS class .is-practice');
          assert.equal(tagState.inlineStyle, '', 'DS practiceBank tag must not use inline low-contrast styles');
        }
      }

      await go('subject.html?id=report-writing');
      await page.locator('.course-power-bar').waitFor({ state: 'visible' });
      assert.equal(await page.locator('[data-open-power-tool="interactive"]').count(), 0);
      assert.equal(await page.locator('.course-study-entry button.is-upcoming-tool:disabled').count(), 1);
      assert.equal(await page.locator('.course-study-entry button.is-upcoming-tool').getAttribute('aria-disabled'), 'true');
    });

    await runScenario('slice4-index-pages-direct-canonical-links', browser, pagesBase, async ({ page, go }) => {
      // 1. Prefix-served DB index links directly to unified lesson workspace for Lecture 2 & Lecture 3
      await go('study/db/index.html');
      const dbLinks = await page.locator('a').evaluateAll(els => els.map(e => e.getAttribute('href')));
      assert.ok(dbLinks.includes('lesson.html?lecture=2'), 'DB index must link Chapter 1 to lesson.html?lecture=2');
      assert.ok(dbLinks.includes('lesson.html?lecture=3'), 'DB index must link Chapter 2 to lesson.html?lecture=3');
      assert.equal(dbLinks.some(h => h && (h.includes('chapter-1.html') || h.includes('chapter-2.html'))), false);

      await page.locator('a[href="lesson.html?lecture=2"]').click();
      await page.waitForURL('**/Sem2_portal/study/db/lesson.html?lecture=2');
      await page.locator('#topic-reading-view').waitFor({ state: 'visible' });

      // 2. Root-served & file:// DB index resolve relative lesson.html?lecture=2 & 3 cleanly
      await go(rootBase + 'study/db/index.html');
      const rootResolved = await page.locator('a[href^="lesson.html?lecture="]')
        .evaluateAll(els => els.map(e => new URL(e.getAttribute('href'), location.href).pathname + new URL(e.getAttribute('href'), location.href).search));
      assert.deepEqual(rootResolved, ['/study/db/lesson.html?lecture=2', '/study/db/lesson.html?lecture=3']);

      const fileDbIndex = pathToFileURL(path.join(root, 'study', 'db', 'index.html')).href;
      await go(fileDbIndex);
      const fileResolved = await page.locator('a[href^="lesson.html?lecture="]')
        .evaluateAll(els => els.map(e => new URL(e.getAttribute('href'), location.href).pathname + new URL(e.getAttribute('href'), location.href).search));
      assert.equal(fileResolved.length, 2);
      assert.ok(fileResolved[0].endsWith('/study/db/lesson.html?lecture=2'));
      assert.ok(fileResolved[1].endsWith('/study/db/lesson.html?lecture=3'));

      // 3. DS index includes L1, L2, L3, L4, L7 and question-bank.html
      await go('study/ds/index.html');
      const dsLinks = await page.locator('a').evaluateAll(els => els.map(e => e.getAttribute('href')));
      for (const expected of ['lecture-1.html', 'lecture-2.html', 'lecture-3.html', 'lecture-4.html', 'lecture-7.html', 'question-bank.html']) {
        assert.ok(dsLinks.includes(expected), `DS index missing ${expected}`);
      }
    });

    await runScenario('slice5-remaining-courses-and-preserved-actions', browser, pagesBase, async ({ page, go }) => {
      // 1. Operating System: 3 course units via data-os-course-link + uniform internal recognition + Library units & theory-resource
      await go('subject.html?id=operating-system');
      await page.locator('#lectures-list .a1-source-row').first().waitFor();
      const os = await page.evaluate(() => ({
        atlasStart: document.querySelector('[data-atlas-start]')?.textContent.trim(),
        osLinks: Array.from(document.querySelectorAll('[data-os-course-link]')).map(el => ({
          unit: el.getAttribute('href'),
          meta: el.closest('.a1-source-row')?.querySelector('.a1-source-meta')?.textContent || '',
          hasExp: el.closest('.a1-source-row')?.classList.contains('atlas-has-explanation')
        }))
      }));
      assert.equal(os.atlasStart, 'ابدأ الشرح');
      assert.deepEqual(os.osLinks.map(x => x.unit), [
        'education-preview/os/?unit=os-01',
        'education-preview/os/?unit=os-09',
        'education-preview/os/?unit=os-13'
      ]);
      for (const row of os.osLinks) {
        assert.equal(row.hasExp, true);
        assert.ok(row.meta.includes('شرح داخلي متاح'));
      }

      await go('index.html#library');
      await page.locator('#library-course').selectOption('operating-system');
      await page.locator('#library-kind').selectOption('interactive');
      assert.equal(await page.locator('#library-results .studio-library-row').count(), 19);
      await page.locator('#library-kind').selectOption('resources');
      assert.ok(await page.locator('#library-results .studio-library-row').count() >= 1);

      // 2. Report Writing: disabled unavailable buttons + preserved preview/video actions
      await go('subject.html?id=report-writing');
      await page.locator('#lectures-list .a1-source-row').first().waitFor();
      const rw = await page.evaluate(() => ({
        internalCount: document.querySelectorAll('#lectures-list .atlas-has-explanation').length,
        disabledBtns: Array.from(document.querySelectorAll('#lectures-list [data-study-unavailable]')).map(btn => ({
          disabled: btn.disabled,
          ariaDisabled: btn.getAttribute('aria-disabled'),
          text: btn.textContent.trim()
        })),
        previewCount: document.querySelectorAll('#lectures-list [data-preview-file]').length
      }));
      assert.equal(rw.internalCount, 0);
      assert.ok(rw.disabledBtns.length >= 5);
      for (const btn of rw.disabledBtns) {
        assert.equal(btn.disabled, true);
        assert.equal(btn.ariaDisabled, 'true');
        assert.equal(btn.text, 'الشرح — قريبًا');
      }
      assert.ok(rw.previewCount >= 1);

      // 3. Data Structure: Drive folder not iframe, videos/preview/download actions preserved
      await go('subject.html?id=data-structure');
      await page.locator('#lectures-list .a1-source-row').first().waitFor();
      assert.ok(await page.locator('#lectures-list [data-preview-file]').count() >= 1);
      assert.ok(await page.locator('#lectures-list a[download]').count() >= 1);
      await page.locator('[data-resource-kind="videos"]').click();
      await page.locator('#video-explanations-list [data-play-url]').first().waitFor({ state: 'visible' });
      await page.locator('[data-resource-kind="resources"]').click();
      assert.equal(await page.locator('#toggle-preview-btn').isVisible(), false);
      assert.equal(await page.locator('#exp-iframe').getAttribute('src'), '');
      assert.ok((await page.locator('#exp-main-btn').innerText()).includes('مجلد'));
    });

    await runScenario('slice5-deep-links-compatibility-and-recovery', browser, pagesBase, async ({ page, go }) => {
      // 1. Legacy ?action=internal-study on DB L2 opens reader modal ONCE and restores focus to row entry on Escape
      await page.addInitScript(() => {
        window.__readerOpenCalls = 0;
        let storedReader;
        Object.defineProperty(window, 'PortalStudyReader', {
          configurable: true,
          get() { return storedReader; },
          set(val) {
            if (val && typeof val.create === 'function') {
              const origCreate = val.create;
              val.create = function (...args) {
                const inst = origCreate.apply(this, args);
                if (inst && typeof inst.open === 'function') {
                  const origOpen = inst.open;
                  inst.open = function (...openArgs) {
                    window.__readerOpenCalls += 1;
                    return origOpen.apply(this, openArgs);
                  };
                }
                return inst;
              };
            }
            storedReader = val;
          }
        });
      });
      const db2Key = encodeURIComponent(JSON.stringify(['database-systems', 'lecture', '2']));
      await go(`subject.html?id=database-systems&item=${db2Key}&action=internal-study`);
      await page.locator('#lecture-study-modal').waitFor({ state: 'visible' });
      await page.locator('#study-slides-feed .slide-study-card').first().waitFor();
      assert.equal(await page.evaluate(() => window.__readerOpenCalls), 1, 'Deep-link modal must open exactly once');
      await page.keyboard.press('Escape');
      assert.equal(
        await page.evaluate(() => Boolean(document.activeElement && document.activeElement !== document.body && document.activeElement.closest('#lectures-list'))),
        true,
        'Escape from deep-linked modal must restore focus inside #lectures-list'
      );

      // 2. Unavailable ?action=internal-study on DB L4 -> honest alert recovery notice
      const db4Key = encodeURIComponent(JSON.stringify(['database-systems', 'lecture', '4']));
      await go(`subject.html?id=database-systems&item=${db4Key}&action=internal-study`);
      await page.locator('.portal-nav-notice[role="alert"]').waitFor({ state: 'visible' });
      assert.match(await page.locator('.portal-nav-notice[role="alert"]').innerText(), /غير متوفر|غير متاح/);

      // 3. DB non-lecture collision (section id=2) must NOT redirect to lesson.html
      const dbSec2Key = encodeURIComponent(JSON.stringify(['database-systems', 'section', '2']));
      await go(`subject.html?id=database-systems&item=${dbSec2Key}&action=standalone-study`);
      assert.equal(page.url().includes('lesson.html'), false, 'DB section id=2 must not route to lesson workspace');
      await page.locator('.portal-nav-notice[role="alert"]').waitFor({ state: 'visible' });

      // 4. Cross-course item mismatch -> honest alert recovery notice
      await go(`subject.html?id=computer-graphics&item=${db2Key}&action=standalone-study`);
      assert.equal(page.url().includes('lesson.html'), false);
      await page.locator('.portal-nav-notice[role="alert"]').waitFor({ state: 'visible' });

      // 5. Unavailable ?action=standalone-study on DS L0 -> honest alert recovery notice
      const ds0Key = encodeURIComponent(JSON.stringify(['data-structure', 'lecture', '0']));
      await go(`subject.html?id=data-structure&item=${ds0Key}&action=standalone-study`);
      await page.locator('.portal-nav-notice[role="alert"]').waitFor({ state: 'visible' });

      // 6. Missing item -> honest alert recovery notice
      const missingKey = encodeURIComponent(JSON.stringify(['data-structure', 'lecture', '999']));
      await go(`subject.html?id=data-structure&item=${missingKey}&action=standalone-study`);
      await page.locator('.portal-nav-notice[role="alert"]').waitFor({ state: 'visible' });
    });

    await runScenario('slice5-responsive-themes-and-wcag-entries', browser, pagesBase, async ({ page, go }) => {
      for (const viewport of [{ width: 1280, height: 860 }, { width: 390, height: 844 }]) {
        await page.setViewportSize(viewport);
        for (const theme of ['light', 'dark', 'reading']) {
          // DB course page
          await go('subject.html?id=database-systems');
          await page.evaluate(t => window.PortalTheme?.setTheme(t), theme);
          await page.locator('#lectures-list a[href="study/db/lesson.html?lecture=2"]').waitFor({ state: 'visible' });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true,
            `subject DB no overflow at ${viewport.width}/${theme}`);

          const dbEntry = page.locator('#lectures-list a[href="study/db/lesson.html?lecture=2"]');
          const box = await dbEntry.boundingBox();
          assert.ok(box && box.height >= 24 && box.width >= 24, `WCAG 2.5.8 target size ${JSON.stringify(box)}`);
          await dbEntry.focus();
          const hasFocusIndicator = await dbEntry.evaluate(el => {
            const s = getComputedStyle(el);
            return document.activeElement === el && (s.outlineStyle !== 'none' || s.boxShadow !== 'none');
          });
          assert.equal(hasFocusIndicator, true, `DB entry visible focus at ${viewport.width}/${theme}`);

          // Library view + DB workspace + DS index
          await go('index.html#library');
          await page.evaluate(t => window.PortalTheme?.setTheme(t), theme);
          await page.locator('#library-results .studio-library-row').first().waitFor({ state: 'visible' });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true,
            `library no overflow at ${viewport.width}/${theme}`);

          await go('study/db/index.html');
          await page.evaluate(t => window.PortalTheme?.setTheme(t), theme);
          const idxLink = page.locator('a[href="lesson.html?lecture=2"]');
          const idxBox = await idxLink.boundingBox();
          assert.ok(idxBox && idxBox.height >= 24 && idxBox.width >= 24);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true,
            `study/db/index no overflow at ${viewport.width}/${theme}`);

          await go('study/ds/index.html');
          await page.evaluate(t => window.PortalTheme?.setTheme(t), theme);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true,
            `study/ds/index no overflow at ${viewport.width}/${theme}`);

          await go('study/db/lesson.html?lecture=2');
          await page.evaluate(t => window.PortalTheme?.setTheme(t), theme);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true,
            `lesson workspace no overflow at ${viewport.width}/${theme}`);
        }
      }

      // Keyboard Enter activation on DB L2 entry navigates to unified lesson workspace
      await go('subject.html?id=database-systems');
      const enterEntry = page.locator('#lectures-list a[href="study/db/lesson.html?lecture=2"]');
      await enterEntry.focus();
      await page.keyboard.press('Enter');
      await page.waitForURL('**/study/db/lesson.html?lecture=2');
    });
  } finally {
    await browser.close();
    server.close();
  }

  const failed = results.filter(r => !r.passed);
  console.log(`\nSummary: ${results.length - failed.length}/${results.length} scenarios passed`);
  if (failed.length) process.exitCode = 1;
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
