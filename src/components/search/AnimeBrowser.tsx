import { useState, type FocusEvent } from 'react';
import { motion } from 'framer-motion';
import { ANIME_LIST } from '../../lib/animeList';
import { normalizeForSearch } from '../../lib/autocomplete';

interface AnimeBrowserProps {
  onSelect: (animeName: string) => void;
  onFilterFocus: () => void;
  onFilterBlur: (e: FocusEvent) => void;
}

export function AnimeBrowser({ onSelect, onFilterFocus, onFilterBlur }: AnimeBrowserProps) {
  const [filter, setFilter] = useState('');
  const q = normalizeForSearch(filter.trim());
  const visible = q ? ANIME_LIST.filter((a) => normalizeForSearch(a.name).includes(q)) : ANIME_LIST;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute left-0 right-0 top-[58px] z-50 rounded-card border border-border bg-surface p-3 shadow-dropdown"
    >
      <p className="mb-2 px-0.5 text-[12px] font-semibold text-muted">
        Aucune idée ? Choisis un anime pour voir ses personnages.
      </p>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        onFocus={onFilterFocus}
        onBlur={onFilterBlur}
        placeholder="Filtrer les animes…"
        autoComplete="off"
        aria-label="Filtrer la liste des animes"
        className="mb-2.5 h-9 w-full rounded-control border border-border bg-bg px-3 text-[13px] text-text outline-none focus:border-brand"
      />
      {visible.length === 0 ? (
        <p className="px-0.5 py-3 text-center text-[13px] text-muted">Aucun anime ne correspond.</p>
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
                className="flex min-h-touch w-full items-center justify-between gap-1.5 rounded-pill bg-brand-mid/10 px-3 py-2 text-left text-[12px] font-semibold text-brand-mid transition-colors hover:bg-brand-mid/20 active:scale-[.97]"
              >
                <span className="truncate">{a.name}</span>
                <span className="flex-none text-muted">({a.count})</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
