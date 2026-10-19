const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('/home/node/.n8n/database.sqlite');

const workflows = db.prepare('SELECT id, nodes FROM workflow_entity').all();

for (const row of workflows) {
  let nodes = JSON.parse(row.nodes);

  for (let node of nodes) {
    if (node.name && node.name.includes('Gemini')) {
      if (!node.parameters) node.parameters = {};
      node.parameters.queryParameters = {
        parameters: [
          { name: 'key', value: process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY' }
        ]
      };
    }
    if (node.name && node.name.includes('GitHub')) {
      if (!node.parameters) node.parameters = {};
      node.parameters.authentication = 'none';
      delete node.parameters.genericAuthType;
      node.parameters.headerParameters = {
        parameters: [
          { name: 'Accept', value: 'application/vnd.github.v3+json' },
          { name: 'Authorization', value: `Bearer ${process.env.GITHUB_TOKEN || 'YOUR_GITHUB_TOKEN'}` }
        ]
      };
    }
    if (node.name && node.name.includes('Google Drive')) {
      node.continueOnFail = true;
    }
  }

  db.prepare('UPDATE workflow_entity SET nodes = ?, active = 1 WHERE id = ?').run(JSON.stringify(nodes), row.id);
  console.log('Fixed workflow:', row.id);
}

console.log('ALL WORKFLOWS ACTIVATED AND FIXED!');
