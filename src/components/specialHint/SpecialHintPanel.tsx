import { AnimatePresence, motion } from 'framer-motion';
import { currentTarget, useGameStore } from '../../store/useGameStore';
import { SPECIAL_HINT_THRESHOLD } from '../../lib/constants';
import { isSpecialHintUnlocked, specialHintProgress } from '../../lib/specialHint';
import { TargetIcon } from '../icons/Icon';

export function SpecialHintPanel() {
  const guesses = useGameStore((s) => s.guesses);
  const won = useGameStore((s) => s.won);
  const specialHintRevealed = useGameStore((s) => s.specialHintRevealed);
  const revealSpecialHint = useGameStore((s) => s.revealSpecialHint);

  const nb = guesses.length;
  if (nb === 0 || won) return null;

  const unlocked = isSpecialHintUnlocked(nb);
  const progress = specialHintProgress(nb);
  const percent = (progress / SPECIAL_HINT_THRESHOLD) * 100;

  const shadowColor = specialHintRevealed ? '#4CAF50' : unlocked ? '#FF5FB3' : 'rgb(var(--color-shadow-accent))';
  const sectionClass = specialHintRevealed ? 'bg-brand-mid/5' : unlocked ? 'bg-brand/5' : 'bg-surface';

  return (
    <section
      className={`mb-4 overflow-hidden border-[3px] border-ink px-4 py-3.5 transition-colors ${sectionClass}`}
      style={{ boxShadow: `7px 7px 0 ${shadowColor}` }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {specialHintRevealed ? (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="flex items-center gap-1.5 font-display text-[15px] font-bold text-brand-dark">
              <TargetIcon size={16} />
              Indice spécial révélé
            </span>
            <span className="text-[13px] font-semibold text-text">
              Anime d'origine : <span className="font-bold text-brand">{currentTarget().animeSource}</span>
            </span>
          </motion.div>
        ) : unlocked ? (
          <motion.button
            key="unlocked"
            type="button"
            onClick={revealSpecialHint}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="flex w-full cursor-pointer flex-wrap items-center gap-3 text-left"
          >
            <span className="flex items-center gap-1.5 font-display text-[15px] font-bold text-brand">
              <TargetIcon size={16} className="motion-safe:animate-amx-pulse" />
              Indice débloqué
            </span>
            <span className="text-[12px] font-semibold text-brand-mid">
              Clique pour révéler l'anime d'origine
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            <span className="flex items-center gap-1.5 font-display text-[15px] font-bold text-brand-dark">
              <TargetIcon size={16} />
              Indice spécial : {progress}/{SPECIAL_HINT_THRESHOLD} essais
            </span>
            <span className="mt-2 block h-1.5 overflow-hidden border border-ink bg-bg shadow-[2px_2px_0_#0B0B16]">
              <motion.span
                className="block h-full bg-brand-mid"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
