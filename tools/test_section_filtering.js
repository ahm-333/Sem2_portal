const fs = require('fs');
const path = require('path');

global.window = global;
global.localStorage = {
  data: {},
  getItem(k) { return this.data[k] || null; },
  setItem(k, v) { this.data[k] = String(v); }
};

require('../js/courses-data.js');
require('../js/schedule-data.js');

const archCourse = window.COURSES_DATA.find(c => c.id === 'computer-architecture');
const dsCourse = window.COURSES_DATA.find(c => c.id === 'data-structure');

console.log("=== Testing Section 1 (Amal Magdy for Arch, Ahmed Hossam for DS) ===");
StudentProfile.set("B1", 1);
const staffArch1 = StudentProfile.getCourseStaff('computer-architecture');
const staffDS1 = StudentProfile.getCourseStaff('data-structure');

console.log("Section 1 Arch TA:", staffArch1.ta);
console.log("Section 1 DS TA:", staffDS1.ta);

// Arch sections for Section 1
const archSecs1 = archCourse.sections.filter(s => StudentProfile.isTaMatch(s.ta, staffArch1.ta));
console.log("Arch sections matching Section 1 TA (Amal):", archSecs1.length);
archSecs1.forEach(s => console.log(`  - [S${s.id}] ${s.title} (TA: ${s.ta})`));

const archSecs1HasToqa = archSecs1.some(s => s.ta.includes('تقى'));
if (archSecs1HasToqa) {
  throw new Error("FAIL: Section 1 sees Eng. Toqa's sections!");
} else {
  console.log("PASS: Section 1 does NOT see Eng. Toqa's sections!");
}

// Arch Drive for Section 1
const archDrive1 = archCourse.sectionsDriveFolders.filter(f => !f.ta || StudentProfile.isTaMatch(f.ta, staffArch1.ta));
console.log("Arch Drive folders for Section 1:", archDrive1.map(f => f.title));
if (archDrive1.some(f => f.title.includes('تقى'))) {
  throw new Error("FAIL: Section 1 sees Eng. Toqa's Drive folder!");
} else {
  console.log("PASS: Section 1 does NOT see Eng. Toqa's Drive folder!");
}

// Arch Theory Resources for Section 1
const archRes1 = archCourse.resources.filter(r => !r.ta || StudentProfile.isTaMatch(r.ta, staffArch1.ta));
console.log("Arch resources for Section 1:", archRes1.length);
if (archRes1.some(r => r.ta && r.ta.includes('تقى'))) {
  throw new Error("FAIL: Section 1 sees Eng. Toqa's memos!");
} else {
  console.log("PASS: Section 1 does NOT see Eng. Toqa's memos!");
}

// DS Sections for Section 1
const dsSecs1 = dsCourse.sections.filter(s => StudentProfile.isTaMatch(s.ta, staffDS1.ta));
console.log("DS sections for Section 1 (Ahmed Hossam):", dsSecs1.length);
dsSecs1.forEach(s => console.log(`  - [S${s.id}] ${s.title} (TA: ${s.ta})`));
if (dsSecs1.length !== 2) throw new Error("FAIL: Section 1 should see Ahmed Hossam's 2 sections in DS!");

// DS Assignments for Section 1
const dsAssign1 = dsCourse.assignments.filter(a => !a.ta || StudentProfile.isTaMatch(a.ta, staffDS1.ta));
console.log("DS assignments for Section 1:", dsAssign1.length);
if (dsAssign1.length !== 1) throw new Error("FAIL: Section 1 should see Ahmed Hossam's Task 1 in DS!");

console.log("\n=== Testing Section 3 (Toqa Mostafa for Arch, Hager Gamal for DS) ===");
StudentProfile.set("B1", 3);
const staffArch3 = StudentProfile.getCourseStaff('computer-architecture');
const staffDS3 = StudentProfile.getCourseStaff('data-structure');

console.log("Section 3 Arch TA:", staffArch3.ta);
console.log("Section 3 DS TA:", staffDS3.ta);

// Arch sections for Section 3
const archSecs3 = archCourse.sections.filter(s => StudentProfile.isTaMatch(s.ta, staffArch3.ta));
console.log("Arch sections matching Section 3 TA (Toqa):", archSecs3.length);
archSecs3.forEach(s => console.log(`  - [S${s.id}] ${s.title} (TA: ${s.ta})`));

const archSecs3HasAmal = archSecs3.some(s => s.ta.includes('أمل'));
if (archSecs3HasAmal) {
  throw new Error("FAIL: Section 3 sees Eng. Amal's sections!");
} else {
  console.log("PASS: Section 3 does NOT see Eng. Amal's sections!");
}

// Arch Drive for Section 3
const archDrive3 = archCourse.sectionsDriveFolders.filter(f => !f.ta || StudentProfile.isTaMatch(f.ta, staffArch3.ta));
console.log("Arch Drive folders for Section 3:", archDrive3.map(f => f.title));
if (archDrive3.some(f => f.title.includes('أمل'))) {
  throw new Error("FAIL: Section 3 sees Eng. Amal's Drive folder!");
} else {
  console.log("PASS: Section 3 does NOT see Eng. Amal's Drive folder!");
}

// Arch Theory Resources for Section 3
const archRes3 = archCourse.resources.filter(r => !r.ta || StudentProfile.isTaMatch(r.ta, staffArch3.ta));
console.log("Arch resources for Section 3:", archRes3.length);
if (archRes3.length !== 2) throw new Error("FAIL: Section 3 SHOULD see Eng. Toqa's memos!");
console.log("PASS: Section 3 sees Eng. Toqa's memos!");

// DS Sections for Section 3 (Hager Gamal)
const dsSecs3 = dsCourse.sections.filter(s => StudentProfile.isTaMatch(s.ta, staffDS3.ta));
console.log("DS sections for Section 3 (Hager):", dsSecs3.length);
if (dsSecs3.length !== 0) throw new Error("FAIL: Hager has no sections, should be 0!");
console.log("PASS: Section 3 does not see Ahmed Hossam's sections by default!");

console.log("\n=== Testing Section 10 (Shaheda Ahmed for Arch, Fatima Mahmoud for DS) ===");
StudentProfile.set("B3", 10);
const staffArch10 = StudentProfile.getCourseStaff('computer-architecture');
const staffDS10 = StudentProfile.getCourseStaff('data-structure');

console.log("Section 10 Arch TA:", staffArch10.ta);
console.log("Section 10 DS TA:", staffDS10.ta);

const archSecs10 = archCourse.sections.filter(s => StudentProfile.isTaMatch(s.ta, staffArch10.ta));
console.log("Arch sections for Section 10 (Shaheda):", archSecs10.length);
if (archSecs10.length !== 0) throw new Error("FAIL: Shaheda has no sections, should be 0!");
console.log("PASS: Section 10 does not see Amal or Toqa sections by default!");

console.log("\n🎉 ALL SECTION FILTERING TESTS PASSED PERFECTLY!");
