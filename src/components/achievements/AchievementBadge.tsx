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
      className={`flex flex-col items-center gap-1.5 border-2 p-2.5 text-center transition-colors ${
        unlocked ? 'border-ink bg-brand shadow-[3px_3px_0_#0B0B16]' : 'border-border bg-bg opacity-70'
      } ${selected ? 'translate-x-[2px] translate-y-[2px] shadow-none' : ''}`}
    >
      <Icon size={22} className={unlocked ? 'text-white' : 'text-muted'} />
      <span className={`text-[10.5px] font-semibold leading-tight ${unlocked ? 'text-white' : 'text-muted'}`}>
        {achievement.nom}
      </span>
    </button>
  );
}
