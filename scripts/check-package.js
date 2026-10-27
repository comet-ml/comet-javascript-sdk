// Checks the npm package without publishing it: packs it (`npm pack`),
// checks which files it holds, then installs the tarball into an empty
// project and loads it the ways users will. Run `npm run build` and
// `npm run pack` first (`npm run test:package` does).
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.resolve(__dirname, '..');
const { name } = require(path.join(root, 'package.json'));
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'comet-package-'));
const npm = (args, cwd) =>
  execFileSync('npm', args, { cwd, encoding: 'utf8', stdio: 'pipe' });

const fail = message => {
  console.error(`check-package: ${message}`);
  process.exitCode = 1;
};

try {
  const [packed] = JSON.parse(
    npm(['pack', '--json', '--pack-destination', tmpDir], root)
  );
  const files = packed.files.map(f => f.path);

  for (const required of [
    'package.json',
    'README.md',
    'LICENSE',
    'lib/index.js',
    'lib/api.js',
    'build/comet-javascript-sdk.js',
    'src/index.js'
  ]) {
    if (!files.includes(required)) fail(`missing ${required}`);
  }

  for (const file of files) {
    if (/^(test|scripts|webpack|examples|docs|\.github)\//.test(file)) {
      fail(`should not ship ${file}`);
    }
  }

  const project = path.join(tmpDir, 'project');
  fs.mkdirSync(project);
  fs.writeFileSync(path.join(project, 'package.json'), '{"private": true}');
  npm(
    ['install', '--no-audit', '--no-fund', path.join(tmpDir, packed.filename)],
    project
  );

  // CommonJS, as Node users load it
  const loaded = execFileSync(
    'node',
    [
      '-e',
      `const C = require('${name}');` +
        "console.log(typeof C.API, typeof C.Panel, new C.API('k').getVersion())"
    ],
    { cwd: project, encoding: 'utf8' }
  ).trim();
  if (loaded !== 'function function v2') fail(`require() gave: ${loaded}`);

  // The browser bundle, as the Comet frontend embeds it
  const bundle = require.resolve(`${name}/build/comet-javascript-sdk.js`, {
    paths: [project]
  });
  if (!fs.readFileSync(bundle, 'utf8').startsWith('var Comet')) {
    fail('the bundle does not define the global Comet');
  }

  console.log(
    `${packed.filename}: ${files.length} files, ` +
      `${Math.round(packed.size / 1024)} KB packed`
  );
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
