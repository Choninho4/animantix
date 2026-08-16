export type GuessBucket = '1-5' | '6-10' | '11-20' | '21-40' | '41+';

export interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Partial<Record<GuessBucket, number>>;

  /** Noms d'animes (animeSource) déjà proposés en essai, tous temps confondus — pour Globe-trotter. */
  animesGuessedEver: string[];
  /** Victoires sans avoir dépensé le moindre jeton d'analyse, cumulées — pour Purisme. */
  winsWithoutTokens: number;
  /** Victoires obtenues en moins de 2 minutes, cumulées — pour Rapide et efficace. */
  winsUnder2Min: number;
  /** Victoires obtenues en 5 essais ou moins, cumulées — pour Instinct de chasseur. */
  winsWithin5Guesses: number;
  /** Nombre de fois où le résultat a été partagé — pour Premier partage / Ambassadeur. */
  shareCount: number;
  /** Nombre de jours distincts où au moins un essai a été soumis — pour Vétéran. */
  daysPlayed: number;
  /** Dernier jour (index) où daysPlayed a été incrémenté, pour éviter les doublons. */
  lastPlayedDayIndex: number | null;
  /** Ids des succès déjà débloqués, définitivement acquis. */
  unlockedAchievements: string[];
}

export const EMPTY_STATS: Stats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {},
  animesGuessedEver: [],
  winsWithoutTokens: 0,
  winsUnder2Min: 0,
  winsWithin5Guesses: 0,
  shareCount: 0,
  daysPlayed: 0,
  lastPlayedDayIndex: null,
  unlockedAchievements: [],
};

export function guessBucketFor(n: number): GuessBucket {
  if (n <= 5) return '1-5';
  if (n <= 10) return '6-10';
  if (n <= 20) return '11-20';
  if (n <= 40) return '21-40';
  return '41+';
}
