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
  /** Ids des essais dont le détail par critère a été révélé (dépense d'un jeton d'analyse), permanent pour la partie. */
  a: string[];
  t: number;
  e: number;
  /** Id du personnage du jour au moment de la partie — permet de détecter une base de données modifiée depuis. */
  targetId: string;
}
