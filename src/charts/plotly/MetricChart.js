/* global Plotly */
import { PlotlyBaseChart } from './PlotlyBaseChart';

// # Template: PlotlyMetricChart

export class PlotlyMetricChart extends PlotlyBaseChart {
  setup() {
    this.options = {
      title: 'Metrics Chart',
      metrics: ['acc', 'loss'],
      showLegend: true,
      xAxis: 'step',
      legendOrientation: 'h',
      layoutMargin: 50
    };
  }

  draw(experimentKeys) {
    // experimentKeys: list of experiment IDs
    const layout = {
      margin: { t: this.options.layoutMargin },
      showlegend: this.options.showLegend,
      legend: { orientation: this.options.legendOrientation },
      title: { text: this.options.title }
    };
    if (experimentKeys.length > 10) {
      layout.legend.orientation = 'v';
    }
    Plotly.newPlot(this.id, [], layout);
    experimentKeys.forEach(async experimentKey => {
      const name = await this.api.experimentName(experimentKey);
      this.options.metrics.forEach(async metricName => {
        const data = await this.api.experimentMetric(experimentKey, metricName);
        const traceData = {
          x: data.map(d => d[this.options.xAxis]),
          y: data.map(d => d.metricValue),
          name: `${name} ${metricName}`
        };
        Plotly.addTraces(this.id, traceData);
      });
    });
  }
}
