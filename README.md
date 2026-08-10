# Animantix

Le jeu quotidien de devinette de personnages d'anime, façon Cémantix. Un personnage mystère différent chaque jour (le même pour tout le monde) ; propose des noms, chaque essai reçoit un score de proximité de 0 à 100 %.

100 % statique — aucun backend, aucune base de données externe. L'état du jour et les statistiques sont stockés dans le `localStorage` du navigateur.

## Stack

Vite · React 18 · TypeScript · Tailwind CSS · Framer Motion · Zustand · Vitest

## Lancer le projet en local

```bash
npm install
npm run dev
```

Le serveur de dev démarre sur `http://localhost:5173`.

Autres commandes utiles :

```bash
npm run build   # build de production dans dist/
npm run test    # lance la suite de tests Vitest
```

## Ajouter de nouveaux personnages

La base de personnages vit dans `src/data/characters/`, répartie en plusieurs fichiers thématiques (`part-01-...ts` à `part-14-...ts`) pour rester maintenable — jamais un seul fichier monolithique.

Pour ajouter un personnage :

1. Choisis le fichier `part-XX-*.ts` le plus proche thématiquement (ou crée-en un nouveau si besoin).
2. Ajoute un objet respectant le type `Character` défini dans `src/types/character.ts` :

```typescript
{
  id: 'nom-du-personnage', // slug unique, stable dans le temps (ne jamais le changer une fois publié)
  nom: 'Nom Complet',
  animeSource: "Nom de l'anime",
  anneeSortieAnime: 2020,
  roleNarratif: 'Protagoniste principal', // voir les unions de types pour les valeurs valides
  campMoral: 'Héros',
  genre: 'Homme',
  trancheAge: 'Ado',
  typeEtre: 'Humain',
  categoriePouvoir: 'Combat physique',
  couleurCheveux: 'Noir',
  imageUrl: null, // volontairement toujours null (voir plus bas)
  descriptionCourte: 'Une phrase qui décrit le personnage sans donner son nom.',
}
```

3. Assure-toi que `id` est unique dans toute la base (le test `src/data/characters/__tests__/balance.test.ts` échouera sinon).
4. Le fichier est ensuite ré-exporté automatiquement via `src/data/characters/index.ts` — si tu crées un nouveau fichier `part-XX`, ajoute-le à cet index.
5. Lance `npm run test` pour vérifier que la base reste cohérente (pas de doublon, plafond par licence, répartition des genres/décennies).

### Pourquoi `imageUrl` est toujours `null`

Aucune image de personnage n'est utilisée dans l'app (choix assumé, voir la direction artistique) — cela évite tout risque de droits d'auteur sur les illustrations officielles des animes. Le champ reste dans le type pour une éventuelle extension future.

## Logique du jeu

- `src/lib/scoring.ts` — calcul du score de similarité (barème pondéré, voir les constantes `POIDS`)
- `src/lib/dailySelector.ts` — sélection déterministe du personnage du jour (mélange à seed fixe, un nouveau cycle quand la liste est épuisée)
- `src/lib/storage.ts` — wrapper localStorage (stats, essais du jour, indices révélés)
- `src/lib/hints.ts` — déblocage progressif des indices tous les 5 essais
- `src/store/useGameStore.ts` — état global (Zustand) qui orchestre tout ça

## Déploiement

Le projet est prévu pour un déploiement Vercel avec auto-deploy à chaque push sur la branche principale (aucune configuration particulière requise, Vercel détecte Vite automatiquement).
