/* Platform analytics is available on Vercel, not GitHub Pages or local static previews. */
(function () {
  'use strict';
  const enabled = /(?:^|\.)vercel\.app$/i.test(window.location.hostname) || window.PORTAL_ANALYTICS_ENABLED === true;
  if (!enabled || document.querySelector('script[data-portal-insights]')) return;
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  script.dataset.portalInsights = 'true';
  document.head.append(script);
})();
