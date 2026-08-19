import { useState, type FocusEvent } from 'react';
import { motion } from 'framer-motion';
import { ANIME_LIST, AVAILABLE_DECADES } from '../../lib/animeList';
import { normalizeForSearch } from '../../lib/autocomplete';

interface AnimeBrowserProps {
  onSelect: (animeName: string) => void;
  onFilterFocus: () => void;
  onFilterBlur: (e: FocusEvent) => void;
}

export function AnimeBrowser({ onSelect, onFilterFocus, onFilterBlur }: AnimeBrowserProps) {
  const [filter, setFilter] = useState('');
  const [decade, setDecade] = useState<number | null>(null);
  const q = normalizeForSearch(filter.trim());
  const byText = q ? ANIME_LIST.filter((a) => normalizeForSearch(a.name).includes(q)) : ANIME_LIST;
  const visible = decade === null ? byText : byText.filter((a) => a.decade === decade);
  const filtersActive = decade !== null || q.length > 0;

  function resetFilters() {
    setFilter('');
    setDecade(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 border-[3px] border-ink bg-surface p-3 shadow-dropdown"
    >
      <p className="mb-2 px-0.5 text-[12px] font-semibold text-muted">
        Aucune idée ? Choisis un anime pour voir ses personnages.
      </p>
      <div className="mb-2.5 flex gap-1.5 overflow-x-auto pb-0.5">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setDecade(null);
          }}
          className={`flex-none whitespace-nowrap border-2 px-3 py-1.5 font-display text-[12px] font-bold transition-colors ${
            decade === null
              ? 'border-ink bg-brand text-white'
              : 'border-border text-muted hover:border-brand-mid hover:text-brand-mid'
          }`}
        >
          Tous
        </button>
        {AVAILABLE_DECADES.map((d) => (
          <button
            key={d}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setDecade(d);
            }}
            className={`flex-none whitespace-nowrap border-2 px-3 py-1.5 font-display text-[12px] font-bold transition-colors ${
              decade === d
                ? 'border-ink bg-brand text-white'
                : 'border-border text-muted hover:border-brand-mid hover:text-brand-mid'
            }`}
          >
            {d}s
          </button>
        ))}
      </div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        onFocus={onFilterFocus}
        onBlur={onFilterBlur}
        placeholder="Filtrer les animes…"
        autoComplete="off"
        aria-label="Filtrer la liste des animes"
        className="mb-2.5 h-9 w-full border-2 border-ink bg-bg px-3 font-display text-[13px] font-bold text-text outline-none focus:border-[#FF5FB3]"
      />
      {visible.length === 0 ? (
        <div className="px-0.5 py-4 text-center text-[13px] text-muted">
          <p>{decade !== null ? 'Aucun anime trouvé pour cette période.' : 'Aucun anime ne correspond.'}</p>
          {filtersActive && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                resetFilters();
              }}
              className="mt-2.5 border-2 border-ink bg-bg px-3.5 py-1.5 font-display text-[12px] font-bold text-brand-dark"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <ul className="grid max-h-72 grid-cols-2 gap-1.5 overflow-y-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {visible.map((a) => (
            <li key={a.name}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(a.name);
                }}
                className="flex min-h-touch w-full flex-col items-start gap-0.5 border-2 border-transparent bg-brand-mid/10 px-3 py-2 text-left transition-colors hover:border-ink hover:bg-brand-mid/20 active:translate-x-[2px] active:translate-y-[2px]"
              >
                <span className="w-full truncate font-display text-[13px] font-bold text-brand-mid">{a.name}</span>
                <span className="font-mono text-[11px] font-medium text-muted">
                  {a.year} · {a.count} personnage{a.count > 1 ? 's' : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
