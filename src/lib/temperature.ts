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

// Aplats pleins façon tampon (border encre + ombre dure appliquées au niveau des
// composants) plutôt que les teintes translucides précédentes : bg/color partagent
// désormais la même couleur saturée, fg/fgDark le même texte de contraste (le badge
// ne change plus avec le thème, comme dans la DA neo-brutalism).
export const TEMPERATURE_BANDS: TemperatureBand[] = [
  { min: 100, label: 'Trouvé !', icon: 'target', color: '#4CAF50', bg: '#4CAF50', fg: '#0B0B16', fgDark: '#0B0B16' },
  { min: 80, label: 'Brûlant', icon: 'flame', color: '#E63946', bg: '#E63946', fg: '#FFFFFF', fgDark: '#FFFFFF' },
  { min: 50, label: 'Chaud', icon: 'flame', color: '#D02886', bg: '#D02886', fg: '#FFFFFF', fgDark: '#FFFFFF' },
  { min: 25, label: 'Tiède', icon: 'flame', color: '#9966CC', bg: '#9966CC', fg: '#12121F', fgDark: '#12121F' },
  { min: 1, label: 'Froid', icon: 'snowflake', color: '#7C5CD6', bg: '#7C5CD6', fg: '#FFFFFF', fgDark: '#FFFFFF' },
  { min: 0, label: 'Glacial', icon: 'snowflake', color: '#2563EB', bg: '#2563EB', fg: '#FFFFFF', fgDark: '#FFFFFF' },
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
