/**
 * tools/add_material_from_webhook.js
 * 
 * Helper script invoked by GitHub Actions (via n8n repository_dispatch)
 * or run manually to safely inject a newly received WhatsApp material
 * into js/courses-data.js, validate the result, and bump asset versions.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COURSES_DATA_PATH = path.resolve(__dirname, '../js/courses-data.js');

function loadPayload() {
  // Can be passed via process.env.PAYLOAD (JSON string) or CLI argument
  let rawPayload = process.env.PAYLOAD;
  if (!rawPayload && process.argv[2]) {
    if (process.argv[2].startsWith('{')) {
      rawPayload = process.argv[2];
    } else if (fs.existsSync(process.argv[2])) {
      rawPayload = fs.readFileSync(process.argv[2], 'utf-8');
    }
  }

  if (rawPayload) {
    rawPayload = rawPayload.replace(/^\uFEFF/, '').trim();
  }

  if (!rawPayload) {
    console.error("Usage: node add_material_from_webhook.js <json-file-or-string> or set PAYLOAD env var");
    process.exit(1);
  }

  try {
    return JSON.parse(rawPayload);
  } catch (e) {
    console.error("Error: Failed to parse payload JSON:", e.message);
    process.exit(1);
  }
}

function normalizeDriveUrls(driveId, givenUrl) {
  let id = driveId;
  if (!id && givenUrl) {
    const match = givenUrl.match(/[-\w]{25,}/);
    if (match) id = match[0];
  }
  if (!id) return { driveId: '', driveViewUrl: givenUrl || '', drivePreviewUrl: givenUrl || '', driveDownloadUrl: givenUrl || '' };

  return {
    driveId: id,
    driveViewUrl: `https://drive.google.com/file/d/${id}/view`,
    drivePreviewUrl: `https://drive.google.com/file/d/${id}/preview`,
    driveDownloadUrl: `https://drive.google.com/uc?export=download&id=${id}`
  };
}

function main() {
  const isDryRun = process.argv.includes('--dry-run');
  const payload = loadPayload();

  console.log("=== Add Material Automation ===");
  console.log(`Course ID : ${payload.courseId}`);
  console.log(`Type      : ${payload.type}`);
  console.log(`TA/Doctor : ${payload.ta || payload.doctor || 'N/A'}`);
  console.log(`Title     : ${payload.arabicTitle || payload.title}`);

  if (!payload.courseId || !payload.type) {
    console.error("Error: 'courseId' and 'type' are required fields.");
    process.exit(1);
  }

  // Load existing courses data
  global.window = {};
  require(COURSES_DATA_PATH);
  const courses = global.window.COURSES_DATA;
  const course = courses.find(c => c.id === payload.courseId);

  if (!course) {
    console.error(`Error: Course with id '${payload.courseId}' not found.`);
    process.exit(1);
  }

  const driveInfo = normalizeDriveUrls(payload.driveId, payload.driveUrl || payload.driveViewUrl || payload.url);

  let targetArrayName = 'sections';
  let formattedItem = {};

  if (payload.type === 'lecture') {
    targetArrayName = 'lectures';
    const nextId = (course.lectures && course.lectures.length > 0)
      ? Math.max(...course.lectures.map(l => l.id || 0)) + 1
      : 1;
    const weekNum = payload.week || payload.number || nextId;

    formattedItem = {
      id: nextId,
      chapter: payload.chapter || `Chapter ${weekNum}`,
      title: payload.title || `Lecture ${weekNum}`,
      arabicTitle: payload.arabicTitle || `المحاضرة ${weekNum}`,
      doctor: payload.doctor || "سلايدات موحدة للدفعة",
      doctorNote: payload.doctorNote || "B1 • B2 • B3",
      week: weekNum,
      date: payload.date || `المحاضرة ${weekNum}`,
      fileType: payload.fileType || "pdf",
      pages: payload.pages || 40,
      size: payload.size || "Google Drive PDF",
      driveId: driveInfo.driveId,
      driveViewUrl: driveInfo.driveViewUrl,
      drivePreviewUrl: driveInfo.drivePreviewUrl,
      driveDownloadUrl: driveInfo.driveDownloadUrl,
      pdfUrl: driveInfo.drivePreviewUrl,
      topics: Array.isArray(payload.topics) ? payload.topics : [payload.arabicTitle || payload.title || "محتوى المحاضرة"],
      notes: payload.notes || "تمت إضافة السلايدات آلياً عبر واتساب المحاضرات"
    };
  } else if (payload.type === 'assignment' || payload.type === 'task') {
    targetArrayName = 'assignments';
    const nextId = (course.assignments && course.assignments.length > 0)
      ? Math.max(...course.assignments.map(a => a.id || 0)) + 1
      : 1;
    const taskNum = payload.number || nextId;

    formattedItem = {
      id: nextId,
      number: taskNum,
      title: payload.title || `Assignment ${taskNum}`,
      arabicTitle: payload.arabicTitle || `التكليف ${taskNum}`,
      ta: payload.ta || "معيد المادة",
      deadline: payload.deadline || "يحدد لاحقاً",
      status: payload.status || "متاح للتسليم",
      statusType: payload.statusType || "active",
      requirements: Array.isArray(payload.requirements) ? payload.requirements : [
        payload.notes || payload.arabicTitle || "تفاصيل التكليف مرفقة في الملف"
      ],
      driveUrl: driveInfo.driveViewUrl,
      notes: payload.notes || "تم استلام التكليف آلياً من واتساب"
    };
  } else {
    // Default to 'section'
    targetArrayName = 'sections';
    const nextId = (course.sections && course.sections.length > 0)
      ? Math.max(...course.sections.map(s => s.id || 0)) + 1
      : 1;
    const secNum = payload.number || payload.week || nextId;

    formattedItem = {
      id: nextId,
      title: payload.title || `Section ${secNum} - Practical Work`,
      arabicTitle: payload.arabicTitle || `السكشن ${secNum} العملي`,
      ta: payload.ta || "معيد السكشن",
      week: secNum,
      date: payload.date || `السكشن ${secNum}`,
      fileType: payload.fileType || "pdf",
      size: payload.size || "Google Drive",
      driveId: driveInfo.driveId,
      driveViewUrl: driveInfo.driveViewUrl,
      drivePreviewUrl: driveInfo.drivePreviewUrl,
      driveDownloadUrl: driveInfo.driveDownloadUrl,
      sheetUrl: driveInfo.driveViewUrl,
      topics: Array.isArray(payload.topics) ? payload.topics : [payload.arabicTitle || payload.title || "تطبيقات وتمارين عملية"],
      notes: payload.notes || `شيت وسلايدات السكشن - من إعداد ${payload.ta || 'معيد المادة'}`
    };
  }

  console.log(`Generated Item for [${targetArrayName}]:`, JSON.stringify(formattedItem, null, 2));

  // Now safely insert into js/courses-data.js text
  let fileText = fs.readFileSync(COURSES_DATA_PATH, 'utf-8');

  // Find course block
  const courseIdRegex = new RegExp(`id:\\s*["']${payload.courseId}["']`, 'm');
  const courseMatch = courseIdRegex.exec(fileText);
  if (!courseMatch) {
    console.error(`Error: Could not locate course with id '${payload.courseId}' in file text.`);
    process.exit(1);
  }

  const courseStartIndex = courseMatch.index;
  // Search for the target array within this course
  const arrayHeaderRegex = new RegExp(`${targetArrayName}:\\s*\\[`, 'g');
  arrayHeaderRegex.lastIndex = courseStartIndex;
  const arrayMatch = arrayHeaderRegex.exec(fileText);

  if (!arrayMatch) {
    console.error(`Error: Could not find array '${targetArrayName}: [' for course '${payload.courseId}'.`);
    process.exit(1);
  }

  const insertPos = arrayMatch.index + arrayMatch[0].length;
  const itemFormatted = '\n      ' + JSON.stringify(formattedItem, null, 6)
    .replace(/^\{/, '{\n')
    .replace(/\n/g, '\n      ')
    + ',';

  const updatedFileText = fileText.slice(0, insertPos) + itemFormatted + fileText.slice(insertPos);

  if (isDryRun) {
    console.log("Dry-run completed successfully! (No file changes written)");
    return;
  }

  // Backup file before write
  fs.writeFileSync(COURSES_DATA_PATH + '.bak', fileText, 'utf-8');
  fs.writeFileSync(COURSES_DATA_PATH, updatedFileText, 'utf-8');

  console.log("File updated. Running validation...");

  try {
    // Run validation script
    execSync('node ' + path.resolve(__dirname, 'validate_portal.js'), { stdio: 'inherit' });
    // Run bump-version script
    execSync('node ' + path.resolve(__dirname, 'bump-version.js'), { stdio: 'inherit' });
    // Remove backup
    if (fs.existsSync(COURSES_DATA_PATH + '.bak')) {
      fs.unlinkSync(COURSES_DATA_PATH + '.bak');
    }
    console.log("\n SUCCESS: Material added and portal validated 100%!");
  } catch (err) {
    console.error("\n Validation failed! Restoring backup...");
    if (fs.existsSync(COURSES_DATA_PATH + '.bak')) {
      fs.copyFileSync(COURSES_DATA_PATH + '.bak', COURSES_DATA_PATH);
      fs.unlinkSync(COURSES_DATA_PATH + '.bak');
    }
    process.exit(1);
  }
}

main();
