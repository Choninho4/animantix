interface WordmarkProps {
  size?: number;
}

export function Wordmark({ size = 21 }: WordmarkProps) {
  return (
    <span className="font-display font-bold uppercase leading-[1.05] tracking-normal" style={{ fontSize: size }}>
      <span className="text-text">Anim</span>
      <span className="text-brand-mid">antix</span>
    </span>
  );
}
