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

export function TrophyIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3M17 5h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3" />
      <path d="M12 14v3M9 20.5h6M9.5 20.5l.7-3.5h3.6l.7 3.5" />
    </svg>
  );
}

export function BoltIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

export function HourglassIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M6 2.5h12M6 21.5h12" />
      <path d="M7 2.5v3.2c0 2 1.8 3.3 3.6 4.3.4.2.4.8 0 1c-1.8 1-3.6 2.3-3.6 4.3v3.2M17 2.5v3.2c0 2-1.8 3.3-3.6 4.3-.4.2-.4.8 0 1 1.8 1 3.6 2.3 3.6 4.3v3.2" />
    </svg>
  );
}

export function ShieldIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 2.5 4.5 5.5v6c0 5 3.2 8 7.5 10 4.3-2 7.5-5 7.5-10v-6L12 2.5Z" />
      <path d="M9 11.8 11.2 14 15.5 9.5" />
    </svg>
  );
}

export function MountainIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M3 19 9.5 7l3.4 5.8L15.5 10 21 19H3Z" />
      <path d="M14.7 12.5 13 15.3" />
    </svg>
  );
}

export function GlobeIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}

export function ClockIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function MedalIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="8.5" r="6" />
      <path d="M8.5 13.9 7 22l5-2.7 5 2.7-1.5-8.1" />
    </svg>
  );
}

export function ShareIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="5.5" r="2.6" />
      <circle cx="18" cy="18.5" r="2.6" />
      <path d="M8.3 10.8 15.7 6.7M8.3 13.2l7.4 4.1" />
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
