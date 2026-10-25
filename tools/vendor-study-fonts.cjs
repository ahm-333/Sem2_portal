// Explicit maintenance command, never run during builds. Mirror the existing Google Fonts responses.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
async function download(url){const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'}});if(!response.ok)throw new Error(`${response.status}: ${url}`);return Buffer.from(await response.arrayBuffer());}
async function main(){
  const folder=path.join(root,'css/fonts/study');fs.mkdirSync(folder,{recursive:true});
  const catalog={};
  const previous=fs.existsSync(path.join(folder,'sources.json'))?JSON.parse(fs.readFileSync(path.join(folder,'sources.json'),'utf8')):{};
  for(const course of ['arch','db','ds'])for(const name of fs.readdirSync(path.join(root,'study',course)).filter(file=>file.endsWith('.html'))){
    const file=path.join(root,'study',course,name);let html=fs.readFileSync(file,'utf8');
    const local=html.match(/<link href="\.\.\/\.\.\/css\/fonts\/study\/([a-f0-9]+)\.css" rel="stylesheet">/);
    const remote=html.match(/<link href="(https:\/\/fonts\.googleapis\.com\/[^"]+)" rel="stylesheet">/);
    const match=remote || (local && [local[0],previous[local[1]]?.source]);
    if(!match || !match[1])continue;
    const key=crypto.createHash('sha256').update(match[1]).digest('hex').slice(0,12);
    if(!catalog[key]){
      let css=(await download(match[1])).toString('utf8');
      for(const url of new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(value=>value[1]))){
        const bytes=await download(url),filename=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,20)+'.woff2';
        fs.writeFileSync(path.join(folder,filename),bytes);css=css.replaceAll(url,filename);
      }
      fs.writeFileSync(path.join(folder,key+'.css'),css);
      catalog[key]={source:match[1],stylesheet:key+'.css'};
    }
    html=html.replace(match[0],`<link href="../../css/fonts/study/${key}.css" rel="stylesheet">`).replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.(?:googleapis|gstatic)\.com"(?: crossorigin)?>/g,'');
    fs.writeFileSync(file,html);
  }
  for(const family of ['cairo','tajawal','jetbrainsmono','inter'])fs.writeFileSync(path.join(folder,family+'-OFL.txt'),await download(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`));
  fs.writeFileSync(path.join(folder,'sources.json'),JSON.stringify(catalog,null,2)+'\n');
  const used=Object.values(catalog).map(item=>fs.readFileSync(path.join(folder,item.stylesheet),'utf8')).join('\n');
  for(const file of fs.readdirSync(folder))if(/^[a-f0-9]{20}\.woff2$/.test(file)&&!used.includes(file))fs.unlinkSync(path.join(folder,file));
  console.log(`Mirrored ${Object.keys(catalog).length} existing font stylesheets; family/weight/subset settings retained.`);
}
main().catch(error=>{console.error(error);process.exitCode=1;});
