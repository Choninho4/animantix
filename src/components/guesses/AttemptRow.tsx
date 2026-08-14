import { motion } from 'framer-motion';
import type { GuessEntry } from '../../types/guess';
import { CRITERIA_ORDER } from '../../lib/comparison';
import { useTheme } from '../../hooks/useTheme';

interface AttemptRowProps {
  guess: GuessEntry;
  justAdded: boolean;
}

const CORRECT_BG = 'rgba(34,197,94,.16)';
const CORRECT_FG = '#16A34A';
const CORRECT_FG_DARK = '#4ADE80';
const INCORRECT_BG = 'rgba(225,29,72,.12)';
const INCORRECT_FG = '#BE123C';
const INCORRECT_FG_DARK = '#FB7185';

const GRID_COLS = 'grid-cols-[minmax(132px,1.3fr)_repeat(8,minmax(80px,1fr))]';

export function AttemptRow({ guess, justAdded }: AttemptRowProps) {
  const { theme } = useTheme();

  return (
    <motion.li
      layout
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`grid ${GRID_COLS} items-stretch gap-1.5 ${justAdded ? 'motion-safe:animate-amx-flash' : ''}`}
    >
      <div className="flex flex-col justify-center rounded-control border border-border bg-surface px-3 py-2">
        <span className="block truncate text-[14px] font-bold text-text">{guess.nom}</span>
        <span className="block truncate text-[11px] text-muted">{guess.correctCount}/8 corrects</span>
      </div>
      {CRITERIA_ORDER.map(({ key }) => {
        const result = guess.results.find((r) => r.critere === key)!;
        const correct = result.status === 'correct';
        const fg = correct ? (theme === 'dark' ? CORRECT_FG_DARK : CORRECT_FG) : theme === 'dark' ? INCORRECT_FG_DARK : INCORRECT_FG;
        return (
          <div
            key={key}
            className="flex flex-col items-center justify-center gap-0.5 rounded-control px-1 py-2 text-center"
            style={{ background: correct ? CORRECT_BG : INCORRECT_BG, color: fg }}
          >
            <span className="text-[11.5px] font-bold leading-tight">{result.valeurAffichee}</span>
            {result.direction && (
              <span className="text-[13px] font-bold leading-none">{result.direction === 'haut' ? '↑' : '↓'}</span>
            )}
          </div>
        );
      })}
    </motion.li>
  );
}
