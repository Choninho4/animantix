interface HintItemProps {
  n: number;
  label: string;
  value: string;
}

export function HintItem({ n, label, value }: HintItemProps) {
  return (
    <li className="flex items-center gap-2.5 text-[14px] text-text">
      <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-control bg-bg text-[12px] font-bold text-brand-dark">
        {n}
      </span>
      <span className="font-semibold text-muted">{label}</span>
      <span className="font-bold text-brand">{value}</span>
    </li>
  );
}
