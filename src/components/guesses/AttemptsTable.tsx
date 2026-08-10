import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { AttemptRow } from './AttemptRow';

export function AttemptsTable() {
  const guesses = useGameStore((s) => s.guesses);
  const flashId = useGameStore((s) => s.flashId);

  if (guesses.length === 0) return null;

  const best = Math.max(...guesses.map((g) => g.score));
  const sorted = [...guesses].sort((a, b) => b.score - a.score || b.n - a.n);

  return (
    <>
      <motion.ul layout className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {sorted.map((g) => (
            <AttemptRow key={g.id} guess={g} isBest={g.score === best} justAdded={g.id === flashId} />
          ))}
        </AnimatePresence>
      </motion.ul>
      <p className="mt-4 text-center text-[12px] text-muted">
        {guesses.length} essai{guesses.length > 1 ? 's' : ''} · trié du plus chaud au plus froid
      </p>
    </>
  );
}
