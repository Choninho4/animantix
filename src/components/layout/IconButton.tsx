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
      className={`flex h-touch w-touch flex-none items-center justify-center border-[3px] border-ink text-text transition-colors hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-brand hover:text-white hover:shadow-[6px_6px_0_#FF5FB3] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
        toggled
          ? 'translate-x-[3px] translate-y-[3px] bg-brand text-white shadow-none'
          : 'bg-surface shadow-[4px_4px_0_rgb(var(--color-shadow-accent))]'
      }`}
    >
      {children}
    </button>
  );
}
