import { beforeEach, describe, expect, it } from 'vitest';
import { CHARACTERS } from '../../data/characters';
import { characterForDayIndex } from '../../lib/dailySelector';
import { saveDay } from '../../lib/storage';
import { useGameStore, todayIndex } from '../useGameStore';

// Reproduit exactement ce que le store écrirait pour une victoire réelle du jour.
function winningGuessEntry(id: string, nom: string, anime: string) {
  return {
    id,
    nom,
    anime,
    results: [],
    correctCount: 8,
    n: 1,
  };
}

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({ initialized: false });
});

describe('loadDay : détection d\'une partie sauvegardée contre un ancien personnage', () => {
  it('réinitialise la partie si le targetId stocké ne correspond plus au personnage actuel du jour', () => {
    const idx = todayIndex();
    const real = characterForDayIndex(idx, CHARACTERS);

    saveDay(
      idx,
      { g: [], won: false, t: Date.now(), e: 0, targetId: 'un-id-qui-nexiste-plus' },
      {
        g: [winningGuessEntry('un-id-qui-nexiste-plus', 'Personnage Fantôme', 'Anime Disparu')],
        won: true,
        e: 12_345,
      },
    );

    useGameStore.getState().loadDay(0);
    const state = useGameStore.getState();

    expect(state.won).toBe(false);
    expect(state.guesses).toEqual([]);
    expect(real.id).not.toBe('un-id-qui-nexiste-plus');
  });

  it('conserve la partie si le targetId stocké correspond bien au personnage actuel du jour', () => {
    const idx = todayIndex();
    const real = characterForDayIndex(idx, CHARACTERS);
    const guess = winningGuessEntry(real.id, real.nom, real.animeSource);

    saveDay(idx, { g: [], won: false, t: Date.now(), e: 0, targetId: real.id }, { g: [guess], won: true, e: 9_999 });

    useGameStore.getState().loadDay(0);
    const state = useGameStore.getState();

    expect(state.won).toBe(true);
    expect(state.guesses).toEqual([guess]);
    expect(state.elapsed).toBe(9_999);
  });
});
