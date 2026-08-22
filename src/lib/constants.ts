export const POIDS = {
  anime: 30,
  role: 15,
  roleProche: 7,
  camp: 12,
  campAdjacent: 6,
  race: 12,
  pouvoir: 12,
  decennie: 8,
  decennieAdjacente: 3,
  genre: 6,
  cheveux: 5,
} as const;

export const DATE_REF = Date.UTC(2024, 0, 1);
export const TOKENS_TOUS_LES = 3;
export const SPECIAL_HINT_THRESHOLD = 20;

export const STATS_KEY = 'animantix.stats.v1';
export const DAY_KEY_PREFIX = 'animantix.jour.';
export const SEEN_KEY = 'animantix.seen';

/**
 * Bascule du mode clair côté utilisateur. `false` pour cette V1 : le site
 * reste verrouillé en mode sombre quels que soient `prefers-color-scheme`
 * ou une valeur déjà stockée en localStorage, et le bouton de bascule
 * clair/sombre est masqué partout (navbar, menu). Repasser à `true` pour
 * tout réactiver d'un coup — aucune autre suppression de code n'est
 * nécessaire, toute la logique du thème clair reste intacte.
 *
 * Le script inline de index.html applique le thème avant le chargement du
 * bundle JS (pour éviter un flash au premier rendu) et ne peut donc pas
 * importer cette constante — il porte sa propre copie littérale de cette
 * valeur (cherche `LIGHT_MODE_ENABLED` dans index.html), à garder
 * synchronisée si elle change ici.
 */
export const LIGHT_MODE_ENABLED = false;
