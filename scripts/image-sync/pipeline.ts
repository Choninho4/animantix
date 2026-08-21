import { canonicalName, matchCharacter, nameVariants, type ProviderCharacter } from './matching';

export interface LocalCharacterIdentity {
  id: string;
  nom: string;
  animeSource: string;
}

interface CharacterSearcher {
  searchCharacters(name: string): Promise<ProviderCharacter[]>;
}

interface CastFetcher {
  fetchAnimeCast(animeIds: number[]): Promise<ProviderCharacter[]>;
}

export function enrichFromCatalogue(
  locals: LocalCharacterIdentity[],
  castByAnime: Map<string, ProviderCharacter[]>,
  candidates: ProviderCharacter[],
): ProviderCharacter[] {
  const localsByName = new Map<string, LocalCharacterIdentity[]>();
  const matchedById = new Map<number, ProviderCharacter>();
  for (const local of locals) {
    const key = canonicalName(local.nom);
    const entries = localsByName.get(key) ?? [];
    entries.push(local);
    localsByName.set(key, entries);
  }

  for (const candidate of candidates) {
    const matchingLocals = new Map<string, LocalCharacterIdentity>();
    for (const variant of nameVariants(candidate.name)) {
      for (const local of localsByName.get(variant) ?? []) matchingLocals.set(local.id, local);
    }
    if (matchingLocals.size !== 1) continue;
    for (const local of matchingLocals.values()) {
      matchedById.set(candidate.malId, candidate);
      const cast = castByAnime.get(local.animeSource) ?? [];
      if (!cast.some((entry) => entry.malId === candidate.malId)) {
        castByAnime.set(local.animeSource, [...cast, candidate]);
      }
    }
  }
  return [...matchedById.values()];
}

export async function fetchCastings(
  animeMap: Record<string, number[]>,
  fetcher: CastFetcher,
  cached = new Map<string, ProviderCharacter[]>(),
  onUpdate?: (castByAnime: Map<string, ProviderCharacter[]>) => Promise<void>,
  maxConsecutiveErrors = 5,
): Promise<{
  castByAnime: Map<string, ProviderCharacter[]>;
  errors: Array<{ anime: string; message: string }>;
}> {
  const castByAnime = new Map(cached);
  const errors: Array<{ anime: string; message: string }> = [];
  let consecutiveErrors = 0;

  for (const [anime, ids] of Object.entries(animeMap)) {
    if (castByAnime.has(anime)) continue;
    if (consecutiveErrors >= maxConsecutiveErrors) {
      errors.push({ anime, message: 'circuit-open' });
      continue;
    }
    try {
      castByAnime.set(anime, await fetcher.fetchAnimeCast(ids));
      consecutiveErrors = 0;
      await onUpdate?.(castByAnime);
    } catch (error) {
      consecutiveErrors += 1;
      errors.push({ anime, message: error instanceof Error ? error.message : String(error) });
    }
  }

  for (const { anime } of errors) castByAnime.set(anime, []);

  return { castByAnime, errors };
}

export async function enrichUnresolvedCharacters(
  locals: LocalCharacterIdentity[],
  castByAnime: Map<string, ProviderCharacter[]>,
  searcher: CharacterSearcher,
  cachedSearches = new Map<string, ProviderCharacter[]>(),
  onUpdate?: (searches: Map<string, ProviderCharacter[]>) => Promise<void>,
  maxConsecutiveErrors = 5,
): Promise<{ errors: Array<{ localId: string; message: string }> }> {
  const errors: Array<{ localId: string; message: string }> = [];
  let consecutiveErrors = 0;
  for (const local of locals) {
    const cast = castByAnime.get(local.animeSource) ?? [];
    if (matchCharacter(local.nom, cast).status === 'matched') continue;

    let searched = cachedSearches.get(local.id);
    if (!searched) {
      if (consecutiveErrors >= maxConsecutiveErrors) {
        errors.push({ localId: local.id, message: 'circuit-open' });
        continue;
      }
      try {
        searched = await searcher.searchCharacters(local.nom);
        consecutiveErrors = 0;
        cachedSearches.set(local.id, searched);
        await onUpdate?.(cachedSearches);
      } catch (error) {
        consecutiveErrors += 1;
        errors.push({ localId: local.id, message: error instanceof Error ? error.message : String(error) });
        continue;
      }
    }
    const byId = new Map(cast.map((candidate) => [candidate.malId, candidate]));
    // A fuzzy result is never selected automatically, but it must remain available
    // for a reviewed local-id -> MAL-id override.
    for (const candidate of searched) byId.set(candidate.malId, candidate);
    castByAnime.set(local.animeSource, [...byId.values()]);
  }
  return { errors };
}
