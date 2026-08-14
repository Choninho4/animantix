import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { CRITERIA_ORDER } from '../../lib/comparison';
import { AttemptRow } from './AttemptRow';

const GRID_COLS = 'grid-cols-[minmax(132px,1.3fr)_repeat(8,minmax(80px,1fr))]';

export function AttemptsTable() {
  const guesses = useGameStore((s) => s.guesses);
  const flashId = useGameStore((s) => s.flashId);

  if (guesses.length === 0) return null;

  // Plus récent en premier : sans score global, un tri par proximité n'a plus de sens.
  const ordered = [...guesses].reverse();

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className={`mb-1.5 grid ${GRID_COLS} gap-1.5 px-0.5`}>
            <span className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Personnage</span>
            {CRITERIA_ORDER.map((c) => (
              <span key={c.key} className="text-center text-[10.5px] font-bold uppercase tracking-wide text-muted">
                {c.label}
              </span>
            ))}
          </div>
          <motion.ul layout className="flex flex-col gap-1.5">
            <AnimatePresence initial={false}>
              {ordered.map((g) => (
                <AttemptRow key={g.id} guess={g} justAdded={g.id === flashId} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </div>
      <p className="mt-4 text-center text-[12px] text-muted">
        {guesses.length} essai{guesses.length > 1 ? 's' : ''} · du plus récent au plus ancien
      </p>
    </>
  );
}
