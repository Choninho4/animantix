import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ToastProps {
  icon: ReactNode;
  eyebrow: string;
  title: string;
}

// Toast générique (succès débloqué, jeton d'analyse gagné...) : un seul
// gabarit visuel partagé, le contenu seul change selon l'appelant.
export function Toast({ icon, eyebrow, title }: ToastProps) {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      role="status"
      className="pointer-events-auto flex items-center gap-3 border-[3px] border-ink bg-surface px-4 py-3 shadow-dropdown"
      style={{ maxWidth: 340 }}
    >
      <span className="flex h-10 w-10 flex-none items-center justify-center border-2 border-ink bg-brand text-white">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[11px] font-bold uppercase tracking-[.08em] text-brand">{eyebrow}</span>
        <span className="block truncate font-display text-[15px] font-bold text-text">{title}</span>
      </span>
    </motion.div>
  );
}
