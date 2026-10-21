const assert = require('node:assert/strict');

async function register({ scenario }) {
  await scenario('study-catalog-home-singleton-and-quiz-metadata', async ({ page, go }) => {
    await go('index.html');
    const state = await page.evaluate(() => {
      const cat = window.PortalCatalog;
      if (!cat) return { hasCatalog: false };
      const dsLec0Key = cat.key('data-structure', 'lecture', 0);
      const dsSec0Key = cat.key('data-structure', 'section', 0);
      const dsLec0 = cat.get(dsLec0Key);
      const dsSec0 = cat.get(dsSec0Key);
      const dbLec2Key = cat.key('database-systems', 'lecture', 2);
      const dbLec2 = cat.get(dbLec2Key);
      const listCount = cat.list().length;
      return {
        hasCatalog: true,
        listCount,
        dsLec0Id: dsLec0 ? dsLec0.id : null,
        dsSec0Id: dsSec0 ? dsSec0.id : null,
        dbLec2Quiz: dbLec2?.study?.hasFullQuiz || false,
        dbLec2QuizVersion: dbLec2?.study?.quizVersion || null
      };
    });

    assert.equal(state.hasCatalog, true);
    assert.ok(state.listCount > 30);
    assert.equal(state.dsLec0Id, 0);
    assert.equal(state.dsSec0Id, 0);
    assert.equal(state.dbLec2Quiz, true);
    assert.equal(typeof state.dbLec2QuizVersion, 'string');
  });

  await scenario('study-catalog-subject-page-resolution', async ({ page, go }) => {
    await go('subject.html?id=computer-architecture');
    const state = await page.evaluate(() => {
      const cat = window.PortalCatalog;
      if (!cat) return { hasCatalog: false };
      const expSiteKey = cat.key('computer-architecture', 'explanation-site', 'site');
      const expSite = cat.get(expSiteKey);
      const emuKey = cat.key('computer-architecture', 'practical-resource', 1);
      const emu = cat.get(emuKey);
      return {
        hasCatalog: true,
        expSiteFound: !!expSite,
        expSiteUrl: expSite ? expSite.actions?.[0]?.url : null,
        emuDescriptionHasNoKey: emu ? !emu.description.includes('License Key.txt') : false
      };
    });

    assert.equal(state.hasCatalog, true);
    assert.equal(state.expSiteFound, true);
    assert.ok(state.expSiteUrl?.includes('computer-architecture-study'));
    assert.equal(state.emuDescriptionHasNoKey, true);
  });
}

module.exports = { register };
