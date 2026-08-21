import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { CHARACTERS } from '../../../src/data/characters';

const portraitDirectory = join(process.cwd(), 'public', 'assets', 'characters');

describe('catalogue local de portraits', () => {
  it('conserve les 790 personnages et une URL locale unique pour chacun', () => {
    expect(CHARACTERS).toHaveLength(790);
    const imageUrls = CHARACTERS.map((character) => character.imageUrl);
    expect(new Set(imageUrls)).toHaveLength(790);
    for (const character of CHARACTERS) {
      expect(character.imageUrl).toBe(`/assets/characters/${character.id}.webp`);
    }
  });

  it('contient exactement 790 WebP lisibles, non vides et carrés en 256 px', async () => {
    const files = (await readdir(portraitDirectory)).filter((file) => file.endsWith('.webp')).sort();
    expect(files).toHaveLength(790);
    expect(files).toEqual(CHARACTERS.map(({ id }) => `${id}.webp`).sort());

    for (const file of files) {
      const path = join(portraitDirectory, file);
      expect((await stat(path)).size).toBeGreaterThan(0);
      const metadata = await sharp(path).metadata();
      expect(metadata.format).toBe('webp');
      expect(metadata.width).toBe(256);
      expect(metadata.height).toBe(256);
    }
  }, 60_000);
});
