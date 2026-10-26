const assert = require('node:assert/strict');

const lessons = ['study/ds/lecture-1.html', 'study/ds/lecture-2.html', 'study/ds/lecture-3.html', 'study/db/chapter-1.html', 'study/db/chapter-2.html'];
const entries = [...lessons,'study/arch/chapter-7.html','study/arch/index.html','study/db/index.html','study/ds/index.html','education-preview/os/index.html'];
async function register({scenario}) {
  await scenario('study-shell-mobile-reading-toolbar-fits', async ({page, go}) => {
    for (const route of lessons) {
      await go(route);
      const bounds = await page.locator('#mainReadingHeader').evaluate(el => ({width: el.clientWidth, content: el.scrollWidth, left: el.getBoundingClientRect().left}));
      assert(bounds.content <= bounds.width + 1 && bounds.left >= 0, route + ': every toolbar action stays inside the mobile viewport ' + JSON.stringify(bounds));
      for (const action of await page.locator('#mainReadingHeader a, #mainReadingHeader button').all()) {
        if (!await action.isVisible()) continue;
        const box = await action.boundingBox();
        assert(box.x >= -1 && box.x + box.width <= 391, route + ': reading action is reachable without page clipping');
      }
    }
  }, {viewport: {width:390,height:844}});
  await scenario('study-shell-shared-theme-survives-navigation-and-reload', async ({page, go}) => {
    await page.addInitScript(() => {if (!localStorage.getItem('sem2_portal_theme')) localStorage.setItem('sem2_portal_theme','dark');});
    await go('study/ds/lecture-1.html');
    assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
    assert.equal(await page.locator('#study-shell-theme').inputValue(),'dark');
    await page.locator('#btnThemeSepia').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'),'reading');
    await go('study/db/chapter-1.html');
    assert.equal(await page.locator('html').getAttribute('data-theme'),'reading');
    await page.locator('#btnThemeLight').click();
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
    assert.equal(await page.locator('#study-shell-theme').inputValue(),'light');
  });
  await scenario('study-shell-dark-actions-are-readable', async ({page,go}) => {
    const {auditActionContrast} = require('./control-contrast.cjs');
    for (const route of ['study/ds/lecture-2.html','study/arch/chapter-7.html']) {
      await go(route);
      await page.locator('#study-shell-theme').selectOption('dark');
      await page.waitForTimeout(350);
      assert.deepEqual(await page.evaluate(auditActionContrast),[],route + ': action labels remain readable on their painted surfaces');
    }
  });
  await scenario('study-shell-drawer-keyboard-contains-and-restores-focus', async ({page,go}) => {
    await go('study/ds/lecture-2.html');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => !!document.activeElement.closest('#sidebar-toc')),false,'closed contents are absent from the Tab order');
    await page.locator('#btn-open-toc').click();
    assert.equal(await page.locator('#btn-open-toc').getAttribute('aria-expanded'),'true');
    await page.waitForFunction(() => !!document.activeElement.closest('#sidebar-toc'));
    assert(await page.evaluate(() => !!document.activeElement.closest('#sidebar-toc')),'opening contents moves focus into the drawer');
    const links = page.locator('#sidebar-toc a[href]');
    await links.last().focus();
    await page.keyboard.press('Tab');
    assert(await page.evaluate(() => !!document.activeElement.closest('#sidebar-toc')),'Tab remains within open contents');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#btn-open-toc').getAttribute('aria-expanded'),'false');
    assert(await page.locator('#btn-open-toc').evaluate(el => el === document.activeElement),'Escape restores focus to contents opener');
  },{viewport:{width:390,height:844}});
  await scenario('study-shell-drawer-reduced-motion-remains-operable', async ({page,go}) => {
    await go('study/ds/lecture-2.html');
    await page.locator('#btn-open-toc').click();
    await page.waitForFunction(() => !!document.activeElement.closest('#sidebar-toc'));
    await page.keyboard.press('Escape');
    assert(await page.locator('#btn-open-toc').evaluate(el => el === document.activeElement));
  },{viewport:{width:390,height:844},reducedMotion:'reduce'});
  await scenario('study-shell-all-entrypoints-share-readable-portal-surfaces', async ({page,go}) => {
    const {auditActionContrast} = require('./control-contrast.cjs');
    const failures = [];
    for (const route of entries) {
      await go(route);
      assert.equal(await page.locator('.study-shell-brand b').innerText(),'Kernal');
      assert((await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily)).includes('Alexandria'),route + ': portal typeface');
      for (const theme of ['light','dark','reading']) {
        await page.locator('#study-shell-theme').selectOption(theme);
        const issues = await page.evaluate(auditActionContrast);
        if (issues.length) failures.push({route,theme,count:issues.length,examples:issues.slice(0,2)});
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),true,route + ': page fits the mobile reading viewport');
    }
    assert.deepEqual(failures,[],'all standalone themes have readable actions');
  },{viewport:{width:390,height:844}});
  await scenario('study-shell-quiz-feedback-and-memory-steps-stay-readable', async ({page,go}) => {
    for (const route of ['study/db/chapter-1.html','study/db/chapter-2.html']) {
      await go(route);
      await page.locator('#study-shell-theme').selectOption('dark');
      await page.locator('.quiz-opt-btn').first().click();
      const options = page.locator('.quiz-opt-btn[disabled]');
      assert.equal(await options.count(),4,'answered question retains all four readable choices');
      assert((await options.allTextContents()).some(text => text.includes('✓')),'correct-answer check is visible');
      const good = page.locator('.quiz-opt-btn[disabled][class*="bg-emerald-"]');
      assert.equal(await good.count(),1,'one correct choice keeps its positive colour');
      assert.notEqual(await good.evaluate(el => getComputedStyle(el).backgroundColor),await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor));
    }
    await go('study/ds/lecture-2.html');
    await page.locator('#study-shell-theme').selectOption('dark');
    await page.locator('#sim-next').click();
    assert((await page.locator('#sim-step-badge').innerText()).includes('2/4'));
    assert((await page.locator('#sim-display').innerText()).includes('5000'),'memory address remains visible after stepping');
  });
  await scenario('study-shell-dark-static-syllabus-text-is-readable', async ({page,go}) => {
    await go('study/arch/chapter-7.html');
    await page.locator('#study-shell-theme').selectOption('dark');
    const cards = page.locator('main [class~="bg-white/90"], main [class~="bg-white/80"]');
    assert.equal(await cards.count(),5,'four syllabus cards and their coverage notice are present');
    const issues = await cards.evaluateAll(elements => {
      const rgb = value => value.match(/[\d.]+/g).map(Number);
      const lum = value => value.slice(0,3).map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4).reduce((sum,n,i) => sum + n * [.2126,.7152,.0722][i],0);
      const failures = [];
      for (const card of elements) {
        for (const node of [card,...card.querySelectorAll('*')]) {
          if (![...node.childNodes].some(child => child.nodeType === 3 && child.textContent.trim())) continue;
          const layers = [];
          for (let ancestor = node; ancestor; ancestor = ancestor.parentElement) layers.push(rgb(getComputedStyle(ancestor).backgroundColor));
          const bg = layers.reverse().reduce((base,layer) => base.map((value,i) => value * (1 - (layer[3] ?? 1)) + layer[i] * (layer[3] ?? 1)),[255,255,255]);
          const fg = rgb(getComputedStyle(node).color);
          const ratio = (Math.max(lum(bg),lum(fg)) + .05) / (Math.min(lum(bg),lum(fg)) + .05);
          if (ratio < 4.5) failures.push({text:node.textContent.trim().slice(0,70),ratio:Number(ratio.toFixed(2))});
        }
      }
      return failures;
    });
    assert.deepEqual(issues,[],'static syllabus labels remain readable on their actual composited cards');
  });
  await scenario('study-shell-os-answer-explanation-is-readable-in-dark', async ({page,go}) => {
    await go('education-preview/os/index.html');
    await page.locator('#study-shell-theme').selectOption('dark');
    const question = page.locator('.question').first();
    await question.locator('input').first().check();
    await question.locator('button').click();
    const feedback = question.locator('.feedback');
    await feedback.waitFor({state:'visible'});
    const contrast = await feedback.evaluate(el => {
      const rgb = value => value.match(/[\d.]+/g).slice(0,3).map(Number);
      const lum = value => value.map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4).reduce((sum,n,i) => sum + n * [.2126,.7152,.0722][i],0);
      const bg = lum(rgb(getComputedStyle(el).backgroundColor)), fg = lum(rgb(getComputedStyle(el).color));
      return (Math.max(bg,fg) + .05) / (Math.min(bg,fg) + .05);
    });
    assert(contrast >= 4.5,'OS answer explanation retains readable semantic feedback, contrast ' + contrast.toFixed(2));
  });
  await scenario('study-shell-database-static-headings-and-question-stems-are-readable', async ({page,go}) => {
    await go('study/db/chapter-2.html');
    for (const theme of ['light','reading']) {
      await page.locator('#study-shell-theme').selectOption(theme);
      const headings = page.locator('.reader-card :is(h2,h3,h4).text-white');
      assert(await headings.count() > 20,'lesson headings and quiz stems remain present');
      const failures = await headings.evaluateAll(elements => {
        const rgb = value => value.match(/[\d.]+/g).map(Number);
        const lum = value => value.slice(0,3).map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4).reduce((sum,n,i) => sum + n * [.2126,.7152,.0722][i],0);
        return elements.map(el => {
          const layers = [];
          for (let node = el; node; node = node.parentElement) layers.push(rgb(getComputedStyle(node).backgroundColor));
          const bg = layers.reverse().reduce((base,layer) => base.map((value,i) => value * (1 - (layer[3] ?? 1)) + layer[i] * (layer[3] ?? 1)),[255,255,255]);
          const fg = rgb(getComputedStyle(el).color);
          return {text:el.textContent.trim().slice(0,60),ratio:(Math.max(lum(bg),lum(fg)) + .05) / (Math.min(lum(bg),lum(fg)) + .05)};
        }).filter(value => value.ratio < 4.5);
      });
      assert.equal(failures.length,0,theme + ': readable static lesson headings and question stems ' + JSON.stringify(failures.slice(0,2)));
    }
  });
}
module.exports = {register};
