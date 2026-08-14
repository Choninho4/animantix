import { motion } from 'framer-motion';
import type { Achievement } from '../../types/achievement';
import { ACHIEVEMENT_ICONS } from '../../lib/achievements';
import { CheckIcon } from '../icons/Icon';

interface AchievementDetailProps {
  achievement: Achievement;
  unlocked: boolean;
}

export function AchievementDetail({ achievement, unlocked }: AchievementDetailProps) {
  const Icon = ACHIEVEMENT_ICONS[achievement.id];
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ overflow: 'hidden' }}
    >
      <div className="mt-3 flex items-start gap-3 rounded-card border border-border bg-surface p-4">
        <span
          className={`flex h-11 w-11 flex-none items-center justify-center rounded-control ${
            unlocked ? 'bg-brand/10 text-brand' : 'bg-border text-muted'
          }`}
        >
          <Icon size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h4 className="font-display text-[15px] font-bold text-text">{achievement.nom}</h4>
            <span
              className={`flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-[11px] font-bold ${
                unlocked ? 'bg-brand/10 text-brand' : 'bg-border text-muted'
              }`}
            >
              {unlocked && <CheckIcon size={11} />}
              {unlocked ? 'Débloqué' : 'Verrouillé'}
            </span>
          </div>
          <p className="text-[13px] leading-[1.5] text-muted">{achievement.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
