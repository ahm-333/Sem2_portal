/**
 * tools/simulate_whatsapp_incoming.js
 * 
 * Interactive / CLI simulator demonstrating how the entire pipeline works:
 * WhatsApp Group Message -> AI Classification -> Google Drive -> Approval -> Portal Update
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const sampleScenarios = [
  {
    id: 1,
    name: "م. أحمد حسام يرسل سكشن معمارية في جروب الدفعة",
    whatsappMessage: {
      groupName: "جروب سكاشن الفرقة الثانية - حاسبات الزقازيق",
      groupJid: "120363294871928374@g.us",
      senderName: "Eng. Ahmed Hossam",
      senderPhone: "+201012345678",
      caption: "مساء الخير يا شباب، دا شيت وسلايدات سكشن 3 معمارية - الجزء الخاص بمسجلات 8086 وحساب العناوين الفيزيائية بالتفصيل.",
      fileName: "Arch_Sec03_8086_Registers.pdf",
      fileSize: "1.4 MB",
      simulatedDriveId: "1p1zE6XWM2uYRn7_MnnkN51IL_HWirf-m"
    },
    expectedParsed: {
      courseId: "computer-architecture",
      type: "section",
      ta: "م. أحمد حسام",
      number: 3,
      title: "Section 3: 8086 Registers & Physical Addressing",
      arabicTitle: "السكشن الثالث: مسجلات معالج 8086 وحساب العناوين الفيزيائية",
      topics: ["مسجلات 8086", "Physical Address", "Segment Registers"],
      notes: "شيت وسلايدات معتمدة من م. أحمد حسام عبر واتساب"
    }
  },
  {
    id: 2,
    name: "م. تقى مصطفى ترسل تكليف/اسايمنت في جروب السكشن",
    whatsappMessage: {
      groupName: "سكشن 3 & 4 - ذكاء اصطناعي",
      groupJid: "120363984729182374@g.us",
      senderName: "Eng Toqa Mostafa",
      senderPhone: "+201123456789",
      caption: "السلام عليكم، دا الاسايمنت العملي الأول لمادة معمارية الحاسوب، التسليم الأسبوع القادم في ميعاد السكشن.",
      fileName: "Assignment_01_Architecture.pdf",
      fileSize: "680 KB",
      simulatedDriveId: "1szFwBUCE8t9-iRjzInLvHtoqUuA_UgQi"
    },
    expectedParsed: {
      courseId: "computer-architecture",
      type: "assignment",
      ta: "م. تقى مصطفى",
      number: 1,
      title: "Assignment 1: 8086 Assembly Tasks",
      arabicTitle: "التكليف العملي الأول: تطبيقات معالج 8086",
      deadline: "الأسبوع القادم في ميعاد السكشن",
      topics: ["8086 Practical Tasks"],
      notes: "تكليف عملي مستلم من م. تقى مصطفى عبر واتساب"
    }
  },
  {
    id: 3,
    name: "رسالة عشوائية / ميمز من طالب في الجروب (سيتم تجاهلها)",
    whatsappMessage: {
      groupName: "جروب سكاشن الفرقة الثانية - حاسبات الزقازيق",
      groupJid: "120363294871928374@g.us",
      senderName: "Mahmoud Ali (طالب)",
      senderPhone: "+201298765432",
      caption: "حد معاه كشكول المحاضرة يشباب ولا أروح أنام أحسن؟ 😂",
      fileName: null,
      fileSize: null,
      simulatedDriveId: null
    },
    expectedParsed: null
  }
];

function printStep(stepNum, title, details) {
  console.log(`\n======================================================`);
  console.log(`[الخطوة ${stepNum}] 🔹 ${title}`);
  console.log(`======================================================`);
  if (details) console.log(details);
}

async function runSimulation(scenarioIndex = 0) {
  const scenario = sampleScenarios[scenarioIndex];

  console.clear();
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║    محاكي أتمتة الواتساب وبورتال حاسبات الزقازيق        ║");
  console.log("║         WhatsApp -> n8n -> Google Drive -> Portal      ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  console.log(`سيناريو المحاكاة: [${scenario.name}]\n`);

  // الخطوة 1: وصول الرسالة من واتساب
  printStep(1, "استقبال الرسالة من Evolution API (Webhook Trigger)", 
    `📱 الشات: ${scenario.whatsappMessage.groupName} (JID: ${scenario.whatsappMessage.groupJid})\n` +
    `👤 المرسل: ${scenario.whatsappMessage.senderName} (${scenario.whatsappMessage.senderPhone})\n` +
    `💬 نص الرسالة (الكابشن): "${scenario.whatsappMessage.caption}"\n` +
    `📎 المرفق: ${scenario.whatsappMessage.fileName || 'لا يوجد ملف مرفق'}`
  );

  // الخطوة 2: الفلترة الذكية للشات والمرفقات
  printStep(2, "الفلترة: هل هذا الشات معتمد وهل الرسالة تحتوي على محتوى دراسي؟", null);
  
  const ALLOWED_GROUPS = [
    "120363294871928374@g.us",
    "120363984729182374@g.us"
  ];

  const isAllowedGroup = ALLOWED_GROUPS.includes(scenario.whatsappMessage.groupJid);
  const hasAcademicFile = !!scenario.whatsappMessage.fileName && /(سكشن|محاضرة|شيت|تاسك|اسايمنت|معمارية)/i.test(scenario.whatsappMessage.caption);

  if (!isAllowedGroup) {
    console.log("❌ تم رفض الرسالة: الشات ليس ضمن الجروبات الأكاديمية المصرح بها (Ignore).");
    return;
  }

  if (!hasAcademicFile) {
    console.log("❌ تم تجاهل الرسالة: الرسالة دردشة عادية ولا تحتوي على ملف أو محتوى دراسي معتمد (Drop).");
    console.log("✅ النتيجة: الموقع محمي 100% ولن يتأثر بهذه الرسائل العادية.");
    return;
  }

  console.log("✅ الشات مصرح به، وتم رصد مرفق دراسي معتمد!");

  // الخطوة 3: تحليل الذكاء الاصطناعي (Gemini AI)
  printStep(3, "تحليل الكابشن وتصنيف المحتوى بواسطة (Gemini 1.5 Flash)",
    `تم استخراج البيانات بدقة:\n` +
    JSON.stringify(scenario.expectedParsed, null, 2)
  );

  // الخطوة 4: الرفع على Google Drive
  printStep(4, "رفع الملف إلى Google Drive في مجلد المعيد المناسب",
    `📁 المجلد المستهدف: مجلد [${scenario.expectedParsed.ta}] لمادة [${scenario.expectedParsed.courseId}]\n` +
    `🔗 معرف الدرايف المولد (Drive ID): ${scenario.whatsappMessage.simulatedDriveId}\n` +
    `🌐 الرابط المباشر: https://drive.google.com/file/d/${scenario.whatsappMessage.simulatedDriveId}/view\n` +
    `🔓 صلاحية الرابط: Anyone with link (Viewer)`
  );

  // الخطوة 5: زر الاعتماد البشري (Human-in-the-Loop)
  printStep(5, "إرسال إشعار زر الاعتماد لك (Telegram / WhatsApp)",
    `┌────────────────────────────────────────────────────────┐\n` +
    `│ 📥 وصل محتوى جديد من واتساب:                           │\n` +
    `│ 📚 المادة: ${scenario.expectedParsed.courseId}                    │\n` +
    `│ 👨‍🏫 المعيد: ${scenario.expectedParsed.ta}                             │\n` +
    `│ 🔢 النوع: ${scenario.expectedParsed.type} رقم ${scenario.expectedParsed.number}                         │\n` +
    `│ 🏷️ العنوان: ${scenario.expectedParsed.arabicTitle}   │\n` +
    `│ 📁 رابط الدرايف: https://drive.google.com/...          │\n` +
    `│                                                        │\n` +
    `│  [ ✅ اعتماد ونشر في البورتال ]      [ ❌ تجاهل وحذف ] │\n` +
    `└────────────────────────────────────────────────────────┘`
  );

  // الخطوة 6: تنفيذ النشر عند الموافقة
  printStep(6, "اختبار حقن البيانات في البورتال بواسطة السكريبت الآلي", null);

  const payload = {
    courseId: scenario.expectedParsed.courseId,
    type: scenario.expectedParsed.type,
    ta: scenario.expectedParsed.ta,
    number: scenario.expectedParsed.number,
    title: scenario.expectedParsed.title,
    arabicTitle: scenario.expectedParsed.arabicTitle,
    driveId: scenario.whatsappMessage.simulatedDriveId,
    driveViewUrl: `https://drive.google.com/file/d/${scenario.whatsappMessage.simulatedDriveId}/view`,
    topics: scenario.expectedParsed.topics,
    notes: scenario.expectedParsed.notes
  };

  const payloadPath = path.resolve(__dirname, 'temp_sim_payload.json');
  fs.writeFileSync(payloadPath, JSON.stringify(payload, null, 2), 'utf-8');

  try {
    const result = execSync(`node "${path.resolve(__dirname, 'add_material_from_webhook.js')}" "${payloadPath}" --dry-run`, { encoding: 'utf-8' });
    console.log(result);
  } finally {
    if (fs.existsSync(payloadPath)) fs.unlinkSync(payloadPath);
  }

  console.log("\n======================================================");
  console.log("🎉 تمت تجربة المحاكاة بنجاح 100%!");
  console.log("هذا تماماً ما سيحدث في الخلفية بدون أي تدخل منك سوى الضغط على زر الاعتماد!");
  console.log("======================================================\n");
}

const scenarioArg = process.argv[2] ? parseInt(process.argv[2], 10) - 1 : 0;
runSimulation(isNaN(scenarioArg) ? 0 : scenarioArg);
