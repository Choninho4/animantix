import { JSDOM } from 'jsdom';
import { fetchWithRetry } from './network';
import { metadataRequestGate } from './jikan';
import type { ProviderCharacter } from './matching';

type RequestHtml = (url: string) => Promise<string>;

interface MalPageClientOptions {
  requestHtml?: RequestHtml;
}

function originalImageUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.hostname !== 'cdn.myanimelist.net' || !url.pathname.includes('/images/characters/')) return null;
    url.pathname = url.pathname.replace(/^\/r\/\d+x\d+\//, '/');
    url.search = '';
    return url.toString();
  } catch {
    return null;
  }
}

export function parseMalCharacters(html: string): ProviderCharacter[] {
  const document = new JSDOM(html).window.document;
  const characters = new Map<number, ProviderCharacter>();

  for (const image of document.querySelectorAll<HTMLImageElement>('img[data-src], img[src]')) {
    const link = image.closest<HTMLAnchorElement>('a[href*="/character/"]');
    const match = link?.href.match(/\/character\/(\d+)(?:\/([^/?#]+))?/);
    const imageUrl = originalImageUrl(image.getAttribute('data-src') ?? image.getAttribute('src') ?? '');
    if (!match || !imageUrl) continue;

    const malId = Number(match[1]);
    const row = image.closest('tr');
    const matchingLinks = row ? [...row.querySelectorAll<HTMLAnchorElement>(`a[href*="/character/${malId}/"]`)] : [];
    const visibleName = matchingLinks.map((candidate) => candidate.textContent?.trim() ?? '').find(Boolean);
    const slugName = match[2] ? decodeURIComponent(match[2]).replace(/_/g, ' ') : '';
    const name = image.alt.trim() || visibleName || slugName;
    if (name && !characters.has(malId)) characters.set(malId, { malId, name, imageUrl });
  }

  return [...characters.values()];
}

async function defaultRequestHtml(url: string): Promise<string> {
  const response = await fetchWithRetry(url, {
    maxAttempts: 2,
    beforeAttempt: () => metadataRequestGate.waitForTurn(),
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36',
    },
  });
  return response.text();
}

export class MalPageClient {
  private readonly requestHtml: RequestHtml;

  constructor({ requestHtml = defaultRequestHtml }: MalPageClientOptions = {}) {
    this.requestHtml = requestHtml;
  }

  async fetchAnimeCast(animeIds: number[]): Promise<ProviderCharacter[]> {
    const characters = new Map<number, ProviderCharacter>();
    for (const animeId of animeIds) {
      const html = await this.requestHtml(`https://myanimelist.net/anime/${animeId}/_/characters`);
      for (const character of parseMalCharacters(html)) characters.set(character.malId, character);
    }
    return [...characters.values()];
  }

  async searchCharacters(name: string): Promise<ProviderCharacter[]> {
    const query = new URLSearchParams({ q: name, cat: 'character' });
    try {
      return parseMalCharacters(await this.requestHtml(`https://myanimelist.net/character.php?${query}`));
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('HTTP 404 ')) return [];
      throw error;
    }
  }
}
