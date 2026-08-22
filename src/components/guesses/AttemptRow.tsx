import { AnimatePresence, motion } from 'framer-motion';
import type { GuessEntry } from '../../types/guess';
import { temperatureForScore } from '../../lib/temperature';
import { SearchIcon, TemperatureBandIcon } from '../icons/Icon';
import { AttemptDetail } from './AttemptDetail';
import { CHARACTER_BY_ID } from '../../data/characters';
import { CharacterAvatar } from '../characters/CharacterAvatar';

interface AttemptRowProps {
  guess: GuessEntry;
  isBest: boolean;
  justAdded: boolean;
  selected: boolean;
  analyzed: boolean;
  /** Pas encore analysé, mais un jeton est disponible : invite le joueur à cliquer. */
  analyzable: boolean;
  /** Cet essai est-il réellement le personnage du jour (et pas juste un score de 100 %) ? */
  isTarget: boolean;
  onToggle: () => void;
}

export function AttemptRow({ guess, isBest, justAdded, selected, analyzed, analyzable, isTarget, onToggle }: AttemptRowProps) {
  const t = temperatureForScore(guess.score);
  // Un essai peut marquer 100 % sans être le bon personnage (sosie parfait sur
  // les 8 critères notés) : le badge dirait alors « Trouvé ! » sur un mauvais
  // personnage. Le score reste 100 %, seul le libellé est requalifié.
  const bandLabel = t.label === 'Trouvé !' && !isTarget ? 'Sosie parfait' : t.label;
  const borderWidth = isBest ? 3 : 2;
  const borderColor = isBest ? t.color : '#0B0B16';
  // Ombre dure décalée façon neo-brutalism, composée ici (pas en classe Tailwind)
  // car ce style inline pilote déjà le halo du meilleur essai sur la même propriété.
  const hardShadow = '5px 5px 0 rgb(var(--color-shadow-accent))';
  const boxShadow = isBest ? `0 0 0 3px ${t.bg}, ${hardShadow}` : hardShadow;
  // Léger effet "collage" façon zine : dérivé de manière stable de l'id du personnage
  // (pas de l'index dans la liste) pour ne pas retourner les cartes au fil du tri.
  const tilt = guess.id.charCodeAt(0) % 2 === 0 ? '-0.35deg' : '0.3deg';
  const character = CHARACTER_BY_ID.get(guess.id);

  return (
    // layout="position" (pas `layout` seul) : le tri par score anime le
    // repositionnement des lignes via FLIP, mais un `layout` nu fait aussi
    // interpoler la taille — combiné au scale d'apparition ci-dessous, ça
    // produisait un scale X/Y non uniforme pendant la transition qui
    // déformait les ombres dures (barre de score, badge température, cf.
    // audit ombres neo-brutalism). "position" n'anime que le déplacement.
    <motion.li
      layout="position"
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, rotate: tilt }}
      transition={{ duration: 0.3 }}
      style={{ borderWidth, borderColor, boxShadow }}
      className={`overflow-hidden border bg-surface ${justAdded ? 'motion-safe:animate-amx-flash' : ''}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={selected}
        className="flex w-full items-center gap-2 px-2.5 py-2.5 text-left active:translate-x-[2px] active:translate-y-[2px] sm:gap-3 sm:px-3"
      >
        {character && <CharacterAvatar name={character.nom} src={character.imageUrl} size="md" />}
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate font-display text-[15px] font-bold text-text">{guess.nom}</span>
            {analyzed && <SearchIcon size={12} className="flex-none text-brand-mid" />}
            {analyzable && (
              <SearchIcon size={12} className="flex-none text-brand-mid motion-safe:animate-amx-pulse" />
            )}
          </span>
          <span className="mb-1 flex items-center gap-1 truncate text-[12px] text-muted">
            <span className="truncate">{guess.anime}</span>
            {analyzable && <span className="flex-none font-bold text-brand-mid">· Cliquer pour analyser</span>}
          </span>
          {/* Ombre dure portée par ce span (jamais rogné par son propre
              overflow-hidden, vérifié) mais le clip de la barre animée est
              délégué à un enfant dédié : évite tout risque de rendu
              divergent entre navigateurs sur la combinaison overflow-hidden
              + box-shadow sur un seul et même élément. */}
          <span className="block h-1.5 border border-ink bg-bg shadow-[2px_2px_0_#0B0B16]">
            <span className="block h-full w-full overflow-hidden">
              <motion.span
                className="block h-full"
                style={{ background: t.color }}
                initial={{ width: 0 }}
                animate={{ width: `${guess.score}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </span>
          </span>
        </span>
        <span className="flex min-w-[72px] flex-none flex-col items-end gap-1 sm:min-w-[92px]">
          <span className="font-display text-[19px] font-bold" style={{ color: t.color }}>
            {guess.score} %
          </span>
          <span
            className="flex items-center gap-1 whitespace-nowrap border-2 border-ink px-2 py-0.5 font-display text-[11px] font-bold shadow-[2px_2px_0_#0B0B16] motion-safe:rotate-2"
            style={{ background: t.bg, color: t.fg }}
          >
            <TemperatureBandIcon icon={t.icon} size={11} />
            {bandLabel}
          </span>
        </span>
      </button>
      <AnimatePresence initial={false}>{selected && <AttemptDetail guess={guess} />}</AnimatePresence>
    </motion.li>
  );
}
