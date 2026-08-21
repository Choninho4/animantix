import { describe, expect, it, vi } from 'vitest';
import { MalPageClient, parseMalCharacters } from '../mal-page';

const characterRow = (id: number, name: string, imagePath: string) => `
  <table class="js-anime-character-table">
    <tr><td><a href="https://myanimelist.net/character/${id}/Example">
      <img alt="${name}" data-src="https://cdn.myanimelist.net/r/42x62/${imagePath}?s=small">
    </a></td></tr>
  </table>`;

describe('parseMalCharacters', () => {
  it('extrait les IDs, noms et images originales puis déduplique les liens', () => {
    const html = `${characterRow(86, 'Ayanami, Rei', 'images/characters/11/314932.jpg')}
      <a href="https://myanimelist.net/character/86/Example">duplicate</a>
      ${characterRow(89, 'Ikari, Shinji', 'images/characters/8/341743.jpg')}`;

    expect(parseMalCharacters(html)).toEqual([
      {
        malId: 86,
        name: 'Ayanami, Rei',
        imageUrl: 'https://cdn.myanimelist.net/images/characters/11/314932.jpg',
      },
      {
        malId: 89,
        name: 'Ikari, Shinji',
        imageUrl: 'https://cdn.myanimelist.net/images/characters/8/341743.jpg',
      },
    ]);
  });

  it('lit aussi les lignes de résultats de recherche sans classe de casting', () => {
    const html = `<table><tr><td><a href="https://myanimelist.net/character/4945/Broly">
      <img data-src="https://cdn.myanimelist.net/r/42x62/images/characters/2/275050.jpg?s=x">
      </a></td><td><a href="https://myanimelist.net/character/4945/Broly">Broly</a></td></tr></table>`;

    expect(parseMalCharacters(html)).toEqual([
      {
        malId: 4945,
        name: 'Broly',
        imageUrl: 'https://cdn.myanimelist.net/images/characters/2/275050.jpg',
      },
    ]);
  });
});

describe('MalPageClient', () => {
  it('récupère et fusionne les pages de casting avec une URL indépendante du slug', async () => {
    const requestHtml = vi.fn().mockResolvedValue(characterRow(86, 'Ayanami, Rei', 'images/characters/11/314932.jpg'));
    const client = new MalPageClient({ requestHtml });

    await expect(client.fetchAnimeCast([30, 32])).resolves.toHaveLength(1);
    expect(requestHtml).toHaveBeenNthCalledWith(1, 'https://myanimelist.net/anime/30/_/characters');
    expect(requestHtml).toHaveBeenNthCalledWith(2, 'https://myanimelist.net/anime/32/_/characters');
  });

  it('traite une recherche MAL 404 comme une liste vide', async () => {
    const client = new MalPageClient({
      requestHtml: vi.fn().mockRejectedValue(new Error('HTTP 404 for character search')),
    });

    await expect(client.searchCharacters('nom absent')).resolves.toEqual([]);
  });
});
