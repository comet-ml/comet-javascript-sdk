import assert from 'node:assert/strict';
import * as Comet from '../../src/index.js';
import { makeResponse, stubFetch } from './fetchStub.js';

const KEY = 'test-api-key';
const EK = 'experiment-key';

const queryOf = call => Object.fromEntries(call.query.entries());

// [method, args, endpoint, expected query, response body, expected result]
// prettier-ignore
const GET_CASES = [
  ['workspaces', [], 'workspaces', {}, { workspaceNames: ['ws'] }, ['ws']],
  ['accountDetails', [], 'account-details', {}, { userName: 'u' }, { userName: 'u' }],
  ['projects', ['ws'], 'projects', { workspaceName: 'ws' }, { projects: [1] }, [1]],
  ['projectNotes', ['pid'], 'project/notes', { projectId: 'pid' }, { notes: '# n' }, '# n'],
  ['projectMetadata', ['pid'], 'project', { projectId: 'pid' }, { projectId: 'pid' }, { projectId: 'pid' }],
  ['projectMetadataByName', ['ws', 'proj'], 'project', { workspaceName: 'ws', projectName: 'proj' }, { projectId: 'pid' }, { projectId: 'pid' }],
  ['projectColumns', ['pid'], 'project/column-names', { projectId: 'pid' }, { columns: [{ name: 'loss' }] }, [{ name: 'loss' }]],
  ['experimentsByProjectId', ['pid'], 'experiments', { projectId: 'pid', archived: 'false' }, { experiments: [1] }, [1]],
  ['experimentsByProjectId', ['pid', true], 'experiments', { projectId: 'pid', archived: 'true' }, { experiments: [1] }, [1]],
  ['experimentsByProjectName', ['ws', 'proj'], 'experiments', { workspaceName: 'ws', projectName: 'proj', archived: 'false' }, { experiments: [1] }, [1]],
  ['experimentMetadata', [EK], 'experiment/metadata', { experimentKey: EK }, { experimentKey: EK }, { experimentKey: EK }],
  ['experimentTags', [EK], 'experiment/tags', { experimentKey: EK }, { tags: ['t'] }, ['t']],
  ['experimentColor', [EK], 'experiment/color', { experimentKey: EK }, { color: '#fff' }, '#fff'],
  ['experimentGitMetadata', [EK], 'experiment/git/metadata', { experimentKey: EK }, { branch: 'main' }, { branch: 'main' }],
  ['experimentCloudDetails', [EK], 'experiment/cloud-details', { experimentKey: EK }, { provider: 'AWS' }, { provider: 'AWS' }],
  ['experimentModels', [EK], 'experiment/model', { experimentKey: EK }, { models: [1] }, [1]],
  ['experimentModelAssets', [EK, 'm'], 'experiment/model/asset/list', { experimentKey: EK, modelName: 'm' }, { assets: [1] }, [1]],
  ['experimentArtifacts', [EK], 'get/artifacts', { experimentKey: EK, filter: 'all' }, { artifactVersions: [1] }, [1]],
  ['experimentArtifacts', [EK, 'input'], 'get/artifacts', { experimentKey: EK, filter: 'input' }, { artifactVersions: [1] }, [1]],
  ['experimentHtml', [EK], 'experiment/html', { experimentKey: EK }, { html: '<b>' }, '<b>'],
  ['experimentCode', [EK], 'experiment/code', { experimentKey: EK }, { code: 'x=1' }, 'x=1'],
  ['experimentOutput', [EK], 'experiment/output', { experimentKey: EK }, { output: 'out' }, 'out'],
  ['experimentGraph', [EK], 'experiment/graph', { experimentKey: EK }, { graph: 'g' }, 'g'],
  ['experimentInstalledPackages', [EK], 'experiment/system-details', { experimentKey: EK }, { installedPackages: ['a==1'] }, ['a==1']],
  ['experimentSystemDetails', [EK], 'experiment/system-details', { experimentKey: EK }, { os: 'Linux' }, { os: 'Linux' }],
  ['experimentImages', [EK], 'experiment/asset/list', { experimentKey: EK, type: 'image' }, { assets: [1] }, [1]],
  ['experimentAssets', [EK], 'experiment/asset/list', { experimentKey: EK, type: 'all' }, { assets: [1] }, [1]],
  ['experimentAssetDetails', [EK, 'aid'], 'experiment/asset/details', { experimentKey: EK, assetId: 'aid' }, { assetId: 'aid' }, { assetId: 'aid' }],
  ['experimentMetric', [EK, 'loss'], 'experiment/metrics/get-metric', { experimentKey: EK, metricName: 'loss' }, { metrics: [1] }, [1]],
  ['experimentMetrics', [EK], 'experiment/metrics/get-all', { experimentKey: EK }, { metrics: [1, 2] }, [1, 2]],
  ['experimentStop', [EK], 'write/experiment/stop', { experimentKey: EK }, { msg: 'Stop Requested' }, { msg: 'Stop Requested' }]
];

describe('API requests', () => {
  let calls;
  let respondWith;

  beforeEach(() => {
    respondWith = {};
    calls = stubFetch(() => makeResponse({ body: respondWith }));
  });

  afterEach(() => calls.restore());

  GET_CASES.forEach(([method, args, endPoint, query, body, expected]) => {
    it(`${method}(${args.join(', ')}) -> GET ${endPoint}`, async () => {
      respondWith = body;
      const api = new Comet.API(KEY);

      const result = await api[method](...args);

      assert.equal(calls.length, 1);
      assert.equal(calls[0].method, 'GET');
      assert.equal(calls[0].path, endPoint);
      assert.deepEqual(queryOf(calls[0]), query);
      assert.equal(calls[0].headers.Authorization, KEY);
      assert.deepEqual(result, expected);
    });
  });

  it('experimentsByProjectName rejects a missing project name without a request', async () => {
    const api = new Comet.API(KEY);

    await assert.rejects(
      api.experimentsByProjectName('ws', ''),
      /project name is required/
    );
    assert.equal(calls.length, 0);
  });

  it('experimentsByProjectName rejects a missing workspace without a request', async () => {
    const api = new Comet.API(KEY);

    await assert.rejects(
      api.experimentsByProjectName(undefined, 'proj'),
      /workspace name is required/
    );
    assert.equal(calls.length, 0);
  });

  it('experimentsByProjectName names the project when the server answers 404', async () => {
    calls.restore();
    calls = stubFetch(() =>
      makeResponse({ status: 404, body: { msg: 'No such project.' } })
    );
    const api = new Comet.API(KEY);

    await assert.rejects(api.experimentsByProjectName('ws', 'typo'), {
      message: 'No such project named typo in workspace ws',
      status: 404
    });
  });

  it('experimentsByProjectName passes other server errors through', async () => {
    calls.restore();
    calls = stubFetch(() =>
      makeResponse({ status: 403, body: { msg: 'Not allowed' } })
    );
    const api = new Comet.API(KEY);

    await assert.rejects(api.experimentsByProjectName('ws', 'proj'), {
      message: 'Not allowed',
      status: 403
    });
  });

  it('experimentAssets sends each tag as a repeated query parameter', async () => {
    const api = new Comet.API(KEY);

    await api.experimentAssets(EK, 'image', ['a', 'b']);

    assert.deepEqual(calls[0].query.getAll('tags'), ['a', 'b']);
    assert.equal(calls[0].query.get('type'), 'image');
  });

  it('experimentMetricsForChart POSTs the chart request', async () => {
    respondWith = { experiments: { [EK]: { empty: false } }, empty: false };
    const api = new Comet.API(KEY);

    const result = await api.experimentMetricsForChart([EK], ['loss'], ['lr']);

    assert.equal(calls[0].method, 'POST');
    assert.equal(calls[0].path, 'experiments/multi-metric-chart');
    assert.equal(calls[0].headers['Content-Type'], 'application/json');
    assert.deepEqual(calls[0].body, {
      targetedExperiments: [EK],
      metrics: ['loss'],
      params: ['lr'],
      independentMetrics: true,
      fetchFull: false
    });
    assert.deepEqual(result, { [EK]: { empty: false } });
  });

  it('honors a changed config.url', async () => {
    const saved = Comet.config.url;
    Comet.config.url = 'https://comet.example.com/';

    try {
      await new Comet.API(KEY).workspaces();
    } finally {
      Comet.config.url = saved;
    }

    assert.equal(
      calls[0].url,
      'https://comet.example.com/api/rest/v2/workspaces'
    );
  });
});

describe('API parameter lookups', () => {
  let calls;

  afterEach(() => calls.restore());

  const parameters = [
    { name: 'lr', valueCurrent: '0.1' },
    { name: 'epochs', valueCurrent: '10' }
  ];

  it('experimentParameters returns all, or one by name', async () => {
    calls = stubFetch(() => makeResponse({ body: { values: parameters } }));
    const api = new Comet.API(KEY);

    assert.deepEqual(await api.experimentParameters(EK), parameters);
    assert.deepEqual(await api.experimentParameters(EK, 'lr'), parameters[0]);
    assert.equal(await api.experimentParameters(EK, 'nope'), undefined);
  });

  it('experimentMetricsSummary returns all, or one by name', async () => {
    calls = stubFetch(() => makeResponse({ body: { values: parameters } }));
    const api = new Comet.API(KEY);

    assert.deepEqual(await api.experimentMetricsSummary(EK), parameters);
    assert.deepEqual(
      await api.experimentMetricsSummary(EK, 'epochs'),
      parameters[1]
    );
  });

  it('experimentOther returns all, the current value, a field, or null', async () => {
    const others = [{ name: 'Name', valueCurrent: 'x', valueMax: 'y' }];
    calls = stubFetch(() => makeResponse({ body: { values: others } }));
    const api = new Comet.API(KEY);

    assert.deepEqual(await api.experimentOther(EK), others);
    assert.equal(await api.experimentOther(EK, 'Name'), 'x');
    assert.equal(await api.experimentOther(EK, 'Name', 'valueMax'), 'y');
    assert.equal(await api.experimentOther(EK, 'missing'), null);
  });
});

describe('API.get()', () => {
  let calls;
  const experiments = [
    { experimentKey: 'k1', workspaceName: 'ws', projectName: 'proj' },
    { experimentKey: 'k2', workspaceName: 'ws', projectName: 'Proj' }
  ];

  beforeEach(() => {
    calls = stubFetch(call => {
      if (call.path === 'workspaces') {
        return makeResponse({ body: { workspaceNames: ['ws'] } });
      }
      if (call.path === 'projects') {
        return makeResponse({ body: { projects: [{ projectName: 'p' }] } });
      }
      if (call.path === 'experiment/metadata') {
        const key = call.query.get('experimentKey');
        const experiment = experiments.find(e => e.experimentKey === key);
        return makeResponse({ body: experiment });
      }
      return makeResponse({ body: { experiments } });
    });
  });

  afterEach(() => calls.restore());

  it('get() lists workspaces', async () => {
    assert.deepEqual(await new Comet.API(KEY).get(), ['ws']);
  });

  it('get(ws) lists projects', async () => {
    assert.deepEqual(await new Comet.API(KEY).get('ws'), [
      { projectName: 'p' }
    ]);
  });

  it('get(ws, proj) and get("ws/proj") list experiment keys', async () => {
    const api = new Comet.API(KEY);

    assert.deepEqual(await api.get('ws', 'proj'), ['k1', 'k2']);
    assert.deepEqual(await api.get('ws/proj'), ['k1', 'k2']);
    // one request each: projects are looked up by name on the server
    assert.deepEqual(
      calls.map(c => c.path),
      ['experiments', 'experiments']
    );
  });

  it('get("ws/proj/key") fetches just that experiment', async () => {
    // project names are matched ignoring case, as the server does
    assert.deepEqual(
      await new Comet.API(KEY).get('ws/proj/k2'),
      experiments[1]
    );
    assert.deepEqual(
      calls.map(c => c.path),
      ['experiment/metadata']
    );
  });

  it('get("ws/proj/key") is undefined for an experiment in another project', async () => {
    assert.equal(await new Comet.API(KEY).get('ws/other/k1'), undefined);
  });

  it('rejects too many path parts', async () => {
    await assert.rejects(new Comet.API(KEY).get('a/b/c/d'), /too many slashes/);
  });
});

describe('API assets', () => {
  let calls;

  afterEach(() => calls.restore());

  it('experimentAsset returns raw text, parsed JSON, or binary', async () => {
    calls = stubFetch(() => makeResponse({ text: '{"a": 1}' }));
    const api = new Comet.API(KEY);

    assert.equal(await api.experimentAsset(EK, 'aid'), '{"a": 1}');
    assert.deepEqual(await api.experimentAsset(EK, 'aid', 'json'), { a: 1 });

    const binary = await api.experimentAsset(EK, 'aid', 'binary');
    assert.ok(binary instanceof ArrayBuffer);
    assert.equal(binary.byteLength, 3);

    assert.equal(calls[0].path, 'experiment/asset/get-asset');
    assert.deepEqual(queryOf(calls[0]), { experimentKey: EK, assetId: 'aid' });
  });

  it('experimentAsset rejects an unknown returnType without a request', async () => {
    calls = stubFetch();

    await assert.rejects(
      new Comet.API(KEY).experimentAsset(EK, 'aid', 'xml'),
      /Invalid returnType/
    );
    assert.equal(calls.length, 0);
  });

  it('experimentGitPatch returns binary', async () => {
    calls = stubFetch();

    const patch = await new Comet.API(KEY).experimentGitPatch(EK);

    assert.ok(patch instanceof ArrayBuffer);
    assert.equal(calls[0].path, 'experiment/git/patch');
  });

  it('experimentAssetByName finds the asset id, then fetches it', async () => {
    calls = stubFetch(call =>
      call.path === 'experiment/asset/list'
        ? makeResponse({
            body: { assets: [{ fileName: 'a.json', assetId: 'aid' }] }
          })
        : makeResponse({ text: '[1, 2]' })
    );
    const api = new Comet.API(KEY);

    assert.deepEqual(
      await api.experimentAssetByName(EK, 'a.json', 'json'),
      [1, 2]
    );
    assert.equal(calls[1].query.get('assetId'), 'aid');
    await assert.rejects(
      api.experimentAssetByName(EK, 'missing.json'),
      /No such asset found/
    );
  });

  it('experimentCurves merges each curve into its asset record', async () => {
    calls = stubFetch(call =>
      call.path === 'experiment/asset/list'
        ? makeResponse({ body: { assets: [{ assetId: 'c1', step: 3 }] } })
        : makeResponse({ text: '{"x": [1], "y": [2], "name": "c"}' })
    );

    const curves = await new Comet.API(KEY).experimentCurves(EK);

    assert.equal(calls[0].query.get('type'), 'curve');
    assert.deepEqual(curves, [
      { assetId: 'c1', step: 3, x: [1], y: [2], name: 'c' }
    ]);
  });
});

describe('API.experimentName()', () => {
  let calls;

  afterEach(() => {
    calls.restore();
    delete globalThis.window;
  });

  it('uses the name, truncated', async () => {
    calls = stubFetch(() =>
      makeResponse({ body: { experimentName: 'a long name' } })
    );

    assert.equal(await new Comet.API(KEY).experimentName(EK, 6), 'a long');
  });

  it('falls back to the key when there is no name', async () => {
    calls = stubFetch(() => makeResponse({ body: { experimentName: null } }));

    assert.equal(
      await new Comet.API(KEY).experimentName('abcdefgh', 4),
      'abcd'
    );
  });

  it('prefers window.EXPERIMENT_NAMES without a request', async () => {
    calls = stubFetch();
    globalThis.window = { EXPERIMENT_NAMES: { [EK]: 'from window' } };

    assert.equal(await new Comet.API(KEY).experimentName(EK), 'from window');
    assert.equal(calls.length, 0);
  });
});

describe('API store', () => {
  let calls;

  afterEach(() => calls.restore());

  it('loads the store once, and saves the whole store on each change', async () => {
    calls = stubFetch(call =>
      call.path === 'viz-instance/store/get'
        ? makeResponse({ body: { store: '{"a": 1}' } })
        : makeResponse({ body: { msg: 'Stored' } })
    );
    const api = new Comet.API(KEY, 'pid', 'iid');

    assert.equal(await api.getFromStore('a'), 1);
    assert.equal(await api.getFromStore('missing'), null);
    await api.store('b', 2);

    assert.deepEqual(
      calls.map(c => `${c.method} ${c.path}`),
      ['GET viz-instance/store/get', 'POST write/viz-instance/store/save']
    );
    assert.deepEqual(queryOf(calls[0]), {
      projectId: 'pid',
      instanceId: 'iid'
    });
    assert.deepEqual(calls[1].body, {
      instanceId: 'iid',
      projectId: 'pid',
      store: JSON.stringify({ a: 1, b: 2 })
    });
  });

  it('treats an unparsable store as empty', async () => {
    calls = stubFetch(() => makeResponse({ body: { store: 'not json' } }));

    assert.deepEqual(await new Comet.API(KEY, 'pid', 'iid').getStore(), {});
  });
});

describe('API errors', () => {
  let calls;

  afterEach(() => calls.restore());

  it('uses the server message, and keeps the status', async () => {
    calls = stubFetch(() =>
      makeResponse({ status: 401, body: { msg: 'unauthorized Api Key used.' } })
    );

    await assert.rejects(new Comet.API(KEY).workspaces(), error => {
      assert.equal(error.message, 'unauthorized Api Key used.');
      assert.equal(error.status, 401);
      return true;
    });
  });

  it('falls back to the HTTP status when the body is not JSON', async () => {
    calls = stubFetch(() =>
      makeResponse({ status: 502, text: '<html>Bad Gateway</html>' })
    );

    await assert.rejects(new Comet.API(KEY).workspaces(), error => {
      assert.equal(error.message, '502 Error');
      assert.equal(error.status, 502);
      return true;
    });
  });
});
