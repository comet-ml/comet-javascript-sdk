import API from './api';
import { config } from './config';
import { PlotlyMetricChart } from './charts/plotly/MetricChart';
import { PlotlyConfusionMatrix } from './charts/plotly/ConfusionMatrix';
import { PlotlyHeatmap } from './charts/plotly/Heatmap';
import { BaseChart, Panel } from './charts/BaseChart';
import { ProjectPanel } from './charts/ProjectPanel';
import { PlotlyBaseChart } from './charts/plotly/PlotlyBaseChart';
import * as utilsData from './utils/data';

const utils = { data: utilsData };

// Exported as Comet
export {
  API,
  BaseChart,
  Panel,
  PlotlyBaseChart,
  PlotlyConfusionMatrix,
  PlotlyHeatmap,
  PlotlyMetricChart,
  ProjectPanel,
  config,
  utils
};
