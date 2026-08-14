import { describe, expect, it } from 'vitest';
import type { Character } from '../../types/character';
import { compareGuess, correctCount, isWinningComparison } from '../comparison';

function makeCharacter(overrides: Partial<Character>): Character {
  return {
    id: 'base',
    nom: 'Base Character',
    animeSource: 'Anime A',
    anneeSortieAnime: 2000,
    roleNarratif: 'Protagoniste principal',
    campMoral: 'Héros',
    genre: 'Homme',
    trancheAge: 'Ado',
    race: 'Humain',
    categoriePouvoir: 'Combat physique',
    couleurCheveux: 'Noir',
    imageUrl: null,
    descriptionCourte: 'Description de test.',
    ...overrides,
  };
}

describe('compareGuess', () => {
  it('personnage identique sur tous les critères : tout correct', () => {
    const target = makeCharacter({ id: 'target' });
    const guess = makeCharacter({ id: 'guess' });
    const results = compareGuess(guess, target);
    expect(results.every((r) => r.status === 'correct')).toBe(true);
    expect(correctCount(results)).toBe(8);
    expect(isWinningComparison(results)).toBe(true);
  });

  it('personnage totalement différent sur tous les critères : tout incorrect', () => {
    const target = makeCharacter({
      id: 'target',
      animeSource: 'Anime A',
      roleNarratif: 'Protagoniste principal',
      campMoral: 'Héros',
      race: 'Humain',
      categoriePouvoir: 'Combat physique',
      genre: 'Homme',
      anneeSortieAnime: 1970,
      couleurCheveux: 'Noir',
    });
    const guess = makeCharacter({
      id: 'guess',
      animeSource: 'Anime B',
      roleNarratif: 'Soutien-mentor',
      campMoral: 'Vilain',
      race: 'Alien',
      categoriePouvoir: 'Aucun pouvoir particulier',
      genre: 'Femme',
      anneeSortieAnime: 2020,
      couleurCheveux: 'Blond',
    });
    const results = compareGuess(guess, target);
    expect(results.every((r) => r.status === 'incorrect')).toBe(true);
    expect(correctCount(results)).toBe(0);
    expect(isWinningComparison(results)).toBe(false);
  });

  it('décennie incorrecte : direction "bas" quand le personnage du jour est plus ancien que la proposition', () => {
    const target = makeCharacter({ id: 'target', anneeSortieAnime: 1995 });
    const guess = makeCharacter({ id: 'guess', anneeSortieAnime: 2015, animeSource: 'Autre' });
    const decennie = compareGuess(guess, target).find((r) => r.critere === 'decennie')!;
    expect(decennie.status).toBe('incorrect');
    expect(decennie.direction).toBe('bas');
  });

  it('décennie incorrecte : direction "haut" quand le personnage du jour est plus récent que la proposition', () => {
    const target = makeCharacter({ id: 'target', anneeSortieAnime: 2020 });
    const guess = makeCharacter({ id: 'guess', anneeSortieAnime: 1990, animeSource: 'Autre' });
    const decennie = compareGuess(guess, target).find((r) => r.critere === 'decennie')!;
    expect(decennie.status).toBe('incorrect');
    expect(decennie.direction).toBe('haut');
  });

  it('décennie correcte : pas de direction, même année exacte ou même décennie', () => {
    const target = makeCharacter({ id: 'target', anneeSortieAnime: 2012 });
    const guess = makeCharacter({ id: 'guess', anneeSortieAnime: 2019, animeSource: 'Autre' });
    const decennie = compareGuess(guess, target).find((r) => r.critere === 'decennie')!;
    expect(decennie.status).toBe('correct');
    expect(decennie.direction).toBeUndefined();
  });

  it('cas partiel connu (Sasuke vs Naruto Uzumaki) : anime, genre, décennie, pouvoir corrects — le reste incorrect', () => {
    const narutoUzumaki = makeCharacter({
      id: 'naruto-uzumaki',
      animeSource: 'Naruto',
      anneeSortieAnime: 2002,
      roleNarratif: 'Protagoniste principal',
      campMoral: 'Héros',
      genre: 'Homme',
      race: 'Humain',
      categoriePouvoir: 'Pouvoir magique-surnaturel',
      couleurCheveux: 'Blond',
    });
    const sasuke = makeCharacter({
      id: 'sasuke-uchiha',
      animeSource: 'Naruto',
      anneeSortieAnime: 2002,
      roleNarratif: 'Protagoniste secondaire-allié',
      campMoral: 'Anti-héros',
      genre: 'Homme',
      race: 'Humain',
      categoriePouvoir: 'Pouvoir magique-surnaturel',
      couleurCheveux: 'Noir',
    });
    const results = compareGuess(sasuke, narutoUzumaki);
    const byKey = Object.fromEntries(results.map((r) => [r.critere, r.status]));
    expect(byKey.anime).toBe('correct');
    expect(byKey.role).toBe('incorrect');
    expect(byKey.camp).toBe('incorrect');
    expect(byKey.genre).toBe('correct');
    expect(byKey.race).toBe('correct');
    expect(byKey.pouvoir).toBe('correct');
    expect(byKey.decennie).toBe('correct');
    expect(byKey.cheveux).toBe('incorrect');
    expect(correctCount(results)).toBe(5);
  });

  it('valeurAffichee reflète toujours la valeur proposée, pas celle du personnage du jour', () => {
    const target = makeCharacter({ id: 'target', animeSource: 'Cible' });
    const guess = makeCharacter({ id: 'guess', animeSource: 'Proposition' });
    const anime = compareGuess(guess, target).find((r) => r.critere === 'anime')!;
    expect(anime.valeurAffichee).toBe('Proposition');
  });

  it('est pure et déterministe', () => {
    const target = makeCharacter({ id: 'target' });
    const guess = makeCharacter({ id: 'guess', animeSource: 'Autre' });
    expect(compareGuess(guess, target)).toEqual(compareGuess(guess, target));
  });
});
