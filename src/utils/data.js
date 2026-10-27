import isFinite from 'lodash/isFinite';

export const filterOutliers = (xValues, yValues, min, max) => {
  const points = xValues.map((xValue, index) => {
    return {
      x: xValue,
      y: yValues[index]
    };
  });

  const pointsAfterYOutliersFiltered = points.filter(point => {
    return point.y < max && point.y > min;
  });

  if (!pointsAfterYOutliersFiltered.length) {
    return { x: [], y: [] };
  }

  const pointsX = pointsAfterYOutliersFiltered.map(point => point.x);
  const pointsY = pointsAfterYOutliersFiltered.map(point => point.y);

  return {
    x: pointsX,
    y: pointsY
  };
};

export const smoothSeries = (yValues, smoothing) => {
  const smoothingWeight = smoothing === 1 ? 0.9999 : smoothing;
  let last = 0;
  let numAccum = 0;
  return yValues.map(value => {
    if (!isFinite(value)) {
      return value;
    }
    last = last * smoothingWeight + (1 - smoothingWeight) * value;
    numAccum += 1;
    let debiasWeight = 1;
    if (smoothingWeight !== 1.0) {
      debiasWeight = 1.0 - smoothingWeight ** numAccum;
    }
    return last / debiasWeight;
  });
};
