
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const sourcePublic = path.join(root, "apps/admin/public");
const sourceStatic = path.join(root, "apps/admin/.next/static");

const standaloneApp = path.join(
  root,
  "apps/admin/.next/standalone/apps/admin"
);

const destinationPublic = path.join(standaloneApp, "public");
const destinationStatic = path.join(standaloneApp, ".next/static");

if (!fs.existsSync(path.join(standaloneApp, "server.js"))) {
  throw new Error("Admin standalone server.js was not found.");
}

if (fs.existsSync(sourcePublic)) {
  fs.cpSync(sourcePublic, destinationPublic, {
    recursive: true,
    force: true,
  });
}

if (!fs.existsSync(sourceStatic)) {
  throw new Error("Admin Next.js static assets folder was not found.");
}

fs.cpSync(sourceStatic, destinationStatic, {
  recursive: true,
  force: true,
});

console.log("Admin public assets copied successfully.");
console.log("Admin Next.js static assets copied successfully.");
