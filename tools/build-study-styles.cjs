const fs=require('node:fs'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const {transformSync}=require('esbuild');
function buildStudyStyles(root){
  const config={content:[],safelist:[],theme:{extend:{}}};
  // Group pages with the same original CDN configuration; CSS still loads before the page paints.
  const groups=new Map();
  for(const folder of ['arch','db','ds'])for(const name of fs.readdirSync(path.join(root,'study',folder)).filter(file=>file.endsWith('.html'))){
    const file=`study/${folder}/${name}`,html=fs.readFileSync(path.join(root,file),'utf8');
    if(!html.includes('../../css/study/'))continue;
    const metadata=html.match(/<script type="application\/json" data-study-tailwind>(.*?)<\/script>/)?.[1] || '{}';
    const key=metadata;
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push({file,output:`css/study/${folder}-${name.replace('.html','.css')}`});
  }
  const temp=path.join(root,'node_modules/.cache/portal-study-styles');fs.mkdirSync(temp,{recursive:true});
  fs.mkdirSync(path.join(root,'css/study'),{recursive:true});
  const input=path.join(temp,'input.css');fs.writeFileSync(input,'@tailwind base;@tailwind components;@tailwind utilities;');
  let index=0;
  for(const [metadata,pages] of groups){
    const output=path.join(temp,`styles-${index}.css`),configFile=path.join(temp,`config-${index++}.json`);
    fs.writeFileSync(configFile,JSON.stringify({...config,...JSON.parse(metadata),content:pages.map(page=>path.join(root,page.file))}));
    const result=spawnSync(process.execPath,[require.resolve('tailwindcss/lib/cli.js'),'-c',configFile,'-i',input,'-o',output],{cwd:root,stdio:'pipe'});
    if(result.status!==0)throw new Error(result.stderr.toString());
    // Keep exact RGB values; Tailwind's optional color optimizer rounds some translucent colors.
    const css=transformSync(fs.readFileSync(output,'utf8'),{loader:'css',minifyWhitespace:true,minifyIdentifiers:true,charset:'utf8',legalComments:'eof'}).code;
    for(const page of pages)fs.writeFileSync(path.join(root,page.output),css);
  }
  console.log(`Study pages: ${[...groups.values()].flat().length} static stylesheets; no runtime Tailwind compiler`);
}
module.exports={buildStudyStyles};
