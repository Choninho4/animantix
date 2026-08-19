interface WordmarkProps {
  size?: number;
  /** Sur fond encre (stamp du header) : texte plein blanc plutôt que le duo texte/brand-mid habituel. */
  inverted?: boolean;
}

export function Wordmark({ size = 21, inverted = false }: WordmarkProps) {
  return (
    <span className="font-display font-bold uppercase leading-[1.05] tracking-normal" style={{ fontSize: size }}>
      <span className={inverted ? 'text-white' : 'text-text'}>Anim</span>
      <span className={inverted ? 'text-white' : 'text-brand-mid'}>antix</span>
    </span>
  );
}
