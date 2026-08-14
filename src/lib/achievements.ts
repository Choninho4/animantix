import type { Achievement, AchievementCategory, AchievementContext } from '../types/achievement';
import {
  BoltIcon,
  ClockIcon,
  FlameIcon,
  GlobeIcon,
  HourglassIcon,
  MedalIcon,
  MountainIcon,
  ShareIcon,
  ShieldIcon,
  SnowflakeIcon,
  TargetIcon,
  TrophyIcon,
} from '../components/icons/Icon';

const MINUTE = 60_000;

export const CATEGORY_ORDER: AchievementCategory[] = [
  'regularite',
  'efficacite',
  'vitesse',
  'sans-assistance',
  'perseverance',
  'exploration',
  'thermometre',
  'fidelite',
];

export const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  regularite: 'Régularité',
  efficacite: 'Efficacité',
  vitesse: 'Vitesse',
  'sans-assistance': 'Sans assistance',
  perseverance: 'Persévérance',
  exploration: 'Exploration',
  thermometre: 'Thermomètre',
  fidelite: 'Fidélité globale',
};

export const ACHIEVEMENTS: Achievement[] = [
  // --- Régularité ---
  {
    id: 'first-win',
    nom: 'Premier pas',
    description: 'Gagner sa première partie.',
    categorie: 'regularite',
    isUnlocked: (ctx) => ctx.won && ctx.stats.gamesWon === 1,
  },
  {
    id: 'streak-3',
    nom: 'Sur la bonne voie',
    description: 'Terminer une série de 3 jours d\'affilée.',
    categorie: 'regularite',
    isUnlocked: (ctx) => ctx.won && ctx.stats.currentStreak >= 3,
  },
  {
    id: 'streak-7',
    nom: 'Semaine parfaite',
    description: 'Terminer une série de 7 jours d\'affilée.',
    categorie: 'regularite',
    isUnlocked: (ctx) => ctx.won && ctx.stats.currentStreak >= 7,
  },
  {
    id: 'streak-30',
    nom: 'Habitude prise',
    description: 'Terminer une série de 30 jours d\'affilée.',
    categorie: 'regularite',
    isUnlocked: (ctx) => ctx.won && ctx.stats.currentStreak >= 30,
  },
  {
    id: 'streak-100',
    nom: 'Centurion',
    description: 'Terminer une série de 100 jours d\'affilée.',
    categorie: 'regularite',
    isUnlocked: (ctx) => ctx.won && ctx.stats.currentStreak >= 100,
  },

  // --- Efficacité ---
  {
    id: 'sixth-sense',
    nom: 'Sixième sens',
    description: 'Trouver le personnage du jour dès le premier essai.',
    categorie: 'efficacite',
    isUnlocked: (ctx) => ctx.won && ctx.guessCount === 1,
  },
  {
    id: 'unerring-flair',
    nom: 'Flair imparable',
    description: 'Trouver le personnage du jour en 3 essais ou moins.',
    categorie: 'efficacite',
    isUnlocked: (ctx) => ctx.won && ctx.guessCount <= 3,
  },
  {
    id: 'hunter-instinct',
    nom: 'Instinct de chasseur',
    description: 'Trouver le personnage du jour en 5 essais ou moins, à 10 reprises au total.',
    categorie: 'efficacite',
    isUnlocked: (ctx) => ctx.won && ctx.guessCount <= 5 && ctx.stats.winsWithin5Guesses >= 10,
  },

  // --- Vitesse ---
  {
    id: 'lightning',
    nom: 'Éclair',
    description: 'Trouver le personnage du jour en moins de 30 secondes.',
    categorie: 'vitesse',
    isUnlocked: (ctx) => ctx.won && ctx.elapsedMs < 30_000,
  },
  {
    id: 'cold-blood',
    nom: 'Sang-froid',
    description: 'Trouver le personnage du jour après plus de 5 minutes de jeu sur la même partie.',
    categorie: 'vitesse',
    isUnlocked: (ctx) => ctx.won && ctx.elapsedMs > 5 * MINUTE,
  },
  {
    id: 'fast-and-efficient',
    nom: 'Rapide et efficace',
    description: 'Trouver le personnage du jour en moins de 2 minutes, à 5 reprises au total.',
    categorie: 'vitesse',
    isUnlocked: (ctx) => ctx.won && ctx.elapsedMs < 2 * MINUTE && ctx.stats.winsUnder2Min >= 5,
  },

  // --- Sans assistance ---
  {
    id: 'solo',
    nom: 'Solo',
    description: 'Gagner une partie où chaque essai a obtenu au moins 4 critères corrects sur 8.',
    categorie: 'sans-assistance',
    isUnlocked: (ctx) => ctx.won && ctx.allGuessesPrecise,
  },
  {
    id: 'purism',
    nom: 'Purisme',
    description: 'Gagner 10 parties où chaque essai a obtenu au moins 4 critères corrects sur 8.',
    categorie: 'sans-assistance',
    isUnlocked: (ctx) => ctx.won && ctx.allGuessesPrecise && ctx.stats.winsAllPrecise >= 10,
  },

  // --- Persévérance ---
  {
    id: 'tenacity',
    nom: 'Ténacité',
    description: 'Gagner une partie après plus de 50 essais.',
    categorie: 'perseverance',
    isUnlocked: (ctx) => ctx.won && ctx.guessCount > 50,
  },
  {
    id: 'unbreakable',
    nom: 'Increvable',
    description: 'Gagner une partie après plus de 80 essais.',
    categorie: 'perseverance',
    isUnlocked: (ctx) => ctx.won && ctx.guessCount > 80,
  },

  // --- Exploration / diversité ---
  {
    id: 'encyclopedist',
    nom: 'Encyclopédiste',
    description: 'Proposer des personnages issus de 15 animes différents au cours d\'une seule partie.',
    categorie: 'exploration',
    isUnlocked: (ctx) => ctx.distinctAnimesInGame >= 15,
  },
  {
    id: 'time-traveler',
    nom: 'Voyageur temporel',
    description: 'Proposer des personnages issus de 5 décennies différentes au cours d\'une seule partie.',
    categorie: 'exploration',
    isUnlocked: (ctx) => ctx.distinctDecadesInGame >= 5,
  },
  {
    id: 'globetrotter',
    nom: 'Globe-trotter',
    description: 'Proposer des personnages issus de 20 animes différents au total, toutes parties confondues.',
    categorie: 'exploration',
    isUnlocked: (ctx) => ctx.stats.animesGuessedEver.length >= 20,
  },

  // --- Thermomètre ---
  {
    id: 'on-track',
    nom: 'Sur la bonne piste',
    description: 'Obtenir au moins 6 critères corrects sur 8 dès le tout premier essai d\'une partie.',
    categorie: 'thermometre',
    isUnlocked: (ctx) =>
      ctx.firstGuessCorrectCount !== null && ctx.firstGuessCorrectCount >= 6 && ctx.firstGuessCorrectCount < 8,
  },
  {
    id: 'polar-opposite',
    nom: 'Aux antipodes',
    description: 'Obtenir 1 seul critère correct ou moins dès le tout premier essai d\'une partie.',
    categorie: 'thermometre',
    isUnlocked: (ctx) => ctx.firstGuessCorrectCount !== null && ctx.firstGuessCorrectCount <= 1,
  },

  // --- Fidélité globale ---
  {
    id: 'veteran',
    nom: 'Vétéran',
    description: 'Jouer pendant 100 jours au total.',
    categorie: 'fidelite',
    isUnlocked: (ctx) => ctx.stats.daysPlayed >= 100,
  },
  {
    id: 'first-share',
    nom: 'Premier partage',
    description: 'Partager son résultat pour la première fois.',
    categorie: 'fidelite',
    isUnlocked: (ctx) => ctx.stats.shareCount >= 1,
  },
  {
    id: 'ambassador',
    nom: 'Ambassadeur',
    description: 'Partager son résultat 20 fois au total.',
    categorie: 'fidelite',
    isUnlocked: (ctx) => ctx.stats.shareCount >= 20,
  },
];

export const ACHIEVEMENT_ICONS: Record<string, (props: { size?: number; className?: string }) => JSX.Element> = {
  'first-win': TrophyIcon,
  'streak-3': FlameIcon,
  'streak-7': FlameIcon,
  'streak-30': FlameIcon,
  'streak-100': FlameIcon,
  'sixth-sense': TargetIcon,
  'unerring-flair': TargetIcon,
  'hunter-instinct': TargetIcon,
  lightning: BoltIcon,
  'cold-blood': HourglassIcon,
  'fast-and-efficient': BoltIcon,
  solo: ShieldIcon,
  purism: ShieldIcon,
  tenacity: MountainIcon,
  unbreakable: MountainIcon,
  encyclopedist: GlobeIcon,
  'time-traveler': ClockIcon,
  globetrotter: GlobeIcon,
  'on-track': FlameIcon,
  'polar-opposite': SnowflakeIcon,
  veteran: MedalIcon,
  'first-share': ShareIcon,
  ambassador: ShareIcon,
};

/**
 * Renvoie les ids des succès qui viennent d'être débloqués (condition remplie
 * ET pas déjà dans `alreadyUnlocked`). Un succès une fois acquis ne redisparaît
 * jamais, même si les conditions cessent d'être vraies plus tard (ex. un
 * streak cassé) — c'est pour ça qu'on ne teste que les nouveaux, jamais un
 * retrait.
 */
export function checkAchievements(ctx: AchievementContext, alreadyUnlocked: string[]): string[] {
  const unlockedSet = new Set(alreadyUnlocked);
  const newly: string[] = [];
  for (const achievement of ACHIEVEMENTS) {
    if (unlockedSet.has(achievement.id)) continue;
    if (achievement.isUnlocked(ctx)) newly.push(achievement.id);
  }
  return newly;
}

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export function achievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.categorie === category);
}
