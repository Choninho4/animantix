import type { Character } from '../types/character';

// Doit rester >= à la plus grande licence de la base (One Piece va jusqu'à 40
// personnages) pour qu'une recherche par nom d'anime affiche tout le casting
// plutôt que de couper arbitrairement selon l'ordre d'insertion.
const MAX_SUGGESTIONS = 40;

export function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function matchCharacters(query: string, characters: Character[]): Character[] {
  const q = normalizeForSearch(query.trim());
  if (q.length < 2) return [];

  const starts: Character[] = [];
  const contains: Character[] = [];

  for (const c of characters) {
    const nom = normalizeForSearch(c.nom);
    const anime = normalizeForSearch(c.animeSource);
    if (nom.startsWith(q)) {
      starts.push(c);
    } else if (nom.includes(q) || anime.includes(q)) {
      contains.push(c);
    }
  }

  // Tri alphabétique du bucket "contient" : rend une recherche par nom d'anime
  // (ex. "one piece") navigable et prévisible plutôt que dépendante de l'ordre
  // d'insertion des fichiers de données.
  contains.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));

  return starts.concat(contains).slice(0, MAX_SUGGESTIONS);
}

export function findExactMatch(query: string, characters: Character[]): Character | undefined {
  const q = normalizeForSearch(query.trim());
  return characters.find((c) => normalizeForSearch(c.nom) === q);
}
