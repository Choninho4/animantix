import { describe, expect, it } from 'vitest';
import type { Character } from '../../types/character';
import { calculateSimilarity } from '../scoring';
import { POIDS } from '../constants';

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

function detailFor(result: ReturnType<typeof calculateSimilarity>, key: string) {
  const d = result.details.find((d) => d.key === key);
  if (!d) throw new Error(`Critère introuvable : ${key}`);
  return d;
}

describe('calculateSimilarity', () => {
  it('renvoie 100 pour un personnage identique à lui-même (tous les critères exacts)', () => {
    const target = makeCharacter({ id: 'x' });
    const result = calculateSimilarity(target, target);
    expect(result.total).toBe(100);
    expect(result.details.every((d) => d.status === 'exact')).toBe(true);
  });

  it('attribue seulement les points "anime" quand seul l\'anime correspond', () => {
    const target = makeCharacter({ id: 'target', animeSource: 'Naruto' });
    const guess = makeCharacter({
      id: 'guess',
      animeSource: 'Naruto',
      roleNarratif: 'Antagoniste secondaire',
      campMoral: 'Vilain',
      genre: 'Femme',
      race: 'Alien',
      categoriePouvoir: 'Aucun pouvoir particulier',
      anneeSortieAnime: 1980,
      couleurCheveux: 'Rose',
    });
    const result = calculateSimilarity(guess, target);
    expect(detailFor(result, 'anime').points).toBe(POIDS.anime);
    expect(result.total).toBe(POIDS.anime);
  });

  it('attribue le score de rôle proche pour deux rôles du même groupe', () => {
    const target = makeCharacter({ id: 'target', roleNarratif: 'Protagoniste principal', animeSource: 'X' });
    const guess = makeCharacter({
      id: 'guess',
      roleNarratif: 'Protagoniste secondaire-allié',
      animeSource: 'Y',
      campMoral: 'Vilain',
      genre: 'Femme',
      race: 'Alien',
      categoriePouvoir: 'Aucun pouvoir particulier',
      anneeSortieAnime: 1980,
      couleurCheveux: 'Rose',
    });
    const result = calculateSimilarity(guess, target);
    const role = detailFor(result, 'role');
    expect(role.status).toBe('partial');
    expect(role.points).toBe(POIDS.roleProche);
  });

  it("n'attribue aucun point de rôle pour deux groupes différents", () => {
    const target = makeCharacter({ id: 'target', roleNarratif: 'Protagoniste principal' });
    const guess = makeCharacter({ id: 'guess', roleNarratif: 'Soutien-mentor', animeSource: 'Autre' });
    const result = calculateSimilarity(guess, target);
    const role = detailFor(result, 'role');
    expect(role.status).toBe('none');
    expect(role.points).toBe(0);
  });

  it('camp adjacent (Héros / Anti-héros) rapporte les points partiels', () => {
    const target = makeCharacter({ id: 'target', campMoral: 'Héros' });
    const guess = makeCharacter({ id: 'guess', campMoral: 'Anti-héros', animeSource: 'Autre' });
    const result = calculateSimilarity(guess, target);
    const camp = detailFor(result, 'camp');
    expect(camp.status).toBe('partial');
    expect(camp.points).toBe(POIDS.campAdjacent);
  });

  it("camp Héros / Vilain n'est PAS adjacent : 0 pt", () => {
    const target = makeCharacter({ id: 'target', campMoral: 'Héros' });
    const guess = makeCharacter({ id: 'guess', campMoral: 'Vilain', animeSource: 'Autre' });
    const result = calculateSimilarity(guess, target);
    const camp = detailFor(result, 'camp');
    expect(camp.status).toBe('none');
    expect(camp.points).toBe(0);
  });

  it('camp "Anti-héros" vs "Neutre-ambigu" est adjacent, "Anti-héros" vs "Anti-héros" est exact', () => {
    const target = makeCharacter({ id: 'target', campMoral: 'Anti-héros' });
    const adjacent = makeCharacter({ id: 'g1', campMoral: 'Neutre-ambigu', animeSource: 'Autre' });
    const same = makeCharacter({ id: 'g2', campMoral: 'Anti-héros', animeSource: 'Autre' });
    expect(detailFor(calculateSimilarity(adjacent, target), 'camp').points).toBe(POIDS.campAdjacent);
    expect(detailFor(calculateSimilarity(same, target), 'camp').points).toBe(POIDS.camp);
  });

  it('décennie identique rapporte les points pleins, sans direction', () => {
    const target = makeCharacter({ id: 'target', anneeSortieAnime: 2015 });
    const guess = makeCharacter({ id: 'guess', anneeSortieAnime: 2019, animeSource: 'Autre' });
    const decennie = detailFor(calculateSimilarity(guess, target), 'decennie');
    expect(decennie.status).toBe('exact');
    expect(decennie.points).toBe(POIDS.decennie);
    expect(decennie.direction).toBeUndefined();
  });

  it('décennie adjacente rapporte des points partiels avec une direction', () => {
    const target = makeCharacter({ id: 'target', anneeSortieAnime: 2015 });
    const guess = makeCharacter({ id: 'guess', anneeSortieAnime: 2021, animeSource: 'Autre' });
    const decennie = detailFor(calculateSimilarity(guess, target), 'decennie');
    expect(decennie.status).toBe('partial');
    expect(decennie.points).toBe(POIDS.decennieAdjacente);
    expect(decennie.direction).toBe('bas');
  });

  it('décennie éloignée ne rapporte aucun point mais garde une direction', () => {
    const target = makeCharacter({ id: 'target', anneeSortieAnime: 1999 });
    const guess = makeCharacter({ id: 'guess', anneeSortieAnime: 2020, animeSource: 'Autre' });
    const decennie = detailFor(calculateSimilarity(guess, target), 'decennie');
    expect(decennie.status).toBe('none');
    expect(decennie.points).toBe(0);
    expect(decennie.direction).toBe('bas');
  });

  it('direction "haut" quand le personnage du jour est plus récent que la proposition', () => {
    const target = makeCharacter({ id: 'target', anneeSortieAnime: 2020 });
    const guess = makeCharacter({ id: 'guess', anneeSortieAnime: 1990, animeSource: 'Autre' });
    const decennie = detailFor(calculateSimilarity(guess, target), 'decennie');
    expect(decennie.direction).toBe('haut');
  });

  it('race, pouvoir, genre et couleur de cheveux identiques rapportent leurs points respectifs', () => {
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
      race: 'Démon-Yokai',
      categoriePouvoir: 'Technologie-arme',
      genre: 'Femme',
      couleurCheveux: 'Violet',
    });
    const result = calculateSimilarity(guess, target);
    expect(detailFor(result, 'race').points).toBe(POIDS.race);
    expect(detailFor(result, 'pouvoir').points).toBe(POIDS.pouvoir);
    expect(detailFor(result, 'genre').points).toBe(POIDS.genre);
    expect(detailFor(result, 'cheveux').points).toBe(POIDS.cheveux);
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
      race: 'Humain',
      categoriePouvoir: 'Pouvoir magique-surnaturel',
      couleurCheveux: 'Noir',
    });
    // anime 30 + role(proche) 7 + camp(adjacent) 6 + race 12 + pouvoir 12 + decennie(exact) 8 + genre 6 + cheveux 0
    expect(calculateSimilarity(sasuke, narutoUzumaki).total).toBe(81);
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

  it('la somme des poids maximum vaut exactement 100 (invariant du barème)', () => {
    const sumOfMax =
      POIDS.anime + POIDS.role + POIDS.camp + POIDS.race + POIDS.pouvoir + POIDS.decennie + POIDS.genre + POIDS.cheveux;
    expect(sumOfMax).toBe(100);
  });

  it('deux personnages totalement différents sur tous les axes rapportent 0, jamais négatif', () => {
    const target = makeCharacter({
      id: 'target',
      animeSource: 'Anime A',
      roleNarratif: 'Protagoniste principal', // groupe 0
      campMoral: 'Héros', // ordre 0
      genre: 'Homme',
      race: 'Humain',
      categoriePouvoir: 'Combat physique',
      anneeSortieAnime: 1970, // décennie 197
      couleurCheveux: 'Noir',
    });
    const guess = makeCharacter({
      id: 'guess',
      animeSource: 'Anime B',
      roleNarratif: 'Soutien-mentor', // groupe 2 (différent de 0)
      campMoral: 'Vilain', // ordre 2, paire "0-2" non adjacente
      genre: 'Femme',
      race: 'Alien',
      categoriePouvoir: 'Aucun pouvoir particulier',
      anneeSortieAnime: 2020, // décennie 202, diff >= 2
      couleurCheveux: 'Blond',
    });
    const result = calculateSimilarity(guess, target);
    expect(result.total).toBe(0);
    for (const d of result.details) {
      expect(d.points).toBe(0);
      expect(d.status).toBe('none');
    }
  });

  it('la somme des points par critère correspond exactement au total renvoyé', () => {
    const target = makeCharacter({ id: 'target', anneeSortieAnime: 2015 });
    const guess = makeCharacter({
      id: 'guess',
      roleNarratif: 'Protagoniste secondaire-allié',
      campMoral: 'Anti-héros',
      anneeSortieAnime: 2021,
      couleurCheveux: 'Blond',
    });
    const result = calculateSimilarity(guess, target);
    const sum = result.details.reduce((acc, d) => acc + d.points, 0);
    expect(sum).toBe(result.total);
  });
});
