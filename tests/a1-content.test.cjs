/* Guard scientific content and data against accidental visual-integration edits. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const root = path.resolve(__dirname, '..');
const baseline = require('../docs/A1-CONTENT-BASELINE.json');
test('A1 integration preserves all source data, study content, slides and prior planning notes', () => {
  for (const [file, expected] of Object.entries(baseline.files)) {
    let bytes = fs.readFileSync(path.join(root, file));
    // Permit only the three reviewed download target corrections; original content hashes stay pinned.
    if (baseline.approvedSourceFixes?.[file]) {
      let source=bytes.toString('utf8').replace(/\r\n/g,'\n');
      for(const change of baseline.approvedSourceFixes[file]){
        assert.equal(source.split(change.after).length-1,1,file+': exact approved source correction');
        source=source.replace(change.after,change.before);
      }
      bytes=Buffer.from(source);
    }
    const actual = createHash('sha256').update(bytes).digest('hex');
    // The baseline records the original Windows bytes. Git checks text out as LF
    // on Linux CI; allow only that newline conversion, retaining exact binary hashes.
    const candidates = [actual];
    if (/\.(?:js|json|md)$/.test(file)) {
      const lf = bytes.toString('utf8').replace(/\r\n/g, '\n');
      for (const text of [lf, lf.replace(/\n/g, '\r\n')]) {
        candidates.push(createHash('sha256').update(text).digest('hex'));
      }
    }
    assert.ok(candidates.includes(expected), file);
  }
});
