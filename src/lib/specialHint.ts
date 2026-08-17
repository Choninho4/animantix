import { SPECIAL_HINT_THRESHOLD } from './constants';

/** Progression vers le déblocage, plafonnée au seuil (jamais > 20/20 affiché). */
export function specialHintProgress(guessCount: number): number {
  return Math.min(guessCount, SPECIAL_HINT_THRESHOLD);
}

export function isSpecialHintUnlocked(guessCount: number): boolean {
  return guessCount >= SPECIAL_HINT_THRESHOLD;
}
