(function(root){const lesson={
  "id": "os-12",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "2",
  "title": "OS structures: الخدمات جوّه Kernel ولا برّه؟",
  "subtitle": "نقارن 6 تنظيمات برسومات مختلفة، ونفهم حدود الصلاحيات والتواصل والمقايضات.",
  "sources": [
    {
      "id": "current-ch2",
      "title": "Chapter 2 · Operating-System Structures",
      "driveId": "1DDEour98ioHVMAHbTVzHy_hfgR-zpaTW",
      "url": "https://drive.google.com/file/d/1DDEour98ioHVMAHbTVzHy_hfgR-zpaTW/view",
      "sha256": "7077be5a51357a7fd485d21111e7a296478f7dcfaf98985ccebcc998a349494e",
      "slides": [
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-12-map",
      "title": "Six organization approaches",
      "eyebrow": "01 · نفس الخدمات، تنظيم مختلف",
      "summary": "OS structure describes how responsibilities and interfaces are organized.",
      "paragraphs": [
        "اتفقنا إن OS بيدير ملفات وذاكرة وCPU وأجهزة. دلوقتي السؤال: الكود اللي بيعمل ده متقسّم ومتواصل إزاي؟ سلايد 14 يجمع 6 اتجاهات: <bdi lang=\"en\">Simple</bdi>, <bdi lang=\"en\">Monolithic</bdi>, <bdi lang=\"en\">Layered</bdi>, <bdi lang=\"en\">Microkernel</bdi>, <bdi lang=\"en\">Modules</bdi>, <bdi lang=\"en\">Hybrid</bdi>.",
        "دول نماذج للمقارنة، مش ست مراحل لازم كل نظام يعدّي بيها، ومش ستة أجهزة Hardware مختلفة. المقارنة المفيدة تسأل: الخدمة فين؟ بتكلم مين؟ وفصلها يكسبنا إيه ويكلّفنا إيه؟"
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            14
          ]
        }
      ]
    },
    {
      "id": "os-12-simple",
      "title": "Simple structure: classic MS-DOS",
      "eyebrow": "02 · وظائف كتير في مساحة قليلة",
      "summary": "The source MS-DOS example has weak separation between interfaces and responsibilities.",
      "paragraphs": [
        "في مثال <bdi lang=\"en\">MS-DOS</bdi> التاريخي، الهدف كان وظائف كتير في مساحة صغيرة. التقسيم لمكوّنات مستقلة والحدود بين مستويات الوظائف مش واضحة بما يكفي.",
        "ده يخلي البداية بسيطة وسهلة التنفيذ في وصف السلايد، لكن من غير فصل قوي بين <bdi lang=\"en\">User</bdi> و<bdi lang=\"en\">Kernel</bdi>، ومع إمكان الوصول المباشر للـ<bdi lang=\"en\">Hardware</bdi> في المثال، الحماية والتنظيم أضعف. الكلام هنا عن النموذج الكلاسيكي المذكور، مش قاعدة لكل أنظمة اليوم.",
        "لو برنامج عدى مباشرة لجهاز، ده اختصار في الطريق لكنه يقلّل التحكم المركزي. مانخلطش «سهل أبدأ فيه» مع «سهل أكبره وأحميه»."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            15
          ]
        }
      ]
    },
    {
      "id": "os-12-monolithic",
      "title": "Monolithic: a large kernel, a defined entry",
      "eyebrow": "03 · خدمات كتير جوّه Kernel",
      "summary": "Traditional UNIX groups many services inside one kernel beneath the system-call interface.",
      "paragraphs": [
        "في <bdi lang=\"en\">Traditional UNIX</bdi> بالسلايد، فيه <bdi lang=\"en\">System programs</bdi> فوق واجهة <bdi lang=\"en\">System calls</bdi>، وتحتها Kernel بين الواجهة والـHardware. الـKernel يجمع <bdi lang=\"en\">File system</bdi> و<bdi lang=\"en\">CPU scheduling</bdi> و<bdi lang=\"en\">Memory management</bdi> ووظائف كتير في مستوى كبير. ده المقصود بـ<bdi lang=\"en\">Monolithic</bdi>.",
        "رسم سلايد 17 فيه أدوات زي <bdi lang=\"en\">Shells</bdi> و<bdi lang=\"en\">Compilers</bdi> و<bdi lang=\"en\">Libraries</bdi> فوق، ووظائف Kernel وواجهته للأجهزة تحت. وجود صفوف في الرسم مش معناه إنه <bdi lang=\"en\">Fully layered</bdi>: فصل الأدوار أحسن من النموذج البسيط، لكن الخدمات جوّه Kernel مش ملزمة بسلسلة طبقات صارمة.",
        "التواصل المباشر جوّه Kernel ممكن يساعد الأداء، وواجهة الدخول تضيف حماية مقارنة بالمثال البسيط. المقابل: خدمات كتير مترابطة تخلي الصيانة معقدة. «أداء أعلى» اتجاه مقارنة في السلايد؛ مش ضمان إن أي Monolithic أسرع من أي تصميم تاني."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            16,
            17
          ]
        }
      ]
    },
    {
      "id": "os-12-layered",
      "title": "Layered: depend on lower services",
      "eyebrow": "04 · كل مستوى له دور",
      "summary": "A layered OS restricts a layer to services of lower layers.",
      "paragraphs": [
        "تخيّل ترتيب خدمات على مستويات. في نموذج <bdi lang=\"en\">Layered approach</bdi>، <bdi lang=\"en\">Layer 0</bdi> هي Hardware وأعلى <bdi lang=\"en\">Layer N</bdi> واجهة المستخدم. كل مستوى يعتمد على خدمات مستويات أقل منه؛ مش أي مستوى يروح لأي مكان بحرية.",
        "الفصل يساعد نطوّر ونختبر ونصحّح جزء في كل مرة. عبارة السلايد عن تحديد الخطأ في نفس Layer نفهمها تحت افتراض إن الطبقات اللي تحتها اتختبرت وواجهاتها ملتزمة؛ من غير الافتراض ده، عطل طبقة أقل ممكن يظهر فوق.",
        "التحدي: تختار ترتيب مين فوق مين من غير اعتماد متعارض. المرور على مستويات إضافية ممكن يضيف <bdi lang=\"en\">Overhead</bdi> ويقلّل الكفاءة. دي مقايضة تصميم؛ مش حكم رقمي ثابت."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            18
          ]
        }
      ]
    },
    {
      "id": "os-12-microkernel",
      "title": "Microkernel: services outside the core",
      "eyebrow": "05 · خدمة ملفات برّه Kernel؟",
      "summary": "A microkernel moves many services into user-space components that communicate by messages.",
      "paragraphs": [
        "في <bdi lang=\"en\">Microkernel</bdi>، نحاول ننقل وظائف كتير من Kernel إلى <bdi lang=\"en\">User space</bdi>. رسم سلايد 20 يحط <bdi lang=\"en\">Application</bdi>, <bdi lang=\"en\">File system</bdi>, و<bdi lang=\"en\">Device driver</bdi> فوق حد الصلاحية، وداخل Microkernel وظائف أساسية زي الاتصال وإدارة ذاكرة وجدولة CPU في مستوى الرسم.",
        "المكوّنات الخارجية تتواصل بـ<bdi lang=\"en\">Message passing</bdi>: طلب وبيانات على شكل رسائل، عن طريق دعم Kernel. لو التطبيق محتاج ملف، مش بينادي كود خدمة الملفات كأنه دالة داخل نفس Kernel الكبير؛ فيه تواصل بين مكوّنات منفصلة.",
        "الفصل يقلّل كمية الكود ذي الصلاحيات العالية، وده يساعد الاعتمادية والأمان وسهولة التوسعة والنقل لمعمارية جديدة. لكنه مش ضمان ضد كل الأعطال. عبور الحدود والتواصل ممكن يضيف تكلفة أداء.",
        "المصدر يذكر <bdi lang=\"en\">Mach</bdi> كمثال، ويقول إن <bdi lang=\"en\">Darwin</bdi> في Mac OS X مبني جزئيًا عليه. ده ما يخلّيناش نصنّف Mac OS X كله كـMicrokernel نقي؛ السلايد نفسه يعرضه ضمن Hybrid بعد كده."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            19,
            20
          ]
        }
      ]
    },
    {
      "id": "os-12-modules",
      "title": "Loadable kernel modules",
      "eyebrow": "06 · أجزاء منفصلة، بس جوّه Kernel",
      "summary": "Modules can be loaded into the kernel and communicate through known interfaces.",
      "paragraphs": [
        "في <bdi lang=\"en\">Modules</bdi>، نخلي كل مكوّن منفصل بواجهة معروفة، ونحمّله عند الحاجة جوّه Kernel. السلايد يصف تنظيم قريب من <bdi lang=\"en\">Object-oriented approach</bdi>: مكوّنات واضحة تتعامل بواجهات. ده مش اشتراط إن كل الكود لازم يتكتب بلغة معينة.",
        "رسم Solaris في سلايد 22 فيه Core وحوله Modules زي <bdi lang=\"en\">File systems</bdi>, <bdi lang=\"en\">Device drivers</bdi>, و<bdi lang=\"en\">Scheduling classes</bdi>. الروابط اتصال بواجهات داخل Kernel، مش سلم طبقات لازم كل نداء يعدّي عليه بالترتيب.",
        "دي مرونة شبه فكرة تقسيم الطبقات، لكن Module تقدر تتصل بمكوّن تاني حسب الواجهة المعروفة. التواصل ده ممكن يتم بنداءات مباشرة داخل Kernel؛ مش لازم رسائل بين عمليات User space زي مثال Microkernel. ده مش ادعاء إن النظام عمره ما يستخدم رسائل لأي غرض.",
        "تحميل المطلوب بس ممكن يوفّر مساحة ويخلّي الـCore الأساسي أصغر. عبارة السلايد «small and efficient as microkernel» مقارنة مختصرة، مش ضمان مساواة في الحجم أو الأداء أو العزل. الـModule المحمّلة هنا كود داخل Kernel وبنفس مستوى الصلاحية؛ Module معطوبة ممكن تأثر على النظام. المصدر يذكر Linux وSolaris كأمثلة، من غير مواصفة لكل إصدار."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            21,
            22
          ]
        }
      ]
    },
    {
      "id": "os-12-hybrid",
      "title": "Hybrid: combine approaches deliberately",
      "eyebrow": "07 · مش لازم تختار نموذج نقي",
      "summary": "A hybrid combines organization approaches to meet several design goals.",
      "paragraphs": [
        "في الواقع التعليمي اللي بيعرضه المصدر، أنظمة كتير بتمزج أكتر من اتجاه. <bdi lang=\"en\">Hybrid</bdi> يجمع أفكار علشان يوازن بين <bdi lang=\"en\">Performance</bdi>, <bdi lang=\"en\">Security</bdi>, و<bdi lang=\"en\">Usability</bdi>.",
        "سلايد 23 يذكر <bdi lang=\"en\">Mac OS X</bdi>, <bdi lang=\"en\">iOS</bdi>, و<bdi lang=\"en\">Android</bdi> كأمثلة في مادة 2013. الأسماء دي سياق المصدر، مش شرح تفصيلي أو تصنيف ثابت لكل إصدار حالي. وجود مكوّن Mach مثلًا ما يثبتش إن كل النظام Microkernel نقي.",
        "في الرسم عندنا مثال افتراضي لدمج حدود User/Kernel مع Modules داخل Kernel؛ مش خريطة حقيقية لأي منتج. كلمة Hybrid لوحدها ما تقولش كل خدمة موجودة فين؛ لازم تشوف تنظيم النظام المقصود."
      ],
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            23
          ]
        }
      ]
    }
  ],
  "historicalItems": [],
  "essayReferences": [
    {
      "id": "os-12-comparison-reference",
      "prompt": "How do the six OS organization approaches differ in separation and communication?",
      "answer": "Simple structure has weak separation of responsibilities. A monolithic kernel groups many services inside the kernel. A layered design restricts dependencies to lower-layer services. A microkernel moves many services into user space, using messages between components. Loadable modules provide separable components within the kernel through known interfaces. A hybrid combines approaches to meet performance, security, and usability goals. Actual tradeoffs depend on implementation; no model guarantees the best result in every system.",
      "explanation": "إجابة مذاكرة مؤلّفة من السلايدات، مش سؤال قديم أو نموذج رسمي. افتكر لكل نموذج: الخدمة فين؟ الاتصال إزاي؟ إيه المكسب والتكلفة؟ وبعدها ارجع للرسمة الخاصة بيه.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    }
  ],
  "questions": [
    {
      "id": "os-12-organization",
      "type": "mcq",
      "placement": "os-12-map",
      "objective": "Recognize what an OS organization model describes.",
      "prerequisites": [
        "os-12-map"
      ],
      "prompt": "Two systems offer similar services but arrange their responsibilities differently. What does an OS-structure comparison focus on?",
      "options": [
        {
          "id": "os-12-organization-1",
          "text": "How responsibilities and interfaces are arranged"
        },
        {
          "id": "os-12-organization-2",
          "text": "How resource consumption is recorded for each user"
        },
        {
          "id": "os-12-organization-3",
          "text": "The execution order of processes on a CPU timeline"
        },
        {
          "id": "os-12-organization-4",
          "text": "The occupied regions in one system-memory snapshot"
        }
      ],
      "correctOptionId": "os-12-organization-1",
      "feedback": {
        "os-12-organization-1": "صح؛ بنقارن مكان الخدمات وحدودها وطريقة تواصلها.",
        "os-12-organization-2": "تسجيل الاستهلاك Accounting خدمة ممكن يقدمها النظام. مقارنة Structure هنا عن ترتيب المسؤوليات والواجهات.",
        "os-12-organization-3": "الـTimeline بيبيّن ترتيب التنفيذ. مقارنة Structure بتسأل الخدمات فين وبتتواصل إزاي.",
        "os-12-organization-4": "دي لقطة لتوزيع الذاكرة، زي مثال MS-DOS وFreeBSD. Structure هنا ترتيب مسؤوليات النظام وواجهاتها."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
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
      "id": "os-12-simple-path",
      "type": "mcq",
      "placement": "os-12-simple",
      "objective": "Explain a consequence of weak separation.",
      "prerequisites": [
        "os-12-simple"
      ],
      "prompt": "In the classic MS-DOS model, why is direct hardware access a protection concern?",
      "options": [
        {
          "id": "os-12-simple-path-1",
          "text": "It guarantees every program is safe"
        },
        {
          "id": "os-12-simple-path-2",
          "text": "It weakens centralized control of access"
        },
        {
          "id": "os-12-simple-path-3",
          "text": "It turns every program into a microkernel"
        },
        {
          "id": "os-12-simple-path-4",
          "text": "It requires every service to run in a user-space server"
        }
      ],
      "correctOptionId": "os-12-simple-path-2",
      "feedback": {
        "os-12-simple-path-1": "الوصول المباشر مش ضمان أمان؛ بالعكس الفصل والتحكم أضعف في النموذج.",
        "os-12-simple-path-2": "صح؛ تجاوز حدود منظمة يقلّل قدرة النظام على التحكم في الوصول.",
        "os-12-simple-path-3": "الوصول المباشر مش تعريف Microkernel.",
        "os-12-simple-path-4": "الخدمات الخارجية تخص مقارنة Microkernel، مش وصف MS-DOS هنا."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            15
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-12-mono-services",
      "type": "mcq",
      "placement": "os-12-monolithic",
      "objective": "Locate services in the traditional UNIX model.",
      "prerequisites": [
        "os-12-monolithic"
      ],
      "prompt": "Where are file-system, scheduling, and memory-management functions in the traditional UNIX model shown?",
      "options": [
        {
          "id": "os-12-mono-services-1",
          "text": "In user-side system programs above the system-call interface"
        },
        {
          "id": "os-12-mono-services-2",
          "text": "Inside the kernel below the system-call interface"
        },
        {
          "id": "os-12-mono-services-3",
          "text": "In a standard library above the system-call interface"
        },
        {
          "id": "os-12-mono-services-4",
          "text": "In separate user-space service servers"
        }
      ],
      "correctOptionId": "os-12-mono-services-2",
      "feedback": {
        "os-12-mono-services-1": "برامج النظام اللي فوق الواجهة غير تنفيذ خدمات الملفات والجدولة والذاكرة، اللي هنا جوّه Kernel.",
        "os-12-mono-services-2": "صح؛ ده تجمع وظائف كتير داخل Kernel الكبير في Monolithic.",
        "os-12-mono-services-3": "المكتبة ممكن توفّر الواجهة للبرنامج؛ تنفيذ خدمات الإدارة المذكورة في رسم UNIX ده جوّه Kernel.",
        "os-12-mono-services-4": "ده خلط مع فصل الخدمات في نموذج Microkernel؛ رسم UNIX هنا بيجمع الوظائف دي داخل Kernel."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            16,
            17
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-12-rows-layers",
      "type": "true-false",
      "placement": "os-12-monolithic",
      "objective": "Avoid interpreting every stacked drawing as strict layering.",
      "prerequisites": [
        "os-12-monolithic"
      ],
      "prompt": "The rows in the traditional UNIX picture prove that it is fully layered.",
      "options": [
        {
          "id": "os-12-rows-layers-1",
          "text": "True · صح"
        },
        {
          "id": "os-12-rows-layers-2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-12-rows-layers-2",
      "feedback": {
        "os-12-rows-layers-1": "غلط؛ السلايد بيقول صراحة Beyond simple but not fully layered. صفوف الرسم مش دليل قيد طبقات صارم.",
        "os-12-rows-layers-2": "صح؛ مظهر الرسم مش كفاية؛ المهم قواعد اعتماد الخدمات على بعض."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            17
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-12-layer-rule",
      "type": "mcq",
      "placement": "os-12-layered",
      "objective": "Apply the lower-layer dependency rule.",
      "prerequisites": [
        "os-12-layered"
      ],
      "prompt": "Which dependency follows the source layered model?",
      "options": [
        {
          "id": "os-12-layer-rule-1",
          "text": "A layer uses a service from a lower layer"
        },
        {
          "id": "os-12-layer-rule-2",
          "text": "Every layer bypasses lower layers and directly uses hardware"
        },
        {
          "id": "os-12-layer-rule-3",
          "text": "A lower layer always requires the top UI to operate"
        },
        {
          "id": "os-12-layer-rule-4",
          "text": "All layers must run as separate user processes"
        }
      ],
      "correctOptionId": "os-12-layer-rule-1",
      "feedback": {
        "os-12-layer-rule-1": "صح؛ كل Layer تستخدم خدمات مستويات أقل حسب التنظيم المحدد.",
        "os-12-layer-rule-2": "ده مش قاعدة Layered؛ الوصول للخدمات المفروض يلتزم حدود الطبقات.",
        "os-12-layer-rule-3": "الاعتماد على أعلى UI يعكس الاتجاه ويفسد الترتيب المقصود.",
        "os-12-layer-rule-4": "Layer مش بالضرورة Process مستقلة في User space."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            18
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-12-layer-debug",
      "type": "true-false",
      "placement": "os-12-layered",
      "objective": "Qualify the layer-local debugging statement.",
      "prerequisites": [
        "os-12-layered"
      ],
      "prompt": "An error observed in a layer proves that all lower layers are correct, even when they were never tested.",
      "options": [
        {
          "id": "os-12-layer-debug-1",
          "text": "True · صح"
        },
        {
          "id": "os-12-layer-debug-2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-12-layer-debug-2",
      "feedback": {
        "os-12-layer-debug-1": "غلط؛ حصر الخطأ في نفس Layer محتاج افتراض إن الأدنى اتختبرت والتزمت بالواجهة.",
        "os-12-layer-debug-2": "صح؛ مكان ظهور المشكلة وحده مش دليل صحة الطبقات اللي تحتها."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            18
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-12-micro-overhead",
      "type": "mcq",
      "placement": "os-12-microkernel",
      "objective": "Identify the source microkernel communication tradeoff.",
      "prerequisites": [
        "os-12-microkernel"
      ],
      "prompt": "Which cost is emphasized for the microkernel model?",
      "options": [
        {
          "id": "os-12-micro-overhead-1",
          "text": "Communication overhead across user/kernel boundaries"
        },
        {
          "id": "os-12-micro-overhead-2",
          "text": "No way to add new services"
        },
        {
          "id": "os-12-micro-overhead-3",
          "text": "All file services must be inside the kernel"
        },
        {
          "id": "os-12-micro-overhead-4",
          "text": "No communication between components"
        }
      ],
      "correctOptionId": "os-12-micro-overhead-1",
      "feedback": {
        "os-12-micro-overhead-1": "صح؛ الرسائل والعبور بين User وKernel ممكن يضيفوا تكلفة.",
        "os-12-micro-overhead-2": "التوسعة من فوائد النموذج في المصدر، مش العيب المذكور.",
        "os-12-micro-overhead-3": "النموذج بينقل خدمات كتير لبرّه Kernel؛ مش بيفرض العكس.",
        "os-12-micro-overhead-4": "فيه Message passing؛ تكلفة التواصل هي المقارنة المطلوبة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            19,
            20
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-12-module-place",
      "type": "mcq",
      "placement": "os-12-modules",
      "objective": "Distinguish kernel modules from microkernel user-space services.",
      "prerequisites": [
        "os-12-modules"
      ],
      "prompt": "Where does a loadable kernel module run in this model?",
      "options": [
        {
          "id": "os-12-module-place-1",
          "text": "As an ordinary user-space server by definition"
        },
        {
          "id": "os-12-module-place-2",
          "text": "Inside the kernel when loaded"
        },
        {
          "id": "os-12-module-place-3",
          "text": "In a user-side library linked to an application"
        },
        {
          "id": "os-12-module-place-4",
          "text": "In firmware that runs before the kernel starts"
        }
      ],
      "correctOptionId": "os-12-module-place-2",
      "feedback": {
        "os-12-module-place-1": "ده خلط مع خدمات Microkernel الخارجية؛ Kernel module هنا داخل Kernel.",
        "os-12-module-place-2": "صح؛ Module تنظم الكود وتتحمل حسب الحاجة، لكنها لسه كود Kernel.",
        "os-12-module-place-3": "الـLibrary بتاعة التطبيق بتشتغل في User space. الـKernel module هنا كود بيتحمّل داخل Kernel.",
        "os-12-module-place-4": "Firmware البداية غير الـModule اللي بيتحمّل جوّه Kernel الشغّال. الاسم هنا Kernel module فعلًا."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            21,
            22
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-12-module-isolation",
      "type": "true-false",
      "placement": "os-12-modules",
      "objective": "Avoid equating modularity with user-space fault isolation.",
      "prerequisites": [
        "os-12-modules"
      ],
      "prompt": "A loadable kernel module has the same user-space isolation as the file server in the microkernel diagram.",
      "options": [
        {
          "id": "os-12-module-isolation-1",
          "text": "True · صح"
        },
        {
          "id": "os-12-module-isolation-2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-12-module-isolation-2",
      "feedback": {
        "os-12-module-isolation-1": "غلط؛ Module هنا جوّه Kernel، وخدمة الملفات في مثال Microkernel برّه في User space.",
        "os-12-module-isolation-2": "صح؛ فصل الكود لModules مش هو نفسه فصل الصلاحيات والمساحات في مثال Microkernel."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            20,
            21,
            22
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-12-hybrid-label",
      "type": "mcq",
      "placement": "os-12-hybrid",
      "objective": "Interpret a mixed-design classification carefully.",
      "prerequisites": [
        "os-12-hybrid"
      ],
      "prompt": "A system includes ideas from Mach and other approaches. What is the best conclusion from this information alone?",
      "options": [
        {
          "id": "os-12-hybrid-label-1",
          "text": "It must be a pure microkernel"
        },
        {
          "id": "os-12-hybrid-label-2",
          "text": "It cannot contain kernel modules"
        },
        {
          "id": "os-12-hybrid-label-3",
          "text": "Its components must be inspected before claiming a pure organization"
        },
        {
          "id": "os-12-hybrid-label-4",
          "text": "All its services must run outside the kernel"
        }
      ],
      "correctOptionId": "os-12-hybrid-label-3",
      "feedback": {
        "os-12-hybrid-label-1": "وجود Mach جزئيًا مش دليل إن كل النظام Microkernel نقي.",
        "os-12-hybrid-label-2": "المعلومة مش بتمنع Modules؛ التصميم ممكن يمزج أفكار.",
        "os-12-hybrid-label-3": "صح؛ Hybrid يجمع اتجاهات، ومكان كل خدمة محتاج تفاصيل النظام.",
        "os-12-hybrid-label-4": "المعلومة مش بتقول إن كل الخدمات في User space."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            19,
            23
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
      "id": "os-12-structure",
      "term": "OS structure",
      "translation": "طريقة تنظيم أجزاء نظام التشغيل",
      "definition": "The arrangement of OS responsibilities, components, and interfaces.",
      "explanation": "بنقارن الخدمة فين وبتتكلم مع مين.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            14
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-12-simple",
      "term": "Simple structure",
      "translation": "تنظيم بفصل ضعيف بين الوظائف",
      "definition": "A structure with weak separation of interfaces and functional levels in the source MS-DOS example.",
      "explanation": "بداية بسيطة، لكن تنظيم وحماية أضعف في المثال التاريخي.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            15
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-12-monolithic",
      "term": "Monolithic kernel",
      "translation": "Kernel كبير يجمع خدمات كتير",
      "definition": "A kernel organization grouping many OS services inside one privileged kernel.",
      "explanation": "Traditional UNIX المثال بيجمع ملفات وذاكرة وجدولة جوّه Kernel.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            16,
            17
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-12-layer",
      "term": "Layered approach",
      "translation": "تنظيم مستويات تعتمد على اللي تحتها",
      "definition": "An organization in which each layer uses services of lower layers.",
      "explanation": "Hardware تحت وUser interface فوق في النموذج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            18
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-12-micro",
      "term": "Microkernel",
      "translation": "نواة صغيرة وخدمات كتير برّه",
      "definition": "An organization that keeps a smaller core and moves many services into user space.",
      "explanation": "المكوّنات الخارجية تتواصل برسائل بمساعدة Kernel.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            19,
            20
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-12-user",
      "term": "User space",
      "translation": "مكان البرامج ذات الصلاحيات المحدودة",
      "definition": "The execution domain outside the privileged kernel.",
      "explanation": "خدمة الملفات وDriver في رسم Microkernel موجودين هنا.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            19,
            20
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-12-message",
      "term": "Message passing",
      "translation": "تبادل طلبات وبيانات في رسائل",
      "definition": "Communication through messages exchanged between components.",
      "explanation": "في مثال Microkernel الرسائل تربط خدمات منفصلة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            19,
            20
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-12-module",
      "term": "Loadable kernel module",
      "translation": "مكوّن يتحمّل جوّه Kernel عند الحاجة",
      "definition": "A separable component that can be loaded into the kernel as needed.",
      "explanation": "انفصال المكوّن مش معناه إنه User application.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            21,
            22
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-12-known-interface",
      "term": "Known interface",
      "translation": "طريقة اتصال متفق عليها",
      "definition": "A defined contract through which components interact.",
      "explanation": "كل Module تعرف تتعامل مع التانية من غير خلط مسؤولياتها.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            21
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-12-core",
      "term": "Core kernel",
      "translation": "الجزء الأساسي اللي Modules تتصل بيه",
      "definition": "The central kernel component connected to loadable components in the source Solaris model.",
      "explanation": "الرسم حواليه Drivers وFile systems ومكوّنات تانية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            22
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-12-hybrid",
      "term": "Hybrid system",
      "translation": "نظام بيمزج طرق تنظيم",
      "definition": "A system combining multiple organization approaches to meet design goals.",
      "explanation": "الاسم مش كفاية تعرف منه مكان كل خدمة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            23
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-12-overhead",
      "term": "Overhead",
      "translation": "شغل إضافي علشان التنظيم أو التواصل",
      "definition": "Additional work required to support a mechanism or interaction.",
      "explanation": "زي تكلفة عبور الحدود أو المرور على طبقات أكتر.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            18,
            19
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-12-port",
      "term": "Portability",
      "translation": "سهولة نقل النظام لمعمارية تانية",
      "definition": "The ability to adapt a system to another hardware architecture.",
      "explanation": "من الفوائد المذكورة لفصل Microkernel وخدماته.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            19
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-12-driver",
      "term": "Device driver",
      "translation": "كود يربط OS بنوع جهاز",
      "definition": "Software that supports OS interaction with a device.",
      "explanation": "مكانه في الرسم يختلف: User service في المثال ده، أو Kernel module في مثال تاني.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            20,
            22
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-12-schedule",
      "term": "CPU scheduling",
      "translation": "اختيار الشغل اللي ياخد CPU",
      "definition": "The OS function that selects work to execute on the CPU.",
      "explanation": "اسم وظيفة داخل Kernel في الرسم؛ تفاصيل الجدولة في Chapter 3.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            16,
            20
          ]
        }
      ],
      "kind": "prerequisite"
    },
    {
      "id": "os-12-memory",
      "term": "Memory management",
      "translation": "تنظيم استخدام الذاكرة",
      "definition": "The OS function that manages memory used by running programs.",
      "explanation": "وظيفة من خدمات Kernel المرسومة، من غير تفاصيل خوارزميات هنا.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            16,
            20
          ]
        }
      ],
      "kind": "prerequisite"
    }
  ],
  "visualizations": [
    {
      "id": "os-12-simple-monolithic",
      "conceptId": "os-12-monolithic",
      "title": "Weak separation vs a kernel service boundary",
      "description": "مقارنة مبسطة للنموذجين التاريخيين في السلايدات؛ مش مخطط كامل لأي إصدار.",
      "legend": "الأسهم طلب/وصول. المربع الأصفر في UNIX واجهة دخول Kernel؛ خدماته المجمّعة جوّه نفس المنطقة. MS-DOS هنا سهمه المباشر للـHardware مقصود لشرح ضعف الفصل في المثال، مش توصية لتطبيق حالي.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            15,
            16,
            17
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 420\" role=\"img\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#20546e\"/></marker></defs><rect width=\"760\" height=\"420\" fill=\"#f8fcff\"/><g font-family=\"Arial, sans-serif\"><text x=\"185\" y=\"30\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Classic MS-DOS model</text><text x=\"565\" y=\"30\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Traditional UNIX model</text><g data-node=\"dos-app\"><rect x=\"35\" y=\"55\" width=\"300\" height=\"60\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"185\" y=\"92\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Application</text></g><g data-node=\"dos-os\"><rect x=\"35\" y=\"185\" width=\"300\" height=\"65\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"185\" y=\"224.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Weakly separated OS</text></g><g data-node=\"dos-hw\"><rect x=\"35\" y=\"340\" width=\"300\" height=\"60\" rx=\"9\" fill=\"#e4f2e5\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"185\" y=\"377\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Hardware</text></g><g data-node=\"dos-os-path\"><path d=\"M185 115 L185 185\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"dos-hw-path\"><path d=\"M185 250 L185 340\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"dos-direct\"><path d=\"M45 90 H15 V370 H35\" fill=\"none\" stroke=\"#a4452b\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"95\" y=\"310\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">Direct access</text></g><g data-node=\"unix-app\"><rect x=\"415\" y=\"55\" width=\"300\" height=\"60\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"565\" y=\"92\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">System programs / apps</text></g><g data-node=\"unix-call\"><path d=\"M565 115 L565 170\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"unix-interface\"><rect x=\"415\" y=\"170\" width=\"300\" height=\"45\" rx=\"9\" fill=\"#fff0d2\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"565\" y=\"199.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">System-call interface</text></g><g data-node=\"unix-dispatch\"><path d=\"M565 215 L565 235\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"unix-services\"><rect x=\"415\" y=\"235\" width=\"300\" height=\"80\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"565\" y=\"269.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">One kernel: files,</text><text x=\"565\" y=\"294.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">scheduling, memory</text></g><g data-node=\"unix-hw-path\"><path d=\"M565 315 L565 340\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"unix-hw\"><rect x=\"415\" y=\"340\" width=\"300\" height=\"60\" rx=\"9\" fill=\"#e4f2e5\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"565\" y=\"377\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Hardware</text></g></g></svg>",
      "steps": [
        {
          "id": "os-12-simple-monolithic-step-1",
          "title": "Weak separation",
          "detail": "مثال MS-DOS يسمح بمسارات مباشرة للـHardware وحدوده الوظيفية مش مفصولة كويس.",
          "focus": [
            "dos-app",
            "dos-os",
            "dos-direct",
            "dos-hw"
          ]
        },
        {
          "id": "os-12-simple-monolithic-step-2",
          "title": "Defined kernel entry",
          "detail": "في UNIX الطلب يعدّي بواجهة System calls إلى Kernel فيه خدمات كتير.",
          "focus": [
            "unix-app",
            "unix-call",
            "unix-interface",
            "unix-services"
          ]
        },
        {
          "id": "os-12-simple-monolithic-step-3",
          "title": "Compare the tradeoff",
          "detail": "تجميع الخدمات يساعد الاتصال الداخلي، لكن يزيد تعقيد الصيانة. صفوف UNIX المرسومة مش إثبات إنه Fully layered.",
          "focus": [
            "unix-services",
            "unix-hw",
            "dos-os"
          ]
        }
      ]
    },
    {
      "id": "os-12-layers",
      "conceptId": "os-12-layered",
      "title": "A permitted downward service path",
      "description": "تسلسل افتراضي داخل نموذج Layered؛ أسماء المستويات الوسيطة للتوضيح فقط.",
      "legend": "المستطيلات مستويات، والأسهم اعتماد/طلب خدمة من مستوى أقل. الرسم يختار مسارًا بين مستويات متجاورة للتبسيط؛ قاعدة السلايد lower layers، مش شرط نفس عدد الطبقات في كل نظام. مفيش حد صلاحيات مرسوم هنا.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            18
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 420\" role=\"img\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#20546e\"/></marker></defs><rect width=\"760\" height=\"420\" fill=\"#f8fcff\"/><g font-family=\"Arial, sans-serif\"><g data-node=\"ui\"><rect x=\"150\" y=\"20\" width=\"460\" height=\"55\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"54.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Layer N: user interface</text></g><g data-node=\"request-3\"><path d=\"M380 75 L380 110\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"upper\"><rect x=\"150\" y=\"110\" width=\"460\" height=\"55\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"144.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Higher-level OS services</text></g><g data-node=\"request-2\"><path d=\"M380 165 L380 200\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"lower\"><rect x=\"150\" y=\"200\" width=\"460\" height=\"55\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"234.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Lower-level OS services</text></g><g data-node=\"request-1\"><path d=\"M380 255 L380 290\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"hardware\"><rect x=\"150\" y=\"290\" width=\"460\" height=\"55\" rx=\"9\" fill=\"#e4f2e5\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"324.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Layer 0: hardware</text></g><text x=\"380\" y=\"390\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Only use lower-layer services</text></g></svg>",
      "steps": [
        {
          "id": "os-12-layers-step-1",
          "title": "Choose a dependency",
          "detail": "الـUI يعتمد على خدمة أدنى. ده ترتيب مسؤوليات، مش خريطة لكل برنامج أو Process.",
          "focus": [
            "ui",
            "request-3",
            "upper"
          ]
        },
        {
          "id": "os-12-layers-step-2",
          "title": "Follow lower services",
          "detail": "الخدمة تستخدم اللي تحتها حسب واجهات الطبقات. اختيار ترتيب الطبقات نفسه تحدي تصميم.",
          "focus": [
            "upper",
            "request-2",
            "lower",
            "request-1",
            "hardware"
          ]
        },
        {
          "id": "os-12-layers-step-3",
          "title": "Debug with assumptions",
          "detail": "الفصل يساعد الاختبار. لو الأدنى مختبر وملتزم، نقدر نعزل مشكلة الطبقة اللي بنراجعها؛ مش كل ظهور لخطأ يثبت مكان أصله.",
          "focus": [
            "upper",
            "lower"
          ]
        }
      ]
    },
    {
      "id": "os-12-microkernel-path",
      "conceptId": "os-12-microkernel",
      "title": "Messages between user-space services",
      "description": "مسار طلب توضيحي: Application تطلب من File service، والاتصال معتمد على Microkernel.",
      "legend": "App وFile service وDriver مكوّنات User space في مثال السلايد. الأسهم المرقمة اتجاه طلب الرسالة فقط؛ الرد يعكس المسار ومش مرسوم. IPC تعني دعم الاتصال بين العمليات. الخط المتقطع حد صلاحيات؛ الأجزاء داخل النواة دعم أساسي، مش كل خدمات OS.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            19,
            20
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 480\" role=\"img\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#20546e\"/></marker></defs><rect width=\"760\" height=\"480\" fill=\"#f8fcff\"/><g font-family=\"Arial, sans-serif\"><g data-node=\"app\"><rect x=\"30\" y=\"30\" width=\"200\" height=\"70\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"130\" y=\"72\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Application</text></g><g data-node=\"files\"><rect x=\"280\" y=\"30\" width=\"200\" height=\"70\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"72\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">File service</text></g><g data-node=\"driver\"><rect x=\"530\" y=\"30\" width=\"200\" height=\"70\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"630\" y=\"72\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Device driver</text></g><g data-node=\"privilege\"><path d=\"M20 195 H740\" stroke=\"#a4452b\" stroke-dasharray=\"9 6\" stroke-width=\"3\"/><text x=\"380\" y=\"185\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\"></text></g><text x=\"490\" y=\"185\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">User / kernel boundary</text><g data-node=\"microkernel\"><rect x=\"30\" y=\"250\" width=\"700\" height=\"110\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"299.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Microkernel: IPC support</text><text x=\"380\" y=\"324.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Basic memory management + CPU scheduling</text></g><g data-node=\"send\"><path d=\"M130 100 L130 250\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"193\" y=\"156\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">1: request</text></g><g data-node=\"deliver\"><path d=\"M380 250 L380 100\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"447\" y=\"150\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">2: deliver</text></g><g data-node=\"driver-message\"><path d=\"M630 250 L630 100\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"645\" y=\"233\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">Other messages</text></g><g data-node=\"hardware\"><rect x=\"230\" y=\"405\" width=\"300\" height=\"50\" rx=\"9\" fill=\"#e4f2e5\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"437\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Hardware</text></g><g data-node=\"hardware-link\"><path d=\"M380 360 L380 405\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g></g></svg>",
      "steps": [
        {
          "id": "os-12-microkernel-path-step-1",
          "title": "Send a request",
          "detail": "التطبيق يبعت رسالة. File service برّه Kernel؛ مش دالة جوّه Kernel الكبير زي Monolithic.",
          "focus": [
            "app",
            "send",
            "privilege"
          ]
        },
        {
          "id": "os-12-microkernel-path-step-2",
          "title": "Deliver to the service",
          "detail": "دعم الاتصال في Microkernel يوصل الطلب لـFile service. الرد يرجع في الاتجاه العكسي؛ مش مرسوم علشان يفضل المسار واضح.",
          "focus": [
            "microkernel",
            "deliver",
            "files"
          ]
        },
        {
          "id": "os-12-microkernel-path-step-3",
          "title": "Compare cost and isolation",
          "detail": "فيه خدمات أقل بصلاحيات Kernel، لكن تبادل الرسائل وعبور الحدود ليهم تكلفة. Driver هنا User service زي رسم المصدر؛ مش كل Driver في كل نظام مكانه كده.",
          "focus": [
            "driver",
            "driver-message",
            "microkernel"
          ]
        }
      ]
    },
    {
      "id": "os-12-kernel-modules",
      "conceptId": "os-12-modules",
      "title": "Modules connect inside the kernel",
      "description": "تبسيط للفكرة اللي يرسمها Solaris: Core ومكوّنات قابلة للتحميل، وكلهم جوّه Kernel عند التحميل.",
      "legend": "الإطار الكبير منطقة Kernel، مش Hardware. Core وModules مكوّنات برمجية. الخطوط اتصال بواجهات معروفة داخل Kernel؛ مفيش اتجاه زمني أو ترتيب طبقات أو رسائل User-space مفروضة. الأسماء أمثلة من رسم المصدر، مش قائمة كاملة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            21,
            22
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 420\" role=\"img\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#20546e\"/></marker></defs><rect width=\"760\" height=\"420\" fill=\"#f8fcff\"/><g font-family=\"Arial, sans-serif\"><g data-node=\"kernel-domain\"><rect x=\"25\" y=\"35\" width=\"710\" height=\"345\" rx=\"14\" fill=\"#eef7ff\" stroke=\"#31536b\" stroke-width=\"3\"/><text x=\"380\" y=\"65\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Kernel domain: all shown components</text></g><g data-node=\"links\"><path d=\"M260 145 L340 245 M500 145 L420 245 M260 335 L340 275 M500 335 L420 275\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\"/></g><g data-node=\"drivers\"><rect x=\"60\" y=\"95\" width=\"240\" height=\"70\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"180\" y=\"137\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Device / bus drivers</text></g><g data-node=\"files\"><rect x=\"460\" y=\"95\" width=\"240\" height=\"70\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"580\" y=\"137\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">File systems</text></g><g data-node=\"core\"><rect x=\"280\" y=\"215\" width=\"200\" height=\"80\" rx=\"9\" fill=\"#fff0d2\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"380\" y=\"262\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Core kernel</text></g><g data-node=\"schedule\"><rect x=\"60\" y=\"300\" width=\"240\" height=\"55\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"180\" y=\"334.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Scheduling classes</text></g><g data-node=\"formats\"><rect x=\"460\" y=\"300\" width=\"240\" height=\"55\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"580\" y=\"334.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Executable formats</text></g></g></svg>",
      "steps": [
        {
          "id": "os-12-kernel-modules-step-1",
          "title": "Separate components",
          "detail": "كل Module له وظيفة وواجهة معروفة، ويتحمّل حسب الحاجة. النظام مش مجبور يحمّل كل مكوّن دائمًا.",
          "focus": [
            "drivers",
            "files",
            "schedule",
            "formats"
          ]
        },
        {
          "id": "os-12-kernel-modules-step-2",
          "title": "Connect within the kernel",
          "detail": "الروابط اتصال داخل Kernel. ده تنظيم مرن، مش كل Module لازم تنادي الطبقة اللي تحتها فقط.",
          "focus": [
            "core",
            "links",
            "kernel-domain"
          ]
        },
        {
          "id": "os-12-kernel-modules-step-3",
          "title": "Keep privilege in view",
          "detail": "انفصال Module في الكود لا يعني عزلها كخدمة User space. حجم وأداء النظام الفعلي حسب المكوّنات المحمّلة والتنفيذ.",
          "focus": [
            "kernel-domain",
            "drivers",
            "files"
          ]
        }
      ]
    },
    {
      "id": "os-12-hybrid-example",
      "conceptId": "os-12-hybrid",
      "title": "An illustrative mixed organization",
      "description": "مثال افتراضي يجمع خدمة خارجية مع Core وModules داخل Kernel؛ مش رسم لأي منتج مذكور بالاسم.",
      "legend": "المربعات توزيع مكوّنات افتراضي. السهم ينقل طلب خدمة من Application عبر Core إلى User service؛ والخط داخل Kernel اتصال بواجهة Module. الخط المتقطع حد الصلاحيات. وجود المزج هو الفكرة، ومش بنستنتج منه مكان كل خدمة في Android أوiOS أوMac OS X.",
      "sourceRefs": [
        {
          "sourceId": "current-ch2",
          "slides": [
            19,
            21,
            23
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 760 420\" role=\"img\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#20546e\"/></marker></defs><rect width=\"760\" height=\"420\" fill=\"#f8fcff\"/><g font-family=\"Arial, sans-serif\"><g data-node=\"app\"><rect x=\"40\" y=\"25\" width=\"280\" height=\"65\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"180\" y=\"64.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Application</text></g><g data-node=\"server\"><rect x=\"440\" y=\"25\" width=\"280\" height=\"65\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"580\" y=\"64.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">One user-space service</text></g><g data-node=\"privilege\"><path d=\"M20 180 H740\" stroke=\"#a4452b\" stroke-dasharray=\"9 6\" stroke-width=\"3\"/><text x=\"380\" y=\"170\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">User above / Kernel below</text></g><g data-node=\"core\"><rect x=\"40\" y=\"250\" width=\"280\" height=\"90\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"180\" y=\"289.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Kernel core</text><text x=\"180\" y=\"314.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">One organization idea</text></g><g data-node=\"module\"><rect x=\"440\" y=\"250\" width=\"280\" height=\"90\" rx=\"9\" fill=\"#e0f2fe\" stroke=\"#31536b\" stroke-width=\"2\"/><text x=\"580\" y=\"289.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Kernel module</text><text x=\"580\" y=\"314.5\" font-size=\"20\" fill=\"#102e45\" text-anchor=\"middle\">Another organization idea</text></g><g data-node=\"request\"><path d=\"M180 90 L180 250\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/><text x=\"235\" y=\"132\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">request</text></g><g data-node=\"delivery\"><path d=\"M320 275 H385 V215 H580 V90\" fill=\"none\" stroke=\"#20546e\" stroke-width=\"3\" marker-end=\"url(#arrow)\"/></g><g data-node=\"module-link\"><path d=\"M320 320 H440\" stroke=\"#20546e\" stroke-width=\"3\"/><text x=\"380\" y=\"366\" font-size=\"18\" fill=\"#102e45\" text-anchor=\"middle\">Known interface</text></g></g></svg>",
      "steps": [
        {
          "id": "os-12-hybrid-example-step-1",
          "title": "Read the placement",
          "detail": "في المثال الافتراضي فيه خدمة User space، وفيه Module داخل Kernel. مش كل المكوّنات ماشية على نموذج نقي واحد.",
          "focus": [
            "app",
            "server",
            "privilege",
            "core",
            "module"
          ]
        },
        {
          "id": "os-12-hybrid-example-step-2",
          "title": "Mix the mechanisms",
          "detail": "السهم يوضح طلب من التطبيق عبر Core لخدمة خارجية، والخط التاني يوضح واجهة لمكوّن Kernel. الرد مش مرسوم.",
          "focus": [
            "request",
            "delivery",
            "module-link"
          ]
        },
        {
          "id": "os-12-hybrid-example-step-3",
          "title": "Do not overclassify",
          "detail": "كلمة Hybrid تقول إن فيه مزج لتحقيق أهداف التصميم. لازم تفاصيل النظام الفعلي قبل ما تقول كل خدمة مكانها فين.",
          "focus": [
            "server",
            "core",
            "module"
          ]
        }
      ]
    }
  ]
};if(typeof module==="object"&&module.exports)module.exports=lesson;else root.OSPilotLesson=lesson;})(typeof window!=="undefined"?window:globalThis);
