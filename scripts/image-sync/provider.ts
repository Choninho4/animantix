import type { ProviderCharacter } from './matching';

interface CharacterProvider {
  fetchAnimeCast(animeIds: number[]): Promise<ProviderCharacter[]>;
  searchCharacters(name: string): Promise<ProviderCharacter[]>;
}

interface PrimaryCharacterProvider extends CharacterProvider {
  fetchTopCharacters(page: number): Promise<{ characters: ProviderCharacter[]; lastPage: number }>;
}

export class FallbackCharacterProvider implements PrimaryCharacterProvider {
  constructor(
    private readonly primary: PrimaryCharacterProvider,
    private readonly fallback: CharacterProvider,
  ) {}

  async fetchAnimeCast(animeIds: number[]): Promise<ProviderCharacter[]> {
    try {
      return await this.primary.fetchAnimeCast(animeIds);
    } catch {
      return this.fallback.fetchAnimeCast(animeIds);
    }
  }

  async searchCharacters(name: string): Promise<ProviderCharacter[]> {
    try {
      return await this.primary.searchCharacters(name);
    } catch {
      return this.fallback.searchCharacters(name);
    }
  }

  fetchTopCharacters(page: number): Promise<{ characters: ProviderCharacter[]; lastPage: number }> {
    return this.primary.fetchTopCharacters(page);
  }
}
