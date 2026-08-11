import { isArchiveDayWon, useGameStore } from '../../store/useGameStore';
import { ModalShell } from './ModalShell';
import { CheckIcon, CloseIcon } from '../icons/Icon';

const DAYS_BACK = 28;

export function ArchiveCalendarModal() {
  const closeModals = useGameStore((s) => s.closeModals);
  const archiveOffset = useGameStore((s) => s.archiveOffset);
  const loadDay = useGameStore((s) => s.loadDay);

  // Trié par date réelle croissante (du plus ancien au plus récent) pour un
  // affichage en ordre calendaire naturel — l'offset seul (1..28) ne suffit
  // pas car il ne reflète pas le jour du mois lors d'un changement de mois.
  const days = Array.from({ length: DAYS_BACK }, (_, i) => i + 1)
    .map((offset) => ({ offset, date: new Date(Date.now() - offset * 86_400_000) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <ModalShell label="Archives" onClose={closeModals} maxWidth={480}>
      <div className="mb-1.5 flex items-start gap-3">
        <h2 className="flex-1 font-display text-[26px] font-bold text-brand">Archives</h2>
        <button
          type="button"
          onClick={closeModals}
          aria-label="Fermer"
          className="flex h-touch w-touch flex-none items-center justify-center rounded-control border-none bg-bg text-brand-dark"
        >
          <CloseIcon size={18} />
        </button>
      </div>
      <p className="mb-4 text-[13px] leading-[1.5] text-muted">
        Rejoue les {DAYS_BACK} derniers personnages. Les parties d'archives ne comptent pas dans
        tes statistiques.
      </p>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map(({ offset, date }) => {
          const active = archiveOffset === offset;
          const done = isArchiveDayWon(offset);
          const stateClass = active
            ? 'border-brand bg-brand text-white'
            : done
              ? 'border-brand bg-brand/10 text-brand'
              : 'border-border bg-surface text-brand-dark';
          return (
            <button
              key={offset}
              type="button"
              onClick={() => loadDay(offset)}
              className={`flex aspect-square min-h-touch flex-col items-center justify-center gap-px rounded-control border font-bold text-[13px] ${stateClass}`}
            >
              <span>{date.getDate()}</span>
              <span className="h-2.5 opacity-75">{done && <CheckIcon size={10} />}</span>
            </button>
          );
        })}
      </div>
    </ModalShell>
  );
}
