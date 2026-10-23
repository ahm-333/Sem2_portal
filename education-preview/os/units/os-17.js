(function(root) {
  'use strict';
  const lesson = {
  "id": "os-17",
  "version": "1.0.0",
  "guideVersion": "1.2.0",
  "courseId": "operating-system",
  "lectureId": "3",
  "title": "Mobile multitasking: read the historical example",
  "subtitle": "مثال ©2013 يفرّق بين اللي ظاهر على الشاشة واللي مسموح يكمل في الخلفية.",
  "sources": [
    {
      "id": "current-ch3",
      "title": "Chapter 3 · Processes",
      "driveId": "1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s",
      "url": "https://drive.google.com/file/d/1h7se1OzceqGrKcmWtsOpb09WDBGuJT9s/view",
      "sha256": "7501cd4c2e06b1c09fedc2e7788d47df86786c263f68e0e268dc887c1b73444b",
      "slides": [
        17
      ],
      "credit": "Operating System Concepts, 9th Edition · Silberschatz, Galvin & Gagne ©2013"
    }
  ],
  "concepts": [
    {
      "id": "os-17-mobile",
      "title": "Foreground, background and suspension",
      "eyebrow": "01 · ظاهر على الشاشة ولا له شغل مسموح؟",
      "summary": "The historical example separates UI visibility from permission to execute.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            17
          ]
        }
      ],
      "paragraphs": [
        "إنت فاتح تطبيق، وفيه صوت ممكن يكمل في الخلفية. المثال هنا من سلايد ©2013، وبيتكلم عن Early iOS وبعض قيود أنظمة الموبايل وقتها. مش دليل استخدام للإصدارات الحالية.",
        "Foreground process هي اللي بتتعامل معاها من واجهة المستخدم في المثال. Background processes مش ظاهرة على الشاشة، وممكن تكون في الذاكرة وليها تنفيذ بقيود: مهمة قصيرة، استقبال حدث، أو شغل محدد زي Audio playback.",
        "Suspended معناها تنفيذها متوقف مؤقتًا. كون التطبيق مش ظاهر مش كفاية تقول إنه Suspended؛ لازم تعرف سياسة النظام ونوع المهمة المسموح بيها."
      ]
    },
    {
      "id": "os-17-service",
      "title": "The slide’s Android service example",
      "eyebrow": "02 · Service مش نافذة مخفية",
      "summary": "The slide uses a service to illustrate background work without a user interface.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            17
          ]
        }
      ],
      "paragraphs": [
        "السلايد بيقارن بمثال Android وقتها: Service لشغل Background من غير User interface، وبيقول إن حدود الخلفية كانت أقل في المقارنة دي.",
        "اقرأ عبارة إن Service ممكن تستمر مع تعليق جزء التطبيق على إنها فصل بين شغل الخلفية والواجهة. ماينفعش نفسّرها إن كود بيتنفّذ جوه Process متوقفة بالكامل. الرسم هنا بيفصل الدورين ومش بيفرض إنهم دايمًا في نفس Process أو دايمًا عمليتين.",
        "الدرس اللي ناخده من المقارنة: اختفاء الواجهة، وجود العملية في الذاكرة، والسماح لها بالتنفيذ قرارات مختلفة. مفيش في الدرس حكم عن حدود iOS أو Android الحديثة أو استهلاك ذاكرة مضمون لكل Service."
      ]
    }
  ],
  "visualizations": [
    {
      "id": "os-17-mobile-policy",
      "conceptId": "os-17-mobile",
      "title": "Historical mobile example · ©2013 slide",
      "description": "اقرأ المسارات كاختيارات سياسة النظام، مش انتقالات إجبارية لكل تطبيق.",
      "legend": "الصناديق أدوار/حالات في المثال التاريخي. السهم من الواجهة للخلفية يعني فقدان العرض، وبعدها سياسة النظام تحدد تنفيذ مهمة مسموحة أو Suspension. السهمان بدائل مش خطوتين لازم يحصلوا؛ لا يصف الرسم إصدارات موبايل حالية.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            17
          ]
        }
      ],
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 820 440\" role=\"img\" aria-label=\"Historical mobile example · ©2013 slide\"><defs><marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"8\" markerHeight=\"8\" orient=\"auto-start-reverse\"><path d=\"M0 0 L10 5 L0 10 Z\" fill=\"#24516c\"/></marker></defs><rect width=\"820\" height=\"440\" fill=\"#ffffff\"/><g font-family=\"Arial, sans-serif\" fill=\"#17394e\"><g data-node=\"foreground\"><rect x=\"35\" y=\"165\" width=\"230\" height=\"85\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"150\" y=\"193\" text-anchor=\"middle\" font-size=\"20\">Foreground</text><text x=\"150\" y=\"219\" text-anchor=\"middle\" font-size=\"20\">Visible UI interaction</text></g><g data-node=\"policy\"><rect x=\"330\" y=\"165\" width=\"210\" height=\"85\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"435\" y=\"193\" text-anchor=\"middle\" font-size=\"20\">Background policy</text><text x=\"435\" y=\"219\" text-anchor=\"middle\" font-size=\"20\">Task + system limits</text></g><g data-node=\"allowed\"><rect x=\"595\" y=\"45\" width=\"200\" height=\"100\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"695\" y=\"73\" text-anchor=\"middle\" font-size=\"20\">Allowed task</text><text x=\"695\" y=\"99\" text-anchor=\"middle\" font-size=\"20\">Example: audio</text><text x=\"695\" y=\"125\" text-anchor=\"middle\" font-size=\"20\">No foreground UI</text></g><g data-node=\"suspended\"><rect x=\"595\" y=\"315\" width=\"200\" height=\"65\" rx=\"10\" fill=\"#e5f3ff\" stroke=\"#24516c\" stroke-width=\"2\"/><text x=\"695\" y=\"343\" text-anchor=\"middle\" font-size=\"20\">Suspended</text><text x=\"695\" y=\"369\" text-anchor=\"middle\" font-size=\"20\">Not executing</text></g><g data-node=\"hide\"><path d=\"M265 207 L330 207\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"405\" y=\"140\" text-anchor=\"middle\" font-size=\"18\">UI leaves foreground</text></g><g data-node=\"permit\"><path d=\"M540 190 L565 190 L565 95 L595 95\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"607\" y=\"178\" text-anchor=\"middle\" font-size=\"18\">allowed</text></g><g data-node=\"suspend\"><path d=\"M540 225 L565 225 L565 347 L595 347\" fill=\"none\" stroke=\"#24516c\" stroke-width=\"2.5\" marker-end=\"url(#arrow)\"/><text x=\"660\" y=\"280\" text-anchor=\"middle\" font-size=\"18\">not allowed now</text></g></g></svg>",
      "steps": [
        {
          "id": "os-17-mobile-policy-step-1",
          "title": "Visible UI",
          "detail": "في المثال Foreground هي واجهة بتتعامل معاها، مش كل شغل الجهاز.",
          "focus": [
            "foreground"
          ]
        },
        {
          "id": "os-17-mobile-policy-step-2",
          "title": "Background is a policy decision",
          "detail": "لما الواجهة تختفي، نوع المهمة وحدود النظام يحددوا إيه المسموح.",
          "focus": [
            "hide",
            "policy"
          ]
        },
        {
          "id": "os-17-mobile-policy-step-3",
          "title": "A permitted task",
          "detail": "الصوت مثال تاريخي لشغل ممكن يكمل بقيود من غير واجهة ظاهرة.",
          "focus": [
            "permit",
            "allowed"
          ]
        },
        {
          "id": "os-17-mobile-policy-step-4",
          "title": "Suspension",
          "detail": "لو التنفيذ متوقف، نسميه Suspended. الخلفية مش مرادف تلقائي للكلمة دي.",
          "focus": [
            "suspend",
            "suspended"
          ]
        }
      ]
    }
  ],
  "historicalItems": [],
  "essayReferences": [],
  "questions": [
    {
      "id": "os-17-historical-conclusion",
      "type": "mcq",
      "placement": "os-17-mobile",
      "objective": "What is a justified conclusion from this 2013 slide?",
      "prerequisites": [
        "os-17-mobile"
      ],
      "prompt": "What is a justified conclusion from this 2013 slide?",
      "options": [
        {
          "id": "os-17-historical-conclusion-o1",
          "text": "All current mobile systems enforce exactly these limits."
        },
        {
          "id": "os-17-historical-conclusion-o2",
          "text": "Foreground visibility and background execution permission are different ideas."
        },
        {
          "id": "os-17-historical-conclusion-o3",
          "text": "Every hidden application is executing without limits."
        }
      ],
      "correctOptionId": "os-17-historical-conclusion-o2",
      "feedback": {
        "os-17-historical-conclusion-o1": "المصدر مثال تاريخي؛ مايثبتش حدود كل إصدار حالي.",
        "os-17-historical-conclusion-o2": "صح؛ الواجهة ممكن تختفي لكن التنفيذ يعتمد على نوع المهمة وسياسة النظام.",
        "os-17-historical-conclusion-o3": "السلايد نفسه بيتكلم عن قيود وتعليق؛ الاختفاء مش تنفيذ مفتوح."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
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
      "id": "os-17-hidden-suspended",
      "type": "true-false",
      "placement": "os-17-mobile",
      "objective": "In the historical example, every process not shown on the display must be suspended.",
      "prerequisites": [
        "os-17-mobile"
      ],
      "prompt": "In the historical example, every process not shown on the display must be suspended.",
      "options": [
        {
          "id": "os-17-hidden-suspended-o1",
          "text": "True · صح"
        },
        {
          "id": "os-17-hidden-suspended-o2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-17-hidden-suspended-o2",
      "feedback": {
        "os-17-hidden-suspended-o1": "مش ظاهرة لا تعني Suspended تلقائيًا؛ ممكن شغل خلفية مسموح بقيود في المثال.",
        "os-17-hidden-suspended-o2": "غلط؛ السلايد بيدي أمثلة Background tasks مسموحة زي Audio playback."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
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
      "id": "os-17-service-ui",
      "type": "mcq",
      "placement": "os-17-service",
      "objective": "In the slide’s Android example, what is the role of a service?",
      "prerequisites": [
        "os-17-service"
      ],
      "prompt": "In the slide’s Android example, what is the role of a service?",
      "options": [
        {
          "id": "os-17-service-ui-o1",
          "text": "A UI window for the foreground user"
        },
        {
          "id": "os-17-service-ui-o2",
          "text": "Background work without a user interface"
        },
        {
          "id": "os-17-service-ui-o3",
          "text": "Proof that a fully suspended process continues executing its own code"
        }
      ],
      "correctOptionId": "os-17-service-ui-o2",
      "feedback": {
        "os-17-service-ui-o1": "Service في السلايد لشغل من غير UI؛ دي مش نافذة Foreground.",
        "os-17-service-ui-o2": "صح؛ الفكرة شغل Background بلا UI. تفاصيل الحدود الحديثة مش موضوع السلايد.",
        "os-17-service-ui-o3": "Process المتوقفة بالكامل مش بتنفّذ كودها؛ لازم نفرّق دور الخلفية عن الواجهة وتفاصيل الاستضافة."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
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
      "id": "os-17-current-policy",
      "type": "true-false",
      "placement": "os-17-service",
      "objective": "The 2013 comparison establishes current Android background restrictions.",
      "prerequisites": [
        "os-17-service"
      ],
      "prompt": "The 2013 comparison establishes current Android background restrictions.",
      "options": [
        {
          "id": "os-17-current-policy-o1",
          "text": "True · صح"
        },
        {
          "id": "os-17-current-policy-o2",
          "text": "False · غلط"
        }
      ],
      "correctOptionId": "os-17-current-policy-o2",
      "feedback": {
        "os-17-current-policy-o1": "سلايد ©2013 مش مواصفة Android حالي؛ نستخدمه لفهم الفكرة وحدود المقارنة.",
        "os-17-current-policy-o2": "غلط؛ ده مثال تاريخي. أي سؤال عن سياسة إصدار حالي يحتاج مصدر حديث لذلك الإصدار."
      },
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            17
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
      "id": "os-17-term-foreground",
      "term": "Foreground",
      "translation": "واجهة الاستخدام الحالية",
      "definition": "The process interacting with the user interface in this historical model.",
      "explanation": "التطبيق اللي بتتعامل مع واجهته في المثال.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            17
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-17-term-background",
      "term": "Background",
      "translation": "شغل خارج الواجهة الحالية",
      "definition": "Work or processes not currently displayed as the foreground UI.",
      "explanation": "مش ظاهر، لكن السماح بالتنفيذ يعتمد على سياسة النظام والمهمة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            17
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-17-term-suspended",
      "term": "Suspended",
      "translation": "موقوف مؤقتًا",
      "definition": "Not executing while suspended.",
      "explanation": "التنفيذ واقف؛ ده مش نفس معنى التطبيق مش على الشاشة.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            17
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-17-term-service",
      "term": "Service",
      "translation": "خدمة خلفية",
      "definition": "A component for background tasks without a user interface in the slide’s Android example.",
      "explanation": "نفهم منها فصل شغل الخلفية عن UI؛ مش ضمان مكان التشغيل أو حدود إصدار حالي.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            17
          ]
        }
      ],
      "kind": "source-concept"
    },
    {
      "id": "os-17-term-user-interface",
      "term": "User interface",
      "translation": "واجهة المستخدم",
      "definition": "The part through which a user interacts with an application.",
      "explanation": "الأزرار والمحتوى اللي بتتعامل معاهم، ومش كل شغل التطبيق لازم يبقى ظاهر.",
      "sourceRefs": [
        {
          "sourceId": "current-ch3",
          "slides": [
            17
          ]
        }
      ],
      "kind": "prerequisite"
    }
  ]
};
  if (typeof module === 'object' && module.exports) module.exports = lesson;
  if (typeof window !== 'undefined') window.OSPilotLesson = lesson;
})(typeof window !== 'undefined' ? window : globalThis);
