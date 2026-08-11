import { describe, expect, it } from 'vitest';
import type { Character } from '../../types/character';
import { buildHintDefinitions, guessesUntilNextHint, unlockedHintCount } from '../hints';

const target: Character = {
  id: 'target',
  nom: 'Naruto Uzumaki',
  animeSource: 'Naruto',
  anneeSortieAnime: 2002,
  roleNarratif: 'Protagoniste principal',
  campMoral: 'Héros',
  genre: 'Homme',
  trancheAge: 'Ado',
  race: 'Humain',
  categoriePouvoir: 'Pouvoir magique-surnaturel',
  couleurCheveux: 'Blond',
  imageUrl: null,
  descriptionCourte: 'Test.',
};

describe('buildHintDefinitions', () => {
  it(
    'renvoie 5 indices dans le bon ordre : race, genre, première lettre, couleur de cheveux, anime',
    () => {
      const hints = buildHintDefinitions(target);
      expect(hints).toHaveLength(5);
      expect(hints[0].value).toBe('Humain');
      expect(hints[1].value).toBe('Homme');
      expect(hints[2].value).toBe('N');
      expect(hints[3].value).toBe('Blond');
      expect(hints[4].value).toBe('Naruto');
    },
  );
});

describe('unlockedHintCount', () => {
  it('débloque un indice tous les 5 essais, plafonné à 5', () => {
    expect(unlockedHintCount(0)).toBe(0);
    expect(unlockedHintCount(4)).toBe(0);
    expect(unlockedHintCount(5)).toBe(1);
    expect(unlockedHintCount(9)).toBe(1);
    expect(unlockedHintCount(10)).toBe(2);
    expect(unlockedHintCount(20)).toBe(4);
    expect(unlockedHintCount(25)).toBe(5);
    expect(unlockedHintCount(1000)).toBe(5);
  });
});

describe('guessesUntilNextHint', () => {
  it('calcule le nombre d\'essais restants avant le prochain indice', () => {
    expect(guessesUntilNextHint(0, 3)).toBe(2);
    expect(guessesUntilNextHint(1, 7)).toBe(3);
  });
});
