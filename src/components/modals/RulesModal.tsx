import { useGameStore } from '../../store/useGameStore';
import { CRITERIA_ORDER } from '../../lib/comparison';
import { ModalHeader, ModalShell } from './ModalShell';

// Rythme d'espacement réutilisable : SECTION_GAP sépare deux sections
// distinctes (ex. avant un titre h3), TIGHT_GAP garde un titre collé au
// contenu qui lui appartient directement (ex. titre + paragraphe associé).
const SECTION_GAP = 'mt-8';
const TIGHT_GAP = 'mb-2';

export function RulesModal() {
  const closeModals = useGameStore((s) => s.closeModals);

  return (
    <ModalShell label="Règles du jeu" onClose={closeModals}>
      <ModalHeader title="Comment jouer" onClose={closeModals} />
      <p className="mb-3.5 text-[15px] leading-[1.6] text-text">
        Chaque jour, tout le monde doit deviner le même personnage d'anime mystère. Propose
        d'autres personnages : chaque essai compare 8 critères avec le personnage du jour et
        colore chaque case en vert ou en rouge. Essais illimités.
      </p>
      <h3 className={`${TIGHT_GAP} ${SECTION_GAP} font-display text-[17px] font-bold text-brand-dark`}>
        Les 8 critères comparés
      </h3>
      <ul className="flex flex-wrap gap-1.5 text-[13px] text-text">
        {CRITERIA_ORDER.map((c) => (
          <li key={c.key} className="rounded-control bg-bg px-2.5 py-1.5 font-semibold">
            {c.label}
          </li>
        ))}
      </ul>
      <h3 className={`${TIGHT_GAP} ${SECTION_GAP} font-display text-[17px] font-bold text-brand-dark`}>
        Indicateurs de couleur
      </h3>
      <ul className="flex flex-col gap-2.5 text-[14px] text-text">
        <li className="flex items-center gap-3">
          <span className="h-5 w-5 flex-none rounded-control" style={{ background: 'rgba(34,197,94,.35)' }} />
          Vert = Correct
        </li>
        <li className="flex items-center gap-3">
          <span className="h-5 w-5 flex-none rounded-control" style={{ background: 'rgba(225,29,72,.3)' }} />
          Rouge = Incorrect
        </li>
        <li className="flex items-center gap-3">
          <span className="w-5 flex-none text-center text-[16px] font-bold text-brand">↑</span>
          Le personnage du jour est plus récent sur la décennie de sortie
        </li>
        <li className="flex items-center gap-3">
          <span className="w-5 flex-none text-center text-[16px] font-bold text-brand">↓</span>
          Le personnage du jour est plus ancien sur la décennie de sortie
        </li>
      </ul>
      <button
        type="button"
        onClick={closeModals}
        className={`${SECTION_GAP} min-h-[48px] w-full rounded-control bg-brand font-display text-[16px] font-bold text-white`}
      >
        C'est parti
      </button>
    </ModalShell>
  );
}
