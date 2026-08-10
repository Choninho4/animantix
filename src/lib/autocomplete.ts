import type { Character } from '../types/character';

const MAX_SUGGESTIONS = 8;

export function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function matchCharacters(query: string, characters: Character[]): Character[] {
  const q = normalizeForSearch(query.trim());
  if (q.length < 2) return [];

  const starts: Character[] = [];
  const contains: Character[] = [];

  for (const c of characters) {
    const nom = normalizeForSearch(c.nom);
    const anime = normalizeForSearch(c.animeSource);
    if (nom.startsWith(q)) {
      starts.push(c);
    } else if (nom.includes(q) || anime.includes(q)) {
      contains.push(c);
    }
  }

  return starts.concat(contains).slice(0, MAX_SUGGESTIONS);
}

export function findExactMatch(query: string, characters: Character[]): Character | undefined {
  const q = normalizeForSearch(query.trim());
  return characters.find((c) => normalizeForSearch(c.nom) === q);
}
