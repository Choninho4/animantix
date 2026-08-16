import { create } from 'zustand';
import type { Character } from '../types/character';
import type { DayState, GuessEntry } from '../types/guess';
import { EMPTY_STATS, guessBucketFor, type Stats } from '../types/stats';
import type { AchievementContext } from '../types/achievement';
import { CHARACTERS } from '../data/characters';
import { calculateSimilarity } from '../lib/scoring';
import { characterForDayIndex, dayIndexFor } from '../lib/dailySelector';
import { findExactMatch, suggestionsFor } from '../lib/autocomplete';
import { hasSeenIntro, loadDay, loadStats, markSeen, saveDay, saveStats } from '../lib/storage';
import { checkAchievements } from '../lib/achievements';
import { getOrCreateAnonId } from '../lib/anonId';
import {
  fetchCommunityPercentile,
  fetchCommunityStats,
  submitCommunityResult,
  type CommunityPercentile,
} from '../lib/leaderboard';

type MessageTone = 'info' | 'warn' | 'win';

interface ModalState {
  rules: boolean;
  stats: boolean;
  archive: boolean;
  achievements: boolean;
}

interface GameState {
  archiveOffset: number;
  guesses: GuessEntry[];
  won: boolean;
  hintsRevealed: number;
  startedAt: number;
  elapsed: number;
  flashId: string | null;

  input: string;
  suggestionIndex: number;
  isInputFocused: boolean;
  animeFilter: string | null;
  message: { text: string; tone: MessageTone };

  stats: Stats;
  now: number;

  communityTotal: number | null;
  communityPercentile: CommunityPercentile | null;

  modals: ModalState;
  initialized: boolean;
  achievementQueue: string[];

  init(): void;
  loadDay(offset: number): void;
  setInput(value: string): void;
  moveSuggestion(direction: 1 | -1): void;
  setFocus(value: boolean): void;
  selectAnime(animeName: string): void;
  submitGuess(character?: Character): void;
  revealHint(): void;
  exitArchive(): void;
  openModal(name: keyof ModalState): void;
  closeModals(): void;
  tick(): void;
  recordShare(): void;
  dismissAchievementToast(): void;
}

/** Décennies et animes distincts déjà proposés dans la partie en cours (id → lookup CHARACTERS). */
function explorationCounts(guesses: GuessEntry[]): { distinctAnimes: number; distinctDecades: number } {
  const animes = new Set(guesses.map((g) => g.anime));
  const decades = new Set<number>();
  for (const g of guesses) {
    const character = CHARACTERS.find((c) => c.id === g.id);
    if (character) decades.add(Math.floor(character.anneeSortieAnime / 10));
  }
  return { distinctAnimes: animes.size, distinctDecades: decades.size };
}

function todayIndex(): number {
  return dayIndexFor(new Date());
}

export const useGameStore = create<GameState>((set, get) => ({
  archiveOffset: 0,
  guesses: [],
  won: false,
  hintsRevealed: 0,
  startedAt: Date.now(),
  elapsed: 0,
  flashId: null,

  input: '',
  suggestionIndex: 0,
  isInputFocused: false,
  animeFilter: null,
  message: { text: '', tone: 'info' },

  stats: EMPTY_STATS,
  now: Date.now(),

  communityTotal: null,
  communityPercentile: null,

  modals: { rules: false, stats: false, archive: false, achievements: false },
  initialized: false,
  achievementQueue: [],

  init() {
    if (get().initialized) return;
    const stats = loadStats();
    const firstVisit = !hasSeenIntro();
    markSeen();
    set({ stats, initialized: true, modals: { rules: firstVisit, stats: false, archive: false, achievements: false } });
    get().loadDay(0);
  },

  loadDay(offset) {
    const idx = todayIndex() - offset;
    const stored = loadDay(idx);
    const target = characterForDayIndex(idx, CHARACTERS);
    // Une base de personnages modifiée depuis la partie décale le mapping jour → personnage :
    // une partie sauvegardée contre un ancien personnage ne veut plus rien dire, on repart à zéro.
    const day = stored && stored.targetId === target.id ? stored : null;
    const won = !!day?.won;
    const elapsed = day?.e ?? 0;
    set({
      archiveOffset: offset,
      guesses: day?.g ?? [],
      won,
      hintsRevealed: day?.h ?? 0,
      startedAt: day?.t ?? Date.now(),
      elapsed,
      input: '',
      suggestionIndex: 0,
      animeFilter: null,
      message: { text: '', tone: 'info' },
      modals: { ...get().modals, archive: false },
      communityTotal: null,
      communityPercentile: null,
    });

    // Le classement communautaire ne couvre que le jour courant, jamais l'archive.
    if (offset === 0) {
      if (won) {
        fetchCommunityPercentile(idx, elapsed).then((result) => {
          if (result) set({ communityPercentile: result });
        });
      } else {
        fetchCommunityStats(idx).then((result) => {
          if (result) set({ communityTotal: result.total });
        });
      }
    }
  },

  setInput(value) {
    set({ input: value, suggestionIndex: 0, isInputFocused: true, animeFilter: null, message: { text: '', tone: 'info' } });
  },

  moveSuggestion(direction) {
    const state = get();
    const suggestions = suggestionsFor(state.input, state.animeFilter, CHARACTERS);
    if (!suggestions.length) return;
    const next =
      direction === 1
        ? Math.min(state.suggestionIndex + 1, suggestions.length - 1)
        : Math.max(state.suggestionIndex - 1, 0);
    set({ suggestionIndex: next, isInputFocused: true });
  },

  setFocus(value) {
    set({ isInputFocused: value });
  },

  selectAnime(animeName) {
    set({
      input: animeName,
      animeFilter: animeName,
      suggestionIndex: 0,
      isInputFocused: true,
      message: { text: '', tone: 'info' },
    });
  },

  submitGuess(character) {
    const state = get();
    if (state.won) return;

    let target = character;
    if (!target) {
      const suggestions = suggestionsFor(state.input, state.animeFilter, CHARACTERS);
      if (suggestions.length) {
        target = suggestions[state.suggestionIndex] ?? suggestions[0];
      } else {
        const query = state.input.trim();
        if (!query) return;
        target = findExactMatch(query, CHARACTERS);
        if (!target) {
          set({ message: { text: "Ce personnage n'est pas dans notre base, essaie un autre nom.", tone: 'warn' } });
          return;
        }
      }
    }

    if (state.guesses.some((g) => g.id === target!.id)) {
      set({ message: { text: `Déjà essayé — ${target.nom} est dans ta liste.`, tone: 'warn' } });
      return;
    }

    const dayIdx = todayIndex() - state.archiveOffset;
    const cible = characterForDayIndex(dayIdx, CHARACTERS);
    const { total: score, details } = calculateSimilarity(target, cible);
    const entry: GuessEntry = {
      id: target.id,
      nom: target.nom,
      anime: target.animeSource,
      score,
      details,
      n: state.guesses.length + 1,
    };
    const guesses = [...state.guesses, entry];
    const won = score === 100;

    set({
      guesses,
      won,
      input: '',
      suggestionIndex: 0,
      animeFilter: null,
      flashId: target.id,
      message: won
        ? { text: `Bravo ! Le personnage du jour était ${target.nom}.`, tone: 'win' }
        : { text: `${target.nom} — ${score} %`, tone: 'info' },
    });

    const current: DayState = {
      g: state.guesses,
      won: state.won,
      h: state.hintsRevealed,
      t: state.startedAt,
      e: state.elapsed,
      targetId: cible.id,
    };

    let elapsed = state.elapsed;
    const isToday = state.archiveOffset === 0;
    let s: Stats = state.stats;

    if (won) {
      elapsed = Date.now() - state.startedAt;
      saveDay(dayIdx, current, { g: guesses, won: true, e: elapsed });
      set({ elapsed });
      if (isToday) {
        submitCommunityResult(getOrCreateAnonId(), dayIdx, elapsed).then((result) => {
          if (result) set({ communityPercentile: result });
        });
      }
    } else {
      saveDay(dayIdx, current, { g: guesses });
    }

    if (isToday) {
      // Suivi cumulatif indépendant de la victoire : un anime "proposé" compte
      // dès l'essai, même si la partie n'est pas encore gagnée.
      if (!s.animesGuessedEver.includes(target.animeSource)) {
        s = { ...s, animesGuessedEver: [...s.animesGuessedEver, target.animeSource] };
      }
      if (guesses.length === 1 && s.lastPlayedDayIndex !== dayIdx) {
        s = { ...s, daysPlayed: s.daysPlayed + 1, lastPlayedDayIndex: dayIdx };
      }

      if (won) {
        s = {
          ...s,
          gamesPlayed: s.gamesPlayed + 1,
          gamesWon: s.gamesWon + 1,
          currentStreak: state.stats.currentStreak + 1,
          maxStreak: Math.max(state.stats.maxStreak, state.stats.currentStreak + 1),
          guessDistribution: { ...s.guessDistribution },
          winsWithoutHint: s.winsWithoutHint + (state.hintsRevealed === 0 ? 1 : 0),
          winsUnder2Min: s.winsUnder2Min + (elapsed < 2 * 60_000 ? 1 : 0),
          winsWithin5Guesses: s.winsWithin5Guesses + (guesses.length <= 5 ? 1 : 0),
        };
        const bucket = guessBucketFor(guesses.length);
        s.guessDistribution[bucket] = (s.guessDistribution[bucket] ?? 0) + 1;
      }

      const { distinctAnimes, distinctDecades } = explorationCounts(guesses);
      const ctx: AchievementContext = {
        won,
        guessCount: guesses.length,
        hintsRevealed: state.hintsRevealed,
        elapsedMs: won ? elapsed : state.elapsed,
        firstGuessScore: guesses[0]?.score ?? null,
        distinctAnimesInGame: distinctAnimes,
        distinctDecadesInGame: distinctDecades,
        stats: s,
      };
      const newlyUnlocked = checkAchievements(ctx, s.unlockedAchievements);
      if (newlyUnlocked.length) {
        s = { ...s, unlockedAchievements: [...s.unlockedAchievements, ...newlyUnlocked] };
      }

      if (s !== state.stats) {
        saveStats(s);
        set((st) => ({ stats: s, achievementQueue: [...st.achievementQueue, ...newlyUnlocked] }));
      }
    }
  },

  revealHint() {
    const state = get();
    const h = state.hintsRevealed + 1;
    const dayIdx = todayIndex() - state.archiveOffset;
    const cible = characterForDayIndex(dayIdx, CHARACTERS);
    const current: DayState = {
      g: state.guesses,
      won: state.won,
      h: state.hintsRevealed,
      t: state.startedAt,
      e: state.elapsed,
      targetId: cible.id,
    };
    saveDay(dayIdx, current, { h });
    set({ hintsRevealed: h });
  },

  exitArchive() {
    get().loadDay(0);
  },

  recordShare() {
    const state = get();
    if (state.archiveOffset !== 0) return;
    const s: Stats = { ...state.stats, shareCount: state.stats.shareCount + 1 };
    const { distinctAnimes, distinctDecades } = explorationCounts(state.guesses);
    const ctx: AchievementContext = {
      won: state.won,
      guessCount: state.guesses.length,
      hintsRevealed: state.hintsRevealed,
      elapsedMs: state.elapsed,
      firstGuessScore: state.guesses[0]?.score ?? null,
      distinctAnimesInGame: distinctAnimes,
      distinctDecadesInGame: distinctDecades,
      stats: s,
    };
    const newlyUnlocked = checkAchievements(ctx, s.unlockedAchievements);
    const finalStats = newlyUnlocked.length ? { ...s, unlockedAchievements: [...s.unlockedAchievements, ...newlyUnlocked] } : s;
    saveStats(finalStats);
    set((st) => ({ stats: finalStats, achievementQueue: [...st.achievementQueue, ...newlyUnlocked] }));
  },

  dismissAchievementToast() {
    set((state) => ({ achievementQueue: state.achievementQueue.slice(1) }));
  },

  openModal(name) {
    set((state) => ({ modals: { ...state.modals, [name]: true } }));
  },

  closeModals() {
    set({ modals: { rules: false, stats: false, archive: false, achievements: false } });
  },

  tick() {
    set({ now: Date.now() });
  },
}));

export function currentTarget(): Character {
  const state = useGameStore.getState();
  const idx = todayIndex() - state.archiveOffset;
  return characterForDayIndex(idx, CHARACTERS);
}

export function isArchiveDayWon(daysAgo: number): boolean {
  const idx = todayIndex() - daysAgo;
  const day = loadDay(idx);
  if (!day?.won) return false;
  const target = characterForDayIndex(idx, CHARACTERS);
  return day.targetId === target.id;
}

export { todayIndex };
