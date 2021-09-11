const fs = require("fs");
const path = require("path");

const dir = fs.readdirSync(path.join(__dirname, "resources"));

fs.writeFileSync(
  "resources.js",
  `const resources = [${dir.map((x) => `"${x}"`).join(", ")}]`
);
