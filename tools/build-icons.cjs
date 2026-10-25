// Keep Lucide's official SVG renderer and only ship icons used by runtime sources.
const fs = require('node:fs');
const path = require('node:path');
const {buildSync} = require('esbuild');
function sources(dir) {
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry => {
    if (entry.name==='vendor') return [];
    const file=path.join(dir,entry.name);
    return entry.isDirectory()?sources(file):/\.(?:js|html)$/.test(file)?[file]:[];
  });
}
function buildIcons(root) {
  const available = require('lucide').icons;
  const names = new Set();
  // Include string literals, so dynamically selected course/action icons are covered too.
  for (const file of ['index.html','subject.html',...sources(path.join(root,'js'))].map(file=>path.resolve(root,file))) {
    for (const [name] of fs.readFileSync(file,'utf8').matchAll(/\b[a-z]+(?:-[a-z0-9]+)*\b/g)) {
      const exported=name.replace(/(^|-)(\w)/g,(_,prefix,letter)=>letter.toUpperCase());
      if (available[exported]) names.add(exported);
    }
  }
  const icons=[...names].sort();
  const contents=`import {createIcons as render, ${icons.join(',')}} from 'lucide';
    const icons={${icons.join(',')}};
    export function createIcons(options={}) {render({icons,...options});}
    export {icons};`;
  buildSync({stdin:{contents,resolveDir:root,sourcefile:'portal-icons.mjs'},bundle:true,format:'iife',globalName:'lucide',platform:'browser',target:'es2020',minify:true,charset:'utf8',legalComments:'eof',outfile:path.join(root,'js/vendor/lucide.min.js')});
  console.log(`Lucide: ${icons.length} runtime icons, ${fs.statSync(path.join(root,'js/vendor/lucide.min.js')).size} bytes`);
}
module.exports={buildIcons};
