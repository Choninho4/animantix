import { Link } from 'react-router-dom';
import { Wordmark } from '../layout/Wordmark';

const FOOTER_LINKS = [
  { to: '/', label: 'Jouer' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
  { to: '/mentions-legales', label: 'Mentions légales' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-[960px] flex-wrap items-center gap-5 px-4 py-6">
        <div className="flex items-center gap-2.5 opacity-80">
          <Wordmark size={16} />
          <span className="text-[13px] text-muted">un jeu de la communauté INKU</span>
        </div>
        <div className="flex-1" />
        <nav className="flex flex-wrap gap-4">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="text-[13px] text-muted hover:text-brand">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
