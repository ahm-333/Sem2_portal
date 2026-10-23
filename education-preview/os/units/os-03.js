(function(root){'use strict';const lesson={
  "id": "os-03",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "1",
  "title": "I/O, controllers and interrupts",
  "subtitle": "الجهاز يشتغل جنب CPU، وبعدين يبلّغه إزاي؟",
  "sources": [
    {
      "id": "current-ch1",
      "title": "Chapter 1 · Introduction",
      "driveId": "14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M",
      "url": "https://drive.google.com/file/d/14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M/view",
      "sha256": "c81ae8d50d261ffbd4c78ebf75b42f3f980c50298bba19b32f5779b3d1745e7b",
      "slides": [
        10,
        11,
        12
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-03-shared-memory",
      "title": "CPU and controllers share access to memory",
      "eyebrow": "01 · نفهمها بمثال",
      "summary": "CPU and devices can make progress concurrently while competing for shared resources.",
      "paragraphs": [
        "تخيّل <bdi lang=\"en\">CPU</bdi> بينفّذ تعليمات برنامج، وفي نفس الفترة جهاز بيقرأ بيانات. ده <bdi lang=\"en\">Concurrent execution</bdi>: شغلهم بيتقدّم خلال نفس الفترة، مش لازم CPU يقف طول وقت الجهاز.",
        "في نموذج سلايد 10، CPU و<bdi lang=\"en\">Device controllers</bdi> متوصلين عن طريق <bdi lang=\"en\">Common bus</bdi> يوصلهم للـ<bdi lang=\"en\">Shared memory</bdi>. أكتر من طرف ممكن يحتاج الذاكرة، فبيتزاحموا على فرص الوصول؛ التزامن مش معناه وصول غير محدود في نفس اللحظة."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            10,
            11
          ]
        }
      ],
      "clarification": "ده نموذج التنظيم المعروض في المحاضرة؛ مش خريطة توصيل إلزامية لكل Hardware حديث."
    },
    {
      "id": "os-03-local-buffer",
      "title": "A controller is not the device itself",
      "eyebrow": "02 · نفهمها بمثال",
      "summary": "A device controller manages a device type and has a local buffer for data.",
      "paragraphs": [
        "الـ<bdi lang=\"en\">Device controller</bdi> جزء بيدير نوع معيّن من الأجهزة. الـ<bdi lang=\"en\">Local buffer</bdi> مساحة مؤقتة عند الـController؛ مش هي نفسها <bdi lang=\"en\">Main memory</bdi>.",
        "في مثال Input مبسّط: الجهاز يوصّل البيانات للـLocal buffer. لما تبقى جاهزة، Controller يبعت Interrupt للـCPU؛ وبعدها روتين الخدمة يخلّي CPU ينقلها للـMain memory. إشعار الجاهزية مش هو نقل البيانات نفسه."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            11
          ]
        }
      ],
      "clarification": "ده مسار النقل المبسّط في السلايد. ما نفترضش منه إن كل طرق I/O في كل الأجهزة لازم تنقل كل البيانات بواسطة CPU؛ طرق تانية خارج الجزء ده.",
      "clarificationSource": {
        "title": "Linux Device Drivers · Interrupt-driven I/O",
        "url": "https://www.oreilly.com/library/view/linux-device-drivers/0596000081/ch09s07.html"
      }
    },
    {
      "id": "os-03-interrupt",
      "title": "An interrupt redirects execution to a handler",
      "eyebrow": "03 · نفهمها بمثال",
      "summary": "The CPU saves a return location and transfers control to the appropriate service routine.",
      "paragraphs": [
        "الـ<bdi lang=\"en\">Interrupt</bdi> إشارة محتاجة خدمة؛ مش ملف بيتنقل. الـCPU يحفظ عنوان الرجوع المناسب، وبعدها التنفيذ يروح لـ<bdi lang=\"en\">Interrupt service routine (ISR)</bdi> اللي تتعامل مع الحدث.",
        "الـ<bdi lang=\"en\">Interrupt vector</bdi> بيوفّر عناوين روتينات الخدمة علشان نوصل للروتين المناسب. لما الخدمة تخلص، النظام يقدر يكمل التنفيذ المناسب؛ وجود Interrupt لوحده مش دليل إننا شغّلنا برنامج مستخدم مختلف.",
        "السلايد بيسمّي الحدث الناتج عن Software بسبب خطأ أو طلب مستخدم <bdi lang=\"en\">Trap / exception</bdi>. ده يختلف عن إشعار انتهاء جهاز خارجي. وصف الـOS إنه <bdi lang=\"en\">Interrupt driven</bdi> معناه إن أحداث زي دي بتخلّيه يستجيب ويدير الشغل."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            12
          ]
        }
      ],
      "clarification": "السلايد بيجمع Trap وException في شرح تمهيدي؛ تفاصيل تسميتهم وطرق الحفظ بتختلف حسب المعمارية. المطلوب هنا السبب ومسار الخدمة، مش تعميم اسم واحد لكل منصة."
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-03-completion-vs-data",
      "type": "mcq",
      "placement": "os-03-local-buffer",
      "objective": "Separate completion notification from data transfer.",
      "prerequisites": [
        "os-03-local-buffer"
      ],
      "prompt": "A controller has completed an I/O operation. What informs the CPU?",
      "options": [
        {
          "id": "os-03-completion-vs-data-1",
          "text": "An interrupt"
        },
        {
          "id": "os-03-completion-vs-data-2",
          "text": "The interrupt vector physically moves the data"
        },
        {
          "id": "os-03-completion-vs-data-3",
          "text": "The local buffer becomes main memory"
        }
      ],
      "correctOptionId": "os-03-completion-vs-data-1",
      "feedback": {
        "os-03-completion-vs-data-1": "صح؛ ده إشعار الانتهاء. البيانات ليها مسار نقل منفصل في الرسم.",
        "os-03-completion-vs-data-2": "Interrupt vector بيساعد نحدد عنوان ISR، مش وسيلة نقل البايتات.",
        "os-03-completion-vs-data-3": "Buffer يفضل مساحة عند Controller؛ مش بيتحوّل لـMain memory."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            11,
            12
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-03-concurrent",
      "type": "true-false",
      "placement": "os-03-shared-memory",
      "objective": "Recognize concurrent CPU and device operation.",
      "prerequisites": [
        "os-03-shared-memory"
      ],
      "prompt": "In the source model, CPU execution and I/O device operation can overlap.",
      "options": [
        {
          "id": "os-03-concurrent-true",
          "text": "True · صح"
        },
        {
          "id": "os-03-concurrent-false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-03-concurrent-true",
      "feedback": {
        "os-03-concurrent-true": "صح؛ CPU والجهاز يقدروا يتقدّموا في نفس الفترة، مع احتمال التنافس على الذاكرة.",
        "os-03-concurrent-false": "دي صح؛ التزامن وارد، ومش معناه إن كل طرف عنده وصول غير محدود للذاكرة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            10,
            11
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-03-vector",
      "type": "mcq",
      "placement": "os-03-interrupt",
      "objective": "Identify the function of an interrupt vector.",
      "prerequisites": [
        "os-03-interrupt"
      ],
      "prompt": "What information does the interrupt vector provide in this overview?",
      "options": [
        {
          "id": "os-03-vector-3",
          "text": "A list proving that another user process must run"
        },
        {
          "id": "os-03-vector-1",
          "text": "Addresses of service routines"
        },
        {
          "id": "os-03-vector-2",
          "text": "All bytes of the file being read"
        }
      ],
      "correctOptionId": "os-03-vector-1",
      "feedback": {
        "os-03-vector-1": "صح؛ علشان التحكم يوصل لروتين الخدمة المناسب.",
        "os-03-vector-2": "البايتات بتتحرك عبر مسار البيانات؛ Vector مش نسخة من الملف.",
        "os-03-vector-3": "Vector عناوين خدمة. التعامل مع Interrupt مش معناه بالضرورة تبديل Process."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            12
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-03-trap-source",
      "type": "true-false",
      "placement": "os-03-interrupt",
      "objective": "Differentiate software-generated events from device completion.",
      "prerequisites": [
        "os-03-interrupt"
      ],
      "prompt": "A trap or exception, as introduced in the slide, can result from a software error or a user request.",
      "options": [
        {
          "id": "os-03-trap-source-true",
          "text": "True · صح"
        },
        {
          "id": "os-03-trap-source-false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-03-trap-source-true",
      "feedback": {
        "os-03-trap-source-true": "صح؛ ده وصف السلايد للأحداث الناتجة عن Software، مقابل إشعار من جهاز مثلاً.",
        "os-03-trap-source-false": "دي صح في وصف المحاضرة؛ Software error أو user request ممكن يولّد الحدث."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            12
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
      "id": "os-03-glossary-controller",
      "term": "Device controller",
      "translation": "جزء بيدير جهاز أو نوع أجهزة",
      "definition": "Hardware that manages a particular device type and reports events to the CPU.",
      "explanation": "زي Controller للديسك؛ مش هو الملف ولا البرنامج اللي فاتحه.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            10,
            11
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-03-glossary-buffer",
      "term": "Local buffer",
      "translation": "مساحة بيانات مؤقتة عند Controller",
      "definition": "Temporary data storage local to a device controller.",
      "explanation": "البيانات ممكن تقعد فيه قبل نقلها للـMain memory.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            11
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-03-glossary-bus",
      "term": "Common bus",
      "translation": "مسار توصيل مشترك",
      "definition": "A shared communication path connecting CPUs, controllers and memory in the source model.",
      "explanation": "الأطراف بتستخدمه للوصول للذاكرة، وممكن تتنافس عليه.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            10
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-03-glossary-concurrent",
      "term": "Concurrent execution",
      "translation": "شغل بيتقدّم خلال نفس الفترة",
      "definition": "Overlapping progress of activities during the same period.",
      "explanation": "CPU بينفّذ تعليمات وجهاز بيعمل I/O في نفس الفترة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            10,
            11
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-03-glossary-interrupt",
      "term": "Interrupt",
      "translation": "إشارة تنقل التحكم لخدمة حدث",
      "definition": "An event that transfers control to an interrupt service routine.",
      "explanation": "Controller يقدر يستخدمها علشان يقول إن عمليته خلصت.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            11,
            12
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-03-glossary-isr",
      "term": "Interrupt service routine (ISR)",
      "translation": "روتين خدمة Interrupt",
      "definition": "Code that handles an interrupt event.",
      "explanation": "تعليمات بتتعامل مع الحدث بعد انتقال التحكم ليها.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            12
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-03-glossary-vector",
      "term": "Interrupt vector",
      "translation": "جدول عناوين روتينات الخدمة",
      "definition": "A structure containing addresses of interrupt service routines.",
      "explanation": "بيساعدنا نوصل لكود الخدمة المناسب.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            12
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-03-glossary-trap",
      "term": "Trap / exception",
      "translation": "حدث ناتج عن Software في وصف السلايد",
      "definition": "A software-generated event due to an error or user request in the slide’s introductory terminology.",
      "explanation": "زي خطأ تنفيذ أو طلب خدمة؛ الأسماء الدقيقة بتختلف حسب المعمارية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            12
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-03-glossary-main-memory",
      "term": "Main memory",
      "translation": "ذاكرة العمل الرئيسية",
      "definition": "Memory holding instructions and data used by the CPU.",
      "explanation": "هنا نفرّقها عن Local buffer اللي عند Controller.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            10,
            11
          ]
        }
      ],
      "kind": "prerequisite"
    }
  ],
  "visualizations": [
    {
      "id": "os-03-io-path",
      "conceptId": "os-03-local-buffer",
      "title": "Data movement and completion are different paths",
      "description": "مثال Input بإشعار Interrupt: البيانات تجهز في Buffer، يحصل الإشعار، وبعدها CPU ينقل البيانات للذاكرة.",
      "legend": "الأسهم المتصلة مسار البيانات، والسهم المتقطّع إشعار للـCPU. في المثال ده الجهاز يملأ Buffer، يبعت Interrupt، وبعدها CPU ينقل البيانات للـMain memory. ده مثال مبسّط من غير DMA؛ أماكن الصناديق مش مقياس للتوقيت أو السرعة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            10,
            11,
            12
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 400\" role=\"img\"><defs><marker id=\"arrow\" markerWidth=\"9\" markerHeight=\"9\" refX=\"8\" refY=\"4\" orient=\"auto\"><path d=\"M0 0 L8 4 L0 8 Z\" fill=\"#315e72\"/></marker></defs><rect width=\"760\" height=\"400\" fill=\"#f8fbfc\"/><g data-node=\"device\"><rect x=\"25\" y=\"80\" width=\"160\" height=\"90\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"105\" y=\"132\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">I/O device</text></g><path d=\"M185 125 L260 125\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><text x=\"222.5\" y=\"116\" text-anchor=\"middle\" font-size=\"18\" font-family=\"Arial, sans-serif\" fill=\"#163745\">data</text><g data-node=\"buffer\"><rect x=\"265\" y=\"65\" width=\"220\" height=\"120\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"375\" y=\"119.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Device controller</text><text x=\"375\" y=\"144.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Local buffer</text></g><path d=\"M485 125 L555 125\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><text x=\"520\" y=\"116\" text-anchor=\"middle\" font-size=\"18\" font-family=\"Arial, sans-serif\" fill=\"#163745\">data</text><g data-node=\"memory\"><rect x=\"560\" y=\"80\" width=\"175\" height=\"90\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"647.5\" y=\"132\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Main memory</text></g><g data-node=\"cpu\"><rect x=\"275\" y=\"280\" width=\"200\" height=\"75\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"375\" y=\"324.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">CPU</text></g><path d=\"M380 185 L380 275\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\" stroke-dasharray=\"7 5\"/><text x=\"394\" y=\"221\" text-anchor=\"start\" font-size=\"18\" font-family=\"Arial, sans-serif\" fill=\"#163745\">interrupt</text><text x=\"485\" y=\"225\" fill=\"#163745\" font-size=\"18\" font-family=\"Arial, sans-serif\">CPU moves buffer ↔ memory</text><text x=\"25\" y=\"35\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Input example · source model</text></svg>",
      "steps": [
        {
          "id": "os-03-io-path-step-1",
          "title": "Input arrives",
          "detail": "الجهاز يسلّم البيانات للـBuffer الخاص بالـController.",
          "focus": [
            "device",
            "buffer"
          ]
        },
        {
          "id": "os-03-io-path-step-2",
          "title": "Completion signal",
          "detail": "البيانات بقت جاهزة في Buffer؛ Controller يبلّغ CPU بـInterrupt.",
          "focus": [
            "buffer",
            "cpu"
          ]
        },
        {
          "id": "os-03-io-path-step-3",
          "title": "Memory transfer",
          "detail": "روتين الخدمة يتعامل مع الإشعار؛ CPU ينقل بيانات Input من Buffer للـMain memory في المثال ده.",
          "focus": [
            "buffer",
            "memory",
            "cpu"
          ]
        }
      ]
    },
    {
      "id": "os-03-interrupt-trace",
      "conceptId": "os-03-interrupt",
      "title": "Interrupt handling trace",
      "description": "احفظ نقطة الرجوع، حدّد روتين الخدمة، وبعدها نفّذ الخدمة.",
      "legend": "الأسهم ترتيب انتقال التحكم. الأسهم هنا مش حركة بيانات. العنوان المحفوظ يسمح برجوع صحيح حسب نوع الحدث والمعمارية. الرسم لا يفرض تبديل Process.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            12
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 400\" role=\"img\"><defs><marker id=\"arrow\" markerWidth=\"9\" markerHeight=\"9\" refX=\"8\" refY=\"4\" orient=\"auto\"><path d=\"M0 0 L8 4 L0 8 Z\" fill=\"#315e72\"/></marker></defs><rect width=\"760\" height=\"400\" fill=\"#f8fbfc\"/><g data-node=\"run\"><rect x=\"25\" y=\"65\" width=\"200\" height=\"80\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"125\" y=\"112\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Running code</text></g><path d=\"M225 105 L280 105\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><g data-node=\"save\"><rect x=\"285\" y=\"65\" width=\"440\" height=\"80\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"505\" y=\"112\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Save return location</text></g><path d=\"M505 145 L505 200\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><g data-node=\"vector\"><rect x=\"285\" y=\"205\" width=\"440\" height=\"70\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"505\" y=\"247\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Interrupt vector → ISR address</text></g><path d=\"M505 275 L505 310\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><g data-node=\"isr\"><rect x=\"285\" y=\"315\" width=\"440\" height=\"65\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"505\" y=\"354.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Execute service routine</text></g><text x=\"25\" y=\"225\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Interrupt arrives</text><text x=\"25\" y=\"255\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">control changes</text></svg>",
      "steps": [
        {
          "id": "os-03-interrupt-trace-step-1",
          "title": "Interrupted execution",
          "detail": "حدث Interrupt أثناء تنفيذ الكود؛ محتاجين نعرف نرجع للمكان المناسب.",
          "focus": [
            "run",
            "save"
          ]
        },
        {
          "id": "os-03-interrupt-trace-step-2",
          "title": "Find handler",
          "detail": "Interrupt vector فيه عنوان روتين الخدمة المناسب.",
          "focus": [
            "vector"
          ]
        },
        {
          "id": "os-03-interrupt-trace-step-3",
          "title": "Service event",
          "detail": "ISR يتعامل مع الحدث؛ ده مش إثبات إن Process تانية بدأت.",
          "focus": [
            "isr"
          ]
        }
      ]
    }
  ]
};if(typeof module==='object'&&module.exports)module.exports=lesson;else root.OSPilotLesson=lesson;})(typeof window!=='undefined'?window:globalThis);
