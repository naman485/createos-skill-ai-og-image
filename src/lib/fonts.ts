import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface FontData {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700 | 800;
  style: 'normal';
}

let fontsCache: FontData[] | null = null;

export async function loadFonts(): Promise<FontData[]> {
  if (fontsCache) {
    return fontsCache;
  }

  // When running from dist/lib, go up to project root then into src/fonts
  const fontsDir = path.join(__dirname, '..', '..', 'src', 'fonts');

  const fontFiles = [
    { file: 'Inter-Regular.otf', weight: 400 as const },
    { file: 'Inter-Bold.otf', weight: 700 as const },
    { file: 'Inter-ExtraBold.otf', weight: 800 as const }
  ];

  const fonts: FontData[] = [];

  for (const { file, weight } of fontFiles) {
    const fontPath = path.join(fontsDir, file);

    if (!fs.existsSync(fontPath)) {
      throw new Error(
        `Font file not found: ${file}. Run "npm run setup:fonts" to download fonts.`
      );
    }

    const buffer = fs.readFileSync(fontPath);
    fonts.push({
      name: 'Inter',
      data: buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      ) as ArrayBuffer,
      weight,
      style: 'normal'
    });
  }

  fontsCache = fonts;
  console.log('✓ Fonts loaded and cached');

  return fonts;
}

export function getFonts(): FontData[] {
  if (!fontsCache) {
    throw new Error('Fonts not loaded. Call loadFonts() first.');
  }
  return fontsCache;
}
