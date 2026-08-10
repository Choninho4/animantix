import { useGameStore } from '../../store/useGameStore';
import { formatCountdown, msUntilNextMidnight } from '../../lib/format';
import { ModalHeader, ModalShell } from './ModalShell';
import { HistogramBar } from './HistogramBar';

const BUCKETS = ['1-5', '6-10', '11-20', '21-40', '41+'] as const;

export function StatsModal() {
  const closeModals = useGameStore((s) => s.closeModals);
  const stats = useGameStore((s) => s.stats);
  const now = useGameStore((s) => s.now);

  const winPct = stats.gamesPlayed ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const dist = stats.guessDistribution;
  const maxCount = Math.max(1, ...BUCKETS.map((b) => dist[b] ?? 0));
  const countdown = formatCountdown(msUntilNextMidnight(new Date(now)));

  return (
    <ModalShell label="Statistiques" onClose={closeModals} maxWidth={480}>
      <ModalHeader title="Statistiques" onClose={closeModals} />
      <div className="mb-5.5 grid grid-cols-4 gap-2">
        <StatBox value={stats.gamesPlayed} label="Parties" />
        <StatBox value={`${winPct}%`} label="% réussite" />
        <StatBox value={stats.currentStreak} label="Série" />
        <StatBox value={stats.maxStreak} label="Record" />
      </div>
      <h3 className="mb-3 font-display text-[17px] font-bold text-brand-dark">Essais par victoire</h3>
      <ul className="flex flex-col gap-2">
        {BUCKETS.map((b) => {
          const count = dist[b] ?? 0;
          return (
            <HistogramBar key={b} label={b} count={count} percent={Math.max(8, Math.round((count / maxCount) * 100))} />
          );
        })}
      </ul>
      <p className="mt-4.5 text-center text-[12px] text-muted">Prochain personnage dans {countdown}</p>
    </ModalShell>
  );
}

function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-card bg-bg px-1.5 py-3 text-center">
      <div className="font-display text-[24px] font-bold text-brand-dark">{value}</div>
      <div className="text-[10px] leading-tight text-muted">{label}</div>
    </div>
  );
}
