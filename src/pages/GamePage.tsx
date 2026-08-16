import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { UpcomingTeaser } from '../components/layout/UpcomingTeaser';
import { ArchiveBanner } from '../components/archive/ArchiveBanner';
import { SearchBar } from '../components/search/SearchBar';
import { TokensPanel } from '../components/tokens/TokensPanel';
import { EmptyState } from '../components/guesses/EmptyState';
import { AttemptsTable } from '../components/guesses/AttemptsTable';
import { VictorySection } from '../components/victory/VictorySection';
import { CommunityCounter } from '../components/community/CommunityCounter';
import { useCountdown } from '../hooks/useCountdown';
import { useGameStore } from '../store/useGameStore';
import { preloadShareCardFonts } from '../lib/fontEmbed';

export default function GamePage() {
  const init = useGameStore((s) => s.init);
  const won = useGameStore((s) => s.won);
  const guesses = useGameStore((s) => s.guesses);

  useEffect(() => {
    init();
    // Précharge tôt les polices utilisées par l'image de résultat partageable
    // (voir lib/fontEmbed.ts) pour qu'elles soient déjà prêtes le jour où le
    // joueur gagne et clique sur "Partager", plutôt que de les fetcher pour
    // la première fois à ce moment-là.
    preloadShareCardFonts();
  }, [init]);

  useCountdown();

  return (
    <MotionConfig reducedMotion="user">
      <main className="mx-auto max-w-[860px] px-4 pb-16">
        <ArchiveBanner />
        <VictorySection />
        <CommunityCounter />
        <SearchBar />
        <TokensPanel />
        {guesses.length === 0 && !won && <EmptyState />}
        <AttemptsTable />
        <UpcomingTeaser />
      </main>
    </MotionConfig>
  );
}
