/**
 * ==============================================================================
 * Study Hub - Motion & Modern UI Engine
 * Integrates:
 * 1. Lenis (Darkroom Engineering) - Smooth momentum scrolling
 * 2. GSAP (GreenSock) - Physics-based micro-interactions, staggers & transitions
 * 3. React Bits (DavidHDev/react-bits) - Aurora background, Spotlight cards,
 *    Decrypted text, Shiny text, CountUp counters, Magnet buttons & 3D Tilt cards.
 * ==============================================================================
 */

(function () {
  'use strict';

  const isReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ==============================================================================
     1. React Bits - Aurora Ambient Living Mesh
     ============================================================================== */
  function mountAurora() {
    if (document.querySelector('.rb-aurora')) return;
    const aurora = document.createElement('div');
    aurora.className = 'rb-aurora';
    aurora.setAttribute('aria-hidden', 'true');
    aurora.innerHTML = `
      <div class="rb-aurora-orb rb-aurora-orb-1"></div>
      <div class="rb-aurora-orb rb-aurora-orb-2"></div>
      <div class="rb-aurora-orb rb-aurora-orb-3"></div>
    `;
    document.body.prepend(aurora);
  }

  /* ==============================================================================
     2. Lenis Smooth Scroll Engine (Darkroom Engineering)
     ============================================================================== */
  let lenisInstance = null;

  function initLenis() {
    if (isReduced() || typeof window.Lenis === 'undefined') return;

    // Prevent duplicate initialization
    if (window.portalLenis) return;

    try {
      lenisInstance = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
        infinite: false,
      });

      window.portalLenis = lenisInstance;

      function raf(time) {
        lenisInstance.raf(time);
        window.requestAnimationFrame(raf);
      }
      window.requestAnimationFrame(raf);

      // Prevent scroll bleed on dialogs and modal containers
      const preventTargets = [
        '#profile-modal-box',
        '#student-profile-modal',
        '#study-modal-container',
        '#lecture-study-modal',
        '#pdf-modal',
        '#pdf-modal-container',
        '#study-slides-feed',
        '#study-full-quiz-view',
      ];
      preventTargets.forEach((sel) => {
        const el = document.querySelector(sel);
        if (el) el.setAttribute('data-lenis-prevent', '');
      });

      // Smooth anchor link scrolling
      document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#' || targetId === '#!') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl && !targetEl.hidden && targetEl.offsetParent !== null) {
          e.preventDefault();
          lenisInstance.scrollTo(targetEl, { offset: -90, duration: 0.9 });
        }
      });
    } catch {
      // Graceful fallback if Lenis fails
    }
  }

  /* ==============================================================================
     3. React Bits - Spotlight Cards Effect
     ============================================================================== */
  function setupSpotlightCards() {
    if (!isFinePointer() || isReduced()) return;

    const cards = document.querySelectorAll(
      '.a1-course, .glass-panel, .developer-profile-card, .creators-showcase-card, .a1-schedule-card'
    );

    cards.forEach((card) => {
      if (card.dataset.spotlightReady) return;
      card.dataset.spotlightReady = 'true';
      card.classList.add('rb-spotlight');

      card.addEventListener('pointerenter', () => {
        card.style.setProperty('--spotlight-opacity', '1');
      });

      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--spotlight-x', `${x}px`);
        card.style.setProperty('--spotlight-y', `${y}px`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--spotlight-opacity', '0');
      });
    });
  }

  /* ==============================================================================
     4. React Bits - 3D Tilt Card (Course Cards & Developer Cards)
     ============================================================================== */
  function setupTiltCards() {
    if (!isFinePointer() || isReduced() || typeof window.gsap === 'undefined') return;

    const cards = document.querySelectorAll('.a1-course, .developer-profile-card');
    cards.forEach((card) => {
      if (card.dataset.tiltReady) return;
      card.dataset.tiltReady = 'true';
      card.classList.add('rb-tilt');

      const setX = window.gsap.quickTo(card, 'rotateY', { duration: 0.35, ease: 'power2.out' });
      const setY = window.gsap.quickTo(card, 'rotateX', { duration: 0.35, ease: 'power2.out' });

      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        // Limit max tilt angle to 5 degrees for sleek subtlety
        setX(x * 6);
        setY(-y * 6);
      });

      card.addEventListener('pointerleave', () => {
        window.gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'power3.out',
          clearProps: 'transform',
        });
      });
    });
  }

  /* ==============================================================================
     5. React Bits - Magnet Buttons (Theme switcher, Profile, Filter chips)
     ============================================================================== */
  function setupMagnetButtons() {
    if (!isFinePointer() || isReduced() || typeof window.gsap === 'undefined') return;

    const buttons = document.querySelectorAll(
      '#cycle-theme-btn, .a1-profile, #share-btn, .filter-chip, .a1-back-home-btn, [data-theme-btn]'
    );

    buttons.forEach((btn) => {
      if (btn.dataset.magnetReady) return;
      btn.dataset.magnetReady = 'true';
      btn.classList.add('rb-magnet');

      const setX = window.gsap.quickTo(btn, 'x', { duration: 0.25, ease: 'power3.out' });
      const setY = window.gsap.quickTo(btn, 'y', { duration: 0.25, ease: 'power3.out' });

      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = (e.clientX - centerX) * 0.28;
        const dy = (e.clientY - centerY) * 0.28;
        setX(dx);
        setY(dy);
      });

      btn.addEventListener('pointerleave', () => {
        window.gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.45,
          ease: 'elastic.out(1, 0.4)',
          clearProps: 'transform',
        });
      });
    });
  }

  /* ==============================================================================
     6. React Bits - Decrypted Text Effect (Hero Heading)
     ============================================================================== */
  function setupDecryptedText() {
    if (isReduced()) return;
    const heading = document.querySelector('.a1-welcome h1');
    if (!heading || heading.dataset.decrypted) return;
    heading.dataset.decrypted = 'true';

    const originalText = heading.textContent.trim();
    if (!originalText) return;

    const glyphs = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي0123456789!#%*+';
    let iteration = 0;
    const totalIterations = originalText.length * 2.5;

    const interval = window.setInterval(() => {
      heading.textContent = originalText
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === '.') return char;
          if (index < iteration / 2.5) {
            return originalText[index];
          }
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');

      iteration++;
      if (iteration >= totalIterations) {
        window.clearInterval(interval);
        heading.textContent = originalText;
      }
    }, 28);
  }

  /* ==============================================================================
     7. React Bits - CountUp Stats Animation
     ============================================================================== */
  function setupCountUp() {
    if (isReduced() || typeof window.gsap === 'undefined') return;

    const statCourses = document.getElementById('stat-courses');
    const statPaths = document.getElementById('stat-paths');

    if (statCourses && !statCourses.dataset.counted) {
      statCourses.dataset.counted = 'true';
      const targetCourses = parseInt(statCourses.textContent, 10) || 6;
      const cObj = { val: 0 };
      window.gsap.to(cObj, {
        val: targetCourses,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          statCourses.textContent = Math.round(cObj.val);
        },
      });
    }

    if (statPaths && !statPaths.dataset.counted) {
      statPaths.dataset.counted = 'true';
      const targetPaths = parseInt(statPaths.textContent, 10) || 2;
      const pObj = { val: 0 };
      window.gsap.to(pObj, {
        val: targetPaths,
        duration: 1.0,
        ease: 'power2.out',
        onUpdate: () => {
          statPaths.textContent = Math.round(pObj.val);
        },
      });
    }
  }

  /* ==============================================================================
     8. React Bits - Shiny Text Elements
     ============================================================================== */
  function setupShinyText() {
    if (isReduced()) return;
    const shinySelectors = [
      '.a1-brand strong',
      '.creators-showcase-card [data-lucide="sparkles"] + span',
      '.creators-showcase-card .font-mono:not([dir="ltr"])',
    ];
    shinySelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.classList.add('rb-shiny-text');
      });
    });
  }

  /* ==============================================================================
     9. GSAP Stagger Entrances (Hero, Course Cards, Schedule)
     ============================================================================== */
  function animateHeroEntrance() {
    if (isReduced() || typeof window.gsap === 'undefined') return;

    const welcome = document.querySelector('.a1-welcome');
    if (!welcome || welcome.hidden || welcome.dataset.animated) return;
    welcome.dataset.animated = 'true';

    const tl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      '.a1-welcome h1',
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.6, clearProps: 'all' }
    )
      .fromTo(
        '.a1-welcome p',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, clearProps: 'all' },
        '-=0.35'
      )
      .fromTo(
        '.a1-summary span',
        { opacity: 0, y: 12, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08, clearProps: 'all' },
        '-=0.25'
      )
      .fromTo(
        '.a1-search-area',
        { opacity: 0, y: 14, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, clearProps: 'all' },
        '-=0.2'
      );
  }

  function animateCourseCards() {
    if (isReduced() || typeof window.gsap === 'undefined') return;

    const cards = document.querySelectorAll('#courses-grid .a1-course');
    if (!cards.length) return;

    window.gsap.fromTo(
      cards,
      { opacity: 0, y: 24, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.06,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        onComplete: () => {
          setupSpotlightCards();
          setupTiltCards();
        },
      }
    );
  }

  function animateScheduleCards() {
    if (isReduced() || typeof window.gsap === 'undefined') return;

    const days = document.querySelectorAll('#weekly-schedule-grid > div');
    if (!days.length) return;

    window.gsap.fromTo(
      days,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        onComplete: () => {
          setupSpotlightCards();
        },
      }
    );
  }

  /* ==============================================================================
     10. Subject Page Staggers & Transitions
     ============================================================================== */
  function setupSubjectPageMotion() {
    if (isReduced() || typeof window.gsap === 'undefined') return;

    const heading = document.querySelector('.a1-course-heading-panel');
    if (heading && !heading.dataset.animated) {
      heading.dataset.animated = 'true';
      window.gsap.fromTo(
        heading,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' }
      );
    }

    // Resource tab switch smooth transition
    const tabNav = document.querySelector('.a1-resource-tabs');
    if (tabNav && !tabNav.dataset.motionHooked) {
      tabNav.dataset.motionHooked = 'true';
      tabNav.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-resource-kind]');
        if (!btn) return;
        window.requestAnimationFrame(() => {
          const visibleCard = document.querySelector(
            '#track-panel-lecture > div:not([hidden]), #track-panel-section > div:not([hidden])'
          );
          if (visibleCard && typeof window.gsap !== 'undefined') {
            window.gsap.fromTo(
              visibleCard,
              { opacity: 0.4, y: 10 },
              { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'transform,opacity' }
            );
          }
          setupSpotlightCards();
        });
      });
    }
  }

  /* ==============================================================================
     11. Initialize Everything Seamlessly
     ============================================================================== */
  function initMotionSystem() {
    mountAurora();
    initLenis();
    setupShinyText();
    setupMagnetButtons();
    setupSpotlightCards();
    setupTiltCards();

    // Check if intro is active on home page
    const isIntroActive = () => !!(window.PortalIntro && window.PortalIntro.isActive());

    if (document.body.dataset.page === 'home') {
      if (isIntroActive()) {
        // Wait for intro to finish or skip
        const checkInterval = window.setInterval(() => {
          if (!isIntroActive()) {
            window.clearInterval(checkInterval);
            animateHeroEntrance();
            setupDecryptedText();
            setupCountUp();
            animateCourseCards();
          }
        }, 100);
      } else {
        animateHeroEntrance();
        setupDecryptedText();
        setupCountUp();
        animateCourseCards();
      }

      // Observe dynamic changes in courses grid (filtering/search)
      const coursesGrid = document.getElementById('courses-grid');
      if (coursesGrid) {
        let timer = null;
        const observer = new window.MutationObserver(() => {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            setupSpotlightCards();
            setupTiltCards();
          }, 60);
        });
        observer.observe(coursesGrid, { childList: true });
      }

      // Observe schedule changes
      const scheduleGrid = document.getElementById('weekly-schedule-grid');
      if (scheduleGrid) {
        let sTimer = null;
        const sObserver = new window.MutationObserver(() => {
          window.clearTimeout(sTimer);
          sTimer = window.setTimeout(() => {
            animateScheduleCards();
            setupSpotlightCards();
          }, 60);
        });
        sObserver.observe(scheduleGrid, { childList: true });
      }

      // Hash change listener for schedule vs courses transition
      window.addEventListener('hashchange', () => {
        if (window.location.hash === '#schedule-section') {
          window.setTimeout(animateScheduleCards, 50);
        } else {
          window.setTimeout(animateCourseCards, 50);
        }
      });
    } else if (document.body.dataset.page === 'subject') {
      setupSubjectPageMotion();
      setupSpotlightCards();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotionSystem);
  } else {
    initMotionSystem();
  }
})();
