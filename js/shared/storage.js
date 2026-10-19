/* Persistent preferences with a per-session fallback when browser storage is unavailable. */
(function (root) {
  const memory = new Map();
  const unsaved = new Set();
  const storage = {
    getItem(key) {
      if (unsaved.has(key)) return memory.get(key) ?? null;
      try {
        const value = root.localStorage.getItem(key);
        if (value !== null) memory.set(key, value);
        else memory.delete(key);
        return value;
      } catch {
        return memory.get(key) ?? null;
      }
    },
    setItem(key, value) {
      const text = String(value);
      memory.set(key, text);
      try {
        root.localStorage.setItem(key, text);
        unsaved.delete(key);
        return true;
      } catch {
        unsaved.add(key);
        return false;
      }
    }
  };
  root.PortalStorage = storage;
  if (root.window) root.window.PortalStorage = storage;
  if (typeof module !== 'undefined' && module.exports) module.exports = storage;
})(globalThis);
