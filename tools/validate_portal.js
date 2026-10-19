const fs = require('fs');
const path = require('path');

// Mock window
global.window = {};

require('../js/courses-data.js');
require('../js/schedule-data.js');
require('../js/lecture-explanations-data.js');

console.log("Portal Config:", window.PORTAL_CONFIG);
console.log("Total courses:", window.COURSES_DATA.length);

if (window.LECTURE_EXPLANATIONS) {
  console.log("\n========================================");
  console.log("Smart Lecture Walkthrough Datasets:");
  Object.keys(window.LECTURE_EXPLANATIONS).forEach(cid => {
    const lecs = window.LECTURE_EXPLANATIONS[cid];
    Object.keys(lecs).forEach(lid => {
      const item = lecs[lid];
      console.log(`- Course: ${cid} | Lecture: ${lid} | Slides: ${item.slides.length}`);
      item.slides.forEach(s => {
        const fullImgPath = path.resolve(__dirname, '..', s.image);
        if (!fs.existsSync(fullImgPath)) {
          throw new Error(`Missing image for slide #${s.num}: ${fullImgPath}`);
        }
      });
    });
  });
}

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
