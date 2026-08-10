interface StatTileProps {
  value: string;
  label: string;
}

export function StatTile({ value, label }: StatTileProps) {
  return (
    <div className="min-w-[96px] rounded-card bg-bg px-4 py-2.5">
      <div className="font-display text-[22px] font-bold text-brand">{value}</div>
      <div className="text-[11px] text-muted">{label}</div>
    </div>
  );
}
