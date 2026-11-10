const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const { auditActionContrast } = require('./control-contrast.cjs');

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
  page.on('response', res => {
    if (res.status() >= 400) {
      console.log('404/ERR RESPONSE:', res.status(), res.url());
    }
  });
  const go = async route => {
    await page.goto(base + route, { waitUntil: 'load' });
  };

  try {
    await fn({ page, context, go, errors });
    results.push({ name, passed: true });
    console.log('PASS', name);
  } catch (e) {
    results.push({ name, passed: false, error: e.stack, errors });
    await page.screenshot({ path: path.join(output, 'ds-bank-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.message.slice(0, 180));
  } finally {
    await context.close();
  }
}

async function register({ scenario: testScenario }) {
  // Scenario 1: Content manifest and all 97 question records preservation
  await testScenario('ds-bank-content-and-manifest-preservation', async ({ page, go, errors }) => {
    await go('study/ds/question-bank.html');
    assert.equal(errors.length, 0, 'No console/runtime errors on initial load: ' + errors.join('; '));

    const dataCheck = await page.evaluate(() => {
      const data = window.DS_QUESTION_BANK_DATA;
      if (!Array.isArray(data)) return { valid: false, reason: 'DS_QUESTION_BANK_DATA missing or not array' };
      if (data.length !== 97) return { valid: false, count: data.length, reason: 'Count is not 97' };

      const ids = new Set();
      const types = new Set();
      const sources = new Set();
      const lectures = new Set();

      for (const q of data) {
        if (!q.id || ids.has(q.id)) return { valid: false, reason: 'Duplicate or empty ID: ' + q.id };
        ids.add(q.id);
        types.add(q.type);
        sources.add(q.source);
        lectures.add(q.lecture);
        if (!q.questionEn || !q.correctAnswerEn || !q.title || !q.explanationAr) {
          return { valid: false, reason: 'Missing prompt/answer/title/explanation in ' + q.id };
        }
      }

      const cards = document.querySelectorAll('.question-card');
      const totalCount = document.getElementById('statTotal')?.textContent?.trim();
      const displayedCount = document.getElementById('displayedCount')?.textContent?.trim();

      return {
        valid: true,
        count: data.length,
        types: [...types],
        sources: [...sources],
        lectures: [...lectures],
        cardCount: cards.length,
        totalCount,
        displayedCount
      };
    });

    assert.equal(dataCheck.valid, true, dataCheck.reason || 'Data check failed');
    assert.equal(dataCheck.count, 97, 'Bank contains exactly 97 records');
    assert.equal(dataCheck.cardCount, 97, 'All 97 question cards rendered initially');
    assert.equal(dataCheck.totalCount, '97', 'Total count stat shows 97');
    assert.equal(dataCheck.displayedCount, '97', 'Displayed count shows 97');

    const templateCard = page.locator('#card-L1-FIN25-Q1-2');
    assert.match(await templateCard.locator('.question-body-en').textContent(), /template <typename T>/);
    assert.match(await templateCard.locator('.solution-en-content').textContent(), /Box<double>/);

    const expectedTypes = ['fill', 'compare', 'coding', 'mcq', 'math'];
    for (const t of expectedTypes) {
      assert.ok(dataCheck.types.includes(t), `Type '${t}' preserved in bank`);
    }
  });

  // Scenario 2: Theme and portal shell integration
  await testScenario('ds-bank-theme-and-shell-synchronization', async ({ page, go }) => {
    await go('study/ds/question-bank.html');

    const shellCheck = await page.evaluate(() => {
      const hasShellAttr = document.documentElement.hasAttribute('data-study-shell');
      const portalBar = document.querySelector('.study-portal-bar');
      const skipLink = document.querySelector('.study-shell-skip');
      const themeSelect = document.getElementById('study-shell-theme');
      return {
        hasShellAttr,
        hasPortalBar: !!portalBar,
        hasSkipLink: !!skipLink,
        hasThemeSelect: !!themeSelect
      };
    });

    assert.equal(shellCheck.hasShellAttr, true, 'Document root has data-study-shell');
    assert.equal(shellCheck.hasPortalBar, true, 'Shared study portal bar present');
    assert.equal(shellCheck.hasSkipLink, true, 'Skip link present for accessibility');

    // Test theme change to dark
    await page.evaluate(() => {
      if (window.PortalTheme && window.PortalTheme.setTheme) {
        window.PortalTheme.setTheme('dark');
      }
    });

    let themeState = await page.evaluate(() => {
      return {
        rootTheme: document.documentElement.getAttribute('data-theme'),
        bodyClass: document.body.className,
        bgMain: getComputedStyle(document.body).backgroundColor
      };
    });
    assert.equal(themeState.rootTheme, 'dark', 'Root data-theme is dark');

    // Test theme change to reading (sepia)
    await page.evaluate(() => {
      if (window.PortalTheme && window.PortalTheme.setTheme) {
        window.PortalTheme.setTheme('reading');
      }
    });

    themeState = await page.evaluate(() => {
      return {
        rootTheme: document.documentElement.getAttribute('data-theme'),
        bodyClass: document.body.className
      };
    });
    assert.equal(themeState.rootTheme, 'reading', 'Root data-theme is reading');

    // Switch back to light
    await page.evaluate(() => {
      if (window.PortalTheme && window.PortalTheme.setTheme) {
        window.PortalTheme.setTheme('light');
      }
    });
  });

  // Scenario 3: Filters (lecture, source, type, empty state)
  await testScenario('ds-bank-filters-and-empty-state', async ({ page, go }) => {
    await go('study/ds/question-bank.html');

    // Filter by Lecture 1
    await page.click('[data-lec="lec1"]');
    let count = await page.evaluate(() => document.querySelectorAll('.question-card').length);
    const lec1Count = await page.evaluate(() => window.DS_QUESTION_BANK_DATA.filter(q => q.lecture === 'lec1').length);
    assert.equal(count, lec1Count, 'Cards count matches lecture 1 questions count');

    // Filter by Type: fill
    await page.click('[data-type="fill"]');
    count = await page.evaluate(() => document.querySelectorAll('.question-card').length);
    const lec1FillCount = await page.evaluate(() => window.DS_QUESTION_BANK_DATA.filter(q => q.lecture === 'lec1' && q.type === 'fill').length);
    assert.equal(count, lec1FillCount, 'Cards count matches lecture 1 + fill type');

    // Filter by Source: mid2024
    await page.click('[data-source="mid2024"]');
    count = await page.evaluate(() => document.querySelectorAll('.question-card').length);
    const combinedCount = await page.evaluate(() => window.DS_QUESTION_BANK_DATA.filter(q => q.lecture === 'lec1' && q.type === 'fill' && q.source === 'mid2024').length);
    assert.equal(count, combinedCount, 'Cards count matches combined lecture1 + fill + mid2024');

    // Reset filters
    await page.click('[data-lec="all"]');
    await page.click('[data-type="all"]');
    await page.click('[data-source="all"]');
    count = await page.evaluate(() => document.querySelectorAll('.question-card').length);
    assert.equal(count, 97, 'Resetting filters shows all 97 cards again');

    // Trigger empty state with an impossible combination
    await page.click('[data-source="slides"]');
    await page.click('[data-type="mcq"]');
    await page.click('[data-lec="lec3"]');
    const emptyCheck = await page.evaluate(() => {
      const cards = document.querySelectorAll('.question-card');
      const emptyEl = document.querySelector('.empty-state');
      return {
        cardCount: cards.length,
        hasEmptyState: !!emptyEl && emptyEl.offsetParent !== null
      };
    });
    assert.equal(emptyCheck.cardCount, 0, 'No cards match the selected filters');
    assert.equal(emptyCheck.hasEmptyState, true, 'Empty state rendered when no cards match');
  });

  // Scenario 4: Live search across questions and explanations
  await testScenario('ds-bank-search-query', async ({ page, go }) => {
    await go('study/ds/question-bank.html');

    // Type "Circular Queue"
    await page.fill('#searchInput', 'Circular Queue');
    await page.waitForTimeout(300);

    const searchResult = await page.evaluate(() => {
      const cards = document.querySelectorAll('.question-card');
      const displayed = document.getElementById('displayedCount')?.textContent?.trim();
      return {
        cardCount: cards.length,
        displayed
      };
    });

    assert.ok(searchResult.cardCount > 0, 'Found questions matching "Circular Queue"');
    assert.equal(String(searchResult.cardCount), searchResult.displayed, 'Displayed count matches visible cards count');

    // Clear search
    await page.fill('#searchInput', '');
    await page.waitForTimeout(300);
    const resetCount = await page.evaluate(() => document.querySelectorAll('.question-card').length);
    assert.equal(resetCount, 97, 'Clearing search restores 97 cards');
  });

  // Scenario 5: Bookmarks with scoped PortalStorage and legacy compatibility
  await testScenario('ds-bank-bookmarks-storage', async ({ page, go }) => {
    // Seed legacy bookmark to verify compatibility
    await page.addInitScript(() => {
      try {
        localStorage.setItem('ds_bookmarks', JSON.stringify(['L1-MID24-Q1-1']));
      } catch (_) {}
    });

    await go('study/ds/question-bank.html');

    const bookmarkState = await page.evaluate(() => {
      const q1Card = document.getElementById('card-L1-MID24-Q1-1');
      const btn = q1Card?.querySelector('.bookmark-btn');
      const isBookmarked = btn?.classList.contains('bookmarked');
      const statBookmarks = document.getElementById('statBookmarks')?.textContent?.trim();
      return {
        isBookmarked,
        statBookmarks
      };
    });

    assert.equal(bookmarkState.isBookmarked, true, 'Legacy bookmark L1-MID24-Q1-1 loaded successfully');
    assert.equal(bookmarkState.statBookmarks, '1', 'Stats pill reflects 1 bookmarked item');

    // Add a second bookmark
    await page.evaluate(() => {
      const q2Card = document.getElementById('card-L1-MID24-Q1-2');
      const btn = q2Card?.querySelector('.bookmark-btn');
      if (btn) btn.click();
    });

    const updatedStat = await page.evaluate(() => {
      return document.getElementById('statBookmarks')?.textContent?.trim();
    });
    assert.equal(updatedStat, '2', 'Stats pill updated to 2 bookmarks');

    // Filter by bookmarked
    await page.click('#bookmarkFilterBtn');
    const bookmarkedCardsCount = await page.evaluate(() => document.querySelectorAll('.question-card').length);
    assert.equal(bookmarkedCardsCount, 2, 'Bookmark filter shows exactly 2 cards');
    await page.click('[data-type="mcq"]');
    assert.equal(await page.locator('#bookmarkFilterBtn').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('.question-card').count(), 0, 'Neither bookmarked question is an MCQ');
    await page.click('#bookmarkFilterBtn');
    await page.click('#card-L1-FIN25-Q1-2 .bookmark-btn');
    await page.click('#bookmarkFilterBtn');
    assert.equal(await page.locator('.question-card').count(), 1, 'Only the bookmarked MCQ matches');
    assert.equal(await page.locator('.question-card').getAttribute('id'), 'card-L1-FIN25-Q1-2');
  });

  // Scenario 6: Solution reveal, toggle all, and keyboard accessibility
  await testScenario('ds-bank-solution-reveal-and-keyboard', async ({ page, go }) => {
    await go('study/ds/question-bank.html');

    // Verify first card's solution is hidden by default
    const firstSolHidden = await page.evaluate(() => {
      const sol = document.querySelector('.solution-wrapper');
      return sol && !sol.classList.contains('show');
    });
    assert.equal(firstSolHidden, true, 'Solution is collapsed by default');

    // Click single toggle solution
    const firstToggleBtn = await page.locator('.solution-toggle-btn').first();
    await firstToggleBtn.click();

    const firstSolVisible = await page.evaluate(() => {
      const sol = document.querySelector('.solution-wrapper');
      return sol && sol.classList.contains('show');
    });
    assert.equal(firstSolVisible, true, 'Solution opened after clicking toggle');

    // Toggle All Solutions
    const toggleAllBtn = page.locator('#toggleAllSolBtn');
    await toggleAllBtn.click();

    const allVisible = await page.evaluate(() => {
      const wrappers = document.querySelectorAll('.solution-wrapper');
      return [...wrappers].every(w => w.classList.contains('show'));
    });
    assert.equal(allVisible, true, 'All solutions opened after clicking toggle all');

    await page.click('[data-type="mcq"]');
    const correctChoices = page.locator('.correct-option');
    assert.ok(await correctChoices.count() > 0, 'Revealed MCQs mark the correct choices');

    // Collapse All
    await toggleAllBtn.click();
    assert.equal(await correctChoices.count(), 0, 'Hidden MCQs do not reveal correct choices');
    await page.click('[data-type="all"]');
    const allCollapsed = await page.evaluate(() => {
      const wrappers = document.querySelectorAll('.solution-wrapper');
      return [...wrappers].every(w => !w.classList.contains('show'));
    });
    assert.equal(allCollapsed, true, 'All solutions collapsed after clicking toggle all again');

    // Keyboard accessibility: press Enter on first toggle button
    await firstToggleBtn.focus();
    await page.keyboard.press('Enter');
    const openedViaKeyboard = await page.evaluate(() => {
      const sol = document.querySelector('.solution-wrapper');
      return sol && sol.classList.contains('show');
    });
    assert.equal(openedViaKeyboard, true, 'Solution opened via keyboard Enter');
  });

  // Scenario 7: WCAG contrast, responsive viewports (320px, 390px, 1440px), LTR code blocks
  await testScenario('ds-bank-wcag-and-responsiveness', async ({ page, go }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go('study/ds/question-bank.html');

    // 1. Mobile 320px: verify no horizontal page scroll
    await page.setViewportSize({ width: 320, height: 600 });
    const overflowCheck = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        hasHorizontalOverflow: root.scrollWidth > root.clientWidth
      };
    });
    assert.equal(overflowCheck.hasHorizontalOverflow, false, 'No horizontal page overflow at 320px');

    // 2. Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    const mobileFits = await page.evaluate(() => {
      return document.body.clientWidth <= 390;
    });
    assert.equal(mobileFits, true, 'Mobile viewport fits at 390px');

    // 3. Desktop 1440px
    await page.setViewportSize({ width: 1440, height: 900 });
    const desktopFits = await page.evaluate(() => {
      const container = document.querySelector('.questions-container');
      return container && container.clientWidth <= 1440;
    });
    assert.equal(desktopFits, true, 'Questions container bounded on desktop');

    // 4. LTR code & formulas directionality check
    const codeDirCheck = await page.evaluate(() => {
      const codeBlocks = document.querySelectorAll('pre, code, .solution-en-box');
      if (codeBlocks.length === 0) return false;
      return [...codeBlocks].every(el => {
        const dir = getComputedStyle(el).direction;
        return dir === 'ltr';
      });
    });
    assert.equal(codeDirCheck, true, 'Code and English solution boxes have direction: ltr');

    // 5. Visible focus indicators
    const focusCheck = await page.evaluate(() => {
      const btn = document.querySelector('.tab-btn');
      btn.focus();
      const style = getComputedStyle(btn);
      return style.outlineStyle !== 'none' || style.boxShadow !== 'none';
    });
    assert.ok(focusCheck, 'Focus indicator active on interactive control');

    // 6. Capture light, dark, and reading screenshots at mobile (390px) and desktop (1440px) widths
    const modes = ['light', 'dark', 'reading'];
    for (const mode of modes) {
      await page.evaluate((m) => {
        if (window.PortalTheme && window.PortalTheme.setTheme) {
          window.PortalTheme.setTheme(m);
        }
      }, mode);

      assert.deepEqual(await page.evaluate(auditActionContrast, '#lectureTabs .tab-btn.active'), [],
        `Active lecture label and count meet WCAG AA in ${mode} mode`);

      // Desktop screenshot (1440px)
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.waitForTimeout(100);
      await page.screenshot({ path: path.join(output, `ds-bank-${mode}-desktop.png`), fullPage: false });

      // Mobile screenshot (390px)
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(100);
      await page.screenshot({ path: path.join(output, `ds-bank-${mode}-mobile.png`), fullPage: false });
    }
  });

  await testScenario('ds-bank-reduced-motion-back-to-top', async ({ page, go }) => {
    await go('study/ds/question-bank.html');
    const button = page.locator('#backToTopBtn');
    for (const [preference, expected] of [['reduce', 'instant'], ['no-preference', 'smooth']]) {
      await page.emulateMedia({ reducedMotion: preference });
      await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
      await button.waitFor({ state: 'visible' });
      const behavior = await button.evaluate(el => {
        const originalScrollTo = window.scrollTo;
        let requested;
        window.scrollTo = options => { requested = options.behavior; };
        try {
          el.click();
          return requested;
        } finally {
          window.scrollTo = originalScrollTo;
        }
      });
      assert.equal(behavior, expected);
    }
  });
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
  console.log(`\n${results.length - failed.length}/${results.length} DS Question Bank scenarios passed`);
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
