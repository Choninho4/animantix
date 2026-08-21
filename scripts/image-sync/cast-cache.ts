import type { ProviderCharacter } from './matching';

export interface CastCacheMetadataEntry {
  version: 2;
  animeIds: number[];
}

export type CastCacheMetadata = Record<string, CastCacheMetadataEntry | number[]>;

interface ProvisionalCandidate extends ProviderCharacter {
  anime: string;
}

export function addProvisionalCandidates(
  castings: Map<string, ProviderCharacter[]>,
  candidates: ProvisionalCandidate[],
): void {
  for (const { anime, malId, name, imageUrl } of candidates) {
    const existing = castings.get(anime) ?? [];
    if (existing.some((candidate) => candidate.malId === malId)) continue;
    castings.set(anime, [...existing, { malId, name, imageUrl }]);
  }
}

export function reusableCastCache(
  animeMap: Record<string, number[]>,
  cached: Map<string, ProviderCharacter[]>,
  metadata: CastCacheMetadata,
): Map<string, ProviderCharacter[]> {
  return new Map(
    [...cached].filter(([anime]) => {
      const expected = animeMap[anime];
      const stored = metadata[anime];
      if (expected === undefined || stored === undefined) return false;
      if (Array.isArray(stored)) {
        return expected.length === 1 && JSON.stringify(expected) === JSON.stringify(stored);
      }
      return stored.version === 2 && JSON.stringify(expected) === JSON.stringify(stored.animeIds);
    }),
  );
}

export function restoreProvisionalCastings(
  castings: Map<string, ProviderCharacter[]>,
  errors: Array<{ anime: string; message: string }>,
  stored: Map<string, ProviderCharacter[]>,
): void {
  for (const { anime } of errors) {
    if ((castings.get(anime)?.length ?? 0) > 0) continue;
    const provisional = stored.get(anime);
    if (provisional?.length) castings.set(anime, provisional);
  }
}
