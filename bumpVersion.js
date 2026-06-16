import fs from "fs";

const pkgPath = "./package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

const [major, minor, patch] = pkg.version.split(".").map(Number);
pkg.version = `${major}.${minor}.${patch + 1}`;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

