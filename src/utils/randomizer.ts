import { QRConfig, DotType, CornerSquareType, CornerDotType } from '../types';
import { COLOR_PALETTES } from './presets';
import { getContrastDetails } from './scanability';

const DOT_TYPES: DotType[] = ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'];
const CORNER_SQUARE_TYPES: CornerSquareType[] = ['extra-rounded', 'rounded', 'square', 'dot'];
const CORNER_DOT_TYPES: CornerDotType[] = ['dot', 'rounded', 'square'];

const SURPRISE_FRAMES = [
  { id: 'none', label: 'No Frame' },
  { id: 'simple-border', label: 'SCAN ME' },
  { id: 'card-scan', label: 'SCAN HERE' },
  { id: 'polaroid', label: 'DISCOVER' },
  { id: 'pill-top', label: 'OPEN LINK' },
];

/**
 * Generates a tasteful, high-contrast randomized style configuration
 */
export function generateSurpriseStyle(currentConfig: QRConfig): Partial<QRConfig> {
  // Pick a random curated palette
  const randomPalette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
  
  // Decide whether to use gradient (50% chance)
  const useGradient = Math.random() > 0.45 && randomPalette.gradient.length > 1;

  // Pick dot and corner geometries
  const dotType = DOT_TYPES[Math.floor(Math.random() * DOT_TYPES.length)];
  const cornerSquareType = CORNER_SQUARE_TYPES[Math.floor(Math.random() * CORNER_SQUARE_TYPES.length)];
  const cornerDotType = CORNER_DOT_TYPES[Math.floor(Math.random() * CORNER_DOT_TYPES.length)];

  // Pick random frame (40% chance of a clean frame)
  const pickFrame = Math.random() > 0.6;
  const frameChoice = pickFrame 
    ? SURPRISE_FRAMES[Math.floor(Math.random() * (SURPRISE_FRAMES.length - 1)) + 1]
    : SURPRISE_FRAMES[0];

  // Verify contrast
  const contrast = getContrastDetails(randomPalette.fg, randomPalette.bg);
  const fg = contrast.ratio >= 4.0 ? randomPalette.fg : '#0f172a';
  const bg = contrast.ratio >= 4.0 ? randomPalette.bg : '#ffffff';

  return {
    foregroundColor: fg,
    backgroundColor: bg,
    transparentBackground: false,
    useGradient,
    gradient: {
      type: Math.random() > 0.5 ? 'linear' : 'radial',
      rotation: [0, 45, 90, 135][Math.floor(Math.random() * 4)],
      colorStops: [
        { offset: 0, color: randomPalette.gradient[0] || fg },
        { offset: 1, color: randomPalette.gradient[1] || fg },
      ],
    },
    dotType,
    cornerSquareType,
    cornerDotType,
    customCornerColors: false,
    frame: {
      ...currentConfig.frame,
      style: frameChoice.id as any,
      labelText: frameChoice.label,
      frameColor: fg,
      bgColor: bg,
      textColor: '#ffffff',
    },
  };
}

/**
 * Returns a full updated QRConfig with surprise styling applied
 */
export function generateRandomSurpriseStyle(currentConfig: QRConfig): QRConfig {
  const partial = generateSurpriseStyle(currentConfig);
  return {
    ...currentConfig,
    ...partial,
    frame: {
      ...(currentConfig.frame || {}),
      ...(partial.frame || {}),
    } as any,
    gradient: {
      ...(currentConfig.gradient || {}),
      ...(partial.gradient || {}),
    } as any,
  };
}
