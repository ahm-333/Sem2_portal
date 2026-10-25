const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const sourceRoot = path.resolve(__dirname,'..');
const root = process.env.PORTAL_STATIC_DIR==='dist'?path.join(sourceRoot,'dist'):sourceRoot;
const port = Number(process.env.PORT || 8765);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.png':'image/png','.pdf':'application/pdf','.svg':'image/svg+xml'};
http.createServer((request,response)=>{
  let pathname;
  try {pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);}catch{response.writeHead(400);response.end();return;}
  if(request.method!=='GET'&&request.method!=='HEAD'){response.writeHead(405);response.end();return;}
  if(pathname==='/favicon.ico'){response.writeHead(204);response.end();return;}
  const relative=pathname.replace(/^\/Sem2_portal\//,'/');
  const file=path.resolve(root,'.'+relative+(relative.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)||relative.split('/').some(part=>part.startsWith('.')||['node_modules','automation','tools','tests'].includes(part))){response.writeHead(404);response.end();return;}
  fs.readFile(file,(error,bytes)=>{
    if(error){response.writeHead(404);response.end('Not found');return;}
    response.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
    response.setHeader('Cache-Control','no-cache');
    response.end(request.method==='HEAD'?undefined:bytes);
  });
}).listen(port,'127.0.0.1',()=>console.log(`Portal: http://127.0.0.1:${port}/`));
