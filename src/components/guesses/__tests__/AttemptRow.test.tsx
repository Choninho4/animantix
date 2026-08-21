import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CHARACTERS } from '../../../data/characters';
import { AttemptRow } from '../AttemptRow';

describe('AttemptRow', () => {
  it('affiche le portrait correspondant à l’identifiant de l’essai', () => {
    const character = CHARACTERS[0];
    const { container } = render(
      <ul>
        <AttemptRow
          guess={{ id: character.id, nom: character.nom, anime: character.animeSource, score: 42, details: [], n: 1 }}
          isBest
          justAdded={false}
          selected={false}
          analyzed={false}
          analyzable={false}
          onToggle={vi.fn()}
        />
      </ul>,
    );

    expect(container.querySelector('img')).toHaveAttribute('src', character.imageUrl);
  });
});
