import type { ReactNode } from 'react';

interface StatTileProps {
  value: string;
  label: string;
  icon?: ReactNode;
  /** Couleur de l'ombre dure (une teinte différente par statistique, comme dans la DA). */
  shadowColor?: string;
}

export function StatTile({ value, label, icon, shadowColor = '#54218E' }: StatTileProps) {
  return (
    <div className="min-w-[96px] border-[3px] border-ink bg-bg px-4 py-2.5" style={{ boxShadow: `4px 4px 0 ${shadowColor}` }}>
      <div className="flex items-center gap-1.5 font-display text-[22px] font-bold text-brand">
        {icon}
        {value}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}
