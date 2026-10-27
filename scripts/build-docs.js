// Writes docs/api.md: docs/header.md followed by the jsdoc of src/api.js.
const fs = require('fs');
const path = require('path');
const jsdoc2md = require('jsdoc-to-markdown');

const root = path.resolve(__dirname, '..');

// src/api.js declares the class and default-exports it separately, at the
// end: jsdoc documents the methods of an inline `export default class` as
// globals instead of as members of API.
jsdoc2md.render({ files: path.join(root, 'src/api.js') }).then(markdown => {
  const header = fs.readFileSync(path.join(root, 'docs/header.md'), 'utf8');
  // jsdoc2md names an instance by lower-casing the class name's first
  // letter (`apI.getVersion()`); the examples and users write `api`.
  const body = markdown.replace(/\bapI\b/g, 'api');
  fs.writeFileSync(path.join(root, 'docs/api.md'), `${header}\n${body}`);
});
