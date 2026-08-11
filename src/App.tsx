import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { Header } from './components/layout/Header';
import { UpcomingTeaser } from './components/layout/UpcomingTeaser';
import { ArchiveBanner } from './components/archive/ArchiveBanner';
import { SearchBar } from './components/search/SearchBar';
import { HintsPanel } from './components/hints/HintsPanel';
import { EmptyState } from './components/guesses/EmptyState';
import { AttemptsTable } from './components/guesses/AttemptsTable';
import { VictorySection } from './components/victory/VictorySection';
import { RulesModal } from './components/modals/RulesModal';
import { StatsModal } from './components/modals/StatsModal';
import { ArchiveCalendarModal } from './components/modals/ArchiveCalendarModal';
import { useCountdown } from './hooks/useCountdown';
import { useGameStore } from './store/useGameStore';

export default function App() {
  const init = useGameStore((s) => s.init);
  const won = useGameStore((s) => s.won);
  const guesses = useGameStore((s) => s.guesses);
  const modals = useGameStore((s) => s.modals);

  useEffect(() => {
    init();
  }, [init]);

  useCountdown();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-bg pb-16">
        <Header />
        <main className="mx-auto max-w-[860px] px-4">
          <ArchiveBanner />
          <VictorySection />
          <SearchBar />
          <HintsPanel />
          {guesses.length === 0 && !won && <EmptyState />}
          <AttemptsTable />
          <UpcomingTeaser />
        </main>
        {modals.rules && <RulesModal />}
        {modals.stats && <StatsModal />}
        {modals.archive && <ArchiveCalendarModal />}
      </div>
    </MotionConfig>
  );
}
