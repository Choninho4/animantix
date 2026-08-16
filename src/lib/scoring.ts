import type { Character, RoleNarratif, CampMoral } from '../types/character';
import { POIDS } from './constants';

export type CriterionKey = 'anime' | 'role' | 'camp' | 'race' | 'pouvoir' | 'decennie' | 'genre' | 'cheveux';
export type CriterionStatus = 'exact' | 'partial' | 'none';

export interface CriterionDetail {
  key: CriterionKey;
  label: string;
  valeurAffichee: string;
  status: CriterionStatus;
  points: number;
  maxPoints: number;
  /** Uniquement pour `decennie` quand le statut n'est pas 'exact' : sens vers le personnage du jour. */
  direction?: 'haut' | 'bas';
}

export interface ScoreResult {
  total: number;
  details: CriterionDetail[];
}

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

const LABELS: Record<CriterionKey, string> = {
  anime: 'Même anime',
  role: 'Rôle narratif',
  camp: 'Camp moral',
  race: 'Race',
  pouvoir: 'Type de pouvoir',
  decennie: 'Décennie de sortie',
  genre: 'Genre',
  cheveux: 'Couleur de cheveux',
};

function decadeOf(year: number): number {
  return Math.floor(year / 10) * 10;
}

export function calculateSimilarity(guess: Character, target: Character): ScoreResult {
  const details: CriterionDetail[] = [];

  const animeExact = guess.animeSource === target.animeSource;
  details.push({
    key: 'anime',
    label: LABELS.anime,
    valeurAffichee: guess.animeSource,
    status: animeExact ? 'exact' : 'none',
    points: animeExact ? POIDS.anime : 0,
    maxPoints: POIDS.anime,
  });

  let roleStatus: CriterionStatus = 'none';
  let rolePoints = 0;
  if (guess.roleNarratif === target.roleNarratif) {
    roleStatus = 'exact';
    rolePoints = POIDS.role;
  } else if (ROLE_GROUP[guess.roleNarratif] === ROLE_GROUP[target.roleNarratif]) {
    roleStatus = 'partial';
    rolePoints = POIDS.roleProche;
  }
  details.push({
    key: 'role',
    label: LABELS.role,
    valeurAffichee: guess.roleNarratif,
    status: roleStatus,
    points: rolePoints,
    maxPoints: POIDS.role,
  });

  let campStatus: CriterionStatus = 'none';
  let campPoints = 0;
  if (guess.campMoral === target.campMoral) {
    campStatus = 'exact';
    campPoints = POIDS.camp;
  } else {
    const pair = [CAMP_ORDER[guess.campMoral], CAMP_ORDER[target.campMoral]].sort((a, b) => a - b).join('-');
    if (CAMP_ADJACENT_PAIRS.has(pair)) {
      campStatus = 'partial';
      campPoints = POIDS.campAdjacent;
    }
  }
  details.push({
    key: 'camp',
    label: LABELS.camp,
    valeurAffichee: guess.campMoral,
    status: campStatus,
    points: campPoints,
    maxPoints: POIDS.camp,
  });

  const raceExact = guess.race === target.race;
  details.push({
    key: 'race',
    label: LABELS.race,
    valeurAffichee: guess.race,
    status: raceExact ? 'exact' : 'none',
    points: raceExact ? POIDS.race : 0,
    maxPoints: POIDS.race,
  });

  const pouvoirExact = guess.categoriePouvoir === target.categoriePouvoir;
  details.push({
    key: 'pouvoir',
    label: LABELS.pouvoir,
    valeurAffichee: guess.categoriePouvoir,
    status: pouvoirExact ? 'exact' : 'none',
    points: pouvoirExact ? POIDS.pouvoir : 0,
    maxPoints: POIDS.pouvoir,
  });

  const guessDecade = decadeOf(guess.anneeSortieAnime);
  const targetDecade = decadeOf(target.anneeSortieAnime);
  const decadeDiff = Math.abs(guessDecade - targetDecade) / 10;
  let decennieStatus: CriterionStatus = 'none';
  let decenniePoints = 0;
  if (decadeDiff === 0) {
    decennieStatus = 'exact';
    decenniePoints = POIDS.decennie;
  } else if (decadeDiff === 1) {
    decennieStatus = 'partial';
    decenniePoints = POIDS.decennieAdjacente;
  }
  const decennieDetail: CriterionDetail = {
    key: 'decennie',
    label: LABELS.decennie,
    valeurAffichee: `${guessDecade}s`,
    status: decennieStatus,
    points: decenniePoints,
    maxPoints: POIDS.decennie,
  };
  if (decennieStatus !== 'exact') {
    decennieDetail.direction = targetDecade < guessDecade ? 'bas' : 'haut';
  }
  details.push(decennieDetail);

  const genreExact = guess.genre === target.genre;
  details.push({
    key: 'genre',
    label: LABELS.genre,
    valeurAffichee: guess.genre,
    status: genreExact ? 'exact' : 'none',
    points: genreExact ? POIDS.genre : 0,
    maxPoints: POIDS.genre,
  });

  const cheveuxExact = guess.couleurCheveux === target.couleurCheveux;
  details.push({
    key: 'cheveux',
    label: LABELS.cheveux,
    valeurAffichee: guess.couleurCheveux,
    status: cheveuxExact ? 'exact' : 'none',
    points: cheveuxExact ? POIDS.cheveux : 0,
    maxPoints: POIDS.cheveux,
  });

  const total = Math.min(100, details.reduce((sum, d) => sum + d.points, 0));
  return { total, details };
}
