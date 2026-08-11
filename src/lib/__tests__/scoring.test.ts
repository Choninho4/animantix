import { describe, expect, it } from 'vitest';
import type { Character } from '../../types/character';
import { calculateSimilarity } from '../scoring';

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

describe('calculateSimilarity', () => {
  it('renvoie 100 quand guess.id === target.id, même si les autres champs diffèrent', () => {
    const target = makeCharacter({ id: 'x', animeSource: 'Anime A' });
    const guess = makeCharacter({
      id: 'x',
      animeSource: 'Anime B',
      roleNarratif: 'Antagoniste principal',
      campMoral: 'Vilain',
      genre: 'Femme',
      trancheAge: 'Senior',
      race: 'Alien',
      categoriePouvoir: 'Aucun pouvoir particulier',
      anneeSortieAnime: 1980,
      couleurCheveux: 'Blond',
    });
    expect(calculateSimilarity(guess, target).total).toBe(100);
  });

  it('attribue seulement les points "anime" quand seul l\'anime correspond', () => {
    const target = makeCharacter({ id: 'target', animeSource: 'Naruto' });
    const guess = makeCharacter({
      id: 'guess',
      animeSource: 'Naruto',
      roleNarratif: 'Antagoniste secondaire',
      campMoral: 'Vilain',
      genre: 'Femme',
      trancheAge: 'Senior',
      race: 'Alien',
      categoriePouvoir: 'Aucun pouvoir particulier',
      anneeSortieAnime: 1980,
      couleurCheveux: 'Rose',
    });
    const result = calculateSimilarity(guess, target);
    expect(result.breakdown.anime).toBe(30);
    expect(result.total).toBe(30);
  });

  it('attribue le score de rôle proche (7 pts) pour deux rôles du même groupe', () => {
    const target = makeCharacter({ id: 'target', roleNarratif: 'Protagoniste principal', animeSource: 'X' });
    const guess = makeCharacter({
      id: 'guess',
      roleNarratif: 'Protagoniste secondaire-allié',
      animeSource: 'Y',
      campMoral: 'Vilain',
      genre: 'Femme',
      trancheAge: 'Senior',
      race: 'Alien',
      categoriePouvoir: 'Aucun pouvoir particulier',
      anneeSortieAnime: 1980,
      couleurCheveux: 'Rose',
    });
    expect(calculateSimilarity(guess, target).breakdown.role).toBe(7);
  });

  it('n\'attribue aucun point de rôle pour deux groupes différents', () => {
    const target = makeCharacter({ id: 'target', roleNarratif: 'Protagoniste principal' });
    const guess = makeCharacter({ id: 'guess', roleNarratif: 'Soutien-mentor', animeSource: 'Autre' });
    expect(calculateSimilarity(guess, target).breakdown.role).toBe(0);
  });

  it('camp adjacent (Héros / Anti-héros) rapporte 5 pts', () => {
    const target = makeCharacter({ id: 'target', campMoral: 'Héros' });
    const guess = makeCharacter({ id: 'guess', campMoral: 'Anti-héros', animeSource: 'Autre' });
    expect(calculateSimilarity(guess, target).breakdown.camp).toBe(5);
  });

  it('camp Héros / Vilain n\'est PAS adjacent : 0 pt', () => {
    const target = makeCharacter({ id: 'target', campMoral: 'Héros' });
    const guess = makeCharacter({ id: 'guess', campMoral: 'Vilain', animeSource: 'Autre' });
    expect(calculateSimilarity(guess, target).breakdown.camp).toBe(0);
  });

  it('tranche d\'âge adjacente (diff=1) rapporte 5 pts, diff=0 rapporte 10 pts, diff>=2 rapporte 0', () => {
    const target = makeCharacter({ id: 'target', trancheAge: 'Ado' });
    const same = makeCharacter({ id: 'g1', trancheAge: 'Ado', animeSource: 'Autre' });
    const adjacent = makeCharacter({ id: 'g2', trancheAge: 'Jeune adulte', animeSource: 'Autre' });
    const far = makeCharacter({ id: 'g3', trancheAge: 'Senior', animeSource: 'Autre' });
    expect(calculateSimilarity(same, target).breakdown.age).toBe(10);
    expect(calculateSimilarity(adjacent, target).breakdown.age).toBe(5);
    expect(calculateSimilarity(far, target).breakdown.age).toBe(0);
  });

  it('décennie identique rapporte 5 pts, décennie adjacente 2 pts, sinon 0', () => {
    const target = makeCharacter({ id: 'target', anneeSortieAnime: 2015 });
    const same = makeCharacter({ id: 'g1', anneeSortieAnime: 2019, animeSource: 'Autre' });
    const adjacent = makeCharacter({ id: 'g2', anneeSortieAnime: 2021, animeSource: 'Autre' });
    const far = makeCharacter({ id: 'g3', anneeSortieAnime: 1999, animeSource: 'Autre' });
    expect(calculateSimilarity(same, target).breakdown.decennie).toBe(5);
    expect(calculateSimilarity(adjacent, target).breakdown.decennie).toBe(2);
    expect(calculateSimilarity(far, target).breakdown.decennie).toBe(0);
  });

  it('race, categoriePouvoir, genre et couleurCheveux identiques rapportent leurs points respectifs', () => {
    const target = makeCharacter({
      id: 'target',
      race: 'Démon-Yokai',
      categoriePouvoir: 'Technologie-arme',
      genre: 'Femme',
      couleurCheveux: 'Violet',
    });
    const guess = makeCharacter({
      id: 'guess',
      animeSource: 'Autre',
      roleNarratif: 'Antagoniste secondaire',
      campMoral: 'Vilain',
      trancheAge: 'Senior',
      race: 'Démon-Yokai',
      categoriePouvoir: 'Technologie-arme',
      genre: 'Femme',
      couleurCheveux: 'Violet',
    });
    const result = calculateSimilarity(guess, target);
    expect(result.breakdown.race).toBe(10);
    expect(result.breakdown.pouvoir).toBe(10);
    expect(result.breakdown.genre).toBe(5);
    expect(result.breakdown.cheveux).toBe(5);
  });

  it('calcule un score partiel connu (Sasuke vs Naruto Uzumaki, données réelles du jeu)', () => {
    const narutoUzumaki = makeCharacter({
      id: 'naruto-uzumaki',
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
    });
    const sasuke = makeCharacter({
      id: 'sasuke-uchiha',
      nom: 'Sasuke Uchiha',
      animeSource: 'Naruto',
      anneeSortieAnime: 2002,
      roleNarratif: 'Protagoniste secondaire-allié',
      campMoral: 'Anti-héros',
      genre: 'Homme',
      trancheAge: 'Ado',
      race: 'Humain',
      categoriePouvoir: 'Pouvoir magique-surnaturel',
      couleurCheveux: 'Noir',
    });
    // anime 30 + role(proche) 7 + camp(adjacent) 5 + genre 5 + age 10 + type 10 + pouvoir 10 + decennie 5 + cheveux 0
    expect(calculateSimilarity(sasuke, narutoUzumaki).total).toBe(82);
  });

  it('est pure et déterministe : deux appels identiques renvoient le même résultat', () => {
    const target = makeCharacter({ id: 'target' });
    const guess = makeCharacter({ id: 'guess', animeSource: 'Autre' });
    const first = calculateSimilarity(guess, target);
    const second = calculateSimilarity(guess, target);
    expect(first).toEqual(second);
  });

  it('le total ne dépasse jamais 100', () => {
    const target = makeCharacter({ id: 'target' });
    const guess = makeCharacter({ id: 'guess' });
    expect(calculateSimilarity(guess, target).total).toBeLessThanOrEqual(100);
  });
});
