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
          isTarget={false}
          onToggle={vi.fn()}
        />
      </ul>,
    );

    expect(container.querySelector('img')).toHaveAttribute('src', character.imageUrl);
  });

  it('requalifie le badge en « Sosie parfait » pour un 100 % qui n’est pas le personnage du jour', () => {
    const character = CHARACTERS[0];
    const guess = { id: character.id, nom: character.nom, anime: character.animeSource, score: 100, details: [], n: 1 };

    const trouve = render(
      <ul>
        <AttemptRow guess={guess} isBest justAdded={false} selected={false} analyzed={false} analyzable={false} isTarget onToggle={vi.fn()} />
      </ul>,
    );
    expect(trouve.container.textContent).toContain('Trouvé !');

    const sosie = render(
      <ul>
        <AttemptRow guess={guess} isBest justAdded={false} selected={false} analyzed={false} analyzable={false} isTarget={false} onToggle={vi.fn()} />
      </ul>,
    );
    expect(sosie.container.textContent).toContain('Sosie parfait');
    expect(sosie.container.textContent).not.toContain('Trouvé !');
  });
});
