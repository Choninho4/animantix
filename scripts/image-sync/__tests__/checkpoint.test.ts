import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { canReusePortrait, CheckpointStore } from '../checkpoint';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe('CheckpointStore', () => {
  it('reprend avec un état vide si le fichier n’existe pas, puis persiste atomiquement les entrées', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'animantix-checkpoint-'));
    temporaryDirectories.push(directory);
    const store = new CheckpointStore(join(directory, 'checkpoint.json'));

    expect(await store.load()).toEqual({ entries: {} });

    await store.save({ entries: { naruto: { sha256: 'abc', bytes: 123 } } });

    expect(await store.load()).toEqual({ entries: { naruto: { sha256: 'abc', bytes: 123 } } });
  });

  it('invalide un portrait créé avec une ancienne version de recadrage', () => {
    expect(canReusePortrait({ sha256: 'abc', bytes: 123 }, 123, 2, 99)).toBe(false);
    expect(
      canReusePortrait({ sha256: 'abc', bytes: 123, processingVersion: 2, providerCharacterId: 99 }, 123, 2, 99),
    ).toBe(true);
    expect(
      canReusePortrait({ sha256: 'abc', bytes: 123, processingVersion: 2, providerCharacterId: 99 }, 99, 2, 99),
    ).toBe(false);
  });

  it('invalide un portrait si son association MAL a changé', () => {
    expect(
      canReusePortrait({ sha256: 'abc', bytes: 123, processingVersion: 2, providerCharacterId: 99 }, 123, 2, 100),
    ).toBe(false);
  });
});
