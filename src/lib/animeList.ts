import { CHARACTERS } from '../data/characters';

export interface AnimeSummary {
  name: string;
  count: number;
}

function buildAnimeList(): AnimeSummary[] {
  const counts = new Map<string, number>();
  for (const c of CHARACTERS) {
    counts.set(c.animeSource, (counts.get(c.animeSource) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

export const ANIME_LIST: AnimeSummary[] = buildAnimeList();
