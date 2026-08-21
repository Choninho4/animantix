import { describe, expect, it } from 'vitest';
import { CHARACTERS } from '../index';

// Base recentrée sur les animes les plus mainstream — liste validée avec l'utilisateur.
// Un anime hors de cette liste dans CHARACTERS est une régression (faute de frappe,
// variante d'orthographe, ou ajout non validé), pas une simple limite à ajuster.
const APPROVED_ANIMES = new Set([
  'One Piece', 'Naruto', 'Dragon Ball',
  'My Hero Academia', 'Jujutsu Kaisen', 'Demon Slayer', 'Bleach',
  'Hunter x Hunter (2011)', 'Chainsaw Man', 'Black Clover', 'Fairy Tail',
  "L'Attaque des Titans", 'Tokyo Ghoul', 'Death Note', 'Berserk', 'Monster',
  'Vinland Saga', 'Code Geass', 'Neon Genesis Evangelion', 'Ghost in the Shell',
  'Re:Zero', 'Konosuba', 'Overlord', 'That Time I Got Reincarnated as a Slime',
  'Mushoku Tensei', "Frieren: Beyond Journey's End", 'Solo Leveling',
  'Sword Art Online', 'The Seven Deadly Sins',
  'Haikyuu!!', 'Blue Lock', 'Inazuma Eleven', 'Ao Ashi', "Kuroko's Basketball", 'Slam Dunk',
  'Spy x Family', 'Kaguya-sama: Love is War', 'Toradora!', 'Fruits Basket',
  'Nana', 'Oshi no Ko', 'Banana Fish',
  'Gintama', 'Yu Yu Hakusho', 'Cowboy Bebop', 'One Punch Man', 'Mob Psycho 100',
  "JoJo's Bizarre Adventure", 'Sailor Moon', 'Fullmetal Alchemist: Brotherhood',
  'Kaiju No. 8', 'Assassination Classroom', 'Steins;Gate', 'Mobile Suit Gundam',
]);

// Plafond de sécurité généreux, pas un objectif : les gros animes visent 30-50,
// les moyens 15-25, les plus courts ce que le casting permet raisonnablement.
const MAX_PER_ANIME = 50;
// Un champ dont la valeur ENTIÈRE est un de ces mots est un placeholder oublié.
// Un mot comme "Todo" dans "Aoi Todo" ne doit pas déclencher de faux positif.
const PLACEHOLDER_VALUES = new Set(['TODO', 'TBD', 'XXX', 'PLACEHOLDER', 'LOREM', 'FIXME', 'N/A', 'UNKNOWN']);

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

describe('base de données de personnages', () => {
  it('contient au moins 750 personnages (base recentrée mais élargie)', () => {
    expect(CHARACTERS.length).toBeGreaterThanOrEqual(750);
  });

  it(`couvre exactement les ${APPROVED_ANIMES.size} animes validés, ni plus ni moins`, () => {
    const animes = new Set(CHARACTERS.map((c) => c.animeSource));
    const unexpected = [...animes].filter((a) => !APPROVED_ANIMES.has(a));
    const missing = [...APPROVED_ANIMES].filter((a) => !animes.has(a));
    expect(unexpected, `animes présents mais non approuvés : ${unexpected.join(', ')}`).toEqual([]);
    expect(missing, `animes approuvés mais absents : ${missing.join(', ')}`).toEqual([]);
  });

  it("n'a aucun id dupliqué", () => {
    const ids = CHARACTERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ne dépasse jamais le plafond de sécurité par anime', () => {
    const counts = new Map<string, number>();
    for (const c of CHARACTERS) {
      counts.set(c.animeSource, (counts.get(c.animeSource) ?? 0) + 1);
    }
    for (const [anime, count] of counts) {
      expect(count, `${anime} a ${count} personnages`).toBeLessThanOrEqual(MAX_PER_ANIME);
    }
  });

  it('a une répartition de genre non extrême (chaque genre représente au moins 1%)', () => {
    const counts = new Map<string, number>();
    for (const c of CHARACTERS) {
      counts.set(c.genre, (counts.get(c.genre) ?? 0) + 1);
    }
    for (const count of counts.values()) {
      expect(count / CHARACTERS.length).toBeGreaterThan(0.01);
    }
  });

  it("n'a pas une seule décennie qui dépasse 80% du total", () => {
    const counts = new Map<number, number>();
    for (const c of CHARACTERS) {
      const decade = Math.floor(c.anneeSortieAnime / 10) * 10;
      counts.set(decade, (counts.get(decade) ?? 0) + 1);
    }
    for (const count of counts.values()) {
      expect(count / CHARACTERS.length).toBeLessThan(0.8);
    }
  });

  it('a chaque champ obligatoire non vide pour tous les personnages', () => {
    for (const c of CHARACTERS) {
      expect(c.nom.length).toBeGreaterThan(0);
      expect(c.animeSource.length).toBeGreaterThan(0);
      expect(c.descriptionCourte.length).toBeGreaterThan(10);
      expect(c.couleurCheveux.length).toBeGreaterThan(0);
      expect(c.anneeSortieAnime).toBeGreaterThanOrEqual(1960);
      expect(c.anneeSortieAnime).toBeLessThanOrEqual(2026);
    }
  });

  it("n'a aucun champ texte avec des espaces en trop ou une valeur placeholder oubliée", () => {
    // 'id' est exclu du scan placeholder : un slug légitime (ex. "aoi-todo") peut
    // contenir la sous-chaîne d'un mot-clé placeholder sans en être un.
    for (const c of CHARACTERS) {
      for (const field of ['id', 'nom', 'animeSource', 'couleurCheveux', 'descriptionCourte'] as const) {
        const val = c[field];
        expect(val, `${c.id}.${field}`).toBe(val.trim());
        expect(PLACEHOLDER_VALUES.has(val.trim().toUpperCase()), `${c.id}.${field} = "${val}"`).toBe(false);
      }
    }
  });

  it('anneeSortieAnime est toujours un entier', () => {
    for (const c of CHARACTERS) {
      expect(Number.isInteger(c.anneeSortieAnime), c.id).toBe(true);
    }
  });

  it('anneeSortieAnime est identique pour tous les personnages d\'un même anime (date de sortie de la saison 1, pas de l\'arc du personnage)', () => {
    const years = new Map<string, Set<number>>();
    for (const c of CHARACTERS) {
      const set = years.get(c.animeSource) ?? new Set();
      set.add(c.anneeSortieAnime);
      years.set(c.animeSource, set);
    }
    for (const [anime, set] of years) {
      expect(set.size, `"${anime}" a plusieurs années : ${[...set].join(' / ')}`).toBe(1);
    }
  });

  it("n'a aucun doublon (même nom + même anime) sous deux ids différents", () => {
    const seen = new Map<string, string>();
    for (const c of CHARACTERS) {
      const key = `${norm(c.nom)}|||${norm(c.animeSource)}`;
      const existing = seen.get(key);
      expect(existing, `"${c.nom}" (${c.animeSource}) : doublon entre ${existing} et ${c.id}`).toBeUndefined();
      seen.set(key, c.id);
    }
  });

  it("orthographie animeSource de façon strictement identique pour un même anime (pas de variante)", () => {
    const variants = new Map<string, Set<string>>();
    for (const c of CHARACTERS) {
      const key = norm(c.animeSource);
      const set = variants.get(key) ?? new Set();
      set.add(c.animeSource);
      variants.set(key, set);
    }
    for (const [key, set] of variants) {
      expect(set.size, `"${key}" a des orthographes différentes : ${[...set].join(' / ')}`).toBe(1);
    }
  });

  it("n'a aucune variante de casse pour couleurCheveux (ex. 'Blond' vs 'blond')", () => {
    const variants = new Map<string, Set<string>>();
    for (const c of CHARACTERS) {
      const key = norm(c.couleurCheveux);
      const set = variants.get(key) ?? new Set();
      set.add(c.couleurCheveux);
      variants.set(key, set);
    }
    for (const [key, set] of variants) {
      expect(set.size, `couleurCheveux "${key}" a des variantes : ${[...set].join(' / ')}`).toBe(1);
    }
  });

  it('imageUrl pointe vers le portrait WebP local dérivé de l’id', () => {
    for (const c of CHARACTERS) {
      expect(c.imageUrl, c.id).toBe(`/assets/characters/${c.id}.webp`);
    }
  });
});
