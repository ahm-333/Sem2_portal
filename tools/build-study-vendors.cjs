const fs=require('node:fs'),path=require('node:path');
function copy(source,target){fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(source,target);}
function buildStudyVendors(root){
  const mermaid=path.dirname(require.resolve('mermaid'));
  copy(path.join(mermaid,'mermaid.min.js'),path.join(root,'js/vendor/mermaid/mermaid.min.js'));
  // The npm package omits its license file; the upstream release license is tracked beside this bundle.
  const icons=path.dirname(require.resolve('@fortawesome/fontawesome-free/package.json'));
  copy(path.join(icons,'css/all.min.css'),path.join(root,'css/vendor/fontawesome/css/all.min.css'));
  copy(path.join(icons,'LICENSE.txt'),path.join(root,'css/vendor/fontawesome/LICENSE'));
  for(const file of fs.readdirSync(path.join(icons,'webfonts')).filter(name=>/\.(?:woff2|ttf)$/.test(name)))copy(path.join(icons,'webfonts',file),path.join(root,'css/vendor/fontawesome/webfonts',file));
}
module.exports={buildStudyVendors};
