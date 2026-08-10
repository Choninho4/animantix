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
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-card border border-brand-mid bg-brand-mid/10 px-4 py-3">
      <span className="font-bold text-[13px] text-brand-dark">Mode archives · {label}</span>
      <span className="flex-1" />
      <button
        type="button"
        onClick={exitArchive}
        className="min-h-touch rounded-control border-2 border-brand-mid bg-transparent px-3.5 py-2 font-bold text-[13px] text-brand-dark"
      >
        Revenir au jour
      </button>
    </div>
  );
}
