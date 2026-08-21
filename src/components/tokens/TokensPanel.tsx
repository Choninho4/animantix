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

  // Tant qu'un jeton non dépensé est disponible, le panneau passe en état
  // "fort" (fond plein + ombre qui pulse) pour inciter à l'utiliser — sinon
  // état neutre identique aux autres panneaux. La pulsation de l'ombre est
  // un utilitaire motion-safe : elle se désactive automatiquement si
  // prefers-reduced-motion est actif, ne laissant que le fond plein statique.
  const titleColorClass = hasTokens ? 'text-white dark:text-ink' : 'text-brand-dark';
  const secondaryColorClass = hasTokens ? 'text-white dark:text-ink/75' : 'text-muted';

  return (
    <section
      className={`border-[3px] border-ink px-4 py-3.5 transition-colors sm:min-w-0 sm:flex-1 ${
        hasTokens ? 'bg-brand motion-safe:animate-amx-shadow-pulse' : 'bg-surface'
      }`}
      style={{ boxShadow: hasTokens ? '7px 7px 0 #0B0B16' : '7px 7px 0 rgb(var(--color-shadow-accent))' }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className={`flex items-center gap-1.5 font-display text-[15px] font-bold ${titleColorClass}`}>
          <SearchIcon size={16} className={hasTokens ? 'motion-safe:animate-amx-pulse' : undefined} />
          Jeton d'analyse : {cycleProgress}/{TOKENS_TOUS_LES} essais
        </span>
        {hasTokens && (
          <span className={`font-mono text-[12px] ${secondaryColorClass}`}>
            Clique sur un essai ci-dessous pour l'utiliser
          </span>
        )}
      </div>
      <span className={`mt-1 block font-mono text-[12px] ${secondaryColorClass}`}>
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
