import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { useTheme } from '../../hooks/useTheme';
import { MenuIcon, CloseIcon } from '../icons/Icon';

const NAV_LINKS = [
  { to: '/', label: 'Jouer' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
];

// Panneau de navigation mobile : regroupe à la fois les liens de site
// (Jouer/À propos/Contact) et les actions du jeu (thème/stats/archives/
// règles) qui, sur desktop, restent affichés en ligne dans le header.
// N'existe que sous md (voir Header.tsx) — le header desktop n'est pas
// touché par ce composant.
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = 'mobile-nav-panel';
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openModal = useGameStore((s) => s.openModal);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  function closeAnd(fn: () => void) {
    fn();
    setOpen(false);
  }

  return (
    <div className="relative md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex h-touch w-touch flex-none items-center justify-center rounded-control border-none bg-transparent text-muted transition-colors hover:bg-bg hover:text-brand"
      >
        {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[59]"
            style={{ background: 'rgba(26,26,46,.4)' }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id={panelId}
            className="absolute right-0 top-[calc(100%+8px)] z-[61] w-[min(280px,calc(100vw-24px))] rounded-card border border-border bg-surface p-2 shadow-dropdown motion-safe:animate-amx-pop"
          >
            <nav aria-label="Navigation du site" className="flex flex-col gap-0.5">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-touch items-center rounded-control px-3.5 text-[15px] font-bold ${
                      isActive ? 'bg-bg text-brand' : 'text-text hover:bg-bg hover:text-brand'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="my-1.5 border-t border-border" />
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => closeAnd(toggleTheme)}
                className="flex min-h-touch items-center rounded-control px-3.5 text-[15px] font-bold text-text hover:bg-bg hover:text-brand"
              >
                {theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}
              </button>
              <button
                type="button"
                onClick={() => closeAnd(() => openModal('stats'))}
                className="flex min-h-touch items-center rounded-control px-3.5 text-[15px] font-bold text-text hover:bg-bg hover:text-brand"
              >
                Statistiques
              </button>
              <button
                type="button"
                onClick={() => closeAnd(() => openModal('achievements'))}
                className="flex min-h-touch items-center rounded-control px-3.5 text-[15px] font-bold text-text hover:bg-bg hover:text-brand"
              >
                Succès
              </button>
              <button
                type="button"
                onClick={() => closeAnd(() => openModal('archive'))}
                className="flex min-h-touch items-center rounded-control px-3.5 text-[15px] font-bold text-text hover:bg-bg hover:text-brand"
              >
                Archives
              </button>
              <button
                type="button"
                onClick={() => closeAnd(() => openModal('rules'))}
                className="flex min-h-touch items-center rounded-control px-3.5 text-[15px] font-bold text-text hover:bg-bg hover:text-brand"
              >
                Règles du jeu
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
