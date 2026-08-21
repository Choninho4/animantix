import { describe, expect, it, vi } from 'vitest';
import { enrichFromCatalogue, enrichUnresolvedCharacters, fetchCastings } from '../pipeline';

const imageUrl = 'https://cdn.example/portrait.webp';

describe('enrichUnresolvedCharacters', () => {
  it('ne recherche directement que les absents du casting et conserve tous les candidats pour les overrides', async () => {
    const locals = [
      { id: 'naruto', nom: 'Naruto Uzumaki', animeSource: 'Naruto' },
      { id: 'zoro', nom: 'Roronoa Zoro', animeSource: 'One Piece' },
    ];
    const castByAnime = new Map([
      ['Naruto', [{ malId: 1, name: 'Uzumaki, Naruto', imageUrl }]],
      ['One Piece', []],
    ]);
    const searchCharacters = vi.fn().mockResolvedValue([
      { malId: 2, name: 'Zoro, Roronoa', imageUrl: `${imageUrl}?zoro` },
      { malId: 3, name: 'Zorro', imageUrl: `${imageUrl}?wrong` },
    ]);

    await enrichUnresolvedCharacters(locals, castByAnime, { searchCharacters });

    expect(searchCharacters).toHaveBeenCalledTimes(1);
    expect(searchCharacters).toHaveBeenCalledWith('Roronoa Zoro');
    expect(castByAnime.get('One Piece')).toContainEqual({
      malId: 2,
      name: 'Zoro, Roronoa',
      imageUrl: `${imageUrl}?zoro`,
    });
    expect(castByAnime.get('One Piece')).toContainEqual({
      malId: 3,
      name: 'Zorro',
      imageUrl: `${imageUrl}?wrong`,
    });
  });

  it('met en cache les recherches réussies et continue après une recherche en erreur', async () => {
    const locals = [
      { id: 'goku', nom: 'Son Goku', animeSource: 'Dragon Ball' },
      { id: 'vegeta', nom: 'Vegeta', animeSource: 'Dragon Ball' },
    ];
    const castByAnime = new Map([['Dragon Ball', []]]);
    const cachedSearches = new Map<string, Array<{ malId: number; name: string; imageUrl: string }>>();
    const searchCharacters = vi
      .fn()
      .mockRejectedValueOnce(new Error('HTTP 504'))
      .mockResolvedValueOnce([{ malId: 2, name: 'Vegeta', imageUrl }]);

    const result = await enrichUnresolvedCharacters(
      locals,
      castByAnime,
      { searchCharacters },
      cachedSearches,
    );

    expect(result.errors).toEqual([{ localId: 'goku', message: 'HTTP 504' }]);
    expect(cachedSearches.get('vegeta')).toEqual([{ malId: 2, name: 'Vegeta', imageUrl }]);
    expect(castByAnime.get('Dragon Ball')).toContainEqual({ malId: 2, name: 'Vegeta', imageUrl });
  });

  it('ouvre aussi le coupe-circuit des recherches individuelles', async () => {
    const locals = ['a', 'b', 'c'].map((id) => ({ id, nom: id.toUpperCase(), animeSource: 'Anime' }));
    const searchCharacters = vi.fn().mockRejectedValue(new Error('HTTP 504'));

    const result = await enrichUnresolvedCharacters(
      locals,
      new Map([['Anime', []]]),
      { searchCharacters },
      new Map(),
      undefined,
      1,
    );

    expect(searchCharacters).toHaveBeenCalledTimes(1);
    expect(result.errors).toEqual([
      { localId: 'a', message: 'HTTP 504' },
      { localId: 'b', message: 'circuit-open' },
      { localId: 'c', message: 'circuit-open' },
    ]);
  });
});

describe('fetchCastings', () => {
  it('réutilise le cache et continue si un casting Jikan reste indisponible', async () => {
    const cached = [{ malId: 1, name: 'Luffy', imageUrl }];
    const fetchAnimeCast = vi.fn().mockRejectedValue(new Error('HTTP 504'));

    const result = await fetchCastings(
      { 'One Piece': [21], 'Dragon Ball': [223] },
      { fetchAnimeCast },
      new Map([['One Piece', cached]]),
    );

    expect(fetchAnimeCast).toHaveBeenCalledTimes(1);
    expect(fetchAnimeCast).toHaveBeenCalledWith([223]);
    expect(result.castByAnime.get('One Piece')).toBe(cached);
    expect(result.castByAnime.get('Dragon Ball')).toEqual([]);
    expect(result.errors).toEqual([{ anime: 'Dragon Ball', message: 'HTTP 504' }]);
  });

  it('ouvre le coupe-circuit après trop d’erreurs consécutives', async () => {
    const fetchAnimeCast = vi.fn().mockRejectedValue(new Error('HTTP 504'));

    const result = await fetchCastings(
      { A: [1], B: [2], C: [3] },
      { fetchAnimeCast },
      new Map(),
      undefined,
      1,
    );

    expect(fetchAnimeCast).toHaveBeenCalledTimes(1);
    expect(result.errors).toEqual([
      { anime: 'A', message: 'HTTP 504' },
      { anime: 'B', message: 'circuit-open' },
      { anime: 'C', message: 'circuit-open' },
    ]);
  });
});

describe('enrichFromCatalogue', () => {
  it('ajoute seulement les correspondances exactes du catalogue global à la bonne licence', () => {
    const castByAnime = new Map<string, Array<{ malId: number; name: string; imageUrl: string }>>([
      ['Dragon Ball', []],
    ]);

    const matched = enrichFromCatalogue(
      [
        { id: 'vegeta', nom: 'Vegeta', animeSource: 'Dragon Ball' },
        { id: 'freezer', nom: 'Freezer', animeSource: 'Dragon Ball' },
      ],
      castByAnime,
      [
        { malId: 40, name: 'Vegeta', imageUrl },
        { malId: 502, name: 'Frieza', imageUrl },
      ],
    );

    expect(castByAnime.get('Dragon Ball')).toEqual([{ malId: 40, name: 'Vegeta', imageUrl }]);
    expect(matched).toEqual([{ malId: 40, name: 'Vegeta', imageUrl }]);
  });

  it('refuse un nom exact partagé par plusieurs licences', () => {
    const castByAnime = new Map<string, Array<{ malId: number; name: string; imageUrl: string }>>([
      ['Naruto', []],
      ['Cardcaptor Sakura', []],
    ]);

    const matched = enrichFromCatalogue(
      [
        { id: 'sakura-haruno', nom: 'Sakura', animeSource: 'Naruto' },
        { id: 'sakura-kinomoto', nom: 'Sakura', animeSource: 'Cardcaptor Sakura' },
      ],
      castByAnime,
      [{ malId: 1, name: 'Sakura', imageUrl }],
    );

    expect(matched).toEqual([]);
    expect(castByAnime.get('Naruto')).toEqual([]);
    expect(castByAnime.get('Cardcaptor Sakura')).toEqual([]);
  });
});
