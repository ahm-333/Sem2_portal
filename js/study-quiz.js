/* Full lecture quiz presentation and answer state. */
(function () {
  function create(studyFullQuizView) {
  function renderFullQuiz(data) {
    if (!studyFullQuizView) return;
    const sourceQuestions = data.fullQuiz || [];
    const presentQuestions = () => sourceQuestions.map(q => window.PortalQuizChoices.present(q, 'full:' + q.id + ':' + q.question));
    let questions = presentQuestions();
    if (questions.length === 0) {
      studyFullQuizView.innerHTML = `
        <div class="text-center py-16">
          <p class="text-sm text-[var(--text-muted)]">جاري إعداد بنك الأسئلة الشامل للمحاضرة قريباً!</p>
        </div>
      `;
      return;
    }

    let userAnswers = {};
    let score = 0;
    let activeIndex = 0;
    function selectQuestion(index, focus = false) {
      activeIndex = Math.max(0, Math.min(questions.length - 1, index));
      const id = questions[activeIndex].id;
      studyFullQuizView.querySelectorAll('[data-qid].glass-panel').forEach(card => { card.hidden = Number(card.dataset.qid) !== id; });
      studyFullQuizView.querySelectorAll('.q-map-pill').forEach(button => {
        const active = button.dataset.jumpQ === 'full-q-' + id;
        if (active) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
      });
      studyFullQuizView.querySelector('[data-quiz-position]').textContent = `السؤال ${activeIndex + 1} من ${questions.length}`;
      studyFullQuizView.querySelector('[data-quiz-step="prev"]').disabled = activeIndex === 0;
      studyFullQuizView.querySelector('[data-quiz-step="next"]').disabled = activeIndex === questions.length - 1;
      studyFullQuizView.scrollTop = 0;
      if (focus) { const card = document.getElementById('full-q-' + id); card.tabIndex = -1; card.focus({preventScroll: true}); }
    }

    function renderQuestion(q) {
      const answered = userAnswers[q.id] !== undefined;
      const userChoice = userAnswers[q.id];
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
                if (optIdx === q.correct) {
                  optClass = "border-emerald-600 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold cursor-default";
                } else if (optIdx === userChoice) {
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
              userChoice === q.correct
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
                : "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200"
            }">
              <div class="flex items-start gap-2.5">
                <span class="text-xl flex-shrink-0">${userChoice === q.correct ? "🎉" : "💡"}</span>
                <div>
                  <strong class="font-black block mb-1 ${userChoice === q.correct ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}">
                    ${userChoice === q.correct ? "إجابة صحيحة يا بطل!" : "ركز في التريكة دي:"}
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
      return `
        <div class="a1-quiz-layout">
          <aside class="a1-quiz-context">
            <h3>اختبار المحاضرة</h3>
            <div class="a1-quiz-score"><span>الدرجة الحالية</span><bdi id="full-quiz-score-val">${score} / ${questions.length}</bdi><button id="full-quiz-reset-btn" type="button" class="glass-panel" title="إعادة الاختبار من البداية">إعادة الاختبار</button></div>
            <span id="full-quiz-answered-count">${answeredCount} من ${questions.length} تم حله</span>
            <details class="a1-quiz-map" ${window.matchMedia('(min-width:761px)').matches ? 'open' : ''}>
              <summary>خريطة الأسئلة</summary><div class="a1-question-map">
              ${questions.map(q => `<button type="button" data-jump-q="full-q-${q.id}" class="q-map-pill glass-panel">${q.id}</button>`).join('')}
              </div>
            </details>
            <p class="a1-quiz-note">اختار إجابتك، وشوف تفسيرها. تقدر تتنقل بين الأسئلة وتراجع إجاباتك في الجلسة الحالية.</p>
          </aside>
          <section class="a1-quiz-main">
            ${questions.map(renderQuestion).join("")}
            <div class="a1-quiz-pagination"><button type="button" data-quiz-step="prev">السابق</button><span data-quiz-position role="status"></span><button type="button" data-quiz-step="next">السؤال التالي</button></div>
          <!-- بطاقة التقييم النهائي للكويز -->
          <div id="full-quiz-summary-card" class="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 text-center space-y-4 bg-gradient-to-b from-indigo-500/5 to-purple-500/10 ${
            answeredCount === questions.length ? "" : "hidden"
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
              <span id="full-quiz-percent" class="text-xs font-bold text-emerald-500 font-mono">(${Math.round((score / questions.length) * 100)}%)</span>
            </div>
            <p id="full-quiz-evaluation" class="text-sm font-bold text-[var(--text-main)] max-w-md mx-auto leading-relaxed">
              ${score / questions.length >= 0.85 ? "عاش جداً يا هندسة! إنت كده هضمت المحاضرة بالكامل ومستعد لأي سؤال ميدتيرم أو فاينل 🚀" : "مستوى كويس جداً! راجع الأسئلة اللي غلطت فيها وخلي بالك من التريكات."}
            </p>
          </div>

          </section>
        </div>
      `;
    }

    // One delegated handler survives question updates and reset without rebinding.
    studyFullQuizView.onclick = function (event) {
      const option = event.target.closest(".full-quiz-opt-btn");
      if (option && studyFullQuizView.contains(option)) {
        const qid = Number(option.dataset.qid);
        const choice = Number(option.dataset.optIdx);
        const question = questions.find(item => item.id === qid);
        if (!question || userAnswers[qid] !== undefined || !Number.isInteger(choice) || choice < 0 || choice >= question.options.length) return;
        userAnswers[qid] = choice;
        if (choice === question.correct) score++;
        document.getElementById(`full-q-${qid}`).outerHTML = renderQuestion(question);
        const answered = Object.keys(userAnswers).length;
        document.getElementById("full-quiz-score-val").textContent = `${score} / ${questions.length}`;
        document.getElementById("full-quiz-answered-count").textContent = `${answered} من ${questions.length} تم حله`;
        const pill = studyFullQuizView.querySelector(`[data-jump-q="full-q-${qid}"]`);
        pill.className = "q-map-pill w-8 h-8 rounded-xl text-xs font-mono font-bold border transition-all flex items-center justify-center cursor-pointer " +
          (choice === question.correct ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40" : "bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/40");
        const summary = document.getElementById("full-quiz-summary-card");
        summary.classList.toggle("hidden", answered !== questions.length);
        document.getElementById("full-quiz-final-score").textContent = `${score} / ${questions.length}`;
        document.getElementById("full-quiz-percent").textContent = `(${Math.round(score / questions.length * 100)}%)`;
        document.getElementById("full-quiz-evaluation").textContent = score / questions.length >= 0.85 ? "ممتاز! راجع النقاط المتبقية واستمر في التدريب." : "راجع الأسئلة التي أخطأت فيها وجرب مرة أخرى.";
        const card = document.getElementById(`full-q-${qid}`);
        card.setAttribute("tabindex", "-1");
        card.focus({preventScroll:true});
        selectQuestion(activeIndex);
        window.PortalUI.icons(card);
        return;
      }
      if (event.target.closest("#full-quiz-reset-btn")) {
        window.PortalQuizChoices.renew();
        questions = presentQuestions();
        userAnswers = {};
        score = 0; activeIndex = 0;
        studyFullQuizView.innerHTML = buildQuizHtml();
        studyFullQuizView.scrollTop = 0;
        selectQuestion(0, true);
        window.PortalUI.icons(studyFullQuizView);
        return;
      }
      const step = event.target.closest('[data-quiz-step]');
      if (step) { selectQuestion(activeIndex + (step.dataset.quizStep === 'next' ? 1 : -1), true); return; }
      const jump = event.target.closest(".q-map-pill");
      if (jump) {
        selectQuestion(questions.findIndex(q => 'full-q-' + q.id === jump.dataset.jumpQ), true);
        if (window.matchMedia('(max-width:760px)').matches) studyFullQuizView.querySelector('.a1-quiz-map').open = false;
      }
    };
    studyFullQuizView.innerHTML = buildQuizHtml();
    selectQuestion(0);
    window.PortalUI.icons(studyFullQuizView);
  }


    return {render: renderFullQuiz};
  }
  window.PortalStudyQuiz = {create};
})();
