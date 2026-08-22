import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { tokensAvailable } from '../../lib/analysisTokens';
import { AttemptRow } from './AttemptRow';

export function AttemptsTable() {
  const guesses = useGameStore((s) => s.guesses);
  const won = useGameStore((s) => s.won);
  const flashId = useGameStore((s) => s.flashId);
  const analyzedIds = useGameStore((s) => s.analyzedIds);
  const requestAnalysis = useGameStore((s) => s.requestAnalysis);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (guesses.length === 0) return null;

  const best = Math.max(...guesses.map((g) => g.score));
  const sorted = [...guesses].sort((a, b) => b.score - a.score || b.n - a.n);
  const hasTokens = tokensAvailable(guesses.length, analyzedIds.length) > 0;

  function handleClick(id: string) {
    // Partie gagnée : plus besoin de jeton, le détail de tous les essais
    // (même jamais analysés pendant la partie) devient librement consultable.
    if (won || analyzedIds.includes(id)) {
      setSelectedId((prev) => (prev === id ? null : id));
      return;
    }
    if (requestAnalysis(id)) setSelectedId(id);
  }

  return (
    <>
      <motion.ul layout="position" className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {sorted.map((g) => (
            <AttemptRow
              key={g.id}
              guess={g}
              isBest={g.score === best}
              justAdded={g.id === flashId}
              selected={g.id === selectedId}
              analyzed={won || analyzedIds.includes(g.id)}
              analyzable={!won && hasTokens && !analyzedIds.includes(g.id)}
              onToggle={() => handleClick(g.id)}
            />
          ))}
        </AnimatePresence>
      </motion.ul>
      <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-wide text-muted">
        {guesses.length} essai{guesses.length > 1 ? 's' : ''} · trié du plus chaud au plus froid
      </p>
    </>
  );
}
