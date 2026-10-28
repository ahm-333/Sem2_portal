/* Study activity recording for keyed source and reader actions. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PortalStudyActivity = factory().createStudyActivity();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function createStudyActivity(options = {}) {
    function getCatalog() {
      if (options.catalog) return options.catalog;
      if (typeof window !== 'undefined' && window.PortalCatalog) return window.PortalCatalog;
      return null;
    }

    function getState() {
      if (options.state) return options.state;
      if (typeof window !== 'undefined' && window.PortalStudyState) return window.PortalStudyState;
      return null;
    }

    function record(key, actionId) {
      if (!key || typeof key !== 'string' || !actionId || typeof actionId !== 'string') return false;
      const catalog = getCatalog();
      const state = getState();
      if (!catalog || !state) return false;

      const entry = catalog.get(key);
      if (!entry) return false;

      const action = Array.isArray(entry.actions) && entry.actions.find(a => a.id === actionId);
      if (!action) return false;

      const updatedAt = new Date().toISOString();
      const current = state.getItem(key);
      if (!current?.startedAt) {
        state.updateItem(key, { startedAt: updatedAt });
      }
      const result = state.setLastUsed({ key, actionId, updatedAt });
      return Boolean(result?.saved !== false);
    }

    function init() {
      if (typeof document === 'undefined') return;
      document.addEventListener('click', event => {
        const actionEl = event.target.closest('[data-action-id]');
        if (!actionEl) return;
        const row = actionEl.closest('[data-content-key]');
        if (!row) return;
        const key = row.getAttribute('data-content-key');
        const actionId = actionEl.getAttribute('data-action-id');
        if (key && actionId) {
          record(key, actionId);
        }
      });
    }

    return {
      record,
      init
    };
  }

  const defaultInstance = createStudyActivity();
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => defaultInstance.init());
    } else {
      defaultInstance.init();
    }
  }

  return {
    PortalStudyActivity: defaultInstance,
    createStudyActivity
  };
});
