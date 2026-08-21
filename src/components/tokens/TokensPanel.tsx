import { useGameStore } from '../../store/useGameStore';
import { guessesUntilNextToken, tokenCycleProgress, tokensAvailable } from '../../lib/analysisTokens';
import { TOKENS_TOUS_LES } from '../../lib/constants';
import { SearchIcon } from '../icons/Icon';

export function TokensPanel() {
  const guesses = useGameStore((s) => s.guesses);
  const analyzedIds = useGameStore((s) => s.analyzedIds);
  const won = useGameStore((s) => s.won);

  const nb = guesses.length;
  if (nb === 0 || won) return null;

  const available = tokensAvailable(nb, analyzedIds.length);
  const remaining = guessesUntilNextToken(nb);
  const hasTokens = available > 0;
  const percent = (tokenCycleProgress(nb) / TOKENS_TOUS_LES) * 100;

  return (
    <section className="border-[3px] border-ink bg-surface px-4 py-3.5 shadow-[7px_7px_0_rgb(var(--color-shadow-accent))] sm:min-w-0 sm:flex-1">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 font-display text-[15px] font-bold text-brand-dark">
          <SearchIcon size={16} className={hasTokens ? 'motion-safe:animate-amx-pulse' : undefined} />
          {available} jeton{available > 1 ? 's' : ''} d'analyse{hasTokens ? ` disponible${available > 1 ? 's' : ''}` : ''}
        </span>
        <span className="font-mono text-[12px] text-muted">
          {hasTokens ? "Clique sur un essai ci-dessous pour l'utiliser" : `Prochain jeton dans ${remaining} essai${remaining > 1 ? 's' : ''}`}
        </span>
      </div>
      <span className="mt-2 block h-1.5 overflow-hidden border border-ink bg-bg shadow-[2px_2px_0_#0B0B16]">
        <span
          className="block h-full bg-brand-mid transition-[width] duration-[400ms] ease-out"
          style={{ width: `${percent}%` }}
        />
      </span>
    </section>
  );
}
