/* global Plotly */
import { PlotlyBaseChart } from './PlotlyBaseChart';

// # Template: PlotlyConfusionMatrix

export class PlotlyConfusionMatrix extends PlotlyBaseChart {
  setup() {
    this.options = {
      title: 'Confusion Matrix',
      fileName: 'confusion_matrix.json',
      colorscale: 'Jet',
      xaxis_label: 'Predicted value',
      yaxis_label: 'Real value',
      font_color: 'white'
    };
  }

  makeAnnotations(matrix, colLabels, rowLabels) {
    const result = [];
    for (let row = 0; row < matrix.length; row += 1) {
      for (let col = 0; col < matrix[row].length; col += 1) {
        const annotation = {
          xref: 'x1',
          yref: 'y1',
          showarrow: false,
          font: { color: this.options.font_color }
        };
        annotation.text = matrix[row][col].toString();
        annotation.x = colLabels[col];
        annotation.y = rowLabels[row];
        result.push(annotation);
      }
    }
    return result;
  }

  draw(experimentKeys) {
    experimentKeys.slice(0, 1).forEach(async experimentKey => {
      const json = await this.api.experimentAssetByName(
        experimentKey,
        this.options.fileName,
        'json'
      );
      const colLabels = json.labels;
      const rowLabels = colLabels.slice().reverse();
      const matrix = json.matrix.slice().reverse();
      Plotly.newPlot(this.id, {
        data: [
          {
            y: rowLabels,
            x: colLabels,
            z: matrix,
            colorscale: this.options.colorscale,
            type: 'heatmap'
          }
        ],
        layout: {
          title: this.options.title,
          annotations: this.makeAnnotations(matrix, colLabels, rowLabels),
          xaxis: { title: this.options.xaxis_label },
          yaxis: { title: this.options.yaxis_label }
        }
      });
    });
  }
}
