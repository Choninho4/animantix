import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getAchievement, ACHIEVEMENT_ICONS } from '../../lib/achievements';
import { Toast } from './Toast';
import { MascotToast } from './MascotToast';

const DISPLAY_MS = 3800;

// Monté une seule fois dans AppLayout : lit la file globale de toasts
// (succès débloqués, jetons d'analyse gagnés...) et n'en affiche qu'un à la
// fois, en séquence (jamais superposés), chacun se retirant après un délai
// avant de laisser passer le suivant.
export function ToastQueue() {
  const queue = useGameStore((s) => s.toastQueue);
  const dismiss = useGameStore((s) => s.dismissToast);
  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(dismiss, DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [current, dismiss]);

  const achievement = current?.kind === 'achievement' ? getAchievement(current.achievementId) : undefined;
  const AchievementIcon = achievement ? ACHIEVEMENT_ICONS[achievement.id] : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-[76px] z-[150] flex justify-center px-4 sm:inset-x-auto sm:right-4 sm:justify-end"
      >
        <AnimatePresence>
          {achievement && AchievementIcon && (
            <Toast key={`achievement-${achievement.id}`} icon={<AchievementIcon size={20} />} eyebrow="Succès débloqué" title={achievement.nom} />
          )}
        </AnimatePresence>
      </div>
      {/* Jeton débloqué : mascotte ancrée dans la même zone haut-droite que
          le toast de succès ci-dessus (contenu et animation d'entrée
          propres à MascotToast). Reste montée en permanence — sa propre
          transition CSS gère l'entrée et la sortie (voir le composant pour
          le détail). Mutuellement exclusifs (dérivés du même `current`),
          jamais visibles en même temps. */}
      <MascotToast visible={current?.kind === 'token'} />
    </MotionConfig>
  );
}
