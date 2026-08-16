import type { CriterionDetail } from '../lib/scoring';

export interface GuessEntry {
  id: string;
  nom: string;
  anime: string;
  score: number;
  details: CriterionDetail[];
  n: number;
}

export interface DayState {
  g: GuessEntry[];
  won: boolean;
  h: number;
  t: number;
  e: number;
  /** Id du personnage du jour au moment de la partie — permet de détecter une base de données modifiée depuis. */
  targetId: string;
}
