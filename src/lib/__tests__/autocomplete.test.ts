import { describe, expect, it } from 'vitest';
import type { Character } from '../../types/character';
import { findExactMatch, matchCharacters, normalizeForSearch } from '../autocomplete';

function makeCharacter(id: string, nom: string, animeSource: string): Character {
  return {
    id,
    nom,
    animeSource,
    anneeSortieAnime: 2000,
    roleNarratif: 'Protagoniste principal',
    campMoral: 'Héros',
    genre: 'Homme',
    trancheAge: 'Ado',
    typeEtre: 'Humain',
    categoriePouvoir: 'Combat physique',
    couleurCheveux: 'Noir',
    imageUrl: null,
    descriptionCourte: 'Test.',
  };
}

const db = [
  makeCharacter('naruto-uzumaki', 'Naruto Uzumaki', 'Naruto'),
  makeCharacter('sasuke-uchiha', 'Sasuke Uchiha', 'Naruto'),
  makeCharacter('sakura-haruno', 'Sakura Haruno', 'Naruto'),
  makeCharacter('narusegawa', 'Narusegawa Naru', 'Love Hina'),
];

describe('normalizeForSearch', () => {
  it('retire les accents et met en minuscule', () => {
    expect(normalizeForSearch('Éléonore')).toBe('eleonore');
  });
});

describe('matchCharacters', () => {
  it('renvoie un tableau vide pour une requête de moins de 2 caractères', () => {
    expect(matchCharacters('n', db)).toEqual([]);
    expect(matchCharacters('', db)).toEqual([]);
  });

  it('priorise les correspondances "commence par" avant les correspondances "contient"', () => {
    // "Naruto Uzumaki" et "Narusegawa Naru" commencent par "naru" ; "Sasuke Uchiha" et
    // "Sakura Haruno" ne matchent que via le nom de l'anime "Naruto" (contains).
    const results = matchCharacters('naru', db);
    const startsIndex = results.findIndex((c) => c.id === 'naruto-uzumaki');
    const containsIndex = results.findIndex((c) => c.id === 'sasuke-uchiha');
    expect(startsIndex).toBeGreaterThanOrEqual(0);
    expect(containsIndex).toBeGreaterThanOrEqual(0);
    expect(startsIndex).toBeLessThan(containsIndex);
  });

  it('trouve aussi par nom d\'anime', () => {
    const results = matchCharacters('naruto', db);
    expect(results.map((c) => c.id)).toContain('sasuke-uchiha');
  });

  it('est insensible aux accents et à la casse', () => {
    const results = matchCharacters('NARUTO', db);
    expect(results.length).toBeGreaterThan(0);
  });

  it('limite les résultats à 25 (une licence peut dépasser 20 personnages)', () => {
    const bigDb = Array.from({ length: 30 }, (_, i) => makeCharacter(`x${i}`, `Xavier ${i}`, 'Anime'));
    expect(matchCharacters('xavier', bigDb)).toHaveLength(25);
  });

  it('trie les correspondances "contient" par ordre alphabétique', () => {
    const shuffledDb = [
      makeCharacter('c', 'Charlie', 'Anime'),
      makeCharacter('a', 'Alpha', 'Anime'),
      makeCharacter('b', 'Bravo', 'Anime'),
    ];
    const results = matchCharacters('anime', shuffledDb);
    expect(results.map((c) => c.nom)).toEqual(['Alpha', 'Bravo', 'Charlie']);
  });
});

describe('findExactMatch', () => {
  it('trouve une correspondance exacte insensible à la casse/accents', () => {
    expect(findExactMatch('naruto uzumaki', db)?.id).toBe('naruto-uzumaki');
  });

  it('renvoie undefined si aucune correspondance exacte', () => {
    expect(findExactMatch('personnage inconnu', db)).toBeUndefined();
  });
});
