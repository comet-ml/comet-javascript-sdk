# JavaScript SDK for Comet

## Documentation

See the [SDK reference](docs/api.md) and the Comet [REST API documentation](https://www.comet.com/docs/v2/api-and-sdk/rest-api/overview/).

## Installation

From npm, for Node (18+) or a bundler:

```
npm install @comet-ml/javascript-sdk
```

```js
const { API } = require('@comet-ml/javascript-sdk');

const api = new API(process.env.COMET_API_KEY);
api.workspaces().then(names => console.log(names));
```

In a browser, as a `<script>` tag defining the global `Comet`. The package
ships the browser bundle as `build/comet-javascript-sdk.js`, so any npm CDN
serves it:

```html
<script src="https://cdn.jsdelivr.net/npm/@comet-ml/javascript-sdk@2.0.0"></script>
```

Releases up to 1.1.24 were published only to Comet's own CDN (e.g.
`https://cdn.comet.ml/js/comet-javascript-sdk-1.1.24.js`); releases from 2.0.0
are on npm only.

## Using the SDK in JavaScript panels

Comet's JavaScript panels include this SDK (the Comet app embeds the browser
bundle in each panel) and construct your panel (a class extending `Comet.Panel`) with a **project
token**, not your API key. A project token can read the panel's own project
and its experiments, and the panel's store. Methods that list workspaces and
projects or act as the user (`workspaces()`, `projects()`, `get()` and
`get(workspace)`, `accountDetails()`, `experimentStop()`) need a user API key
and are refused inside panels. See [docs/api.md](docs/api.md).

## Local Development

Development needs Node 22 (`.nvmrc` pins the exact version CI and releases use); the built library runs on Node 18+
and current browsers.

```
git clone git@github.com:comet-ml/comet-javascript-sdk
cd comet-javascript-sdk
npm install
```

| Command | What it does |
|---|---|
| `npm test` | Unit tests: every API method against a stubbed `fetch`. No network or key. |
| `npm run test:integration` | Tests against a live Comet server. Skipped unless `COMET_API_KEY` is set. |
| `npm run test:bundle` | Builds the browser bundle and runs a panel through it, as the Comet app does. |
| `npm run test:package` | Packs the npm package (without publishing), checks its files, and installs and loads it. |
| `npm run cover` | Unit tests with coverage. |
| `npm run lint` / `npm run format` | ESLint / Prettier. |
| `npm run build` | Builds `lib/` (the npm package's CommonJS build). |
| `npm run pack` | Builds `build/comet-javascript-sdk.js` (the browser bundle, global `Comet`). |
| `npm run docs` | Regenerates `docs/api.md` from the JSDoc in `src/api.js`. |
| `npm run examples` | Serves `examples/chart.html`; pass `?projectId=...&experimentKeys=...` in its URL, and enter your API key when asked. |

### Integration tests

The integration tests read an experiment on a live Comet server (comet.com by
default) and are skipped until these are set:

| Variable | |
|---|---|
| `COMET_API_KEY` | API key of a user who can read the test project |
| `COMET_TEST_WORKSPACE` | workspace of the test project |
| `COMET_TEST_PROJECT` | name of the test project |
| `COMET_TEST_PROJECT_ID` | id of the test project |
| `COMET_TEST_EXPERIMENT_KEY` | the experiment made by `experiment.py` |
| `COMET_URL` | (optional) server, default `https://www.comet.com/` |
| `COMET_PROJECT_TOKEN` | (optional) a project token for the project, to test panel access |

To set up, run `test/integration/experiment.py` (see the comment at its top);
it prints the `COMET_TEST_*` values. Don't edit that experiment or the
project's notes: the tests check the exact values it logs.

In CI, `COMET_API_KEY` is a secret of the `integration` environment
(Settings → Environments; give it protection rules such as required
reviewers) and the `COMET_TEST_*` values are repository variables (Settings →
Secrets and variables → Actions).

A project token can be copied from the browser's network tab
(`POST /api/token/projects`) while viewing a panel; it expires, so it is for
local runs only.

### Pull-Request process

1. Create a branch with your changes
2. Once you are happy with your changes and the tests are green, run `npm run pack` and `npm run docs`, then commit `build/comet-javascript-sdk.js` and `docs/api.md`.
3. Push it on Github.
4. Once reviewed, merge it on master. Nothing is uploaded when merged on master.

### Release

1. In a pull request, set the new version:
   `npm version <MAJOR.MINOR.PATCH> --no-git-tag-version` (updates
   `package.json` and `package-lock.json`). Merge it.
2. Tag the merged commit on master with that version, plain `2.0.0` (not
   `v2.0.0`), and push the tag:
   `git checkout master && git pull && git tag 2.0.0 && git push origin 2.0.0`.

The tag starts `.github/workflows/release.yml`: it checks the tag is on
master, matches `package.json`, and that `build/` and `docs/` are up to date,
then runs the tests and publishes the package to npm. It runs in the `npm`
environment, which requires an approval, and authenticates with npm trusted
publishing (or an `NPM_TOKEN` secret).

The Comet app takes the new bundle with `npm run sync-frontend` (see
`scripts/sync-frontend.js`).
