import type { Character } from '../../types/character';
import { CharacterAvatar } from '../characters/CharacterAvatar';

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
      className={`flex min-h-touch cursor-pointer items-center gap-2.5 border-b-2 border-ink px-2.5 py-2 last:border-b-0 ${
        active ? 'bg-brand text-white' : 'bg-transparent'
      }`}
    >
      <CharacterAvatar name={character.nom} src={character.imageUrl} size="sm" />
      <span className="min-w-0 flex-1">
        <span className={`block truncate font-display text-[15px] font-bold ${active ? 'text-white' : 'text-text'}`}>
          {character.nom}
        </span>
        <span className={`block truncate text-[12px] ${active ? 'text-white/80' : 'text-muted'}`}>
          {character.animeSource}
        </span>
      </span>
      {alreadyTried && (
        <span className={`flex-none font-mono text-[10px] font-bold uppercase ${active ? 'text-white/80' : 'text-muted'}`}>
          déjà essayé
        </span>
      )}
    </li>
  );
}
