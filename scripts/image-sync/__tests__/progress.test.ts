import { describe, expect, it } from 'vitest';
import { rotateItems } from '../progress';

describe('rotateItems', () => {
  it('fait avancer équitablement le prochain lot après une panne', () => {
    expect(rotateItems(['a', 'b', 'c', 'd'], 2)).toEqual(['c', 'd', 'a', 'b']);
    expect(rotateItems(['a', 'b', 'c'], 4)).toEqual(['b', 'c', 'a']);
  });

  it('gère une liste vide', () => {
    expect(rotateItems([], 10)).toEqual([]);
  });
});
