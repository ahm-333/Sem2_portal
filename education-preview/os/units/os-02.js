(function(root) {
  'use strict';
  const lesson = {
  "id": "os-02",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "1",
  "title": "Computer startup",
  "subtitle": "من ضغطة Power لحد تشغيل Kernel: مين بيبدأ الأول؟",
  "sources": [
    {
      "id": "current-ch1",
      "title": "Chapter 1 · Introduction",
      "driveId": "14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M",
      "url": "https://drive.google.com/file/d/14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M/view",
      "sha256": "c81ae8d50d261ffbd4c78ebf75b42f3f980c50298bba19b32f5779b3d1745e7b",
      "slides": [
        9
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-02-bootstrap",
      "title": "The bootstrap program starts first",
      "eyebrow": "01 · نفهمها بمثال",
      "summary": "Startup code prepares the system before the kernel runs.",
      "paragraphs": [
        "إنت ضغطت <bdi lang=\"en\">Power</bdi> أو عملت <bdi lang=\"en\">Reboot</bdi>. لسه الـ<bdi lang=\"en\">Kernel</bdi> ما بدأش شغله. لازم تعليمات أولية تجهّز الجهاز وتبدأ تحميله؛ دي وظيفة الـ<bdi lang=\"en\">Bootstrap program</bdi>.",
        "السلايد بيحط ثلاث خطوات أساسية: الـ<bdi lang=\"en\">Bootstrap</bdi> يبدأ عند التشغيل، يجهّز مكوّنات النظام، وبعدها يحمّل الـ<bdi lang=\"en\">OS kernel</bdi> ويبدأ تنفيذه. التهيئة هنا تجهيز الأجزاء علشان النظام يقدر يستخدمها."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            9
          ]
        }
      ]
    },
    {
      "id": "os-02-firmware",
      "title": "Firmware and the kernel have different roles",
      "eyebrow": "02 · نفهمها بمثال",
      "summary": "Firmware holds early startup instructions; the bootstrap loads and starts the OS kernel.",
      "paragraphs": [
        "تعليمات البداية محتاجة تكون متاحة قبل البرامج العادية. السلايد بيقول إنها عادةً بتكون في <bdi lang=\"en\">ROM</bdi> أو <bdi lang=\"en\">EPROM</bdi>، وبيسمّي البرامج المحفوظة بالطريقة دي <bdi lang=\"en\">Firmware</bdi>.",
        "ما تخلطش المكان بالدور: <bdi lang=\"en\">Firmware</bdi> وصف لبرامج محفوظة في الجهاز، و<bdi lang=\"en\">Bootstrap</bdi> دور تعليمات البداية. الـ<bdi lang=\"en\">Kernel</bdi> هو الجزء الأساسي من الـ<bdi lang=\"en\">OS</bdi> اللي بيبدأ بعد التحميل؛ مش هو اللي لازم يحمّل نفسه من نقطة الصفر."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            9
          ]
        }
      ],
      "clarification": "وصف ROM/EPROM هو الصياغة النموذجية في مصدر 2013. تفاصيل مراحل بدء التشغيل ووسيط الـFirmware بتختلف حسب الجهاز؛ الرسم هنا بيلخّص الدور، مش كل مراحل جهاز بعينه."
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-02-startup-order",
      "type": "mcq",
      "placement": "os-02-bootstrap",
      "objective": "Order the source startup responsibilities.",
      "prerequisites": [
        "os-02-bootstrap"
      ],
      "prompt": "Which sequence matches the startup overview?",
      "options": [
        {
          "id": "os-02-startup-order-3",
          "text": "Word runs → loads kernel → initializes hardware"
        },
        {
          "id": "os-02-startup-order-1",
          "text": "Bootstrap runs → initializes system → loads and starts kernel"
        },
        {
          "id": "os-02-startup-order-2",
          "text": "Kernel runs → creates firmware → power-up begins"
        }
      ],
      "correctOptionId": "os-02-startup-order-1",
      "feedback": {
        "os-02-startup-order-1": "صح؛ ده ترتيب الأدوار في السلايد، حتى لو الجهاز الحقيقي فيه مراحل أكتر.",
        "os-02-startup-order-2": "Power-up بيبدأ قبل Kernel، والـFirmware مش بيتعمل من جديد بواسطة Kernel عند كل تشغيل.",
        "os-02-startup-order-3": "Word محتاج بيئة التشغيل؛ هو مش برنامج البداية اللي السلايد بيشرحه."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            9
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-02-kernel-first",
      "type": "true-false",
      "placement": "os-02-firmware",
      "objective": "Distinguish early startup code from the kernel.",
      "prerequisites": [
        "os-02-firmware"
      ],
      "prompt": "The kernel must already be executing for the bootstrap program to begin.",
      "options": [
        {
          "id": "os-02-kernel-first-true",
          "text": "True · صح"
        },
        {
          "id": "os-02-kernel-first-false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-02-kernel-first-false",
      "feedback": {
        "os-02-kernel-first-true": "غلط؛ Bootstrap بيبدأ قبل تشغيل Kernel، ويجهّز النظام ويحمّله.",
        "os-02-kernel-first-false": "بالضبط؛ تعليمات البداية هي اللي تجهّز الطريق لتحميل Kernel وتشغيله."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            9
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-02-firmware-role",
      "type": "mcq",
      "placement": "os-02-firmware",
      "objective": "Recognize firmware as persistent startup software.",
      "prerequisites": [
        "os-02-firmware"
      ],
      "prompt": "Why is firmware relevant before normal applications can run?",
      "options": [
        {
          "id": "os-02-firmware-role-2",
          "text": "It is the document currently open in Word"
        },
        {
          "id": "os-02-firmware-role-3",
          "text": "It means all programs are currently running in RAM"
        },
        {
          "id": "os-02-firmware-role-1",
          "text": "It supplies stored early startup instructions"
        }
      ],
      "correctOptionId": "os-02-firmware-role-1",
      "feedback": {
        "os-02-firmware-role-1": "صح؛ تعليمات البداية لازم تكون متاحة قبل تشغيل Kernel والبرامج العادية.",
        "os-02-firmware-role-2": "المستند بيانات مستخدم؛ Firmware برامج محفوظة في الجهاز ليها دور في البداية.",
        "os-02-firmware-role-3": "وجود Firmware مش معناه إن كل البرامج محمّلة أو شغّالة؛ هو وصف لمكان وطريقة حفظ برامج زي تعليمات البداية."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            9
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    }
  ],
  "glossary": [
    {
      "id": "os-02-glossary-bootstrap",
      "term": "Bootstrap program",
      "translation": "برنامج بدء التشغيل",
      "definition": "Startup code that initializes the system and loads and starts the operating system kernel.",
      "explanation": "أول تعليمات بتجهّز الجهاز وتوصلنا لتشغيل Kernel.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            9
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-02-glossary-firmware",
      "term": "Firmware",
      "translation": "برامج محفوظة داخل الجهاز",
      "definition": "Software stored in a device’s nonvolatile memory, including early startup code.",
      "explanation": "تعليمات محفوظة في الجهاز، ومش محتاجة برنامج عادي شغّال علشان تبدأ.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            9
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-02-glossary-rom",
      "term": "ROM / EPROM",
      "translation": "أمثلة لذاكرة بتحفظ تعليمات البداية",
      "definition": "Nonvolatile memory technologies named in the slide as typical firmware storage.",
      "explanation": "السلايد بيذكرهم كمكان نموذجي لتعليمات البداية؛ مش وصف إلزامي لكل جهاز.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            9
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-02-glossary-initialize",
      "term": "Initialize",
      "translation": "يجهّز للاستخدام",
      "definition": "Prepare system components for operation.",
      "explanation": "يخلّي المكوّنات جاهزة قبل ما Kernel يبدأ.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            9
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-02-glossary-kernel",
      "term": "Kernel",
      "translation": "الجزء الأساسي من نظام التشغيل",
      "definition": "The core of the operating system that startup code loads and starts.",
      "explanation": "هنا المهم نفرّقه عن برنامج البداية اللي بيحمّله.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            9
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-02-glossary-reboot",
      "term": "Reboot",
      "translation": "إعادة تشغيل",
      "definition": "Restart a computer’s startup sequence.",
      "explanation": "Restart بيرجّع الجهاز لمرحلة البداية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            9
          ]
        }
      ],
      "kind": "source-concept"
    }
  ],
  "visualizations": [
    {
      "id": "os-02-boot-trace",
      "conceptId": "os-02-bootstrap",
      "title": "From reset to kernel execution",
      "description": "اتبع الترتيب مرة واحدة، واسأل في كل خطوة: إيه اللي بقى جاهز؟",
      "legend": "الأسهم ترتيب خطوات، مش أسلاك ولا حركة كهربا. الإطار الأخير معناه إن التنفيذ بدأ في Kernel. ده نموذج مبسّط من السلايد، من غير افتراض زمن لكل خطوة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            9
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 400\" role=\"img\"><defs><marker id=\"arrow\" markerWidth=\"9\" markerHeight=\"9\" refX=\"8\" refY=\"4\" orient=\"auto\"><path d=\"M0 0 L8 4 L0 8 Z\" fill=\"#315e72\"/></marker></defs><rect width=\"760\" height=\"400\" fill=\"#f8fbfc\"/><g data-node=\"reset\"><rect x=\"35\" y=\"45\" width=\"200\" height=\"80\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"135\" y=\"92\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Power-up / reboot</text></g><path d=\"M235 85 L290 85\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><g data-node=\"firmware\"><rect x=\"295\" y=\"45\" width=\"420\" height=\"80\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"505\" y=\"92\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Bootstrap instructions in firmware</text></g><path d=\"M505 125 L505 175\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><g data-node=\"initialize\"><rect x=\"295\" y=\"180\" width=\"420\" height=\"70\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"505\" y=\"222\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Initialize system components</text></g><path d=\"M505 250 L505 295\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><g data-node=\"kernel\"><rect x=\"295\" y=\"300\" width=\"420\" height=\"70\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"505\" y=\"342\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Load kernel → start execution</text></g><text x=\"35\" y=\"210\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Before kernel runs</text><text x=\"35\" y=\"240\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">startup code must act</text></svg>",
      "steps": [
        {
          "id": "os-02-boot-trace-step-1",
          "title": "Reset",
          "detail": "التشغيل أو Reboot يبدأ مرحلة البداية؛ Kernel لسه ما اتنفّذش.",
          "focus": [
            "reset"
          ]
        },
        {
          "id": "os-02-boot-trace-step-2",
          "title": "Bootstrap",
          "detail": "تعليمات البداية موجودة في Firmware وتقدر تبدأ قبل البرامج العادية.",
          "focus": [
            "firmware"
          ]
        },
        {
          "id": "os-02-boot-trace-step-3",
          "title": "Initialize",
          "detail": "تجهيز مكوّنات النظام خطوة قبل بدء Kernel.",
          "focus": [
            "initialize"
          ]
        },
        {
          "id": "os-02-boot-trace-step-4",
          "title": "Load and start",
          "detail": "تحميل Kernel لوحده مش آخر القصة؛ لازم يبدأ تنفيذ تعليماته.",
          "focus": [
            "kernel"
          ]
        }
      ]
    }
  ]
};
  if (typeof module !== 'undefined' && module.exports) module.exports = lesson;
  if (root) root.OSPilotLesson = lesson;
})(typeof window !== 'undefined' ? window : null);
