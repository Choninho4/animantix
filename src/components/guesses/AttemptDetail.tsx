import { motion } from 'framer-motion';
import type { GuessEntry } from '../../types/guess';
import type { CriterionStatus } from '../../lib/scoring';
import { temperatureForScore } from '../../lib/temperature';

interface AttemptDetailProps {
  guess: GuessEntry;
}

const STATUS_STYLE: Record<CriterionStatus, { bg: string; line: string; text: string }> = {
  exact: { bg: 'rgba(76,175,80,.14)', line: '#4CAF50', text: 'rgb(var(--color-status-exact-text))' },
  partial: { bg: 'rgba(153,102,204,.16)', line: '#9966CC', text: 'rgb(var(--color-status-partial-text))' },
  none: { bg: 'transparent', line: 'rgb(var(--color-border))', text: 'rgb(var(--color-status-none-text))' },
};

export function AttemptDetail({ guess }: AttemptDetailProps) {
  const totalColor = temperatureForScore(guess.score).color;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ overflow: 'hidden' }}
    >
      <div className="border-t-2 border-ink px-3 py-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {guess.details.map((d) => {
            const style = STATUS_STYLE[d.status];
            return (
              <div
                key={d.key}
                className="border-2 p-2.5 text-center"
                style={{ background: style.bg, borderColor: style.line }}
              >
                <div
                  className="font-mono text-[10px] font-bold uppercase leading-tight tracking-wide"
                  style={{ color: style.text }}
                >
                  {d.label}
                </div>
                <div className="mt-1.5 font-display text-[13px] font-bold leading-tight text-text">
                  {d.valeurAffichee}
                  {d.direction && (
                    <span className="ml-1" style={{ color: style.text }}>
                      {d.direction === 'haut' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[12px] font-bold" style={{ color: style.text }}>
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
