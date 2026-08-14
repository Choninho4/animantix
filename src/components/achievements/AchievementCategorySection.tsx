import { AnimatePresence } from 'framer-motion';
import type { Achievement, AchievementCategory } from '../../types/achievement';
import { CATEGORY_LABELS } from '../../lib/achievements';
import { AchievementBadge } from './AchievementBadge';
import { AchievementDetail } from './AchievementDetail';

interface AchievementCategorySectionProps {
  category: AchievementCategory;
  achievements: Achievement[];
  unlockedSet: Set<string>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function AchievementCategorySection({
  category,
  achievements,
  unlockedSet,
  selectedId,
  onSelect,
}: AchievementCategorySectionProps) {
  const unlockedCount = achievements.filter((a) => unlockedSet.has(a.id)).length;
  const selected = achievements.find((a) => a.id === selectedId);

  return (
    <section className="mb-6 border-b border-border pb-6 last:mb-0 last:border-b-0 last:pb-0">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-display text-[15px] font-bold text-brand-dark">{CATEGORY_LABELS[category]}</h3>
        <span className="text-[12px] text-muted">
          {unlockedCount}/{achievements.length} débloqués
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {achievements.map((a) => (
          <AchievementBadge
            key={a.id}
            achievement={a}
            unlocked={unlockedSet.has(a.id)}
            selected={a.id === selectedId}
            onClick={() => onSelect(a.id)}
          />
        ))}
      </div>
      <AnimatePresence>
        {selected && <AchievementDetail key={selected.id} achievement={selected} unlocked={unlockedSet.has(selected.id)} />}
      </AnimatePresence>
    </section>
  );
}
