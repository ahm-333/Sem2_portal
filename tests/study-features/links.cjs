const assert = require('node:assert/strict');

async function register({ scenario }) {
  await scenario('links-practical-resource-reveals-its-real-keyed-row', async ({page, go}) => {
    const key = '["computer-architecture","practical-resource","1"]';
    await go(`subject.html?id=computer-architecture&track=lecture&kind=resources&item=${encodeURIComponent(key)}`);
    await page.waitForFunction(k => [...document.querySelectorAll('[data-content-key]')].some(el => el.dataset.contentKey === k && el.getClientRects().length), key);
    const found = await page.evaluate(k => window.PortalContentNavigation.reveal(k).then(x => x.found), key);
    assert.equal(found, true);
  });
  await scenario('links-direct-lecture-0-reveals-row', async ({ page, go }) => {
    const key = JSON.stringify(['data-structure', 'lecture', '0']);
    await go(`subject.html?id=data-structure&track=lecture&kind=lectures&item=${encodeURIComponent(key)}`);

    const result = await page.evaluate(targetKey => {
      const activeKind = document.body.dataset.resourceKind;
      const row = document.querySelector(`[data-content-key='${targetKey}']`);
      return {
        activeKind,
        foundRow: Boolean(row),
        isFocused: Boolean(row && document.activeElement && (row === document.activeElement || row.contains(document.activeElement)))
      };
    }, key);

    assert.equal(result.activeKind, 'lectures');
    assert.equal(result.foundRow, true);
  });

  await scenario('links-direct-section-0-reveals-row', async ({ page, go }) => {
    const key = JSON.stringify(['data-structure', 'section', '0']);
    await go(`subject.html?id=data-structure&track=section&kind=sections&item=${encodeURIComponent(key)}`);

    const result = await page.evaluate(targetKey => {
      const activeKind = document.body.dataset.resourceKind;
      const row = document.querySelector(`[data-content-key='${targetKey}']`);
      return {
        activeKind,
        foundRow: Boolean(row)
      };
    }, key);

    assert.equal(result.activeKind, 'sections');
    assert.equal(result.foundRow, true);
  });

  await scenario('links-direct-assignment-reveals-row', async ({ page, go }) => {
    const key = JSON.stringify(['data-structure', 'assignment', '1']);
    await go(`subject.html?id=data-structure&track=section&kind=assignments&item=${encodeURIComponent(key)}`);

    const result = await page.evaluate(targetKey => {
      const activeKind = document.body.dataset.resourceKind;
      const row = document.querySelector(`[data-content-key='${targetKey}']`);
      return {
        activeKind,
        foundRow: Boolean(row)
      };
    }, key);

    assert.equal(result.activeKind, 'assignments');
    assert.equal(result.foundRow, true);
  });

  await scenario('links-malformed-or-unknown-key-shows-notice-without-crash', async ({ page, go }) => {
    await go('subject.html?id=data-structure&item=%5B%22unknown%22%2C%22lecture%22%2C%22999%22%5D');

    const result = await page.evaluate(() => {
      const notice = document.querySelector('.portal-nav-notice');
      return {
        hasNotice: Boolean(notice),
        noticeText: notice ? notice.textContent : ''
      };
    });

    assert.equal(result.hasNotice, true);
    assert.ok(result.noticeText.includes('المحتوى المطلوب غير متوفر'));
  });

  await scenario('links-hidden-ta-recovery-preserves-profile', async ({ page, go }) => {
    await go('subject.html?id=computer-architecture');
    // Set profile to B1/1
    await page.evaluate(() => {
      if (window.StudentProfile) {
        window.StudentProfile.set('B1', 1);
      }
    });

    // Architecture resource 1 is by م. تقى مصطفى (might not match default TA)
    const key = JSON.stringify(['computer-architecture', 'theory-resource', '1']);
    await go(`subject.html?id=computer-architecture&track=lecture&kind=resources&item=${encodeURIComponent(key)}`);

    const profileState = await page.evaluate(() => {
      const staff = window.StudentProfile ? window.StudentProfile.getCourseStaff('computer-architecture') : null;
      return {
        group: staff ? staff.group : null,
        section: staff ? staff.section : null
      };
    });

    assert.equal(profileState.group, 'B1');
    assert.equal(profileState.section, 1);
    await page.locator('.btn-reveal-hidden-ta').click();
    await page.waitForFunction(k => [...document.querySelectorAll('[data-content-key]')].some(el => el.dataset.contentKey === k && el.getClientRects().length), key);
    await page.locator('.portal-nav-notice').waitFor({state: 'detached'});
    assert.equal(await page.locator('.portal-nav-notice').count(), 0);
    assert.deepEqual(await page.evaluate(() => window.StudentProfile.get()), {group: 'B1', section: 1});
  });

  await scenario('links-hidden-ta-recovery-covers-each-filtered-source-family', async ({page, go}) => {
    await go('index.html');
    const cases = await page.evaluate(() => {
      const result = [];
      for (const type of ['section', 'assignment', 'theory-resource', 'practical-resource']) {
        for (let section = 1; section <= 12; section++) {
          const group = 'B' + Math.ceil(section / 4);
          window.StudentProfile.set(group, section);
          const entry = window.PortalCatalog.list().find(item => item.type === type && item.ta && !window.StudentProfile.isTaMatch(item.ta, window.StudentProfile.getCourseStaff(item.courseId).ta));
          if (entry) {result.push({key: entry.key, courseId: entry.courseId, type, profile: {group, section}}); break;}
        }
      }
      return result;
    });
    assert.equal(cases.length, 4, 'real data supplies a hidden-TA example for all four filtered families');
    for (const item of cases) {
      await page.evaluate(p => window.StudentProfile.set(p.group, p.section), item.profile);
      await go(`subject.html?id=${item.courseId}&item=${encodeURIComponent(item.key)}`);
      await page.locator('.btn-reveal-hidden-ta').click();
      await page.waitForFunction(k => [...document.querySelectorAll('[data-content-key]')].some(el => el.dataset.contentKey === k && el.getClientRects().length), item.key);
      await page.locator('.portal-nav-notice').waitFor({state: 'detached'});
      assert.deepEqual(await page.evaluate(() => window.StudentProfile.get()), item.profile, item.type);
    }
  });
}

module.exports = { register };
