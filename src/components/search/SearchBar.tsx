import { useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CHARACTERS } from '../../data/characters';
import { suggestionsFor } from '../../lib/autocomplete';
import { useGameStore } from '../../store/useGameStore';
import type { Character } from '../../types/character';
import { SuggestionList } from './SuggestionList';
import { AnimeBrowser } from './AnimeBrowser';

export function SearchBar() {
  const input = useGameStore((s) => s.input);
  const setInput = useGameStore((s) => s.setInput);
  const suggestionIndex = useGameStore((s) => s.suggestionIndex);
  const moveSuggestion = useGameStore((s) => s.moveSuggestion);
  const isInputFocused = useGameStore((s) => s.isInputFocused);
  const setFocus = useGameStore((s) => s.setFocus);
  const submitGuess = useGameStore((s) => s.submitGuess);
  const selectAnime = useGameStore((s) => s.selectAnime);
  const animeFilter = useGameStore((s) => s.animeFilter);
  const won = useGameStore((s) => s.won);
  const guesses = useGameStore((s) => s.guesses);
  const message = useGameStore((s) => s.message);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [blurTimeout, setBlurTimeout] = useState<number | null>(null);

  const suggestions = suggestionsFor(input, animeFilter, CHARACTERS);
  const showAnimeBrowser = isInputFocused && input.length === 0 && !won;
  const suggestionsOpen = !showAnimeBrowser && isInputFocused && suggestions.length > 0 && !won;
  const triedIds = new Set(guesses.map((g) => g.id));

  function keepFocus() {
    if (blurTimeout) window.clearTimeout(blurTimeout);
    setFocus(true);
  }

  // Le champ principal et le filtre d'animes se partagent le même "groupe focus" :
  // on ne referme rien si le focus part vers un autre élément du même conteneur
  // (ex. clic du champ principal vers le filtre), seulement en cas de sortie réelle.
  function scheduleBlur(e: FocusEvent) {
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    const id = window.setTimeout(() => setFocus(false), 120);
    setBlurTimeout(id);
  }

  // Pas de refocus du champ après soumission d'un essai : sinon le focus rouvre
  // aussitôt la liste des animes (visible dès que le champ vide a le focus) et
  // masque le résultat de l'essai qui vient d'être ajouté au tableau. On force
  // même un blur() explicite : après une validation au clavier (Entrée), le
  // focus DOM n'a jamais quitté le champ, donc un clic ultérieur du joueur sur
  // ce même champ ne déclencherait aucun nouvel évènement focus sans ce blur —
  // et la liste ne pourrait plus jamais se rouvrir manuellement comme demandé.
  function pick(character: Character) {
    submitGuess(character);
    inputRef.current?.blur();
  }

  function handleSubmit() {
    if (suggestions.length) {
      pick(suggestions[suggestionIndex] ?? suggestions[0]);
      return;
    }
    if (!input.trim()) return;
    submitGuess();
    inputRef.current?.blur();
  }

  function handleAnimeSelect(animeName: string) {
    selectAnime(animeName);
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
  const fieldBorderClass = isInputFocused ? 'border-[#FF5FB3]' : 'border-ink';
  const messageColorClass =
    message.tone === 'warn' ? 'text-danger' : message.tone === 'win' ? 'text-brand' : 'text-muted';

  return (
    <section className="sticky top-[60px] z-40 bg-bg py-4 pb-2.5">
      <div ref={containerRef} className="relative">
        <div className="border-[4px] border-ink bg-surface p-3 shadow-[8px_8px_0_#D02886]">
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
              onFocus={keepFocus}
              onBlur={scheduleBlur}
              placeholder="Propose un personnage…"
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={suggestionsOpen}
              aria-controls="amx-suggestions"
              aria-label="Nom du personnage à proposer"
              disabled={won}
              className={`h-[52px] w-full border-[3px] bg-bg pl-10 pr-3.5 font-display text-[16px] font-bold text-text outline-none transition-colors ${fieldBorderClass}`}
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitDisabled}
            className={`min-h-[52px] flex-none border-[3px] px-6 font-display text-[16px] font-bold transition-colors ${
              submitDisabled
                ? 'cursor-not-allowed border-transparent bg-border text-muted'
                : 'cursor-pointer border-ink bg-brand text-white shadow-[5px_5px_0_#0B0B16] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none'
            }`}
          >
            Valider
          </button>
          </div>
        </div>

        <AnimatePresence>
          {showAnimeBrowser && (
            <AnimeBrowser onSelect={handleAnimeSelect} onFilterFocus={keepFocus} onFilterBlur={scheduleBlur} />
          )}
        </AnimatePresence>

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

      {/* mt-2 (pas pt-2) : un padding interne ne crée pas d'espace entre
          éléments, or la carte de recherche a une ombre dure de 8px — sans
          marge réelle avant ce bloc, l'ombre mordait sur les 8 premiers
          pixels du texte de message (cf. audit ombres neo-brutalism). */}
      <div aria-live="polite" className={`min-h-[22px] mt-2 text-[13px] font-semibold ${messageColorClass}`}>
        {message.text}
      </div>
    </section>
  );
}
