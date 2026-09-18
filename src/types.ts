export type ContentType =
  | 'url'
  | 'text'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'wifi'
  | 'vcard'
  | 'location'
  | 'event'
  | 'social'
  | 'crypto';

export type DotType =
  | 'square'
  | 'dots'
  | 'rounded'
  | 'classy'
  | 'classy-rounded'
  | 'extra-rounded';

export type CornerSquareType = 'square' | 'dot' | 'extra-rounded' | 'rounded';

export type CornerDotType = 'square' | 'dot' | 'rounded';

export type GradientType = 'linear' | 'radial';

export interface GradientConfig {
  type: GradientType;
  rotation: number;
  colorStops: { offset: number; color: string }[];
}

export type LogoBackgroundShape = 'circle' | 'rounded-square' | 'square' | 'none';

export interface LogoOptions {
  image: string; // Data URL or SVG string or URL
  name?: string;
  size: number; // 0.1 to 0.45, default 0.3
  margin: number; // 0 to 20px
  backgroundShape: LogoBackgroundShape;
  backgroundColor: string; // e.g. '#ffffff'
  opacity: number; // 0.1 to 1.0
  roundCorners: boolean;
  offsetX: number; // -50 to 50
  offsetY: number; // -50 to 50
  hideBackgroundDots: boolean;
}

export type Effect3DStyle = 'soft3d' | 'raised' | 'glass' | 'neon' | 'none';

export interface VisualEffect3D {
  enabled: boolean;
  style: Effect3DStyle;
  floating: boolean;
  tiltAngleX: number;
  tiltAngleY: number;
}

export type FrameStyle =
  | 'none'
  | 'simple-border'
  | 'double-border'
  | 'card-scan'
  | 'polaroid'
  | 'badge'
  | 'pill-top';

export interface FrameConfig {
  style: FrameStyle;
  labelText: string;
  frameColor: string;
  textColor: string;
  bgColor: string;
}

export interface QRConfig {
  // Content
  contentType: ContentType;
  contentData: Record<string, any>;
  customRawText?: string;

  // Shapes
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;

  // Colors
  foregroundColor: string;
  useGradient: boolean;
  gradient: GradientConfig;
  backgroundColor: string;
  transparentBackground: boolean;

  // Corner custom colors
  customCornerColors: boolean;
  cornerSquareColor: string;
  cornerDotColor: string;

  // Logo
  hasLogo: boolean;
  logo: LogoOptions;

  // 3D & Frame
  effect3D: VisualEffect3D;
  frame: FrameConfig;

  // Advanced QR Settings
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number; // quiet zone
  resolution: number; // default 512, export can scale
}

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: number;
  contentType: ContentType;
  contentSummary: string;
  rawValue: string;
  config: QRConfig;
  isFavorite?: boolean;
}

export interface SavedTemplate {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  thumbnail: string; // Base64 data URL
  config: QRConfig;
  isBuiltIn?: boolean;
}

export interface PresetTemplate {
  id: string;
  name: string;
  tagline: string;
  category: string;
  previewGradient: string;
  config: Partial<QRConfig>;
}

export interface QuickLogo {
  id: string;
  name: string;
  category: 'social' | 'payment' | 'utility';
  svgDataUri: string;
}
