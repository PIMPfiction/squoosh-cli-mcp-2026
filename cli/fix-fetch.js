const fs = require('fs');
const path = require('path');
const file = path.join(
  __dirname,
  'cli/node_modules/@frostoven/libsquoosh/build/index.js',
);
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  /globalThis\.fetch\(new URL\(e,import\.meta\.url\)\)/g,
  'globalThis.fetch(new URL(e, "file://" + __filename))',
);
code = code.replace(
  /globalThis\.fetch\(new URL\(e,import\.meta\.url\)\)/g,
  'globalThis.fetch("file://" + e)',
);
code = code.replace(
  /fetch\(/g,
  '((url, ...args) => { if (typeof url === "string" && url.startsWith("/")) url = "file://" + url; if (url instanceof URL && url.protocol === "file:") return import("fs/promises").then(fs => fs.readFile(url)).then(buf => ({ arrayBuffer: () => buf })); return fetch(url, ...args); })(',
);
fs.writeFileSync(file, code);
