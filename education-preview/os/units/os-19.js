(function(root) {
  'use strict';
  const lesson = {
  "id": "os-19",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "3",
  "title": "Cooperating processes and IPC",
  "subtitle": "نفس البيانات في ذاكرة مشتركة، ولا رسائل؟ ومين يستنى إمتى؟",
  "sources": [
    {
      "id": "current-ch3",
      "title": "Chapter 3 · Processes",
      "driveId": "1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s",
      "url": "https://drive.google.com/file/d/1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s/view",
      "sha256": "7501cd4c2e06b1c09fedc2e7788d47df86786c263f68e0e268dc887c1b73444b",
      "slides": [
        25,
        26,
        27,
        28,
        29,
        30
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-19-cooperation",
      "title": "Why do processes cooperate?",
      "eyebrow": "01 · واحد ينتج والتاني يستخدم",
      "summary": "Cooperating processes can affect each other and need communication.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            25
          ]
        }
      ],
      "paragraphs": [
        "تخيّل Process تنتج بيانات وProcess تانية تستخدمها. دول Cooperating processes: تنفيذ كل واحدة ممكن يؤثر على التانية أو يتأثر بيها. Independent process في تعريف السلايد مالهاش التأثير المتبادل ده.",
        "المشاركة ممكن تفيد في Information sharing أو تقسيم البرنامج لأجزاء Modularity أو Convenience. Computation speedup سبب محتمل للتعاون؛ مش ضمان إن أي تقسيم هيخلّص أسرع، خصوصًا لو موارد المعالجة محدودة.",
        "IPC اختصار Interprocess communication. المصدر يعرض نموذجين: Shared memory وMessage passing."
      ]
    },
    {
      "id": "os-19-shared",
      "title": "Shared memory and producer–consumer",
      "eyebrow": "02 · مساحة بيانات مشتركة",
      "summary": "Processes communicate through a shared memory area and must coordinate access.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            26,
            27
          ]
        }
      ],
      "paragraphs": [
        "في Shared memory، فيه مساحة ذاكرة تقدر العمليات المشاركة توصل لها. Producer يحط معلومات وConsumer يستخدمها. بعد تجهيز المشاركة، تبادل البيانات في النموذج تحت تحكم User processes؛ مش لازم كل قراءة وكتابة تبقى رسالة رايحة للـKernel.",
        "وجود مساحة مشتركة مش بيحل ترتيب الشغل لوحده. محتاجين Synchronization عشان Consumer ماياخدش بيانات قبل Producer مايكمل كتابتها. هنا بنحدد المشكلة بس؛ مش بنضيف خوارزميات مزامنة من فصول لاحقة.",
        "Buffer هي مساحة احتفاظ مؤقتة بالبيانات. Bounded buffer حجمه ثابت؛ Unbounded buffer في النموذج مفيش حد عملي مفروض عليه. ده افتراض شرح، مش وعد بذاكرة حقيقية لا نهائية."
      ]
    },
    {
      "id": "os-19-messages",
      "title": "Message passing: send and receive",
      "eyebrow": "03 · ابعت رسالة بدل متغيّر مشترك",
      "summary": "Message passing exchanges messages through a communication link.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            26,
            28
          ]
        }
      ],
      "paragraphs": [
        "في Message passing، P وQ يحتاجوا Communication link، وبعدها send(message) وreceive(message). البيانات بتتبادل كرسائل؛ النموذج مش محتاج إنهم يتكلموا عن طريق Shared variables.",
        "حجم الرسالة ممكن يبقى Fixed أو Variable حسب الواجهة. الرابط له اختيارات في Synchronization وBuffering؛ مجرد وجود send مش كفاية تعرف المرسل هيستنى ولا لأ.",
        "رسم سلايد 26 بيمرّر رسائل عبر Kernel queue، ويقابله Shared-memory area بين العمليات. ده مقارنة مسار الاتصال في النموذج، مش ادعاء إن OS مالوش أي دور في إنشاء أو حماية Shared memory."
      ]
    },
    {
      "id": "os-19-blocking",
      "title": "Blocking, non-blocking and rendezvous",
      "eyebrow": "04 · النداء يرجع إمتى؟",
      "summary": "Blocking describes when a communication operation waits.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            29
          ]
        }
      ],
      "paragraphs": [
        "Blocking send في تعريف السلايد: المرسل يستنى لحد الرسالة تتستقبل. Blocking receive: المستقبل يستنى لحد رسالة تبقى متاحة. السؤال عن إمتى النداء يكمّل، مش عن إن الـCPU كله واقف.",
        "Non-blocking send يسمح للمرسل يكمل بعد الإرسال وفق نموذج الواجهة. Non-blocking receive يرجع برسالة صالحة لو موجودة، أو نتيجة تدل إن مفيش رسالة، بدل ما يقف مستني.",
        "لو send وreceive الاتنين Blocking، السلايد بيسمي اللقاء Rendezvous: المرسل والمستقبل لازم يتقابلوا للتبادل. ممكن تركّب اختيارات مختلفة؛ ماينفعش تستنتج نوع receive من اسم send لوحده."
      ]
    },
    {
      "id": "os-19-buffering",
      "title": "Link capacity changes the waiting condition",
      "eyebrow": "05 · الطابور فاضي ولا مليان؟",
      "summary": "Capacity limits explain waiting for buffer space, separately from receive acknowledgement.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            30
          ]
        }
      ],
      "paragraphs": [
        "Zero capacity: مفيش مكان تتصف فيه الرسائل على الرابط؛ المرسل لازم يتقابل مع مستقبل. ده Rendezvous في نموذج السلايد.",
        "Bounded capacity: طابور بعدد محدود n من الرسائل. لو كله مليان، الإرسال اللي يحتاج مكان يستنى لحد مساحة تفضى في نموذج السلايد. Unbounded capacity: نفترض طابور من غير حد، فمش هيستنى بسبب امتلاء الطابور.",
        "توضيح مهم لعبارة Sender never waits في سلايد 30: المقصود انتظار مساحة Buffer في نموذج السعة. لو تعريف الواجهة Blocking send لحد الاستقبال، ده شرط تاني ومش بيتلغي بمجرد إن الطابور واسع. نفرّق شروط الواجهة عن شروط السعة.",
        "في الرسم التعليمي عندنا سعتين فقط للتبسيط: [m1, m2]. الأرقام أسماء رسائل وعدد الخانات افتراض للمثال، مش قياس نظام حقيقي."
      ]
    }
  ],
  "visualizations": [
    {
      "id": "os-19-ipc-models",
      "conceptId": "os-19-messages",
      "title": "Two IPC paths: messages and shared memory",
      "description": "قارن مكان البيانات وطريقة وصولها، مش لون الصناديق.",
      "legend": "الصف الأول رسالة من A عبر Kernel/link إلى B كما في سلايد 26. الصف الثاني مشاركة مساحة واحدة: سهم Write من Producer للمساحة وسهم Read من المساحة للـConsumer. الحدود بتفرّق العمليات والآلية، مش Layout ذاكرة فعلي. يفترض الصف المشترك أن المنطقة تم تجهيزها وأن الوصول منسّق.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            25,
            26,
            27,
            28
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 820 440\" role=\"img\" aria-label=\"Two IPC paths: messages and shared memory\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"8\" markerHeight=\"8\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#24516c\"/></marker></defs><rect width=\"820\" height=\"440\" fill=\"#ffffff\"/><g font-family=\"Arial, sans-serif\" fill=\"#17394e\"><text x=\"25\" y=\"35\" text-anchor=\"start\" font-size=\"20\">Message passing · illustrative kernel-mediated path</text><g data-node=\"msg-a\"><rect x=\"25\" y=\"80\" width=\"190\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"120\" y=\"108\" text-anchor=\"middle\" font-size=\"20\">Process A</text><text x=\"120\" y=\"134\" text-anchor=\"middle\" font-size=\"20\">send(message)</text></g><g data-node=\"kernel-link\"><rect x=\"295\" y=\"80\" width=\"230\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"410\" y=\"108\" text-anchor=\"middle\" font-size=\"20\">Kernel / link</text><text x=\"410\" y=\"134\" text-anchor=\"middle\" font-size=\"20\">Message queue</text></g><g data-node=\"msg-b\"><rect x=\"605\" y=\"80\" width=\"190\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"700\" y=\"108\" text-anchor=\"middle\" font-size=\"20\">Process B</text><text x=\"700\" y=\"134\" text-anchor=\"middle\" font-size=\"20\">receive(message)</text></g><g data-node=\"send\"><path d=\"M215 115 L295 115\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"255\" y=\"95\" text-anchor=\"middle\" font-size=\"18\">message</text></g><g data-node=\"receive\"><path d=\"M525 115 L605 115\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"565\" y=\"95\" text-anchor=\"middle\" font-size=\"18\">message</text></g><text x=\"25\" y=\"245\" text-anchor=\"start\" font-size=\"20\">Shared memory · common area after setup</text><g data-node=\"producer\"><rect x=\"25\" y=\"290\" width=\"190\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"120\" y=\"318\" text-anchor=\"middle\" font-size=\"20\">Producer A</text><text x=\"120\" y=\"344\" text-anchor=\"middle\" font-size=\"20\">Writes data</text></g><g data-node=\"shared-area\"><rect x=\"295\" y=\"290\" width=\"230\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"410\" y=\"318\" text-anchor=\"middle\" font-size=\"20\">Shared area</text><text x=\"410\" y=\"344\" text-anchor=\"middle\" font-size=\"20\">Same stored data</text></g><g data-node=\"consumer\"><rect x=\"605\" y=\"290\" width=\"190\" height=\"70\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"700\" y=\"318\" text-anchor=\"middle\" font-size=\"20\">Consumer B</text><text x=\"700\" y=\"344\" text-anchor=\"middle\" font-size=\"20\">Reads data</text></g><g data-node=\"write\"><path d=\"M215 325 L295 325\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"255\" y=\"305\" text-anchor=\"middle\" font-size=\"18\">write</text></g><g data-node=\"read\"><path d=\"M525 325 L605 325\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"565\" y=\"305\" text-anchor=\"middle\" font-size=\"18\">read</text></g></g></svg>",
      "steps": [
        {
          "id": "os-19-ipc-models-step-1",
          "title": "Send and receive",
          "detail": "في Message passing العمليات تتبادل رسائل عبر آلية الرابط، من غير Shared variables للتواصل.",
          "focus": [
            "msg-a",
            "send",
            "kernel-link",
            "receive",
            "msg-b"
          ]
        },
        {
          "id": "os-19-ipc-models-step-2",
          "title": "A common region",
          "detail": "في Shared memory، Producer وConsumer يوصلوا لنفس مساحة البيانات بعد تجهيزها.",
          "focus": [
            "producer",
            "write",
            "shared-area",
            "read",
            "consumer"
          ]
        },
        {
          "id": "os-19-ipc-models-step-3",
          "title": "Coordinate access",
          "detail": "مشاركة نفس المساحة محتاجة ترتيب الوصول؛ Consumer ماينفعش يقرأ قبل اكتمال البيانات.",
          "focus": [
            "producer",
            "shared-area",
            "consumer"
          ]
        }
      ]
    },
    {
      "id": "os-19-buffer-capacity",
      "conceptId": "os-19-buffering",
      "title": "Three link-capacity models",
      "description": "قارن سبب انتظار مساحة. كل صف مثال مستقل؛ البلوكات m1 وm2 رسائل افتراضية.",
      "legend": "السهم دخول رسالة للطابور ثم استلامها. Zero مفيهوش طابور، وBounded هنا سعته رسالتان فقط والمكانان مشغولان، وUnbounded افتراض بلا حد في النموذج. الخط المنتهي بحاجز قبل الطابور معناه إن الرسالة الثالثة مش قادرة تدخل وهو مليان. النص يصف انتظار مساحة لا كل شروط Blocking send؛ لا يوجد مقياس سرعة أو ذاكرة فعلية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            29,
            30
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 820 530\" role=\"img\" aria-label=\"Three link-capacity models\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"8\" markerHeight=\"8\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#24516c\"/></marker></defs><rect width=\"820\" height=\"530\" fill=\"#ffffff\"/><g font-family=\"Arial, sans-serif\" fill=\"#17394e\"><text x=\"25\" y=\"45\" text-anchor=\"start\" font-size=\"20\">Zero capacity</text><g data-node=\"zero-send\"><rect x=\"25\" y=\"70\" width=\"195\" height=\"60\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"122.5\" y=\"98\" text-anchor=\"middle\" font-size=\"20\">Sender</text></g><g data-node=\"zero-recv\"><rect x=\"600\" y=\"70\" width=\"195\" height=\"60\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"697.5\" y=\"98\" text-anchor=\"middle\" font-size=\"20\">Receiver</text></g><g data-node=\"rendezvous\"><path d=\"M220 100 L600 100\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"410\" y=\"82\" text-anchor=\"middle\" font-size=\"18\">Direct handoff · sender waits</text></g><text x=\"25\" y=\"220\" text-anchor=\"start\" font-size=\"20\">Bounded example: n = 2, both slots full</text><g data-node=\"full-send\"><rect x=\"25\" y=\"245\" width=\"195\" height=\"65\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"122.5\" y=\"273\" text-anchor=\"middle\" font-size=\"20\">Sender of m3</text><text x=\"122.5\" y=\"299\" text-anchor=\"middle\" font-size=\"20\">Wait for space</text></g><g data-node=\"full-buffer\"><rect x=\"295\" y=\"245\" width=\"230\" height=\"65\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"410\" y=\"273\" text-anchor=\"middle\" font-size=\"20\">[ m1 ][ m2 ]</text><text x=\"410\" y=\"299\" text-anchor=\"middle\" font-size=\"20\">Full buffer</text></g><g data-node=\"full-recv\"><rect x=\"600\" y=\"245\" width=\"195\" height=\"65\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"697.5\" y=\"273\" text-anchor=\"middle\" font-size=\"20\">Receiver</text><text x=\"697.5\" y=\"299\" text-anchor=\"middle\" font-size=\"20\">Frees a slot</text></g><g data-node=\"blocked-send\"><path d=\"M220 277 L280 277 M280 264 L280 290\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\"/></g><g data-node=\"full-link\"><path d=\"M525 277 L600 277\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/></g><text x=\"25\" y=\"400\" text-anchor=\"start\" font-size=\"20\">Unbounded model: no waiting caused by buffer fullness</text><g data-node=\"unbounded\"><rect x=\"130\" y=\"430\" width=\"560\" height=\"65\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"410\" y=\"458\" text-anchor=\"middle\" font-size=\"20\">Queue may grow in the model</text><text x=\"410\" y=\"484\" text-anchor=\"middle\" font-size=\"20\">Does not cancel a separate blocking-send rule</text></g></g></svg>",
      "steps": [
        {
          "id": "os-19-buffer-capacity-step-1",
          "title": "No queue slots",
          "detail": "Zero capacity محتاج لقاء Sender وReceiver؛ مفيش مكان نخزن رسالة لحد ما المستقبل ييجي.",
          "focus": [
            "zero-send",
            "rendezvous",
            "zero-recv"
          ]
        },
        {
          "id": "os-19-buffer-capacity-step-2",
          "title": "Finite and full",
          "detail": "في المثال السعة 2 ومليانة. الرسالة m3 تحتاج مكان؛ الاستقبال يفضّي خانة فيسمح بالتقدم.",
          "focus": [
            "full-send",
            "blocked-send",
            "full-buffer",
            "full-link",
            "full-recv"
          ]
        },
        {
          "id": "os-19-buffer-capacity-step-3",
          "title": "No fullness limit in the model",
          "detail": "Unbounded معناها مفيش انتظار بسبب امتلاء Buffer. لو الواجهة تنتظر استلامًا، ده شرط مختلف.",
          "focus": [
            "unbounded"
          ]
        }
      ]
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-19-cooperation-example",
      "type": "mcq",
      "placement": "os-19-cooperation",
      "objective": "Process A produces data used by process B. Which description fits?",
      "prerequisites": [
        "os-19-cooperation"
      ],
      "prompt": "Process A produces data used by process B. Which description fits?",
      "options": [
        {
          "id": "os-19-cooperation-example-o1",
          "text": "Cooperating processes"
        },
        {
          "id": "os-19-cooperation-example-o2",
          "text": "Independent processes by definition"
        },
        {
          "id": "os-19-cooperation-example-o3",
          "text": "A guarantee of faster execution"
        }
      ],
      "correctOptionId": "os-19-cooperation-example-o1",
      "feedback": {
        "os-19-cooperation-example-o1": "صح؛ فيه تأثير وتبادل بيانات، فده تعاون محتاج IPC.",
        "os-19-cooperation-example-o2": "Independent في تعريف السلايد مش بتؤثر أو تتأثر بتنفيذ غيرها؛ المثال فيه اعتماد بيانات.",
        "os-19-cooperation-example-o3": "Speedup سبب محتمل للتعاون لكنه مش نتيجة مضمونة من مجرد وجود عمليتين."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            25
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-19-shared-coordinate",
      "type": "mcq",
      "placement": "os-19-shared",
      "objective": "A shared-memory consumer may read before the producer finishes writing. What is missing?",
      "prerequisites": [
        "os-19-shared"
      ],
      "prompt": "A shared-memory consumer may read before the producer finishes writing. What is missing?",
      "options": [
        {
          "id": "os-19-shared-coordinate-o1",
          "text": "A longer executable filename"
        },
        {
          "id": "os-19-shared-coordinate-o2",
          "text": "Synchronization of their access"
        },
        {
          "id": "os-19-shared-coordinate-o3",
          "text": "A guarantee of unbounded physical RAM"
        }
      ],
      "correctOptionId": "os-19-shared-coordinate-o2",
      "feedback": {
        "os-19-shared-coordinate-o1": "اسم الملف ملوش علاقة بترتيب وصول العمليات للبيانات.",
        "os-19-shared-coordinate-o2": "صح؛ الوصول لنفس المساحة محتاج تنسيق عشان البيانات تكون جاهزة قبل قراءتها.",
        "os-19-shared-coordinate-o3": "Unbounded افتراض سعة، مش حل لترتيب الكتابة والقراءة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            27
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-19-message-ops",
      "type": "mcq",
      "placement": "os-19-messages",
      "objective": "Which pair describes the IPC operations in the message-passing model?",
      "prerequisites": [
        "os-19-messages"
      ],
      "prompt": "Which pair describes the IPC operations in the message-passing model?",
      "options": [
        {
          "id": "os-19-message-ops-o1",
          "text": "fork and exec"
        },
        {
          "id": "os-19-message-ops-o2",
          "text": "send and receive"
        },
        {
          "id": "os-19-message-ops-o3",
          "text": "open and rename"
        }
      ],
      "correctOptionId": "os-19-message-ops-o2",
      "feedback": {
        "os-19-message-ops-o1": "fork وexec لإنشاء/استبدال برامج في أمثلة العمليات؛ مش عمليتا تبادل الرسائل هنا.",
        "os-19-message-ops-o2": "صح؛ لازم رابط اتصال وتبادل باستخدام send وreceive.",
        "os-19-message-ops-o3": "الزوج ده مش عمليات IPC اللي سلايد Message passing عرضها."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            28
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-19-shared-no-os",
      "type": "true-false",
      "placement": "os-19-shared",
      "objective": "Shared-memory data exchange means the OS has no role in setting up or protecting the shared region.",
      "prerequisites": [
        "os-19-shared"
      ],
      "prompt": "Shared-memory data exchange means the OS has no role in setting up or protecting the shared region.",
      "options": [
        {
          "id": "os-19-shared-no-os-o1",
          "text": "True · صح"
        },
        {
          "id": "os-19-shared-no-os-o2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-19-shared-no-os-o2",
      "feedback": {
        "os-19-shared-no-os-o1": "السلايد يقارن مسار تبادل البيانات، مش بيلغي إدارة OS للذاكرة أو صلاحياتها.",
        "os-19-shared-no-os-o2": "غلط؛ تحكم User processes في التبادل بعد التجهيز لا يلغي دور OS في إعداد وحماية الذاكرة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            26,
            27
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-19-empty-receive",
      "type": "mcq",
      "placement": "os-19-blocking",
      "objective": "No message is available. What does a non-blocking receive do in the slide’s model?",
      "prerequisites": [
        "os-19-blocking"
      ],
      "prompt": "No message is available. What does a non-blocking receive do in the slide’s model?",
      "options": [
        {
          "id": "os-19-empty-receive-o1",
          "text": "It waits until a message arrives."
        },
        {
          "id": "os-19-empty-receive-o2",
          "text": "It returns an indication that no message is available."
        },
        {
          "id": "os-19-empty-receive-o3",
          "text": "It terminates the sender."
        }
      ],
      "correctOptionId": "os-19-empty-receive-o2",
      "feedback": {
        "os-19-empty-receive-o1": "ده وصف Blocking receive؛ non-blocking مايقفش مستني وصول الرسالة.",
        "os-19-empty-receive-o2": "صح؛ يرجع نتيجة زي Null message بدل الانتظار، حسب واجهة النموذج.",
        "os-19-empty-receive-o3": "عدم وجود رسالة مش أمر بإنهاء Sender؛ السؤال عن نتيجة receive."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            29
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-19-bounded-full",
      "type": "mcq",
      "placement": "os-19-buffering",
      "objective": "A bounded link has two slots, both full. In the slide’s capacity model, what must a third send wait for?",
      "prerequisites": [
        "os-19-buffering"
      ],
      "prompt": "A bounded link has two slots, both full. In the slide’s capacity model, what must a third send wait for?",
      "options": [
        {
          "id": "os-19-bounded-full-o1",
          "text": "A free buffer slot"
        },
        {
          "id": "os-19-bounded-full-o2",
          "text": "A new PID for the sender"
        },
        {
          "id": "os-19-bounded-full-o3",
          "text": "The receiver to terminate"
        }
      ],
      "correctOptionId": "os-19-bounded-full-o1",
      "feedback": {
        "os-19-bounded-full-o1": "صح؛ المشكلة امتلاء الطابور. استقبال رسالة يقدر يفضّي مكان في المثال.",
        "os-19-bounded-full-o2": "PID مالوش علاقة بسعة طابور الرسائل.",
        "os-19-bounded-full-o3": "إنهاء المستقبل مش الشرط؛ محتاجين مساحة، وغالبًا الاستقبال هو اللي يفضّيها في المثال."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            30
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-19-unbounded-all-waits",
      "type": "true-false",
      "placement": "os-19-buffering",
      "objective": "An unbounded buffer cancels the receive condition of a separately specified blocking send.",
      "prerequisites": [
        "os-19-buffering"
      ],
      "prompt": "An unbounded buffer cancels the receive condition of a separately specified blocking send.",
      "options": [
        {
          "id": "os-19-unbounded-all-waits-o1",
          "text": "True · صح"
        },
        {
          "id": "os-19-unbounded-all-waits-o2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-19-unbounded-all-waits-o2",
      "feedback": {
        "os-19-unbounded-all-waits-o1": "دي شروط مختلفة: مساحة Buffer موجودة لا تعني بالضرورة إن Receiver استلم الرسالة.",
        "os-19-unbounded-all-waits-o2": "غلط؛ السعة تمنع انتظار الامتلاء، لكن Blocking send ممكن يفضل مرتبط باستقبال الرسالة حسب الواجهة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            29,
            30
          ]
        }
      ],
      "provenance": {
        "kind": "new"
      }
    },
    {
      "id": "os-19-rendezvous",
      "type": "mcq",
      "placement": "os-19-blocking",
      "objective": "Which source-model combination is described as a rendezvous?",
      "prerequisites": [
        "os-19-blocking"
      ],
      "prompt": "Which source-model combination is described as a rendezvous?",
      "options": [
        {
          "id": "os-19-rendezvous-o1",
          "text": "Both send and receive are blocking."
        },
        {
          "id": "os-19-rendezvous-o2",
          "text": "Every non-blocking receive, even with no sender."
        },
        {
          "id": "os-19-rendezvous-o3",
          "text": "Any buffer that has at least one free slot."
        }
      ],
      "correctOptionId": "os-19-rendezvous-o1",
      "feedback": {
        "os-19-rendezvous-o1": "صح؛ الطرفان يتقابلوا للتبادل في تعريف السلايد. Zero capacity كمان يحتاج لقاء مباشر.",
        "os-19-rendezvous-o2": "Non-blocking receive ممكن يرجع بدون رسالة؛ ده مش لقاء لازم مع Sender.",
        "os-19-rendezvous-o3": "وجود خانة فاضية معناه مساحة متاحة، مش إن الطرفين اتقابلوا للاستلام."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            29,
            30
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
      "id": "os-19-term-ipc",
      "term": "IPC",
      "translation": "اتصال بين العمليات",
      "definition": "Mechanisms allowing processes to exchange information and coordinate.",
      "explanation": "Process تنتج أو تبعت، وProcess تانية تستفيد من البيانات.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            25,
            28
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-cooperating-process",
      "term": "Cooperating process",
      "translation": "عملية متعاونة",
      "definition": "A process that can affect or be affected by another process’s execution.",
      "explanation": "زي Producer بيجهّز بيانات تستخدمها Process تانية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            25
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-independent-process",
      "term": "Independent process",
      "translation": "عملية مستقلة في النموذج",
      "definition": "A process that cannot affect or be affected by another process’s execution.",
      "explanation": "تعريف النموذج لعملية من غير التأثير المتبادل المقصود هنا.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            25
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-shared-memory",
      "term": "Shared memory",
      "translation": "ذاكرة مشتركة",
      "definition": "A memory region accessible to communicating processes.",
      "explanation": "الاتنين يوصلوا لنفس البيانات؛ لازم ينظموا الوصول.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            26,
            27
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-producer",
      "term": "Producer",
      "translation": "منتج البيانات",
      "definition": "A process producing information for another process to consume.",
      "explanation": "بيجهّز البيانات اللي Consumer هيستخدمها.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            27
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-consumer",
      "term": "Consumer",
      "translation": "مستهلك البيانات",
      "definition": "A process consuming information produced by another process.",
      "explanation": "لازم يقرأ بيانات جاهزة وبترتيب منسّق.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            27
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-synchronization",
      "term": "Synchronization",
      "translation": "تنسيق التوقيت والترتيب",
      "definition": "Coordination of processes’ actions during communication or shared access.",
      "explanation": "نضمن ترتيب مناسب للكتابة والقراءة أو الإرسال والاستقبال.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            27,
            29
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-message-passing",
      "term": "Message passing",
      "translation": "تبادل رسائل",
      "definition": "IPC through send and receive operations over a communication link.",
      "explanation": "البيانات بتتبعت كرسائل بدل التواصل بمتغيرات مشتركة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            28
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-communication-link",
      "term": "Communication link",
      "translation": "رابط اتصال",
      "definition": "The connection over which processes exchange messages.",
      "explanation": "الطريق المنطقي اللي الرسائل بتعدّي عليه؛ له شروط وسعة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            28,
            30
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-blocking-send",
      "term": "Blocking send",
      "translation": "إرسال ينتظر الاستلام",
      "definition": "A send that waits until the message is received in the slide’s model.",
      "explanation": "المرسل مايكمّلش النداء قبل تحقق شرط الاستلام المحدد.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            29
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-blocking-receive",
      "term": "Blocking receive",
      "translation": "استقبال ينتظر رسالة",
      "definition": "A receive that waits until a message is available.",
      "explanation": "لو مفيش رسالة، المستقبل ينتظر بدل يرجع فاضي.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            29
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-non-blocking-receive",
      "term": "Non-blocking receive",
      "translation": "استقبال بلا انتظار",
      "definition": "A receive returning a message or a no-message result without waiting for arrival.",
      "explanation": "مفيش رسالة؟ يرجع بنتيجة توضّح ده، مش يفضل واقف.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            29
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-rendezvous",
      "term": "Rendezvous",
      "translation": "لقاء مباشر للتبادل",
      "definition": "A synchronous meeting of sender and receiver in the source model.",
      "explanation": "الطرفين يتقابلوا للتسليم والاستلام؛ Zero capacity محتاج اللقاء ده.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            29,
            30
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-buffer",
      "term": "Buffer",
      "translation": "مساحة انتظار مؤقتة",
      "definition": "Temporary storage for information or queued messages.",
      "explanation": "رسائل تستنى هنا لحد ما يتم استلامها في نموذج الطابور.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            27,
            30
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-zero-capacity",
      "term": "Zero capacity",
      "translation": "سعة صفرية",
      "definition": "A link with no message queue slots.",
      "explanation": "مفيش تخزين على الرابط؛ Sender محتاج Receiver.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            30
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-bounded-capacity",
      "term": "Bounded capacity",
      "translation": "سعة محدودة",
      "definition": "A finite-size queue that can become full.",
      "explanation": "لما الخانات تتملي، الإرسال اللي يحتاج مكان يستنى في النموذج.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            27,
            30
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-19-term-unbounded-capacity",
      "term": "Unbounded capacity",
      "translation": "سعة غير محدودة في النموذج",
      "definition": "A queue assumed to have no capacity limit in the model.",
      "explanation": "مفيش انتظار بسبب امتلاء الطابور في الافتراض، مش RAM حقيقية لا نهائية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            27,
            30
          ]
        }
      ],
      "kind": "source-concept"
    }
  ]
};
  if (typeof module === 'object' && module.exports) module.exports = lesson;
  if (typeof window !== 'undefined') window.OSPilotLesson = lesson;
})(typeof window !== 'undefined' ? window : globalThis);
