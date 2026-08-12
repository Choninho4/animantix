import type { CSSProperties } from 'react';
import type { TemperatureIcon } from '../../lib/temperature';

interface IconProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function FlameIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} {...base}>
      <path d="M17.66 18.66a8 8 0 0 1-11.32 0C3 15.31 3 10.98 6.34 7.34 7 9 7.66 10 9.66 11c0-2 .5-5 3-7 2 2 4.1 2.78 5.66 4.34a8 8 0 0 1-.66 10.32Z" />
      <path d="M9.88 16.12A3 3 0 1 0 12.02 11L11 14H9c0 .77.29 1.54.88 2.12Z" />
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

export function MenuIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 7h16M4 12h16M4 17h16" />
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
