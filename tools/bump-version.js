const fs = require("fs");
const v = process.argv[2] || "2";
for (const f of ["index.html", "subject.html"]) {
  const p = "c:/Users/HP/OneDrive/Desktop/Sem2_portal/" + f;
  let s = fs.readFileSync(p, "utf8");
  s = s.replace(/(src="js\/[a-z-]+\.js)(\?v=[\w]+)?"/g, `$1?v=${v}"`);
  s = s.replace(/(href="css\/style\.css)(\?v=[\w]+)?"/g, `$1?v=${v}"`);
  fs.writeFileSync(p, s, "utf8");
  console.log(f, (s.match(new RegExp(`\\?v=${v}"`, "g")) || []).length, "refs versioned");
}
