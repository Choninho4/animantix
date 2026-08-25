import { useGameStore } from '../../store/useGameStore';

// Même pattern "bulle de dialogue" que MascotToast.tsx (bordure/fond/ombre de
// la bulle, queue en deux triangles CSS superposés) : la mascotte semble
// parler au joueur plutôt que d'illustrer une carte encadrée.
// Desktop (sm+) : mascotte à gauche, bulle à droite, queue sur le bord gauche
// pointant vers la mascotte. Mobile : empilé (mascotte centrée au-dessus,
// bulle pleine largeur en dessous), queue déplacée sur le bord haut de la
// bulle — deux paires de triangles distinctes (une par orientation), chacune
// visible sur un seul des deux breakpoints.
export function EmptyState() {
  const openModal = useGameStore((s) => s.openModal);

  return (
    <section className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
      <img
        src="/assets/mascotte/mascotte-inku.png"
        alt=""
        className="h-[100px] w-auto flex-none motion-safe:animate-amx-pulse sm:h-[120px]"
      />
      <div className="relative w-full rounded-[28px] border-[3px] border-ink bg-surface px-6 py-5 shadow-[6px_6px_0_rgb(var(--color-shadow-accent))] sm:min-w-[220px] sm:w-auto sm:flex-1">
        {/* Queue mobile : bord haut, pointe vers la mascotte au-dessus. */}
        <span className="absolute -top-[9px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-[8px] border-b-[9px] border-x-transparent border-b-ink sm:hidden" />
        <span className="absolute -top-[5px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-b-[7px] border-x-transparent border-b-surface sm:hidden" />
        {/* Queue desktop : bord gauche, pointe vers la mascotte à côté. */}
        <span className="absolute -left-[9px] top-1/2 hidden h-0 w-0 -translate-y-1/2 border-y-[8px] border-r-[9px] border-y-transparent border-r-ink sm:block" />
        <span className="absolute -left-[5px] top-1/2 hidden h-0 w-0 -translate-y-1/2 border-y-[6px] border-r-[7px] border-y-transparent border-r-surface sm:block" />
        <h3 className="mb-2 font-display text-[20px] font-bold text-brand-mid">
          Un personnage mystère par jour
        </h3>
        <p className="mb-4 max-w-[440px] text-[14px] leading-[1.55] text-muted">
          Propose n'importe quel personnage d'anime. Le score en % te dit à quel point il
          ressemble au personnage du jour : même œuvre, rôle, camp, race, pouvoirs… Essais
          illimités.
        </p>
        <button
          type="button"
          onClick={() => openModal('rules')}
          className="min-h-touch rounded-full border-2 border-ink bg-brand-dark px-6 py-2.5 font-display text-[14px] font-bold text-ink shadow-[3px_3px_0_#0B0B16] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#0B0B16] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
        >
          Comment ça marche ? →
        </button>
      </div>
    </section>
  );
}
