import { describe, expect, it } from 'vitest';
import { CHARACTERS } from '../index';

const HIGH_CAP_ANIME = new Set(['One Piece', 'Naruto', 'Dragon Ball']);
const STANDARD_CAP = 10;

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
      expect(c.anneeSortieAnime).toBeGreaterThanOrEqual(1950);
      expect(c.anneeSortieAnime).toBeLessThanOrEqual(2026);
    }
  });
});
