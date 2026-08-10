import { describe, expect, it } from 'vitest';
import type { GuessEntry } from '../../types/guess';
import { buildShareText } from '../share';

function entry(score: number, n: number): GuessEntry {
  return { id: `g${n}`, nom: `Guess ${n}`, anime: 'Anime', score, n };
}

describe('buildShareText', () => {
  it('inclut le numéro du jour et le nombre d\'essais, sans jamais révéler de nom', () => {
    const text = buildShareText(42, [entry(30, 1), entry(100, 2)]);
    expect(text).toContain('Animantix #42');
    expect(text).toContain('2 essais');
    expect(text).not.toContain('Guess');
  });

  it('découpe la grille d\'émojis toutes les 5 entrées', () => {
    const guesses = Array.from({ length: 7 }, (_, i) => entry(0, i + 1));
    const text = buildShareText(1, guesses);
    const lines = text.split('\n').slice(1); // retire la ligne d'en-tête
    expect(lines).toHaveLength(2);
    expect([...lines[0]].length).toBeGreaterThan(0);
  });

  it('gère une liste vide', () => {
    const text = buildShareText(1, []);
    expect(text).toContain('0 essais');
  });
});
