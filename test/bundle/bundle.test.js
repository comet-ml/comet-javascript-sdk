// Loads the built browser bundle (npm run pack) the way the Comet app's
// JavaScript panel sandbox does: as a plain <script> defining the global
// `Comet`, then a panel class extending Comet.Panel, constructed with a
// project token.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const BUNDLE = path.resolve(__dirname, '../../build/comet-javascript-sdk.js');

const makeDocument = () => {
  const nodes = {};
  const makeNode = tagName => ({
    tagName,
    children: [],
    innerHTML: '',
    appendChild(child) {
      this.children.push(child);
      return child;
    }
  });

  return {
    nodes,
    createElement: makeNode,
    getElementById: id => {
      nodes[id] = nodes[id] || makeNode('div');
      return nodes[id];
    }
  };
};

describe('browser bundle', () => {
  let context;
  let requests;

  before(function () {
    if (!fs.existsSync(BUNDLE)) this.skip();
  });

  beforeEach(() => {
    requests = [];
    context = vm.createContext({
      URLSearchParams,
      console,
      document: makeDocument(),
      fetch: async (url, options = {}) => {
        requests.push({ url, options });
        return {
          ok: true,
          json: async () => ({
            experiments: { k1: { experimentKey: 'k1', empty: false } }
          })
        };
      }
    });
    vm.runInContext(fs.readFileSync(BUNDLE, 'utf8'), context);
  });

  it('defines the global Comet with the panel API', () => {
    const exported = JSON.parse(
      vm.runInContext('JSON.stringify(Object.keys(Comet).sort())', context)
    );

    assert.deepEqual(exported, [
      'API',
      'BaseChart',
      'Panel',
      'PlotlyBaseChart',
      'PlotlyConfusionMatrix',
      'PlotlyHeatmap',
      'PlotlyMetricChart',
      'ProjectPanel',
      'config',
      'utils'
    ]);
  });

  it('runs a panel with a project token, as the sandbox does', async () => {
    const result = await vm.runInContext(
      `
      Comet.Panel.prototype.plot = function plot(figure) {
        this.figure = figure;
      };

      class MyPanel extends Comet.Panel {
        async draw(experimentKeys, projectId) {
          const data = await this.api.experimentMetricsForChart(
            experimentKeys, ['loss']
          );
          this.plot({
            data: experimentKeys.map(key => ({
              name: data[key].experimentKey,
              marker: { color: this.getColor(key) }
            }))
          });
        }
      }

      Comet.config.url = 'https://comet.example.com/';
      const panel = new MyPanel('PROJECT-TOKEN', 'mount', 'pid', 'iid', {});
      panel.draw(['k1'], 'pid').then(() => panel.figure);
      `,
      context
    );

    assert.equal(requests.length, 1);
    assert.equal(
      requests[0].url,
      'https://comet.example.com/api/rest/v2/experiments/multi-metric-chart'
    );
    assert.equal(requests[0].options.headers.Authorization, 'PROJECT-TOKEN');
    assert.equal(result.data[0].name, 'k1');
    assert.equal(result.data[0].marker.color, '#fb9341');
  });
});
