const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const playwright = require('playwright');

const root = path.resolve(__dirname, '..');
const output = path.resolve(process.env.PORTAL_TEST_OUTPUT || path.join(root, 'test-results'));
fs.mkdirSync(output, { recursive: true });

const filter = new RegExp(process.env.PORTAL_STUDY_FILTER || '.*');
const engineName = (process.env.PORTAL_STUDY_ENGINE || 'chromium').toLowerCase();
const engine = playwright[engineName] || playwright.chromium;

const results = [];
let browser, server, base;

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
  page.setDefaultTimeout(6000);
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
    await page.screenshot({ path: path.join(output, 'study-' + name + '.png') }).catch(() => {});
    console.log('FAIL', name, e.message.slice(0, 180));
  } finally {
    await context.close();
  }
}

async function main() {
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
        '.pdf': 'application/pdf'
      })[path.extname(target)] || 'application/octet-stream');
      res.end(bytes);
    });
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/Sem2_portal/`;
  browser = await engine.launch({
    headless: true,
    ...(process.env.PORTAL_BROWSER_CHANNEL ? { channel: process.env.PORTAL_BROWSER_CHANNEL } : {})
  });

  const featuresDir = path.join(__dirname, 'study-features');
  if (fs.existsSync(featuresDir)) {
    const files = fs.readdirSync(featuresDir).filter(f => f.endsWith('.cjs')).sort();
    for (const file of files) {
      const featureModule = require(path.join(featuresDir, file));
      if (typeof featureModule.register === 'function') {
        await featureModule.register({ scenario });
      }
    }
  }

  await browser.close();
  server.close();

  const failed = results.filter(r => !r.passed);
  console.log(`${results.length - failed.length}/${results.length} study feature scenarios passed`);
  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  if (browser) browser.close().catch(() => {});
  if (server) server.close();
  process.exit(1);
});
