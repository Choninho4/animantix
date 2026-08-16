import { describe, expect, it } from 'vitest';
import type { Character } from '../../types/character';
import { buildHintDefinitions, guessesUntilNextHint, unlockedHintCount } from '../hints';

const target: Character = {
  id: 'test-char',
  nom: 'Zeref Dragneel',
  animeSource: 'Fairy Tail',
  anneeSortieAnime: 2009,
  roleNarratif: 'Antagoniste principal',
  campMoral: 'Vilain',
  genre: 'Homme',
  trancheAge: 'Adulte',
  race: 'Humain',
  categoriePouvoir: 'Pouvoir magique-surnaturel',
  couleurCheveux: 'Noir',
  imageUrl: null,
  descriptionCourte: 'Description de test.',
};

describe('buildHintDefinitions', () => {
  it("renvoie les 5 indices dans l'ordre race → genre → première lettre → cheveux → anime", () => {
    const hints = buildHintDefinitions(target);
    expect(hints).toHaveLength(5);
    expect(hints[0]).toEqual({ label: 'Race :', value: 'Humain' });
    expect(hints[1]).toEqual({ label: 'Genre :', value: 'Homme' });
    expect(hints[2]).toEqual({ label: 'Première lettre :', value: 'Z' });
    expect(hints[3]).toEqual({ label: 'Couleur de cheveux :', value: 'Noir' });
    expect(hints[4]).toEqual({ label: "Anime d'origine :", value: 'Fairy Tail' });
  });

  it('met en majuscule la première lettre même si le nom commence en minuscule', () => {
    const hints = buildHintDefinitions({ ...target, nom: 'zeref' });
    expect(hints[2].value).toBe('Z');
  });
});

describe('unlockedHintCount', () => {
  it('débloque un indice tous les 5 essais, plafonné à 5', () => {
    expect(unlockedHintCount(0)).toBe(0);
    expect(unlockedHintCount(4)).toBe(0);
    expect(unlockedHintCount(5)).toBe(1);
    expect(unlockedHintCount(9)).toBe(1);
    expect(unlockedHintCount(10)).toBe(2);
    expect(unlockedHintCount(25)).toBe(5);
    expect(unlockedHintCount(100)).toBe(5);
  });
});

describe('guessesUntilNextHint', () => {
  it('calcule le nombre d\'essais restants avant le prochain indice', () => {
    expect(guessesUntilNextHint(0, 0)).toBe(5);
    expect(guessesUntilNextHint(0, 3)).toBe(2);
    expect(guessesUntilNextHint(1, 6)).toBe(4);
  });
});
