import assert from 'node:assert/strict';
import {
  apiKey,
  binaryAssetName,
  experimentKey,
  jsonAssetName,
  metricName,
  missing,
  paramName,
  projectId,
  projectName,
  projectNotes,
  projectToken,
  tagName,
  url,
  workspaceName
} from './config.js';
import * as Comet from '../../src/index.js';

// Fetch an asset by name, or skip when the experiment predates experiment.py
// logging it.
const assetOrSkip = async (test, api, fileName) => {
  const assets = await api.experimentAssets(experimentKey);
  const asset = assets.find(a => a.fileName === fileName);

  if (!asset) {
    console.warn(
      `  ${fileName} not logged; re-run test/integration/experiment.py`
    );
    test.skip();
  }

  return asset;
};

describe('Comet.API against a live server (user API key)', function () {
  let api;

  before(function () {
    if (missing.length) {
      console.warn(`  Skipping: set ${missing.join(', ')} (see README)`);
      this.skip();
    }

    Comet.config.url = url;
    api = new Comet.API(apiKey);
  });

  it('has version v2', () => {
    assert.equal(api.getVersion(), 'v2');
  });

  it('fetches the account details', async () => {
    const details = await api.accountDetails();

    assert.equal(typeof details.userName, 'string');
  });

  it('fetches workspaces, directly and with get()', async () => {
    assert.ok((await api.workspaces()).includes(workspaceName));
    assert.ok((await api.get()).includes(workspaceName));
  });

  it('fetches projects, directly and with get(ws)', async () => {
    for (const projects of [
      await api.projects(workspaceName),
      await api.get(workspaceName)
    ]) {
      assert.equal(
        projects.filter(p => p.projectName === projectName).length,
        1
      );
    }
  });

  it('fetches experiments by project name, id, and get(ws/proj)', async () => {
    const byName = await api.experimentsByProjectName(
      workspaceName,
      projectName
    );
    const byId = await api.experimentsByProjectId(projectId);
    const keys = await api.get(`${workspaceName}/${projectName}`);

    assert.ok(byName.some(e => e.experimentKey === experimentKey));
    assert.ok(byId.some(e => e.experimentKey === experimentKey));
    assert.ok(keys.includes(experimentKey));
  });

  it('fetches archived experiments as a separate list', async () => {
    const archived = await api.experimentsByProjectId(projectId, true);

    assert.ok(Array.isArray(archived));
    assert.ok(!archived.some(e => e.experimentKey === experimentKey));
  });

  it('fetches one experiment with get(ws/proj/key)', async () => {
    const experiment = await api.get(
      `${workspaceName}/${projectName}/${experimentKey}`
    );

    assert.equal(experiment.experimentKey, experimentKey);
    assert.equal(
      await api.get(`${workspaceName}/no-such-project/${experimentKey}`),
      undefined
    );
  });

  it('names an unknown project in the error', async () => {
    await assert.rejects(
      api.experimentsByProjectName(workspaceName, 'no-such-project-js-sdk'),
      { message: /No such project named no-such-project-js-sdk/, status: 404 }
    );
  });

  it('fetches project metadata by id and by name', async () => {
    const byId = await api.projectMetadata(projectId);
    const byName = await api.projectMetadataByName(workspaceName, projectName);

    assert.equal(byId.projectId, projectId);
    assert.equal(byName.projectId, projectId);
  });

  it('fetches project notes and columns', async () => {
    assert.equal(await api.projectNotes(projectId), projectNotes);

    const columns = await api.projectColumns(projectId);
    // The server refreshes a project's columns on its own schedule, so a new
    // experiment's metrics can be missing for a while; check the shape.
    assert.ok(columns.some(c => c.name === 'experimentKey'));
    columns.forEach(c => assert.equal(typeof c.source, 'string'));
  });

  it('fetches experiment metadata and name', async () => {
    const metadata = await api.experimentMetadata(experimentKey);

    assert.equal(metadata.experimentKey, experimentKey);
    assert.equal(await api.experimentName(experimentKey), 'JS SDK');
    assert.equal(await api.experimentName(experimentKey, 2), 'JS');
  });

  it('fetches experiment html, code, output, and graph', async () => {
    assert.equal(
      await api.experimentHtml(experimentKey),
      '<h1>Hello World!</h1>'
    );

    for (const value of [
      await api.experimentCode(experimentKey),
      await api.experimentOutput(experimentKey),
      await api.experimentGraph(experimentKey)
    ]) {
      assert.ok(value === null || typeof value === 'string');
    }
  });

  it('fetches system details and installed packages', async () => {
    const details = await api.experimentSystemDetails(experimentKey);

    assert.equal(details.experimentKey, experimentKey);
    assert.ok(
      Array.isArray(await api.experimentInstalledPackages(experimentKey))
    );
  });

  it('fetches the experiment color and tags', async () => {
    assert.match(await api.experimentColor(experimentKey), /^#/);
    assert.deepEqual(await api.experimentTags(experimentKey), [tagName]);
  });

  it('fetches parameters', async () => {
    const parameters = await api.experimentParameters(experimentKey);
    const parameter = await api.experimentParameters(experimentKey, paramName);

    assert.ok(parameters.some(p => p.name === paramName));
    assert.equal(parameter.valueCurrent, '50');
  });

  it('fetches metrics: summary, one metric, all metrics, and for a chart', async () => {
    const summary = await api.experimentMetricsSummary(
      experimentKey,
      metricName
    );
    const metric = await api.experimentMetric(experimentKey, metricName);
    const all = await api.experimentMetrics(experimentKey);
    const chart = await api.experimentMetricsForChart(
      [experimentKey],
      [metricName],
      [paramName]
    );

    assert.equal(Number(summary.valueCurrent), 100);
    assert.equal(metric.length, 1);
    assert.equal(Number(metric[0].metricValue), 100);
    assert.ok(all.some(m => m.metricName === metricName));
    assert.equal(chart[experimentKey].empty, false);
    assert.equal(chart[experimentKey].params[paramName], '50');
  });

  it('fetches log-other values', async () => {
    const others = await api.experimentOther(experimentKey);

    assert.ok(others.some(o => o.name === 'finished'));
    assert.equal(await api.experimentOther(experimentKey, 'finished'), 'true');
    assert.equal(
      typeof (await api.experimentOther(
        experimentKey,
        'finished',
        'timestampCurrent'
      )),
      'number'
    );
  });

  it('fetches assets: list, details, by name as JSON, and images', async () => {
    const assets = await api.experimentAssets(experimentKey);
    const asset = assets.find(a => a.fileName === jsonAssetName);
    const details = await api.experimentAssetDetails(
      experimentKey,
      asset.assetId
    );

    assert.equal(details.assetId, asset.assetId);
    assert.deepEqual(
      await api.experimentAssetByName(experimentKey, jsonAssetName, 'json'),
      { key: 'value' }
    );
    assert.ok(Array.isArray(await api.experimentImages(experimentKey)));
  });

  it('fetches a binary asset', async function () {
    const asset = await assetOrSkip(this, api, binaryAssetName);
    const data = await api.experimentAsset(
      experimentKey,
      asset.assetId,
      'binary'
    );

    assert.ok(data instanceof ArrayBuffer);
    assert.equal(data.byteLength, 256);
  });

  it('fetches logged curves, with their steps', async function () {
    const curves = await api.experimentCurves(experimentKey);

    if (curves.length === 0) {
      console.warn('  no curves logged; re-run test/integration/experiment.py');
      this.skip();
    }

    const curve = curves.find(c => c.name === 'some_curve');
    assert.deepEqual(curve.x, [1, 2, 3]);
    assert.deepEqual(curve.y, [4, 5, 6]);
    assert.equal(curve.step, 1);
  });

  it('fetches models and artifacts (none logged)', async () => {
    assert.deepEqual(await api.experimentModels(experimentKey), []);
    assert.deepEqual(await api.experimentArtifacts(experimentKey), []);
  });

  it('reports server errors with their status', async () => {
    await assert.rejects(
      new Comet.API('not-a-real-key').workspaces(),
      error => error.status === 401 || error.status === 403
    );
  });
});

// JavaScript panels get a project token, not a user API key. It can read
// its own project and that project's experiments, and nothing else.
describe('Comet.API against a live server (project token)', function () {
  let api;

  before(function () {
    if (!projectToken || missing.length) this.skip();

    Comet.config.url = url;
    api = new Comet.API(projectToken, projectId, 'integration-test');
  });

  it("reads its project's metadata, experiments, and notes", async () => {
    assert.equal((await api.projectMetadata(projectId)).projectId, projectId);
    assert.ok(
      (await api.get(`${workspaceName}/${projectName}`)).includes(experimentKey)
    );
    assert.equal(
      (await api.get(`${workspaceName}/${projectName}/${experimentKey}`))
        .experimentKey,
      experimentKey
    );
    assert.equal(await api.projectNotes(projectId), projectNotes);
  });

  it("reads its project's experiments", async () => {
    assert.equal(
      (await api.experimentMetadata(experimentKey)).experimentKey,
      experimentKey
    );
    const summary = await api.experimentMetricsSummary(
      experimentKey,
      metricName
    );
    assert.equal(Number(summary.valueCurrent), 100);
    const chart = await api.experimentMetricsForChart(
      [experimentKey],
      [metricName]
    );
    assert.equal(chart[experimentKey].empty, false);
  });

  it('reads and writes the panel store', async () => {
    const value = `stored at ${Date.now()}`;

    await api.store('integration', value);

    const fresh = new Comet.API(projectToken, projectId, 'integration-test');
    assert.equal(await fresh.getFromStore('integration'), value);
  });

  it('is refused the user-level endpoints', async () => {
    await assert.rejects(api.workspaces());
    await assert.rejects(api.projects(workspaceName));
    await assert.rejects(api.accountDetails());
  });
});
