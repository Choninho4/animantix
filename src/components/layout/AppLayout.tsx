import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { Header } from './Header';
import { RulesModal } from '../modals/RulesModal';
import { StatsModal } from '../modals/StatsModal';
import { ArchiveCalendarModal } from '../modals/ArchiveCalendarModal';
import { ToastQueue } from '../toasts/ToastQueue';
import { AchievementsModal } from '../achievements/AchievementsModal';

// Coquille commune à toutes les pages : navbar identique partout, et les
// modales (règles/stats/archives) déclenchables depuis le header quelle que
// soit la page affichée, puisqu'elles ne dépendent que de l'état global.
// Pas de footer : tous ses liens sont déjà accessibles depuis le Menu.
export function AppLayout() {
  const modals = useGameStore((s) => s.modals);
  const init = useGameStore((s) => s.init);

  // init() (stats, jour du jour, intro) tournait seulement depuis l'effet de
  // GamePage — donc s'il n'a encore jamais monté dans la session (arrivée
  // directe sur À propos/Contact/Mentions légales), la série du header restait
  // à 0 et surtout `loadDay` (ex. depuis Archives) se faisait écraser par le
  // `loadDay(0)` de l'init au moment où GamePage montait enfin. init() est
  // idempotent (garde `initialized`), l'appel depuis GamePage reste sans risque.
  useEffect(() => {
    init();
  }, [init]);

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
      <ToastQueue />
    </div>
  );
}
