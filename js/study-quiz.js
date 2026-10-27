/* Full lecture quiz presentation, answer state, hydration, attempts/results and wrong-answer review. */
(function () {
  'use strict';

  function create(studyFullQuizView) {
    function renderFullQuiz(data, context = {}) {
      if (!studyFullQuizView) return;
      const sourceQuestions = data?.fullQuiz || [];
      if (sourceQuestions.length === 0) {
        studyFullQuizView.innerHTML = `
          <div class="text-center py-16">
            <p class="text-sm text-[var(--text-muted)]">جاري إعداد بنك الأسئلة الشامل للمحاضرة قريباً!</p>
          </div>
        `;
        return;
      }

      const canonicalKey = context?.key || null;
      let quizVersion = context?.quizVersion || null;
      if (!quizVersion && canonicalKey && window.PortalCatalog) {
        quizVersion = window.PortalCatalog.get(canonicalKey)?.study?.quizVersion || null;
      }
      if (!quizVersion) quizVersion = '0f77d6ceae5a';

      const presentQuestions = () => sourceQuestions.map(q => window.PortalQuizChoices.present(q, 'full:' + q.id + ':' + q.question));
      let questions = presentQuestions();

      const storedItem = (canonicalKey && window.PortalStudyState) ? window.PortalStudyState.getItem(canonicalKey) : null;
      const storedQuiz = storedItem?.quiz || null;

      let currentAttempt = window.PortalQuizAttempt
        ? window.PortalQuizAttempt.hydrateAttempt(storedQuiz, sourceQuestions, quizVersion)
        : {
            version: quizVersion,
            answers: {},
            activeQuestionId: sourceQuestions[0]?.id,
            completedVersions: [],
            archivedResults: [],
            score: 0,
            total: sourceQuestions.length,
            answeredCount: 0,
            isComplete: false
          };

      let userAnswers = currentAttempt.answers;
      let score = currentAttempt.score;

      let activeIndex = 0;
      if (currentAttempt.activeQuestionId !== undefined) {
        const idx = questions.findIndex(q => String(q.id) === String(currentAttempt.activeQuestionId));
        if (idx >= 0) activeIndex = idx;
      }

      function persistQuizState() {
        if (!canonicalKey || !window.PortalStudyState || !window.PortalQuizAttempt) return;
        try {
          const existing = window.PortalStudyState.getItem(canonicalKey);
          window.PortalStudyState.updateItem(canonicalKey, {
            startedAt: existing?.startedAt || new Date().toISOString(),
            quiz: window.PortalQuizAttempt.serializeForStorage(currentAttempt)
          });
        } catch { /* Honest in-session fallback if storage is blocked */ }
      }

      function selectQuestion(index, focus = false) {
        activeIndex = Math.max(0, Math.min(questions.length - 1, index));
        const id = questions[activeIndex].id;
        currentAttempt.activeQuestionId = id;

        studyFullQuizView.querySelectorAll('[data-qid].glass-panel').forEach(card => {
          card.hidden = Number(card.dataset.qid) !== id;
        });
        studyFullQuizView.querySelectorAll('.q-map-pill').forEach(button => {
          const active = button.dataset.jumpQ === 'full-q-' + id;
          if (active) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
        });
        const posEl = studyFullQuizView.querySelector('[data-quiz-position]');
        if (posEl) posEl.textContent = `السؤال ${activeIndex + 1} من ${questions.length}`;
        const prevBtn = studyFullQuizView.querySelector('[data-quiz-step="prev"]');
        if (prevBtn) prevBtn.disabled = activeIndex === 0;
        const nextBtn = studyFullQuizView.querySelector('[data-quiz-step="next"]');
        if (nextBtn) nextBtn.disabled = activeIndex === questions.length - 1;
        studyFullQuizView.scrollTop = 0;

        if (focus) {
          const card = document.getElementById('full-q-' + id);
          if (card) {
            card.tabIndex = -1;
            card.focus({ preventScroll: true });
          }
        }
      }

      function renderQuestion(q) {
        const srcQ = sourceQuestions.find(item => item.id === q.id) || q;
        const qKey = 'full:' + srcQ.id + ':' + srcQ.question;
        const order = window.PortalQuizChoices.order(qKey, srcQ.options, srcQ.question);

        const answered = userAnswers[String(q.id)] !== undefined;
        const userAuthoredChoice = answered ? userAnswers[String(q.id)] : undefined;
        const userChoiceDisplayed = answered ? order.indexOf(userAuthoredChoice) : -1;
        const correctDisplayed = order.indexOf(srcQ.correct);

        return `
          <div id="full-q-${q.id}" class="glass-panel p-5 sm:p-6 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-md space-y-4" data-qid="${q.id}">

            <!-- هيدر السؤال -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 font-mono font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                  Q${q.id}
                </span>
                ${q.topic ? `<span class="text-xs font-bold text-[var(--text-main)] font-mono">${q.topic}</span>` : ""}
              </div>
              ${Number.isInteger(q.slideNum) ? `<span class="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 font-mono font-bold self-start sm:self-auto border border-indigo-500/20">Slide #${q.slideNum}</span>` : ""}
            </div>

            <!-- نص السؤال بالإنجليزية -->
            <div class="p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-left dir-ltr">
              <p class="text-xs sm:text-sm font-bold text-[var(--text-main)] font-sans leading-relaxed">${q.question}</p>
            </div>

            <!-- خيارات السؤال -->
            <div class="space-y-2 quiz-full-options">
              ${q.options.map((opt, optIdx) => {
                let optClass = "border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-indigo-500 cursor-pointer";
                if (answered) {
                  if (optIdx === correctDisplayed) {
                    optClass = "border-emerald-600 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold cursor-default";
                  } else if (optIdx === userChoiceDisplayed) {
                    optClass = "border-rose-600 bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold cursor-default";
                  } else {
                    optClass = "border-[var(--border-subtle)] opacity-50 cursor-default";
                  }
                }
                return `
                  <button 
                    type="button" 
                    dir="ltr" class="full-quiz-opt-btn w-full text-left dir-ltr p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between gap-3 ${optClass}"
                    data-qid="${q.id}"
                    data-opt-idx="${optIdx}"
                    ${answered ? "disabled" : ""}
                  >
                    <span class="flex-1 font-sans">${opt}</span>
                    <span class="w-6 h-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-center text-[11px] font-mono font-bold flex-shrink-0">
                      ${String.fromCharCode(65 + optIdx)}
                    </span>
                  </button>
                `;
              }).join("")}
            </div>

            <!-- صندوق التفسير الفوري بالعامية المصرية ومصطلحات المادة -->
            ${answered ? `
              <div class="p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed text-right dir-rtl animate-fade-in ${
                userAuthoredChoice === srcQ.correct
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200"
              }">
                <div class="flex items-start gap-2.5">
                  <span class="text-xl flex-shrink-0">${userAuthoredChoice === srcQ.correct ? "🎉" : "💡"}</span>
                  <div>
                    <strong class="font-black block mb-1 ${userAuthoredChoice === srcQ.correct ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}">
                      ${userAuthoredChoice === srcQ.correct ? "إجابة صحيحة يا بطل!" : "ركز في التريكة دي:"}
                    </strong>
                    <p class="leading-relaxed font-medium">${q.explanation}</p>
                  </div>
                </div>
              </div>
            ` : ""}

          </div>
        `;
      }

      function buildQuizHtml() {
        const answeredCount = Object.keys(userAnswers).length;
        const isComplete = answeredCount === questions.length;
        const wrongQuestions = window.PortalQuizAttempt ? window.PortalQuizAttempt.getWrongQuestions(sourceQuestions, userAnswers) : [];
        const hasWrong = wrongQuestions.length > 0;

        return `
          <div class="a1-quiz-layout">
            <aside class="a1-quiz-context">
              <h3>اختبار المحاضرة</h3>
              <div class="a1-quiz-score">
                <span>الدرجة الحالية</span>
                <bdi id="full-quiz-score-val">${score} / ${questions.length}</bdi>
                <button id="full-quiz-reset-btn" type="button" class="glass-panel" title="إعادة الاختبار من البداية">إعادة الاختبار</button>
              </div>
              <span id="full-quiz-answered-count">${answeredCount} من ${questions.length} تم حله</span>
              <details class="a1-quiz-map" ${window.matchMedia('(min-width:761px)').matches ? 'open' : ''}>
                <summary>خريطة الأسئلة</summary>
                <div class="a1-question-map">
                  ${questions.map(q => {
                    const ans = userAnswers[String(q.id)];
                    const srcQ = sourceQuestions.find(item => item.id === q.id) || q;
                    let pillStyle = "q-map-pill glass-panel";
                    if (ans !== undefined) {
                      pillStyle = "q-map-pill " + (ans === srcQ.correct
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/40");
                    }
                    return `<button type="button" data-jump-q="full-q-${q.id}" class="${pillStyle}">${q.id}</button>`;
                  }).join('')}
                </div>
              </details>
              ${currentAttempt.archivedResults && currentAttempt.archivedResults.length > 0 ? `
                <div class="text-[11px] text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-2 mt-2">
                  <span>تم أرشفة نتائج سابقة: ${currentAttempt.archivedResults[currentAttempt.archivedResults.length - 1].score} / ${currentAttempt.archivedResults[currentAttempt.archivedResults.length - 1].total}</span>
                </div>
              ` : ''}
              <p class="a1-quiz-note">اختار إجابتك، وشوف تفسيرها. تقدر تتنقل بين الأسئلة وتراجع إجاباتك في الجلسة الحالية.</p>
            </aside>
            <section class="a1-quiz-main">
              ${questions.map(renderQuestion).join("")}
              <div class="a1-quiz-pagination">
                <button type="button" data-quiz-step="prev">السابق</button>
                <span data-quiz-position role="status"></span>
                <button type="button" id="full-quiz-back-to-results-btn" class="${isComplete ? '' : 'hidden'}">العودة للنتائج</button>
                <button type="button" data-quiz-step="next">السؤال التالي</button>
              </div>
              <!-- بطاقة التقييم النهائي للكويز -->
              <div id="full-quiz-summary-card" class="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 text-center space-y-4 bg-gradient-to-b from-indigo-500/5 to-purple-500/10 ${
                isComplete ? "" : "hidden"
              }">
                <div class="w-16 h-16 mx-auto rounded-3xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center text-3xl shadow-inner">
                  🏆
                </div>
                <div>
                  <h4 class="text-lg font-black text-[var(--text-main)] mb-1">انتهى الاختبار الشامل للمحاضرة!</h4>
                  <p class="text-xs text-[var(--text-muted)]">إليك تقرير نتيجتك وتقييم فهمك لمحتوى السلايدات:</p>
                </div>
                <div class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
                  <span class="text-xs font-bold text-[var(--text-muted)]">الدرجة النهائية:</span>
                  <span id="full-quiz-final-score" class="text-2xl font-black text-indigo-500 font-mono">${score} / ${questions.length}</span>
                  <span id="full-quiz-percent" class="text-xs font-bold font-mono">(${Math.round((score / questions.length) * 100)}%)</span>
                </div>
                <p id="full-quiz-evaluation" class="text-sm font-bold text-[var(--text-main)] max-w-md mx-auto leading-relaxed">
                  ${score / questions.length >= 0.85 ? "عاش جداً يا هندسة! إنت كده هضمت المحاضرة بالكامل ومستعد لأي سؤال ميدتيرم أو فاينل 🚀" : "مستوى كويس جداً! راجع الأسئلة اللي غلطت فيها وخلي بالك من التريكات."}
                </p>
                <div id="full-quiz-actions" class="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button id="full-quiz-review-wrong-btn" type="button" class="glass-panel px-4 py-2 rounded-xl border border-rose-500/30 text-rose-700 dark:text-rose-300 font-bold text-xs sm:text-sm hover:bg-rose-500/10 transition-all ${hasWrong ? '' : 'hidden'}">
                    مراجعة الأسئلة الخاطئة (${wrongQuestions.length})
                  </button>
                  <div id="full-quiz-all-correct-banner" class="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm ${hasWrong ? 'hidden' : ''}">
                    🎉 كل الإجابات صحيحة! لا توجد أخطاء لمراجعتها
                  </div>
                </div>
              </div>
            </section>
          </div>
        `;
      }

      studyFullQuizView.onclick = function (event) {
        const option = event.target.closest(".full-quiz-opt-btn");
        if (option && studyFullQuizView.contains(option)) {
          const qid = Number(option.dataset.qid);
          const optIdx = Number(option.dataset.optIdx);
          const srcQ = sourceQuestions.find(item => item.id === qid);
          if (!srcQ || userAnswers[String(qid)] !== undefined || !Number.isInteger(optIdx) || optIdx < 0 || optIdx >= srcQ.options.length) return;

          const qKey = 'full:' + srcQ.id + ':' + srcQ.question;
          const order = window.PortalQuizChoices.order(qKey, srcQ.options, srcQ.question);
          const authoredChoice = order[optIdx];

          currentAttempt = window.PortalQuizAttempt.transitionAttempt(currentAttempt, sourceQuestions, quizVersion, {
            type: 'answer',
            questionId: qid,
            choice: authoredChoice
          });
          userAnswers = currentAttempt.answers;
          score = currentAttempt.score;

          persistQuizState();

          const presentedQ = questions.find(item => item.id === qid) || srcQ;
          const cardEl = document.getElementById(`full-q-${qid}`);
          if (cardEl) {
            cardEl.outerHTML = renderQuestion(presentedQ);
          }

          const answered = Object.keys(userAnswers).length;
          const isComplete = answered === questions.length;
          const scoreVal = document.getElementById("full-quiz-score-val");
          if (scoreVal) scoreVal.textContent = `${score} / ${questions.length}`;
          const countVal = document.getElementById("full-quiz-answered-count");
          if (countVal) countVal.textContent = `${answered} من ${questions.length} تم حله`;

          const pill = studyFullQuizView.querySelector(`[data-jump-q="full-q-${qid}"]`);
          if (pill) {
            pill.className = "q-map-pill w-8 h-8 rounded-xl text-xs font-mono font-bold border transition-all flex items-center justify-center cursor-pointer " +
              (authoredChoice === srcQ.correct ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40" : "bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/40");
          }

          const summary = document.getElementById("full-quiz-summary-card");
          if (summary) {
            summary.classList.toggle("hidden", !isComplete);
            const finalScore = document.getElementById("full-quiz-final-score");
            if (finalScore) finalScore.textContent = `${score} / ${questions.length}`;
            const pctNode = document.getElementById("full-quiz-percent");
            if (pctNode) pctNode.textContent = `(${Math.round(score / questions.length * 100)}%)`;
            const evalText = document.getElementById("full-quiz-evaluation");
            if (evalText) evalText.textContent = score / questions.length >= 0.85 ? "ممتاز! راجع النقاط المتبقية واستمر في التدريب." : "راجع الأسئلة التي أخطأت فيها وجرب مرة أخرى.";

            const wrongQuestions = window.PortalQuizAttempt.getWrongQuestions(sourceQuestions, userAnswers);
            const hasWrong = wrongQuestions.length > 0;
            const reviewWrongBtn = document.getElementById("full-quiz-review-wrong-btn");
            if (reviewWrongBtn) {
              reviewWrongBtn.classList.toggle("hidden", !hasWrong);
              reviewWrongBtn.textContent = `مراجعة الأسئلة الخاطئة (${wrongQuestions.length})`;
            }
            const allCorrectBanner = document.getElementById("full-quiz-all-correct-banner");
            if (allCorrectBanner) {
              allCorrectBanner.classList.toggle("hidden", hasWrong);
            }
          }

          const backBtn = document.getElementById("full-quiz-back-to-results-btn");
          if (backBtn) backBtn.classList.toggle("hidden", !isComplete);

          const card = document.getElementById(`full-q-${qid}`);
          if (card) {
            card.setAttribute("tabindex", "-1");
            card.focus({ preventScroll: true });
            window.PortalUI.icons(card);
          }
          selectQuestion(activeIndex);
          return;
        }

        if (event.target.closest("#full-quiz-review-wrong-btn")) {
          const wrongList = window.PortalQuizAttempt ? window.PortalQuizAttempt.getWrongQuestions(sourceQuestions, userAnswers) : [];
          if (wrongList.length > 0) {
            const firstWrongIdx = questions.findIndex(q => q.id === wrongList[0].id);
            selectQuestion(firstWrongIdx >= 0 ? firstWrongIdx : 0, true);
            const backBtn = document.getElementById("full-quiz-back-to-results-btn");
            if (backBtn) backBtn.classList.remove("hidden");
          }
          return;
        }

        if (event.target.closest("#full-quiz-back-to-results-btn")) {
          const summary = document.getElementById("full-quiz-summary-card");
          if (summary) {
            summary.classList.remove("hidden");
            summary.setAttribute("tabindex", "-1");
            summary.scrollIntoView({ behavior: 'smooth', block: 'center' });
            summary.focus({ preventScroll: true });
          }
          return;
        }

        if (event.target.closest("#full-quiz-reset-btn")) {
          window.PortalQuizChoices.renew();
          questions = presentQuestions();
          currentAttempt = window.PortalQuizAttempt.transitionAttempt(currentAttempt, sourceQuestions, quizVersion, { type: 'reset' });
          userAnswers = currentAttempt.answers;
          score = currentAttempt.score;
          activeIndex = 0;
          persistQuizState();

          studyFullQuizView.innerHTML = buildQuizHtml();
          studyFullQuizView.scrollTop = 0;
          selectQuestion(0, true);
          window.PortalUI.icons(studyFullQuizView);
          return;
        }

        const step = event.target.closest('[data-quiz-step]');
        if (step) {
          const nextIdx = activeIndex + (step.dataset.quizStep === 'next' ? 1 : -1);
          selectQuestion(nextIdx, true);
          persistQuizState();
          return;
        }

        const jump = event.target.closest(".q-map-pill");
        if (jump) {
          const targetIdx = questions.findIndex(q => 'full-q-' + q.id === jump.dataset.jumpQ);
          selectQuestion(targetIdx, true);
          persistQuizState();
          if (window.matchMedia('(max-width:760px)').matches) {
            const mapDetails = studyFullQuizView.querySelector('.a1-quiz-map');
            if (mapDetails) mapDetails.open = false;
          }
        }
      };

      studyFullQuizView.innerHTML = buildQuizHtml();
      selectQuestion(activeIndex);
      window.PortalUI.icons(studyFullQuizView);
    }

    return { render: renderFullQuiz };
  }

  window.PortalStudyQuiz = { create };
})();
