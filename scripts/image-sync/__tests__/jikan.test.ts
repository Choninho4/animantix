import { describe, expect, it, vi } from 'vitest';
import { attemptsForPath, JIKAN_REQUEST_HEADERS, JikanClient } from '../jikan';

function castEntry(id: number, name: string, imageUrl: string | null) {
  return {
    character: {
      mal_id: id,
      name,
      images: { webp: { image_url: imageUrl }, jpg: { image_url: imageUrl } },
    },
  };
}

describe('JikanClient', () => {
  it('utilise des en-têtes JSON compatibles avec la passerelle Jikan', () => {
    expect(JIKAN_REQUEST_HEADERS.Accept).toBe('application/json');
    expect(JIKAN_REQUEST_HEADERS['User-Agent']).toMatch(/^Mozilla\//);
  });

  it('borne à deux essais les endpoints Jikan pendant une panne prolongée', () => {
    expect(attemptsForPath('/anime/21/characters')).toBe(2);
    expect(attemptsForPath('/characters?q=Luffy&limit=25')).toBe(2);
  });

  it('réunit plusieurs castings, ignore les images absentes et déduplique les personnages', async () => {
    const requestJson = vi
      .fn()
      .mockResolvedValueOnce({ data: [castEntry(1, 'Uzumaki, Naruto', 'https://cdn/naruto.webp')] })
      .mockResolvedValueOnce({
        data: [
          castEntry(1, 'Uzumaki, Naruto', 'https://cdn/naruto.webp'),
          castEntry(2, 'Uchiha, Sasuke', 'https://cdn/sasuke.webp'),
          castEntry(3, 'Sans image', null),
        ],
      });
    const client = new JikanClient({ requestJson });

    const cast = await client.fetchAnimeCast([20, 1735]);

    expect(cast).toEqual([
      { malId: 1, name: 'Uzumaki, Naruto', imageUrl: 'https://cdn/naruto.webp' },
      { malId: 2, name: 'Uchiha, Sasuke', imageUrl: 'https://cdn/sasuke.webp' },
    ]);
  });

  it('refuse de marquer un casting multi-saisons incomplet comme valide', async () => {
    const requestJson = vi
      .fn()
      .mockRejectedValueOnce(new Error('HTTP 504'))
      .mockResolvedValueOnce({ data: [castEntry(1, 'Saitama', 'https://cdn/saitama.webp')] });
    const client = new JikanClient({ requestJson });

    await expect(client.fetchAnimeCast([30276, 34134])).rejects.toThrow('Casting incomplet (1/2)');
  });

  it('encode le nom lors de la recherche directe', async () => {
    const requestJson = vi.fn().mockResolvedValue({ data: [castEntry(2, 'Uchiha, Sasuke', 'https://cdn/sasuke.webp').character] });
    const client = new JikanClient({ requestJson });

    await client.searchCharacters('Sasuke Uchiha');

    expect(requestJson).toHaveBeenCalledWith('/characters?q=Sasuke%20Uchiha&limit=25');
  });

  it('récupère une page du catalogue populaire avec sa pagination', async () => {
    const requestJson = vi.fn().mockResolvedValue({
      data: [castEntry(40, 'Vegeta', 'https://cdn/vegeta.webp').character],
      pagination: { last_visible_page: 3256 },
    });
    const client = new JikanClient({ requestJson });

    await expect(client.fetchTopCharacters(3)).resolves.toEqual({
      characters: [{ malId: 40, name: 'Vegeta', imageUrl: 'https://cdn/vegeta.webp' }],
      lastPage: 3256,
    });
    expect(requestJson).toHaveBeenCalledWith('/top/characters?page=3');
  });
});
