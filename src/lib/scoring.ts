import type { Character, RoleNarratif, CampMoral, TrancheAge } from '../types/character';
import { POIDS } from './constants';

const ROLE_GROUP: Record<RoleNarratif, number> = {
  'Protagoniste principal': 0,
  'Protagoniste secondaire-allié': 0,
  'Antagoniste principal': 1,
  'Antagoniste secondaire': 1,
  'Soutien-mentor': 2,
};

const CAMP_ORDER: Record<CampMoral, number> = {
  Héros: 0,
  'Anti-héros': 1,
  Vilain: 2,
  'Neutre-ambigu': 3,
};

// Correspond exactement à CAMP_ADJ de la DA : Héros-Vilain n'est PAS adjacent.
const CAMP_ADJACENT_PAIRS = new Set(['0-1', '1-2', '1-3', '0-3']);

const AGE_ORDER: Record<TrancheAge, number> = {
  Enfant: 0,
  Ado: 1,
  'Jeune adulte': 2,
  Adulte: 3,
  Senior: 4,
};

export interface ScoreBreakdown {
  anime: number;
  role: number;
  camp: number;
  genre: number;
  age: number;
  typeEtre: number;
  pouvoir: number;
  decennie: number;
  cheveux: number;
}

export interface ScoreResult {
  total: number;
  breakdown: ScoreBreakdown;
}

export function calculateSimilarity(guess: Character, target: Character): ScoreResult {
  if (guess.id === target.id) {
    return {
      total: 100,
      breakdown: {
        anime: POIDS.anime,
        role: POIDS.role,
        camp: POIDS.camp,
        genre: POIDS.genre,
        age: POIDS.age,
        typeEtre: POIDS.typeEtre,
        pouvoir: POIDS.pouvoir,
        decennie: POIDS.decennie,
        cheveux: POIDS.cheveux,
      },
    };
  }

  const breakdown: ScoreBreakdown = {
    anime: guess.animeSource === target.animeSource ? POIDS.anime : 0,
    role: 0,
    camp: 0,
    genre: guess.genre === target.genre ? POIDS.genre : 0,
    age: 0,
    typeEtre: guess.typeEtre === target.typeEtre ? POIDS.typeEtre : 0,
    pouvoir: guess.categoriePouvoir === target.categoriePouvoir ? POIDS.pouvoir : 0,
    decennie: 0,
    cheveux: guess.couleurCheveux === target.couleurCheveux ? POIDS.cheveux : 0,
  };

  if (guess.roleNarratif === target.roleNarratif) {
    breakdown.role = POIDS.role;
  } else if (ROLE_GROUP[guess.roleNarratif] === ROLE_GROUP[target.roleNarratif]) {
    breakdown.role = POIDS.roleProche;
  }

  if (guess.campMoral === target.campMoral) {
    breakdown.camp = POIDS.camp;
  } else {
    const pair = [CAMP_ORDER[guess.campMoral], CAMP_ORDER[target.campMoral]].sort((a, b) => a - b).join('-');
    if (CAMP_ADJACENT_PAIRS.has(pair)) {
      breakdown.camp = POIDS.campAdjacent;
    }
  }

  const ageDiff = Math.abs(AGE_ORDER[guess.trancheAge] - AGE_ORDER[target.trancheAge]);
  if (ageDiff === 0) {
    breakdown.age = POIDS.age;
  } else if (ageDiff === 1) {
    breakdown.age = POIDS.ageAdjacent;
  }

  const decadeDiff = Math.abs(
    Math.floor(guess.anneeSortieAnime / 10) - Math.floor(target.anneeSortieAnime / 10),
  );
  if (decadeDiff === 0) {
    breakdown.decennie = POIDS.decennie;
  } else if (decadeDiff === 1) {
    breakdown.decennie = POIDS.decennieAdjacente;
  }

  const total = Math.min(
    100,
    breakdown.anime +
      breakdown.role +
      breakdown.camp +
      breakdown.genre +
      breakdown.age +
      breakdown.typeEtre +
      breakdown.pouvoir +
      breakdown.decennie +
      breakdown.cheveux,
  );

  return { total, breakdown };
}
