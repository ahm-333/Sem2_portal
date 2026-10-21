async function resource(page, kind) {
  const button = page.locator(`[data-resource-kind="${kind}"]`);
  await button.click();
  await page.waitForFunction(value => document.body.dataset.resourceKind === value, kind);
}
async function question(page, id) {
  const map = page.locator('.a1-quiz-map');
  if (!await map.getAttribute('open')) {
    if (!await page.locator(`[data-jump-q="full-q-${id}"]`).isVisible()) await map.locator('summary').click();
  }
  await page.locator(`[data-jump-q="full-q-${id}"]`).click();
  await page.locator(`#full-q-${id}`).waitFor({state: 'visible'});
}
async function details(page, selector) {
  const summaries = page.locator(`${selector} .a1-source-details:not([open])>summary`);
  while (await summaries.count()) await summaries.first().click();
}
module.exports = {resource, question, details};
