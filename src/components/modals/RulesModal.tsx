import { useGameStore } from '../../store/useGameStore';
import { POIDS, INDICE_TOUS_LES } from '../../lib/constants';
import { TEMPERATURE_BANDS, TEMPERATURE_RANGE_LABELS } from '../../lib/temperature';
import { useTheme } from '../../hooks/useTheme';
import { ModalHeader, ModalShell } from './ModalShell';
import { TemperatureBandIcon } from '../icons/Icon';

const WEIGHT_ROWS: Array<{ label: string; points: number }> = [
  { label: 'Même anime', points: POIDS.anime },
  { label: 'Rôle narratif', points: POIDS.role },
  { label: 'Camp moral', points: POIDS.camp },
  { label: "Tranche d'âge", points: POIDS.age },
  { label: 'Race', points: POIDS.race },
  { label: 'Type de pouvoir', points: POIDS.pouvoir },
  { label: 'Genre', points: POIDS.genre },
  { label: 'Décennie de sortie', points: POIDS.decennie },
  { label: 'Couleur de cheveux', points: POIDS.cheveux },
];

const HINT_ORDER_TEXT =
  "la race, le genre, la première lettre du nom, la couleur de cheveux, puis l'anime d'origine";

// Rythme d'espacement réutilisable : SECTION_GAP sépare deux sections
// distinctes (ex. avant un titre h3), TIGHT_GAP garde un titre collé au
// contenu qui lui appartient directement (ex. titre + paragraphe associé).
const SECTION_GAP = 'mt-8';
const TIGHT_GAP = 'mb-2';

export function RulesModal() {
  const closeModals = useGameStore((s) => s.closeModals);
  const { theme } = useTheme();

  return (
    <ModalShell label="Règles du jeu" onClose={closeModals}>
      <ModalHeader title="Comment jouer" onClose={closeModals} />
      <p className="mb-3.5 text-[15px] leading-[1.6] text-text">
        Chaque jour, tout le monde doit deviner le même personnage d'anime mystère.
        Propose d'autres personnages : chaque essai reçoit un score de proximité de 0 à 100 %.
        Plus la proposition ressemble au personnage du jour, plus le score monte. Essais illimités.
      </p>
      <h3 className={`${TIGHT_GAP} ${SECTION_GAP} font-display text-[17px] font-bold text-brand-dark`}>Le calcul du score</h3>
      <p className="mb-2.5 text-[14px] leading-[1.55] text-text">
        Le score final est un pourcentage de 0 à 100 %. Il additionne la contribution de chaque
        critère ci-dessous : plus ta proposition correspond au personnage du jour sur un critère,
        plus tu gagnes le pourcentage associé à ce critère.
      </p>
      <ul className="flex flex-col gap-1.5 text-[14px] text-text">
        {WEIGHT_ROWS.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-3 rounded-control bg-bg px-2.5 py-1.5">
            <span>{row.label}</span>
            <strong className="text-brand">jusqu'à {row.points} %</strong>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 text-[13px] leading-[1.5] text-muted">
        Certains critères donnent des points partiels quand les catégories sont proches
        (protagoniste principal vs secondaire, ado vs jeune adulte, décennie voisine…).
      </p>
      <h3 className={`${TIGHT_GAP} ${SECTION_GAP} font-display text-[17px] font-bold text-brand-dark`}>La légende des températures</h3>
      <ul className="flex flex-col gap-1.5 text-[14px]">
        {TEMPERATURE_BANDS.map((band) => (
          <li key={band.min} className="flex items-center gap-2.5">
            <span className="w-14 font-bold text-muted">{TEMPERATURE_RANGE_LABELS[band.min]}</span>
            <span
              className="flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-[11px] font-bold"
              style={{ background: band.bg, color: theme === 'dark' ? band.fgDark : band.fg }}
            >
              <TemperatureBandIcon icon={band.icon} size={12} />
              {band.label}
            </span>
          </li>
        ))}
      </ul>
      <h3 className={`${TIGHT_GAP} ${SECTION_GAP} font-display text-[17px] font-bold text-brand-dark`}>Les indices</h3>
      <p className="text-[14px] leading-[1.55] text-text">
        Un indice se débloque tous les {INDICE_TOUS_LES} essais, dans cet ordre : {HINT_ORDER_TEXT}.
        Ils restent masqués tant que tu ne cliques pas sur « Révéler un indice ».
      </p>
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
