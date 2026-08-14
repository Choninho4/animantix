import type { Achievement } from '../../types/achievement';
import { ACHIEVEMENT_ICONS } from '../../lib/achievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  selected: boolean;
  onClick: () => void;
}

export function AchievementBadge({ achievement, unlocked, selected, onClick }: AchievementBadgeProps) {
  const Icon = ACHIEVEMENT_ICONS[achievement.id];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={selected}
      className={`flex flex-col items-center gap-1.5 rounded-card border bg-bg p-2.5 text-center transition-colors ${
        selected ? 'border-brand-mid' : 'border-border hover:border-brand-mid/50'
      }`}
    >
      <span
        className={`flex h-10 w-10 flex-none items-center justify-center rounded-control ${
          unlocked ? 'bg-brand/10 text-brand' : 'bg-border text-muted'
        }`}
      >
        <Icon size={19} />
      </span>
      <span className={`text-[10.5px] font-semibold leading-tight ${unlocked ? 'text-text' : 'text-muted'}`}>
        {achievement.nom}
      </span>
    </button>
  );
}
