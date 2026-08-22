interface MascotToastProps {
  visible: boolean;
}

// Notification "jeton débloqué", distincte du toast de succès (Toast.tsx,
// non modifié) : la mascotte du site descend depuis le haut de l'écran avec
// une bulle de dialogue, plutôt que le badge neutre réutilisé pour les
// succès. Ancrée en haut à droite, sous le header — même zone/marges que le
// toast de succès (top-[76px], sm:right-4) — donc mascotte et bulle
// descendent entièrement en vue plutôt que de "peeker" depuis un bord
// d'écran (il n'y a plus de bord à peeker : l'ancrage est sous le header,
// pas au ras du viewport). Reste montée en permanence — visible bascule une
// transition CSS sur `top` (et non `transform`, qui restait bloqué à sa
// position initiale dans cet environnement pour un `position: fixed`
// animé de cette façon).
export function MascotToast({ visible }: MascotToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      style={{ top: visible ? 76 : -220, opacity: visible ? 1 : 0 }}
      className="pointer-events-none fixed inset-x-0 z-[150] flex items-start justify-center gap-2 px-4 transition-opacity duration-500 ease-out motion-safe:transition-[top,opacity] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)] sm:inset-x-auto sm:right-4 sm:justify-end"
    >
      <div className="relative mt-2 max-w-[210px] border-[3px] border-ink bg-surface px-3.5 py-2.5 shadow-[5px_5px_0_rgb(var(--color-brand-mid))]">
        <span className="absolute -right-[9px] bottom-3.5 h-0 w-0 border-y-[8px] border-y-transparent border-l-[9px] border-l-ink" />
        <span className="absolute -right-[5px] bottom-[15px] h-0 w-0 border-y-[6px] border-y-transparent border-l-[7px] border-l-surface" />
        <span className="block font-mono text-[10px] font-bold uppercase tracking-[.08em] text-brand">
          Jeton d'analyse
        </span>
        <span className="block font-display text-[14px] font-bold leading-tight text-text">
          Nouveau jeton débloqué, à toi de jouer !
        </span>
      </div>
      <img
        src="/assets/mascotte/mascotte-inku.png"
        alt=""
        aria-hidden="true"
        className="h-24 w-24 flex-none object-contain sm:h-28 sm:w-28"
      />
    </div>
  );
}
