/**
 * tools/portal_local_listener.js
 * 
 * Lightweight local webhook server that receives approved materials from n8n
 * and automatically updates js/courses-data.js, validates everything, and commits!
 * NO GITHUB TOKENS NEEDED! 100% LOCAL!
 */

const http = require('http');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = 7070;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/update-portal') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log("\n📥 [Local Listener] Received approved material from n8n!");
      
      const tempPayloadPath = path.resolve(__dirname, 'webhook_payload.json');
      fs.writeFileSync(tempPayloadPath, body, 'utf-8');

      try {
        const updaterScript = path.resolve(__dirname, 'add_material_from_webhook.js');
        const output = execSync(`node "${updaterScript}" "${tempPayloadPath}"`, { encoding: 'utf-8' });
        console.log(output);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', message: 'Portal updated successfully!' }));
      } catch (err) {
        console.error("❌ Error updating portal:", err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', error: err.message }));
      } finally {
        if (fs.existsSync(tempPayloadPath)) fs.unlinkSync(tempPayloadPath);
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Portal Local Listener running at http://localhost:${PORT}/update-portal`);
});
