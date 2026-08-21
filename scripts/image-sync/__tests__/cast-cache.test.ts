import { describe, expect, it } from 'vitest';
import { addProvisionalCandidates, restoreProvisionalCastings, reusableCastCache } from '../cast-cache';

describe('reusableCastCache', () => {
  it('invalide une licence lorsque sa liste d’IDs MAL change', () => {
    const cached = new Map([
      ['Naruto', [{ malId: 1, name: 'Naruto', imageUrl: 'https://cdn/naruto.webp' }]],
      ['One Piece', [{ malId: 2, name: 'Luffy', imageUrl: 'https://cdn/luffy.webp' }]],
    ]);

    const reusable = reusableCastCache(
      { Naruto: [20, 1735], 'One Piece': [21] },
      cached,
      { Naruto: { version: 2, animeIds: [20] }, 'One Piece': { version: 2, animeIds: [21] } },
    );

    expect([...reusable.keys()]).toEqual(['One Piece']);
  });

  it('invalide prudemment un ancien cache sans métadonnées', () => {
    expect(reusableCastCache({ Naruto: [20] }, new Map([['Naruto', []]]), {})).toEqual(new Map());
  });

  it('ne migre l’ancien format que pour les licences à un seul ID, forcément complètes', () => {
    const cached = new Map([
      ['Death Note', []],
      ['Naruto', []],
    ]);
    const reusable = reusableCastCache(
      { 'Death Note': [1535], Naruto: [20, 1735] },
      cached,
      { 'Death Note': [1535], Naruto: [20, 1735] },
    );

    expect([...reusable.keys()]).toEqual(['Death Note']);
  });
});

describe('restoreProvisionalCastings', () => {
  it('réutilise un ancien casting partiel uniquement pour la résolution locale, sans remplacer un nouveau casting', () => {
    const oldNaruto = [{ malId: 1, name: 'Naruto', imageUrl: 'https://cdn/naruto.webp' }];
    const freshOnePiece = [{ malId: 2, name: 'Luffy', imageUrl: 'https://cdn/luffy.webp' }];
    const castings = new Map<string, typeof oldNaruto>([
      ['Naruto', []],
      ['One Piece', freshOnePiece],
    ]);

    restoreProvisionalCastings(
      castings,
      [{ anime: 'Naruto', message: 'Casting incomplet (1/2)' }, { anime: 'One Piece', message: 'ignored' }],
      new Map([
        ['Naruto', oldNaruto],
        ['One Piece', oldNaruto],
      ]),
    );

    expect(castings.get('Naruto')).toBe(oldNaruto);
    expect(castings.get('One Piece')).toBe(freshOnePiece);
  });
});

describe('addProvisionalCandidates', () => {
  it('reconstruit les castings depuis le checkpoint sans doublonner et conserve le cache existant', () => {
    const cached = new Map([
      ['Naruto', [{ malId: 1, name: 'Naruto', imageUrl: 'https://cdn/naruto.webp' }]],
    ]);

    addProvisionalCandidates(cached, [
      { anime: 'Naruto', malId: 1, name: 'Naruto', imageUrl: 'https://cdn/naruto.webp' },
      { anime: 'Naruto', malId: 2, name: 'Sasuke', imageUrl: 'https://cdn/sasuke.webp' },
      { anime: 'One Piece', malId: 3, name: 'Luffy', imageUrl: 'https://cdn/luffy.webp' },
    ]);

    expect(cached.get('Naruto')?.map(({ malId }) => malId)).toEqual([1, 2]);
    expect(cached.get('One Piece')?.map(({ malId }) => malId)).toEqual([3]);
  });
});
