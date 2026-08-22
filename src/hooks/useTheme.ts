import { useCallback, useState } from 'react';
import { LIGHT_MODE_ENABLED } from '../lib/constants';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'animantix-theme';

function readCurrentTheme(): Theme {
  if (!LIGHT_MODE_ENABLED) return 'dark';
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage indisponible : le thème reste actif pour la session en cours.
  }
}

/**
 * Le thème initial est déjà appliqué avant hydratation par le script inline
 * de index.html (évite le flash) ; ce hook ne fait que lire cet état et
 * exposer un toggle qui persiste le choix explicite de l'utilisateur.
 *
 * Tant que LIGHT_MODE_ENABLED est à `false` (voir lib/constants.ts), le
 * thème lu est toujours 'dark' et toggleTheme ne fait rien : la logique de
 * bascule reste intacte, simplement neutralisée le temps de la V1.
 */
export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>(readCurrentTheme);

  const toggleTheme = useCallback(() => {
    if (!LIGHT_MODE_ENABLED) return;
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
