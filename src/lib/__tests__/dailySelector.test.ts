import { describe, expect, it } from 'vitest';
import type { Character } from '../../types/character';
import { characterForDayIndex, dayIndexFor } from '../dailySelector';

function makeList(n: number): Character[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `char-${i}`,
    nom: `Character ${i}`,
    animeSource: 'Anime',
    anneeSortieAnime: 2000,
    roleNarratif: 'Protagoniste principal',
    campMoral: 'Héros',
    genre: 'Homme',
    trancheAge: 'Ado',
    race: 'Humain',
    categoriePouvoir: 'Combat physique',
    couleurCheveux: 'Noir',
    imageUrl: null,
    descriptionCourte: 'Test.',
  }));
}

describe('dayIndexFor', () => {
  it("l'epoch (1er janvier 2024) correspond à l'index 0", () => {
    expect(dayIndexFor(new Date(Date.UTC(2024, 0, 1)))).toBe(0);
  });

  it('le lendemain correspond à l\'index 1', () => {
    expect(dayIndexFor(new Date(Date.UTC(2024, 0, 2)))).toBe(1);
  });

  it('un jour avant l\'epoch correspond à l\'index -1', () => {
    expect(dayIndexFor(new Date(Date.UTC(2023, 11, 31)))).toBe(-1);
  });
});

describe('characterForDayIndex', () => {
  it('est déterministe : deux appels avec les mêmes arguments renvoient le même personnage', () => {
    const list = makeList(20);
    const a = characterForDayIndex(5, list);
    const b = characterForDayIndex(5, list);
    expect(a.id).toBe(b.id);
  });

  it('un cycle complet couvre chaque personnage exactement une fois (pas de doublon ni d\'oubli)', () => {
    const list = makeList(30);
    const ids = new Set<string>();
    for (let i = 0; i < list.length; i++) {
      ids.add(characterForDayIndex(i, list).id);
    }
    expect(ids.size).toBe(list.length);
  });

  it('le cycle suivant utilise une seed différente (la séquence n\'est pas identique)', () => {
    const list = makeList(15);
    const cycle0 = Array.from({ length: list.length }, (_, i) => characterForDayIndex(i, list).id);
    const cycle1 = Array.from({ length: list.length }, (_, i) => characterForDayIndex(list.length + i, list).id);
    expect(cycle1).not.toEqual(cycle0);
  });

  it('gère les index négatifs sans renvoyer undefined (wrap correct)', () => {
    const list = makeList(10);
    const result = characterForDayIndex(-1, list);
    expect(result).toBeDefined();
    expect(list.map((c) => c.id)).toContain(result.id);
  });
});
