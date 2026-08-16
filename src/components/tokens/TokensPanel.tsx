import { useGameStore } from '../../store/useGameStore';
import { guessesUntilNextToken, tokensAvailable } from '../../lib/analysisTokens';
import { SearchIcon } from '../icons/Icon';

export function TokensPanel() {
  const guesses = useGameStore((s) => s.guesses);
  const analyzedIds = useGameStore((s) => s.analyzedIds);
  const won = useGameStore((s) => s.won);

  const nb = guesses.length;
  if (nb === 0 || won) return null;

  const available = tokensAvailable(nb, analyzedIds.length);
  const remaining = guessesUntilNextToken(nb);

  return (
    <section className="mb-4 flex flex-wrap items-center gap-3 rounded-card border border-border bg-surface px-4 py-3.5">
      <span className="flex items-center gap-1.5 font-display text-[15px] font-bold text-brand-dark">
        <SearchIcon size={16} />
        {available} jeton{available > 1 ? 's' : ''} d'analyse
      </span>
      <span className="text-[12px] text-muted">Prochain jeton dans {remaining} essai{remaining > 1 ? 's' : ''}</span>
    </section>
  );
}
