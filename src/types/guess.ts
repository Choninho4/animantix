import type { CriterionResult } from '../lib/comparison';

export interface GuessEntry {
  id: string;
  nom: string;
  anime: string;
  results: CriterionResult[];
  correctCount: number;
  n: number;
}

export interface DayState {
  g: GuessEntry[];
  won: boolean;
  t: number;
  e: number;
  /** Id du personnage du jour au moment de la partie — permet de détecter une base de données modifiée depuis. */
  targetId: string;
}
