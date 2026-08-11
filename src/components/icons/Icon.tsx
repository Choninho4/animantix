import type { TemperatureIcon } from '../../lib/temperature';

interface IconProps {
  size?: number;
  className?: string;
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function FlameIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 2.8c.4 2.2-.6 3.5-2 4.9C8.4 9.3 7 11 7 13.6a5 5 0 0 0 10 0c0-1.9-.9-3.1-1.8-4.1-.2 1.5-.9 2.4-1.9 2.8.7-2.1-.1-3.8-1.6-5.2-.9 1.4-1.6 2.1-2.3 1.5-.6-.5-.5-1.5.6-2.7.9-1 1.5-1.9 1.6-2.5Z" />
    </svg>
  );
}

export function TargetIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SnowflakeIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 3v18M3 12h18" />
      <path d="m8 7 4-4 4 4M8 17l4 4 4-4M7 8 3 12l4 4M17 8l4 4-4 4" />
    </svg>
  );
}

export function CheckIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M5 12.5 9.5 17 19 7" />
    </svg>
  );
}

export function CloseIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

const TEMPERATURE_ICON_COMPONENTS: Record<TemperatureIcon, (props: IconProps) => JSX.Element> = {
  target: TargetIcon,
  flame: FlameIcon,
  snowflake: SnowflakeIcon,
};

export function TemperatureBandIcon({ icon, size, className }: IconProps & { icon: TemperatureIcon }) {
  const Component = TEMPERATURE_ICON_COMPONENTS[icon];
  return <Component size={size} className={className} />;
}
