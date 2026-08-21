import { type ProviderCharacter } from './matching';
import { fetchWithRetry, RequestGate } from './network';
import { createPowerShellFetcher, selectJikanFetcher } from './windows-fetch';

type JsonObject = Record<string, unknown>;
type RequestJson = (path: string) => Promise<JsonObject>;

interface JikanClientOptions {
  requestJson?: RequestJson;
}

interface JikanCharacter {
  mal_id: number;
  name: string;
  images?: {
    webp?: { image_url?: string | null };
    jpg?: { image_url?: string | null };
  };
}

export const metadataRequestGate = new RequestGate({ requestsPerMinute: 50 });
const jikanFetcher = selectJikanFetcher(process.platform, createPowerShellFetcher(), fetch);

export const JIKAN_REQUEST_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36',
};

export function attemptsForPath(_path: string): number {
  return 2;
}

async function defaultRequestJson(path: string): Promise<JsonObject> {
  const response = await fetchWithRetry(`https://api.jikan.moe/v4${path}`, {
    maxAttempts: attemptsForPath(path),
    fetcher: jikanFetcher,
    beforeAttempt: () => metadataRequestGate.waitForTurn(),
    headers: JIKAN_REQUEST_HEADERS,
  });
  return (await response.json()) as JsonObject;
}

function providerCharacter(character: JikanCharacter): ProviderCharacter | null {
  const imageUrl = character.images?.webp?.image_url ?? character.images?.jpg?.image_url;
  if (!imageUrl) return null;
  return { malId: character.mal_id, name: character.name, imageUrl };
}

export class JikanClient {
  private readonly requestJson: RequestJson;

  constructor({ requestJson = defaultRequestJson }: JikanClientOptions = {}) {
    this.requestJson = requestJson;
  }

  async fetchAnimeCast(animeIds: number[]): Promise<ProviderCharacter[]> {
    const byId = new Map<number, ProviderCharacter>();
    let successfulRequests = 0;
    let lastError: unknown;
    for (const animeId of animeIds) {
      try {
        const payload = await this.requestJson(`/anime/${animeId}/characters`);
        successfulRequests += 1;
        const entries = (payload.data ?? []) as Array<{ character: JikanCharacter }>;
        for (const entry of entries) {
          const character = providerCharacter(entry.character);
          if (character && !byId.has(character.malId)) byId.set(character.malId, character);
        }
      } catch (error) {
        lastError = error;
      }
    }
    if (successfulRequests === 0 && lastError) throw lastError;
    if (successfulRequests !== animeIds.length) {
      throw new Error(`Casting incomplet (${successfulRequests}/${animeIds.length})`);
    }
    return [...byId.values()];
  }

  async searchCharacters(name: string): Promise<ProviderCharacter[]> {
    const payload = await this.requestJson(`/characters?q=${encodeURIComponent(name)}&limit=25`);
    return ((payload.data ?? []) as JikanCharacter[])
      .map(providerCharacter)
      .filter((character): character is ProviderCharacter => character !== null);
  }

  async fetchTopCharacters(page: number): Promise<{ characters: ProviderCharacter[]; lastPage: number }> {
    const payload = await this.requestJson(`/top/characters?page=${page}`);
    const pagination = (payload.pagination ?? {}) as { last_visible_page?: number };
    return {
      characters: ((payload.data ?? []) as JikanCharacter[])
        .map(providerCharacter)
        .filter((character): character is ProviderCharacter => character !== null),
      lastPage: pagination.last_visible_page ?? page,
    };
  }
}
