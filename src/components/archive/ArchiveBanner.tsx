import { useGameStore } from '../../store/useGameStore';

export function ArchiveBanner() {
  const archiveOffset = useGameStore((s) => s.archiveOffset);
  const exitArchive = useGameStore((s) => s.exitArchive);

  if (archiveOffset === 0) return null;

  const label = new Date(Date.now() - archiveOffset * 86_400_000).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 border-[3px] border-ink bg-brand-mid/10 px-4 py-3 shadow-[5px_5px_0_#9966CC]">
      <span className="font-display text-[13px] font-bold text-brand-dark">Mode archives · {label}</span>
      <span className="flex-1" />
      <button
        type="button"
        onClick={exitArchive}
        className="min-h-touch border-2 border-ink bg-surface px-3.5 py-2 font-display text-[13px] font-bold text-brand-dark shadow-[3px_3px_0_#0B0B16] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
      >
        Revenir au jour
      </button>
    </div>
  );
}
