const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const { auditActionContrast } = require('./control-contrast.cjs');

const root = path.resolve(__dirname, '..');
const output = path.resolve(process.env.PORTAL_TEST_OUTPUT || path.join(root, 'test-results'));
fs.mkdirSync(output, { recursive: true });

async function register({ scenario }) {
  await scenario('lesson-theme-multi-tab-storage-sync', async ({ page, context, go }) => {
    // Set initial theme to dark
    await page.addInitScript(() => {
      localStorage.setItem('sem2_portal_theme', 'dark');
    });
    await go('education-preview/os/index.html');
    const base = page.url().replace('education-preview/os/index.html', '');

    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    assert.equal(await page.evaluate(() => document.body.classList.contains('theme-dark')), true);

    // Answer a question in OS to ensure answers are preserved
    const question1 = page.locator('.question').first();
    const firstRadio = question1.locator('input[type="radio"]').first();
    await firstRadio.check();
    assert.equal(await firstRadio.isChecked(), true);

    // Open home in tab 2
    const page2 = await context.newPage();
    await page2.goto(base + 'index.html', { waitUntil: 'load' });
    assert.equal(await page2.locator('html').getAttribute('data-theme'), 'dark');

    // Change theme to light on home in tab 2
    await page2.evaluate(() => window.PortalTheme.setTheme('light'));
    assert.equal(await page2.locator('html').getAttribute('data-theme'), 'light');

    // Tab 1 (OS) must update html/body to light without reload or losing answer
    await page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'light', { timeout: 4000 });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    assert.equal(await page.evaluate(() => document.body.classList.contains('theme-light')), true);
    assert.equal(await page.evaluate(() => document.body.classList.contains('theme-dark')), false);
    assert.equal(await firstRadio.isChecked(), true, 'answer survives cross-tab theme change');

    // Change theme to reading in tab 1
    await page.evaluate(() => window.PortalTheme.setTheme('reading'));
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'reading');

    // Tab 2 (Home) must update to reading
    await page2.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'reading', { timeout: 4000 });
    assert.equal(await page2.locator('html').getAttribute('data-theme'), 'reading');

    // Change theme to dark in tab 1 using shell select
    await page.locator('#study-shell-theme').selectOption('dark');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page2.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'dark', { timeout: 4000 });
    assert.equal(await page2.locator('html').getAttribute('data-theme'), 'dark');

    await page2.close();
  });

  await scenario('lesson-theme-ignore-invalid-storage-and-prevent-write-loop', async ({ page, go }) => {
    await go('education-preview/os/index.html');
    await page.evaluate(() => window.PortalTheme.setTheme('dark'));
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');

    // Fire invalid storage event with alien key
    await page.evaluate(() => {
      window.dispatchEvent(new window.StorageEvent('storage', {
        key: 'alien_unrelated_key',
        newValue: 'light'
      }));
    });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark', 'alien key ignored');

    // Fire invalid storage event with bogus theme
    await page.evaluate(() => {
      window.dispatchEvent(new window.StorageEvent('storage', {
        key: 'sem2_portal_theme',
        newValue: 'neon-cyberpunk'
      }));
    });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark', 'bogus theme ignored');

    // Fire null / clear storage event
    await page.evaluate(() => {
      window.dispatchEvent(new window.StorageEvent('storage', {
        key: 'sem2_portal_theme',
        newValue: null
      }));
    });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark', 'null theme ignored');

    // Track setItem calls during valid storage event to guarantee no write loops
    const setItemCalls = await page.evaluate(() => {
      let writes = 0;
      const originalSetItem = window.PortalStorage.setItem;
      window.PortalStorage.setItem = function (...args) {
        writes++;
        return originalSetItem.apply(this, args);
      };
      window.dispatchEvent(new window.StorageEvent('storage', {
        key: 'sem2_portal_theme',
        newValue: 'light'
      }));
      window.PortalStorage.setItem = originalSetItem;
      return writes;
    });

    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light', 'valid theme applied');
    assert.equal(setItemCalls, 0, 'storage event handler must not call setItem (prevents write loop)');
  });

  await scenario('lesson-theme-pageshow-syncs-saved-theme', async ({ page, go }) => {
    await go('study/ds/lecture-1.html');
    await page.evaluate(() => window.PortalTheme.setTheme('dark'));
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');

    // Simulate returning via pageshow when storage was updated elsewhere
    await page.evaluate(() => {
      window.PortalStorage.setItem('sem2_portal_theme', 'reading');
      window.dispatchEvent(new window.PageTransitionEvent('pageshow', { persisted: true }));
    });

    assert.equal(await page.locator('html').getAttribute('data-theme'), 'reading');
    assert.equal(await page.locator('#study-shell-theme').inputValue(), 'reading');
  });

  await scenario('lesson-theme-contrast-regressions-db2-ds2-arch7', async ({ page, go }) => {
    const measureSelectorContrast = async (selector, fallbackSelector) => {
      return page.evaluate(({ sel, alt }) => {
        const parseRgba = str => {
          const parts = str.match(/[\d.]+/g)?.map(Number);
          return parts && parts.length >= 3 ? [parts[0], parts[1], parts[2], parts[3] ?? 1] : null;
        };
        const getBg = el => {
          const layers = [];
          for (let n = el; n; n = n.parentElement) {
            const bg = parseRgba(getComputedStyle(n).backgroundColor);
            if (bg) layers.push(bg);
          }
          return layers.reverse().reduce((surface, layer) => {
            const a = layer[3] + surface[3] * (1 - layer[3]);
            return [0, 1, 2].map(i => (layer[i] * layer[3] + surface[i] * surface[3] * (1 - layer[3])) / (a || 1)).concat(a);
          }, [255, 255, 255, 1]);
        };
        const lum = c => {
          const v = c.slice(0, 3).map(x => x / 255).map(x => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
          return v[0] * 0.2126 + v[1] * 0.7152 + v[2] * 0.0722;
        };
        const el = document.querySelector(sel) || document.querySelector(alt);
        if (!el) return 0;
        const fg = parseRgba(getComputedStyle(el).color);
        const bg = getBg(el);
        const l1 = lum(fg), l2 = lum(bg);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }, { sel: selector, alt: fallbackSelector });
    };

    // 1. DB2 Student_number in light mode
    await go('study/db/chapter-2.html');
    await page.evaluate(() => window.PortalTheme.setTheme('light'));
    const studentContrast = await measureSelectorContrast('.bg-slate-900 span.underline', '.bg-slate-900');
    assert(studentContrast >= 4.5, 'DB2 Student_number contrast in light mode must be >= 4.5:1, got ' + studentContrast.toFixed(2));

    // 2. DS2 Exam MCQs heading in dark mode
    await go('study/ds/lecture-2.html');
    await page.evaluate(() => window.PortalTheme.setTheme('dark'));
    const ds2Contrast = await measureSelectorContrast('[class*="bg-amber-50/"] h4', '.bg-amber-50 h4');
    assert(ds2Contrast >= 4.5, 'DS2 Exam MCQs heading contrast in dark mode must be >= 4.5:1, got ' + ds2Contrast.toFixed(2));

    // 3. Architecture Data Buffering in dark mode
    await go('study/arch/chapter-7.html');
    await page.evaluate(() => window.PortalTheme.setTheme('dark'));
    const archContrast = await measureSelectorContrast('[class*="bg-amber-50/"] h4', '.bg-amber-50 h4');
    assert(archContrast >= 4.5, 'Arch Data Buffering contrast in dark mode must be >= 4.5:1, got ' + archContrast.toFixed(2));
  });

  await scenario('lesson-theme-blocked-quota-honest-session-fallback', async ({ page, go }) => {
    // Deny read/write on localStorage to simulate blocked or quota-exceeded storage
    await page.addInitScript(() => {
      window.localStorage.getItem = () => { throw new Error('QuotaExceededError'); };
      window.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    });

    await go('study/db/chapter-1.html');
    // Changing theme in session must not throw
    await page.evaluate(() => window.PortalTheme.setTheme('reading'));
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'reading');
    assert.equal(await page.evaluate(() => window.PortalTheme.getTheme()), 'reading');
  });

  await scenario('lesson-theme-actions-readable-all-modes-across-portal', async ({ page, go }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sem2_first_visit_configured', 'true');
      sessionStorage.setItem('sem2-studio-rift-intro-v3', 'seen');
    });
    const pages = [
      'index.html',
      'subject.html?id=database-systems',
      'subject.html?id=data-structure',
      'subject.html?id=computer-architecture',
      'subject.html?id=operating-system',
      'education-preview/os/index.html',
      'study/db/chapter-1.html',
      'study/db/chapter-2.html',
      'study/ds/lecture-1.html',
      'study/ds/lecture-2.html',
      'study/arch/chapter-7.html'
    ];

    for (const route of pages) {
      await go(route);
      for (const theme of ['light', 'dark', 'reading']) {
        await page.evaluate(t => window.PortalTheme.setTheme(t), theme);
        await page.waitForTimeout(400);
        const issues = await page.evaluate(auditActionContrast);
        assert.deepEqual(issues, [], `${route} (${theme}) has readable actions and controls`);
      }
    }
  }, { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
}

// Standalone execution support
async function runStandalone() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname).replace(/^\/Sem2_portal\//, '/');
    const target = path.resolve(root, '.' + relative + (relative.endsWith('/') ? 'index.html' : ''));
    if (!target.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    fs.readFile(target, (err, bytes) => {
      if (err) { res.writeHead(404); res.end(); return; }
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
  const base = `http://127.0.0.1:${server.address().port}/Sem2_portal/`;

  const browser = await chromium.launch({
    headless: true,
    args: process.env.CI ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : [],
    ...(fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe') ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' } : {})
  });

  const filter = new RegExp(process.env.PORTAL_THEME_FILTER || '.*');
  const results = [];

  const scenarioRunner = async (name, fn, options = {}) => {
    if (!filter.test(name)) return;
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options });
    context._base = base;
    await context.route('https://**', route => route.abort());
    await context.addInitScript(() => {
      if (location.hostname === '127.0.0.1') {
        localStorage.setItem('sem2_first_visit_configured', 'true');
        window.sessionStorage.setItem('sem2-studio-rift-intro-v3', 'seen');
      }
    });

    const page = await context.newPage();
    page._base = base;
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
      console.log('FAIL', name, e.message.slice(0, 180));
    } finally {
      await context.close();
    }
  };

  try {
    await register({ scenario: scenarioRunner });
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  const passed = results.filter(x => x.passed).length;
  console.log(`\n${passed}/${results.length} lesson theme scenarios passed`);
  if (results.some(x => !x.passed)) process.exitCode = 1;
}

if (require.main === module) {
  runStandalone().catch(e => {
    console.error(e);
    process.exitCode = 1;
  });
}

module.exports = { register };
