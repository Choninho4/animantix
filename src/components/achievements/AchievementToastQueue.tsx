import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getAchievement } from '../../lib/achievements';
import { AchievementToast } from './AchievementToast';

const DISPLAY_MS = 3800;

// Monté une seule fois dans AppLayout : lit la file globale de succès
// débloqués et n'en affiche qu'un à la fois, en séquence (jamais superposés),
// chacun se retirant après un délai avant de laisser passer le suivant.
export function AchievementToastQueue() {
  const queue = useGameStore((s) => s.achievementQueue);
  const dismiss = useGameStore((s) => s.dismissAchievementToast);
  const currentId = queue[0];

  useEffect(() => {
    if (!currentId) return;
    const timer = setTimeout(dismiss, DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [currentId, dismiss]);

  const achievement = currentId ? getAchievement(currentId) : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-[76px] z-[150] flex justify-center px-4 sm:inset-x-auto sm:right-4 sm:justify-end"
      >
        <AnimatePresence>
          {achievement && <AchievementToast key={achievement.id} achievement={achievement} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
