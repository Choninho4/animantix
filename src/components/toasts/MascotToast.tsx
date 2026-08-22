interface MascotToastProps {
  visible: boolean;
}

// Notification "jeton débloqué", distincte du toast de succès (Toast.tsx,
// non modifié) : la mascotte du site bondit depuis le bord bas de l'écran
// avec une bulle de dialogue, plutôt que le badge neutre réutilisé pour les
// succès. Reste montée en permanence — visible bascule une transition CSS
// sur `bottom` plutôt que sur `transform` : un élément `position: fixed;
// bottom: 0` dont on anime le `transform` restait bloqué à sa position
// initiale dans cet environnement (confirmé en isolant le cas — le même
// élément en `top` fixe répond normalement à un `transform` dynamique).
// Animer `bottom` directement (une propriété de mise en page, pas juste un
// compositing layer) contourne ce blocage de façon fiable.
export function MascotToast({ visible }: MascotToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      style={{ bottom: visible ? 0 : -220, opacity: visible ? 1 : 0 }}
      className="pointer-events-none fixed inset-x-0 z-[150] flex items-end justify-start gap-2 transition-opacity duration-500 ease-out motion-safe:transition-[bottom,opacity] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    >
      <img
        src="/assets/mascotte/mascotte-inku.png"
        alt=""
        aria-hidden="true"
        className="h-24 w-24 flex-none translate-y-[30%] object-contain sm:h-28 sm:w-28"
      />
      <div className="relative mb-10 max-w-[210px] border-[3px] border-ink bg-surface px-3.5 py-2.5 shadow-[5px_5px_0_rgb(var(--color-brand-mid))] sm:mb-12">
        <span className="absolute -left-[9px] bottom-3.5 h-0 w-0 border-y-[8px] border-y-transparent border-r-[9px] border-r-ink" />
        <span className="absolute -left-[5px] bottom-[15px] h-0 w-0 border-y-[6px] border-y-transparent border-r-[7px] border-r-surface" />
        <span className="block font-mono text-[10px] font-bold uppercase tracking-[.08em] text-brand">
          Jeton d'analyse
        </span>
        <span className="block font-display text-[14px] font-bold leading-tight text-text">
          Nouveau jeton débloqué, à toi de jouer !
        </span>
      </div>
    </div>
  );
}
