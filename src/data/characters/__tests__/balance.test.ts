import { describe, expect, it } from 'vitest';
import { CHARACTERS } from '../index';

const HIGH_CAP_ANIME = new Set(['One Piece', 'Naruto', 'Dragon Ball']);
const STANDARD_CAP = 10;
const PLACEHOLDER_RE = /\b(TODO|TBD|XXX|PLACEHOLDER|LOREM|FIXME|N\/A|UNKNOWN)\b/i;

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

describe('base de données de personnages', () => {
  it('contient au moins 450 personnages', () => {
    expect(CHARACTERS.length).toBeGreaterThanOrEqual(450);
  });

  it("n'a aucun id dupliqué", () => {
    const ids = CHARACTERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('couvre au moins 100 animes différents', () => {
    const animes = new Set(CHARACTERS.map((c) => c.animeSource));
    expect(animes.size).toBeGreaterThanOrEqual(100);
  });

  it('ne dépasse pas le plafond par licence, sauf exception One Piece/Naruto', () => {
    const counts = new Map<string, number>();
    for (const c of CHARACTERS) {
      counts.set(c.animeSource, (counts.get(c.animeSource) ?? 0) + 1);
    }
    for (const [anime, count] of counts) {
      if (HIGH_CAP_ANIME.has(anime)) continue;
      expect(count, `${anime} a ${count} personnages`).toBeLessThanOrEqual(STANDARD_CAP);
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
    for (const c of CHARACTERS) {
      for (const field of ['id', 'nom', 'animeSource', 'couleurCheveux', 'descriptionCourte'] as const) {
        const val = c[field];
        expect(val, `${c.id}.${field}`).toBe(val.trim());
        expect(PLACEHOLDER_RE.test(val), `${c.id}.${field} = "${val}"`).toBe(false);
      }
    }
  });

  it('anneeSortieAnime est toujours un entier', () => {
    for (const c of CHARACTERS) {
      expect(Number.isInteger(c.anneeSortieAnime), c.id).toBe(true);
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

  it('imageUrl est soit null, soit une chaîne non vide', () => {
    for (const c of CHARACTERS) {
      if (c.imageUrl !== null) {
        expect(typeof c.imageUrl, c.id).toBe('string');
        expect(c.imageUrl!.trim().length, c.id).toBeGreaterThan(0);
      }
    }
  });
});
