import { create } from 'zustand';
import type { Character } from '../types/character';
import type { DayState, GuessEntry } from '../types/guess';
import { EMPTY_STATS, guessBucketFor, type Stats } from '../types/stats';
import { CHARACTERS } from '../data/characters';
import { calculateSimilarity } from '../lib/scoring';
import { characterForDayIndex, dayIndexFor } from '../lib/dailySelector';
import { findExactMatch, matchCharacters } from '../lib/autocomplete';
import { hasSeenIntro, isDayWon, loadDay, loadStats, markSeen, saveDay, saveStats } from '../lib/storage';

type MessageTone = 'info' | 'warn' | 'win';

interface ModalState {
  rules: boolean;
  stats: boolean;
  archive: boolean;
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
  message: { text: string; tone: MessageTone };

  stats: Stats;
  now: number;

  modals: ModalState;
  initialized: boolean;

  init(): void;
  loadDay(offset: number): void;
  setInput(value: string): void;
  moveSuggestion(direction: 1 | -1): void;
  setFocus(value: boolean): void;
  submitGuess(character?: Character): void;
  revealHint(): void;
  exitArchive(): void;
  openModal(name: keyof ModalState): void;
  closeModals(): void;
  tick(): void;
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
  message: { text: '', tone: 'info' },

  stats: EMPTY_STATS,
  now: Date.now(),

  modals: { rules: false, stats: false, archive: false },
  initialized: false,

  init() {
    if (get().initialized) return;
    const stats = loadStats();
    const firstVisit = !hasSeenIntro();
    markSeen();
    set({ stats, initialized: true, modals: { rules: firstVisit, stats: false, archive: false } });
    get().loadDay(0);
  },

  loadDay(offset) {
    const idx = todayIndex() - offset;
    const day = loadDay(idx);
    set({
      archiveOffset: offset,
      guesses: day?.g ?? [],
      won: !!day?.won,
      hintsRevealed: day?.h ?? 0,
      startedAt: day?.t ?? Date.now(),
      elapsed: day?.e ?? 0,
      input: '',
      suggestionIndex: 0,
      message: { text: '', tone: 'info' },
      modals: { ...get().modals, archive: false },
    });
  },

  setInput(value) {
    set({ input: value, suggestionIndex: 0, isInputFocused: true, message: { text: '', tone: 'info' } });
  },

  moveSuggestion(direction) {
    const state = get();
    const suggestions = matchCharacters(state.input, CHARACTERS);
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

  submitGuess(character) {
    const state = get();
    if (state.won) return;

    let target = character;
    if (!target) {
      const suggestions = matchCharacters(state.input, CHARACTERS);
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
    const { total: score } = calculateSimilarity(target, cible);
    const entry: GuessEntry = { id: target.id, nom: target.nom, anime: target.animeSource, score, n: state.guesses.length + 1 };
    const guesses = [...state.guesses, entry];
    const won = score === 100;

    set({
      guesses,
      won,
      input: '',
      suggestionIndex: 0,
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
    };

    if (won) {
      const elapsed = Date.now() - state.startedAt;
      saveDay(dayIdx, current, { g: guesses, won: true, e: elapsed });
      set({ elapsed });
      if (state.archiveOffset === 0) {
        const s: Stats = {
          ...state.stats,
          gamesPlayed: state.stats.gamesPlayed + 1,
          gamesWon: state.stats.gamesWon + 1,
          currentStreak: state.stats.currentStreak + 1,
          maxStreak: Math.max(state.stats.maxStreak, state.stats.currentStreak + 1),
          guessDistribution: { ...state.stats.guessDistribution },
        };
        const bucket = guessBucketFor(guesses.length);
        s.guessDistribution[bucket] = (s.guessDistribution[bucket] ?? 0) + 1;
        saveStats(s);
        set({ stats: s });
      }
    } else {
      saveDay(dayIdx, current, { g: guesses });
    }
  },

  revealHint() {
    const state = get();
    const h = state.hintsRevealed + 1;
    const dayIdx = todayIndex() - state.archiveOffset;
    const current: DayState = { g: state.guesses, won: state.won, h: state.hintsRevealed, t: state.startedAt, e: state.elapsed };
    saveDay(dayIdx, current, { h });
    set({ hintsRevealed: h });
  },

  exitArchive() {
    get().loadDay(0);
  },

  openModal(name) {
    set((state) => ({ modals: { ...state.modals, [name]: true } }));
  },

  closeModals() {
    set({ modals: { rules: false, stats: false, archive: false } });
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
  return isDayWon(todayIndex() - daysAgo);
}

export { todayIndex };
