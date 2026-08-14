import { describe, expect, it } from 'vitest';
import { isPlausibleDayIndex } from '../day.js';
import { DATE_REF } from '../../../src/lib/constants.js';

const serverToday = Math.floor((Date.now() - DATE_REF) / 86_400_000);

describe('isPlausibleDayIndex', () => {
  it('accepte le jour courant', () => {
    expect(isPlausibleDayIndex(serverToday)).toBe(true);
  });

  it('accepte une petite marge autour du jour courant (fuseaux horaires)', () => {
    expect(isPlausibleDayIndex(serverToday + 2)).toBe(true);
    expect(isPlausibleDayIndex(serverToday - 2)).toBe(true);
  });

  it('rejette un jour trop éloigné du jour courant', () => {
    expect(isPlausibleDayIndex(serverToday + 3)).toBe(false);
    expect(isPlausibleDayIndex(serverToday - 3)).toBe(false);
  });

  it('rejette les valeurs négatives', () => {
    expect(isPlausibleDayIndex(-1)).toBe(false);
  });

  it('rejette les non-entiers et les non-nombres', () => {
    expect(isPlausibleDayIndex(1.5)).toBe(false);
    expect(isPlausibleDayIndex('123')).toBe(false);
    expect(isPlausibleDayIndex(NaN)).toBe(false);
    expect(isPlausibleDayIndex(undefined)).toBe(false);
  });
});
