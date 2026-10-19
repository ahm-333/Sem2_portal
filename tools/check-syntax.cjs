const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname,'..');
function files(directory) {
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
    if(entry.name==='vendor')return [];
    const file=path.join(directory,entry.name);
    return entry.isDirectory()?files(file):/\.(?:c?js)$/.test(file)?[file]:[];
  });
}
let count=0;
for(const file of [...files(path.join(root,'js')),...files(path.join(root,'tests')),...fs.readdirSync(path.join(root,'tools')).filter(x=>x.endsWith('.cjs')).map(x=>path.join(root,'tools',x))]) {
  const result=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});
  if(result.status!==0)process.exit(result.status||1);
  count++;
}
console.log(`Syntax checked: ${count} files`);
