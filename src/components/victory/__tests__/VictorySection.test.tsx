import { afterEach, describe, expect, it } from 'vitest';
import { act, render } from '@testing-library/react';
import { currentTarget, useGameStore } from '../../../store/useGameStore';
import { VictorySection } from '../VictorySection';

afterEach(() => {
  act(() => useGameStore.setState({ won: false, guesses: [] }));
});

describe('VictorySection', () => {
  it('affiche le portrait local du personnage trouvé', () => {
    const target = currentTarget();
    act(() => {
      useGameStore.setState({
        won: true,
        guesses: [{ id: target.id, nom: target.nom, anime: target.animeSource, score: 100, details: [], n: 1 }],
        elapsed: 1_000,
      });
    });

    const { container } = render(<VictorySection />);

    expect(container.querySelector('img')).toHaveAttribute('src', target.imageUrl);
  });
});
