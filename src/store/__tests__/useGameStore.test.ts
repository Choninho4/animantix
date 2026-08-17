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
    score: 100,
    details: [],
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
      { g: [], won: false, a: [], sh: false, t: Date.now(), e: 0, targetId: 'un-id-qui-nexiste-plus' },
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

    saveDay(idx, { g: [], won: false, a: [], sh: false, t: Date.now(), e: 0, targetId: real.id }, { g: [guess], won: true, e: 9_999 });

    useGameStore.getState().loadDay(0);
    const state = useGameStore.getState();

    expect(state.won).toBe(true);
    expect(state.guesses).toEqual([guess]);
    expect(state.elapsed).toBe(9_999);
  });
});

describe("jetons d'analyse", () => {
  it('accorde un jeton tous les 3 essais et ne permet de dépenser que ce qui est disponible', () => {
    const idx = todayIndex();
    const target = characterForDayIndex(idx, CHARACTERS);
    const others = CHARACTERS.filter((c) => c.id !== target.id).slice(0, 3);

    useGameStore.getState().loadDay(0);
    expect(useGameStore.getState().requestAnalysis(others[0].id)).toBe(false);

    useGameStore.getState().submitGuess(others[0]);
    useGameStore.getState().submitGuess(others[1]);
    expect(useGameStore.getState().requestAnalysis(others[0].id)).toBe(false);
    expect(useGameStore.getState().analyzedIds).toEqual([]);

    useGameStore.getState().submitGuess(others[2]);
    expect(useGameStore.getState().requestAnalysis(others[0].id)).toBe(true);
    expect(useGameStore.getState().analyzedIds).toEqual([others[0].id]);

    // Un essai déjà analysé ne consomme pas de nouveau jeton.
    expect(useGameStore.getState().requestAnalysis(others[0].id)).toBe(true);
    expect(useGameStore.getState().analyzedIds).toEqual([others[0].id]);

    // Plus aucun jeton disponible pour un autre essai.
    expect(useGameStore.getState().requestAnalysis(others[1].id)).toBe(false);
    expect(useGameStore.getState().analyzedIds).toEqual([others[0].id]);
  });

  it("les essais analysés sont indépendants par jour (aujourd'hui vs archive)", () => {
    const idx = todayIndex();
    const today = characterForDayIndex(idx, CHARACTERS);
    const archiveTarget = characterForDayIndex(idx - 1, CHARACTERS);
    const pool = CHARACTERS.filter((c) => c.id !== today.id && c.id !== archiveTarget.id).slice(0, 3);

    useGameStore.getState().loadDay(0);
    pool.forEach((c) => useGameStore.getState().submitGuess(c));
    useGameStore.getState().requestAnalysis(pool[0].id);
    expect(useGameStore.getState().analyzedIds).toEqual([pool[0].id]);

    useGameStore.getState().loadDay(1);
    expect(useGameStore.getState().analyzedIds).toEqual([]);
    expect(useGameStore.getState().requestAnalysis(pool[0].id)).toBe(false);

    useGameStore.getState().loadDay(0);
    expect(useGameStore.getState().analyzedIds).toEqual([pool[0].id]);
  });
});

describe('indice spécial', () => {
  it('ne se débloque pas avant 20 essais, se débloque à 20, et la révélation est permanente', () => {
    const idx = todayIndex();
    const target = characterForDayIndex(idx, CHARACTERS);
    const pool = CHARACTERS.filter((c) => c.id !== target.id).slice(0, 20);

    useGameStore.getState().loadDay(0);
    useGameStore.getState().revealSpecialHint();
    expect(useGameStore.getState().specialHintRevealed).toBe(false);

    pool.slice(0, 19).forEach((c) => useGameStore.getState().submitGuess(c));
    expect(useGameStore.getState().guesses.length).toBe(19);
    useGameStore.getState().revealSpecialHint();
    expect(useGameStore.getState().specialHintRevealed).toBe(false);

    useGameStore.getState().submitGuess(pool[19]);
    expect(useGameStore.getState().guesses.length).toBe(20);
    useGameStore.getState().revealSpecialHint();
    expect(useGameStore.getState().specialHintRevealed).toBe(true);
  });

  it("est indépendant par jour (aujourd'hui vs archive)", () => {
    const idx = todayIndex();
    const today = characterForDayIndex(idx, CHARACTERS);
    const archiveTarget = characterForDayIndex(idx - 1, CHARACTERS);
    const pool = CHARACTERS.filter((c) => c.id !== today.id && c.id !== archiveTarget.id).slice(0, 20);

    useGameStore.getState().loadDay(0);
    pool.forEach((c) => useGameStore.getState().submitGuess(c));
    useGameStore.getState().revealSpecialHint();
    expect(useGameStore.getState().specialHintRevealed).toBe(true);

    useGameStore.getState().loadDay(1);
    expect(useGameStore.getState().specialHintRevealed).toBe(false);

    useGameStore.getState().loadDay(0);
    expect(useGameStore.getState().specialHintRevealed).toBe(true);
  });
});
