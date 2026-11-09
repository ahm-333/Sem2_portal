const assert = require('node:assert/strict');

async function register({ scenario }) {
  await scenario('availability-all-six-courses-inventory-and-library', async ({ page, go }) => {
    // 1. Inventory all six courses
    const inventoryExpectations = {
      'data-structure': {
        available: [1, 2, 3],
        unavailable: [0, 4, 5]
      },
      'computer-architecture': {
        available: [1, 2, 3, 4, 5],
        unavailable: []
      },
      'database-systems': {
        available: [2, 3],
        unavailable: [4, 5]
      },
      'operating-system': {
        available: [1, 2, 3],
        unavailable: []
      },
      'computer-graphics': {
        available: [],
        unavailable: [1, 2, 3, 4, 5]
      },
      'report-writing': {
        available: [],
        unavailable: [1, 2, 3, 4, 5]
      }
    };

    for (const [courseId, exp] of Object.entries(inventoryExpectations)) {
      await go(`subject.html?id=${courseId}`);
      await page.locator('#lectures-list .a1-source-row').first().waitFor();

      const result = await page.evaluate(({ courseId: cid, exp: expected }) => {
        const rows = document.querySelectorAll('#lectures-list .a1-source-row');
        const checked = {
          totalRows: rows.length,
          availableMatches: [],
          unavailableMatches: []
        };

        expected.available.forEach(id => {
          const key = JSON.stringify([cid, 'lecture', String(id)]);
          const row = document.querySelector(`[data-content-key='${key}']`);
          if (!row) return;
          const studyAction = row.querySelector('[data-open-study-lecture], [data-os-course-link], [data-standalone-study-link], a[href*="study/"], a[href*="education-preview/"]');
          const isOperable = studyAction && !studyAction.matches(':disabled, [aria-disabled="true"]');
          checked.availableMatches.push({ id, hasStudy: Boolean(isOperable) });
        });

        expected.unavailable.forEach(id => {
          const key = JSON.stringify([cid, 'lecture', String(id)]);
          const row = document.querySelector(`[data-content-key='${key}']`);
          if (!row) return;
          const disabledBtn = row.querySelector('[data-study-unavailable], button:disabled, [aria-disabled="true"]');
          const hasDisabled = Boolean(disabledBtn && disabledBtn.textContent.includes('قريبًا'));
          checked.unavailableMatches.push({ id, hasDisabled });
        });

        return checked;
      }, { courseId, exp });

      for (const a of result.availableMatches) {
        assert.equal(a.hasStudy, true, `${courseId} Lec ${a.id} must have operable study action`);
      }
      for (const u of result.unavailableMatches) {
        assert.equal(u.hasDisabled, true, `${courseId} Lec ${u.id} must have disabled قريبًا action`);
      }
    }

    // 2. Interactive library retains exactly the 25 catalogued modules
    await go('index.html#library');
    await page.locator('#library-kind').selectOption('interactive');
    const libraryCount = await page.evaluate(() => {
      return document.querySelectorAll('#library-results .studio-library-row').length;
    });
    assert.equal(libraryCount, 25, 'Interactive library retains 25 catalogued lessons');
  });

  await scenario('availability-compaction-profile-rerender-preserves-id0-and-disabled-labels', async ({ page, go }) => {
    await go('subject.html?id=data-structure');
    await page.locator('#lectures-list .a1-source-row').first().waitFor();

    // Check ID 0 (Lecture 0) before profile change
    const beforeState = await page.evaluate(() => {
      const key0 = JSON.stringify(['data-structure', 'lecture', '0']);
      const row0 = document.querySelector(`[data-content-key='${key0}']`);
      const disabled0 = row0?.querySelector('[data-study-unavailable]');
      const primary0 = row0?.querySelector('.a1-action-primary');
      return {
        disabledText: disabled0 ? disabled0.textContent.trim() : null,
        isDisabled: disabled0?.disabled === true && disabled0?.getAttribute('aria-disabled') === 'true',
        primaryIsPreview: Boolean(primary0 && primary0.getAttribute('data-preview-file'))
      };
    });

    assert.equal(beforeState.disabledText, 'الشرح — قريبًا');
    assert.equal(beforeState.isDisabled, true);
    assert.equal(beforeState.primaryIsPreview, true);

    // Switch student profile to trigger profile change and re-render
    await page.evaluate(() => {
      if (window.StudentProfile) {
        window.StudentProfile.set('B2', 4);
      }
    });

    await page.waitForTimeout(100);

    // Check ID 0 after profile change
    const afterState = await page.evaluate(() => {
      const key0 = JSON.stringify(['data-structure', 'lecture', '0']);
      const row0 = document.querySelector(`[data-content-key='${key0}']`);
      const disabled0 = row0?.querySelector('[data-study-unavailable]');
      const primary0 = row0?.querySelector('.a1-action-primary');
      return {
        disabledText: disabled0 ? disabled0.textContent.trim() : null,
        isDisabled: disabled0?.disabled === true && disabled0?.getAttribute('aria-disabled') === 'true',
        primaryIsPreview: Boolean(primary0 && primary0.getAttribute('data-preview-file'))
      };
    });

    assert.equal(afterState.disabledText, 'الشرح — قريبًا');
    assert.equal(afterState.isDisabled, true);
    assert.equal(afterState.primaryIsPreview, true);
  });

  await scenario('availability-pointer-enter-space-and-crafted-actions-recovery', async ({ page, go }) => {
    // 1. Pointer click, Enter, and Space on disabled button do not open modal
    await go('subject.html?id=data-structure');
    await page.locator('#lectures-list .a1-source-row').first().waitFor();

    const pointerResult = await page.evaluate(() => {
      const disabledBtn = document.querySelector('[data-study-unavailable]');
      if (!disabledBtn) return { hasBtn: false };

      // Try calling click()
      disabledBtn.click();

      // Dispatch Space keydown
      disabledBtn.dispatchEvent(new window.KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
      // Dispatch Enter keydown
      disabledBtn.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));

      const modal = document.getElementById('lecture-study-modal');
      return {
        hasBtn: true,
        isModalOpen: modal && modal.getAttribute('aria-hidden') === 'false',
        pointerEvents: window.getComputedStyle(disabledBtn).pointerEvents,
        cursor: window.getComputedStyle(disabledBtn).cursor
      };
    });

    assert.equal(pointerResult.hasBtn, true);
    assert.equal(pointerResult.isModalOpen, false, 'Modal study is not opened by pointer/space/enter on disabled button');
    assert.equal(pointerResult.pointerEvents, 'none', 'Disabled button has pointer-events: none');
    assert.equal(pointerResult.cursor, 'not-allowed', 'Disabled button has cursor: not-allowed');

    // 2. Crafted URL requesting standalone-study on computer-graphics lecture 1
    const cgKey = JSON.stringify(['computer-graphics', 'lecture', '1']);
    await go(`subject.html?id=computer-graphics&track=lecture&kind=lectures&item=${encodeURIComponent(cgKey)}&action=standalone-study`);

    const cgResult = await page.evaluate(() => {
      const modal = document.getElementById('lecture-study-modal');
      const isModalOpen = modal && modal.getAttribute('aria-hidden') === 'false';
      const notice = document.querySelector('.portal-nav-notice');
      const row = document.querySelector(`[data-content-key='${JSON.stringify(['computer-graphics', 'lecture', '1'])}']`);
      const previewBtn = row?.querySelector('[data-preview-file]');
      const driveLink = row?.querySelector('a[href*="drive.google.com"]');
      return {
        isModalOpen,
        hasNotice: Boolean(notice),
        noticeText: notice ? notice.textContent : '',
        rowFound: Boolean(row),
        hasPreviewBtn: Boolean(previewBtn),
        hasDriveLink: Boolean(driveLink)
      };
    });

    assert.equal(cgResult.isModalOpen, false, 'Modal study is not opened');
    assert.equal(cgResult.hasNotice, true, 'Recovery notice is shown');
    assert.ok(cgResult.noticeText.includes('غير متوفر') || cgResult.noticeText.includes('قريبًا'), 'Notice explains unavailable state');
    assert.equal(cgResult.rowFound, true, 'Target row is located');
    assert.equal(cgResult.hasPreviewBtn, true, 'Preview button remains usable');
    assert.equal(cgResult.hasDriveLink, true, 'Drive link remains usable');

    // 3. Theme verification: light, dark, and sepia themes
    for (const theme of ['light', 'dark', 'sepia']) {
      await page.evaluate(t => {
        document.documentElement.dataset.theme = t;
      }, theme);

      const themeCheck = await page.evaluate(() => {
        const btn = document.querySelector('[data-study-unavailable]');
        if (!btn) return false;
        const rect = btn.getBoundingClientRect();
        return rect.height >= 40; // WCAG touch target height
      });
      assert.equal(themeCheck, true, `Button has compliant size in ${theme} theme`);
    }
  });
}

module.exports = { register };
