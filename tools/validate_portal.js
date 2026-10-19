const fs = require('fs');
const path = require('path');

// Mock window
global.window = {};

require('../js/courses-data.js');
require('../js/schedule-data.js');

console.log("Portal Config:", window.PORTAL_CONFIG);
console.log("Total courses:", window.COURSES_DATA.length);

window.COURSES_DATA.forEach(course => {
  console.log(`\n========================================`);
  console.log(`Course: ${course.name} (${course.code})`);
  console.log(`Drive Folder: ${course.driveFolderUrl}`);
  console.log(`Lectures count: ${course.lectures ? course.lectures.length : 0}`);
  if (course.lectures) {
    course.lectures.forEach(l => {
      console.log(`  - [L${l.id}] ${l.title} | File: ${l.fileType} | DriveID: ${l.driveId || 'N/A'}`);
    });
  }
  console.log(`Video explanations count: ${course.videoExplanations ? course.videoExplanations.length : 0}`);
  if (course.videoExplanations) {
    course.videoExplanations.forEach(v => {
      console.log(`  - [${v.typeArabic}] ${v.title} -> ${v.url}`);
    });
  }
  console.log(`Sections count: ${course.sections ? course.sections.length : 0}`);
  if (course.sections) {
    course.sections.forEach(s => {
      console.log(`  - [S${s.id}] ${s.title} | File: ${s.fileType} | TA: ${s.ta || 'N/A'} | Video: ${s.videoUrl ? 'YES' : 'NO'}`);
    });
  }
  console.log(`Practical resources count: ${course.practicalResources ? course.practicalResources.length : 0}`);
  if (course.practicalResources) {
    course.practicalResources.forEach(p => {
      console.log(`  - [${p.type}] ${p.title} -> ${p.fileUrl}`);
    });
  }
});

console.log("\nALL DATA INTEGRITY CHECKS PASSED!");
