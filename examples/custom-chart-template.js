/* global Comet, Plotly */

// Custom Chart implemention
export class BasicCustomChart extends Comet.BaseChart {
  setup() {
    this.options = {
      metrics: ['loss', 'acc'],
      parameters: [],
      layout: {
        showlegend: true,
        legend: { orientation: 'h' },
        title: { text: 'My Chart Title' }
      }
    };
  }

  async draw(experimentKeys) {
    // Your code here:
    Plotly.newPlot(this.id, [], this.options.layout);

    const results = await this.api.experimentMetricsForChart(
      experimentKeys,
      this.options.metrics,
      this.options.parameters
    );

    Object.keys(results).forEach(async experimentKey => {
      const name = await this.api.experimentName(experimentKey);

      results[experimentKey].metrics.forEach(result => {
        const data = {
          y: result.values,
          x: result.steps,
          name: `${name} ${result.metricName}`
        };

        Plotly.addTraces(this.id, data);
      });
    });
  }
}
