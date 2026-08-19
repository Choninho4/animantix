import { motion } from 'framer-motion';
import type { Achievement } from '../../types/achievement';
import { ACHIEVEMENT_ICONS } from '../../lib/achievements';

interface AchievementToastProps {
  achievement: Achievement;
}

export function AchievementToast({ achievement }: AchievementToastProps) {
  const Icon = ACHIEVEMENT_ICONS[achievement.id];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      role="status"
      className="pointer-events-auto flex items-center gap-3 border-[3px] border-ink bg-surface px-4 py-3 shadow-dropdown"
      style={{ maxWidth: 340 }}
    >
      <span className="flex h-10 w-10 flex-none items-center justify-center border-2 border-ink bg-brand text-white">
        <Icon size={20} />
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[11px] font-bold uppercase tracking-[.08em] text-brand">Succès débloqué</span>
        <span className="block truncate font-display text-[15px] font-bold text-text">{achievement.nom}</span>
      </span>
    </motion.div>
  );
}
