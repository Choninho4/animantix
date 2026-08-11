import { FlameIcon } from '../icons/Icon';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <div
      title="Série de victoires"
      className="flex h-9 items-center gap-1.5 rounded-pill bg-bg px-3 font-bold text-[13px] text-brand-dark"
    >
      <FlameIcon size={14} />
      {streak}
    </div>
  );
}
