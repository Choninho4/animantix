import { forwardRef } from 'react';
import type { GuessEntry } from '../../types/guess';

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
  bg: '#13111A',
  surface: '#1D1A28',
  text: '#F0EFF5',
  brandMid: '#B88AE8',
  muted: '#A7A4B5',
  border: '#2F2B3D',
};

// Seuils volontairement agrégés (nombre de critères corrects / 8, pas le
// détail par critère) pour ne jamais révéler d'indice sur le personnage à
// quelqu'un qui voit juste le partage.
const GREEN = { bg: 'rgba(34,197,94,.22)', fg: '#4ADE80' };
const YELLOW = { bg: 'rgba(234,179,8,.22)', fg: '#FACC15' };
const RED = { bg: 'rgba(225,29,72,.22)', fg: '#FB7185' };

function bucketFor(count: number): { bg: string; fg: string } {
  if (count >= 6) return GREEN;
  if (count >= 3) return YELLOW;
  return RED;
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
            const isFound = g.correctCount === 8;
            const bucket = bucketFor(g.correctCount);
            return (
              <div
                key={g.n}
                style={{
                  width: TILE,
                  height: TILE,
                  borderRadius: 13,
                  background: isFound ? DARK.text : bucket.bg,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: isFound ? DARK.bg : bucket.fg,
                  }}
                >
                  {g.correctCount}/8
                </span>
                <span style={{ fontSize: 9, fontWeight: 600, color: isFound ? DARK.bg : DARK.muted }}>{g.n}</span>
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
