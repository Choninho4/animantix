import { Link } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { StreakBadge } from './StreakBadge';
import { Wordmark } from './Wordmark';
import { HeaderMenu } from './HeaderMenu';

export function Header() {
  const streak = useGameStore((s) => s.stats.currentStreak);
  const loadDay = useGameStore((s) => s.loadDay);

  return (
    <header className="sticky top-0 z-[60] relative border-b-[3px] border-ink bg-surface">
      <div className="mx-auto flex max-w-[860px] items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <Link
            to="/"
            onClick={() => loadDay(0)}
            aria-label="Retour au personnage du jour"
            className="inline-flex flex-none items-center border-[3px] border-[#FF5FB3] bg-ink px-3 py-1.5 shadow-[4px_4px_0_#54218E] motion-safe:-rotate-2"
          >
            <Wordmark inverted />
          </Link>
        </div>
        <div className="flex flex-none items-center gap-1.5 sm:gap-2.5">
          <StreakBadge streak={streak} />
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
}
