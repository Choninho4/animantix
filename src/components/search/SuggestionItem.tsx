import type { Character } from '../../types/character';

interface SuggestionItemProps {
  character: Character;
  active: boolean;
  alreadyTried: boolean;
  onPick: () => void;
  onHover: () => void;
}

export function SuggestionItem({ character, active, alreadyTried, onPick, onHover }: SuggestionItemProps) {
  return (
    <li
      role="option"
      aria-selected={active}
      onMouseDown={onPick}
      onMouseEnter={onHover}
      className={`flex min-h-touch cursor-pointer items-center gap-2.5 rounded-control px-2.5 py-2 ${
        active ? 'bg-bg' : 'bg-transparent'
      }`}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-[14px] text-text">{character.nom}</span>
        <span className="block truncate text-[12px] text-muted">{character.animeSource}</span>
      </span>
      {alreadyTried && <span className="flex-none text-[11px] font-bold text-muted">déjà essayé</span>}
    </li>
  );
}
