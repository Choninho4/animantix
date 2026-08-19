import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { useTheme } from '../../hooks/useTheme';
import {
  MenuIcon,
  CloseIcon,
  SunIcon,
  MoonIcon,
  BarChartIcon,
  CalendarIcon,
  HelpCircleIcon,
  MailIcon,
  DocumentIcon,
  GlobeIcon,
  TrophyIcon,
} from '../icons/Icon';

const TILE_CLASS =
  'flex flex-col items-center justify-center gap-1.5 border-2 border-ink bg-bg px-3 py-3.5 text-center font-display text-[13px] font-bold leading-tight text-text shadow-[3px_3px_0_rgb(var(--color-shadow-accent))] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-brand hover:text-white hover:shadow-[5px_5px_0_rgb(var(--color-shadow-accent))] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none';

// Point d'accès unique du header : un bouton "Menu" qui déplie un dropdown
// ancré à la navbar (pas une modale/page séparée) regroupant les 4 modales
// existantes (règles/stats/succès/archives), le thème et les 3 pages du
// site. Remplace à la fois l'ancienne rangée d'icônes desktop et le burger
// mobile — un seul composant, un seul comportement, à tous les breakpoints.
export function HeaderMenu() {
  const [open, setOpen] = useState(false);
  const panelId = 'header-menu-panel';
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
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex h-touch flex-none items-center gap-1.5 border-[3px] border-ink bg-surface px-3 font-display text-[13px] font-bold text-text shadow-[4px_4px_0_rgb(var(--color-shadow-accent))] transition-colors hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-brand hover:text-white hover:shadow-[6px_6px_0_#FF5FB3] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
      >
        {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
        Menu
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
            role="menu"
            aria-label="Menu du site"
            className="absolute inset-x-0 top-[calc(100%+10px)] z-[61] mx-auto w-full max-w-[860px] px-3 sm:px-4"
          >
            <div className="grid max-h-[70vh] grid-cols-1 gap-2 overflow-y-auto border-[3px] border-ink bg-surface p-3 shadow-dropdown motion-safe:animate-amx-pop sm:grid-cols-2 md:grid-cols-4">
              <button type="button" role="menuitem" onClick={() => closeAnd(() => openModal('rules'))} className={TILE_CLASS}>
                <HelpCircleIcon size={20} />
                Règles
              </button>
              <button type="button" role="menuitem" onClick={() => closeAnd(() => openModal('stats'))} className={TILE_CLASS}>
                <BarChartIcon size={20} />
                Stats
              </button>
              <button type="button" role="menuitem" onClick={() => closeAnd(() => openModal('achievements'))} className={TILE_CLASS}>
                <TrophyIcon size={20} />
                Succès
              </button>
              <button type="button" role="menuitem" onClick={() => closeAnd(() => openModal('archive'))} className={TILE_CLASS}>
                <CalendarIcon size={20} />
                Archives
              </button>
              <button type="button" role="menuitem" onClick={toggleTheme} className={TILE_CLASS}>
                {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
                {theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
              </button>
              <Link to="/a-propos" role="menuitem" onClick={() => setOpen(false)} className={TILE_CLASS}>
                <GlobeIcon size={20} />
                À propos
              </Link>
              <Link to="/contact" role="menuitem" onClick={() => setOpen(false)} className={TILE_CLASS}>
                <MailIcon size={20} />
                Contact
              </Link>
              <Link to="/mentions-legales" role="menuitem" onClick={() => setOpen(false)} className={TILE_CLASS}>
                <DocumentIcon size={20} />
                Mentions légales
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
