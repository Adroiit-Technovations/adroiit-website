const fs = require("fs");
const path = require("path");

const root = path.join(process.cwd(), "apps", "admin");

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== ".next") {
        files.push(...walk(fullPath));
      }
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

const files = walk(root).filter((file) =>
  /\.(ts|tsx)$/.test(file)
);

let changed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  // Old certificate routes -> actual Admin routes
  content = content.replaceAll(
    "/admin/certificates/events",
    "/events"
  );

  content = content.replaceAll(
    "/admin/certificates/logs",
    "/certifier/logs"
  );

  content = content.replaceAll(
    "/admin/certificates",
    "/certifier/certificates"
  );

  // Remove old /admin prefix
  content = content.replaceAll(
    "/admin/",
    "/"
  );

  // Exact /admin route
  content = content.replaceAll(
    '"/admin"',
    '"/"'
  );

  // Template literal routes
  content = content.replaceAll(
    "`/admin/",
    "`/"
  );

  if (content !== original) {
    fs.writeFileSync(file, content, "utf8");
    changed++;
    console.log("Updated:", path.relative(process.cwd(), file));
  }
}

console.log("");
console.log(`Finished. Updated ${changed} file(s).`);
