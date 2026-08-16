import { AnimatePresence, motion } from 'framer-motion';
import type { GuessEntry } from '../../types/guess';
import { temperatureForScore } from '../../lib/temperature';
import { useTheme } from '../../hooks/useTheme';
import { SearchIcon, TemperatureBandIcon } from '../icons/Icon';
import { AttemptDetail } from './AttemptDetail';

interface AttemptRowProps {
  guess: GuessEntry;
  isBest: boolean;
  justAdded: boolean;
  selected: boolean;
  analyzed: boolean;
  /** Pas encore analysé, mais un jeton est disponible : invite le joueur à cliquer. */
  analyzable: boolean;
  onToggle: () => void;
}

export function AttemptRow({ guess, isBest, justAdded, selected, analyzed, analyzable, onToggle }: AttemptRowProps) {
  const t = temperatureForScore(guess.score);
  const { theme } = useTheme();
  const badgeFg = theme === 'dark' ? t.fgDark : t.fg;
  const borderWidth = isBest ? 1.5 : 0.5;
  // rgb(var(--color-border)) plutôt qu'un hex figé : suit le thème clair/sombre actif.
  const borderColor = isBest ? t.color : 'rgb(var(--color-border))';
  const glow = isBest ? `0 0 0 3px ${t.bg}` : 'none';

  return (
    <motion.li
      layout
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ borderWidth, borderColor, boxShadow: glow }}
      className={`overflow-hidden rounded-card border bg-surface ${justAdded ? 'motion-safe:animate-amx-flash' : ''}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={selected}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-[15px] font-bold text-text">{guess.nom}</span>
            {analyzed && <SearchIcon size={12} className="flex-none text-brand-mid" />}
            {analyzable && (
              <SearchIcon size={12} className="flex-none text-brand-mid motion-safe:animate-amx-pulse" />
            )}
          </span>
          <span className="mb-1 flex items-center gap-1 truncate text-[12px] text-muted">
            <span className="truncate">{guess.anime}</span>
            {analyzable && <span className="flex-none font-bold text-brand-mid">· Cliquer pour analyser</span>}
          </span>
          <span className="block h-1.5 overflow-hidden rounded-full bg-bg">
            <motion.span
              className="block h-full rounded-full"
              style={{ background: t.color }}
              initial={{ width: 0 }}
              animate={{ width: `${guess.score}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </span>
        </span>
        <span className="flex flex-none flex-col items-end gap-0.5" style={{ minWidth: 92 }}>
          <span className="font-display text-[19px] font-bold" style={{ color: t.color }}>
            {guess.score} %
          </span>
          <span
            className="flex items-center gap-1 whitespace-nowrap rounded-pill px-2 py-0.5 text-[11px] font-bold"
            style={{ background: t.bg, color: badgeFg }}
          >
            <TemperatureBandIcon icon={t.icon} size={11} />
            {t.label}
          </span>
        </span>
      </button>
      <AnimatePresence initial={false}>{selected && <AttemptDetail guess={guess} />}</AnimatePresence>
    </motion.li>
  );
}
