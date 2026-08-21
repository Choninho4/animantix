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
npm run images:sync # reprend l'import local des portraits via Jikan
```

## Ajouter de nouveaux personnages

La base de personnages vit dans `src/data/characters/`, répartie en plusieurs fichiers thématiques (`part-01-...ts` à `part-08-...ts`) pour rester maintenable — jamais un seul fichier monolithique.

Pour ajouter un personnage :

1. Choisis le fichier `part-XX-*.ts` le plus proche thématiquement (ou crée-en un nouveau si besoin).
2. Ajoute un objet respectant le type éditorial `CharacterDefinition` défini dans `src/types/character.ts` :

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
  imageUrl: null, // définition brute ; le chemin local est dérivé automatiquement de l'id
  descriptionCourte: 'Une phrase qui décrit le personnage sans donner son nom.',
}
```

3. Assure-toi que `id` est unique dans toute la base (le test `src/data/characters/__tests__/balance.test.ts` échouera sinon).
4. Le fichier est ensuite ré-exporté automatiquement via `src/data/characters/index.ts` — si tu crées un nouveau fichier `part-XX`, ajoute-le à cet index.
5. Lance `npm run test` pour vérifier que la base reste cohérente (pas de doublon, plafond par licence, répartition des genres/décennies).

## Portraits locaux

Les fichiers thématiques conservent `imageUrl: null` comme donnée éditoriale. Lors de l'assemblage de `CHARACTERS`, l'application dérive le chemin stable `/assets/characters/<id>.webp`. Le navigateur ne contacte donc ni Jikan ni MyAnimeList pendant une partie.

Le script `npm run images:sync` :

1. récupère les castings des 54 licences via Jikan et, si son backend répond en 5xx, depuis les pages publiques MyAnimeList correspondantes, avec un limiteur global de 50 requêtes maximum par minute ;
2. associe uniquement les noms exacts après normalisation, avec `scripts/image-sync/overrides.json` pour les cas vérifiés manuellement ;
3. convertit les portraits en WebP 256 × 256 dans `public/assets/characters/`, avec un recul léger et un fond périphérique flouté pour éviter les visages trop zoomés ;
4. sauvegarde sa progression après chaque casting, recherche et image ;
5. génère `scripts/image-sync/manifest.json` et `scripts/image-sync/report.json`.

Le fallback conserve les mêmes IDs MAL et les mêmes images du CDN MyAnimeList ; il n'utilise aucune base alternative. Le script reste en échec tant que les 790 portraits ne sont pas présents et peut être relancé sans perdre sa progression après une erreur 429/5xx.

> Les URLs fournies par une API ne transfèrent pas les droits sur les illustrations. Ces assets sont préparés pour une copie locale de test non commerciale et ne doivent pas être publiés ou exploités commercialement sans autorisation adaptée.

## Logique du jeu

- `src/lib/scoring.ts` — calcul du score de similarité (barème pondéré, voir les constantes `POIDS`)
- `src/lib/dailySelector.ts` — sélection déterministe du personnage du jour (mélange à seed fixe, un nouveau cycle quand la liste est épuisée)
- `src/lib/storage.ts` — wrapper localStorage (stats, essais du jour, indices révélés)
- `src/lib/hints.ts` — déblocage progressif des indices tous les 5 essais
- `src/store/useGameStore.ts` — état global (Zustand) qui orchestre tout ça

## Déploiement

Le projet est prévu pour un déploiement Vercel avec auto-deploy à chaque push sur la branche principale (aucune configuration particulière requise, Vercel détecte Vite automatiquement).
