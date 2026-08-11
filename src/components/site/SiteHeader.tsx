import { NavLink } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { IconButton } from '../layout/IconButton';
import { Wordmark } from '../layout/Wordmark';

const NAV_LINKS = [
  { to: '/', label: 'Jouer' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-[60] border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[960px] items-center gap-4 px-4 py-3">
        <NavLink to="/" className="flex-none">
          <Wordmark size={20} />
        </NavLink>
        <div className="flex-1" />
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex min-h-touch items-center rounded-control px-3.5 text-[14px] font-bold ${
                  isActive ? 'bg-bg text-brand' : 'text-muted hover:bg-bg hover:text-brand'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
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
      </div>
    </header>
  );
}
