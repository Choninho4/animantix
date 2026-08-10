import { useGameStore } from '../../store/useGameStore';

export function EmptyState() {
  const openModal = useGameStore((s) => s.openModal);

  return (
    <section className="rounded-card border border-border bg-surface px-6 py-8">
      <div className="flex flex-wrap items-center gap-6">
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
            ressemble au personnage du jour : même œuvre, rôle, camp moral, âge, pouvoirs… Essais
            illimités.
          </p>
          <button
            type="button"
            onClick={() => openModal('rules')}
            className="min-h-touch rounded-control bg-bg px-5 py-2.5 font-display text-[14px] font-bold text-brand-dark"
          >
            Comment ça marche ?
          </button>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
        <span className="rounded-pill bg-brand-mid/10 px-2.5 py-1 text-[11px] font-bold text-brand-mid">
          Bientôt
        </span>
        <span className="text-[12px] text-muted">Une autre variante de ce jeu arrive prochainement.</span>
      </div>
    </section>
  );
}
