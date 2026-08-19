import { Outlet } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { Header } from './Header';
import { RulesModal } from '../modals/RulesModal';
import { StatsModal } from '../modals/StatsModal';
import { ArchiveCalendarModal } from '../modals/ArchiveCalendarModal';
import { AchievementToastQueue } from '../achievements/AchievementToastQueue';
import { AchievementsModal } from '../achievements/AchievementsModal';

// Coquille commune à toutes les pages : navbar identique partout, et les
// modales (règles/stats/archives) déclenchables depuis le header quelle que
// soit la page affichée, puisqu'elles ne dépendent que de l'état global.
// Pas de footer : tous ses liens sont déjà accessibles depuis le Menu.
export function AppLayout() {
  const modals = useGameStore((s) => s.modals);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      {modals.rules && <RulesModal />}
      {modals.stats && <StatsModal />}
      {modals.archive && <ArchiveCalendarModal />}
      {modals.achievements && <AchievementsModal />}
      <AchievementToastQueue />
    </div>
  );
}
