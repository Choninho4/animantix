import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CHARACTERS } from '../../../data/characters';
import { SuggestionItem } from '../SuggestionItem';

describe('SuggestionItem', () => {
  it('affiche le portrait du personnage dans la suggestion', () => {
    const character = CHARACTERS[0];
    const { container } = render(
      <ul>
        <SuggestionItem
          character={character}
          active={false}
          alreadyTried={false}
          onPick={vi.fn()}
          onHover={vi.fn()}
        />
      </ul>,
    );

    expect(container.querySelector('img')).toHaveAttribute('src', character.imageUrl);
  });
});
