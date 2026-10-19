const fs = require("fs");
const path = require("path");

const v = process.argv[2] || Date.now().toString();
const root = path.resolve(__dirname, "..");

for (const f of ["index.html", "subject.html"]) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) continue;
  let s = fs.readFileSync(p, "utf8");

  // Use function replacer to safely avoid PowerShell/regex $1 evaluation issues
  s = s.replace(/(src="js\/[a-zA-Z0-9_-]+\.js)(?:\?v=[^"]*)?"/g, (match, prefix) => `${prefix}?v=${v}"`);
  s = s.replace(/(href="css\/style\.css)(?:\?v=[^"]*)?"/g, (match, prefix) => `${prefix}?v=${v}"`);

  fs.writeFileSync(p, s, "utf8");
  const count = (s.match(new RegExp(`\\?v=${v}"`, "g")) || []).length;
  console.log(`${f}: ${count} refs versioned with ?v=${v}`);
}
