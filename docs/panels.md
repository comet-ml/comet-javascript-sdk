# Writing JavaScript panels

A JavaScript panel is code that runs in the browser inside a Comet view,
with this SDK loaded as the global `Comet`. Use one when no built-in panel
shows what you need. This guide is the contract a panel must meet, what it
can read, and the practices that keep panels correct. The method reference
is [api.md](api.md).

## Where a panel's code lives

A panel whose code is stored in the view itself can be written from nothing,
for example with the Comet Python SDK:

```python
from comet_ml.views import Section, build_view, javascript_panel

view = build_view("Custom", sections=[Section("JS", [javascript_panel(code, name="Loss")])])
comet_ml.API().create_view(workspace, project, view)
```

`javascript_panel(code, html=..., css=..., resources=[...], name=...)` stores
the code, the panel's HTML (default `<div id="chart-mount"></div>`), CSS and
extra script or stylesheet URLs. See
[Views and panels from Python](https://www.comet.com/docs/v2/guides/comet-ui/experiment-management/visualizations/python-sdk-views-and-panels/#javascript-panels).

## The contract

```javascript
class MyPanel extends Comet.Panel {     // must be named MyPanel
  setup() {                             // runs once: set defaults
    this.options = { metrics: ["loss"] };
  }

  async draw(experimentKeys, projectId) {  // the view's experiments
    this.plot({ data: [], layout: {} });   // an empty chart while loading
    const results = await this.api.experimentMetricsForChart(
      experimentKeys, this.options.metrics);
    const data = [];
    for (const key of experimentKeys) {
      const result = results[key];
      if (!result || result.empty) continue;
      for (const metric of result.metrics) {
        data.push({
          type: "scatter", mode: "lines",
          name: result.experimentName || key.slice(0, 9),
          x: metric.steps, y: metric.values,
          line: { color: this.getColor(key) },
        });
      }
    }
    this.plot({ data, layout: { showlegend: true } });
  }
}
```

- `draw(experimentKeys, projectId)` is called with the keys of the
  experiments shown on the view (after its filters), and again when they
  change.
- A panel shows one of two things:
  - **A Plotly figure**: `this.plot({data, layout})` hands it to the page,
    which draws it like the built-in charts. Only `scatter` (lines and
    markers), `bar`, `box`, `violin` and `parcoords` traces are supported,
    and `Plotly` itself can't be called from a panel. The layout already
    has the dashboard's look, with no title or legend.
  - **Its own HTML**: a panel that never calls `this.plot` shows its HTML.
    `this.print(html)` appends to it and `this.clear()` empties it. Other
    libraries (such as d3) can be loaded through `resources`, with an exact
    version in each URL, and draw into that HTML.

`examples/custom-chart-template.js` in this repository is a standalone page
example (it loads Plotly itself and calls `Plotly.newPlot`); panels use
`this.plot` instead.

## HTML panels

A panel can skip `this.plot` and render its own page: its own markup and
stylesheet (the `html` and `css` saved with the panel), JavaScript that
works the DOM, and libraries loaded through `resources`. Use this for
tables, controls, small multiples, or charts the page's trace types can't
draw.

```javascript
// html: <select id="metric"></select><div id="chart-mount"></div>
// resources: https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js
class MyPanel extends Comet.Panel {
  async draw(experimentKeys, projectId) {
    const mount = document.getElementById("chart-mount");
    mount.replaceChildren();
    const results = await this.api.experimentMetricsForChart(experimentKeys, ["loss"]);
    const width = mount.clientWidth || 480;
    const svg = d3.select(mount).append("svg").attr("width", width).attr("height", 240);
    // ... scales, axes, marks ...
  }
}
```

- The HTML is the panel's whole page. Keep a `<div id="chart-mount"></div>`
  in it if the code uses `this.print`, `this.clear` or `this.select`, which
  work on that element.
- Build elements with DOM APIs (`createElement`, `textContent`,
  `createElementNS` for SVG) rather than HTML strings, so server data needs
  no escaping.
- Wire your own controls with `addEventListener`, and redraw from data
  already fetched rather than calling the API again.
- `resources` load in order before the code runs. Use an exact version in
  every URL, from a CDN that serves npm packages (such as jsDelivr).
- Size from the element (`clientWidth`), with a fallback for the first
  layout pass, and clear before redrawing.

## What `Comet.Panel` gives you

| Member | Does |
| --- | --- |
| `this.api` | This SDK's `API`, authenticated for the panel |
| `this.options`, `this.getOption(path, default)` | The panel's settings, set in `setup()` |
| `this.getColor(experimentKey)` | The experiment's color on the view; use it so colors match other panels |
| `this.print(html, newLine = true)` | Append HTML (it is innerHTML: escape data from the server) |
| `this.clear()` | Empty the panel's HTML |
| `this.select(label, options, parentId, format)` | Add a dropdown; choosing an option calls `this.drawOne(value)` |
| `this.drawOne(experimentKey)` | Override for one-experiment-at-a-time panels |
| `this.id`, `this.projectId`, `this.instanceId` | The mount element id, the project, the panel instance |

`Comet.ProjectPanel` is a ready-made one-experiment-at-a-time panel: it adds
an experiment selector and calls your `drawOne(experimentKey)`.

## What a panel can read

A panel's `this.api` is authenticated with a **project token**, not a user's
API key. It can read the panel's own project and its experiments, and the
panel's store. These need a user API key and are **refused in panels**:
`workspaces()`, `projects()`, `get()`, `accountDetails()`, `experimentStop()`.

The calls panels use most, with the shapes the server returns:

| Need | Call | Returns |
| --- | --- | --- |
| Curves for many experiments, one request | `experimentMetricsForChart(keys, metrics, parameters, independent = true, full = false)` | `{key: {experimentName, metrics: [{metricName, values, steps, epochs, timestamps, durations}], params: {name: value}, empty}}` |
| A metric's last, min and max | `experimentMetricsSummary(key, metricName)` | `{valueCurrent, valueMin, valueMax, stepCurrent, ...}`; values are **strings** |
| Parameters | `experimentParameters(key, [name])` | `[{name, valueCurrent, ...}]`; values are strings |
| `log_other` values | `experimentOther(key, [name])` | |
| Name, tags, metadata, link | `experimentName(key, maxLength)`, `experimentTags(key)`, `experimentMetadata(key)`, `experimentURL(key)` | `experimentURL` is synchronous |
| All experiments of the project | `experimentsByProjectId(projectId)` | `[{experimentKey, experimentName, startTimeMillis, ...}]` |
| A logged file | `experimentAssetByName(key, fileName, "raw" or "json")` | text (CSV, ...) or parsed JSON |
| Assets, images, curves | `experimentAssets(key, type)`, `experimentImages(key)`, `experimentCurves(key)` | |
| State kept with the panel | `store(key, value)`, `getFromStore(key)`, `getStore()` | per panel instance |

`experimentMetricsForChart` returns about 500 sampled points per metric;
pass `full = true` (fifth argument) for up to 15,000 only when needed.

## Best practices

- **Read the project's real metric and parameter names first**; never guess
  `val_loss` versus `validation_loss`.
- **One request for many experiments** (`experimentMetricsForChart`) where
  possible; otherwise run per-experiment calls in parallel with
  `Promise.all`, not one after another.
- **Draw an empty chart first**, so the panel shows a frame while loading.
- **Parse numbers**: summary and parameter values are strings (`"1.0E-4"`);
  use `parseFloat` and skip values that aren't finite.
- **Skip missing data**: not every experiment logs every metric; don't plot
  zeros for it.
- **Escape server data in HTML**: experiment names, tags and parameters are
  user input, and `print` writes innerHTML.
- **Use `this.getColor(key)`** for each experiment's color, and its name, with
  the key as a fallback, for labels.
- **Make it configurable** through `this.options`.
- **Handle zero experiments** (an empty view, or a filter that matches
  nothing) with a short message.
- **Remember choices** (a selected experiment or metric) with `store`, and
  don't wait for the write before drawing.
- **No secrets in panel code**: it is stored in the view, visible to everyone
  who can see the project.
- **Debug** in the browser's developer console, where a panel's errors and
  `console.log` output appear.

## Testing a panel before saving it

A panel can be run outside Comet against real experiments: load
`build/comet-javascript-sdk.js` into a sandbox that defines `document`,
add `Comet.Panel.prototype.plot = function (figure) { this.figure = figure; }`,
construct `new MyPanel(apiKey, "chart-mount", projectId, "test", {})`, and
await `panel.draw(experimentKeys, projectId)`. For HTML panels, use a real
DOM such as jsdom, with the panel's HTML, CSS and resources loaded. `test/bundle/bundle.test.js`
does this with a stubbed server; a complete harness that runs panels against a
live project and checks their figures is in the
[comet-python-sdk examples](https://github.com/comet-ml/comet-python-sdk/tree/main/examples/views/javascript).

A local test uses your API key, which can do more than a panel's project
token: check that the panel calls none of the refused methods above.

## More examples

Seven tested panels, one pattern each (metric curves, sorted bars, box plots
by a hyperparameter, an HTML leaderboard, a per-experiment report with a
selector and stored state, an HTML page with its own controls and SVG
sparklines, and a d3 chart loaded from a pinned resource):
[comet-python-sdk/examples/views/javascript](https://github.com/comet-ml/comet-python-sdk/tree/main/examples/views/javascript).
