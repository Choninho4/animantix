import { describe, expect, it } from 'vitest';
import { computePercentile } from '../percentile';

describe('computePercentile', () => {
  it('marque le tout premier joueur du jour comme isFirst', () => {
    expect(computePercentile(0, 0)).toEqual({ total: 1, rank: 0, percentileTop: 100, isFirst: true });
    expect(computePercentile(0, 1)).toEqual({ total: 1, rank: 0, percentileTop: 100, isFirst: true });
  });

  it('calcule le percentile du plus rapide de tous', () => {
    expect(computePercentile(0, 10)).toEqual({ total: 10, rank: 0, percentileTop: 10, isFirst: false });
  });

  it('calcule le percentile du plus lent de tous', () => {
    expect(computePercentile(9, 10)).toEqual({ total: 10, rank: 9, percentileTop: 100, isFirst: false });
  });

  it('calcule un percentile intermédiaire', () => {
    expect(computePercentile(4, 20)).toEqual({ total: 20, rank: 4, percentileTop: 25, isFirst: false });
  });

  it('ne descend jamais sous 1%', () => {
    const result = computePercentile(0, 1000);
    expect(result.percentileTop).toBeGreaterThanOrEqual(1);
  });
});
