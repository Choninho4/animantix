import { Link } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { useTheme } from '../../hooks/useTheme';
import { LIGHT_MODE_ENABLED } from '../../lib/constants';
import { StreakBadge } from './StreakBadge';
import { Wordmark } from './Wordmark';
import { HeaderMenu } from './HeaderMenu';
import { IconButton } from './IconButton';
import { BarChartIcon, CalendarIcon, HelpCircleIcon, MoonIcon, SunIcon, TrophyIcon } from '../icons/Icon';

export function Header() {
  const streak = useGameStore((s) => s.stats.currentStreak);
  const loadDay = useGameStore((s) => s.loadDay);
  const openModal = useGameStore((s) => s.openModal);
  const { theme, toggleTheme } = useTheme();

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
          {/* Accès rapide desktop : redondant avec le dropdown "Menu" (qui
              reste disponible à tous les breakpoints), masqué sous md faute
              de place pour 5 icônes + logo + streak + Menu sur mobile. */}
          <div className="hidden items-center gap-1.5 sm:gap-2.5 md:flex">
            <IconButton label="Statistiques" onClick={() => openModal('stats')}>
              <BarChartIcon size={20} />
            </IconButton>
            <IconButton label="Règles du jeu" onClick={() => openModal('rules')}>
              <HelpCircleIcon size={20} />
            </IconButton>
            <IconButton label="Succès" onClick={() => openModal('achievements')}>
              <TrophyIcon size={20} />
            </IconButton>
            <IconButton label="Archives" onClick={() => openModal('archive')}>
              <CalendarIcon size={20} />
            </IconButton>
            {LIGHT_MODE_ENABLED && (
              <IconButton
                label={theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}
                onClick={toggleTheme}
                toggled={theme === 'dark'}
              >
                {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
              </IconButton>
            )}
          </div>
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
}
