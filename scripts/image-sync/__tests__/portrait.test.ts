import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';
import { convertPortrait } from '../portrait';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe('convertPortrait', () => {
  it('produit un WebP carré 256×256 avec une empreinte SHA-256', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'animantix-portrait-'));
    temporaryDirectories.push(directory);
    const outputPath = join(directory, 'portrait.webp');
    const source = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="400"><rect width="200" height="400" fill="#d02886"/></svg>',
    );

    const result = await convertPortrait(source, outputPath);
    const metadata = await sharp(await readFile(outputPath)).metadata();

    expect(metadata).toMatchObject({ format: 'webp', width: 256, height: 256 });
    expect(result.bytes).toBeGreaterThan(0);
    expect(result.sha256).toMatch(/^[a-f0-9]{64}$/);
  });

  it('préserve le haut d’un portrait vertical même si le bas contient davantage de détails', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'animantix-portrait-top-'));
    temporaryDirectories.push(directory);
    const outputPath = join(directory, 'portrait.webp');
    const stripes = Array.from(
      { length: 25 },
      (_, index) => `<rect x="${index * 9}" y="225" width="5" height="125" fill="${index % 2 ? '#fff' : '#000'}"/>`,
    ).join('');
    const source = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="225" height="350">` +
        '<rect width="225" height="350" fill="#2448d8"/>' +
        '<rect width="225" height="24" fill="#20e070"/>' +
        stripes +
        '</svg>',
    );

    await convertPortrait(source, outputPath);
    const { data, info } = await sharp(await readFile(outputPath)).raw().toBuffer({ resolveWithObject: true });
    const topCenter = (Math.floor(info.width / 2) * info.channels);

    expect(data[topCenter + 1]).toBeGreaterThan(150);
  });

  it('laisse une marge latérale autour des portraits verticaux pour éviter les visages trop zoomés', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'animantix-portrait-inset-'));
    temporaryDirectories.push(directory);
    const outputPath = join(directory, 'portrait.webp');
    const source = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="225" height="350">' +
        '<rect width="225" height="350" fill="#2030d0"/>' +
        '<rect width="8" height="350" fill="#20e070"/>' +
        '<rect x="217" width="8" height="350" fill="#20e070"/>' +
        '</svg>',
    );

    await convertPortrait(source, outputPath);
    const { data, info } = await sharp(await readFile(outputPath)).raw().toBuffer({ resolveWithObject: true });
    const pixel = (x: number, y: number, channel: number) => data[(y * info.width + x) * info.channels + channel];

    expect(pixel(19, 100, 1)).toBeGreaterThan(150);
    expect(pixel(236, 100, 1)).toBeGreaterThan(150);
    expect(pixel(0, 100, 1)).toBeLessThan(130);
    expect(pixel(255, 100, 1)).toBeLessThan(130);
  });
});
