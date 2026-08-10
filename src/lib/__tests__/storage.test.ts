import { describe, expect, it } from 'vitest';
import type { DayState } from '../../types/guess';
import {
  hasSeenIntro,
  isDayWon,
  loadDay,
  loadStats,
  markSeen,
  saveDay,
  saveStats,
} from '../storage';

describe('storage: stats', () => {
  it('renvoie des stats vides par défaut', () => {
    const stats = loadStats();
    expect(stats.gamesPlayed).toBe(0);
    expect(stats.currentStreak).toBe(0);
    expect(stats.guessDistribution).toEqual({});
  });

  it('fait un aller-retour correct (save puis load)', () => {
    saveStats({ gamesPlayed: 5, gamesWon: 3, currentStreak: 2, maxStreak: 4, guessDistribution: { '1-5': 3 } });
    const stats = loadStats();
    expect(stats.gamesPlayed).toBe(5);
    expect(stats.guessDistribution['1-5']).toBe(3);
  });

  it('dégrade proprement sur une valeur corrompue en localStorage', () => {
    localStorage.setItem('animantix.stats.v1', '{not valid json');
    const stats = loadStats();
    expect(stats.gamesPlayed).toBe(0);
  });
});

describe('storage: jour', () => {
  const empty: DayState = { g: [], won: false, h: 0, t: Date.now(), e: 0 };

  it('renvoie null pour un jour jamais joué', () => {
    expect(loadDay(999)).toBeNull();
  });

  it('fait un aller-retour correct (save puis load)', () => {
    saveDay(1, empty, { won: true, h: 2 });
    const day = loadDay(1);
    expect(day?.won).toBe(true);
    expect(day?.h).toBe(2);
  });

  it('isDayWon reflète l\'état won persisté', () => {
    expect(isDayWon(2)).toBe(false);
    saveDay(2, empty, { won: true });
    expect(isDayWon(2)).toBe(true);
  });
});

describe('storage: intro vue', () => {
  it('hasSeenIntro est faux avant le premier markSeen', () => {
    expect(hasSeenIntro()).toBe(false);
    markSeen();
    expect(hasSeenIntro()).toBe(true);
  });
});
