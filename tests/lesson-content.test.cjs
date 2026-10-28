/**
 * Verification test suite for DB lesson content preservation and unification contract (Issue #28).
 * Guards scientific text, code, diagrams, tables, questions, and mappings against corruption or loss.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

// 1. Module existence and loading
test('DB unification contract, manifest, and mapping modules exist in bounded paths', () => {
  const contractPath = path.join(root, 'docs/education/DB-UNIFICATION-CONTRACT.md');
  const manifestPath = path.join(root, 'docs/education/DB-CONTENT-MANIFEST.json');
  const mapPath = path.join(root, 'js/shared/db-lesson-map.js');
  const checkerPath = path.join(root, 'tools/check-lesson-content.cjs');

  assert.ok(fs.existsSync(contractPath), 'DB-UNIFICATION-CONTRACT.md must exist');
  assert.ok(fs.existsSync(manifestPath), 'DB-CONTENT-MANIFEST.json must exist');
  assert.ok(fs.existsSync(mapPath), 'db-lesson-map.js must exist');
  assert.ok(fs.existsSync(checkerPath), 'check-lesson-content.cjs must exist');
});

test('Inventory record counts match acceptance criteria exactly', () => {
  const { verifyLessonContent } = require('../tools/check-lesson-content.cjs');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/education/DB-CONTENT-MANIFEST.json'), 'utf8'));

  // Lecture 2 / Chapter 1
  assert.equal(manifest.inventory.lec2.standaloneBlocks, 7, 'Lecture 2 must have 7 standalone blocks');
  assert.equal(manifest.inventory.lec2.slides, 30, 'Lecture 2 must have 30 slides');
  assert.equal(manifest.inventory.lec2.standaloneQuestions, 34, 'Lecture 2 must have 34 standalone questions');
  assert.equal(manifest.inventory.lec2.fullQuizQuestions, 20, 'Lecture 2 must have 20 full-quiz questions');
  assert.equal(manifest.inventory.lec2.slideQuestions, 30, 'Lecture 2 must have 30 slide questions');

  // Lecture 3 / Chapter 2
  assert.equal(manifest.inventory.lec3.standaloneBlocks, 6, 'Lecture 3 must have 6 standalone blocks');
  assert.equal(manifest.inventory.lec3.slides, 32, 'Lecture 3 must have 32 slides');
  assert.equal(manifest.inventory.lec3.standaloneQuestions, 20, 'Lecture 3 must have 20 standalone questions');
  assert.equal(manifest.inventory.lec3.fullQuizQuestions, 30, 'Lecture 3 must have 30 full-quiz questions');
  assert.equal(manifest.inventory.lec3.slideQuestions, 32, 'Lecture 3 must have 32 slide questions');

  // Combined totals
  const totalQuestions = (34 + 20 + 30) + (20 + 30 + 32);
  assert.equal(manifest.inventory.totalQuestions, totalQuestions, 'Must have exactly 166 authored question records');
  assert.equal(manifest.inventory.totalSlideImages, 62, 'Must preserve all 62 source images');

  // Tool validation
  const result = verifyLessonContent({ root });
  assert.equal(result.clean, true, 'Integrity check must pass with 0 errors');
});

test('Content verification is stable across Windows and Linux line endings', () => {
  const { verifyLessonContent } = require('../tools/check-lesson-content.cjs');
  const ch1Lf = fs.readFileSync(path.join(root, 'study/db/chapter-1.html'), 'utf8').replace(/\r\n/g, '\n');
  const ch2Lf = fs.readFileSync(path.join(root, 'study/db/chapter-2.html'), 'utf8').replace(/\r\n/g, '\n');

  // Verify pure LF input passes
  const lfResult = verifyLessonContent({
    root,
    overrideHtml: {
      'study/db/chapter-1.html': ch1Lf,
      'study/db/chapter-2.html': ch2Lf
    }
  });
  assert.equal(lfResult.clean, true, 'Integrity check must pass with pure LF line endings');

  // Verify CRLF input passes
  const crlfResult = verifyLessonContent({
    root,
    overrideHtml: {
      'study/db/chapter-1.html': ch1Lf.replace(/\n/g, '\r\n'),
      'study/db/chapter-2.html': ch2Lf.replace(/\n/g, '\r\n')
    }
  });
  assert.equal(crlfResult.clean, true, 'Integrity check must pass with CRLF line endings');
});

test('All 62 source images exist and match pinned cryptographic hashes', () => {
  const { verifyImages } = require('../tools/check-lesson-content.cjs');
  const imageResult = verifyImages(root);
  assert.equal(imageResult.total, 62, 'Total images must be 62');
  assert.equal(imageResult.missing.length, 0, 'No missing images allowed');
  assert.equal(imageResult.mismatches.length, 0, 'No image hash mismatches allowed');
});

test('Many-to-many relationship mapping covers all blocks and all slides without loss', () => {
  const { DBLessonMap } = require('../js/shared/db-lesson-map.js');

  // Lec 2 checks
  const lec2Blocks = DBLessonMap.getTopicBlocks('2');
  assert.equal(lec2Blocks.length, 7, 'Lec 2 must expose 7 blocks');
  const lec2Slides = DBLessonMap.getAllSlides('2');
  assert.equal(lec2Slides.length, 30, 'Lec 2 must expose 30 slides');

  // Lec 3 checks
  const lec3Blocks = DBLessonMap.getTopicBlocks('3');
  assert.equal(lec3Blocks.length, 6, 'Lec 3 must expose 6 blocks');
  const lec3Slides = DBLessonMap.getAllSlides('3');
  assert.equal(lec3Slides.length, 32, 'Lec 3 must expose 32 slides');

  // Covers, outlines, summaries, COMPANY, UML, Staff/DOB must have explicit access paths
  const standaloneOnlySlides = DBLessonMap.getStandaloneOnlySlides('3');
  const titles = standaloneOnlySlides.map(s => s.title);
  assert.ok(titles.some(t => /COMPANY/i.test(t)), 'COMPANY example slide must be covered');
  assert.ok(titles.some(t => /UML/i.test(t)), 'UML example slide must be covered');
  assert.ok(titles.some(t => /Staff/i.test(t) || /DOB/i.test(t)), 'Staff/DOB example slide must be covered');

  // Every slide must have a valid access path
  for (const s of [...lec2Slides, ...lec3Slides]) {
    assert.ok(s.accessPath, `Slide ${s.lectureKey}:${s.num} must have accessPath`);
    assert.ok(s.sourceLocator, `Slide ${s.lectureKey}:${s.num} must have sourceLocator`);
    assert.ok(Number.isInteger(s.originalOrder), `Slide ${s.lectureKey}:${s.num} must have originalOrder`);
  }

  // Every block must have a valid access path
  for (const b of [...lec2Blocks, ...lec3Blocks]) {
    assert.ok(b.accessPath, `Block ${b.lectureKey}:${b.id} must have accessPath`);
    assert.ok(b.sourceLocator, `Block ${b.lectureKey}:${b.id} must have sourceLocator`);
    assert.ok(Number.isInteger(b.originalOrder), `Block ${b.lectureKey}:${b.id} must have originalOrder`);
  }
});

test('Question identities: canonical IDs for standalone/full banks, namespaced for slide quiz', () => {
  const { DBLessonMap } = require('../js/shared/db-lesson-map.js');

  const lec2Qs = DBLessonMap.getQuestions('2');
  assert.equal(lec2Qs.standalone.length, 34);
  assert.equal(lec2Qs.fullQuiz.length, 20);
  assert.equal(lec2Qs.slideQuiz.length, 30);

  // Standalone canonical ID format: study/db/chapter-1.html:<num>
  assert.ok(lec2Qs.standalone.every(q => /^study\/db\/chapter-1\.html:\d+$/.test(q.id)));

  // Full quiz canonical ID format: subject.html?id=database-systems&lecture=2:<num>
  assert.ok(lec2Qs.fullQuiz.every(q => /^subject\.html\?id=database-systems&lecture=2:\d+$/.test(q.id)));

  // Slide quiz namespaced ID format: db:lec2:s<slideNum>:quiz
  assert.ok(lec2Qs.slideQuiz.every(q => /^db:lec2:s\d+:quiz$/.test(q.id)));

  const lec3Qs = DBLessonMap.getQuestions('3');
  assert.equal(lec3Qs.standalone.length, 20);
  assert.equal(lec3Qs.fullQuiz.length, 30);
  assert.equal(lec3Qs.slideQuiz.length, 32);

  assert.ok(lec3Qs.standalone.every(q => /^study\/db\/chapter-2\.html:\d+$/.test(q.id)));
  assert.ok(lec3Qs.fullQuiz.every(q => /^subject\.html\?id=database-systems&lecture=3:\d+$/.test(q.id)));
  assert.ok(lec3Qs.slideQuiz.every(q => /^db:lec3:s\d+:quiz$/.test(q.id)));
});

test('Tamper detection: alteration of scientific text, code, answer, or missing slide fails the guard', () => {
  const { verifyLessonContent } = require('../tools/check-lesson-content.cjs');

  // 1. Text modification in block
  const tamperText = verifyLessonContent({
    root,
    overrideHtml: {
      'study/db/chapter-1.html': (html) => html.replace('المفاهيم الأساسية', 'المفاهيم المعدلة')
    }
  });
  assert.equal(tamperText.clean, false, 'Tampered block text must fail guard');

  // 2. Question option alteration
  const tamperOption = verifyLessonContent({
    root,
    overrideExplanations: (data) => {
      const cloned = JSON.parse(JSON.stringify(data));
      cloned['database-systems']['2'].fullQuiz[0].options[0] += ' [TAMPERED]';
      return cloned;
    }
  });
  assert.equal(tamperOption.clean, false, 'Tampered question option must fail guard');

  // 3. Question correct answer index alteration
  const tamperAnswer = verifyLessonContent({
    root,
    overrideExplanations: (data) => {
      const cloned = JSON.parse(JSON.stringify(data));
      cloned['database-systems']['2'].fullQuiz[0].correct = 999;
      return cloned;
    }
  });
  assert.equal(tamperAnswer.clean, false, 'Tampered correct answer index must fail guard');

  // 4. Missing slide
  const tamperMissingSlide = verifyLessonContent({
    root,
    overrideExplanations: (data) => {
      const cloned = JSON.parse(JSON.stringify(data));
      cloned['database-systems']['2'].slides.pop();
      return cloned;
    }
  });
  assert.equal(tamperMissingSlide.clean, false, 'Missing slide must fail guard');

  // 5. Reordered block
  const tamperReorder = verifyLessonContent({
    root,
    overrideHtml: {
      'study/db/chapter-1.html': (html) => {
        // swap block-1 and block-2 positions
        const b1Match = html.match(/<section id="block-1"[\s\S]*?<\/section>/);
        const b2Match = html.match(/<section id="block-2"[\s\S]*?<\/section>/);
        if (!b1Match || !b2Match) return html;
        return html.replace(b1Match[0], '%%%TMP%%%').replace(b2Match[0], b1Match[0]).replace('%%%TMP%%%', b2Match[0]);
      }
    }
  });
  assert.equal(tamperReorder.clean, false, 'Reordered block must fail guard');

  // 6. Whitespace outside code passes
  const validWhitespace = verifyLessonContent({
    root,
    overrideHtml: {
      'study/db/chapter-1.html': (html) => html.replace('  <!-- Vercel Web Analytics -->', '    <!-- Vercel Web Analytics -->')
    }
  });
  assert.equal(validWhitespace.clean, true, 'Non-code whitespace changes must pass');

  // 7. Approved UI counter correction passes
  const validCounter = verifyLessonContent({
    root,
    overrideHtml: {
      'study/db/chapter-1.html': (html) => html.replace('كل الأسئلة (30)', 'كل الأسئلة (34)')
    }
  });
  assert.equal(validCounter.clean, true, 'Agreed UI counter correction (30 -> 34) must pass');
});

test('Contract documents reader.slideId ambiguity and schemaVersion1 preservation', () => {
  const contractContent = fs.readFileSync(path.join(root, 'docs/education/DB-UNIFICATION-CONTRACT.md'), 'utf8');

  // Must mention slideId ambiguity
  assert.ok(contractContent.includes('reader.slideId'), 'Contract must document reader.slideId');
  assert.ok(contractContent.includes('schemaVersion1'), 'Contract must mention schemaVersion1');
  assert.ok(contractContent.includes('#34'), 'Contract must reserve location resolution for #34');
  assert.ok(contractContent.includes('modal') && contractContent.includes('ordinal'), 'Contract must explain modal vs ordinal discrepancy');

  // Ensure study-state schemaVersion1 is not touched
  const studyStateSource = fs.readFileSync(path.join(root, 'js/shared/study-state.js'), 'utf8');
  assert.ok(studyStateSource.includes('const SCHEMA_VERSION = 1;'), 'SCHEMA_VERSION = 1 must be untouched');
  assert.ok(studyStateSource.includes('schemaVersion: SCHEMA_VERSION'), 'schemaVersion must use SCHEMA_VERSION');
});
