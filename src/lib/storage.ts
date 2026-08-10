import type { DayState } from '../types/guess';
import { EMPTY_STATS, type Stats } from '../types/stats';
import { DAY_KEY_PREFIX, SEEN_KEY, STATS_KEY } from './constants';

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage indisponible (navigation privée, quota…) : on continue sans persister.
  }
}

export function loadStats(): Stats {
  const raw = safeGet(STATS_KEY);
  if (!raw) return { ...EMPTY_STATS, guessDistribution: {} };
  try {
    return { ...EMPTY_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_STATS, guessDistribution: {} };
  }
}

export function saveStats(stats: Stats): void {
  safeSet(STATS_KEY, JSON.stringify(stats));
}

function dayKey(dayIndex: number): string {
  return `${DAY_KEY_PREFIX}${dayIndex}`;
}

export function loadDay(dayIndex: number): DayState | null {
  const raw = safeGet(dayKey(dayIndex));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DayState;
  } catch {
    return null;
  }
}

export function saveDay(dayIndex: number, current: DayState, patch: Partial<DayState> = {}): void {
  const merged: DayState = { ...current, ...patch };
  safeSet(dayKey(dayIndex), JSON.stringify(merged));
}

export function isDayWon(dayIndex: number): boolean {
  const day = loadDay(dayIndex);
  return !!day?.won;
}

export function hasSeenIntro(): boolean {
  return safeGet(SEEN_KEY) !== null;
}

export function markSeen(): void {
  safeSet(SEEN_KEY, '1');
}
