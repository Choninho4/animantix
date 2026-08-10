import { currentTarget, useGameStore } from '../../store/useGameStore';
import { buildHintDefinitions, guessesUntilNextHint, unlockedHintCount } from '../../lib/hints';
import { MAX_HINTS } from '../../lib/constants';
import { HintItem } from './HintItem';

export function HintsPanel() {
  const guesses = useGameStore((s) => s.guesses);
  const won = useGameStore((s) => s.won);
  const hintsRevealed = useGameStore((s) => s.hintsRevealed);
  const revealHint = useGameStore((s) => s.revealHint);

  const nb = guesses.length;
  if (nb === 0 || won) return null;

  const target = currentTarget();
  const definitions = buildHintDefinitions(target);
  const unlocked = unlockedHintCount(nb);
  const revealed = definitions.slice(0, hintsRevealed);
  const canReveal = hintsRevealed < unlocked;
  const restants = guessesUntilNextHint(hintsRevealed, nb);

  const status = canReveal
    ? `${unlocked - hintsRevealed} indice(s) disponible(s)`
    : hintsRevealed >= MAX_HINTS
      ? 'Tous les indices sont révélés'
      : `Prochain indice dans ${restants} essai(s)`;

  return (
    <section className="mb-4 rounded-card border border-border bg-surface px-4 py-3.5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-display text-[15px] font-bold text-brand-dark">Indices</span>
        <span className="text-[12px] text-muted">{status}</span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={revealHint}
          disabled={!canReveal}
          className={`min-h-10 rounded-control border-2 px-4 py-2 text-[13px] font-bold ${
            canReveal ? 'cursor-pointer border-brand-mid text-brand-mid' : 'cursor-not-allowed border-border text-muted'
          }`}
        >
          Révéler un indice
        </button>
      </div>
      {revealed.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {revealed.map((h, i) => (
            <HintItem key={i} n={i + 1} label={h.label} value={h.value} />
          ))}
        </ul>
      )}
    </section>
  );
}
