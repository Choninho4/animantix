import type { Character } from '../../types/character';
import { SuggestionItem } from './SuggestionItem';

interface SuggestionListProps {
  suggestions: Character[];
  activeIndex: number;
  triedIds: Set<string>;
  onPick: (character: Character) => void;
  onHover: (index: number) => void;
}

export function SuggestionList({ suggestions, activeIndex, triedIds, onPick, onHover }: SuggestionListProps) {
  return (
    <ul
      id="amx-suggestions"
      role="listbox"
      className="absolute left-0 right-0 top-[58px] z-50 max-h-80 overflow-y-auto rounded-card border border-border bg-surface p-1.5 shadow-dropdown"
    >
      {suggestions.map((s, i) => (
        <SuggestionItem
          key={s.id}
          character={s}
          active={i === activeIndex}
          alreadyTried={triedIds.has(s.id)}
          onPick={() => onPick(s)}
          onHover={() => onHover(i)}
        />
      ))}
    </ul>
  );
}
