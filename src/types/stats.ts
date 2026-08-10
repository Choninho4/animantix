export type GuessBucket = '1-5' | '6-10' | '11-20' | '21-40' | '41+';

export interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Partial<Record<GuessBucket, number>>;
}

export const EMPTY_STATS: Stats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {},
};

export function guessBucketFor(n: number): GuessBucket {
  if (n <= 5) return '1-5';
  if (n <= 10) return '6-10';
  if (n <= 20) return '11-20';
  if (n <= 40) return '21-40';
  return '41+';
}
