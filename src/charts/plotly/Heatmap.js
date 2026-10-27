/* global Plotly */
import { PlotlyBaseChart } from './PlotlyBaseChart';

// # Template: PlotlyBaseChart

export class PlotlyHeatmap extends PlotlyBaseChart {
  setup() {
    this.options = {
      title: 'Heatmap',
      connectgaps: true,
      metric: [],
      hyperparameters: [], // x, y
      xRange: [0, 1, 0.1], // min, max, step
      yRange: [0, 1, 0.1] // min, max, step
    };
  }

  draw(experimentKeys) {
    // experimentKeys: list of experiment IDs
    // construct an empty matrix:
    const matrix = [];
    let y = this.options.yRange[0];
    while (y < this.options.yRange[1]) {
      matrix[y] = [];
      let x = this.options.xRange[0];
      while (x < this.options.xRange[1]) {
        matrix[y][x] = undefined;
        x += this.options.yRange[2];
      }
      y += this.options.xRange[2];
    }
    const layout = { title: { text: this.options.title } };
    Plotly.newPlot(this.id, [], layout);
    experimentKeys.forEach(async experimentKey => {
      const params = await this.api.experimentParameters(
        experimentKey,
        this.options.hyperparameters
      );
      params.forEach(values => {
        const y1 = values[1][2];
        const x1 = values[0][2];

        matrix[y1][x1] = this.options.metric[0][1];
      });
      Plotly.update(this.id, [
        {
          z: matrix,
          type: 'heatmap',
          connectgaps: this.options.connectgaps
        }
      ]);
    });
  }
}
