import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CharacterAvatar } from '../CharacterAvatar';

describe('CharacterAvatar', () => {
  it('rend le portrait local comme image décorative', () => {
    const { container } = render(
      <CharacterAvatar name="Monkey D. Luffy" src="/assets/characters/monkey-d-luffy.webp" size="sm" />,
    );

    const image = container.querySelector('img');
    expect(image).toHaveAttribute('src', '/assets/characters/monkey-d-luffy.webp');
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('remplace une image illisible par les initiales sans icône cassée', () => {
    const { container } = render(<CharacterAvatar name="Monkey D. Luffy" src="/missing.webp" size="md" />);

    fireEvent.error(container.querySelector('img')!);

    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByText('MD')).toBeInTheDocument();
  });
});
