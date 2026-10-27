/* eslint-disable no-unused-vars */
/* global BaseChart */

import { BaseChart } from './BaseChart';

// # Template: ProjectPanel

export class ProjectPanel extends BaseChart {
  setup() {
    this.options = { experimentKey: null };
  }

  drawOne(experimentKey) {}

  async draw(experimentKeys) {
    if (experimentKeys.length > 0) {
      if (this.options.experimentKey) {
        const foundExperimentKey = experimentKeys.find(
          experimentKey => experimentKey === this.options.experimentKey
        );

        if (!foundExperimentKey) {
          this.print(
            `The experiment ${this.options.experimentKey} is not found`
          );
          return;
        }
        this.drawOne(foundExperimentKey);
      } else {
        const names = await Promise.all(
          experimentKeys.map(async key => [
            key,
            await this.api.experimentName(key, 50)
          ])
        );
        const nameHash = Object.fromEntries(names);
        this.select('Experiment: ', experimentKeys, null, key => nameHash[key]);
        this.drawOne(experimentKeys[0]);
      }
    }
  }
}
