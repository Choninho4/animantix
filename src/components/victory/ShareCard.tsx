import { forwardRef } from 'react';
import type { GuessEntry } from '../../types/guess';
import { temperatureForScore, type TemperatureIcon } from '../../lib/temperature';

interface ShareCardProps {
  dayNumber: number;
  guesses: GuessEntry[];
  elapsed: string;
  streak: number;
}

const CARD_WIDTH = 640;
const PADDING = 44;
const COLS = 8;
const TILE = 52;
const GAP = 10;
const MAX_TILES_SHOWN = 60;

// Palette figée en sombre (DA Animantix, thème sombre de src/index.css) : la
// carte partagée doit toujours avoir le même rendu, quel que soit le thème
// actif du visiteur qui clique sur "Partager".
const DARK = {
  bg: '#15152B',
  surface: '#23233F',
  text: '#FFFFFF',
  brandMid: '#9966CC',
  muted: '#B0B0C0',
  border: '#2F2B3D',
};

// html-to-image (utilisé pour capturer cette carte en PNG) plante sur les
// <svg> inline : les nœuds SVG exposent `className` comme SVGAnimatedString,
// ce qui casse sa logique de clonage. On dessine donc les icônes en
// data-URI CSS (background-image) plutôt qu'en SVG React.
const ICON_MARKUP: Record<TemperatureIcon, (color: string) => string> = {
  target: (color) =>
    `<circle cx="12" cy="12" r="8.4" stroke="${color}" stroke-width="1.6" fill="none"/>` +
    `<circle cx="12" cy="12" r="4.6" stroke="${color}" stroke-width="1.6" fill="none"/>` +
    `<circle cx="12" cy="12" r="1" fill="${color}"/>`,
  flame: (color) =>
    `<path d="M17.66 18.66a8 8 0 0 1-11.32 0C3 15.31 3 10.98 6.34 7.34 7 9 7.66 10 9.66 11c0-2 .5-5 3-7 2 2 4.1 2.78 5.66 4.34a8 8 0 0 1-.66 10.32Z" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
    `<path d="M9.88 16.12A3 3 0 1 0 12.02 11L11 14H9c0 .77.29 1.54.88 2.12Z" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  snowflake: (color) =>
    `<path d="M12 3v18M3 12h18" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path d="m8 7 4-4 4 4M8 17l4 4 4-4M7 8 3 12l4 4M17 8l4 4-4 4" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,
};

function iconBackground(icon: TemperatureIcon, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${ICON_MARKUP[icon](color)}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function IconGlyph({ icon, color, size }: { icon: TemperatureIcon; color: string; size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundImage: iconBackground(icon, color),
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
      }}
    />
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 26, color: DARK.text }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: DARK.muted }}>{label}</div>
    </div>
  );
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { dayNumber, guesses, elapsed, streak },
  ref,
) {
  const shown = guesses.slice(-MAX_TILES_SHOWN);
  const gridWidth = COLS * TILE + (COLS - 1) * GAP;

  return (
    <div
      ref={ref}
      style={{
        width: CARD_WIDTH,
        boxSizing: 'border-box',
        padding: PADDING,
        background: DARK.bg,
        color: DARK.text,
        fontFamily: "'Urbanist', sans-serif",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 700,
            fontSize: 27,
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          <span style={{ color: DARK.text }}>Anim</span>
          <span style={{ color: DARK.brandMid }}>antix</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: DARK.muted }}>animantix.vercel.app</div>
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 13, color: DARK.muted }}>Personnage du jour</div>
        <div style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 56, lineHeight: 1.05, color: DARK.text }}>
          #{dayNumber}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '28px 0' }}>
        <div style={{ width: gridWidth, display: 'flex', flexWrap: 'wrap', gap: GAP }}>
          {shown.map((g) => {
            const t = temperatureForScore(g.score);
            const isFound = g.score === 100;
            return (
              <div
                key={g.n}
                style={{
                  width: TILE,
                  height: TILE,
                  border: `2px solid #0B0B16`,
                  background: isFound ? DARK.text : t.bg,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <IconGlyph icon={t.icon} color={isFound ? DARK.bg : t.fgDark} size={20} />
                <span style={{ fontSize: 10, fontWeight: 600, color: isFound ? DARK.bg : DARK.muted }}>{g.n}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 36, borderTop: `1px dashed ${DARK.border}`, paddingTop: 20 }}>
        <StatBlock value={String(guesses.length)} label="essais" />
        <StatBlock value={elapsed} label="temps" />
        <StatBlock value={String(streak)} label="série" />
      </div>
    </div>
  );
});
