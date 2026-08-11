import type { ReactNode } from 'react';

interface StatTileProps {
  value: string;
  label: string;
  icon?: ReactNode;
}

export function StatTile({ value, label, icon }: StatTileProps) {
  return (
    <div className="min-w-[96px] rounded-card bg-bg px-4 py-2.5">
      <div className="flex items-center gap-1.5 font-display text-[22px] font-bold text-brand">
        {icon}
        {value}
      </div>
      <div className="text-[11px] text-muted">{label}</div>
    </div>
  );
}
