import { motion } from 'framer-motion';
import type { GuessEntry } from '../../types/guess';
import type { CriterionStatus } from '../../lib/scoring';
import { temperatureForScore } from '../../lib/temperature';
import { useTheme } from '../../hooks/useTheme';

interface AttemptDetailProps {
  guess: GuessEntry;
}

const STATUS_STYLE: Record<CriterionStatus, { bg: string; fg: string; fgDark: string }> = {
  exact: { bg: 'rgba(34,197,94,.16)', fg: '#16A34A', fgDark: '#4ADE80' },
  partial: { bg: 'rgba(234,179,8,.18)', fg: '#A16207', fgDark: '#FACC15' },
  none: { bg: 'rgba(225,29,72,.12)', fg: '#BE123C', fgDark: '#FB7185' },
};

export function AttemptDetail({ guess }: AttemptDetailProps) {
  const { theme } = useTheme();
  const totalColor = temperatureForScore(guess.score).color;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ overflow: 'hidden' }}
    >
      <div className="border-t border-border px-3 py-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {guess.details.map((d) => {
            const style = STATUS_STYLE[d.status];
            const fg = theme === 'dark' ? style.fgDark : style.fg;
            return (
              <div key={d.key} className="rounded-control p-2.5 text-center" style={{ background: style.bg }}>
                <div className="text-[10px] font-bold uppercase leading-tight tracking-wide" style={{ color: fg }}>
                  {d.label}
                </div>
                <div className="mt-1.5 text-[13px] font-bold leading-tight text-text">
                  {d.valeurAffichee}
                  {d.direction && (
                    <span className="ml-1" style={{ color: fg }}>
                      {d.direction === 'haut' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[12px] font-bold" style={{ color: fg }}>
                  +{d.points} %
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[13px] font-semibold text-muted">
          Total : <span className="font-bold" style={{ color: totalColor }}>{guess.score} %</span>
        </p>
      </div>
    </motion.div>
  );
}
