const fs = require("fs");
const path = require("path");

const resourcesPath = path.join(__dirname, "resources");
const dirList = fs.readdirSync(resourcesPath);
const readList = ["index.html", "style.css", "script.js"];
const fileMap = {};

for (const dir of dirList) {
  for (const target of readList) {
    const filePath = path.join(resourcesPath, dir, target);
    fileMap[dir] ??= {};
    const file = fs.readFileSync(filePath, { encoding: "utf-8" });
    fileMap[dir][target.split(".")[1]] = file;
  }
}

fs.writeFileSync(
  "resources.js",
  `const resources = [${dirList.map((x) => `"${x}"`).join(", ")}];
  const fileMap = ${JSON.stringify(fileMap)};`
);
