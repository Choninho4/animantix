import { useMemo, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { ACHIEVEMENTS, CATEGORY_ORDER, achievementsByCategory } from '../../lib/achievements';
import { ModalHeader, ModalShell } from '../modals/ModalShell';
import { AchievementCategorySection } from './AchievementCategorySection';

export function AchievementsModal() {
  const closeModals = useGameStore((s) => s.closeModals);
  const unlockedIds = useGameStore((s) => s.stats.unlockedAchievements);
  const unlockedSet = useMemo(() => new Set(unlockedIds), [unlockedIds]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function toggle(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <ModalShell label="Succès" onClose={closeModals} maxWidth={560}>
      <ModalHeader title="Succès" onClose={closeModals} />
      <p className="mb-5 text-[13px] text-muted">
        {unlockedIds.length} / {ACHIEVEMENTS.length} débloqués au total
      </p>
      {CATEGORY_ORDER.map((category) => (
        <AchievementCategorySection
          key={category}
          category={category}
          achievements={achievementsByCategory(category)}
          unlockedSet={unlockedSet}
          selectedId={selectedId}
          onSelect={toggle}
        />
      ))}
    </ModalShell>
  );
}
