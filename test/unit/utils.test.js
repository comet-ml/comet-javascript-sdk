import assert from 'node:assert/strict';
import { filterOutliers, smoothSeries } from '../../src/utils/data.js';
import { getEndPoint, toQueryString } from '../../src/utils/requestUtils.js';

describe('toQueryString', () => {
  it('sorts keys, repeats arrays, drops undefined, and sends null as a bare key', () => {
    assert.equal(
      toQueryString({ b: 1, a: ['x', 'y'], c: undefined, d: null, e: false }),
      'a=x&a=y&b=1&d&e=false'
    );
  });

  it('encodes special characters', () => {
    assert.equal(
      toQueryString({ q: "a b&c!'()*" }),
      'q=a%20b%26c%21%27%28%29%2A'
    );
  });

  it('is empty for no parameters', () => {
    assert.equal(toQueryString(), '');
  });
});

describe('getEndPoint', () => {
  it('prefixes the version', () => {
    assert.equal(getEndPoint('experiments'), 'v2/experiments');
    assert.equal(
      getEndPoint('experiment/metadata', 'v3'),
      'v3/experiment/metadata'
    );
  });
});

describe('filterOutliers', () => {
  it('keeps points strictly between min and max', () => {
    assert.deepEqual(filterOutliers([1, 2, 3, 4], [10, 50, 90, 20], 10, 90), {
      x: [2, 4],
      y: [50, 20]
    });
  });

  it('returns empty series when nothing is left', () => {
    assert.deepEqual(filterOutliers([1], [100], 0, 1), { x: [], y: [] });
  });
});

describe('smoothSeries', () => {
  it('returns the series unchanged with no smoothing', () => {
    assert.deepEqual(smoothSeries([1, 2, 3], 0), [1, 2, 3]);
  });

  it('debiases, so a constant series stays constant', () => {
    smoothSeries([5, 5, 5], 0.6).forEach(value =>
      assert.ok(Math.abs(value - 5) < 1e-9)
    );
  });

  it('passes non-finite values through', () => {
    const smoothed = smoothSeries([1, NaN, 3], 0.5);
    assert.ok(Number.isNaN(smoothed[1]));
  });
});
