import { currentTarget, useGameStore } from '../../store/useGameStore';
import { formatCountdown, formatElapsed, msUntilNextMidnight } from '../../lib/format';
import { StatTile } from './StatTile';
import { Confetti } from './Confetti';

export function VictorySection() {
  const won = useGameStore((s) => s.won);
  const guesses = useGameStore((s) => s.guesses);
  const elapsed = useGameStore((s) => s.elapsed);
  const streak = useGameStore((s) => s.stats.currentStreak);
  const share = useGameStore((s) => s.share);
  const shareCopied = useGameStore((s) => s.shareCopied);
  const openModal = useGameStore((s) => s.openModal);
  const now = useGameStore((s) => s.now);

  if (!won) return null;

  const target = currentTarget();
  const countdown = formatCountdown(msUntilNextMidnight(new Date(now)));

  return (
    <section className="relative mt-5 overflow-hidden rounded-card border border-border bg-surface p-6 motion-safe:animate-amx-pop">
      <div className="relative flex flex-wrap items-start gap-5">
        <div className="min-w-[240px] flex-1">
          <div className="mb-1.5 text-[12px] font-bold uppercase tracking-[.10em] text-brand">Trouvé !</div>
          <h2 className="mb-1 font-display text-[32px] font-bold leading-[1.15] text-brand-dark">
            {target.nom}
          </h2>
          <div className="mb-2.5 text-[14px] text-muted">
            {target.animeSource} · {target.anneeSortieAnime}
          </div>
          <p className="mb-4 max-w-[460px] text-[15px] leading-[1.6] text-text">{target.descriptionCourte}</p>
          <div className="mb-8 flex flex-wrap gap-2.5">
            <StatTile value={String(guesses.length)} label="essais" />
            <StatTile value={formatElapsed(elapsed)} label="temps de jeu" />
            <StatTile value={`🔥 ${streak}`} label="série en cours" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={share}
              className="min-h-touch rounded-control bg-brand px-8 py-4 font-display text-[15px] font-bold text-white active:scale-[.98]"
            >
              {shareCopied ? 'Copié !' : 'Partager mon résultat'}
            </button>
            <button
              type="button"
              onClick={() => openModal('stats')}
              className="min-h-touch rounded-control border-2 border-brand px-8 py-4 font-display text-[15px] font-bold text-brand"
            >
              Mes statistiques
            </button>
            <div className="text-[13px] text-muted">
              Prochain personnage dans <strong className="text-brand-dark">{countdown}</strong>
            </div>
          </div>
        </div>
      </div>
      <Confetti />
    </section>
  );
}
