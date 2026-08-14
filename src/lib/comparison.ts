import type { Character } from '../types/character';

export type CriterionKey = 'anime' | 'role' | 'camp' | 'race' | 'pouvoir' | 'genre' | 'decennie' | 'cheveux';

export interface CriterionResult {
  critere: CriterionKey;
  valeurAffichee: string;
  status: 'correct' | 'incorrect';
  /** Uniquement pour `decennie` quand incorrect : sens vers le personnage du jour. */
  direction?: 'haut' | 'bas';
}

export const CRITERIA_ORDER: Array<{ key: CriterionKey; label: string }> = [
  { key: 'anime', label: 'Anime' },
  { key: 'role', label: 'Rôle' },
  { key: 'camp', label: 'Camp' },
  { key: 'race', label: 'Race' },
  { key: 'pouvoir', label: 'Pouvoir' },
  { key: 'genre', label: 'Genre' },
  { key: 'decennie', label: 'Décennie' },
  { key: 'cheveux', label: 'Cheveux' },
];

function decadeOf(year: number): number {
  return Math.floor(year / 10) * 10;
}

function binary(critere: CriterionKey, guessValue: string, targetValue: string): CriterionResult {
  return {
    critere,
    valeurAffichee: guessValue,
    status: guessValue === targetValue ? 'correct' : 'incorrect',
  };
}

/** Compare une proposition au personnage du jour, critère par critère — binaire, sans notion de proximité. */
export function compareGuess(guess: Character, target: Character): CriterionResult[] {
  const guessDecade = decadeOf(guess.anneeSortieAnime);
  const targetDecade = decadeOf(target.anneeSortieAnime);
  const decennieCorrect = guessDecade === targetDecade;

  return [
    binary('anime', guess.animeSource, target.animeSource),
    binary('role', guess.roleNarratif, target.roleNarratif),
    binary('camp', guess.campMoral, target.campMoral),
    binary('race', guess.race, target.race),
    binary('pouvoir', guess.categoriePouvoir, target.categoriePouvoir),
    binary('genre', guess.genre, target.genre),
    {
      critere: 'decennie',
      valeurAffichee: `${guessDecade}s`,
      status: decennieCorrect ? 'correct' : 'incorrect',
      direction: decennieCorrect ? undefined : targetDecade < guessDecade ? 'bas' : 'haut',
    },
    binary('cheveux', guess.couleurCheveux, target.couleurCheveux),
  ];
}

export function correctCount(results: CriterionResult[]): number {
  return results.filter((r) => r.status === 'correct').length;
}

export function isWinningComparison(results: CriterionResult[]): boolean {
  return results.every((r) => r.status === 'correct');
}
