const assert = require('node:assert/strict');

async function register({ scenario }) {
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
  });
}

module.exports = { register };
