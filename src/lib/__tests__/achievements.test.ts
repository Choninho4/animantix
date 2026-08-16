import { describe, expect, it } from 'vitest';
import type { AchievementContext } from '../../types/achievement';
import { EMPTY_STATS, type Stats } from '../../types/stats';
import { ACHIEVEMENTS, checkAchievements, getAchievement } from '../achievements';

function makeContext(overrides: Partial<AchievementContext> = {}): AchievementContext {
  return {
    won: false,
    guessCount: 0,
    hintsRevealed: 0,
    elapsedMs: 0,
    firstGuessScore: null,
    distinctAnimesInGame: 0,
    distinctDecadesInGame: 0,
    stats: { ...EMPTY_STATS },
    ...overrides,
  };
}

function makeStats(overrides: Partial<Stats> = {}): Stats {
  return { ...EMPTY_STATS, ...overrides };
}

function unlocked(id: string, ctx: AchievementContext): boolean {
  const achievement = getAchievement(id);
  if (!achievement) throw new Error(`Achievement inconnu : ${id}`);
  return achievement.isUnlocked(ctx);
}

describe('inventaire des succès', () => {
  it('contient exactement 23 succès avec des ids uniques', () => {
    expect(ACHIEVEMENTS).toHaveLength(23);
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(23);
  });

  it('chaque succès a un nom, une description et une catégorie non vides', () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.nom.length).toBeGreaterThan(0);
      expect(a.description.length).toBeGreaterThan(0);
      expect(a.categorie.length).toBeGreaterThan(0);
    }
  });
});

describe('régularité', () => {
  it('first-win : uniquement à la 1ère victoire, pas après', () => {
    expect(unlocked('first-win', makeContext({ won: true, stats: makeStats({ gamesWon: 1 }) }))).toBe(true);
    expect(unlocked('first-win', makeContext({ won: true, stats: makeStats({ gamesWon: 2 }) }))).toBe(false);
    expect(unlocked('first-win', makeContext({ won: false, stats: makeStats({ gamesWon: 1 }) }))).toBe(false);
  });

  it('streak-3/7/30/100 : seuils exacts, pas un de moins', () => {
    for (const [id, threshold] of [
      ['streak-3', 3],
      ['streak-7', 7],
      ['streak-30', 30],
      ['streak-100', 100],
    ] as const) {
      expect(unlocked(id, makeContext({ won: true, stats: makeStats({ currentStreak: threshold }) }))).toBe(true);
      expect(unlocked(id, makeContext({ won: true, stats: makeStats({ currentStreak: threshold - 1 }) }))).toBe(false);
      expect(unlocked(id, makeContext({ won: false, stats: makeStats({ currentStreak: threshold + 5 }) }))).toBe(false);
    }
  });
});

describe('efficacité', () => {
  it('sixth-sense : exactement 1 essai et gagné', () => {
    expect(unlocked('sixth-sense', makeContext({ won: true, guessCount: 1 }))).toBe(true);
    expect(unlocked('sixth-sense', makeContext({ won: true, guessCount: 2 }))).toBe(false);
    expect(unlocked('sixth-sense', makeContext({ won: false, guessCount: 1 }))).toBe(false);
  });

  it('unerring-flair : 3 essais ou moins', () => {
    expect(unlocked('unerring-flair', makeContext({ won: true, guessCount: 3 }))).toBe(true);
    expect(unlocked('unerring-flair', makeContext({ won: true, guessCount: 1 }))).toBe(true);
    expect(unlocked('unerring-flair', makeContext({ won: true, guessCount: 4 }))).toBe(false);
  });

  it('hunter-instinct : 5 essais ou moins ET 10e occurrence cumulée', () => {
    const ctxNotEnoughReps = makeContext({ won: true, guessCount: 5, stats: makeStats({ winsWithin5Guesses: 9 }) });
    expect(unlocked('hunter-instinct', ctxNotEnoughReps)).toBe(false);
    const ctxReached = makeContext({ won: true, guessCount: 5, stats: makeStats({ winsWithin5Guesses: 10 }) });
    expect(unlocked('hunter-instinct', ctxReached)).toBe(true);
    const ctxTooManyGuesses = makeContext({ won: true, guessCount: 6, stats: makeStats({ winsWithin5Guesses: 10 }) });
    expect(unlocked('hunter-instinct', ctxTooManyGuesses)).toBe(false);
  });
});

describe('vitesse', () => {
  it('lightning : strictement moins de 30s', () => {
    expect(unlocked('lightning', makeContext({ won: true, elapsedMs: 29_999 }))).toBe(true);
    expect(unlocked('lightning', makeContext({ won: true, elapsedMs: 30_000 }))).toBe(false);
  });

  it('cold-blood : strictement plus de 5 minutes', () => {
    expect(unlocked('cold-blood', makeContext({ won: true, elapsedMs: 5 * 60_000 + 1 }))).toBe(true);
    expect(unlocked('cold-blood', makeContext({ won: true, elapsedMs: 5 * 60_000 }))).toBe(false);
  });

  it('fast-and-efficient : moins de 2 min ET 5e victoire cumulée du genre', () => {
    const notEnough = makeContext({ won: true, elapsedMs: 60_000, stats: makeStats({ winsUnder2Min: 4 }) });
    expect(unlocked('fast-and-efficient', notEnough)).toBe(false);
    const enough = makeContext({ won: true, elapsedMs: 60_000, stats: makeStats({ winsUnder2Min: 5 }) });
    expect(unlocked('fast-and-efficient', enough)).toBe(true);
    const tooSlow = makeContext({ won: true, elapsedMs: 2 * 60_000, stats: makeStats({ winsUnder2Min: 5 }) });
    expect(unlocked('fast-and-efficient', tooSlow)).toBe(false);
  });
});

describe('sans assistance', () => {
  it('solo : gagné avec zéro indice révélé', () => {
    expect(unlocked('solo', makeContext({ won: true, hintsRevealed: 0 }))).toBe(true);
    expect(unlocked('solo', makeContext({ won: true, hintsRevealed: 1 }))).toBe(false);
  });

  it('purism : zéro indice ET 10e victoire de ce type cumulée', () => {
    const notEnough = makeContext({ won: true, hintsRevealed: 0, stats: makeStats({ winsWithoutHint: 9 }) });
    expect(unlocked('purism', notEnough)).toBe(false);
    const enough = makeContext({ won: true, hintsRevealed: 0, stats: makeStats({ winsWithoutHint: 10 }) });
    expect(unlocked('purism', enough)).toBe(true);
  });
});

describe('persévérance', () => {
  it('tenacity : strictement plus de 50 essais', () => {
    expect(unlocked('tenacity', makeContext({ won: true, guessCount: 51 }))).toBe(true);
    expect(unlocked('tenacity', makeContext({ won: true, guessCount: 50 }))).toBe(false);
  });

  it('unbreakable : strictement plus de 80 essais', () => {
    expect(unlocked('unbreakable', makeContext({ won: true, guessCount: 81 }))).toBe(true);
    expect(unlocked('unbreakable', makeContext({ won: true, guessCount: 80 }))).toBe(false);
  });
});

describe('exploration / diversité', () => {
  it('encyclopedist : 15 animes distincts dans la partie en cours, victoire non requise', () => {
    expect(unlocked('encyclopedist', makeContext({ won: false, distinctAnimesInGame: 15 }))).toBe(true);
    expect(unlocked('encyclopedist', makeContext({ won: false, distinctAnimesInGame: 14 }))).toBe(false);
  });

  it('time-traveler : 5 décennies distinctes dans la partie en cours', () => {
    expect(unlocked('time-traveler', makeContext({ distinctDecadesInGame: 5 }))).toBe(true);
    expect(unlocked('time-traveler', makeContext({ distinctDecadesInGame: 4 }))).toBe(false);
  });

  it('globetrotter : 20 animes distincts cumulés tous temps confondus', () => {
    const animes19 = Array.from({ length: 19 }, (_, i) => `Anime ${i}`);
    const animes20 = Array.from({ length: 20 }, (_, i) => `Anime ${i}`);
    expect(unlocked('globetrotter', makeContext({ stats: makeStats({ animesGuessedEver: animes19 }) }))).toBe(false);
    expect(unlocked('globetrotter', makeContext({ stats: makeStats({ animesGuessedEver: animes20 }) }))).toBe(true);
  });
});

describe('thermomètre', () => {
  it('red-hot : entre 80 et 99 inclus au tout premier essai, pas 100 (déjà trouvé)', () => {
    expect(unlocked('red-hot', makeContext({ firstGuessScore: 80 }))).toBe(true);
    expect(unlocked('red-hot', makeContext({ firstGuessScore: 99 }))).toBe(true);
    expect(unlocked('red-hot', makeContext({ firstGuessScore: 79 }))).toBe(false);
    expect(unlocked('red-hot', makeContext({ firstGuessScore: 100 }))).toBe(false);
    expect(unlocked('red-hot', makeContext({ firstGuessScore: null }))).toBe(false);
  });

  it('way-off : strictement moins de 10 au tout premier essai', () => {
    expect(unlocked('way-off', makeContext({ firstGuessScore: 9 }))).toBe(true);
    expect(unlocked('way-off', makeContext({ firstGuessScore: 10 }))).toBe(false);
    expect(unlocked('way-off', makeContext({ firstGuessScore: null }))).toBe(false);
  });
});

describe('fidélité globale', () => {
  it('veteran : 100 jours joués cumulés', () => {
    expect(unlocked('veteran', makeContext({ stats: makeStats({ daysPlayed: 100 }) }))).toBe(true);
    expect(unlocked('veteran', makeContext({ stats: makeStats({ daysPlayed: 99 }) }))).toBe(false);
  });

  it('first-share : dès le 1er partage', () => {
    expect(unlocked('first-share', makeContext({ stats: makeStats({ shareCount: 1 }) }))).toBe(true);
    expect(unlocked('first-share', makeContext({ stats: makeStats({ shareCount: 0 }) }))).toBe(false);
  });

  it('ambassador : 20 partages cumulés', () => {
    expect(unlocked('ambassador', makeContext({ stats: makeStats({ shareCount: 20 }) }))).toBe(true);
    expect(unlocked('ambassador', makeContext({ stats: makeStats({ shareCount: 19 }) }))).toBe(false);
  });
});

describe('checkAchievements (runner)', () => {
  it('ne renvoie que les succès nouvellement débloqués, jamais ceux déjà acquis', () => {
    const ctx = makeContext({ won: true, stats: makeStats({ gamesWon: 1, currentStreak: 1 }) });
    const result = checkAchievements(ctx, ['first-win']);
    expect(result).not.toContain('first-win');
  });

  it('renvoie plusieurs ids si plusieurs conditions sont remplies simultanément', () => {
    const ctx = makeContext({
      won: true,
      guessCount: 1,
      hintsRevealed: 0,
      elapsedMs: 10_000,
      firstGuessScore: 100,
      stats: makeStats({ gamesWon: 1, currentStreak: 1 }),
    });
    const result = checkAchievements(ctx, []);
    expect(result).toEqual(expect.arrayContaining(['first-win', 'sixth-sense', 'lightning', 'solo']));
    expect(result.length).toBeGreaterThanOrEqual(4);
  });

  it("renvoie un tableau vide quand rien de neuf n'est débloqué", () => {
    const ctx = makeContext({ won: false });
    expect(checkAchievements(ctx, [])).toEqual([]);
  });

  it('un succès déjà cassé (ex. streak retombé) reste acquis — le runner ne le redécouvre pas, mais ne le retire pas non plus', () => {
    // Le retrait n'est pas de la responsabilité du runner : il ne fait que
    // détecter les nouveaux déblocages. La persistance définitive est gérée
    // par l'appelant qui ne fait qu'ADD à la liste, jamais de retrait.
    const ctx = makeContext({ won: true, stats: makeStats({ currentStreak: 1 }) });
    const result = checkAchievements(ctx, ['streak-7']);
    expect(result).not.toContain('streak-7');
  });
});
