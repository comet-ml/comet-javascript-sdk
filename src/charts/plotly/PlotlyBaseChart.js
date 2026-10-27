/* global Plotly */
import { BaseChart } from '../BaseChart';

// # Template: PlotlyBaseChart

export class PlotlyBaseChart extends BaseChart {
  toImage(func) {
    Plotly.toImage(this.id, { format: 'svg' }).then(url => {
      func(url);
    });
  }
}
