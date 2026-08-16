import { describe, expect, it } from 'vitest';
import { guessesUntilNextToken, tokensAvailable, tokensEarned } from '../analysisTokens';

describe('tokensEarned', () => {
  it('gagne 1 jeton tous les 3 essais, sans plafond', () => {
    expect(tokensEarned(0)).toBe(0);
    expect(tokensEarned(2)).toBe(0);
    expect(tokensEarned(3)).toBe(1);
    expect(tokensEarned(5)).toBe(1);
    expect(tokensEarned(6)).toBe(2);
    expect(tokensEarned(30)).toBe(10);
    expect(tokensEarned(99)).toBe(33);
  });
});

describe('tokensAvailable', () => {
  it('soustrait les jetons déjà dépensés', () => {
    expect(tokensAvailable(3, 0)).toBe(1);
    expect(tokensAvailable(3, 1)).toBe(0);
    expect(tokensAvailable(6, 1)).toBe(1);
    expect(tokensAvailable(6, 2)).toBe(0);
  });

  it('ne descend jamais sous 0', () => {
    expect(tokensAvailable(0, 0)).toBe(0);
    expect(tokensAvailable(3, 5)).toBe(0);
  });
});

describe('guessesUntilNextToken', () => {
  it("calcule l'attente avant le prochain jeton", () => {
    expect(guessesUntilNextToken(0)).toBe(3);
    expect(guessesUntilNextToken(1)).toBe(2);
    expect(guessesUntilNextToken(2)).toBe(1);
    expect(guessesUntilNextToken(3)).toBe(3);
    expect(guessesUntilNextToken(4)).toBe(2);
    expect(guessesUntilNextToken(9)).toBe(3);
  });
});
