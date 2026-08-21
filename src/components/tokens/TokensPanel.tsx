import { useGameStore } from '../../store/useGameStore';
import { tokenCycleProgress, tokensAvailable } from '../../lib/analysisTokens';
import { TOKENS_TOUS_LES } from '../../lib/constants';
import { SearchIcon } from '../icons/Icon';

export function TokensPanel() {
  const guesses = useGameStore((s) => s.guesses);
  const analyzedIds = useGameStore((s) => s.analyzedIds);
  const won = useGameStore((s) => s.won);

  const nb = guesses.length;
  if (nb === 0 || won) return null;

  const available = tokensAvailable(nb, analyzedIds.length);
  const hasTokens = available > 0;
  const cycleProgress = tokenCycleProgress(nb);
  const percent = (cycleProgress / TOKENS_TOUS_LES) * 100;

  return (
    <section className="border-[3px] border-ink bg-surface px-4 py-3.5 shadow-[7px_7px_0_rgb(var(--color-shadow-accent))] sm:min-w-0 sm:flex-1">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 font-display text-[15px] font-bold text-brand-dark">
            <SearchIcon size={16} className={hasTokens ? 'motion-safe:animate-amx-pulse' : undefined} />
            Jeton d'analyse : {cycleProgress}/{TOKENS_TOUS_LES} essais
          </span>
          {hasTokens && (
            <span className="font-mono text-[12px] text-muted">Clique sur un essai ci-dessous pour l'utiliser</span>
          )}
        </div>
        {/* Compteur de jetons non dépensés, indépendant du cycle affiché à
            gauche : permet de voir d'un coup d'œil sa réserve accumulée. */}
        <span
          className="flex h-8 w-8 flex-none items-center justify-center border-2 border-ink bg-ink font-display text-[15px] font-bold text-white shadow-[2px_2px_0_rgb(var(--color-shadow-accent))]"
          aria-label={`${available} jeton${available > 1 ? 's' : ''} disponible${available > 1 ? 's' : ''}`}
        >
          {available}
        </span>
      </div>
      <span className="mt-1 block font-mono text-[12px] text-muted">
        Un jeton te permet d'analyser en détail un personnage que tu as déjà proposé.
      </span>
      <span className="mt-2 block h-1.5 overflow-hidden border border-ink bg-bg shadow-[2px_2px_0_#0B0B16]">
        <span
          className="block h-full bg-brand-mid transition-[width] duration-[400ms] ease-out"
          style={{ width: `${percent}%` }}
        />
      </span>
    </section>
  );
}
