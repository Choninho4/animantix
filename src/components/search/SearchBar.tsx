import { useRef, useState, type KeyboardEvent } from 'react';
import { CHARACTERS } from '../../data/characters';
import { matchCharacters } from '../../lib/autocomplete';
import { useGameStore } from '../../store/useGameStore';
import type { Character } from '../../types/character';
import { SuggestionList } from './SuggestionList';

export function SearchBar() {
  const input = useGameStore((s) => s.input);
  const setInput = useGameStore((s) => s.setInput);
  const suggestionIndex = useGameStore((s) => s.suggestionIndex);
  const moveSuggestion = useGameStore((s) => s.moveSuggestion);
  const isInputFocused = useGameStore((s) => s.isInputFocused);
  const setFocus = useGameStore((s) => s.setFocus);
  const submitGuess = useGameStore((s) => s.submitGuess);
  const won = useGameStore((s) => s.won);
  const guesses = useGameStore((s) => s.guesses);
  const message = useGameStore((s) => s.message);

  const inputRef = useRef<HTMLInputElement>(null);
  const [blurTimeout, setBlurTimeout] = useState<number | null>(null);

  const suggestions = matchCharacters(input, CHARACTERS);
  const suggestionsOpen = isInputFocused && suggestions.length > 0 && !won;
  const triedIds = new Set(guesses.map((g) => g.id));

  function pick(character: Character) {
    submitGuess(character);
    inputRef.current?.focus();
  }

  function handleSubmit() {
    if (suggestions.length) {
      pick(suggestions[suggestionIndex] ?? suggestions[0]);
      return;
    }
    if (!input.trim()) return;
    submitGuess();
    inputRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveSuggestion(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveSuggestion(-1);
    } else if (e.key === 'Escape') {
      setFocus(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }

  const submitDisabled = input.trim().length === 0 || won;
  const fieldBorderClass = isInputFocused ? 'border-brand' : 'border-border';
  const messageColorClass =
    message.tone === 'warn' ? 'text-danger' : message.tone === 'win' ? 'text-brand' : 'text-muted';

  return (
    <section className="sticky top-[60px] z-40 bg-bg py-4 pb-2.5">
      <div className="relative">
        <div className="flex items-stretch gap-2.5">
          <div className="relative min-w-0 flex-1">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7.5" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (blurTimeout) window.clearTimeout(blurTimeout);
                setFocus(true);
              }}
              onBlur={() => {
                const id = window.setTimeout(() => setFocus(false), 120);
                setBlurTimeout(id);
              }}
              placeholder="Propose un personnage…"
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={suggestionsOpen}
              aria-controls="amx-suggestions"
              aria-label="Nom du personnage à proposer"
              disabled={won}
              className={`h-[52px] w-full rounded-control border-2 bg-surface pl-10 pr-3.5 text-[16px] text-text outline-none transition-colors ${fieldBorderClass}`}
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitDisabled}
            className={`min-h-[52px] flex-none rounded-control px-6 font-display text-[16px] font-bold transition-colors active:scale-[.98] ${
              submitDisabled
                ? 'cursor-not-allowed bg-border text-muted'
                : 'cursor-pointer bg-brand text-white'
            }`}
          >
            Valider
          </button>
        </div>

        {suggestionsOpen && (
          <SuggestionList
            suggestions={suggestions}
            activeIndex={suggestionIndex}
            triedIds={triedIds}
            onPick={pick}
            onHover={(i) => useGameStore.setState({ suggestionIndex: i })}
          />
        )}
      </div>

      <div aria-live="polite" className={`min-h-[22px] pt-2 text-[13px] font-semibold ${messageColorClass}`}>
        {message.text}
      </div>
    </section>
  );
}
