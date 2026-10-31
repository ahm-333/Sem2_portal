/**
 * PortalSlideView (js/lesson-slide-view.js)
 * Reusable slide renderer, point-by-point breakdown, diagrams, cheat triggers,
 * and practice MCQ interactions shared between the study modal and lesson workspace.
 *
 * Owned by Issue #30 under Epic #27.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.PortalSlideView = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const assetBase = typeof document !== 'undefined' && document.currentScript
    ? new URL('../', document.currentScript.src).href : null;

  function imageUrl(src) {
    return assetBase && src ? new URL(src, assetBase).href : src;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderPoints(points) {
    if (!points || !points.length) return '';
    return `
      <div class="space-y-2.5 mt-3 pt-3 border-t border-[var(--border-subtle)]">
        <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1.5 flex items-center gap-1.5">
          <i data-lucide="list" class="w-3.5 h-3.5"></i>
          عناصر ومحاور الشريحة بالتفصيل:
        </span>
        <div class="grid grid-cols-1 gap-2.5">
          ${points.map(pt => `
            <div class="study-concept-item border p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-start gap-2.5">
              ${pt.badge ? `
                <span class="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 font-bold text-xs font-mono self-start flex-shrink-0">
                  ${escapeHtml(pt.badge)}
                </span>
              ` : ''}
              <div class="flex-1 min-w-0">
                ${pt.title ? `<h5 class="text-xs sm:text-sm font-extrabold text-[var(--text-main)] mb-1">${escapeHtml(pt.title)}</h5>` : ''}
                <p class="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed study-concept-desc">${escapeHtml(pt.desc)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderDiagram(diagram) {
    if (!diagram) return '';
    return `
      <div class="study-diagram-box p-4 sm:p-5 rounded-2xl border border-sky-500/35 space-y-3.5">
        <div class="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-extrabold text-xs sm:text-sm">
          <i data-lucide="layers" class="w-4 h-4"></i>
          <span>🧩 ${escapeHtml(diagram.title || 'تفكيك الرسم والمخطط حتة حتة (Diagram Deconstruction):')}</span>
        </div>
        ${diagram.overview ? `
          <p class="text-xs sm:text-sm text-[var(--text-main)] font-semibold leading-relaxed bg-[var(--bg-surface)] p-3 rounded-xl border border-sky-500/20">
            ${escapeHtml(diagram.overview)}
          </p>
        ` : ''}
        <div class="grid grid-cols-1 gap-2.5">
          ${(diagram.parts || []).map(part => `
            <div class="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] flex flex-col sm:flex-row sm:items-start gap-3">
              <div class="flex items-center gap-2 sm:flex-col sm:items-start flex-shrink-0">
                <span class="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-mono font-black text-xs">
                  ${escapeHtml(part.symbol || part.label)}
                </span>
                ${part.type ? `
                  <span class="text-[10px] text-[var(--text-dim)] font-medium font-mono">${escapeHtml(part.type)}</span>
                ` : ''}
              </div>
              <div class="flex-1 min-w-0">
                <h6 class="text-xs sm:text-sm font-extrabold text-[var(--text-main)] mb-1">${escapeHtml(part.role || part.title)}</h6>
                <p class="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-1.5">${escapeHtml(part.meaning)}</p>
                ${part.example ? `
                  <div class="text-[11px] font-medium text-sky-600 dark:text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-lg inline-block">
                    💡 <strong>تطبيق عملي:</strong> ${escapeHtml(part.example)}
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderComparison(comp) {
    if (!comp) return '';
    return `
      <div class="study-comparison-box p-4 sm:p-5 rounded-2xl border border-purple-500/35 space-y-3">
        <div class="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-extrabold text-xs sm:text-sm">
          <i data-lucide="git-compare" class="w-4 h-4"></i>
          <span>⚖️ ${escapeHtml(comp.title || 'مقارنة هامة في الامتحان (Comparison):')}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${(comp.items || []).map(item => `
            <div class="p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-1.5">
              <span class="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-bold text-xs inline-block">
                ${escapeHtml(item.name)}
              </span>
              <p class="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-medium">${escapeHtml(item.desc)}</p>
              ${item.example ? `
                <div class="text-[11px] text-[var(--text-dim)] mt-1">📌 <strong>مثال:</strong> ${escapeHtml(item.example)}</div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderRealLife(example) {
    if (!example) return '';
    return `
      <div class="p-3.5 sm:p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-950 dark:text-emerald-200">
        <div class="flex items-start gap-2.5">
          <span class="text-lg flex-shrink-0">🏢</span>
          <div class="flex-1 min-w-0">
            <strong class="text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-300 block mb-1">
              ${escapeHtml(example.title || 'مثال واقعي من الحياة العملية:')}
            </strong>
            <p class="text-xs sm:text-sm leading-relaxed text-[var(--text-main)] font-medium">
              ${escapeHtml(example.desc)}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  function renderTriggers(triggers) {
    if (!triggers || !triggers.length) return '';
    return `
      <div class="study-cheat-box space-y-2.5">
        <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs sm:text-sm">
          <i data-lucide="target" class="w-4 h-4"></i>
          <span>🎯 شفرة الامتحان (لو شوفت كذا اختار كذا):</span>
        </div>
        <div class="grid grid-cols-1 gap-2">
          ${triggers.map(tr => `
            <div class="study-cheat-item flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div class="flex items-center gap-2 text-xs text-[var(--text-main)] font-medium">
                <span class="text-emerald-500 font-bold">👈</span>
                <span>${escapeHtml(tr.trigger)}</span>
              </div>
              <div class="self-start sm:self-auto flex-shrink-0">
                <span class="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-mono inline-block">
                  ${escapeHtml(tr.choose)}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderKeywords(keywords) {
    if (!keywords || !keywords.length) return '';
    return `
      <div class="p-3.5 rounded-2xl glass-panel border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div class="flex items-center gap-2 mb-2.5 text-xs font-bold text-indigo-600 dark:text-cyan-400">
          <i data-lucide="key" class="w-3.5 h-3.5"></i>
          <span>المفاهيم والمصطلحات الأساسية:</span>
        </div>
        <div class="flex flex-wrap gap-2">
          ${keywords.map(kw => `
            <div class="study-keyword-pill flex items-center gap-2 text-xs">
              <span class="kw-en font-bold font-mono text-indigo-600 dark:text-cyan-300">${escapeHtml(kw.en)}</span>
              <span class="text-[var(--text-dim)]">←</span>
              <span class="kw-ar font-medium text-[var(--text-main)]">${escapeHtml(kw.ar)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderTricks(tricks) {
    if (!tricks) return '';
    return `
      <div class="study-trick-box flex items-start gap-3">
        <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i data-lucide="zap" class="w-4 h-4"></i>
        </div>
        <div class="flex-1 min-w-0">
          <span class="trick-title text-xs sm:text-sm font-extrabold block mb-1">⚡ فخ وتريكة في الامتحان:</span>
          <p class="trick-text text-xs sm:text-sm leading-relaxed">${escapeHtml(tricks)}</p>
        </div>
      </div>
    `;
  }

  function renderQuiz(quiz, slideNum) {
    if (!quiz) return '';
    let presentedQuiz = quiz;
    if (typeof window !== 'undefined' && window.PortalQuizChoices && typeof window.PortalQuizChoices.present === 'function') {
      presentedQuiz = window.PortalQuizChoices.present(quiz, 'slide:' + slideNum + ':' + quiz.question);
    }
    return `
      <div class="p-4 sm:p-5 rounded-2xl glass-panel border border-indigo-500/30 bg-[var(--bg-surface)] quiz-card" data-correct-idx="${presentedQuiz.correct}">
        <div class="flex items-center justify-between gap-2 mb-3">
          <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <i data-lucide="help-circle" class="w-4 h-4"></i>
            <span>سؤال متوقع من الامتحانات السابقة (Exam Practice):</span>
          </span>
          <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-mono font-bold border border-indigo-500/20">English MCQ</span>
        </div>
        
        <!-- نص السؤال بالإنجليزي محاذاة لليسار لوضوح القراءة -->
        <div class="p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] mb-3 dir-ltr text-left">
          <p class="text-xs sm:text-sm font-bold text-[var(--text-main)] leading-relaxed font-sans">${escapeHtml(presentedQuiz.question)}</p>
        </div>

        <!-- الخيارات بالإنجليزي -->
        <div class="space-y-2 quiz-options">
          ${presentedQuiz.options.map((opt, optIdx) => `
            <button 
              type="button" 
              dir="ltr" class="quiz-opt-btn w-full text-left dir-ltr p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-main)] hover:border-indigo-500 hover:bg-[var(--bg-card-hover)] transition-all flex items-center justify-between gap-3 group cursor-pointer" 
              data-option-index="${optIdx}"
            >
              <span class="flex-1 font-sans quiz-opt-text">${escapeHtml(opt)}</span>
              <span class="w-6 h-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center text-[11px] text-[var(--text-dim)] group-hover:border-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 font-mono font-bold flex-shrink-0 transition-colors">
                ${String.fromCharCode(65 + optIdx)}
              </span>
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback hidden mt-3 p-3.5 rounded-xl text-xs leading-relaxed border transition-all text-right dir-rtl" data-explanation="${encodeURIComponent(presentedQuiz.explanation || '')}"></div>
      </div>
    `;
  }

  function renderSlideCard(s, options = {}) {
    const totalSlides = options.totalSlides || 30;
    const introText = s.explanationIntro || s.colloquial || '';
    const pointsHtml = renderPoints(s.points);
    const diagramHtml = renderDiagram(s.diagramDeconstruction);
    const comparisonHtml = renderComparison(s.comparison);
    const realLifeHtml = renderRealLife(s.realLifeExample);
    const triggersHtml = renderTriggers(s.triggers);
    const keywordsHtml = renderKeywords(s.keywords);
    const tricksHtml = renderTricks(s.tricks);
    const quizHtml = renderQuiz(s.quiz, s.num);

    return `
      <article id="slide-card-${s.num}" class="glass-panel p-5 sm:p-7 rounded-3xl border border-[var(--border-subtle)] space-y-5 slide-study-card relative overflow-hidden shadow-xl" data-slide-num="${s.num}">
        
        <!-- هيدر الشريحة -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
              #${s.num}
            </span>
            <div>
              <h4 class="text-sm sm:text-base font-extrabold text-[var(--text-main)]">${escapeHtml(s.title)}</h4>
              <p class="text-xs text-[var(--text-muted)] font-medium">${escapeHtml(s.arabicTitle || '')}</p>
            </div>
          </div>
          <span class="text-[11px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 font-bold self-start sm:self-auto font-mono">
            الشريحة ${s.num} من ${totalSlides}
          </span>
        </div>

        <!-- صورة الشريحة كاملة وتظهر أولاً بشكل بارز -->
        <div class="rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-black/40 shadow-xl relative group">
          <img 
            src="${escapeHtml(imageUrl(s.image))}"
            alt="Slide ${s.num}: ${escapeHtml(s.title)}" 
            class="w-full h-auto object-contain max-h-[580px] mx-auto block cursor-pointer transition-transform duration-200 hover:scale-[1.01]" 
            loading="lazy" 
            data-zoom-image="${escapeHtml(imageUrl(s.image))}"
            data-zoom-title="Slide #${s.num}: ${escapeHtml(s.title)}"
          />
          <div class="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 opacity-85 group-hover:opacity-100 transition-opacity">
            <i data-lucide="presentation" class="w-3.5 h-3.5 text-purple-400"></i>
            <span>Slide #${s.num}</span>
          </div>
          <button type="button" class="absolute top-3 left-3 bg-black/60 hover:bg-black/80 text-white text-xs px-2.5 py-1.5 rounded-lg border border-white/20 flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity" data-zoom-btn="${escapeHtml(imageUrl(s.image))}" aria-label="تكبير صورة السلايد #${s.num}">
            <i data-lucide="zoom-in" class="w-3.5 h-3.5"></i>
            <span>تكبير</span>
          </button>
        </div>

        <!-- الشرح تحت السلايد مباشرة -->
        <div class="space-y-4 pt-1">
          
          <!-- 1. الشرح وتوضيح الشريحة بالعامية المصرية ومصطلحات المادة -->
          <div class="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
            <div class="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs sm:text-sm">
              <i data-lucide="book-open" class="w-4 h-4"></i>
              <span>شرح السلايد بالعامية المصرية ومصطلحات المقرر:</span>
            </div>
            ${introText ? `<p class="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed font-semibold mb-2.5">${escapeHtml(introText)}</p>` : ''}
            ${pointsHtml}
            ${s.coreSummary ? `
              <div class="mt-3 pt-3 border-t border-[var(--border-subtle)] text-[11px] sm:text-xs text-[var(--text-muted)] flex items-start gap-2">
                <i data-lucide="info" class="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5"></i>
                <span><strong>الخلاصة السريعة:</strong> ${escapeHtml(s.coreSummary)}</span>
              </div>
            ` : ''}
          </div>

          <!-- تفكيك الرسم والمخطط بالتفصيل إن وجد -->
          ${diagramHtml}

          <!-- المقارنات المباشرة إن وجدت -->
          ${comparisonHtml}

          <!-- المثال العملي الواقعي إن وجد -->
          ${realLifeHtml}

          <!-- 2. شفرة الامتحان (لو شوفت كذا اختار كذا) -->
          ${triggersHtml}

          <!-- 3. الكلمات المفتاحية والمصطلحات -->
          ${keywordsHtml}

          <!-- 4. تريكات وفخاخ الامتحان عالية التباين -->
          ${tricksHtml}

          <!-- 5. الكويز التدريبي باللغة الإنجليزية مع التفسير بالعامية -->
          ${quizHtml}

        </div>
      </article>
    `;
  }

  function renderSlideCards(slides, options = {}) {
    if (!slides || !slides.length) return '';
    return slides.map(s => renderSlideCard(s, options)).join('\n');
  }

  function bindSlideInteractions(container, options = {}) {
    if (!container) return;

    // Set dataset reader parts
    container.querySelectorAll('.slide-study-card').forEach(card => {
      const imgWrapper = card.querySelector('img')?.parentElement;
      if (imgWrapper) imgWrapper.dataset.readerPart = 'slide';
      if (card.lastElementChild) card.lastElementChild.dataset.readerPart = 'explanation';
    });

    // Quiz interactions
    container.querySelectorAll('.quiz-card').forEach(card => {
      if (card.dataset.bound === 'true') return;
      card.dataset.bound = 'true';

      const correctIdx = parseInt(card.getAttribute('data-correct-idx'), 10);
      const feedbackEl = card.querySelector('.quiz-feedback');
      const rawExplanation = feedbackEl ? decodeURIComponent(feedbackEl.getAttribute('data-explanation') || '') : '';
      const buttons = card.querySelectorAll('.quiz-opt-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', function () {
          const selectedIdx = parseInt(this.getAttribute('data-option-index'), 10);

          // Disable buttons
          buttons.forEach(b => {
            b.disabled = true;
            b.classList.remove('hover:border-indigo-500', 'hover:bg-[var(--bg-card-hover)]');
            b.classList.add('cursor-default');
          });

          if (selectedIdx === correctIdx) {
            this.classList.add('border-emerald-600', 'bg-emerald-500/15', 'text-emerald-700', 'dark:text-emerald-300');
            const badge = this.querySelector('span:last-child');
            if (badge) {
              badge.classList.add('border-emerald-600', 'text-emerald-600', 'dark:text-emerald-300', 'bg-emerald-500/20');
            }

            if (feedbackEl) {
              feedbackEl.classList.remove('hidden');
              feedbackEl.className = 'quiz-feedback mt-3 p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-right dir-rtl animate-fade-in';
              feedbackEl.innerHTML = `
                <div class="flex items-start gap-2.5">
                  <span class="text-xl flex-shrink-0">🎉</span>
                  <div class="flex-1">
                    <strong class="font-extrabold text-emerald-800 dark:text-emerald-300 block mb-1">إجابة صحيحة وممتازة!</strong>
                    <p class="leading-relaxed font-medium">${escapeHtml(rawExplanation)}</p>
                  </div>
                </div>
              `;
            }
          } else {
            this.classList.add('border-rose-600', 'bg-rose-500/15', 'text-rose-700', 'dark:text-rose-300');
            const badge = this.querySelector('span:last-child');
            if (badge) {
              badge.classList.add('border-rose-600', 'text-rose-600', 'dark:text-rose-300', 'bg-rose-500/20');
            }

            const correctBtn = card.querySelector(`[data-option-index="${correctIdx}"]`);
            if (correctBtn) {
              correctBtn.classList.add('border-emerald-600/80', 'bg-emerald-500/15', 'text-emerald-700', 'dark:text-emerald-300');
            }

            if (feedbackEl) {
              feedbackEl.classList.remove('hidden');
              feedbackEl.className = 'quiz-feedback mt-3 p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200 text-right dir-rtl animate-fade-in';
              feedbackEl.innerHTML = `
                <div class="flex items-start gap-2.5">
                  <span class="text-xl flex-shrink-0">💡</span>
                  <div class="flex-1">
                    <strong class="font-extrabold text-rose-800 dark:text-rose-300 block mb-1">توضيح وتريكة الامتحان:</strong>
                    <p class="leading-relaxed font-medium">${escapeHtml(rawExplanation)}</p>
                  </div>
                </div>
              `;
            }
          }
        });
      });
    });

    // Image click zoom hookup
    if (typeof options.onImageZoom === 'function') {
      container.querySelectorAll('[data-zoom-image], [data-zoom-btn]').forEach(el => {
        el.addEventListener('click', e => {
          e.preventDefault();
          const imgUrl = el.getAttribute('data-zoom-image') || el.getAttribute('data-zoom-btn');
          const title = el.getAttribute('data-zoom-title') || '';
          options.onImageZoom(imgUrl, title);
        });
      });
    }

    if (typeof window !== 'undefined' && window.PortalUI && typeof window.PortalUI.icons === 'function') {
      window.PortalUI.icons(container);
    }
  }

  return {
    renderSlideCard,
    renderSlideCards,
    bindSlideInteractions,
    escapeHtml
  };
});
