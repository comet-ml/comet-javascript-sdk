// scripts/release-tag.sh, which picks the tag Jenkins releases (and uploads
// to the CDN) from: run against a scratch git repository per case.
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SCRIPT = path.resolve(__dirname, '../../scripts/release-tag.sh');

const git = (cwd, ...args) =>
  execFileSync(
    'git',
    ['-c', 'user.name=test', '-c', 'user.email=test@example.com', ...args],
    { cwd, stdio: 'pipe' }
  );

// [description, tags on HEAD, tags on the previous commit, released tag]
// prettier-ignore
const CASES = [
  ['a release tag', ['1.2.0'], [], '1.2.0'],
  ['no tags', [], [], ''],
  ['a v-prefixed tag', ['v1.2.0'], [], ''],
  ['a pre-release suffix', ['1.2.0-rc1'], [], ''],
  ['two components', ['1.2'], [], ''],
  ['a non-numeric component', ['1.x.0'], [], ''],
  ['a release tag sorting before another tag', ['1.2.0', 'zz-marker'], [], '1.2.0'],
  ['several release tags, by version not text', ['1.9.0', '1.10.0'], [], '1.10.0'],
  ['a release tag on an earlier commit only', [], ['1.2.0'], '']
];

describe('scripts/release-tag.sh', () => {
  let repo;

  beforeEach(() => {
    repo = fs.mkdtempSync(path.join(os.tmpdir(), 'release-tag-'));
    git(repo, 'init', '--quiet');
  });

  afterEach(() => fs.rmSync(repo, { recursive: true, force: true }));

  CASES.forEach(([description, headTags, earlierTags, expected]) => {
    it(`${description} -> ${expected ? `releases ${expected}` : 'no release'}`, () => {
      git(repo, 'commit', '--quiet', '--allow-empty', '-m', 'earlier');
      earlierTags.forEach(tag => git(repo, 'tag', tag));
      git(repo, 'commit', '--quiet', '--allow-empty', '-m', 'head');
      headTags.forEach(tag => git(repo, 'tag', tag));

      const tag = execFileSync('sh', [SCRIPT], { cwd: repo, encoding: 'utf8' });

      assert.equal(tag.trim(), expected);
    });
  });

  // If git can't list the tags, Jenkins must fail, not skip the release.
  const runFailing = (cwd, env = {}) => {
    const result = spawnSync('sh', [SCRIPT], {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, ...env }
    });
    assert.notEqual(result.status, 0);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /could not list the tags on HEAD/);
  };

  it('fails, with an error, in a repository with no commit', () => {
    runFailing(repo);
  });

  it('fails, with an error, outside a git repository', () => {
    const plain = fs.mkdtempSync(path.join(os.tmpdir(), 'release-tag-'));
    try {
      // stop git looking for a repository above the scratch directory
      runFailing(plain, { GIT_CEILING_DIRECTORIES: path.dirname(plain) });
    } finally {
      fs.rmSync(plain, { recursive: true, force: true });
    }
  });
});
