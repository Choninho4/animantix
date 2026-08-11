import { NavLink } from 'react-router-dom';
import { todayIndex, useGameStore } from '../../store/useGameStore';
import { useTheme } from '../../hooks/useTheme';
import { IconButton } from './IconButton';
import { StreakBadge } from './StreakBadge';
import { Wordmark } from './Wordmark';

export function Header() {
  const archiveOffset = useGameStore((s) => s.archiveOffset);
  const streak = useGameStore((s) => s.stats.currentStreak);
  const openModal = useGameStore((s) => s.openModal);
  const dayNumber = todayIndex() - archiveOffset + 1;
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-[60] border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[860px] items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="truncate">
            <Wordmark />
          </div>
          <div className="hidden truncate text-[11px] leading-tight text-muted min-[420px]:block">
            Personnage du jour #{dayNumber}
          </div>
        </div>
        <div className="flex flex-none items-center gap-0.5 sm:gap-3">
          <StreakBadge streak={streak} />
          <IconButton
            label={theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
              </svg>
            )}
          </IconButton>
          <IconButton label="Statistiques" onClick={() => openModal('stats')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 3v18h18" />
              <rect x="7" y="11" width="3" height="6" />
              <rect x="12.5" y="7" width="3" height="10" />
              <rect x="18" y="13" width="3" height="4" />
            </svg>
          </IconButton>
          <IconButton label="Archives" onClick={() => openModal('archive')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
              <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
            </svg>
          </IconButton>
          <IconButton label="Règles du jeu" onClick={() => openModal('rules')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.4 9.2a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.2-2.6 3.9" />
              <path d="M12 17.4h.01" />
            </svg>
          </IconButton>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex min-h-touch flex-none items-center rounded-control px-3 text-[13px] font-bold ${
                isActive ? 'bg-bg text-brand' : 'text-muted hover:bg-bg hover:text-brand'
              }`
            }
          >
            Contact
          </NavLink>
        </div>
      </div>
    </header>
  );
}
