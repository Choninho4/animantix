import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import sharp from 'sharp';

export interface PortraitResult {
  bytes: number;
  sha256: string;
}

export const PORTRAIT_PROCESSING_VERSION = 3;

const FOREGROUND_WIDTH = 218;
const HORIZONTAL_INSET = (256 - FOREGROUND_WIDTH) / 2;

export async function convertPortrait(source: Buffer, outputPath: string): Promise<PortraitResult> {
  const background = await sharp(source)
    .resize(256, 256, { fit: 'cover', position: 'top' })
    .blur(14)
    .modulate({ brightness: 0.72, saturation: 0.8 })
    .toBuffer();
  const resizedForeground = await sharp(source)
    .resize({ width: FOREGROUND_WIDTH })
    .toBuffer({ resolveWithObject: true });
  const foregroundHeight = Math.min(resizedForeground.info.height, 256);
  const foreground =
    resizedForeground.info.height > 256
      ? await sharp(resizedForeground.data)
          .extract({ left: 0, top: 0, width: FOREGROUND_WIDTH, height: foregroundHeight })
          .toBuffer()
      : resizedForeground.data;
  const foregroundTop = Math.max(0, Math.floor((256 - foregroundHeight) / 2));

  const output = await sharp(background)
    .composite([{ input: foreground, left: HORIZONTAL_INSET, top: foregroundTop }])
    .webp({ quality: 82 })
    .toBuffer();

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output);

  return {
    bytes: output.byteLength,
    sha256: createHash('sha256').update(output).digest('hex'),
  };
}
