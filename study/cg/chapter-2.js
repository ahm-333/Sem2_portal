/**
 * Computer Graphics - Chapter 2 Interactive Logic & Question Bank
 * Course: Computer Graphics (CS333 / CG)
 * Topic: Graphics Programming, Primitives & Color Models
 */
(function() {
  'use strict';

  // 1. ALL 48 AUTHORED QUIZ QUESTIONS PRESERVED FROM CHAPTER 2 (P1, P2, P3, P4)
  const QUIZ_QUESTIONS = [
  {
    "id": "c2_p1_mcq1",
    "section": "sec1",
    "type": "MCQ",
    "qEn": "Q1. When treating the graphics system as a \"black box\", which of the following is considered an INPUT to the system?",
    "options": [
      "A. Deflection voltages sent to the CRT tube",
      "B. Phosphor emission on the physical screen",
      "C. Function calls issued by the application program",
      "D. Photons emitted by the monitor display"
    ],
    "correct": 2,
    "ammiya": "الإجابة الصح هي (C)! الصندوق الأسود لنظام الرسوميات بيدخل له 3 مدخلات أساسية: أوامر الدوال من البرنامج (Function calls)، قياسات أجهزة الإدخال (الماوس والكيبورد)، ورسائل نظام التشغيل (OS messages)."
  },
  {
    "id": "c2_p1_mcq2",
    "section": "sec1",
    "type": "MCQ",
    "qEn": "Q2. In the paradigm of graphics APIs, if primitive functions define the \"what\", which functional group defines the \"how\"?",
    "options": [
      "A. Transformation functions",
      "B. Attribute functions",
      "C. Query functions",
      "D. Viewing functions"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B) Attribute functions! دوال الـ Primitives بتحدد \"إيه اللي هيترسم؟\" (What)، أما دوال الـ Attributes بتحدد \"هيترسم إزاي؟\" (How) زي لونه وسمكه ونمطه."
  },
  {
    "id": "c2_p1_mcq3",
    "section": "sec1",
    "type": "MCQ",
    "qEn": "Q3. Which group of graphics functions is responsible for scaling, rotating, and translating objects in space?",
    "options": [
      "A. Primitive functions",
      "B. Control functions",
      "C. Transformation functions",
      "D. Query functions"
    ],
    "correct": 2,
    "ammiya": "الإجابة الصح هي (C) Transformation functions! دوال التحويلات الهندسية هي المسؤولة عن الـ 3 عمليات دول: التدوير (Rotation)، النقل أو الإزاحة (Translation)، والتكبير أو التصغير (Scaling)."
  },
  {
    "id": "c2_p1_mcq4",
    "section": "sec1",
    "type": "MCQ",
    "qEn": "Q4. An application needs to inspect the current position of the virtual camera and read color values directly from the frame buffer. Which functional group provides this capability?",
    "options": [
      "A. Query functions",
      "B. Control functions",
      "C. Input functions",
      "D. Attribute functions"
    ],
    "correct": 0,
    "ammiya": "الإجابة الصح هي (A) Query functions (دوال الاستعلام)! لما البرنامج يحب يسأل الـ API عن معلومة داخلية زي مكان الكاميرا الحالي أو يقرأ قيم البكسلات من الـ Frame buffer بيستخدم دوال الـ Query."
  },
  {
    "id": "c2_p1_mcq5",
    "section": "sec1",
    "type": "MCQ",
    "qEn": "Q5. Communicating with the window system, initializing graphics contexts, and managing runtime errors are handled by:",
    "options": [
      "A. Viewing functions",
      "B. Attribute functions",
      "C. Control functions",
      "D. Primitive functions"
    ],
    "correct": 2,
    "ammiya": "الإجابة الصح هي (C) Control functions! دوال التحكم هي اللي بتتعامل مع نظام النوافذ (Window system)، وبتعمل تهيئة للبرنامج (Initialization)، وبتعالج الأخطاء (Error handling)."
  },
  {
    "id": "c2_p1_mcq6",
    "section": "sec1",
    "type": "MCQ",
    "qEn": "Q6. Which of the following is classified as a low-level atomic entity (Primitive) in standard graphics systems?",
    "options": [
      "A. Fill pattern",
      "B. Line segment",
      "C. Typeface style",
      "D. Camera field of view"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B) Line segment (القطعة المستقيمة)! لأنها كيان هندسي أساسي (Primitive)، بينما الـ Fill pattern والـ Typeface style دول خصائص (Attributes)، والـ Field of view تبع الـ Viewing."
  },
  {
    "id": "c2_p1_tf1",
    "section": "sec1",
    "type": "TF",
    "qEn": "Q1 (T/F). In a graphics system, messages originating from the operating system are treated as system outputs.",
    "options": [
      "True",
      "False"
    ],
    "correct": 1,
    "ammiya": "غلط طبعاً (False)! رسائل نظام التشغيل (OS messages) بتعتبر من المدخلات (Inputs) اللي بتدخل للصندوق الأسود، مش المخرجات."
  },
  {
    "id": "c2_p1_tf2",
    "section": "sec1",
    "type": "TF",
    "qEn": "Q2 (T/F). Transformation functions allow users to modify camera parameters, but cannot rotate or translate geometric primitives.",
    "options": [
      "True",
      "False"
    ],
    "correct": 1,
    "ammiya": "غلط (False)! وظيفة دوال التحويلات (Transformation functions) أصلاً هي عمل التدوير (Rotation) والنقل (Translation) والتحجيم (Scaling) للكيانات الهندسية."
  },
  {
    "id": "c2_p1_tf3",
    "section": "sec1",
    "type": "TF",
    "qEn": "Q3 (T/F). Minimal graphics APIs typically support primitives such as lines, polygons, and text because they can be generated rapidly in hardware.",
    "options": [
      "True",
      "False"
    ],
    "correct": 0,
    "ammiya": "صح 100% (True)! أبسط أنظمة الجرافيكس بتدعم الخطوط والمضلعات والنصوص لأن الهاردوير بيقدر يرسمهم بسرعة فائقة."
  },
  {
    "id": "c2_p1_tf4",
    "section": "sec1",
    "type": "TF",
    "qEn": "Q4 (T/F). Attribute functions specify the low-level geometric coordinates that define an object's boundary in the problem domain.",
    "options": [
      "True",
      "False"
    ],
    "correct": 1,
    "ammiya": "غلط (False)! اللي بيحدد الإحداثيات الهندسية والحدود هي دوال الكيانات (Primitive functions)، أما الـ Attribute functions بتحدد اللون والنمط والمظهر بس."
  },
  {
    "id": "c2_p1_tf5",
    "section": "sec1",
    "type": "TF",
    "qEn": "Q5 (T/F). Operating in a multiprocessing, multi-window environment requires control functions to maintain program execution and window integrity.",
    "options": [
      "True",
      "False"
    ],
    "correct": 0,
    "ammiya": "صح جداً (True)! في بيئة النوافذ المتعددة تعدد المهام بنحتاج دوال التحكم (Control functions) عشان تدير النوافذ والتهيئة والأخطاء."
  },
  {
    "id": "c2_p2_mcq1",
    "section": "sec2",
    "type": "MCQ",
    "qEn": "Q1. Geometric primitives in a graphics system are formally specified in the:",
    "options": [
      "A. Frame buffer address space",
      "B. Problem domain",
      "C. Deflection voltage domain",
      "D. Operating system kernel registry"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B) Problem domain! الكيانات الهندسية (Geometric primitives) بتتعرف بإحداثيات رياضية في فضاء المسألة (Problem domain)، عكس الكيانات النقطية (Raster primitives) اللي في فضاء الذاكرة."
  },
  {
    "id": "c2_p2_mcq2",
    "section": "sec2",
    "type": "MCQ",
    "qEn": "Q2. Why do polygons play a critically favored role in modern computer graphics hardware?",
    "options": [
      "A. They do not consume memory in the frame buffer",
      "B. They can be rendered rapidly and used to approximate arbitrary surfaces",
      "C. They are strictly 1-bit monochrome primitives",
      "D. They cannot be broken down into simpler geometric components"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B)! المضلعات ليها دور خاص جداً لأن الهاردوير بيعرضها بسرعة فائقة، وبنقدر نستخدمها لتقريب أي سطح منحني في الـ 3D."
  },
  {
    "id": "c2_p2_mcq3",
    "section": "sec2",
    "type": "MCQ",
    "qEn": "Q3. A polygon whose boundary edges cross and intersect each other is formally classified as a:",
    "options": [
      "A. Convex polygon",
      "B. Simple polygon",
      "C. Non-simple polygon",
      "D. Planar triangle"
    ],
    "correct": 2,
    "ammiya": "الإجابة الصح هي (C) Non-simple polygon! لما أضلاع المضلع تتقاطع مع بعضها ذاتياً بنسميه مضلع غير بسيط (Non-simple polygon)."
  },
  {
    "id": "c2_p2_mcq4",
    "section": "sec2",
    "type": "MCQ",
    "qEn": "Q4. Which of the following correctly lists the three structural reasons why triangles are exceptionally easy to render?",
    "options": [
      "A. Concave, multi-planar, and symmetric",
      "B. Simple, flat (planar), and convex",
      "C. Non-simple, curved, and discrete",
      "D. Linear, orthogonal, and infinite"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B) Simple, flat (planar), and convex! التلات صفات دول احفظهم صم: المثلث دايماً بسيط (Simple)، مسطح في مستوى واحد (Flat)، ومحدب (Convex)، وعشان كده سهل وسريع جداً في الرندر."
  },
  {
    "id": "c2_p2_mcq5",
    "section": "sec2",
    "type": "MCQ",
    "qEn": "Q5. What is the DEFAULT mode for rendering and displaying triangles in graphics pipelines?",
    "options": [
      "A. Displaying the three vertices as isolated points",
      "B. Displaying the boundary edges only (wireframe)",
      "C. Displaying the triangle with its interior filled",
      "D. Displaying the triangle as an unfilled bounding box"
    ],
    "correct": 2,
    "ammiya": "الإجابة الصح هي (C) Displaying the triangle with its interior filled! الوضع الافتراضي (Default) لعرض المثلث في الجرافيكس هو ملء مساحته الداخلية."
  },
  {
    "id": "c2_p2_mcq6",
    "section": "sec2",
    "type": "MCQ",
    "qEn": "Q6. The strategy of taking a list of vertices and generating a consistent set of triangles covering the defined polygon is known as:",
    "options": [
      "A. Rasterization",
      "B. Triangulation",
      "C. Deflection",
      "D. Quantization"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B) Triangulation (التثليث)! هي عملية تقسيم أي مضلع معقد لمجموعة متناسقة من المثلثات."
  },
  {
    "id": "c2_p2_mcq7",
    "section": "sec2",
    "type": "MCQ",
    "qEn": "Q7. In computer graphics displays, an individual geometric point is physically rendered as:",
    "options": [
      "A. A continuous analog sine wave",
      "B. A single pixel or a small cluster of pixels",
      "C. An infinite line segment",
      "D. A 24-bit vector font"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B)! النقطة الهندسية بتتعرض على الشاشة إما كبكسل واحد مفرد (Single pixel) أو مجموعة صغيرة من البكسلات المتجاورة."
  },
  {
    "id": "c2_p2_tf1",
    "section": "sec2",
    "type": "TF",
    "qEn": "Q1 (T/F). Geometric primitives and raster primitives are identical concepts and defined in the same domain.",
    "options": [
      "True",
      "False"
    ],
    "correct": 1,
    "ammiya": "غلط (False)! الـ Geometric primitives متعرفة في فضاء المسألة الرياضي (Problem domain)، بينما الـ Raster primitives متعرفة كبكسلات منفصلة في ذاكرة الشاشة."
  },
  {
    "id": "c2_p2_tf2",
    "section": "sec2",
    "type": "TF",
    "qEn": "Q2 (T/F). A polygon can be rendered by displaying only its boundary edges without filling its interior.",
    "options": [
      "True",
      "False"
    ],
    "correct": 0,
    "ammiya": "صح 100% (True)! نقدر نرسم المضلع كحواف خارجية بس (Edges only / Wireframe) أو نملأ قلبه أو الاتنين مع بعض."
  },
  {
    "id": "c2_p2_tf3",
    "section": "sec2",
    "type": "TF",
    "qEn": "Q3 (T/F). Three arbitrary vertices in three-dimensional space can sometimes form a non-planar (bent) triangle.",
    "options": [
      "True",
      "False"
    ],
    "correct": 1,
    "ammiya": "غلط طبعاً (False)! أي 3 نقط في الفراغ بيحددوا مستوى واحد بس، يعني المثلث مستحيل يكون متني أو غير مسطح؛ هو دايماً Flat / Planar."
  },
  {
    "id": "c2_p2_tf4",
    "section": "sec2",
    "type": "TF",
    "qEn": "Q4 (T/F). Curved 3D objects such as spheres can be represented in graphics hardware by approximating them with meshes of triangles or quadrilaterals.",
    "options": [
      "True",
      "False"
    ],
    "correct": 0,
    "ammiya": "صح جداً (True)! الكرة والأسطح المنحنية بنقربها في الجرافيكس بشبكة من المثلثات (Triangles) أو الأشكال الرباعية (Quadrilaterals)."
  },
  {
    "id": "c2_p2_tf5",
    "section": "sec2",
    "type": "TF",
    "qEn": "Q5 (T/F). A non-simple polygon is easier for hardware to rasterize and fill than a triangle.",
    "options": [
      "True",
      "False"
    ],
    "correct": 1,
    "ammiya": "غلط (False)! المضلع غير البسيط أضلاعه متقاطعة فبيكون معقد في التلوين، إنما المثلث هو الأسهل والأسرع على الإطلاق."
  },
  {
    "id": "c2_p3_mcq1",
    "section": "sec3",
    "type": "MCQ",
    "qEn": "Q1. Which form of text representation is constructed from vertices, line segments, and curves, behaving essentially like other geometric objects?",
    "options": [
      "A. Raster text",
      "B. Bit block text",
      "C. Stroke text",
      "D. Phosphor text"
    ],
    "correct": 2,
    "ammiya": "الإجابة الصح هي (C) Stroke text! النص المتجه (Stroke text) بيتبني ككائن هندسي من رؤوس (Vertices) وخطوط ومنحنيات، فيقبل التكبير والتدوير من غير أي تشوه."
  },
  {
    "id": "c2_p3_mcq2",
    "section": "sec3",
    "type": "MCQ",
    "qEn": "Q2. Characters defined as rectangular grids of binary bits (0s and 1s) are known as:",
    "options": [
      "A. Stroke typefaces",
      "B. Bit blocks",
      "C. Continuous splines",
      "D. Triangulated surfaces"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B) Bit blocks! في الـ Raster text، كل حرف بيتعرف كمستطيل من البتات (0 و 1) اسمه Bit block."
  },
  {
    "id": "c2_p3_mcq3",
    "section": "sec3",
    "type": "MCQ",
    "qEn": "Q3. What low-level memory operation allows raster characters to be placed into the frame buffer with extreme speed?",
    "options": [
      "A. Recursive triangulation",
      "B. Bit-block-transfer (BitBlt)",
      "C. Deflection plate conversion",
      "D. Digital-to-analog scaling"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B) Bit-block-transfer (BitBlt)! دي العملية السريعة جداً اللي بتنقل مستطيل البتات بتاع الحرف النقطي وتحطه في الـ Frame buffer فوراً."
  },
  {
    "id": "c2_p3_mcq4",
    "section": "sec3",
    "type": "MCQ",
    "qEn": "Q4. What is a primary disadvantage of using raster text compared to stroke text?",
    "options": [
      "A. It cannot be displayed on computer monitors",
      "B. It requires intensive trigonometric calculations to render",
      "C. It loses visual quality and exhibits pixelation when scaled or rotated",
      "D. It cannot be copied into the frame buffer"
    ],
    "correct": 2,
    "ammiya": "الإجابة الصح هي (C)! عيب الـ Raster text الأساسي إنك لما تكبره أو تدوره جودته بتبوظ وبتظهر فيه تعرجات وبكسلة واضحة (Pixelation)."
  },
  {
    "id": "c2_p3_mcq5",
    "section": "sec3",
    "type": "MCQ",
    "qEn": "Q5. Approximating a 3D curved surface (such as a sphere) using a polygonal mesh is typically performed using:",
    "options": [
      "A. Triangles or quadrilaterals",
      "B. Single isolated pixels only",
      "C. Unfilled raster bit blocks",
      "D. CRT deflection coils"
    ],
    "correct": 0,
    "ammiya": "الإجابة الصح هي (A) Triangles or quadrilaterals! بنقرب الأسطح المنحنية كالكرة باستخدام المثلثات أو الأشكال الرباعية."
  },
  {
    "id": "c2_p3_mcq6",
    "section": "sec3",
    "type": "MCQ",
    "qEn": "Q6. Which of the following is classified as an ATTRIBUTE of a polygon primitive?",
    "options": [
      "A. The X, Y, Z spatial coordinates of its vertices",
      "B. The fill pattern or solid color used inside its boundary",
      "C. The query function retrieving camera orientation",
      "D. The mouse click event registering user input"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B)! لون التعبئة (Solid color) أو النقشة الداخلية (Fill pattern) هي من خصائص المضلع (Attributes)."
  },
  {
    "id": "c2_p3_mcq7",
    "section": "sec3",
    "type": "MCQ",
    "qEn": "Q7. PostScript fonts are a prominent industrial example of:",
    "options": [
      "A. Monochrome 1-bit raster text",
      "B. Stroke text",
      "C. Unscalable hardware text",
      "D. Simple convex polygons only"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B) Stroke text! خطوط PostScript هي أشهر مثال في السلايد على الـ Stroke text."
  },
  {
    "id": "c2_p3_tf1",
    "section": "sec3",
    "type": "TF",
    "qEn": "Q1 (T/F). Raster text is computationally more complex and slower to render than stroke text.",
    "options": [
      "True",
      "False"
    ],
    "correct": 1,
    "ammiya": "غلط (False)! العكس تماماً: الـ Raster text بسيط وسريع جداً (Simple and fast) لأنه مجرد نقل بتات للذاكرة، بينما الـ Stroke text أبطأ لأنه بيحتاج حسابات هندسية."
  },
  {
    "id": "c2_p3_tf2",
    "section": "sec3",
    "type": "TF",
    "qEn": "Q2 (T/F). If a stroke text character has a closed boundary, its interior can be filled with color.",
    "options": [
      "True",
      "False"
    ],
    "correct": 0,
    "ammiya": "صح 100% (True)! طالما الحرف في الـ Stroke text مرسوم بحدود هندسية مغلقة، نقدر نملأ المساحة اللي جواه باللون عادي زي المضلعات."
  },
  {
    "id": "c2_p3_tf3",
    "section": "sec3",
    "type": "TF",
    "qEn": "Q3 (T/F). Available attributes in a graphics API are identical for all graphical primitives regardless of whether the object is a line, a polygon, or text.",
    "options": [
      "True",
      "False"
    ],
    "correct": 1,
    "ammiya": "غلط (False)! الخصائص (Attributes) بتختلف حسب نوع الكيان؛ فالخط له نمط وسُمك، بينما المضلع له تعبئة داخلية ونقشة (Pattern)."
  },
  {
    "id": "c2_p3_tf4",
    "section": "sec3",
    "type": "TF",
    "qEn": "Q4 (T/F). One approach to creating curved objects in computer graphics is starting with their mathematical definitions and writing graphics functions to evaluate them.",
    "options": [
      "True",
      "False"
    ],
    "correct": 0,
    "ammiya": "صح جداً (True)! ده النهج التاني في السلايد لتمثيل المنحنيات بجانب نهج التقريب بالمضلعات."
  },
  {
    "id": "c2_p3_tf5",
    "section": "sec3",
    "type": "TF",
    "qEn": "Q5 (T/F). Fonts such as Times, Helvetica, and Computer Modern are families of typefaces of a particular style.",
    "options": [
      "True",
      "False"
    ],
    "correct": 0,
    "ammiya": "صح 100% (True)! ده تعريف الـ Fonts والأمثلة التلاتة المذكورة بالنص في السلايد."
  },
  {
    "id": "c2_p4_mcq1",
    "section": "sec4",
    "type": "MCQ",
    "qEn": "Q1. The human visual system's visible light spectrum spans approximately which wavelength range?",
    "options": [
      "A. 10 nm to 200 nm",
      "B. 350 nm to 780 nm",
      "C. 800 nm to 1200 nm",
      "D. 2 μm to 10 μm"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B) من 350 إلى 780 نانوميتر (nm)! ده مدى الطيف المرئي اللي عين الإنسان بتشوفه."
  },
  {
    "id": "c2_p4_mcq2",
    "section": "sec4",
    "type": "MCQ",
    "qEn": "Q2. Why does a computer display require only three primary colors to generate full-color sensations for human viewers?",
    "options": [
      "A. Because natural photons only exist in three discrete wavelengths",
      "B. Because computer memory buses are restricted to three bytes per word",
      "C. Because the human visual system possesses three types of cones",
      "D. Because graphics processors cannot calculate more than three equations simultaneously"
    ],
    "correct": 2,
    "ammiya": "الإجابة الصح هي (C)! لأن شبكية عين الإنسان فيها 3 أنواع بس من الخلايا المخروطية الحساسة للألوان (3 types of cones)، فيكفي 3 ألوان أولية (RGB) لإنتاج التنبيه الثلاثي للعين."
  },
  {
    "id": "c2_p4_mcq3",
    "section": "sec4",
    "type": "MCQ",
    "qEn": "Q3. In which type of color system do the primary colors add together to produce perceived colors, with cathode-ray tubes (CRTs) being a classic example?",
    "options": [
      "A. Subtractive color system",
      "B. Additive color system",
      "C. Complementary CMY ink system",
      "D. Monochromatic bitmap system"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B) Additive color system (النظام اللوني الجمعي)! في شاشات الـ CRT والشاشات الضوئية، الألوان الأولية (RGB) بتتجمع مع بعضها عشان تطلع اللون."
  },
  {
    "id": "c2_p4_mcq4",
    "section": "sec4",
    "type": "MCQ",
    "qEn": "Q4. The subtractive primary colors typically utilized in ink and printing systems are:",
    "options": [
      "A. Red, Green, Blue",
      "B. Cyan, Magenta, Yellow",
      "C. Orange, Purple, Green",
      "D. Black, White, Gray"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B) Cyan, Magenta, Yellow (CMY)! دي الألوان الأساسية للنظام الطرحي (Subtractive) المستخدم في الطباعة والأحبار، وهي الألوان المكملة للـ RGB."
  },
  {
    "id": "c2_p4_mcq5",
    "section": "sec4",
    "type": "MCQ",
    "qEn": "Q5. A three-dimensional representation of a color model, acting as the 3D analogue of a 2D color wheel, is called a:",
    "options": [
      "A. Color vector",
      "B. Color solid",
      "C. Bit block",
      "D. Deflection cube"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B) Color solid (مجسم الألوان)! هو التمثيل ثلاثي الأبعاد لنموذج الألوان واللي بيعادل عجلة الألوان (Color wheel) ثنائية الأبعاد."
  },
  {
    "id": "c2_p4_mcq6",
    "section": "sec4",
    "type": "MCQ",
    "qEn": "Q6. In a 24-bit RGB graphics system, each pixel consists of 3 bytes. How many possible colors can each pixel display?",
    "options": [
      "A. 256 colors",
      "B. 65,536 colors",
      "C. 16,777,216 colors",
      "D. 4,294,967,296 colors"
    ],
    "correct": 2,
    "ammiya": "الإجابة الصح هي (C) 16,777,216 لون! لأن 3 بايت = 24 بت، وعدد الألوان بيساوي 2^24 = 16,777,216 (أو 16M لون)."
  },
  {
    "id": "c2_p4_mcq7",
    "section": "sec4",
    "type": "MCQ",
    "qEn": "Q7. In computer graphics color calculations, what does the suffix \"M\" denote when referring to \"16M colors\"?",
    "options": [
      "A. 10^6 (1,000,000)",
      "B. 2^20 (1,048,576)",
      "C. 2^10 (1,024)",
      "D. 16^2 (256)"
    ],
    "correct": 1,
    "ammiya": "الإجابة الصح هي (B) 2^20! ركز في دي عشان بتيجي في الامتحان: حرف M في حسابات الذاكرة والألوان معناه 2 أس 20، عشان كده 16M = 2^4 × 2^20 = 2^24."
  },
  {
    "id": "c2_p4_mcq8",
    "section": "sec4",
    "type": "MCQ",
    "qEn": "Q8. An opacity value of A = 1.0 designates an object that is:",
    "options": [
      "A. Fully transparent, transmitting all incident light",
      "B. Half-reflective, transmitting 50% of incident light",
      "C. Fully opaque, passing no light through it",
      "D. Invisible to the viewer"
    ],
    "correct": 2,
    "ammiya": "الإجابة الصح هي (C) Fully opaque (معتم بالكامل)! لما معامل التعتيم A = 1.0 يبقى الجسم معتم تماماً ومبيعديش أي ضوء، ولما A = 0.0 بيبقى شفاف تماماً."
  },
  {
    "id": "c2_p4_tf1",
    "section": "sec4",
    "type": "TF",
    "qEn": "Q1 (T/F). An additive RGB color system has a dual relationship with a subtractive CMY color system.",
    "options": [
      "True",
      "False"
    ],
    "correct": 0,
    "ammiya": "صح 100% (True)! نظام الـ RGB الجمعي له علاقة ثنائية متتامة (Dual) مع نظام الـ CMY الطرحي."
  },
  {
    "id": "c2_p4_tf2",
    "section": "sec4",
    "type": "TF",
    "qEn": "Q2 (T/F). In a 24-bit RGB system, each primary color (Red, Green, Blue) is allocated 2 bytes of memory.",
    "options": [
      "True",
      "False"
    ],
    "correct": 1,
    "ammiya": "غلط (False)! في نظام الـ 24-bit، البكسل كله 3 بايت، يعني كل لون من الـ 3 ألوان (R, G, B) بياخد 1 بايت بس (8 بت) مش 2 بايت."
  },
  {
    "id": "c2_p4_tf3",
    "section": "sec4",
    "type": "TF",
    "qEn": "Q3 (T/F). An opaque object passes all incident light through it.",
    "options": [
      "True",
      "False"
    ],
    "correct": 1,
    "ammiya": "غلط طبعاً (False)! الجسم المعتم (Opaque) مبيعديش أي ضوء خالص (Passes no light)؛ الجسم الشفاف (Transparent) هو اللي بيعدي كل الضوء."
  },
  {
    "id": "c2_p4_tf4",
    "section": "sec4",
    "type": "TF",
    "qEn": "Q4 (T/F). The value of the light distribution function C(λ) at a specific wavelength λ specifies the spatial width of the pixel.",
    "options": [
      "True",
      "False"
    ],
    "correct": 1,
    "ammiya": "غلط (False)! قيمة الدالة C(λ) عند طول موجي معين بتحدد شدة الإشعاع (Intensity) للطول الموجي ده في اللون، ملهاش علاقة بعرض البكسل."
  },
  {
    "id": "c2_p4_tf5",
    "section": "sec4",
    "type": "TF",
    "qEn": "Q5 (T/F). Opacity and transparency are physical and mathematical complements of each other.",
    "options": [
      "True",
      "False"
    ],
    "correct": 0,
    "ammiya": "صح جداً (True)! الشفافية والتعتيم مكملين وعكس بعض تماماً."
  }
];
  window.QUIZ_QUESTIONS = QUIZ_QUESTIONS;

  const STORAGE_KEY = 'sem2_cg_chapter2_answers_v1';
  let userAnswers = {};

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      userAnswers = JSON.parse(saved);
    }
  } catch (e) {
    userAnswers = {};
  }

  function saveAnswers() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userAnswers));
    } catch (e) {
      // Ignore quota errors
    }
  }

  // 2. FONT SCALE
  let currentFontScale = 1.0;
  function updateFontScale(delta) {
    currentFontScale = Math.max(0.85, Math.min(1.35, currentFontScale + delta));
    document.documentElement.style.setProperty('--font-scale', currentFontScale.toFixed(2));
    const label = document.getElementById('fontSizeLabel') || document.getElementById('fontScaleDisplay');
    if (label) {
      label.textContent = Math.round(currentFontScale * 100) + '%';
    }
  }

  // 3. SECTION SWITCHING
  function switchSection(targetId) {
    const sections = ['sec1', 'sec2', 'sec3', 'sec4', 'sec5'];
    sections.forEach(function(id) {
      const el = document.getElementById(id);
      if (el) {
        if (id === targetId) {
          el.classList.remove('hidden');
          el.removeAttribute('hidden');
        } else {
          el.classList.add('hidden');
          el.setAttribute('hidden', 'true');
        }
      }
    });

    const tabBtns = document.querySelectorAll('.tab-btn, [data-target]');
    tabBtns.forEach(function(btn) {
      const t = btn.getAttribute('data-target');
      if (t === targetId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 4. QUIZ RENDERING
  function renderQuizCard(q, containerPrefix) {
    const answered = userAnswers[q.id];
    const hasAnswered = answered !== undefined;
    const isCorrect = hasAnswered && answered === q.correct;

    const optionsHtml = q.options.map(function(opt, idx) {
      let btnClass = 'quiz-option-btn';
      let icon = '<span class="opt-bullet">⚪</span>';

      if (hasAnswered) {
        if (idx === q.correct) {
          btnClass += ' opt-correct';
          icon = '<span class="opt-bullet" aria-hidden="true">✅</span>';
        } else if (idx === answered) {
          btnClass += ' opt-incorrect';
          icon = '<span class="opt-bullet" aria-hidden="true">❌</span>';
        } else {
          btnClass += ' opt-disabled';
        }
      }

      return '<button type="button" class="' + btnClass + '" data-qid="' + q.id + '" data-idx="' + idx + '" data-prefix="' + containerPrefix + '">' +
        icon +
        '<span class="opt-text">' + opt + '</span>' +
      '</button>';
    }).join('');

    let explanationHtml = '';
    if (hasAnswered) {
      const statusBanner = isCorrect ?
        '<div class="exp-status status-correct">🎉 إجابة صحيحة ممتازة!</div>' :
        '<div class="exp-status status-incorrect">❌ إجابة غير صحيحة — راجع التفسير العلمي أدناه:</div>';

      explanationHtml = '<div class="quiz-explanation" role="region" aria-label="شرح الإجابة">' +
        statusBanner +
        '<p class="exp-ammiya">' + q.ammiya + '</p>' +
      '</div>';
    }

    const typeBadge = q.type === 'MCQ' ? 'MCQ • اختيار من متعدد' : 'T/F • صح أو خطأ';

    return '<article class="quiz-card" id="' + containerPrefix + '-' + q.id + '">' +
      '<div class="quiz-card-header">' +
        '<span class="quiz-type-badge">' + typeBadge + '</span>' +
        (hasAnswered ? (isCorrect ? '<span class="badge-success">صحيحة +1</span>' : '<span class="badge-error">خاطئة</span>') : '') +
      '</div>' +
      '<p class="quiz-question-prompt en-block" dir="ltr">' + q.qEn + '</p>' +
      '<div class="quiz-options-group" role="group" aria-label="خيارات السؤال">' +
        optionsHtml +
      '</div>' +
      explanationHtml +
    '</article>';
  }

  function renderAllQuizzes() {
    ['sec1', 'sec2', 'sec3', 'sec4'].forEach(function(secId) {
      const container = document.getElementById('quiz-' + secId);
      if (container) {
        const qs = QUIZ_QUESTIONS.filter(function(q) { return q.section === secId; });
        container.innerHTML = qs.map(function(q) { return renderQuizCard(q, secId); }).join('');
      }
    });

    const allContainer = document.getElementById('quiz-all');
    if (allContainer) {
      allContainer.innerHTML = QUIZ_QUESTIONS.map(function(q) { return renderQuizCard(q, 'all'); }).join('');
    }

    // Update global score & progress
    const total = QUIZ_QUESTIONS.length;
    const correctCount = QUIZ_QUESTIONS.filter(function(q) { return userAnswers[q.id] === q.correct; }).length;
    const answeredCount = Object.keys(userAnswers).length;

    const scoreBadge = document.getElementById('scoreBadge');
    if (scoreBadge) {
      scoreBadge.textContent = correctCount + ' / ' + total;
    }

    const progressPercent = total > 0 ? Math.round((answeredCount / total) * 100) : 0;
    const prog = document.getElementById('globalQuizProgress');
    if (prog) {
      prog.style.width = progressPercent + '%';
      prog.setAttribute('aria-valuenow', progressPercent);
    }
  }

  function handleOptionClick(event) {
    const btn = event.target.closest('.quiz-option-btn');
    if (!btn) return;
    const qid = btn.getAttribute('data-qid');
    const idx = parseInt(btn.getAttribute('data-idx'), 10);
    if (!qid || isNaN(idx)) return;

    userAnswers[qid] = idx;
    saveAnswers();
    renderAllQuizzes();
  }

  // 5. EVENT LISTENERS & INITIALIZATION
  document.addEventListener('DOMContentLoaded', function() {
    // Section tabs
    document.querySelectorAll('.tab-btn, [data-target]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const target = btn.getAttribute('data-target');
        if (target) switchSection(target);
      });
    });

    // Delegated click for quiz options
    document.addEventListener('click', handleOptionClick);

    // Reset button
    const btnReset = document.getElementById('btnResetAllQuizzes');
    if (btnReset) {
      btnReset.addEventListener('click', function() {
        userAnswers = {};
        saveAnswers();
        renderAllQuizzes();
      });
    }

    // Font scaling
    const btnFontDec = document.getElementById('btnFontDec');
    const btnFontInc = document.getElementById('btnFontInc');
    if (btnFontDec) btnFontDec.addEventListener('click', function() { updateFontScale(-0.05); });
    if (btnFontInc) btnFontInc.addEventListener('click', function() { updateFontScale(0.05); });

    // Reading progress bar
    window.addEventListener('scroll', function() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      const bar = document.getElementById('readingProgressBar');
      if (bar) bar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
    });

    // Theme buttons (light/dark/reading)
    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.classList.remove('theme-white', 'theme-dark', 'theme-sepia', 'theme-light', 'theme-reading');
      if (theme === 'dark') {
        document.body.classList.add('theme-dark');
      } else if (theme === 'reading') {
        document.body.classList.add('theme-sepia', 'theme-reading');
      } else {
        document.body.classList.add('theme-white', 'theme-light');
      }
      try {
        if (window.PortalTheme && typeof window.PortalTheme.setTheme === 'function') {
          window.PortalTheme.setTheme(theme);
        }
      } catch (e) {}
    }

    const btnLight = document.getElementById('btnThemeWhite') || document.getElementById('btnLightMode');
    const btnDark = document.getElementById('btnThemeDark') || document.getElementById('btnDarkMode');
    const btnReading = document.getElementById('btnThemeSepia') || document.getElementById('btnReadingMode');

    if (btnLight) btnLight.addEventListener('click', function() { applyTheme('light'); });
    if (btnDark) btnDark.addEventListener('click', function() { applyTheme('dark'); });
    if (btnReading) btnReading.addEventListener('click', function() { applyTheme('reading'); });

    // Initial render
    renderAllQuizzes();
  });
})();
