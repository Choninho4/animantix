import { useTheme } from '../../hooks/useTheme';
import { FlameIcon } from '../icons/Icon';

interface StreakBadgeProps {
  streak: number;
}

// Rouge flamme dès que la série est active, sinon la flamme reste neutre
// (même couleur que le texte du badge).
const FLAME_ACTIVE = '#C1121F';
const FLAME_ACTIVE_DARK = '#FF6B6B';

export function StreakBadge({ streak }: StreakBadgeProps) {
  const { theme } = useTheme();
  const active = streak > 0;
  const flameColor = active ? (theme === 'dark' ? FLAME_ACTIVE_DARK : FLAME_ACTIVE) : undefined;

  return (
    <div
      title="Série de victoires"
      className="flex h-9 items-center gap-1.5 rounded-pill bg-bg px-3 font-bold text-[13px] text-brand-dark"
    >
      <FlameIcon size={14} style={flameColor ? { color: flameColor } : undefined} />
      {streak}
    </div>
  );
}
