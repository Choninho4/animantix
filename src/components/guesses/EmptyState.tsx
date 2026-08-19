import { useGameStore } from '../../store/useGameStore';

export function EmptyState() {
  const openModal = useGameStore((s) => s.openModal);

  return (
    <section className="flex flex-wrap items-center gap-6 border-[3px] border-dashed border-border px-6 py-8">
      <img
        src="/assets/mascot-inku.png"
        alt=""
        className="h-[92px] w-auto flex-none motion-safe:animate-amx-pulse"
      />
      <div className="min-w-[220px] flex-1">
        <h3 className="mb-2 font-display text-[20px] font-bold text-brand-mid">
          Un personnage mystère par jour
        </h3>
        <p className="mb-3.5 max-w-[440px] text-[14px] leading-[1.55] text-muted">
          Propose n'importe quel personnage d'anime. Le score en % te dit à quel point il
          ressemble au personnage du jour : même œuvre, rôle, camp, race, pouvoirs… Essais
          illimités.
        </p>
        <button
          type="button"
          onClick={() => openModal('rules')}
          className="min-h-touch border-2 border-ink bg-bg px-5 py-2.5 font-display text-[14px] font-bold text-brand-dark shadow-[3px_3px_0_#0B0B16] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
        >
          Comment ça marche ?
        </button>
      </div>
    </section>
  );
}
