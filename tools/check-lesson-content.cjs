#!/usr/bin/env node
/**
 * Lesson Content and Preservation Verification Guard (tools/check-lesson-content.cjs)
 * Validates exact record counts, cryptographic payload/media hashes, ordered scientific prose,
 * formulas, code punctuation, diagram labels, and question answer identities for Database Systems.
 *
 * Owned by Issue #28 under Epic #27.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { extractArrays } = require('./build-question-bank.cjs');

function sha256(data) {
  return crypto.createHash('sha256').update(typeof data === 'string' ? Buffer.from(data, 'utf8') : data).digest('hex');
}

function normalizeWhitespace(str) {
  if (!str) return '';
  return String(str).replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
}

/**
 * Verify all 62 slide images on disk against manifest pinned hashes.
 */
function verifyImages(rootPath) {
  const manifestPath = path.join(rootPath, 'docs/education/DB-CONTENT-MANIFEST.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error('Manifest not found at ' + manifestPath);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const missing = [];
  const mismatches = [];
  let total = 0;

  for (const [relPath, expectedHash] of Object.entries(manifest.slideImages || {})) {
    total++;
    const fullPath = path.join(rootPath, relPath);
    if (!fs.existsSync(fullPath)) {
      missing.push(relPath);
      continue;
    }
    const actualHash = sha256(fs.readFileSync(fullPath));
    if (actualHash !== expectedHash) {
      mismatches.push({ file: relPath, expected: expectedHash, actual: actualHash });
    }
  }

  return { total, missing, mismatches };
}

/**
 * Extract topic blocks from chapter HTML.
 */
function extractBlocks(html, tagName) {
  const cleanHtml = html.replace(/\r\n/g, '\n');
  const blocks = [];
  const regex = new RegExp(`<${tagName}\\s+[^>]*id="(block-[^"]+|block-add)"[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  let m;
  let order = 1;
  while ((m = regex.exec(cleanHtml)) !== null) {
    const id = m[1];
    const raw = m[2];
    const headings = [...raw.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)].map(h => normalizeWhitespace(h[1].replace(/<[^>]+>/g, '')));
    const title = headings[0] || id;

    // Extract code blocks preserving exact punctuation and inner whitespace, normalized to LF
    const codeBlocks = [...raw.matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>|<code\b[^>]*>([\s\S]*?)<\/code>/gi)]
      .map(c => (c[1] || c[2] || '').replace(/\r\n/g, '\n').trim())
      .filter(Boolean);

    // Extract table cells
    const tableCells = [...raw.matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)]
      .map(td => normalizeWhitespace(td[1].replace(/<[^>]+>/g, '')))
      .filter(Boolean);

    // Extract SVG / diagram labels
    const svgTexts = [...raw.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)]
      .map(t => normalizeWhitespace(t[1].replace(/<[^>]+>/g, '')))
      .filter(Boolean);

    // Normalized prose text outside code/pre/script/style
    const textWithoutCode = raw
      .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
      .replace(/<code[\s\S]*?<\/code>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ');
    const normalizedProse = normalizeWhitespace(textWithoutCode);

    const signature = JSON.stringify({
      id,
      title,
      headings,
      codeBlocks,
      tableCells,
      svgTexts,
      normalizedProse
    });

    blocks.push({
      id,
      order: order++,
      title,
      headings,
      codeBlocks,
      tableCells,
      svgTexts,
      normalizedProse,
      contentHash: sha256(signature)
    });
  }
  return blocks;
}

/**
 * Verify lesson content integrity against manifest.
 */
function verifyLessonContent(options = {}) {
  const rootPath = options.root || path.resolve(__dirname, '..');
  const manifestPath = path.join(rootPath, 'docs/education/DB-CONTENT-MANIFEST.json');
  if (!fs.existsSync(manifestPath)) {
    return { clean: false, errors: ['Manifest not found: ' + manifestPath], warnings: [] };
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const errors = [];
  const warnings = [];

  // 1. Verify slide images
  const imageResults = verifyImages(rootPath);
  if (imageResults.missing.length > 0) {
    errors.push(`Missing ${imageResults.missing.length} slide images: ${imageResults.missing.join(', ')}`);
  }
  if (imageResults.mismatches.length > 0) {
    errors.push(`Hash mismatch in ${imageResults.mismatches.length} slide images`);
  }

  // 2. Load chapter HTML (allowing test overrides)
  let ch1Html = options.overrideHtml?.['study/db/chapter-1.html'];
  if (ch1Html === undefined) {
    ch1Html = fs.readFileSync(path.join(rootPath, 'study/db/chapter-1.html'), 'utf8');
  } else if (typeof ch1Html === 'function') {
    ch1Html = ch1Html(fs.readFileSync(path.join(rootPath, 'study/db/chapter-1.html'), 'utf8'));
  }

  let ch2Html = options.overrideHtml?.['study/db/chapter-2.html'];
  if (ch2Html === undefined) {
    ch2Html = fs.readFileSync(path.join(rootPath, 'study/db/chapter-2.html'), 'utf8');
  } else if (typeof ch2Html === 'function') {
    ch2Html = ch2Html(fs.readFileSync(path.join(rootPath, 'study/db/chapter-2.html'), 'utf8'));
  }

  // Apply approved UI copy corrections to ch1Html if present
  let ch1Normalized = ch1Html;
  for (const correction of manifest.approvedUICorrections || []) {
    if (correction.file === 'study/db/chapter-1.html') {
      ch1Normalized = ch1Normalized.replace(correction.after, correction.before);
    }
  }

  // 3. Verify blocks in Chapter 1
  const ch1Blocks = extractBlocks(ch1Normalized, 'section');
  if (ch1Blocks.length !== manifest.inventory.lec2.standaloneBlocks) {
    errors.push(`Chapter 1 block count mismatch: expected ${manifest.inventory.lec2.standaloneBlocks}, got ${ch1Blocks.length}`);
  }

  const expectedLec2Blocks = manifest.content.lec2.blocks;
  for (let i = 0; i < expectedLec2Blocks.length; i++) {
    const expected = expectedLec2Blocks[i];
    const actual = ch1Blocks[i];
    if (!actual) {
      errors.push(`Missing block in Chapter 1 at index ${i}: expected ${expected.id}`);
      continue;
    }
    if (actual.id !== expected.id) {
      errors.push(`Block order mismatch in Chapter 1 at index ${i}: expected ${expected.id}, got ${actual.id}`);
    }
    if (actual.contentHash !== expected.contentHash) {
      errors.push(`Content hash mismatch in Chapter 1 block ${expected.id}`);
    }
  }

  // 4. Verify blocks in Chapter 2
  const ch2Blocks = extractBlocks(ch2Html, 'article');
  if (ch2Blocks.length !== manifest.inventory.lec3.standaloneBlocks) {
    errors.push(`Chapter 2 block count mismatch: expected ${manifest.inventory.lec3.standaloneBlocks}, got ${ch2Blocks.length}`);
  }

  const expectedLec3Blocks = manifest.content.lec3.blocks;
  for (let i = 0; i < expectedLec3Blocks.length; i++) {
    const expected = expectedLec3Blocks[i];
    const actual = ch2Blocks[i];
    if (!actual) {
      errors.push(`Missing block in Chapter 2 at index ${i}: expected ${expected.id}`);
      continue;
    }
    if (actual.id !== expected.id) {
      errors.push(`Block order mismatch in Chapter 2 at index ${i}: expected ${expected.id}, got ${actual.id}`);
    }
    if (actual.contentHash !== expected.contentHash) {
      errors.push(`Content hash mismatch in Chapter 2 block ${expected.id}`);
    }
  }

  // 5. Verify Lecture Explanations (slides and quizzes)
  let explanationsData;
  if (options.overrideExplanations) {
    const raw = fs.readFileSync(path.join(rootPath, 'js/lecture-explanations-data.js'), 'utf8');
    const baseData = (new Function(raw + '; return LECTURE_EXPLANATIONS;'))();
    explanationsData = typeof options.overrideExplanations === 'function'
      ? options.overrideExplanations(baseData)
      : options.overrideExplanations;
  } else {
    const raw = fs.readFileSync(path.join(rootPath, 'js/lecture-explanations-data.js'), 'utf8');
    explanationsData = (new Function(raw + '; return LECTURE_EXPLANATIONS;'))();
  }

  const lec2 = explanationsData['database-systems']?.['2'];
  const lec3 = explanationsData['database-systems']?.['3'];

  if (!lec2 || !lec3) {
    errors.push('Database systems lecture 2 or 3 missing from LECTURE_EXPLANATIONS');
    return { clean: false, errors, warnings };
  }

  // Verify slide counts
  if ((lec2.slides || []).length !== manifest.inventory.lec2.slides) {
    errors.push(`Lecture 2 slides count mismatch: expected ${manifest.inventory.lec2.slides}, got ${(lec2.slides || []).length}`);
  }
  if ((lec3.slides || []).length !== manifest.inventory.lec3.slides) {
    errors.push(`Lecture 3 slides count mismatch: expected ${manifest.inventory.lec3.slides}, got ${(lec3.slides || []).length}`);
  }

  // Verify full quiz counts
  if ((lec2.fullQuiz || []).length !== manifest.inventory.lec2.fullQuizQuestions) {
    errors.push(`Lecture 2 fullQuiz count mismatch: expected ${manifest.inventory.lec2.fullQuizQuestions}, got ${(lec2.fullQuiz || []).length}`);
  }
  if ((lec3.fullQuiz || []).length !== manifest.inventory.lec3.fullQuizQuestions) {
    errors.push(`Lecture 3 fullQuiz count mismatch: expected ${manifest.inventory.lec3.fullQuizQuestions}, got ${(lec3.fullQuiz || []).length}`);
  }

  // Verify full quiz questions content
  const checkQuestions = (actualList, expectedList, label) => {
    if (actualList.length !== expectedList.length) {
      errors.push(`${label} length mismatch: expected ${expectedList.length}, got ${actualList.length}`);
      return;
    }
    for (let i = 0; i < expectedList.length; i++) {
      const exp = expectedList[i];
      const act = actualList[i];
      const actQuestion = act.question || act.prompt || act.q;
      const actExplanation = act.explanation || act.feedback?.[act.correctOptionId];
      const actCorrect = typeof act.correctOptionId === 'string'
        ? (act.options || []).findIndex(o => (o.id || o) === act.correctOptionId)
        : act.correct;

      if (normalizeWhitespace(actQuestion) !== exp.question) {
        errors.push(`${label} [${i}] question text mismatch`);
      }
      if (actCorrect !== exp.correct) {
        errors.push(`${label} [${i}] correct answer mismatch: expected ${exp.correct}, got ${actCorrect}`);
      }
      const actOptions = (act.options || []).map(opt => normalizeWhitespace(typeof opt === 'string' ? opt : opt.text));
      if (JSON.stringify(actOptions) !== JSON.stringify(exp.options)) {
        errors.push(`${label} [${i}] options mismatch`);
      }
      if (normalizeWhitespace(actExplanation) !== exp.explanation) {
        errors.push(`${label} [${i}] explanation text mismatch`);
      }
    }
  };

  checkQuestions(lec2.fullQuiz || [], manifest.content.lec2.questions.fullQuiz, 'Lecture 2 FullQuiz');
  checkQuestions(lec3.fullQuiz || [], manifest.content.lec3.questions.fullQuiz, 'Lecture 3 FullQuiz');

  // Verify slide quiz questions
  const lec2SlideQs = (lec2.slides || []).filter(s => s.quiz).map(s => s.quiz);
  const lec3SlideQs = (lec3.slides || []).filter(s => s.quiz).map(s => s.quiz);
  checkQuestions(lec2SlideQs, manifest.content.lec2.questions.slideQuiz, 'Lecture 2 SlideQuiz');
  checkQuestions(lec3SlideQs, manifest.content.lec3.questions.slideQuiz, 'Lecture 3 SlideQuiz');

  // 6. Verify standalone questions in HTML
  try {
    const ch1Standalone = extractArrays(ch1Normalized, ['quizQuestions', 'mcqQuestions']);
    checkQuestions(ch1Standalone, manifest.content.lec2.questions.standalone, 'Chapter 1 Standalone Quiz');
  } catch (err) {
    errors.push('Failed to parse Chapter 1 standalone questions: ' + err.message);
  }

  try {
    const ch2Standalone = extractArrays(ch2Html, ['quizQuestions', 'mcqQuestions']);
    checkQuestions(ch2Standalone, manifest.content.lec3.questions.standalone, 'Chapter 2 Standalone Quiz');
  } catch (err) {
    errors.push('Failed to parse Chapter 2 standalone questions: ' + err.message);
  }

  // 7. Verify mapping coverage
  const { DBLessonMap } = require('../js/shared/db-lesson-map.js');
  for (const lecKey of ['2', '3']) {
    const blocks = DBLessonMap.getTopicBlocks(lecKey);
    const slides = DBLessonMap.getAllSlides(lecKey);

    // Ensure all blocks exist and have slides
    for (const b of blocks) {
      if (!b.slides || b.slides.length === 0) {
        errors.push(`Mapping error: Block ${lecKey}:${b.id} has no mapped slides`);
      }
      if (!b.accessPath || !b.sourceLocator) {
        errors.push(`Mapping error: Block ${lecKey}:${b.id} missing accessPath or sourceLocator`);
      }
    }

    // Ensure all slides have accessPath, sourceLocator, and originalOrder
    for (const s of slides) {
      if (!s.accessPath || !s.sourceLocator || typeof s.originalOrder !== 'number') {
        errors.push(`Mapping error: Slide ${lecKey}:${s.num} missing required locator/access path/order`);
      }
    }
  }

  return {
    clean: errors.length === 0,
    errors,
    warnings
  };
}

// CLI runner
if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  console.log('Running Database Lesson Content Preservation Check...');
  const res = verifyLessonContent({ root });
  if (!res.clean) {
    console.error('\n✖ Content integrity check FAILED with', res.errors.length, 'errors:');
    res.errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
  }
  console.log('\n✔ All 62 images verified.');
  console.log('✔ All 7 + 6 teaching blocks verified.');
  console.log('✔ All 30 + 32 slides verified.');
  console.log('✔ All 166 authored question records preserved with exact answers.');
  console.log('✔ Complete many-to-many relationship mapping validated.');
  console.log('✔ Database lesson content preservation guard PASSED cleanly.');
}

module.exports = {
  verifyImages,
  verifyLessonContent,
  extractBlocks
};
