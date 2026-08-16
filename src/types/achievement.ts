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
  hintsRevealed: number;
  elapsedMs: number;
  firstGuessScore: number | null;
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
