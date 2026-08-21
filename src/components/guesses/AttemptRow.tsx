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
  onToggle: () => void;
}

export function AttemptRow({ guess, isBest, justAdded, selected, analyzed, analyzable, onToggle }: AttemptRowProps) {
  const t = temperatureForScore(guess.score);
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
    <motion.li
      layout
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
          <span className="block h-1.5 overflow-hidden border border-ink bg-bg shadow-[2px_2px_0_#0B0B16]">
            <motion.span
              className="block h-full"
              style={{ background: t.color }}
              initial={{ width: 0 }}
              animate={{ width: `${guess.score}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
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
            {t.label}
          </span>
        </span>
      </button>
      <AnimatePresence initial={false}>{selected && <AttemptDetail guess={guess} />}</AnimatePresence>
    </motion.li>
  );
}
