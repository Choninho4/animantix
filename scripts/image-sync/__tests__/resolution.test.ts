import { describe, expect, it } from 'vitest';
import { charactersNeedingSearch, resolveCharacters } from '../resolution';

const imageUrl = 'https://cdn.example/portrait.jpg';

describe('resolveCharacters', () => {
  it('résout par casting et applique un override seulement aux cas ambigus', () => {
    const result = resolveCharacters(
      [
        { id: 'naruto', nom: 'Naruto Uzumaki', animeSource: 'Naruto' },
        { id: 'saber', nom: 'Saber', animeSource: 'Fate' },
      ],
      new Map([
        ['Naruto', [{ malId: 1, name: 'Uzumaki, Naruto', imageUrl }]],
        [
          'Fate',
          [
            { malId: 2, name: 'Saber', imageUrl },
            { malId: 3, name: 'Saber', imageUrl: `${imageUrl}?alternate` },
          ],
        ],
      ]),
      { saber: 3 },
    );

    expect(result.resolved).toEqual([
      { localId: 'naruto', provider: { malId: 1, name: 'Uzumaki, Naruto', imageUrl }, match: 'automatic' },
      {
        localId: 'saber',
        provider: { malId: 3, name: 'Saber', imageUrl: `${imageUrl}?alternate` },
        match: 'override',
      },
    ]);
    expect(result.issues).toEqual([]);
  });

  it('signale les personnages non résolus sans choisir un résultat flou', () => {
    const result = resolveCharacters(
      [{ id: 'zoro', nom: 'Roronoa Zoro', animeSource: 'One Piece' }],
      new Map([['One Piece', [{ malId: 1, name: 'Zoro', imageUrl }]]]),
      {},
    );

    expect(result.resolved).toEqual([]);
    expect(result.issues).toEqual([{ localId: 'zoro', status: 'unmatched', candidates: [] }]);
  });

  it('signale un override qui ne correspond à aucun candidat du casting', () => {
    const result = resolveCharacters(
      [{ id: 'saber', nom: 'Saber', animeSource: 'Fate' }],
      new Map([['Fate', [{ malId: 2, name: 'Saber', imageUrl }]]]),
      { saber: 999 },
    );

    expect(result.issues).toEqual([{ localId: 'saber', status: 'invalid-override', candidates: [2] }]);
  });
});

describe('charactersNeedingSearch', () => {
  it('exclut les correspondances automatiques et les overrides déjà valides', () => {
    const locals = [
      { id: 'naruto', nom: 'Naruto Uzumaki', animeSource: 'Naruto' },
      { id: 'saber', nom: 'Saber', animeSource: 'Fate' },
      { id: 'zoro', nom: 'Roronoa Zoro', animeSource: 'One Piece' },
    ];
    const cast = new Map([
      ['Naruto', [{ malId: 1, name: 'Uzumaki, Naruto', imageUrl }]],
      ['Fate', [{ malId: 2, name: 'Artoria Pendragon', imageUrl }]],
      ['One Piece', [{ malId: 3, name: 'Zoro', imageUrl }]],
    ]);

    expect(charactersNeedingSearch(locals, cast, { saber: 2 }).map(({ id }) => id)).toEqual(['zoro']);
  });
});
