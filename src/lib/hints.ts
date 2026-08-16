import type { Character } from '../types/character';
import { INDICE_TOUS_LES, MAX_HINTS } from './constants';

export interface HintDefinition {
  label: string;
  value: string;
}

export function buildHintDefinitions(target: Character): HintDefinition[] {
  return [
    { label: 'Race :', value: target.race },
    { label: 'Genre :', value: target.genre },
    { label: 'Première lettre :', value: target.nom[0].toUpperCase() },
    { label: 'Couleur de cheveux :', value: target.couleurCheveux },
    { label: "Anime d'origine :", value: target.animeSource },
  ];
}

export function unlockedHintCount(guessCount: number): number {
  return Math.min(MAX_HINTS, Math.floor(guessCount / INDICE_TOUS_LES));
}

export function guessesUntilNextHint(hintsRevealed: number, guessCount: number): number {
  return (hintsRevealed + 1) * INDICE_TOUS_LES - guessCount;
}
