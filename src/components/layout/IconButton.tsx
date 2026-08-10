import type { ReactNode } from 'react';

interface IconButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
}

export function IconButton({ label, onClick, children }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-touch w-touch flex-none items-center justify-center rounded-control border-none bg-transparent text-muted transition-colors hover:bg-bg hover:text-brand"
    >
      {children}
    </button>
  );
}
