import { useGameStore } from '../../store/useGameStore';
import { POIDS, SPECIAL_HINT_THRESHOLD, TOKENS_TOUS_LES } from '../../lib/constants';
import { TEMPERATURE_BANDS, TEMPERATURE_RANGE_LABELS } from '../../lib/temperature';
import { useTheme } from '../../hooks/useTheme';
import { ModalHeader, ModalShell } from './ModalShell';
import { TemperatureBandIcon } from '../icons/Icon';

const WEIGHT_ROWS: Array<{ label: string; points: number }> = [
  { label: 'Même anime', points: POIDS.anime },
  { label: 'Rôle narratif', points: POIDS.role },
  { label: 'Camp moral', points: POIDS.camp },
  { label: 'Race', points: POIDS.race },
  { label: 'Type de pouvoir', points: POIDS.pouvoir },
  { label: 'Décennie de sortie', points: POIDS.decennie },
  { label: 'Genre', points: POIDS.genre },
  { label: 'Couleur de cheveux', points: POIDS.cheveux },
];

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
        (protagoniste principal vs secondaire, camp moral voisin, décennie voisine…). Clique sur un
        essai dans ton tableau de résultats pour voir le détail exact du calcul, critère par critère.
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
      <h3 className={`${TIGHT_GAP} ${SECTION_GAP} font-display text-[17px] font-bold text-brand-dark`}>L'indice spécial</h3>
      <p className="text-[14px] leading-[1.55] text-text">
        Après {SPECIAL_HINT_THRESHOLD} essais soumis dans la partie, un indice spécial se débloque : clique
        dessus pour révéler l'anime d'origine du personnage mystère. C'est un déblocage unique par partie,
        indépendant des jetons d'analyse, et la révélation reste affichée en permanence une fois faite.
      </p>
      <h3 className={`${TIGHT_GAP} ${SECTION_GAP} font-display text-[17px] font-bold text-brand-dark`}>Les jetons d'analyse</h3>
      <p className="text-[14px] leading-[1.55] text-text">
        Tu gagnes un jeton d'analyse tous les {TOKENS_TOUS_LES} essais, et ils s'accumulent sans limite.
        Clique sur un essai de ton choix dans le tableau pour dépenser un jeton et révéler son détail
        critère par critère. Une fois révélé, le détail reste consultable gratuitement pour le reste de la
        partie — pas besoin de redépenser un jeton pour le revoir.
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
