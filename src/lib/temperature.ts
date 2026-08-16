export type TemperatureIcon = 'target' | 'flame' | 'snowflake';

export interface TemperatureBand {
  min: number;
  label: string;
  icon: TemperatureIcon;
  color: string;
  bg: string;
  /** Couleur de texte du badge sur fond clair (contraste AA sur la teinte translucide en thème clair). */
  fg: string;
  /** Couleur de texte du badge sur fond sombre (contraste AA sur la même teinte en thème sombre). */
  fgDark: string;
}

export const TEMPERATURE_BANDS: TemperatureBand[] = [
  { min: 100, label: 'Trouvé !', icon: 'target', color: '#D02886', bg: 'rgba(208,40,134,.12)', fg: '#D02886', fgDark: '#FF5CB3' },
  { min: 80, label: 'Brûlant', icon: 'flame', color: '#C1121F', bg: 'rgba(230,57,70,.12)', fg: '#C1121F', fgDark: '#FF6B6B' },
  { min: 50, label: 'Chaud', icon: 'flame', color: '#C4700E', bg: 'rgba(224,122,26,.14)', fg: '#A75A0B', fgDark: '#E8A33D' },
  { min: 25, label: 'Tiède', icon: 'flame', color: '#9966CC', bg: 'rgba(153,102,204,.16)', fg: '#54218E', fgDark: '#C79EF0' },
  { min: 1, label: 'Froid', icon: 'snowflake', color: '#2563EB', bg: 'rgba(37,99,235,.12)', fg: '#1D4ED8', fgDark: '#60A5FA' },
  { min: 0, label: 'Glacial', icon: 'snowflake', color: '#B8B8C4', bg: 'rgb(var(--color-border))', fg: 'rgb(var(--color-muted))', fgDark: 'rgb(var(--color-muted))' },
];

export const TEMPERATURE_RANGE_LABELS: Record<number, string> = {
  100: '100 %',
  80: '80–99',
  50: '50–79',
  25: '25–49',
  1: '1–24',
  0: '0',
};

export function temperatureForScore(score: number): TemperatureBand {
  const band = TEMPERATURE_BANDS.find((t) => score >= t.min);
  return band ?? TEMPERATURE_BANDS[TEMPERATURE_BANDS.length - 1];
}
