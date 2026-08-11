import { forwardRef } from 'react';
import type { GuessEntry } from '../../types/guess';
import { temperatureForScore, type TemperatureIcon } from '../../lib/temperature';

interface ShareCardProps {
  dayNumber: number;
  guesses: GuessEntry[];
  elapsed: string;
  streak: number;
}

const TILES_PER_LINE = 5;

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
    `<path d="M12 2.8c.4 2.2-.6 3.5-2 4.9C8.4 9.3 7 11 7 13.6a5 5 0 0 0 10 0c0-1.9-.9-3.1-1.8-4.1-.2 1.5-.9 2.4-1.9 2.8.7-2.1-.1-3.8-1.6-5.2-.9 1.4-1.6 2.1-2.3 1.5-.6-.5-.5-1.5.6-2.7.9-1 1.5-1.9 1.6-2.5Z" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
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

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { dayNumber, guesses, elapsed, streak },
  ref,
) {
  const rows: GuessEntry[][] = [];
  for (let i = 0; i < guesses.length; i += TILES_PER_LINE) {
    rows.push(guesses.slice(i, i + TILES_PER_LINE));
  }

  return (
    <div
      ref={ref}
      style={{
        width: 600,
        height: 600,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 48,
        background: '#F5F5F7',
        color: '#1A1A2E',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 700,
            fontSize: 34,
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          <span style={{ color: '#1A1A2E' }}>Anim</span>
          <span style={{ color: '#9966CC' }}>antix</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 15, color: '#767680' }}>Personnage du jour #{dayNumber}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: 12 }}>
            {row.map((g) => {
              const t = temperatureForScore(g.score);
              return (
                <div
                  key={g.n}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background: t.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconGlyph icon={t.icon} color={t.color} size={22} />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 28 }}>
          <div>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 24, color: '#D02886' }}>
              {guesses.length}
            </div>
            <div style={{ fontSize: 12, color: '#767680' }}>essais</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 24, color: '#D02886' }}>
              {elapsed}
            </div>
            <div style={{ fontSize: 12, color: '#767680' }}>temps</div>
          </div>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 700,
                fontSize: 24,
                color: '#D02886',
              }}
            >
              <IconGlyph icon="flame" color="#D02886" size={19} />
              {streak}
            </div>
            <div style={{ fontSize: 12, color: '#767680' }}>série</div>
          </div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#54218E' }}>animantix.vercel.app</div>
      </div>
    </div>
  );
});
