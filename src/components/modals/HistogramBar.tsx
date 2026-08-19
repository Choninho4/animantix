interface HistogramBarProps {
  label: string;
  count: number;
  percent: number;
}

export function HistogramBar({ label, count, percent }: HistogramBarProps) {
  const hasCount = count > 0;
  return (
    <li className="flex items-center gap-2.5">
      <span className="w-[46px] flex-none font-mono text-[12px] font-semibold text-muted">{label}</span>
      <span className="block h-[22px] flex-1 overflow-hidden border-2 border-ink bg-bg">
        <span
          className={`flex h-full min-w-[26px] items-center justify-end pr-2 text-[11px] font-bold ${
            hasCount ? 'bg-brand text-white' : 'bg-border text-muted'
          }`}
          style={{ width: `${percent}%` }}
        >
          {count}
        </span>
      </span>
    </li>
  );
}
