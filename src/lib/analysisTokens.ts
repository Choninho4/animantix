import { TOKENS_TOUS_LES } from './constants';

/** Nombre total de jetons gagnés à ce nombre d'essais, cumulatif et sans plafond. */
export function tokensEarned(guessCount: number): number {
  return Math.floor(guessCount / TOKENS_TOUS_LES);
}

/** Jetons non encore dépensés : gagnés moins déjà consommés (un par essai analysé). */
export function tokensAvailable(guessCount: number, analyzedCount: number): number {
  return Math.max(0, tokensEarned(guessCount) - analyzedCount);
}

/** Essais restants avant le prochain jeton, quel que soit le nombre déjà dépensés. */
export function guessesUntilNextToken(guessCount: number): number {
  const remainder = guessCount % TOKENS_TOUS_LES;
  return remainder === 0 ? TOKENS_TOUS_LES : TOKENS_TOUS_LES - remainder;
}

/** Essais déjà effectués dans le cycle en cours vers le prochain jeton (0 juste après un jeton gagné). */
export function tokenCycleProgress(guessCount: number): number {
  return guessCount % TOKENS_TOUS_LES;
}
