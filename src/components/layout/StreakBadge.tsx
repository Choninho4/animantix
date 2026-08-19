import { FlameIcon } from '../icons/Icon';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const active = streak > 0;

  return (
    <div
      title="Série de victoires"
      className="flex h-9 flex-none items-center gap-1.5 border-[3px] border-ink bg-[#FF5FB3] px-2.5 font-display text-[15px] font-bold text-ink shadow-[4px_4px_0_#0B0B16] motion-safe:rotate-2"
    >
      <FlameIcon size={14} className={active ? 'text-danger' : undefined} />
      {streak}
    </div>
  );
}
