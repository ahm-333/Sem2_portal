/**
 * Database Lessons Unification Map (js/shared/db-lesson-map.js)
 * Establishes identities, relationships, and many-to-many mappings between
 * standalone topic blocks and slide explanations for Database Systems (Chapters 1 & 2 / Lectures 2 & 3).
 *
 * Owned by Issue #28 under Epic #27.
 * Pure identities and relationships only; contains no duplicated authored prose.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.DBLessonMap = factory().DBLessonMap;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // Normalize various aliases for lecture keys
  function normalizeLectureKey(key) {
    if (!key) return null;
    const str = String(key).trim().toLowerCase();
    if (str === '2' || str === 'db-lec2' || str === 'chapter-1' || str === 'chapter1' || str.endsWith('/chapter-1.html') || str.includes('lecture=2') || str === 'database-systems/2') {
      return '2';
    }
    if (str === '3' || str === 'db-lec3' || str === 'chapter-2' || str === 'chapter2' || str.endsWith('/chapter-2.html') || str.includes('lecture=3') || str === 'database-systems/3') {
      return '3';
    }
    return null;
  }

  // Canonical lecture metadata
  const LECTURES = {
    '2': {
      courseId: 'database-systems',
      lectureId: '2',
      chapterNumber: 1,
      canonicalKey: JSON.stringify(['database-systems', 'lecture', '2']),
      title: 'Lecture 2: Databases and Database Users',
      arabicTitle: 'قواعد البيانات، مستخدمي النظم، وأساسيات معمارية DBMS (د. محمد ماهر)',
      standaloneUrl: 'study/db/chapter-1.html',
      slidesCount: 30,
      blocksCount: 7,
      standaloneQuestionsCount: 34,
      fullQuizQuestionsCount: 20,
      slideQuestionsCount: 30
    },
    '3': {
      courseId: 'database-systems',
      lectureId: '3',
      chapterNumber: 2,
      canonicalKey: JSON.stringify(['database-systems', 'lecture', '3']),
      title: 'Lecture 3 Ch 2: Database System Concepts and Architecture',
      arabicTitle: 'معمارية ومفاهيم نظم قواعد البيانات، النماذج، والـ Client/Server (د. محمد ماهر)',
      standaloneUrl: 'study/db/chapter-2.html',
      slidesCount: 32,
      blocksCount: 6,
      standaloneQuestionsCount: 20,
      fullQuizQuestionsCount: 30,
      slideQuestionsCount: 32
    }
  };

  // Topic blocks definitions
  const TOPIC_BLOCKS = {
    '2': [
      {
        id: 'block-1',
        lectureKey: '2',
        originalOrder: 1,
        title: 'المفاهيم الأساسية: البيانات (Data)، العالم المصغر (Mini-World)، وقاعدة البيانات (Database)',
        sourceLocator: 'study/db/chapter-1.html#block-1',
        accessPath: 'chapter-1:block-1',
        slides: [5, 6, 7]
      },
      {
        id: 'block-2',
        lectureKey: '2',
        originalOrder: 2,
        title: 'نظام الـ DBMS، وظائفه الأربعة، بيئته الكاملة، والـ Meta-data & Catalog',
        sourceLocator: 'study/db/chapter-1.html#block-2',
        accessPath: 'chapter-1:block-2',
        slides: [5, 6, 8, 9, 10, 15]
      },
      {
        id: 'block-3',
        lectureKey: '2',
        originalOrder: 3,
        title: 'أنواع قواعد البيانات وتطبيقاتها التقليدية والحديثة + محركات البحث والـ Cloud',
        sourceLocator: 'study/db/chapter-1.html#block-3',
        accessPath: 'chapter-1:block-3',
        slides: [3, 4]
      },
      {
        id: 'block-4',
        lectureKey: '2',
        originalOrder: 4,
        title: 'الخصائص الجوهرية الأربعة لمدخل قواعد البيانات مقابل نظام الملفات القديم',
        sourceLocator: 'study/db/chapter-1.html#block-4',
        accessPath: 'chapter-1:block-4',
        slides: [14, 16, 17, 18]
      },
      {
        id: 'block-5',
        lectureKey: '2',
        originalOrder: 5,
        title: 'مستخدمو قواعد البيانات: أبطال على المسرح (On the Scene) وأبطال خلف الكواليس (Behind the Scene)',
        sourceLocator: 'study/db/chapter-1.html#block-5',
        accessPath: 'chapter-1:block-5',
        slides: [19, 20, 21, 22, 23, 24]
      },
      {
        id: 'block-6',
        lectureKey: '2',
        originalOrder: 6,
        title: 'مميزات الـ DBMS التسعة، الفوائد الإدارية، ومتى نتجنب استخدامه؟',
        sourceLocator: 'study/db/chapter-1.html#block-6',
        accessPath: 'chapter-1:block-6',
        slides: [25, 26, 27, 28, 29]
      },
      {
        id: 'block-add',
        lectureKey: '2',
        originalOrder: 7,
        title: 'النقاط الخمس الذهبية الإضافية + رسمة قاعدة بيانات الجامعة (UNIVERSITY Database)',
        sourceLocator: 'study/db/chapter-1.html#block-add',
        accessPath: 'chapter-1:block-add',
        slides: [11, 12, 13, 23, 24, 25, 29]
      }
    ],
    '3': [
      {
        id: 'block-1',
        lectureKey: '3',
        originalOrder: 1,
        title: '1. تجريد البيانات ونماذج البيانات (Data Abstraction & Data Models)',
        sourceLocator: 'study/db/chapter-2.html#block-1',
        accessPath: 'chapter-2:block-1',
        slides: [3, 4, 5, 6, 8, 11]
      },
      {
        id: 'block-2',
        lectureKey: '3',
        originalOrder: 2,
        title: '2. المخطط، الحالة، واللقطة (Schemas, Instances, and Database State)',
        sourceLocator: 'study/db/chapter-2.html#block-2',
        accessPath: 'chapter-2:block-2',
        slides: [12, 13, 14, 16, 17]
      },
      {
        id: 'block-3',
        lectureKey: '3',
        originalOrder: 3,
        title: '3. معمارية المستويات الثلاثة واستقلالية البيانات (Three-Schema & Data Independence)',
        sourceLocator: 'study/db/chapter-2.html#block-3',
        accessPath: 'chapter-2:block-3',
        slides: [18, 20, 21, 22, 23]
      },
      {
        id: 'block-4',
        lectureKey: '3',
        originalOrder: 4,
        title: '4. معماريات نظم قواعد البيانات والـ Client/Server',
        sourceLocator: 'study/db/chapter-2.html#block-4',
        accessPath: 'chapter-2:block-4',
        slides: [24, 26, 27, 28, 29, 30, 31, 32]
      },
      {
        id: 'block-5',
        lectureKey: '3',
        originalOrder: 5,
        title: '5. الرسومات المعمارية الأربعة الرسمية (Official Architectural Visuals)',
        sourceLocator: 'study/db/chapter-2.html#block-5',
        accessPath: 'chapter-2:block-5',
        slides: [20, 21, 24, 25, 28, 32]
      },
      {
        id: 'block-6',
        lectureKey: '3',
        originalOrder: 6,
        title: '6. فك شفرات وتريكات الامتحان الحرفية (Exam Cipher & Traps)',
        sourceLocator: 'study/db/chapter-2.html#block-6',
        accessPath: 'chapter-2:block-6',
        slides: [3, 4, 5, 6, 8, 11, 12, 13, 14, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]
      }
    ]
  };

  // Full slide inventory with titles, tags, and mapping details
  const SLIDES_MAP = {
    '2': [
      { num: 1, title: 'Lecture 2: Databases and Database Users', tag: 'cover', blocks: [] },
      { num: 2, title: 'OUTLINE', tag: 'outline', blocks: [] },
      { num: 3, title: 'Types of Databases and Database Applications', tag: 'topic', blocks: ['block-3'] },
      { num: 4, title: 'Recent Developments (1)', tag: 'topic', blocks: ['block-3'] },
      { num: 5, title: 'Basic Definitions', tag: 'topic', blocks: ['block-1', 'block-2'] },
      { num: 6, title: 'Basic Definitions (cont.)', tag: 'topic', blocks: ['block-1', 'block-2'] },
      { num: 7, title: 'Basic Definitions (cont.)', tag: 'topic', blocks: ['block-1'] },
      { num: 8, title: 'Application Activities Against a Database', tag: 'topic', blocks: ['block-2'] },
      { num: 9, title: 'Additional DBMS Functionality', tag: 'topic', blocks: ['block-2'] },
      { num: 10, title: 'Simplified database system environment', tag: 'diagram', blocks: ['block-2'] },
      { num: 11, title: 'Example of a Database (with a Conceptual Data Model)', tag: 'example', blocks: ['block-add'] },
      { num: 12, title: 'Example of a Database (with a Conceptual Data Model) - Relationships', tag: 'example', blocks: ['block-add'] },
      { num: 13, title: 'Example of a simple database (Tables & Data)', tag: 'example', blocks: ['block-add'] },
      { num: 14, title: 'Main Characteristics of the Database Approach', tag: 'topic', blocks: ['block-4'] },
      { num: 15, title: 'Example of a simplified database catalog', tag: 'diagram', blocks: ['block-2'] },
      { num: 16, title: 'Main Characteristics (cont.) - Data Abstraction & Operation Independence', tag: 'topic', blocks: ['block-4'] },
      { num: 17, title: 'Main Characteristics (cont.) - Conceptual View & Multiple Views', tag: 'topic', blocks: ['block-4'] },
      { num: 18, title: 'Main Characteristics (cont.) - Sharing, Concurrency & OLTP', tag: 'topic', blocks: ['block-4'] },
      { num: 19, title: 'Database Users - Categories', tag: 'topic', blocks: ['block-5'] },
      { num: 20, title: 'Database Users – Actors on the Scene', tag: 'topic', blocks: ['block-5'] },
      { num: 21, title: 'Database End Users', tag: 'topic', blocks: ['block-5'] },
      { num: 22, title: 'Database End Users (cont.)', tag: 'topic', blocks: ['block-5'] },
      { num: 23, title: 'Database Users – Actors on the Scene (cont.)', tag: 'topic', blocks: ['block-5', 'block-add'] },
      { num: 24, title: 'Database Users – Actors behind the Scene', tag: 'topic', blocks: ['block-5', 'block-add'] },
      { num: 25, title: 'Advantages of Using the Database Approach', tag: 'topic', blocks: ['block-6', 'block-add'] },
      { num: 26, title: 'Advantages of Using the Database Approach (cont.)', tag: 'topic', blocks: ['block-6'] },
      { num: 27, title: 'Advantages of Using the Database Approach (cont.)', tag: 'topic', blocks: ['block-6'] },
      { num: 28, title: 'Additional Implications of Using the Database Approach', tag: 'topic', blocks: ['block-6'] },
      { num: 29, title: 'Additional Implications (cont.) - Flexibility, Current Info & Economies of Scale', tag: 'topic', blocks: ['block-6', 'block-add'] },
      { num: 30, title: 'Lecture Summary', tag: 'summary', blocks: [] }
    ],
    '3': [
      { num: 1, title: 'Lecture 3 Ch 2: Database System Concepts and Architecture', tag: 'cover', blocks: [] },
      { num: 2, title: 'Chapter 2 Outline', tag: 'outline', blocks: [] },
      { num: 3, title: 'Data Models, Schemas, and Instances - Data Abstraction', tag: 'topic', blocks: ['block-1', 'block-6'] },
      { num: 4, title: 'Data Models, Schemas, and Instances - Data Model & Basic Operations', tag: 'topic', blocks: ['block-1', 'block-6'] },
      { num: 5, title: 'Categories of Data Models', tag: 'topic', blocks: ['block-1', 'block-6'] },
      { num: 6, title: 'High-level or Conceptual data models - Concepts', tag: 'topic', blocks: ['block-1', 'block-6'] },
      { num: 7, title: 'The COMPANY ER Diagram', tag: 'company-example', blocks: [] },
      { num: 8, title: 'Categories of Data Models (cont\'d.) - Relational Model', tag: 'topic', blocks: ['block-1', 'block-6'] },
      { num: 9, title: 'Relational Schema Diagram for COMPANY Database', tag: 'company-example', blocks: [] },
      { num: 10, title: 'Object data model & UML Class Diagram', tag: 'uml-example', blocks: [] },
      { num: 11, title: 'Categories of Data Models (cont\'d.) - Physical Models & Access Paths', tag: 'topic', blocks: ['block-1', 'block-6'] },
      { num: 12, title: 'Schemas, Instances, and Database State', tag: 'topic', blocks: ['block-2', 'block-6'] },
      { num: 13, title: 'Figure 2.1: Schema Diagram for UNIVERSITY Database', tag: 'diagram', blocks: ['block-2', 'block-6'] },
      { num: 14, title: 'Database Schema vs. Database State - Detailed Comparison', tag: 'topic', blocks: ['block-2', 'block-6'] },
      { num: 15, title: 'Figure 5.6: One Possible Database State for COMPANY Database', tag: 'company-example', blocks: [] },
      { num: 16, title: 'Schemas, Instances, and Database State (cont\'d.) - Evolution & Intension/Extension', tag: 'topic', blocks: ['block-2', 'block-6'] },
      { num: 17, title: 'Example of a database state (University Tables)', tag: 'example', blocks: ['block-2', 'block-6'] },
      { num: 18, title: 'Three-Schema Architecture and Data Independence', tag: 'topic', blocks: ['block-3', 'block-6'] },
      { num: 19, title: 'Three-Schema Architecture Concrete Example (Staff Record)', tag: 'staff-dob-example', blocks: [] },
      { num: 20, title: 'Figure 2.2: The Three-Schema Architecture Diagram', tag: 'diagram', blocks: ['block-3', 'block-5', 'block-6'] },
      { num: 21, title: 'Three-Schema Architecture Mappings', tag: 'topic', blocks: ['block-3', 'block-5', 'block-6'] },
      { num: 22, title: 'Data Independence (Logical vs. Physical)', tag: 'topic', blocks: ['block-3', 'block-6'] },
      { num: 23, title: 'DBMS Languages (DDL, SDL, VDL, DML)', tag: 'topic', blocks: ['block-3', 'block-6'] },
      { num: 24, title: 'Centralized and Client/Server Architectures for DBMSs', tag: 'topic', blocks: ['block-4', 'block-5', 'block-6'] },
      { num: 25, title: 'Figure 2.4: A Physical Centralized Architecture', tag: 'diagram', blocks: ['block-4', 'block-5', 'block-6'] },
      { num: 26, title: 'Basic Client/Server Architectures - Specialized Servers', tag: 'topic', blocks: ['block-4', 'block-6'] },
      { num: 27, title: 'Basic Client/Server Architectures - Client Machines', tag: 'topic', blocks: ['block-4', 'block-6'] },
      { num: 28, title: 'Figures 2.5 & 2.6: Logical & Physical Two-Tier Client/Server Architecture', tag: 'diagram', blocks: ['block-4', 'block-5', 'block-6'] },
      { num: 29, title: 'Basic Client/Server Architectures - Client vs. Server Definition', tag: 'topic', blocks: ['block-4', 'block-6'] },
      { num: 30, title: 'Two-Tier Client/Server Architectures for DBMSs', tag: 'topic', blocks: ['block-4', 'block-6'] },
      { num: 31, title: 'Three-Tier and n-Tier Architectures for Web Applications', tag: 'topic', blocks: ['block-4', 'block-6'] },
      { num: 32, title: 'Figure 2.7: Logical Three-Tier Client/Server Architecture', tag: 'diagram', blocks: ['block-4', 'block-5', 'block-6'] }
    ]
  };

  // Build bidirectional index
  function buildSlideIndex(lecKey) {
    const rawSlides = SLIDES_MAP[lecKey] || [];
    return rawSlides.map((s, idx) => {
      const isStandaloneOnly = s.blocks.length === 0;
      return {
        lectureKey: String(lecKey),
        num: s.num,
        originalOrder: idx + 1,
        title: s.title,
        tag: s.tag,
        isStandaloneOnly,
        image: `materials/slides/db-lec${lecKey}/slide_${s.num}.png`,
        sourceLocator: `js/lecture-explanations-data.js#db-lec${lecKey}-slide${s.num}`,
        accessPath: `lecture-explanations:db:${lecKey}:slide:${s.num}`,
        blocks: [...s.blocks]
      };
    });
  }

  const SLIDES_INDEX = {
    '2': buildSlideIndex('2'),
    '3': buildSlideIndex('3')
  };

  // Module interface
  const DBLessonMap = {
    normalizeLectureKey,

    getLectureInfo(key) {
      const k = normalizeLectureKey(key);
      return k ? Object.assign({}, LECTURES[k]) : null;
    },

    getTopicBlocks(key) {
      const k = normalizeLectureKey(key);
      if (!k) return [];
      return TOPIC_BLOCKS[k].map(b => Object.assign({}, b, { slides: [...b.slides] }));
    },

    getTopicBlock(key, blockId) {
      const k = normalizeLectureKey(key);
      if (!k || !blockId) return null;
      const found = TOPIC_BLOCKS[k].find(b => b.id === blockId);
      return found ? Object.assign({}, found, { slides: [...found.slides] }) : null;
    },

    getAllSlides(key) {
      const k = normalizeLectureKey(key);
      if (!k) return [];
      return SLIDES_INDEX[k].map(s => Object.assign({}, s, { blocks: [...s.blocks] }));
    },

    getSlide(key, slideNum) {
      const k = normalizeLectureKey(key);
      if (!k || !slideNum) return null;
      const num = Number(slideNum);
      const found = SLIDES_INDEX[k].find(s => s.num === num);
      return found ? Object.assign({}, found, { blocks: [...found.blocks] }) : null;
    },

    getSlidesForBlock(key, blockId) {
      const block = this.getTopicBlock(key, blockId);
      if (!block) return [];
      const k = normalizeLectureKey(key);
      return block.slides.map(num => this.getSlide(k, num)).filter(Boolean);
    },

    getBlocksForSlide(key, slideNum) {
      const slide = this.getSlide(key, slideNum);
      if (!slide) return [];
      const k = normalizeLectureKey(key);
      return slide.blocks.map(id => this.getTopicBlock(k, id)).filter(Boolean);
    },

    getStandaloneOnlySlides(key) {
      const k = normalizeLectureKey(key);
      if (!k) return [];
      return SLIDES_INDEX[k].filter(s => s.isStandaloneOnly).map(s => Object.assign({}, s));
    },

    getInventory(key) {
      const k = normalizeLectureKey(key);
      if (!k) return null;
      const info = LECTURES[k];
      return {
        lectureKey: k,
        standaloneBlocks: info.blocksCount,
        slides: info.slidesCount,
        standaloneQuestions: info.standaloneQuestionsCount,
        fullQuizQuestions: info.fullQuizQuestionsCount,
        slideQuestions: info.slideQuestionsCount,
        totalQuestions: info.standaloneQuestionsCount + info.fullQuizQuestionsCount + info.slideQuestionsCount
      };
    },

    getQuestions(key) {
      const k = normalizeLectureKey(key);
      if (!k) return { standalone: [], fullQuiz: [], slideQuiz: [], all: [] };
      const info = LECTURES[k];

      const standalone = [];
      for (let i = 1; i <= info.standaloneQuestionsCount; i++) {
        standalone.push({
          id: `${info.standaloneUrl}:${i}`,
          canonicalId: `${info.standaloneUrl}:${i}`,
          type: 'standalone',
          lectureKey: k,
          sourceUrl: info.standaloneUrl,
          authoredIndex: i
        });
      }

      const fullQuiz = [];
      const fullQuizUrl = `subject.html?id=database-systems&lecture=${k}`;
      for (let i = 1; i <= info.fullQuizQuestionsCount; i++) {
        fullQuiz.push({
          id: `${fullQuizUrl}:${i}`,
          canonicalId: `${fullQuizUrl}:${i}`,
          type: 'full-quiz',
          lectureKey: k,
          sourceUrl: fullQuizUrl,
          authoredIndex: i
        });
      }

      const slideQuiz = [];
      for (let i = 1; i <= info.slideQuestionsCount; i++) {
        const namespacedId = `db:lec${k}:s${i}:quiz`;
        slideQuiz.push({
          id: namespacedId,
          namespacedId,
          type: 'slide-quiz',
          lectureKey: k,
          slideNum: i,
          sourceLocator: `js/lecture-explanations-data.js#db-lec${k}-slide${i}-quiz`
        });
      }

      return {
        standalone,
        fullQuiz,
        slideQuiz,
        all: [...standalone, ...fullQuiz, ...slideQuiz]
      };
    },

    getUnifiedOutline(key) {
      const k = normalizeLectureKey(key);
      if (!k) return [];
      const blocks = this.getTopicBlocks(k);
      const allSlides = this.getAllSlides(k);

      const items = [];
      let sequence = 1;

      // Initial cover & outline slides
      const covers = allSlides.filter(s => s.tag === 'cover' || s.tag === 'outline');
      for (const s of covers) {
        items.push({
          order: sequence++,
          kind: 'slide',
          id: `slide-${s.num}`,
          title: s.title,
          slideNum: s.num,
          accessPath: s.accessPath,
          tag: s.tag
        });
      }

      // Topic blocks with contextual slide references
      for (const b of blocks) {
        const contextual = b.slides.map(num => this.getSlide(k, num));
        items.push({
          order: sequence++,
          kind: 'topic-block',
          id: b.id,
          title: b.title,
          accessPath: b.accessPath,
          sourceLocator: b.sourceLocator,
          contextualSlides: contextual.map(s => ({
            num: s.num,
            title: s.title,
            accessPath: s.accessPath,
            tag: s.tag
          }))
        });
      }

      // Example-only slides without standalone blocks
      const standaloneExamples = allSlides.filter(s => s.isStandaloneOnly && s.tag !== 'cover' && s.tag !== 'outline' && s.tag !== 'summary');
      if (standaloneExamples.length > 0) {
        items.push({
          order: sequence++,
          kind: 'supplementary-examples',
          id: 'section-unmatched-examples',
          title: 'أمثلة السلايدات التخصصية (COMPANY / UML / Staff)',
          slides: standaloneExamples.map(s => ({
            num: s.num,
            title: s.title,
            accessPath: s.accessPath,
            tag: s.tag
          }))
        });
      }

      // Summary slides
      const summaries = allSlides.filter(s => s.tag === 'summary');
      for (const s of summaries) {
        items.push({
          order: sequence++,
          kind: 'slide',
          id: `slide-${s.num}`,
          title: s.title,
          slideNum: s.num,
          accessPath: s.accessPath,
          tag: s.tag
        });
      }

      // Practice section
      items.push({
        order: sequence++,
        kind: 'practice-hub',
        id: 'practice-hub',
        title: 'بنك الأسئلة والتدريب التفاعلي',
        accessPath: `practice:db:${k}`
      });

      return items;
    }
  };

  return { DBLessonMap };
});
