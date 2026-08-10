import { forwardRef } from 'react';
import type { GuessEntry } from '../../types/guess';
import { temperatureForScore } from '../../lib/temperature';

interface ShareCardProps {
  dayNumber: number;
  guesses: GuessEntry[];
  elapsed: string;
  streak: number;
}

const EMOJIS_PER_LINE = 5;

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { dayNumber, guesses, elapsed, streak },
  ref,
) {
  const rows: string[][] = [];
  for (let i = 0; i < guesses.length; i += EMOJIS_PER_LINE) {
    rows.push(guesses.slice(i, i + EMOJIS_PER_LINE).map((g) => temperatureForScore(g.score).emoji));
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
            {row.map((emoji, j) => (
              <span key={j} style={{ fontSize: 42, lineHeight: 1 }}>
                {emoji}
              </span>
            ))}
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
            <div style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 24, color: '#D02886' }}>
              🔥 {streak}
            </div>
            <div style={{ fontSize: 12, color: '#767680' }}>série</div>
          </div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#54218E' }}>animantix.vercel.app</div>
      </div>
    </div>
  );
});
