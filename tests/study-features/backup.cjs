const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

async function readDownloadText(download) {
  const target = await download.path();
  assert.ok(target, 'Export download should produce a local file');
  return fs.readFileSync(target, 'utf8');
}

async function register({ scenario }) {
  await scenario('backup-settings-footer-export-preview-cancel-and-roundtrip', async ({ page, go, errors }) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sem2-backup-test-'));
    try {
      const ds2 = JSON.stringify(['data-structure', 'lecture', '2']);
      const lec0 = JSON.stringify(['computer-architecture', 'lecture', '0']);
      const db2 = JSON.stringify(['database-systems', 'lecture', '2']);
      const ts = '2026-11-12T10:15:00.000Z';

      await page.addInitScript(({ k0, kDs2, kDb2, nowTs }) => {
        if (location.hostname !== '127.0.0.1' || localStorage.getItem('__backup_seeded')) return;
        localStorage.setItem('__backup_seeded', '1');
        localStorage.setItem('sem2_student_profile', JSON.stringify({ group: 'B2', section: 6 }));
        localStorage.setItem('sem2_portal_theme', 'dark');
        localStorage.setItem('sem2_study_timer_sessions_v1', JSON.stringify([{ mins: 25 }]));
        localStorage.setItem('sem2_active_exam_v1:' + encodeURIComponent(kDb2), JSON.stringify({ active: true }));
        localStorage.setItem('__unrelated_sentinel', 'keep-me');
        localStorage.setItem('sem2_study_v1:meta', JSON.stringify({
          schemaVersion: 1,
          lastUsed: { key: kDb2, actionId: 'internal-study', updatedAt: nowTs }
        }));
        localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(k0) + ':base', JSON.stringify({
          startedAt: nowTs,
          manualComplete: true
        }));
        localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(kDb2) + ':reader', JSON.stringify({
          slideId: 4,
          tab: 'explanation',
          updatedAt: nowTs
        }));
        localStorage.setItem('sem2_study_v1:item:' + encodeURIComponent(kDb2) + ':quiz', JSON.stringify({
          version: '0f77d6ceae5a',
          answers: { '1': 1, '2': 2 },
          activeQuestionId: 3
        }));
        localStorage.setItem('sem2_standalone_v1:' + encodeURIComponent(kDb2), JSON.stringify({
          version: 1,
          anchor: 'topic-block-3',
          updatedAt: nowTs,
          checks: []
        }));
        localStorage.setItem('sem2_standalone_check_v1:' + encodeURIComponent(kDs2) + ':sec-1', JSON.stringify({
          version: 1,
          checked: true
        }));
      }, { k0: lec0, kDs2: ds2, kDb2: db2, nowTs: ts });

      await go('index.html');

      // Open via existing profile settings modal
      await page.locator('header [data-open-profile-modal]').click();
      await page.locator('#student-profile-modal').waitFor({ state: 'visible' });
      const profileBackupBtn = page.locator('#student-profile-modal [data-open-backup-modal]');
      await profileBackupBtn.click();

      const modal = page.locator('#study-backup-modal');
      await modal.waitFor({ state: 'visible' });
      assert.equal(await page.locator('#student-profile-modal').isVisible(), false, 'Profile modal closes cleanly when opening backup');
      assert.equal(await modal.getAttribute('aria-modal'), 'true');

      const manifestText = await modal.locator('#backup-manifest-grid').innerText();
      assert.match(manifestText, /sem2_study_v1/);
      assert.match(manifestText, /sem2_standalone_v1/);
      assert.match(manifestText, /sem2_student_profile/);
      assert.match(manifestText, /sem2_portal_theme/);
      assert.match(manifestText, /sem2_active_exam_v1/);

      // Export copy via UI
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('#backup-export-btn').click()
      ]);
      assert.match(download.suggestedFilename(), /^sem2-study-backup-\d{4}-\d{2}-\d{2}\.json$/);
      const exportedJson = await readDownloadText(download);
      const exportPath = path.join(tmpDir, download.suggestedFilename());
      fs.writeFileSync(exportPath, exportedJson, 'utf8');

      // Keyboard Escape closes modal and restores focus cleanly to opener
      await page.keyboard.press('Escape');
      assert.equal(await modal.isVisible(), false);
      assert.equal(await page.evaluate(() => document.activeElement?.matches('[data-open-profile-modal]')), true, 'Focus must return cleanly after closing modal');

      // Wipe study stores (preserving profile/theme/runtime exclusions) & open subject footer trigger
      await page.evaluate(() => {
        for (const key of Object.keys(localStorage)) {
          if (key.startsWith('sem2_study_v1:') || key.startsWith('sem2_standalone_')) {
            localStorage.removeItem(key);
          }
        }
      });
      await go('subject.html?id=database-systems');
      assert.equal(await page.evaluate(k => window.PortalStudyState.getItem(k), lec0), null);

      const footerTrigger = page.locator('footer [data-open-backup-modal]');
      await footerTrigger.scrollIntoViewIfNeeded();
      await footerTrigger.click();
      await modal.waitFor({ state: 'visible' });

      // File selection shows preview only; NEVER auto-restores
      await page.locator('#backup-file-input').setInputFiles(exportPath);
      await page.locator('#backup-preview-panel').waitFor({ state: 'visible' });
      assert.equal(await page.evaluate(k => window.PortalStudyState.getItem(k), lec0), null, 'Preview must never write before confirmation');

      // Cancel restores nothing
      await page.locator('#backup-cancel-restore-btn').click();
      assert.equal(await page.locator('#backup-preview-panel').isVisible(), false);
      assert.equal(await page.evaluate(k => window.PortalStudyState.getItem(k), lec0), null);

      // Select again and confirm restore
      await page.locator('#backup-file-input').setInputFiles(exportPath);
      await page.locator('#backup-preview-panel').waitFor({ state: 'visible' });
      await page.locator('#backup-confirm-restore-btn').click();
      await page.locator('#backup-status-banner.backup-status-success').waitFor({ state: 'visible' });

      // Reload & verify complete study state + standalone + excluded keys
      await page.reload();
      const restored = await page.evaluate(({ k0, kDs2, kDb2 }) => ({
        item0: window.PortalStudyState.getItem(k0),
        dbQuiz: window.PortalStudyState.getItem(kDb2)?.quiz,
        dbBridge: window.PortalStudyState.getStandaloneBridge(kDb2),
        dsCheck: window.PortalStudyState.getStandaloneCheck(kDs2, 'sec-1'),
        profile: localStorage.getItem('sem2_student_profile'),
        theme: localStorage.getItem('sem2_portal_theme'),
        timer: localStorage.getItem('sem2_study_timer_sessions_v1'),
        exam: localStorage.getItem('sem2_active_exam_v1:' + encodeURIComponent(kDb2)),
        sentinel: localStorage.getItem('__unrelated_sentinel')
      }), { k0: lec0, kDs2: ds2, kDb2: db2 });

      assert.equal(restored.item0?.manualComplete, true);
      assert.equal(restored.dbQuiz?.answers?.['1'], 1);
      assert.equal(restored.dbBridge?.anchor, 'topic-block-3');
      assert.equal(restored.dsCheck?.checked, true);
      assert.equal(restored.profile, JSON.stringify({ group: 'B2', section: 6 }));
      assert.equal(restored.theme, 'dark');
      assert.equal(restored.timer, JSON.stringify([{ mins: 25 }]));
      assert.equal(restored.exam, JSON.stringify({ active: true }));
      assert.equal(restored.sentinel, 'keep-me');
      assert.deepEqual(errors, []);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  await scenario('backup-rejects-oversized-invalid-corrupt-and-quota-without-mutation', async ({ page, go, errors }) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sem2-backup-neg-'));
    try {
      const ds2 = JSON.stringify(['data-structure', 'lecture', '2']);
      const lec0 = JSON.stringify(['computer-architecture', 'lecture', '0']);
      await go('index.html');
      await page.evaluate(({ k0 }) => {
        window.PortalStudyState.updateItem(k0, { manualComplete: true });
      }, { k0: lec0 });

      const oversizedPath = path.join(tmpDir, 'oversized.json');
      fs.writeFileSync(oversizedPath, '"' + 'a'.repeat(1048600) + '"', 'utf8');
      const poisonedPath = path.join(tmpDir, 'poisoned.json');
      fs.writeFileSync(poisonedPath, '{"__proto__":{"polluted":true}}', 'utf8');
      const validPath = path.join(tmpDir, 'valid.json');
      fs.writeFileSync(validPath, JSON.stringify({
        project: 'sem2-portal-study',
        formatVersion: 1,
        schemaVersion: 1,
        exportedAt: '2026-11-12T10:00:00.000Z',
        payload: {
          studyState: { schemaVersion: 1, items: {} },
          standalone: { bridges: {}, checks: {} }
        }
      }), 'utf8');

      await page.locator('footer [data-open-backup-modal]').click();
      await page.locator('#study-backup-modal').waitFor({ state: 'visible' });

      await page.locator('#backup-file-input').setInputFiles(oversizedPath);
      await page.locator('#backup-status-banner.backup-status-error').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#backup-preview-panel').isVisible(), false);
      assert.equal(await page.locator('#backup-file-input').inputValue(), '', 'Invalid/oversized selection resets input value');
      assert.equal(await page.evaluate(k => window.PortalStudyState.getItem(k)?.manualComplete, lec0), true);

      await page.locator('#backup-file-input').setInputFiles(poisonedPath);
      await page.locator('#backup-status-banner.backup-status-error').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#backup-preview-panel').isVisible(), false);
      assert.equal(await page.evaluate(() => ({}).polluted), undefined);

      // Quota failure during confirm leaves prior bytes intact & keeps save-notice inside modal box
      await page.locator('#backup-file-input').setInputFiles(validPath);
      await page.locator('#backup-preview-panel').waitFor({ state: 'visible' });
      await page.evaluate(() => {
        Storage.prototype.setItem = function () {
          throw new window.DOMException('QuotaExceededError', 'QuotaExceededError');
        };
        window.PortalStudyState.updateItem('["computer-architecture","lecture","0"]', { manualComplete: false });
      });
      const saveNoticeInside = await page.evaluate(() => {
        const notice = document.querySelector('#study-backup-modal [data-study-save-notice]');
        const box = document.getElementById('study-backup-box');
        if (!notice || !box || notice.hidden) return false;
        const nRect = notice.getBoundingClientRect();
        const bRect = box.getBoundingClientRect();
        return box.contains(notice) && nRect.left >= bRect.left - 1 && nRect.right <= bRect.right + 1;
      });
      assert.equal(saveNoticeInside, true, '[data-study-save-notice] must render cleanly inside #study-backup-box');
      await page.locator('#backup-confirm-restore-btn').click();
      await page.locator('#backup-status-banner.backup-status-error').waitFor({ state: 'visible' });
      assert.equal(await page.evaluate(k => window.PortalStudyState.getItem(k)?.manualComplete, lec0), false);

      // Corrupt standalone record blocks backup modal actions without overwriting raw bytes
      await page.goto(page.url());
      const futureBytes = '{"version":99,"anchor":"future"}';
      await page.evaluate(({ k, raw }) => {
        localStorage.setItem('sem2_standalone_v1:' + encodeURIComponent(k), raw);
      }, { k: ds2, raw: futureBytes });
      await page.locator('footer [data-open-backup-modal]').click();
      await page.locator('#study-backup-modal').waitFor({ state: 'visible' });
      await page.locator('#backup-status-banner.backup-status-error').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#backup-export-btn').isDisabled(), true);
      assert.equal(await page.locator('#backup-file-input').isDisabled(), true);
      assert.equal(await page.evaluate(k => localStorage.getItem('sem2_standalone_v1:' + encodeURIComponent(k)), ds2), futureBytes);
      assert.deepEqual(errors, []);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  await scenario('backup-two-tab-concurrency-and-mobile-wcag-layout', async ({ page, context, go, errors }) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sem2-backup-conc-'));
    try {
      const ds2 = JSON.stringify(['data-structure', 'lecture', '2']);
      const lec0 = JSON.stringify(['computer-architecture', 'lecture', '0']);
      const backupFile = path.join(tmpDir, 'incoming.json');
      fs.writeFileSync(backupFile, JSON.stringify({
        project: 'sem2-portal-study',
        formatVersion: 1,
        schemaVersion: 1,
        exportedAt: '2026-11-12T10:00:00.000Z',
        payload: {
          studyState: {
            schemaVersion: 1,
            items: {
              [lec0]: { manualComplete: true, startedAt: '2026-11-12T09:00:00.000Z' }
            }
          },
          standalone: { bridges: {}, checks: {} }
        }
      }), 'utf8');

      await go('index.html#library');
      const tab2 = await context.newPage();
      await tab2.goto(page.url());
      // Tab 3 runs an open standalone lesson with a prior check
      const dsTab = await context.newPage();
      await dsTab.addInitScript(k => {
        localStorage.setItem('sem2_standalone_v1:' + encodeURIComponent(k), JSON.stringify({
          version: 1,
          anchor: 'sec-2',
          updatedAt: '2026-11-12T08:00:00.000Z',
          checks: ['sec-1']
        }));
      }, ds2);
      await dsTab.goto(new URL('study/ds/lecture-2.html', page.url()).href);
      await dsTab.locator('.check-sec-btn[data-check="sec-1"][aria-pressed="true"]').waitFor({ state: 'visible' });

      await page.locator('footer [data-open-backup-modal]').click();
      await page.locator('#study-backup-modal').waitFor({ state: 'visible' });
      await page.locator('#backup-file-input').setInputFiles(backupFile);
      await page.locator('#backup-preview-panel').waitFor({ state: 'visible' });

      // Mobile 360px + light/dark/reading WCAG layout while preview comparison is open
      await page.setViewportSize({ width: 360, height: 800 });
      for (const theme of ['light', 'dark', 'reading']) {
        await page.evaluate(t => window.PortalTheme.setTheme(t), theme);
        const layout = await page.evaluate(() => {
          const box = document.getElementById('study-backup-box');
          const closeRect = document.getElementById('close-backup-modal').getBoundingClientRect();
          const exportRect = document.getElementById('backup-export-btn').getBoundingClientRect();
          const summaryRect = document.querySelector('#study-backup-modal .backup-manifest-details summary').getBoundingClientRect();
          const unrendered = document.querySelectorAll('#study-backup-modal i[data-lucide]').length;
          return {
            docOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
            boxOverflow: box.scrollWidth > box.clientWidth + 1,
            closeH: closeRect.height,
            exportH: exportRect.height,
            summaryH: summaryRect.height,
            previewVisible: !document.getElementById('backup-preview-panel').hidden,
            unrendered
          };
        });
        assert.equal(layout.previewVisible, true);
        assert.equal(layout.docOverflow, false, 'No horizontal page overflow at 360px with preview open');
        assert.equal(layout.boxOverflow, false, 'No horizontal modal overflow at 360px with preview open');
        assert.ok(layout.closeH >= 44, 'Close button touch target >= 44px');
        assert.ok(layout.exportH >= 44, 'Export button touch target >= 44px');
        assert.ok(layout.summaryH >= 44, 'Manifest toggle touch target >= 44px');
        assert.equal(layout.unrendered, 0, 'All Lucide icons inside modal rendered');
      }
      await page.setViewportSize({ width: 1440, height: 900 });

      // Tab 2 writes a standalone check while Tab 1 is previewing
      await tab2.evaluate(k => window.PortalStudyState.setStandaloneCheck(k, 'sec-2', true), ds2);

      // Tab 1 confirmation sees concurrent_change, refreshes preview, does NOT erase Tab 2 check yet
      await page.locator('#backup-confirm-restore-btn').click();
      await page.locator('#backup-status-banner.backup-status-warning').waitFor({ state: 'visible' });
      assert.equal(await tab2.evaluate(k => window.PortalStudyState.getStandaloneCheck(k, 'sec-2')?.checked, ds2), true);

      // Re-confirm after refreshed comparison succeeds & propagates to Tab 2 + #library + open standalone Tab 3
      await page.locator('#backup-confirm-restore-btn').click();
      await page.locator('#backup-status-banner.backup-status-success').waitFor({ state: 'visible' });
      await tab2.waitForFunction(k => window.PortalStudyState.getItem(k)?.manualComplete === true, lec0);
      await page.waitForFunction(() => document.querySelectorAll('#library-results .studio-status-badge').length > 0);
      await dsTab.waitForFunction(() => document.querySelector('.check-sec-btn[data-check="sec-1"]')?.getAttribute('aria-pressed') === 'false');
      await dsTab.evaluate(() => window.PortalStudySession.recordSection('study-main'));
      assert.equal(await dsTab.evaluate(k => window.PortalStudyState.getStandaloneBridge(k)?.checks?.length || 0, ds2), 0, 'Navigation on standalone page must never resurrect restored-away checks');

      await dsTab.close();
      await tab2.close();
      assert.deepEqual(errors, []);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
}

module.exports = { register };
