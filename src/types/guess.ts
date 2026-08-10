export interface GuessEntry {
  id: string;
  nom: string;
  anime: string;
  score: number;
  n: number;
}

export interface DayState {
  g: GuessEntry[];
  won: boolean;
  h: number;
  t: number;
  e: number;
}
