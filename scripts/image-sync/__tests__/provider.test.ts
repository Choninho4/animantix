import { describe, expect, it, vi } from 'vitest';
import { FallbackCharacterProvider } from '../provider';

const rei = { malId: 86, name: 'Ayanami, Rei', imageUrl: 'https://cdn/re.jpg' };

describe('FallbackCharacterProvider', () => {
  it('utilise le fallback pour le casting et la recherche seulement après un échec primaire', async () => {
    const primary = {
      fetchAnimeCast: vi.fn().mockRejectedValue(new Error('HTTP 504')),
      searchCharacters: vi.fn().mockRejectedValue(new Error('HTTP 504')),
      fetchTopCharacters: vi.fn(),
    };
    const fallback = {
      fetchAnimeCast: vi.fn().mockResolvedValue([rei]),
      searchCharacters: vi.fn().mockResolvedValue([rei]),
    };
    const provider = new FallbackCharacterProvider(primary, fallback);

    await expect(provider.fetchAnimeCast([30])).resolves.toEqual([rei]);
    await expect(provider.searchCharacters('Rei Ayanami')).resolves.toEqual([rei]);
    expect(fallback.fetchAnimeCast).toHaveBeenCalledWith([30]);
    expect(fallback.searchCharacters).toHaveBeenCalledWith('Rei Ayanami');
  });

  it('conserve le fournisseur primaire lorsqu’il répond', async () => {
    const primary = {
      fetchAnimeCast: vi.fn().mockResolvedValue([rei]),
      searchCharacters: vi.fn().mockResolvedValue([rei]),
      fetchTopCharacters: vi.fn().mockResolvedValue({ characters: [rei], lastPage: 1 }),
    };
    const fallback = { fetchAnimeCast: vi.fn(), searchCharacters: vi.fn() };
    const provider = new FallbackCharacterProvider(primary, fallback);

    await provider.fetchAnimeCast([30]);
    await provider.searchCharacters('Rei Ayanami');
    await expect(provider.fetchTopCharacters(1)).resolves.toEqual({ characters: [rei], lastPage: 1 });
    expect(fallback.fetchAnimeCast).not.toHaveBeenCalled();
    expect(fallback.searchCharacters).not.toHaveBeenCalled();
  });
});
