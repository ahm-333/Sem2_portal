const test=require('node:test');
const assert=require('node:assert/strict');
const {portal}=require('./helpers.cjs');
function media(){const env=portal();env.context.document.baseURI='https://example.test/Sem2_portal/';env.load('js/shared/media.js');return env.context.PortalMedia;}
test('media URLs reject executable schemes but retain local material files',()=>{
  const api=media();for(const url of ['javascript:alert(1)','data:text/html,bad','vbscript:bad',''])assert.equal(api.safeURL(url),'');
  assert.equal(api.safeURL('materials/test.pdf'),'https://example.test/Sem2_portal/materials/test.pdf');
});
test('YouTube and Drive IDs produce supported preview URLs',()=>{
  const api=media();assert.equal(api.embedURL('https://youtu.be/abc_123?si=ignored'),'https://www.youtube.com/embed/abc_123?autoplay=1');
  assert.equal(api.embedURL('https://www.youtube.com/watch?v=xyz'),'https://www.youtube.com/embed/xyz?autoplay=1');
  assert.equal(api.embedURL('https://www.youtube.com/playlist?list=PL123'),'https://www.youtube.com/embed/videoseries?list=PL123&autoplay=1');
  assert.equal(api.embedURL('https://drive.google.com/file/d/drive123/view?usp=sharing'),'https://drive.google.com/file/d/drive123/preview');
});
test('Drive folders and lookalike hosts are not treated as embeddable files',()=>{
  const api=media();assert.equal(api.canPreviewSite('https://drive.google.com/drive/folders/abc'),false);
  assert.equal(api.canPreviewSite('javascript:alert(1)'),false);
  assert.equal(api.embedURL('https://evil.test/?v=123'),'https://evil.test/?v=123');
  assert.equal(api.canPreviewSite('https://example.test/course'),true);
});
