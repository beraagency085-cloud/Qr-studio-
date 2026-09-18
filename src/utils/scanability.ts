import { QRConfig, DotType } from '../types';

/**
 * Calculates relative luminance for a hex color (#ffffff, #000000)
 */
function getLuminance(hexColor: string): number {
  const cleanHex = hexColor.replace('#', '');
  let r = 0,
    g = 0,
    b = 0;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
    g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
    b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
  } else if (cleanHex.length >= 6) {
    r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  }

  const sRGB = [r, g, b].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Calculate WCAG contrast ratio between two hex colors (e.g. 1.0 to 21.0)
 */
export function getContrastRatio(fgHex: string, bgHex: string): number {
  try {
    const lum1 = getLuminance(fgHex);
    const lum2 = getLuminance(bgHex);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch {
    return 4.5;
  }
}

export interface ContrastInfo {
  ratio: number;
  rating: 'optimal' | 'good' | 'fair' | 'critical';
  isGood: boolean;
  isDarkOnLight: boolean;
  message: string;
}

export function getContrastDetails(fgHex: string, bgHex: string): ContrastInfo {
  const ratioVal = getContrastRatio(fgHex, bgHex);
  const ratio = Math.round(ratioVal * 10) / 10;
  let rating: 'optimal' | 'good' | 'fair' | 'critical' = 'critical';
  if (ratio >= 7.0) rating = 'optimal';
  else if (ratio >= 4.5) rating = 'good';
  else if (ratio >= 3.0) rating = 'fair';

  const lumFg = getLuminance(fgHex);
  const lumBg = getLuminance(bgHex);
  const isDarkOnLight = lumFg < lumBg;

  let message = 'Excellent contrast (> 7:1). Instant camera focus.';
  if (rating === 'good') message = 'Good contrast (> 4.5:1). Passes ISO standards.';
  else if (rating === 'fair') message = 'Moderate contrast (3:1 - 4.5:1). May struggle in dim lighting.';
  else message = 'Poor contrast (< 3:1). Scanners will fail or delay.';

  return {
    ratio,
    rating,
    isGood: ratio >= 4.5,
    isDarkOnLight,
    message,
  };
}

export interface ScanabilityDiagnostic {
  score: number; // 0 to 100
  rating: 'Optimal' | 'Good' | 'Moderate' | 'Risk';
  summary: string;
  dotTypeAnalysis: {
    name: string;
    compatibility: number; // percentage
    explanation: string;
    recommendation: string;
  };
  errorCorrectionAnalysis: {
    level: 'L' | 'M' | 'Q' | 'H';
    recoveryPercent: string;
    isOptimalForLogo: boolean;
    explanation: string;
    actionableTip: string;
  };
  contrastAnalysis: {
    ratio: number;
    isGood: boolean;
    isDarkOnLight: boolean;
    message: string;
  };
  marginAnalysis: {
    margin: number;
    isAdequate: boolean;
    message: string;
  };
  logoAnalysis?: {
    hasLogo: boolean;
    sizeRatio: number;
    isSafeSize: boolean;
    hasClearDots: boolean;
    message: string;
  };
}

export const MODULE_STYLE_INFO: Record<
  DotType,
  {
    name: string;
    ratingText: string;
    compatibility: number;
    shortDesc: string;
    detailedScanImpact: string;
    bestUsedFor: string;
  }
> = {
  square: {
    name: 'Standard Square',
    ratingText: '100% Universal Compatibility',
    compatibility: 100,
    shortDesc: 'The original QR specification. Sharpest contrast, instant read on all hardware.',
    detailedScanImpact:
      'Standard square modules provide the sharpest edges for camera sensor algorithms. Every camera app, handheld supermarket scanner, and budget Android smartphone will read this instantly.',
    bestUsedFor: 'Billboards, fast-moving transit, packaging, and universal accessibility.',
  },
  rounded: {
    name: 'Rounded Corners',
    ratingText: '96% High Compatibility',
    compatibility: 96,
    shortDesc: 'Slightly smoothed corners. Modern aesthetic with near-perfect scannability.',
    detailedScanImpact:
      'Corners are gently rounded while keeping 85%+ of the pixel area intact. Modern smartphone cameras perceive this almost identically to squares.',
    bestUsedFor: 'Brand websites, posters, marketing cards, and restaurant table tents.',
  },
  'extra-rounded': {
    name: 'Pill / Smooth Flow',
    ratingText: '95% High Compatibility',
    compatibility: 95,
    shortDesc: 'Continuous pill-shaped nodes with organic connecting curves.',
    detailedScanImpact:
      'Adjacent modules blend together into smooth continuous streams. Reads cleanly on high-res screens and sharp printings.',
    bestUsedFor: 'Tech startups, digital wallet cards, and modern UI designs.',
  },
  dots: {
    name: 'Circular Dots',
    ratingText: '92% Modern Smartphone Compatible',
    compatibility: 92,
    shortDesc: 'Freestanding circular matrix dots with playful, clean negative space.',
    detailedScanImpact:
      'Because circles leave more empty white space around each dot, cameras require slightly higher optical contrast. Best when printed at least 1 x 1 inch (2.5 cm).',
    bestUsedFor: 'Creative agencies, invitations, badges, and high-DPI displays.',
  },
  classy: {
    name: 'Classy Architectural',
    ratingText: '90% High Contrast Required',
    compatibility: 90,
    shortDesc: 'Custom curved corners that create a sophisticated diamond-square rhythm.',
    detailedScanImpact:
      'Gives a bespoke, luxury feel. Keep colors high-contrast (e.g. black or deep navy on pure white) to ensure optical scanners lock on quickly.',
    bestUsedFor: 'Luxury retail, fashion branding, high-end portfolios, and galas.',
  },
  'classy-rounded': {
    name: 'Diamond Curves',
    ratingText: '88% Best with Strong Contrast',
    compatibility: 88,
    shortDesc: 'Artistic teardrop and diamond geometry with distinct visual flair.',
    detailedScanImpact:
      'Sculpted organic nodes. Requires adequate quiet zone margin so scanner edge-detection is not confused.',
    bestUsedFor: 'Event tickets, design showcases, and premium invitations.',
  },
};

export const ERROR_CORRECTION_EXPLANATIONS: Record<
  'L' | 'M' | 'Q' | 'H',
  {
    name: string;
    recovery: string;
    headline: string;
    simpleExplanation: string;
    whenToUse: string;
    logoFriendly: boolean;
  }
> = {
  L: {
    name: 'Level L (Low)',
    recovery: '~7% Data Recovery',
    headline: 'Smallest Dot Size • Zero Redundancy',
    simpleExplanation:
      'Stores minimal backup copies of data. Creates the cleanest, least-crowded grid of dots, but cannot tolerate any damage or covered areas.',
    whenToUse: 'Clean digital screens, super-dense text payloads, or when NO logo is used.',
    logoFriendly: false,
  },
  M: {
    name: 'Level M (Medium)',
    recovery: '~15% Data Recovery',
    headline: 'Standard Industry Default • Balanced',
    simpleExplanation:
      'The worldwide default setting for 90% of QR codes. Reconstructs data even if 15% of the code is smudged, creased, or partially obstructed.',
    whenToUse: 'General website links, Wi-Fi stickers, restaurant menus, and brochures.',
    logoFriendly: false,
  },
  Q: {
    name: 'Level Q (Quartile)',
    recovery: '~25% Data Recovery',
    headline: 'High Durability • Outdoor & Print Grade',
    simpleExplanation:
      'One quarter of the code can be obliterated and cameras will still read the message perfectly. Excellent for print materials subjected to daily wear.',
    whenToUse: 'Curved cups, flyers, business cards, luggage tags, and smaller logos.',
    logoFriendly: true,
  },
  H: {
    name: 'Level H (High)',
    recovery: '~30% Data Recovery',
    headline: 'Maximum Protection • Mandatory for Logos',
    simpleExplanation:
      'Nearly one third (30%) of the code can be destroyed, wrinkled, or covered by a custom brand logo, and smartphone cameras will still instantly scan it!',
    whenToUse: 'Any QR code featuring a centered company logo, icon, or outdoor signage.',
    logoFriendly: true,
  },
};

export function analyzeQRScanability(config: QRConfig, payload: string): ScanabilityDiagnostic {
  let score = 98;

  // 1. Module Dot Type compatibility
  const dotInfo = MODULE_STYLE_INFO[config.dotType] || MODULE_STYLE_INFO.square;
  if (config.dotType === 'dots' || config.dotType === 'classy-rounded') {
    score -= 4;
  } else if (config.dotType === 'classy') {
    score -= 3;
  }

  // 2. Error Correction vs Logo Check
  const ec = config.errorCorrectionLevel || 'M';
  const hasLogo = config.hasLogo && !!config.logo?.image;
  const isOptimalForLogo = hasLogo ? ec === 'H' : true;

  if (hasLogo && ec === 'L') {
    score -= 22; // Serious scan risk!
  } else if (hasLogo && ec === 'M') {
    score -= 12; // Moderate risk with logo
  } else if (hasLogo && ec === 'Q') {
    score -= 4;
  }

  // 3. Contrast check
  const fg = config.foregroundColor || '#000000';
  const bg = config.transparentBackground ? '#ffffff' : config.backgroundColor || '#ffffff';
  const contrastRatio = getContrastRatio(fg, bg);
  const isDarkOnLight = getLuminance(fg) < getLuminance(bg);

  if (contrastRatio < 2.5) {
    score -= 25; // Severe contrast issue
  } else if (contrastRatio < 4.0) {
    score -= 12;
  } else if (contrastRatio < 5.5) {
    score -= 5;
  }

  // Inverted colors (light code on dark background) works on modern phones but slightly slower on budget cameras
  if (!isDarkOnLight && !config.transparentBackground) {
    score -= 3;
  }

  // 4. Quiet Zone / Margin check
  const margin = config.margin ?? 4;
  if (margin === 0) {
    score -= 8;
  } else if (margin < 2) {
    score -= 4;
  }

  // 5. Payload density
  if (payload.length > 300) {
    score -= 6;
  }

  // 6. Logo size check
  let isSafeSize = true;
  if (hasLogo) {
    const size = config.logo?.size ?? 0.28;
    if (size > 0.38) {
      score -= 10;
      isSafeSize = false;
    }
  }

  // 7. 3D Tilt or excessive effects
  if (config.effect3D?.enabled && config.effect3D?.style === 'neon') {
    score -= 3;
  }

  const finalScore = Math.max(45, Math.min(100, Math.round(score)));

  let rating: 'Optimal' | 'Good' | 'Moderate' | 'Risk' = 'Optimal';
  let summary = 'Your design will scan instantly across all devices and camera apps.';

  if (finalScore < 70) {
    rating = 'Risk';
    summary = 'Low scanability detected. Camera scanners may fail under dim lighting or on older phones.';
  } else if (finalScore < 82) {
    rating = 'Moderate';
    summary = 'Moderate readability. Recommended to optimize contrast or error correction.';
  } else if (finalScore < 92) {
    rating = 'Good';
    summary = 'Great balance of custom style and reliable camera recognition.';
  }

  return {
    score: finalScore,
    rating,
    summary,
    dotTypeAnalysis: {
      name: dotInfo.name,
      compatibility: dotInfo.compatibility,
      explanation: dotInfo.detailedScanImpact,
      recommendation: dotInfo.bestUsedFor,
    },
    errorCorrectionAnalysis: {
      level: ec,
      recoveryPercent: ERROR_CORRECTION_EXPLANATIONS[ec].recovery,
      isOptimalForLogo,
      explanation: ERROR_CORRECTION_EXPLANATIONS[ec].simpleExplanation,
      actionableTip: hasLogo && ec !== 'H'
        ? 'Your logo covers active data dots! Switch to Level H (30% recovery) so scanners can read around the logo.'
        : 'Level ' + ec + ' provides adequate data backup for your current layout.',
    },
    contrastAnalysis: {
      ratio: Math.round(contrastRatio * 10) / 10,
      isGood: contrastRatio >= 4.5,
      isDarkOnLight,
      message:
        contrastRatio >= 7.0
          ? 'Exceptional contrast. Cameras will lock on instantly in bright sunlight or dim rooms.'
          : contrastRatio >= 4.5
          ? 'Good contrast. Meets standard legibility thresholds.'
          : 'Low contrast! Cameras require distinct separation between dots and background.',
    },
    marginAnalysis: {
      margin,
      isAdequate: margin >= 2,
      message:
        margin >= 4
          ? 'Generous quiet zone border ensures camera sensors can isolate the code.'
          : margin >= 2
          ? 'Sufficient border margin for clean print and web display.'
          : 'Zero or tiny quiet zone! Add at least 2-4px so cameras do not confuse surrounding borders with QR data.',
    },
    logoAnalysis: hasLogo
      ? {
          hasLogo: true,
          sizeRatio: config.logo?.size ?? 0.28,
          isSafeSize,
          hasClearDots: config.logo?.hideBackgroundDots !== false,
          message: isSafeSize
            ? 'Logo is within safe dimensions (covers less than 35% of center code area).'
            : 'Logo is oversized and covers too many data modules. Reduce size to 30% or less.',
        }
      : undefined,
  };
}
