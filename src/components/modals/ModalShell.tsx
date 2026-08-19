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
      style={{ background: 'rgba(8,8,16,.8)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full border-[4px] border-ink bg-surface p-6 shadow-[14px_14px_0_#D02886] motion-safe:animate-amx-pop"
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
      <h2 className="flex-1 font-display text-[26px] font-bold uppercase text-brand">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="flex h-touch w-touch flex-none items-center justify-center border-[3px] border-ink bg-danger text-white shadow-[4px_4px_0_#0B0B16] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
      >
        <CloseIcon size={18} />
      </button>
    </div>
  );
}
