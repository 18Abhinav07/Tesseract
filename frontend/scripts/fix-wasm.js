// scripts/fix-wasm.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// '\0' and '\u0000' both get constant-folded by SWC → illegal `proving\00`
// String.fromCharCode(0) is a runtime function call — SWC CANNOT fold it
// → template stays dynamic → valid JS → new chunk hash → CDN cache bypassed
const TARGET      = "`proving${'\\0'}0`";
const REPLACEMENT = "`proving${String.fromCharCode(0)}0`";

console.log("[fix-wasm] Searching for all copies of bundle-polkadot-util-crypto.js...");

let files = [];
try {
  const result = execSync(
    `find node_modules -name "bundle-polkadot-util-crypto.js"`,
    { encoding: "utf8" }
  ).trim();
  files = result.split("\n").filter(Boolean);
} catch (e) {
  console.log("[fix-wasm] find command failed. Skipping.");
  process.exit(0);
}

let patchedCount = 0;

for (const file of files) {
  try {
    const content = fs.readFileSync(file, "utf8");
    if (content.includes(REPLACEMENT)) {
      console.log(`[fix-wasm] Already patched: ${file}`);
      continue;
    }
    if (!content.includes(TARGET)) {
      // It might have been patched by my previous weird script, continue gracefully
      continue;
    }
    fs.writeFileSync(file, content.replace(TARGET, REPLACEMENT));
    console.log(`[fix-wasm] ✅ Patched: ${file}`);
    patchedCount++;
  } catch (e) {
    console.error(`[fix-wasm] Error processing ${file}: ${e.message}`);
  }
}

console.log(`[fix-wasm] Done. ${patchedCount} file(s) patched.`);
process.exit(0);