/* Standard system cursor: custom trailing cursor disabled for natural native pointer behavior. */
(function () {
  delete document.body?.dataset?.cursorPreview;
  document.querySelector('.cursor-study')?.remove();
})();
