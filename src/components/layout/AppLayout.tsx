import { Outlet } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { Header } from './Header';
import { Footer } from './Footer';
import { RulesModal } from '../modals/RulesModal';
import { StatsModal } from '../modals/StatsModal';
import { ArchiveCalendarModal } from '../modals/ArchiveCalendarModal';

// Coquille commune à toutes les pages : navbar et footer identiques partout,
// et les modales (règles/stats/archives) déclenchables depuis le header quelle
// que soit la page affichée, puisqu'elles ne dépendent que de l'état global.
export function AppLayout() {
  const modals = useGameStore((s) => s.modals);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      {modals.rules && <RulesModal />}
      {modals.stats && <StatsModal />}
      {modals.archive && <ArchiveCalendarModal />}
    </div>
  );
}
