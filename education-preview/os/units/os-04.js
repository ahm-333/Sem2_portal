(function(root) {
  'use strict';
  const lesson = {
  "id": "os-04",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "1",
  "title": "Storage hierarchy and caching",
  "subtitle": "ليه البيانات ليها أكتر من مكان؟ ونعمل إيه لو مش موجودة في Cache؟",
  "sources": [
    {
      "id": "current-ch1",
      "title": "Chapter 1 · Introduction",
      "driveId": "14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M",
      "url": "https://drive.google.com/file/d/14YyfOeN0occ4jy1PgQN9PO6zwmZV7y8M/view",
      "sha256": "c81ae8d50d261ffbd4c78ebf75b42f3f980c50298bba19b32f5779b3d1745e7b",
      "slides": [
        13,
        14,
        15,
        16
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-04-storage-types",
      "title": "Working memory and persistent storage",
      "eyebrow": "01 · نفهمها بمثال",
      "summary": "Main memory supports execution; secondary storage retains large amounts of information.",
      "paragraphs": [
        "فاتح ملف وصورة على الجهاز؟ التعليمات والبيانات اللي الـCPU بيستخدمها بتكون في <bdi lang=\"en\">Main memory</bdi> أثناء الشغل. في النموذج المعتاد هنا هي <bdi lang=\"en\">Volatile</bdi>: محتواها بيضيع لو الكهربا اتقطعت.",
        "<bdi lang=\"en\">Secondary storage</bdi> زي <bdi lang=\"en\">HDD</bdi> أو <bdi lang=\"en\">SSD</bdi> بيحفظ بيانات كتير بشكل <bdi lang=\"en\">Nonvolatile</bdi>: مش محتاج الكهربا تفضل شغّالة علشان يحتفظ بيها. ده مش معناه إنه مستحيل يتلف أو محتاجش Backup.",
        "الـ<bdi lang=\"en\">Hard disk (HDD)</bdi> بيخزّن مغناطيسيًا على <bdi lang=\"en\">Platters</bdi>. سطح القرص بيتنظّم لـ<bdi lang=\"en\">Tracks</bdi>، والـTrack بيتقسّم لـ<bdi lang=\"en\">Sectors</bdi>. الـ<bdi lang=\"en\">Disk controller</bdi> بينظّم التعامل بين الجهاز والكمبيوتر. الـ<bdi lang=\"en\">SSD</bdi> بيعتمد على تقنيات تانية؛ مش لازم يكون فيه قرص بيلف."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            13
          ]
        }
      ],
      "clarification": "جملة إن Main memory هي الذاكرة الكبيرة المتاحة مباشرة للـCPU جاية في سياق التنفيذ بالمحاضرة؛ مش معناها إن CPU مفيهوش Registers أو Cache. مقارنة SSD/HDD هنا اتجاه عام في المصدر، مش قياس لأي موديل حالي."
    },
    {
      "id": "os-04-hierarchy",
      "title": "A hierarchy trades speed, cost and capacity",
      "eyebrow": "02 · نفهمها بمثال",
      "summary": "Storage levels differ in access speed, cost and volatility.",
      "paragraphs": [
        "سلايد 15 بيرتّب المستويات: <bdi lang=\"en\">Registers → Cache → Main memory → SSD → Hard disk → Optical disk → Magnetic tape</bdi>. الاتجاه ناحية Registers عادةً أسرع وأغلى لكل وحدة تخزين، بس المساحة أصغر.",
        "مش كل المستويات ليها نفس <bdi lang=\"en\">Volatility</bdi>. Registers وCache وRAM المعتادة بتفقد محتواها بانقطاع الطاقة، بينما وسائط التخزين زي SSD وHDD بتحتفظ بيه. الرسم بيشرح اتجاه عام؛ مش لازم كل جهاز يحتوي كل مستوى.",
        "الـ<bdi lang=\"en\">Device driver</bdi> برنامج بيدير I/O للـController ويوفّر واجهة منتظمة بينه وبين Kernel. ما تخلطش <bdi lang=\"en\">Driver</bdi> اللي هو Software بالـ<bdi lang=\"en\">Controller</bdi> اللي هو Hardware."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            14,
            15
          ]
        }
      ]
    },
    {
      "id": "os-04-cache",
      "title": "Check the cache before fetching a copy",
      "eyebrow": "03 · نفهمها بمثال",
      "summary": "Caching temporarily copies useful information into a smaller, faster store.",
      "paragraphs": [
        "تخيّل محتاج معلومة موجودة في مكان تخزين أبطأ. نبص الأول في <bdi lang=\"en\">Cache</bdi>: لو موجودة، دي <bdi lang=\"en\">Cache hit</bdi> ونستخدم النسخة الأسرع. لو مش موجودة، دي <bdi lang=\"en\">Cache miss</bdi>؛ نجيبها من المستوى الأبطأ وننسخها للـCache وبعدين نستخدمها.",
        "الـCache أصغر من المصدر اللي بيخدمه، فمش ممكن يحتفظ بكل حاجة. حجم الـCache و<bdi lang=\"en\">Replacement policy</bdi>، يعني اختيار اللي يخرج لما المساحة تخلص، بيأثروا على فائدته.",
        "الفكرة مش محصورة في CPU cache: السلايد بيقول إنها بتحصل في Hardware وOS وSoftware. ومن زاوية التخزين، Main memory نفسها ممكن تتشاف كـCache لجزء من بيانات Secondary storage."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            14,
            16
          ]
        }
      ]
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-04-cache-miss",
      "type": "mcq",
      "placement": "os-04-cache",
      "objective": "Apply the cache miss path.",
      "prerequisites": [
        "os-04-cache"
      ],
      "prompt": "Item A is absent from the cache. What follows in the source’s caching overview?",
      "options": [
        {
          "id": "os-04-cache-miss-2",
          "text": "Use A from cache without fetching it"
        },
        {
          "id": "os-04-cache-miss-3",
          "text": "Delete the slower storage because the cache replaces it"
        },
        {
          "id": "os-04-cache-miss-1",
          "text": "Fetch A from slower storage, copy it into cache, then use it"
        }
      ],
      "correctOptionId": "os-04-cache-miss-1",
      "feedback": {
        "os-04-cache-miss-1": "صح؛ ده مسار Cache miss، مش فشل دائم في القراءة.",
        "os-04-cache-miss-2": "A مش موجودة في Cache، فلازم نجيبها الأول. ده مش Cache hit.",
        "os-04-cache-miss-3": "Cache نسخة مؤقتة وأصغر؛ ما بتلغيش مصدر التخزين الأكبر."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            16
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-04-volatile",
      "type": "true-false",
      "placement": "os-04-storage-types",
      "objective": "Separate volatile and nonvolatile storage.",
      "prerequisites": [
        "os-04-storage-types"
      ],
      "prompt": "Typical volatile main memory retains its contents after power is removed.",
      "options": [
        {
          "id": "os-04-volatile-true",
          "text": "True · صح"
        },
        {
          "id": "os-04-volatile-false",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-04-volatile-false",
      "feedback": {
        "os-04-volatile-true": "غلط؛ Volatile معناها إن المحتوى بيضيع بانقطاع الطاقة. Secondary storage غير المتطاير ليه دور مختلف.",
        "os-04-volatile-false": "صح اختيارك؛ الجملة غلط. RAM المعتادة مش حفظ دائم بعد فصل الكهرباء."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            13
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-04-driver-controller",
      "type": "mcq",
      "placement": "os-04-hierarchy",
      "objective": "Distinguish driver software from controller hardware.",
      "prerequisites": [
        "os-04-hierarchy"
      ],
      "prompt": "Which component provides a uniform interface between a controller and the kernel?",
      "options": [
        {
          "id": "os-04-driver-controller-1",
          "text": "Device driver"
        },
        {
          "id": "os-04-driver-controller-2",
          "text": "Magnetic platter"
        },
        {
          "id": "os-04-driver-controller-3",
          "text": "A cache replacement decision"
        }
      ],
      "correctOptionId": "os-04-driver-controller-1",
      "feedback": {
        "os-04-driver-controller-1": "صح؛ Driver برنامج بيدير I/O وبيخفي تفاصيل Controller عن الواجهة اللي Kernel بيتعامل معاها.",
        "os-04-driver-controller-2": "Platter هو سطح التخزين في HDD، مش واجهة Software.",
        "os-04-driver-controller-3": "دي سياسة لاختيار بيانات تخرج من Cache، مش برنامج إدارة Controller."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            14
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-04-hierarchy-tradeoff",
      "type": "mcq",
      "placement": "os-04-hierarchy",
      "objective": "Recognize hierarchy tradeoffs without invented benchmarks.",
      "prerequisites": [
        "os-04-hierarchy"
      ],
      "prompt": "Why keep both a small fast cache and a larger slower store?",
      "options": [
        {
          "id": "os-04-hierarchy-tradeoff-2",
          "text": "A cache must be larger than everything it caches"
        },
        {
          "id": "os-04-hierarchy-tradeoff-3",
          "text": "All storage levels have identical speed and volatility"
        },
        {
          "id": "os-04-hierarchy-tradeoff-1",
          "text": "Use fast access for useful copies while retaining larger capacity elsewhere"
        }
      ],
      "correctOptionId": "os-04-hierarchy-tradeoff-1",
      "feedback": {
        "os-04-hierarchy-tradeoff-1": "صح؛ بنوازن السرعة والتكلفة والمساحة، ومش بنفترض إن Cache يشيل كل البيانات.",
        "os-04-hierarchy-tradeoff-2": "العكس في النموذج: Cache أصغر، وده سبب أهمية الإدارة وReplacement policy.",
        "os-04-hierarchy-tradeoff-3": "السلايد بيبني Hierarchy بسبب اختلاف السرعة والتكلفة وVolatility."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            14,
            15,
            16
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
      "id": "os-04-glossary-main-memory",
      "term": "Main memory",
      "translation": "ذاكرة العمل الرئيسية",
      "definition": "Working storage directly used for CPU instruction and data access in the source model.",
      "explanation": "بيكون فيها الجزء المطلوب من البرنامج وبياناته أثناء التشغيل.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-volatile",
      "term": "Volatile",
      "translation": "محتواه بيضيع بفصل الطاقة",
      "definition": "Storage that loses its contents when power is removed.",
      "explanation": "زي Main memory المعتادة في السلايد.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-nonvolatile",
      "term": "Nonvolatile",
      "translation": "بيحتفظ بالمحتوى من غير طاقة مستمرة",
      "definition": "Storage that retains contents without continuous power.",
      "explanation": "زي HDD وSSD؛ الاحتفاظ مش ضمان ضد التلف.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-secondary",
      "term": "Secondary storage",
      "translation": "تخزين كبير ودائم نسبيًا",
      "definition": "Large-capacity nonvolatile storage supporting main memory.",
      "explanation": "عليه ملفاتك حتى بعد إغلاق الجهاز.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-hdd",
      "term": "Hard disk (HDD)",
      "translation": "قرص مغناطيسي",
      "definition": "A storage device using magnetic recording on rigid platters.",
      "explanation": "سطحه بيتقسم لـTracks ثم Sectors.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-tracks",
      "term": "Track / sector",
      "translation": "مسار دائري وجزء منه",
      "definition": "A track is a disk-surface path divided into sectors.",
      "explanation": "دي وحدات تنظيم سطح HDD في النموذج؛ مش تعريف SSD.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-ssd",
      "term": "Solid-state disk (SSD)",
      "translation": "تخزين من غير قرص ميكانيكي",
      "definition": "Nonvolatile storage based on solid-state technology.",
      "explanation": "السلايد بيقارنه بالـHDD، ومش بيدّي ضمان سرعة لكل جهاز.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            13
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-hierarchy",
      "term": "Storage hierarchy",
      "translation": "مستويات التخزين",
      "definition": "Storage levels organized by speed, cost and volatility.",
      "explanation": "المستويات الأسرع عادةً أصغر وأغلى لكل وحدة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            14,
            15
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-register",
      "term": "Register",
      "translation": "ذاكرة صغيرة داخل المعالج",
      "definition": "A small CPU storage location near instruction execution.",
      "explanation": "في أعلى Hierarchy المعروض، قبل Cache.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            15
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-cache",
      "term": "Cache",
      "translation": "نسخة مؤقتة في تخزين أسرع",
      "definition": "A smaller faster store holding copies from a slower store.",
      "explanation": "نبص فيها الأول؛ Hit لو لقينا المطلوب وMiss لو ما لقيناهوش.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            14,
            16
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-hit-miss",
      "term": "Cache hit / miss",
      "translation": "وجود المطلوب أو غيابه في Cache",
      "definition": "A hit finds the item in cache; a miss requires fetching it from a slower level.",
      "explanation": "المساران بديلان لنفس عملية البحث.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            16
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-replacement",
      "term": "Replacement policy",
      "translation": "قاعدة اختيار اللي يخرج",
      "definition": "A rule for choosing which cached information to replace.",
      "explanation": "لأن مساحة Cache محدودة، محتاجين نختار إيه يخرج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            16
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-driver",
      "term": "Device driver",
      "translation": "برنامج إدارة جهاز",
      "definition": "Software providing an interface between a device controller and the kernel.",
      "explanation": "Driver برنامج؛ Controller جزء Hardware.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            14
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-controller",
      "term": "Device controller",
      "translation": "جزء Hardware بيدير جهاز",
      "definition": "Hardware coordinating interaction between a device and the computer.",
      "explanation": "زي Disk controller المذكور في السلايد.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            13,
            14
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-04-glossary-optical",
      "term": "Optical disk / magnetic tape",
      "translation": "قرص ضوئي وشريط مغناطيسي",
      "definition": "Storage media shown toward the lower end of the source hierarchy.",
      "explanation": "أمثلة لمستويات تخزين؛ مش شرط موجودين في جهازك.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            15
          ]
        }
      ],
      "kind": "source-concept"
    }
  ],
  "visualizations": [
    {
      "id": "os-04-cache-hit-miss",
      "conceptId": "os-04-cache",
      "title": "One request: hit or miss?",
      "description": "الرسم بيعرض بديلين لنفس الطلب؛ اختار المسار حسب وجود المعلومة في Cache.",
      "legend": "الأسهم تنقل طلبًا أو نسخة بيانات حسب التسمية. Hit وMiss بديلان لنفس lookup، مش خطوتان لازم يحصلوا ورا بعض. المثال يفترض أن القراءة تبدأ بالـCache؛ لا يصف سياسة الكتابة ولا يقيس زمنًا.",
      "sourceRefs": [
        {
          "sourceId": "current-ch1",
          "slides": [
            16
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 400\" role=\"img\"><defs><marker id=\"arrow\" markerWidth=\"9\" markerHeight=\"9\" refX=\"8\" refY=\"4\" orient=\"auto\"><path d=\"M0 0 L8 4 L0 8 Z\" fill=\"#315e72\"/></marker></defs><rect width=\"760\" height=\"400\" fill=\"#f8fbfc\"/><g data-node=\"request\"><rect x=\"20\" y=\"160\" width=\"150\" height=\"75\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"95\" y=\"204.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Need item A</text></g><path d=\"M170 198 L225 198\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><g data-node=\"lookup\"><rect x=\"230\" y=\"155\" width=\"190\" height=\"85\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"325\" y=\"204.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Check cache</text></g><path d=\"M420 175 L530 90\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><text x=\"475\" y=\"123.5\" text-anchor=\"middle\" font-size=\"18\" font-family=\"Arial, sans-serif\" fill=\"#163745\">hit</text><g data-node=\"hit\"><rect x=\"535\" y=\"45\" width=\"200\" height=\"90\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"635\" y=\"97\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Use cached A</text></g><path d=\"M420 220 L530 300\" stroke=\"#315e72\" stroke-width=\"3\" fill=\"none\" marker-end=\"url(#arrow)\"/><text x=\"475\" y=\"251\" text-anchor=\"middle\" font-size=\"18\" font-family=\"Arial, sans-serif\" fill=\"#163745\">miss</text><g data-node=\"fetch\"><rect x=\"535\" y=\"255\" width=\"200\" height=\"110\" rx=\"12\" fill=\"#e7f3f4\" stroke=\"#245264\" stroke-width=\"2\"/><text x=\"635\" y=\"304.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Fetch slower copy</text><text x=\"635\" y=\"329.5\" text-anchor=\"middle\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Fill cache; use A</text></g><text x=\"25\" y=\"365\" fill=\"#163745\" font-size=\"20\" font-family=\"Arial, sans-serif\">Smaller fast store · cache capacity is limited</text></svg>",
      "steps": [
        {
          "id": "os-04-cache-hit-miss-step-1",
          "title": "Lookup first",
          "detail": "ندور في Cache قبل ما نجيب نسخة من المصدر الأبطأ.",
          "focus": [
            "request",
            "lookup"
          ]
        },
        {
          "id": "os-04-cache-hit-miss-step-2",
          "title": "Hit branch",
          "detail": "لو A موجودة، نستخدم النسخة الموجودة في Cache.",
          "focus": [
            "lookup",
            "hit"
          ]
        },
        {
          "id": "os-04-cache-hit-miss-step-3",
          "title": "Miss branch",
          "detail": "لو A مش موجودة، نجيبها من المصدر الأبطأ وننسخها للـCache ثم نستخدمها.",
          "focus": [
            "lookup",
            "fetch"
          ]
        }
      ]
    }
  ]
};
  if (typeof module !== 'undefined' && module.exports) module.exports = lesson;
  if (root) root.OSPilotLesson = lesson;
})(typeof window !== 'undefined' ? window : null);
