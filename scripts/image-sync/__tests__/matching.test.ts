import { describe, expect, it } from 'vitest';
import { canonicalName, matchCharacter, nameVariants } from '../matching';

describe('canonicalName', () => {
  it('normalise accents, ponctuation et espaces', () => {
    expect(canonicalName('  Monkey D.  Luffy! ')).toBe('monkey d luffy');
    expect(canonicalName('Éren Jäger')).toBe('eren jager');
  });
});

describe('nameVariants', () => {
  it('accepte la présentation Jikan « Nom, Prénom »', () => {
    expect(nameVariants('Uzumaki, Naruto')).toContain('naruto uzumaki');
  });
});

describe('matchCharacter', () => {
  const image = 'https://cdn.example/portrait.jpg';

  it('associe uniquement une correspondance canonique unique', () => {
    const result = matchCharacter('Naruto Uzumaki', [
      { malId: 17, name: 'Uzumaki, Naruto', imageUrl: image },
      { malId: 18, name: 'Uchiha, Sasuke', imageUrl: image },
    ]);

    expect(result).toEqual({
      status: 'matched',
      character: { malId: 17, name: 'Uzumaki, Naruto', imageUrl: image },
    });
  });

  it('refuse une correspondance ambiguë', () => {
    const result = matchCharacter('Saber', [
      { malId: 1, name: 'Saber', imageUrl: image },
      { malId: 2, name: 'Saber', imageUrl: image },
    ]);

    expect(result.status).toBe('ambiguous');
  });

  it('ne fait pas de rapprochement flou', () => {
    const result = matchCharacter('Roronoa Zoro', [
      { malId: 1, name: 'Zoro', imageUrl: image },
    ]);

    expect(result).toEqual({ status: 'unmatched' });
  });
});
