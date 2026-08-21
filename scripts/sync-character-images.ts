import { access, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHARACTERS } from '../src/data/characters/index';
import { canReusePortrait, CheckpointStore, type CheckpointEntry } from './image-sync/checkpoint';
import {
  addProvisionalCandidates,
  restoreProvisionalCastings,
  reusableCastCache,
  type CastCacheMetadata,
} from './image-sync/cast-cache';
import {
  cataloguePage,
  recordCatalogueFailure,
  recordCatalogueSuccess,
  type CatalogueProgress,
} from './image-sync/catalogue-progress';
import { JikanClient } from './image-sync/jikan';
import { MalPageClient } from './image-sync/mal-page';
import { type ProviderCharacter } from './image-sync/matching';
import { fetchWithRetry, RequestGate } from './image-sync/network';
import { enrichFromCatalogue, enrichUnresolvedCharacters, fetchCastings } from './image-sync/pipeline';
import { convertPortrait, PORTRAIT_PROCESSING_VERSION } from './image-sync/portrait';
import { rotateItems } from './image-sync/progress';
import { FallbackCharacterProvider } from './image-sync/provider';
import { charactersNeedingSearch, resolveCharacters } from './image-sync/resolution';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configDirectory = join(root, 'scripts', 'image-sync');
const outputDirectory = join(root, 'public', 'assets', 'characters');
const checkpointStore = new CheckpointStore(join(configDirectory, '.checkpoint.json'));

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

interface TopCatalogueCache extends CatalogueProgress {
  matches: ProviderCharacter[];
}

async function main(): Promise<void> {
  const animeMap = await readJson<Record<string, number[]>>(join(configDirectory, 'anime-map.json'));
  const overrides = await readJson<Record<string, number>>(join(configDirectory, 'overrides.json'));
  const animeNames = [...new Set(CHARACTERS.map((character) => character.animeSource))];
  const missingAnimeMappings = animeNames.filter((anime) => !animeMap[anime]?.length);
  const unknownAnimeMappings = Object.keys(animeMap).filter((anime) => !animeNames.includes(anime));
  if (missingAnimeMappings.length || unknownAnimeMappings.length) {
    throw new Error(
      `Anime map mismatch. Missing: ${missingAnimeMappings.join(', ') || 'none'}; unknown: ${unknownAnimeMappings.join(', ') || 'none'}`,
    );
  }
  const checkpoint = await checkpointStore.load();

  const progressPath = join(configDirectory, '.progress.json');
  const progress = (await exists(progressPath))
    ? await readJson<{ castingOffset: number; searchOffset: number }>(progressPath)
    : { castingOffset: 0, searchOffset: 0 };
  const orderedAnimeMap = Object.fromEntries(rotateItems(Object.entries(animeMap), progress.castingOffset));
  const identities = CHARACTERS.map(({ id, nom, animeSource }) => ({ id, nom, animeSource }));
  await writeJson(progressPath, {
    castingOffset: progress.castingOffset + 5,
    searchOffset: progress.searchOffset + 5,
  });

  const client = new FallbackCharacterProvider(new JikanClient(), new MalPageClient());
  const castCachePath = join(configDirectory, '.cast-cache.json');
  const castCacheMetadataPath = join(configDirectory, '.cast-cache-meta.json');
  const storedCastings = (await exists(castCachePath))
    ? new Map(Object.entries(await readJson<Record<string, Awaited<ReturnType<JikanClient['fetchAnimeCast']>>>>(castCachePath)))
    : new Map<string, Awaited<ReturnType<JikanClient['fetchAnimeCast']>>>();
  addProvisionalCandidates(
    storedCastings,
    Object.values(checkpoint.entries).map((entry) => ({
      anime: entry.anime,
      malId: entry.providerCharacterId,
      name: entry.providerName,
      imageUrl: entry.sourceUrl,
    })),
  );
  const castCacheMetadata = (await exists(castCacheMetadataPath))
    ? await readJson<CastCacheMetadata>(castCacheMetadataPath)
    : {};
  const cachedCastings = reusableCastCache(animeMap, storedCastings, castCacheMetadata);
  console.log(`[casting] ${cachedCastings.size}/${animeNames.length} licences reprises du cache`);
  const castingResult = await fetchCastings(orderedAnimeMap, client, cachedCastings, async (castings) => {
    for (const [anime, cast] of castings) storedCastings.set(anime, cast);
    await writeJson(castCachePath, Object.fromEntries(storedCastings));
    await writeJson(
      castCacheMetadataPath,
      Object.fromEntries(
        [...castings.keys()].map((anime) => [anime, { version: 2, animeIds: animeMap[anime] }]),
      ),
    );
    console.log(`[casting] ${castings.size}/${animeNames.length} licences récupérées`);
  });
  const castByAnime = castingResult.castByAnime;
  restoreProvisionalCastings(castByAnime, castingResult.errors, storedCastings);
  for (const error of castingResult.errors) console.warn(`[casting] ${error.anime}: ${error.message}; recherche directe utilisée`);

  const unresolvedIdentities = charactersNeedingSearch(identities, castByAnime, overrides);
  const orderedIdentities = rotateItems(unresolvedIdentities, progress.searchOffset);
  console.log(`[recherche] rotation parmi ${unresolvedIdentities.length} personnages non résolus`);

  const searchCachePath = join(configDirectory, '.search-cache.json');
  const cachedSearches = (await exists(searchCachePath))
    ? new Map(Object.entries(await readJson<Record<string, Awaited<ReturnType<JikanClient['searchCharacters']>>>>(searchCachePath)))
    : new Map<string, Awaited<ReturnType<JikanClient['searchCharacters']>>>();
  console.log(`[recherche] ${cachedSearches.size} résultats repris du cache`);
  const searchResult = await enrichUnresolvedCharacters(orderedIdentities, castByAnime, client, cachedSearches, async (searches) => {
    await writeJson(searchCachePath, Object.fromEntries(searches));
    if (searches.size % 10 === 0) console.log(`[recherche] ${searches.size} personnages vérifiés`);
  });
  for (const error of searchResult.errors) console.warn(`[recherche] ${error.localId}: ${error.message}`);

  const topCachePath = join(configDirectory, '.top-cache.json');
  const storedTopCache = (await exists(topCachePath))
    ? await readJson<Partial<TopCatalogueCache>>(topCachePath)
    : {};
  const topCache: TopCatalogueCache = {
    nextPage: storedTopCache.nextPage ?? 1,
    lastPage: storedTopCache.lastPage ?? null,
    failedPages: storedTopCache.failedPages ?? [],
    matches: storedTopCache.matches ?? [],
  };
  enrichFromCatalogue(identities, castByAnime, topCache.matches);
  let resolution = resolveCharacters(identities, castByAnime, overrides);
  const catalogueErrors: Array<{ page: number; message: string }> = [];
  let consecutiveCatalogueErrors = 0;
  let catalogueRetryBudget = 5;

  while (resolution.issues.length > 0) {
    const selectedPage = cataloguePage(topCache, catalogueRetryBudget > 0);
    if (!selectedPage) break;
    const { page, retry } = selectedPage;
    if (retry) catalogueRetryBudget -= 1;
    try {
      const result = await client.fetchTopCharacters(page);
      const matches = enrichFromCatalogue(identities, castByAnime, result.characters);
      const matchesById = new Map(topCache.matches.map((candidate) => [candidate.malId, candidate]));
      for (const candidate of matches) matchesById.set(candidate.malId, candidate);
      topCache.matches = [...matchesById.values()];
      recordCatalogueSuccess(topCache, page, retry, result.lastPage);
      await writeJson(topCachePath, topCache);
      consecutiveCatalogueErrors = 0;
      resolution = resolveCharacters(identities, castByAnime, overrides);
      if (matches.length > 0 || page % 25 === 0) {
        console.log(`[catalogue] page ${page}/${result.lastPage}, ${resolution.resolved.length}/${identities.length} résolus`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      catalogueErrors.push({ page, message });
      recordCatalogueFailure(topCache, page, retry);
      await writeJson(topCachePath, topCache);
      consecutiveCatalogueErrors += 1;
      console.warn(`[catalogue] page ${page}: ${message}`);
      if (consecutiveCatalogueErrors >= 5) break;
    }
  }

  const resolutionReport = {
    generatedAt: new Date().toISOString(),
    total: CHARACTERS.length,
    resolved: resolution.resolved.length,
    automatic: resolution.resolved.filter((entry) => entry.match === 'automatic').length,
    overrides: resolution.resolved.filter((entry) => entry.match === 'override').length,
    castingErrors: castingResult.errors,
    searchErrors: searchResult.errors,
    cataloguePage: topCache.nextPage - 1,
    catalogueLastPage: topCache.lastPage,
    catalogueFailedPages: topCache.failedPages,
    catalogueErrors,
    issues: resolution.issues,
  };
  await writeJson(join(configDirectory, 'report.json'), resolutionReport);

  const downloadGate = new RequestGate({ requestsPerMinute: 50 });
  const manifestEntries: Record<string, CheckpointEntry> = {};

  for (const [index, entry] of resolution.resolved.entries()) {
    const local = CHARACTERS.find((character) => character.id === entry.localId)!;
    const relativePath = `/assets/characters/${local.id}.webp`;
    const outputPath = join(outputDirectory, `${local.id}.webp`);
    const existing = checkpoint.entries[local.id];
    if (
      existing &&
      (await exists(outputPath)) &&
      canReusePortrait(
        existing,
        (await stat(outputPath)).size,
        PORTRAIT_PROCESSING_VERSION,
        entry.provider.malId,
      )
    ) {
      manifestEntries[local.id] = existing;
      console.log(`[${index + 1}/${CHARACTERS.length}] repris ${local.id}`);
      continue;
    }

    const response = await fetchWithRetry(entry.provider.imageUrl, { beforeAttempt: () => downloadGate.waitForTurn() });
    const portrait = await convertPortrait(Buffer.from(await response.arrayBuffer()), outputPath);
    const record: CheckpointEntry = {
      ...portrait,
      localId: local.id,
      name: local.nom,
      anime: local.animeSource,
      provider: 'jikan',
      providerCharacterId: entry.provider.malId,
      providerName: entry.provider.name,
      sourceUrl: entry.provider.imageUrl,
      localPath: relativePath,
      width: 256,
      height: 256,
      fetchedAt: new Date().toISOString(),
      match: entry.match,
      processingVersion: PORTRAIT_PROCESSING_VERSION,
    };
    checkpoint.entries[local.id] = record;
    manifestEntries[local.id] = record;
    await checkpointStore.save(checkpoint);
    console.log(`[${index + 1}/${CHARACTERS.length}] téléchargé ${local.id}`);
  }

  const hashes = new Map<string, string[]>();
  for (const [id, entry] of Object.entries(manifestEntries)) {
    const ids = hashes.get(entry.sha256) ?? [];
    ids.push(id);
    hashes.set(entry.sha256, ids);
  }
  const duplicates = [...hashes.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([sha256, ids]) => ({ sha256, ids }));

  await writeJson(join(configDirectory, 'manifest.json'), {
    generatedAt: new Date().toISOString(),
    count: Object.keys(manifestEntries).length,
    entries: manifestEntries,
  });
  const missing = resolution.issues.map((issue) => issue.localId);
  await writeJson(join(configDirectory, 'report.json'), { ...resolutionReport, duplicates, missing });
  console.log(`Import : ${Object.keys(manifestEntries).length}/${CHARACTERS.length} portraits, ${duplicates.length} doublons potentiels.`);
  if (resolution.issues.length) {
    throw new Error(`${resolution.issues.length} personnages non résolus. Voir scripts/image-sync/report.json.`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
