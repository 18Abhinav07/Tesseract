// scripts/fix-wasm.js
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const TARGET      = "`proving${'\\0'}0`";
const REPLACEMENT = "`proving${String.fromCharCode(0)}0`";

console.log("[fix-wasm] Searching for the octal string in @scure/sr25519 and @polkadot/util-crypto...");

function findJsFiles(dir, fileList = []) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === ".git" || file === "node_modules") continue;
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findJsFiles(fullPath, fileList);
      } else if (file.endsWith(".js") || file.endsWith(".ts")) {
        fileList.push(fullPath);
      }
    }
  } catch (e) {
    // Ignore permissions or missing dirs
  }
  return fileList;
}

let files = [];
const scurePath = path.join(root, "node_modules", "@scure", "sr25519");
if (fs.existsSync(scurePath)) {
  files = files.concat(findJsFiles(scurePath));
}
const cryptoPath = path.join(root, "node_modules", "@polkadot", "util-crypto");
if (fs.existsSync(cryptoPath)) {
  files = files.concat(findJsFiles(cryptoPath));
}

console.log(`[fix-wasm] Found ${files.length} candidate file(s).`);

let patchedCount = 0;
for (const fullPath of files) {
  const content = fs.readFileSync(fullPath, "utf8");
  if (content.includes(REPLACEMENT)) { 
    console.log(`[fix-wasm] Already patched: ${fullPath.replace(root, '')}`); 
    continue; 
  }
  if (!content.includes(TARGET)) { 
    continue; 
  }
  fs.writeFileSync(fullPath, content.replace(TARGET, REPLACEMENT));
  console.log(`[fix-wasm] ✅ Patched: ${fullPath.replace(root, '')}`);
  patchedCount++;
}

console.log(`[fix-wasm] Done. ${patchedCount} file(s) patched.`);
process.exit(0);