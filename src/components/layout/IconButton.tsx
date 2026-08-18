import type { ReactNode } from 'react';

interface IconButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
  /** État "activé" persistant (ex. thème sombre en cours) : bordure + ombre dure restent visibles. */
  toggled?: boolean;
}

export function IconButton({ label, onClick, children, toggled }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-touch w-touch flex-none items-center justify-center rounded-control border-2 bg-transparent text-muted transition-colors hover:border-text hover:bg-bg hover:text-brand hover:shadow-[3px_3px_0_rgb(var(--color-text))] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
        toggled ? 'border-text shadow-[2px_2px_0_rgb(var(--color-text))]' : 'border-transparent'
      }`}
    >
      {children}
    </button>
  );
}
