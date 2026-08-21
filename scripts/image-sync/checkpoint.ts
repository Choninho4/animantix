import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export interface CheckpointEntry {
  sha256: string;
  bytes: number;
  processingVersion?: number;
  [key: string]: unknown;
}

export function canReusePortrait(
  entry: CheckpointEntry,
  fileSize: number,
  processingVersion: number,
  providerCharacterId: number,
): boolean {
  return (
    entry.bytes === fileSize &&
    entry.processingVersion === processingVersion &&
    entry.providerCharacterId === providerCharacterId
  );
}

export interface Checkpoint {
  entries: Record<string, CheckpointEntry>;
}

export class CheckpointStore {
  constructor(private readonly path: string) {}

  async load(): Promise<Checkpoint> {
    try {
      return JSON.parse(await readFile(this.path, 'utf8')) as Checkpoint;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { entries: {} };
      throw error;
    }
  }

  async save(checkpoint: Checkpoint): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });
    const temporaryPath = `${this.path}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(checkpoint, null, 2)}\n`, 'utf8');
    await rename(temporaryPath, this.path);
  }
}
