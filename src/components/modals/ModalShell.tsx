import { useEffect, useRef, type ReactNode } from 'react';
import { CloseIcon } from '../icons/Icon';

interface ModalShellProps {
  label: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
}

export function ModalShell({ label, onClose, children, maxWidth = 520 }: ModalShellProps) {
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    triggerRef.current = document.activeElement;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto px-4 py-6"
      style={{ background: 'rgba(26,26,46,.55)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-card bg-surface p-6 motion-safe:animate-amx-pop"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <h2 className="flex-1 font-display text-[26px] font-bold text-brand">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="flex h-touch w-touch flex-none items-center justify-center rounded-control border-none bg-bg text-brand-dark"
      >
        <CloseIcon size={18} />
      </button>
    </div>
  );
}
