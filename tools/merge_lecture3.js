const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '..', 'js', 'lecture-explanations-data.js');
const lecture3Payload = JSON.parse(fs.readFileSync(path.join(__dirname, 'lecture3_payload.json'), 'utf8'));

// Require current file
let currentData;
try {
  currentData = require(targetFilePath);
} catch (e) {
  console.error("Error requiring current file:", e);
  process.exit(1);
}

if (!currentData["database-systems"]) {
  currentData["database-systems"] = {};
}

currentData["database-systems"][3] = lecture3Payload;

const fileContent = `/**
 * ==============================================================================
 * ملف بيانات الشرح التفاعلي الذكي للمحاضرات (Smart Lecture Walkthrough Data)
 * ==============================================================================
 * يحتوي على تفكيك كامل لكل شريحة من شرائح المحاضرة:
 * - صورة السلايد الأصلية بدقة عالية
 * - الشرح بالعامية المصرية الممتعة والذكية مدمجة بمصطلحات السلايدات
 * - تفكيك المفاهيم المتعددة في بطاقات منفصلة وواضحة (Points breakdown)
 * - تفكيك المخططات والرسومات حتة حتة (Diagram Deconstruction)
 * - مقارنات امتحانية مباشرة وسريعة (Comparisons: X vs Y)
 * - أمثلة واقعية من الحياة العملية (Real-world examples)
 * - كود الغش الامتحاني: لو شوفت كذا اختار كذا (Exam Triggers)
 * - الكلمات المفتاحية والمصطلحات الأكاديمية (Keywords)
 * - تريكات وفخاخ الامتحان بتباين وألوان واضحة (Exam Tricks)
 * - كويز تفاعلي فوري بالإنجليزية مع تفسير الإجابة بالعامية المصرية ومصطلحات المادة
 * - كويز شامل على المحاضرة من السلايدات يغطي كل الأجزاء في تاب مستقل (Full Quiz)
 */

const LECTURE_EXPLANATIONS = ${JSON.stringify(currentData, null, 2)};

if (typeof window !== "undefined") {
  window.LECTURE_EXPLANATIONS = LECTURE_EXPLANATIONS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = LECTURE_EXPLANATIONS;
}
`;

fs.writeFileSync(targetFilePath, fileContent, 'utf8');
console.log("Successfully merged Lecture 3 into js/lecture-explanations-data.js!");
console.log("Total file size:", fs.statSync(targetFilePath).size, "bytes");
