const fs = require('fs');
const path = require('path');

const packagesToFix = [
  '@polkadot/wasm-bridge',
  '@polkadot/wasm-crypto',
  '@polkadot/wasm-crypto-asmjs',
  '@polkadot/wasm-crypto-wasm'
];

function fixOctalEscapes(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('\\00')) {
    const fixedContent = content
      .replace(/\\00/g, '\\x00')
      .replace(/\\07/g, '\\x07')
      .replace(/\\01/g, '\\x01')
      .replace(/\\02/g, '\\x02')
      .replace(/\\03/g, '\\x03')
      .replace(/\\04/g, '\\x04')
      .replace(/\\05/g, '\\x05')
      .replace(/\\06/g, '\\x06');
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`[fix-polkadot-wasm] Fixed octal escapes in ${filePath}`);
  }
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.cjs') || entry.name.endsWith('.mjs'))) {
      fixOctalEscapes(fullPath);
    }
  }
}

console.log('[fix-polkadot-wasm] Scanning @polkadot packages for octal escapes...');

packagesToFix.forEach(pkg => {
  const pkgDir = path.join(__dirname, '..', 'node_modules', pkg);
  processDirectory(pkgDir);
});

console.log('[fix-polkadot-wasm] Done.');
