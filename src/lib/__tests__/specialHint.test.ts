import { describe, expect, it } from 'vitest';
import { isSpecialHintUnlocked, specialHintProgress } from '../specialHint';

describe('specialHintProgress', () => {
  it('suit le nombre d\'essais jusqu\'au seuil', () => {
    expect(specialHintProgress(0)).toBe(0);
    expect(specialHintProgress(1)).toBe(1);
    expect(specialHintProgress(19)).toBe(19);
    expect(specialHintProgress(20)).toBe(20);
  });

  it('plafonne à 20 même au-delà du seuil', () => {
    expect(specialHintProgress(21)).toBe(20);
    expect(specialHintProgress(100)).toBe(20);
  });
});

describe('isSpecialHintUnlocked', () => {
  it("n'est pas débloqué avant le seuil", () => {
    expect(isSpecialHintUnlocked(0)).toBe(false);
    expect(isSpecialHintUnlocked(19)).toBe(false);
  });

  it('est débloqué exactement au seuil et au-delà', () => {
    expect(isSpecialHintUnlocked(20)).toBe(true);
    expect(isSpecialHintUnlocked(21)).toBe(true);
    expect(isSpecialHintUnlocked(100)).toBe(true);
  });
});
