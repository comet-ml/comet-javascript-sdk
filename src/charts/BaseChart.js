import get from 'lodash/get';
import API from '../api';
import { COLORS } from '../utils/constants';

const Comet = { API };

// # Template: BaseChart

export class BaseChart {
  constructor(apiKey, id, projectId, instanceId, colorMap = {}) {
    this.api = new Comet.API(apiKey, projectId, instanceId);
    this.colorMap = colorMap;
    this.colorIndex = 0;
    this.id = id;
    this.instanceId = instanceId;
    this.projectId = projectId;
    this.setup();
  }

  clear(divId = this.id) {
    const container = document.getElementById(divId);

    if (container) {
      container.innerHTML = '';
    }
  }

  draw() {}

  drawOne(experimentKey) {
    this.draw([experimentKey]);
  }

  getColor(experimentKey) {
    if (!this.colorMap[experimentKey]) {
      this.colorMap[experimentKey] = COLORS[this.colorIndex % COLORS.length];
      this.colorIndex += 1;
    }

    return this.colorMap[experimentKey];
  }

  getOption(optionPath, defaultValue = null) {
    return get(this.options, optionPath, defaultValue);
  }

  print(html, newLine = true) {
    const container = document.getElementById(this.id);

    if (!container) return;

    const tagName = newLine ? 'div' : 'span';
    const textNode = document.createElement(tagName);

    textNode.className = 'chart-print-text';
    textNode.innerHTML = html;
    container.appendChild(textNode);

    return textNode;
  }

  // format(option) gives the text shown for each option. drawOne() receives
  // the selected option's value, which is the option converted to a string,
  // so options should be strings (or values that stringify usefully).
  select(label, options, parentId = null, format = option => option) {
    const selectNode = document.createElement('select');
    let container = parentId && document.getElementById(parentId);

    if (container === null) {
      const parentNode = document.getElementById(this.id).parentElement;
      container = document.createElement('div');
      parentNode.insertBefore(container, parentNode.firstChild);
    }

    selectNode.className = 'chart-experiments-select';

    selectNode.addEventListener('change', () => {
      this.drawOne(selectNode.value);
    });

    options.forEach(option => {
      const optionNode = document.createElement('option');
      optionNode.text = format(option);
      optionNode.value = option;
      selectNode.appendChild(optionNode);
    });

    const title = document.createElement('span');

    title.textContent = label || 'Selection: ';

    container.appendChild(title);
    container.appendChild(selectNode);

    return selectNode;
  }

  setup() {
    this.options = {};
  }
}

export const Panel = BaseChart;
