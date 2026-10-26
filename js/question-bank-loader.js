/* The packaged bank copies existing source questions and loads only when an exam is opened. */
(function () {
  'use strict';
  let pending;
  const source = new URL('js/course-question-bank.js', document.baseURI).href;
  window.PortalQuestionBank = {
    load({retry = false} = {}) {
      if (retry) { delete window.COURSE_QUESTION_BANK; pending = null; }
      if (window.COURSE_QUESTION_BANK) return Promise.resolve(window.COURSE_QUESTION_BANK);
      if (pending) return pending;
      pending = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const fail = () => {
          clearTimeout(timeout);
          script.remove(); pending = null;
          reject(new Error('Question bank could not be loaded'));
        };
        const timeout = setTimeout(fail, 10000);
        script.src = source;
        script.onload = () => {
          clearTimeout(timeout);
          if (window.COURSE_QUESTION_BANK && typeof window.COURSE_QUESTION_BANK === 'object') resolve(window.COURSE_QUESTION_BANK);
          else fail();
        };
        script.onerror = fail;
        document.head.append(script);
      });
      return pending;
    }
  };
})();
