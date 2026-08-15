import { describe, expect, it } from 'vitest';
import type { DayState } from '../../types/guess';
import { EMPTY_STATS } from '../../types/stats';
import { hasSeenIntro, loadDay, loadStats, markSeen, saveDay, saveStats } from '../storage';

describe('storage: stats', () => {
  it('renvoie des stats vides par défaut', () => {
    const stats = loadStats();
    expect(stats.gamesPlayed).toBe(0);
    expect(stats.currentStreak).toBe(0);
    expect(stats.guessDistribution).toEqual({});
    expect(stats.unlockedAchievements).toEqual([]);
  });

  it('fait un aller-retour correct (save puis load)', () => {
    saveStats({ ...EMPTY_STATS, gamesPlayed: 5, gamesWon: 3, currentStreak: 2, maxStreak: 4, guessDistribution: { '1-5': 3 } });
    const stats = loadStats();
    expect(stats.gamesPlayed).toBe(5);
    expect(stats.guessDistribution['1-5']).toBe(3);
  });

  it('dégrade proprement sur une valeur corrompue en localStorage', () => {
    localStorage.setItem('animantix.stats.v1', '{not valid json');
    const stats = loadStats();
    expect(stats.gamesPlayed).toBe(0);
  });

  it("complète à 0/vide les nouveaux champs succès pour un profil existant qui ne les avait pas (pas de reconstruction rétroactive)", () => {
    // Simule un joueur qui avait déjà des stats avant l'introduction des succès :
    // le JSON stocké ne contient aucun des nouveaux champs.
    localStorage.setItem(
      'animantix.stats.v1',
      JSON.stringify({ gamesPlayed: 42, gamesWon: 40, currentStreak: 6, maxStreak: 12, guessDistribution: { '1-5': 40 } }),
    );
    const stats = loadStats();
    expect(stats.gamesPlayed).toBe(42);
    expect(stats.currentStreak).toBe(6);
    expect(stats.animesGuessedEver).toEqual([]);
    expect(stats.winsAllPrecise).toBe(0);
    expect(stats.winsUnder2Min).toBe(0);
    expect(stats.winsWithin5Guesses).toBe(0);
    expect(stats.shareCount).toBe(0);
    expect(stats.daysPlayed).toBe(0);
    expect(stats.lastPlayedDayIndex).toBeNull();
    expect(stats.unlockedAchievements).toEqual([]);
  });
});

describe('storage: jour', () => {
  const empty: DayState = { g: [], won: false, t: Date.now(), e: 0, targetId: 'some-character' };

  it('renvoie null pour un jour jamais joué', () => {
    expect(loadDay(999)).toBeNull();
  });

  it('fait un aller-retour correct (save puis load)', () => {
    saveDay(1, empty, { won: true, e: 42_000 });
    const day = loadDay(1);
    expect(day?.won).toBe(true);
    expect(day?.e).toBe(42_000);
    expect(day?.targetId).toBe('some-character');
  });
});

describe('storage: intro vue', () => {
  it('hasSeenIntro est faux avant le premier markSeen', () => {
    expect(hasSeenIntro()).toBe(false);
    markSeen();
    expect(hasSeenIntro()).toBe(true);
  });
});
