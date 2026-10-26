// Publish only runtime assets. Repository metadata, automation, research and tests stay private.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {transformSync} = require('esbuild');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'dist');
const marker=path.join(output,'.portal-build');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex').slice(0,12);
function walk(directory) {
  return fs.readdirSync(path.join(root,directory),{withFileTypes:true}).flatMap(entry=>{
    if(entry.name.startsWith('.')) return [];
    const file=directory+'/'+entry.name;
    if(entry.isSymbolicLink()) throw new Error('Linked runtime source: '+file);
    return entry.isDirectory()?walk(file):[file];
  });
}
function runtime(file) {
  return /^(?:css|js)\//.test(file) && /(?:\.(?:js|css|woff2?|ttf|svg)|LICENSE|OFL\.txt|GSAP-NOTICE\.txt)$/.test(file)
    || /^materials\//.test(file) && /\.(?:pdf|pptx|png|jpe?g|webp|svg)$/i.test(file)
    || /^study\//.test(file) && /\.(?:html|css|js|png|jpe?g|webp|svg|woff2?)$/i.test(file)
    || /^education-preview\/os\/(?:index\.html|style\.css|(?:lesson|lesson-data|course-catalog|lesson-loader|visuals)\.js|units\/os-\d\d\.js|sources\/(?:ch\d\/)?slide-\d\d\.png)$/.test(file);
}
function write(file,bytes) {
  const target=path.resolve(output,file);
  if(!target.startsWith(output+path.sep))throw new Error('Invalid output: '+file);
  fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);
}
function packageSite() {
  if(fs.existsSync(output)) {
    if(fs.lstatSync(output).isSymbolicLink() || !fs.existsSync(marker)) throw new Error('Refusing to replace an unowned dist directory');
    // output is the checked, fixed dist child of this repository.
    fs.rmSync(output,{recursive:true,force:true});
  }
  fs.mkdirSync(output,{recursive:true});write('.portal-build','sem2-portal static output\n');
  const files=['css','js','materials','study','education-preview/os'].flatMap(walk).filter(runtime);
  for(const file of files)write(file,fs.readFileSync(path.join(root,file)));
  for(const file of ['favicon.svg','favicon.ico','favicon-96x96.png','apple-touch-icon.png','site.webmanifest','web-app-manifest-192x192.png','web-app-manifest-512x512.png'])write(file,fs.readFileSync(path.join(root,file)));
  for(const page of ['index.html','subject.html']) {
    let html=fs.readFileSync(path.join(root,page),'utf8');
    // Only repository-relative scripts belong in our bundle. Platform endpoints
    // such as /_vercel/insights/script.js must stay as separate script tags.
    const scripts=[...html.matchAll(/<script defer src="([^"?]+)(?:\?[^"]*)?"><\/script>/g)].filter(match=>! /^(?:\/|[a-z][\w+.-]*:)/i.test(match[1]));
    const css=[...html.matchAll(/<link rel="stylesheet" href="([^"?]+)(?:\?[^"]*)?">/g)].filter(match=>!match[1].startsWith('css/fonts/'));
    const name=page==='index.html'?'home':'subject';
    const javascript=transformSync(scripts.map(match=>fs.readFileSync(path.join(root,match[1]),'utf8')).join('\n;\n'),{loader:'js',target:'es2020',minify:true,charset:'utf8',legalComments:'eof'}).code;
    const stylesheet=transformSync(css.map(match=>fs.readFileSync(path.join(root,match[1]),'utf8')).join('\n'),{loader:'css',minify:true,legalComments:'inline'}).code;
    const jsFile=`assets/${name}.${hash(javascript)}.js`;
    // assets/ has the same depth as css/, so existing ../favicon.svg URLs retain their meaning.
    const cssFile=`assets/${name}.${hash(stylesheet)}.css`;
    write(jsFile,javascript);write(cssFile,stylesheet);
    scripts.forEach((match,index)=>{html=html.replace(match[0],index===0?`<script defer src="${jsFile}"></script>`:'');});
    css.forEach((match,index)=>{html=html.replace(match[0],index===0?`<link rel="stylesheet" href="${cssFile}">`:'');});
    write(page,html);
    console.log(`${page}: one deferred JS bundle (${Buffer.byteLength(javascript)} bytes), one style bundle (${Buffer.byteLength(stylesheet)} bytes)`);
  }
  console.log(`Static release written to ${output}`);
}
if(require.main===module)packageSite();
module.exports={packageSite,runtime};
