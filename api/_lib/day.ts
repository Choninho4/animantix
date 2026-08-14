import { DATE_REF } from '../../src/lib/constants.js';

const MS_PER_DAY = 86_400_000;
const TOLERANCE_DAYS = 2;

/**
 * Le classement ne couvre que le jour courant : le `day` envoyé par le client
 * est borné à ±2 jours autour du jour calculé côté serveur (marge pour les
 * fuseaux horaires, puisque le client calcule son `dayIndex` sur sa date locale).
 */
export function isPlausibleDayIndex(day: unknown): day is number {
  if (typeof day !== 'number' || !Number.isInteger(day)) return false;
  const serverToday = Math.floor((Date.now() - DATE_REF) / MS_PER_DAY);
  return day >= 0 && Math.abs(day - serverToday) <= TOLERANCE_DAYS;
}

export const LEADERBOARD_TTL_SECONDS = 172_800; // 48h
