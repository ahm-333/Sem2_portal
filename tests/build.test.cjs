const test = require('node:test');
const assert = require('node:assert/strict');
const {studyVersion} = require('../tools/study-version.cjs');

test('study cache version is stable across Windows and Linux line endings', () => {
  const source = 'const lecture = {\n  title: "Study",\n  slides: [1, 2]\n};\n';
  assert.equal(studyVersion(source), studyVersion(source.replace(/\n/g, '\r\n')));
});

test('study cache version changes when the source content changes', () => {
  assert.notEqual(studyVersion('const slides = [1];\n'), studyVersion('const slides = [1, 2];\n'));
});
