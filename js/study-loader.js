/* One shared request, cached on success and retryable after a failure. */
(function () {
  let request;
  // Source scripts and packaged assets both live one directory below the site root.
  const dataUrl = new URL('../js/lecture-explanations-data.js', document.currentScript.src);
  function load() {
    if (window.LECTURE_EXPLANATIONS) return Promise.resolve(window.LECTURE_EXPLANATIONS);
    if (request) return request;
    request = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const url = new URL(dataUrl);
      url.searchParams.set('v', window.STUDY_DATA_VERSION || '1');
      script.src = url.href;
      function finish(error) {
        clearTimeout(timeout);
        script.onload = null;
        script.onerror = null;
        if (error) { script.remove(); request = undefined; reject(error); }
        else resolve(window.LECTURE_EXPLANATIONS);
      }
      const timeout = setTimeout(() => finish(new Error('Study data timeout')), 10000);
      script.onload = () => finish(window.LECTURE_EXPLANATIONS ? null : new Error('Invalid study data'));
      script.onerror = () => finish(new Error('Study data could not be loaded'));
      document.head.append(script);
    });
    return request;
  }
  window.PortalStudyLoader = {load};
})();
