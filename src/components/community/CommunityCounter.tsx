import { useGameStore } from '../../store/useGameStore';

export function CommunityCounter() {
  const won = useGameStore((s) => s.won);
  const archiveOffset = useGameStore((s) => s.archiveOffset);
  const total = useGameStore((s) => s.communityTotal);

  if (won || archiveOffset !== 0 || total === null) return null;

  return (
    <p className="mb-3 text-center font-mono text-[12px] uppercase tracking-wide text-muted">
      {total > 0
        ? `${total.toLocaleString('fr-FR')} ${total === 1 ? 'personne a' : 'personnes ont'} déjà trouvé le personnage du jour.`
        : 'Sois le premier à trouver le personnage du jour !'}
    </p>
  );
}
