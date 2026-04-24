const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'node_modules/@frostoven/libsquoosh/build/index.js');
let code = fs.readFileSync(file, 'utf8');

// Replace fetch with a custom file-reading fetch wrapper for local files
const fetchPolyfill = `(async function(url, options) {
  if (typeof url === 'string' && url.startsWith('/')) { url = 'file://' + url; }
  const isFile = (typeof url === 'string' && url.startsWith('file://')) || (url instanceof URL && url.protocol === 'file:');
  if (isFile) {
    const fs = await import('fs/promises');
    const pathUrl = url instanceof URL ? url : new URL(url);
    try {
      const buf = await fs.readFile(pathUrl);
      return { arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) };
    } catch(e) {
      throw e;
    }
  }
  return globalThis.fetch(url, options);
})`;

code = code.replace(/fetch\(/g, fetchPolyfill + '(');
fs.writeFileSync(file, code);
