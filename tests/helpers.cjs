const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function portal(options = {}) {
  const saved = new Map(Object.entries(options.saved || {}));
  const events = [];
  const storage = {
    getItem(key) { if (options.denyRead) throw new Error('Storage denied'); return saved.get(key) ?? null; },
    setItem(key, value) { if (options.denyWrite) throw new Error('Storage denied'); saved.set(key, value); }
  };
  const attributes = {};
  const context = { console, localStorage: storage, URL, setTimeout, clearTimeout,
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init.detail; } },
    dispatchEvent(event) { events.push(event); },
    document: { documentElement: { setAttribute(k,v) { attributes[k]=v; }, classList: {add(){},remove(){}} }, querySelectorAll(){return [];},getElementById(){return null;},addEventListener(){} }
  };
  context.window = context;
  vm.createContext(context);
  function load(file) { vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename:path.join(root,file)}); }
  if (fs.existsSync(path.join(root,'js/shared/storage.js'))) load('js/shared/storage.js');
  load('js/courses-data.js');
  load('js/schedule-data.js');
  return {context,load,saved,events,attributes};
}
module.exports = {portal,root};
