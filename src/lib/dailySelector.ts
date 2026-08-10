import type { Character } from '../types/character';
import { DATE_REF } from './constants';

/** Générateur pseudo-aléatoire déterministe (xorshift32), pour un tirage reproductible. */
export function seededRng(seed: number): () => number {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >> 17;
    x ^= x << 5;
    x >>>= 0;
    return x / 4294967296;
  };
}

export function seededShuffle<T>(list: T[], seed: number): T[] {
  const arr = list.slice();
  const rng = seededRng(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function dayIndexFor(date: Date, epoch: number = DATE_REF): number {
  const utcMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((utcMidnight - epoch) / 86_400_000);
}

// Cache imbriqué par référence de tableau : évite qu'un mélange calculé pour
// une liste de personnages (ex. dans un test) ne soit réutilisé à tort pour
// une autre liste de longueur différente partageant le même numéro de cycle.
const shuffleCache = new WeakMap<Character[], Map<number, Character[]>>();

export function characterForDayIndex(idx: number, characters: Character[]): Character {
  const n = characters.length;
  const cycle = Math.floor(idx / n);
  let cyclesForList = shuffleCache.get(characters);
  if (!cyclesForList) {
    cyclesForList = new Map();
    shuffleCache.set(characters, cyclesForList);
  }
  let shuffled = cyclesForList.get(cycle);
  if (!shuffled) {
    shuffled = seededShuffle(characters, 20240101 + cycle * 7919);
    cyclesForList.set(cycle, shuffled);
  }
  return shuffled[((idx % n) + n) % n];
}
