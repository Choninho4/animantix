import { CHARACTERS } from '../data/characters';

export interface AnimeSummary {
  name: string;
  count: number;
  /** Année de sortie de l'anime. En cas d'incohérence entre personnages (voir ANIME_YEAR_INCONSISTENCIES), la plus ancienne est retenue par défaut. */
  year: number;
}

/**
 * Animes dont les personnages n'ont pas tous la même `anneeSortieAnime` — une
 * incohérence de données à corriger à la source, pas à masquer côté affichage.
 */
export const ANIME_YEAR_INCONSISTENCIES: Array<{ name: string; years: number[] }> = (() => {
  const years = new Map<string, Set<number>>();
  for (const c of CHARACTERS) {
    if (!years.has(c.animeSource)) years.set(c.animeSource, new Set());
    years.get(c.animeSource)!.add(c.anneeSortieAnime);
  }
  return [...years.entries()]
    .filter(([, set]) => set.size > 1)
    .map(([name, set]) => ({ name, years: [...set].sort((a, b) => a - b) }));
})();

function buildAnimeList(): AnimeSummary[] {
  const counts = new Map<string, number>();
  const minYears = new Map<string, number>();
  for (const c of CHARACTERS) {
    counts.set(c.animeSource, (counts.get(c.animeSource) ?? 0) + 1);
    const current = minYears.get(c.animeSource);
    if (current === undefined || c.anneeSortieAnime < current) {
      minYears.set(c.animeSource, c.anneeSortieAnime);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count, year: minYears.get(name)! }))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

export const ANIME_LIST: AnimeSummary[] = buildAnimeList();
