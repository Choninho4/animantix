import type { Stats } from './stats';

export type AchievementCategory =
  | 'regularite'
  | 'efficacite'
  | 'vitesse'
  | 'sans-assistance'
  | 'perseverance'
  | 'exploration'
  | 'thermometre'
  | 'fidelite';

export interface AchievementContext {
  won: boolean;
  guessCount: number;
  elapsedMs: number;
  /** Nombre de critères corrects (sur 8) au tout premier essai de la partie, ou null si aucun essai. */
  firstGuessCorrectCount: number | null;
  /** true si tous les essais de la partie ont eu au moins PRECISE_THRESHOLD critères corrects. */
  allGuessesPrecise: boolean;
  distinctAnimesInGame: number;
  distinctDecadesInGame: number;
  stats: Stats;
}

export interface Achievement {
  id: string;
  nom: string;
  description: string;
  categorie: AchievementCategory;
  isUnlocked(ctx: AchievementContext): boolean;
}
