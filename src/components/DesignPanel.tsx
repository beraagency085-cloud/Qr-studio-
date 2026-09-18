import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Shapes,
  Palette,
  Square,
  Box,
  Sliders,
  Upload,
  Trash2,
  Check,
  Plus,
  Info,
  Sparkles,
  Move,
  Frame as FrameIcon,
  LayoutTemplate,
  Bookmark,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import {
  QRConfig,
  DotType,
  CornerSquareType,
  CornerDotType,
  LogoBackgroundShape,
  FrameStyle,
  Effect3DStyle,
  GradientType,
} from '../types';
import { QUICK_LOGOS, COLOR_PALETTES, PRESET_TEMPLATES } from '../utils/presets';
import { ScanabilityTooltip } from './ScanabilityTooltip';
import { getContrastDetails } from '../utils/scanability';

interface DesignPanelProps {
  config: QRConfig;
  onChangeConfig: (newConfig: QRConfig) => void;
  onToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
  onOpenGallery?: () => void;
  onSaveAsTemplate?: () => void;
  onOpenScanGuide?: (topic?: string) => void;
}

type TabType = 'logo' | 'shapes' | 'colors' | 'frames' | 'effects' | 'presets';

export const DesignPanel: React.FC<DesignPanelProps> = ({
  config,
  onChangeConfig,
  onToast,
  onOpenGallery,
  onSaveAsTemplate,
  onOpenScanGuide,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('logo');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateConfig = (partial: Partial<QRConfig>) => {
    onChangeConfig({ ...config, ...partial });
  };

  const updateLogo = (partial: Partial<QRConfig['logo']>) => {
    onChangeConfig({
      ...config,
      hasLogo: true,
      logo: {
        ...(config.logo || {
          image: '',
          name: '',
          size: 0.28,
          margin: 6,
          backgroundShape: 'rounded-square',
          backgroundColor: '#ffffff',
          opacity: 1,
          roundCorners: true,
          offsetX: 0,
          offsetY: 0,
          hideBackgroundDots: true,
        }),
        ...partial,
      },
      errorCorrectionLevel: 'H', // Automatically boost error correction for logo readability
    });
  };

  const updateFrame = (partial: Partial<QRConfig['frame']>) => {
    onChangeConfig({
      ...config,
      frame: {
        ...(config.frame || {
          style: 'none',
          labelText: 'SCAN ME',
          frameColor: '#000000',
          textColor: '#ffffff',
          bgColor: '#ffffff',
        }),
        ...partial,
      },
    });
  };

  const updateEffect3D = (partial: Partial<QRConfig['effect3D']>) => {
    onChangeConfig({
      ...config,
      effect3D: {
        ...(config.effect3D || {
          enabled: false,
          style: 'none',
          floating: false,
          tiltAngleX: 0,
          tiltAngleY: 0,
        }),
        ...partial,
      },
    });
  };

  // Handle Logo Upload (PNG, JPG, SVG, WebP)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(png|jpeg|jpg|svg\+xml|webp)/)) {
      onToast('Invalid file format', 'Please upload a PNG, JPG, SVG, or WebP image.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateLogo({
        image: dataUrl,
        name: file.name,
      });
      onToast('Logo applied', `Loaded ${file.name} successfully.`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Handle Logo Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.match(/image\/(png|jpeg|jpg|svg\+xml|webp)/)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateLogo({
          image: dataUrl,
          name: file.name,
        });
        onToast('Logo applied', `Loaded ${file.name} successfully.`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'logo' as TabType, label: 'Logo', icon: ImageIcon, badge: config.hasLogo ? 'Active' : undefined },
    { id: 'shapes' as TabType, label: 'Shapes', icon: Shapes },
    { id: 'colors' as TabType, label: 'Colors', icon: Palette },
    { id: 'frames' as TabType, label: 'Frames', icon: FrameIcon },
    { id: 'effects' as TabType, label: '3D & FX', icon: Box },
    { id: 'presets' as TabType, label: 'Presets', icon: Sparkles },
  ];

  return (
    <div
      id="design-panel-card"
      className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0e0e13] border border-neutral-200/80 dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Aesthetics & Styling Studio
            </h2>
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            Fine-tune geometry, custom brand logo, chromatic gradients, and frames
          </p>
        </div>

        {onOpenScanGuide && (
          <button
            id="btn-open-scan-guide"
            type="button"
            onClick={() => onOpenScanGuide()}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 active:scale-95 group"
            title="Open Scanability & Design Guide"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Scanability Guide</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        )}
      </div>

      {/* Segmented Tab Navigation */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1.5 rounded-2xl bg-neutral-100/80 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/[0.06] mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all ${
                isActive
                  ? 'bg-white dark:bg-[#16161f] text-violet-700 dark:text-violet-300 font-bold shadow-xs border border-neutral-200/80 dark:border-white/[0.1] ring-1 ring-violet-500/20'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.02] font-medium'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'opacity-70'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: LOGO & BRAND EMBED (PRIORITY FEATURE) */}
      {/* ========================================================= */}
      {activeTab === 'logo' && (
        <div className="space-y-5">
          {/* Logo Upload Zone */}
          <div>
            <div
              id="logo-drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all group ${
                config.hasLogo && config.logo?.image
                  ? 'border-violet-400/80 bg-violet-50/40 dark:bg-violet-950/20 dark:border-violet-600/70 shadow-sm'
                  : 'border-neutral-300/80 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/60 bg-gradient-to-b from-neutral-50/60 to-neutral-100/30 dark:from-white/[0.02] dark:to-white/[0.04]'
              }`}
            >
              <input
                ref={fileInputRef}
                id="file-input-logo"
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              {config.hasLogo && config.logo?.image ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 text-left">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#15151c] border border-neutral-200/80 dark:border-white/10 p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      <img
                        src={config.logo.image}
                        alt="Selected Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[180px]">
                        {config.logo.name || 'Custom Brand Logo'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <Check className="w-2.5 h-2.5" />
                          Embedded
                        </span>
                        <span className="text-[11px] text-neutral-400 hover:text-violet-500">
                          Click to replace
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateConfig({ hasLogo: false });
                      onToast('Logo removed', undefined, 'info');
                    }}
                    className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-all"
                    title="Remove Logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-3">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200/60 dark:border-violet-800/40 shadow-xs group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      Upload Custom Brand Logo or Watermark
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Drag & drop transparent PNG, SVG, JPG, or WebP
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Pre-installed Logos */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Popular Brand Vector Emblems
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {QUICK_LOGOS.map((item) => {
                const isSelected =
                  config.hasLogo && config.logo?.image === item.svgDataUri;
                return (
                  <button
                    key={item.id}
                    id={`quick-logo-${item.id}`}
                    type="button"
                    onClick={() => {
                      updateLogo({
                        image: item.svgDataUri,
                        name: item.name,
                      });
                      onToast(`Applied ${item.name} logo`);
                    }}
                    title={item.name}
                    className={`h-11 rounded-2xl flex items-center justify-center p-2 border transition-all active:scale-95 ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/50 ring-2 ring-violet-500/25 shadow-xs'
                        : 'border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/60 dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/20'
                    }`}
                  >
                    <img
                      src={item.svgDataUri}
                      alt={item.name}
                      className="w-5 h-5 object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Logo Styling Controls */}
          {config.hasLogo && config.logo?.image && (
            <div className="p-5 rounded-2xl bg-neutral-50/70 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Logo Geometry & Backdrop
                </span>
                <span className="text-[10px] text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full font-bold border border-violet-500/20 font-mono">
                  ISO-18004 Level H
                </span>
              </div>

              {/* Logo Size */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span>Logo Scale</span>
                    <ScanabilityTooltip
                      title="Logo Sizing vs Scanability"
                      impactLevel="high"
                      simpleExplanation="Controls how much of the central area your logo occupies."
                      scanEffect="Logos larger than 32% cover too much data. Reed-Solomon Level H can recover up to 30% obstructed modules."
                      recommendation="Keep scale between 24% and 30% for maximum reliability across budget phone cameras."
                      guideTopic="logo"
                      onOpenGuide={onOpenScanGuide}
                    />
                  </div>
                  <span className="font-mono text-neutral-400">
                    {Math.round((config.logo?.size ?? 0.28) * 100)}%
                  </span>
                </div>
                <input
                  id="slider-logo-size"
                  type="range"
                  min="0.12"
                  max="0.42"
                  step="0.01"
                  value={config.logo?.size ?? 0.28}
                  onChange={(e) => updateLogo({ size: parseFloat(e.target.value) })}
                  className="w-full accent-violet-600 cursor-pointer"
                />
              </div>

              {/* Logo Margin / Padding */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span>Logo Padding / Margin</span>
                    <ScanabilityTooltip
                      title="Logo Padding & Boundary Clearance"
                      impactLevel="moderate"
                      simpleExplanation="The empty safety cushion around your logo."
                      scanEffect="Separates your logo graphics from the QR data dots. Without padding, complex logos can blur into data dots."
                      recommendation="Use 4px - 8px padding to keep the boundary crisp."
                      guideTopic="logo"
                      onOpenGuide={onOpenScanGuide}
                    />
                  </div>
                  <span className="font-mono text-neutral-400">
                    {config.logo?.margin ?? 6}px
                  </span>
                </div>
                <input
                  id="slider-logo-margin"
                  type="range"
                  min="0"
                  max="16"
                  step="1"
                  value={config.logo?.margin ?? 6}
                  onChange={(e) => updateLogo({ margin: parseInt(e.target.value) })}
                  className="w-full accent-violet-600 cursor-pointer"
                />
              </div>

              {/* Logo Background Shape */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Backdrop Shape Under Logo
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'rounded-square', label: 'Rounded' },
                      { id: 'circle', label: 'Circle' },
                      { id: 'square', label: 'Square' },
                      { id: 'none', label: 'None' },
                    ] as { id: LogoBackgroundShape; label: string }[]
                  ).map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => updateLogo({ backgroundShape: shape.id })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        (config.logo?.backgroundShape ?? 'rounded-square') === shape.id
                          ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500/20 shadow-xs'
                          : 'border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#15151c] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/20'
                      }`}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Background Color & Opacity */}
              {(config.logo?.backgroundShape ?? 'rounded-square') !== 'none' && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Backdrop Fill Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="input-logo-bg-color"
                        type="color"
                        value={config.logo?.backgroundColor ?? '#ffffff'}
                        onChange={(e) => updateLogo({ backgroundColor: e.target.value })}
                        className="w-8 h-8 rounded-xl border border-neutral-300 dark:border-neutral-700 cursor-pointer p-0.5 shadow-2xs"
                      />
                      <input
                        type="text"
                        value={config.logo?.backgroundColor ?? '#ffffff'}
                        onChange={(e) => updateLogo({ backgroundColor: e.target.value })}
                        className="w-24 px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#15151c] border border-neutral-200/80 dark:border-white/[0.08] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Backdrop Opacity ({Math.round((config.logo?.opacity ?? 1) * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={config.logo?.opacity ?? 1}
                      onChange={(e) => updateLogo({ opacity: parseFloat(e.target.value) })}
                      className="w-full accent-violet-600 cursor-pointer mt-2"
                    />
                  </div>
                </div>
              )}

              {/* Hide background dots toggle */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    id="checkbox-hide-dots"
                    type="checkbox"
                    checked={config.logo?.hideBackgroundDots !== false}
                    onChange={(e) => updateLogo({ hideBackgroundDots: e.target.checked })}
                    className="w-4 h-4 rounded-md border-neutral-300 dark:border-neutral-700 text-violet-600 focus:ring-violet-500 cursor-pointer"
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    Clear QR dots behind logo (Ensures camera scanning reliability)
                  </span>
                </label>
                <ScanabilityTooltip
                  title="Clear Dots Underneath Logo"
                  impactLevel="critical"
                  simpleExplanation="Erases QR data dots covered by your logo's boundary."
                  scanEffect="Prevents high-frequency visual noise from confusing smartphone camera edge-detection algorithms."
                  recommendation="Always leave this ON when an opaque logo is centered."
                  guideTopic="logo"
                  onOpenGuide={onOpenScanGuide}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SHAPES & GEOMETRY */}
      {/* ========================================================= */}
      {activeTab === 'shapes' && (
        <div className="space-y-6">
          {/* Dot Style (Modules) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Body Matrix Geometry (Data Dots)
                </label>
                <ScanabilityTooltip
                  title="Body Module Dots"
                  impactLevel="moderate"
                  simpleExplanation="These are the individual data dots that represent your encoded text or web address."
                  scanEffect="Standard Square has 100% universal scanner compatibility. Rounded or Pill dots are 96% reliable. Circular dots require good contrast."
                  recommendation="Use Square or Rounded for printed posters and business cards."
                  guideTopic="modules"
                  onOpenGuide={onOpenScanGuide}
                />
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {config.dotType === 'square' ? '100% Compatibility' : 'Modern Friendly'}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(
                [
                  { id: 'square', label: 'Square' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'extra-rounded', label: 'Pill' },
                  { id: 'dots', label: 'Dots' },
                  { id: 'classy', label: 'Classy' },
                  { id: 'classy-rounded', label: 'Diamond' },
                ] as { id: DotType; label: string }[]
              ).map((dot) => (
                <button
                  key={dot.id}
                  id={`shape-dot-${dot.id}`}
                  type="button"
                  onClick={() => updateConfig({ dotType: dot.id })}
                  className={`p-3 rounded-2xl border text-center transition-all active:scale-95 ${
                    config.dotType === dot.id
                      ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 font-bold ring-2 ring-violet-500/20 shadow-xs'
                      : 'border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/60 dark:bg-white/[0.02] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/20 font-medium'
                  }`}
                >
                  <span className="text-xs block">{dot.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Corner Square (Eyes Outer) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Corner Square (Outer Eye Frame)
                </label>
                <ScanabilityTooltip
                  title="Corner Finder Eyes (Position Detection)"
                  impactLevel="high"
                  simpleExplanation="These 3 large corner squares tell phone cameras which way is up and how far the code is tilted."
                  scanEffect="All 4 shapes maintain high compatibility. Modern camera apps readily recognize Smooth and Circle frames."
                  recommendation="Keep corner eyes in a strong, dark color for fastest camera lock-on."
                  guideTopic="modules"
                  onOpenGuide={onOpenScanGuide}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'square', label: 'Square' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'extra-rounded', label: 'Smooth' },
                  { id: 'dot', label: 'Circle' },
                ] as { id: CornerSquareType; label: string }[]
              ).map((sq) => (
                <button
                  key={sq.id}
                  id={`corner-square-${sq.id}`}
                  type="button"
                  onClick={() => updateConfig({ cornerSquareType: sq.id })}
                  className={`p-3 rounded-2xl border text-center transition-all active:scale-95 ${
                    config.cornerSquareType === sq.id
                      ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 font-bold ring-2 ring-violet-500/20 shadow-xs'
                      : 'border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/60 dark:bg-white/[0.02] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/20 font-medium'
                  }`}
                >
                  <span className="text-xs block">{sq.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Corner Dot (Eyes Inner) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Corner Dot (Inner Eye Center)
                </label>
                <ScanabilityTooltip
                  title="Inner Eye Center Dots"
                  impactLevel="low"
                  simpleExplanation="The center bullseye inside each of the 3 corner position markers."
                  scanEffect="Primarily cosmetic. Works reliably across all standard scanners."
                  recommendation="Match your inner dot with your outer eye shape for a cohesive aesthetic."
                  guideTopic="modules"
                  onOpenGuide={onOpenScanGuide}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'square', label: 'Square' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'dot', label: 'Circle' },
                ] as { id: CornerDotType; label: string }[]
              ).map((dot) => (
                <button
                  key={dot.id}
                  id={`corner-dot-${dot.id}`}
                  type="button"
                  onClick={() => updateConfig({ cornerDotType: dot.id })}
                  className={`p-3 rounded-2xl border text-center transition-all active:scale-95 ${
                    config.cornerDotType === dot.id
                      ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 font-bold ring-2 ring-violet-500/20 shadow-xs'
                      : 'border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/60 dark:bg-white/[0.02] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/20 font-medium'
                  }`}
                >
                  <span className="text-xs block">{dot.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Recovery & Scan Durability Quick Setting */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50/70 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Error Correction Level (Data Backup)
                </span>
                <ScanabilityTooltip
                  title="Error Correction Level"
                  impactLevel="critical"
                  simpleExplanation="Like backup copies of your data. Reconstructs missing pieces if the QR code is smudged, crumpled, or covered by a brand logo."
                  scanEffect="Level L is least dense. Level M (15%) is standard. Level H (30%) is essential if you add a logo so cameras can read around it."
                  recommendation={
                    config.hasLogo
                      ? 'Logo is active: Level H is required so covered dots are restored.'
                      : 'Level M is the ideal standard balance.'
                  }
                  guideTopic="error-correction"
                  onOpenGuide={onOpenScanGuide}
                />
              </div>

              <span className="text-[11px] font-mono font-bold text-violet-600 dark:text-violet-400">
                {config.errorCorrectionLevel === 'L'
                  ? 'Level L (~7%)'
                  : config.errorCorrectionLevel === 'M'
                  ? 'Level M (~15%)'
                  : config.errorCorrectionLevel === 'Q'
                  ? 'Level Q (~25%)'
                  : 'Level H (~30% Max)'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: 'L', label: 'L (7%)', desc: 'Minimal' },
                  { id: 'M', label: 'M (15%)', desc: 'Standard' },
                  { id: 'Q', label: 'Q (25%)', desc: 'Outdoor' },
                  { id: 'H', label: 'H (30%)', desc: 'Logo Grade' },
                ] as const
              ).map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => updateConfig({ errorCorrectionLevel: lvl.id })}
                  className={`p-2.5 rounded-xl border text-center transition-all active:scale-95 ${
                    config.errorCorrectionLevel === lvl.id
                      ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 font-bold ring-2 ring-violet-500/20 shadow-xs'
                      : 'border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#15151c] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-bold block">{lvl.label}</span>
                  <span className="text-[10px] text-neutral-400 block">{lvl.desc}</span>
                </button>
              ))}
            </div>

            {config.hasLogo && config.errorCorrectionLevel !== 'H' ? (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-200 flex items-center justify-between gap-2">
                <span>⚠️ Brand logo active: Switch to Level H for 100% reliable scanning.</span>
                <button
                  type="button"
                  onClick={() => updateConfig({ errorCorrectionLevel: 'H' })}
                  className="px-2 py-1 rounded-lg bg-amber-600 text-white font-bold shrink-0 hover:bg-amber-500 transition-colors"
                >
                  Fix: Level H
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400">
                {config.errorCorrectionLevel === 'H'
                  ? 'Level H restores up to 30% missing or obstructed dots. Perfect for logos & prints.'
                  : 'Provides mathematical redundancy so smartphone cameras reconstruct damaged bits.'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: COLORS & GRADIENTS */}
      {/* ========================================================= */}
      {activeTab === 'colors' && (() => {
        const currentContrast = getContrastDetails(
          config.foregroundColor,
          config.transparentBackground ? '#ffffff' : config.backgroundColor
        );

        return (
          <div className="space-y-5">
            {/* Preset Palettes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Curated Color Palettes
                  </label>
                  <ScanabilityTooltip
                    title="Color Contrast & Scan Reliability"
                    impactLevel="critical"
                    simpleExplanation="Cameras detect QR codes by calculating the contrast ratio between dark data dots and light canvas."
                    scanEffect="All curated palettes maintain > 4.5:1 contrast for instant optical detection in bright or dim rooms."
                    recommendation="Dark foreground on light background is universally supported by all barcode scanners."
                    guideTopic="contrast"
                    onOpenGuide={onOpenScanGuide}
                  />
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40 font-bold">
                  Pre-Tested
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => {
                      updateConfig({
                        foregroundColor: palette.fg,
                        backgroundColor: palette.bg,
                        transparentBackground: false,
                        useGradient: palette.gradient.length > 1,
                        gradient: {
                          type: 'linear',
                          rotation: 45,
                          colorStops: [
                            { offset: 0, color: palette.gradient[0] },
                            { offset: 1, color: palette.gradient[1] },
                          ],
                        },
                        frame: {
                          ...config.frame,
                          frameColor: palette.fg,
                          bgColor: palette.bg,
                        },
                      });
                      onToast(`Applied ${palette.name} palette`);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 hover:border-neutral-400 transition-all text-left"
                  >
                    <div className="flex -space-x-1 shrink-0">
                      <span
                        className="w-4 h-4 rounded-full border border-white dark:border-neutral-900 shadow-xs"
                        style={{ backgroundColor: palette.fg }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white dark:border-neutral-900 shadow-xs"
                        style={{ backgroundColor: palette.bg }}
                      />
                    </div>
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">
                      {palette.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Mode: Solid vs Gradient */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Pattern Fill Chromatics
                  </label>
                  <ScanabilityTooltip
                    title="Pattern Contrast & Color Fill"
                    impactLevel="critical"
                    simpleExplanation="The hue and brightness of your QR code data dots."
                    scanEffect={`Current contrast is ${currentContrast.ratio}:1 (${currentContrast.rating.toUpperCase()}). Scanners need at least 3.0:1.`}
                    recommendation={
                      currentContrast.ratio < 3
                        ? '⚠️ Warning: Contrast is dangerously low. Darken foreground or lighten background.'
                        : 'High contrast enables instant camera recognition across low-cost mobile phones.'
                    }
                    guideTopic="contrast"
                    onOpenGuide={onOpenScanGuide}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      currentContrast.rating === 'optimal'
                        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50'
                        : currentContrast.rating === 'good'
                        ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/50'
                        : currentContrast.rating === 'fair'
                        ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50'
                        : 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50 animate-pulse'
                    }`}
                  >
                    {currentContrast.ratio}:1 {currentContrast.rating === 'critical' ? 'POOR' : currentContrast.rating}
                  </span>

                  <div className="flex rounded-xl border border-neutral-200/80 dark:border-white/[0.08] p-1 bg-neutral-100/80 dark:bg-white/[0.03]">
                    <button
                      type="button"
                      onClick={() => updateConfig({ useGradient: false })}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        !config.useGradient
                          ? 'bg-white dark:bg-[#16161f] text-violet-700 dark:text-violet-300 shadow-xs font-bold border border-neutral-200/80 dark:border-white/10'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                      }`}
                    >
                      Solid Color
                    </button>
                    <button
                      type="button"
                      onClick={() => updateConfig({ useGradient: true })}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        config.useGradient
                          ? 'bg-white dark:bg-[#16161f] text-violet-700 dark:text-violet-300 shadow-xs font-bold border border-neutral-200/80 dark:border-white/10'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                      }`}
                    >
                      Gradient Fill
                    </button>
                  </div>
                </div>
              </div>

            {!config.useGradient ? (
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-neutral-50/70 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.08]">
                <input
                  id="color-fg-solid"
                  type="color"
                  value={config.foregroundColor}
                  onChange={(e) => updateConfig({ foregroundColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-neutral-300 dark:border-neutral-700 cursor-pointer p-0.5 shadow-2xs"
                />
                <div className="flex-1">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                    Matrix Hex Value
                  </span>
                  <input
                    type="text"
                    value={config.foregroundColor}
                    onChange={(e) => updateConfig({ foregroundColor: e.target.value })}
                    className="w-32 px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#15151c] border border-neutral-200/80 dark:border-white/[0.08] font-mono mt-1"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-neutral-50/70 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.08] space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Gradient Direction
                  </span>
                  <div className="flex gap-2">
                    {(['linear', 'radial'] as GradientType[]).map((gt) => (
                      <button
                        key={gt}
                        type="button"
                        onClick={() =>
                          updateConfig({
                            gradient: { ...config.gradient, type: gt },
                          })
                        }
                        className={`px-3 py-1.5 text-xs rounded-xl capitalize border transition-all ${
                          config.gradient.type === gt
                            ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 font-bold ring-1 ring-violet-500/20'
                            : 'border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#15151c] text-neutral-500'
                        }`}
                      >
                        {gt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Stops */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium block mb-1">
                      Start Color
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.gradient.colorStops[0]?.color || '#6366f1'}
                        onChange={(e) => {
                          const stops = [...config.gradient.colorStops];
                          stops[0] = { offset: 0, color: e.target.value };
                          updateConfig({
                            gradient: { ...config.gradient, colorStops: stops },
                          });
                        }}
                        className="w-8 h-8 rounded-xl cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={config.gradient.colorStops[0]?.color || '#6366f1'}
                        onChange={(e) => {
                          const stops = [...config.gradient.colorStops];
                          stops[0] = { offset: 0, color: e.target.value };
                          updateConfig({
                            gradient: { ...config.gradient, colorStops: stops },
                          });
                        }}
                        className="w-24 px-2 py-1 text-xs rounded-xl bg-white dark:bg-[#15151c] border border-neutral-200/80 dark:border-white/[0.08] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium block mb-1">
                      End Color
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.gradient.colorStops[1]?.color || '#ec4899'}
                        onChange={(e) => {
                          const stops = [...config.gradient.colorStops];
                          stops[1] = { offset: 1, color: e.target.value };
                          updateConfig({
                            gradient: { ...config.gradient, colorStops: stops },
                          });
                        }}
                        className="w-8 h-8 rounded-xl cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={config.gradient.colorStops[1]?.color || '#ec4899'}
                        onChange={(e) => {
                          const stops = [...config.gradient.colorStops];
                          stops[1] = { offset: 1, color: e.target.value };
                          updateConfig({
                            gradient: { ...config.gradient, colorStops: stops },
                          });
                        }}
                        className="w-24 px-2 py-1 text-xs rounded-xl bg-white dark:bg-[#15151c] border border-neutral-200/80 dark:border-white/[0.08] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Angle rotation if linear */}
                {config.gradient.type === 'linear' && (
                  <div>
                    <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      <span>Gradient Rotation</span>
                      <span className="font-mono">{config.gradient.rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="5"
                      value={config.gradient.rotation}
                      onChange={(e) =>
                        updateConfig({
                          gradient: {
                            ...config.gradient,
                            rotation: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full accent-violet-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Background Color & Transparency */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Canvas Background
                </label>
                <ScanabilityTooltip
                  title="Canvas Background & Transparency"
                  impactLevel="high"
                  simpleExplanation="The surface color behind and surrounding the QR code modules."
                  scanEffect="If Transparent Background is on, ensure you place the exported code onto a clean, contrasting surface."
                  recommendation="Avoid dark backgrounds with light dots (inverted codes) for older retail hardware scanners."
                  guideTopic="contrast"
                  onOpenGuide={onOpenScanGuide}
                />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50/70 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.08] space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  id="checkbox-transparent-bg"
                  type="checkbox"
                  checked={config.transparentBackground}
                  onChange={(e) =>
                    updateConfig({ transparentBackground: e.target.checked })
                  }
                  className="w-4 h-4 rounded-md border-neutral-300 dark:border-neutral-700 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Transparent Background (Recommended for vector SVG & PNG overlay)
                </span>
              </label>

              {!config.transparentBackground && (
                <div className="flex items-center gap-3 pt-1">
                  <input
                    id="color-bg-solid"
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                    className="w-9 h-9 rounded-xl border border-neutral-300 dark:border-neutral-700 cursor-pointer p-0.5 shadow-2xs"
                  />
                  <div className="flex-1">
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium block">
                      Background Hex Value
                    </span>
                    <input
                      type="text"
                      value={config.backgroundColor}
                      onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                      className="w-28 px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#15151c] border border-neutral-200/80 dark:border-white/[0.08] font-mono mt-0.5"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Custom Corner Eye Colors */}
          <div>
            <div className="p-4 rounded-2xl bg-neutral-50/70 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.08] space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    id="checkbox-custom-corners"
                    type="checkbox"
                    checked={config.customCornerColors}
                    onChange={(e) =>
                      updateConfig({ customCornerColors: e.target.checked })
                    }
                    className="w-4 h-4 rounded-md border-neutral-300 dark:border-neutral-700 text-violet-600 focus:ring-violet-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Independent Corner Eye Colors
                  </span>
                </label>
                <ScanabilityTooltip
                  title="Corner Eyes Styling"
                  impactLevel="high"
                  simpleExplanation="Customizing the hue of the 3 corner position markers."
                  scanEffect="Scanners look for these 3 corners first. If their color blends with the background, detection fails."
                  recommendation="Keep corner eyes in high-contrast tones for instant autofocus."
                  guideTopic="modules"
                  onOpenGuide={onOpenScanGuide}
                />
              </div>

              {config.customCornerColors && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium block mb-1">
                      Outer Corner Frame
                    </span>
                    <input
                      type="color"
                      value={config.cornerSquareColor}
                      onChange={(e) =>
                        updateConfig({ cornerSquareColor: e.target.value })
                      }
                      className="w-9 h-9 rounded-xl cursor-pointer p-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium block mb-1">
                      Inner Corner Dot
                    </span>
                    <input
                      type="color"
                      value={config.cornerDotColor}
                      onChange={(e) =>
                        updateConfig({ cornerDotColor: e.target.value })
                      }
                      className="w-9 h-9 rounded-xl cursor-pointer p-0.5"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ); })()}

      {/* ========================================================= */}
      {/* TAB 4: FRAMES & BANNERS */}
      {/* ========================================================= */}
      {activeTab === 'frames' && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Frame & Badge Layout
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(
                [
                  { id: 'none', label: 'None (Pure QR)' },
                  { id: 'card-scan', label: 'Curated Card' },
                  { id: 'polaroid', label: 'Polaroid Style' },
                  { id: 'simple-border', label: 'Fine Border' },
                  { id: 'double-border', label: 'Dual Border' },
                  { id: 'pill-top', label: 'Top Pill Badge' },
                ] as { id: FrameStyle; label: string }[]
              ).map((f) => (
                <button
                  key={f.id}
                  id={`frame-style-${f.id}`}
                  type="button"
                  onClick={() => updateFrame({ style: f.id })}
                  className={`p-3.5 rounded-2xl border text-center transition-all active:scale-95 ${
                    config.frame.style === f.id
                      ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 font-bold ring-2 ring-violet-500/20 shadow-xs'
                      : 'border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/60 dark:bg-white/[0.02] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/20 font-medium'
                  }`}
                >
                  <span className="text-xs block">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {config.frame.style !== 'none' && (
            <div className="p-5 rounded-2xl bg-neutral-50/70 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.08] space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Call-to-Action Text
                </label>
                <input
                  id="input-frame-text"
                  type="text"
                  value={config.frame.labelText}
                  onChange={(e) => updateFrame({ labelText: e.target.value })}
                  placeholder="SCAN ME"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#15151c] border border-neutral-200/80 dark:border-white/[0.08] font-bold uppercase tracking-wide focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium block mb-1">
                    Frame Accent Color
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.frame.frameColor}
                      onChange={(e) => updateFrame({ frameColor: e.target.value })}
                      className="w-9 h-9 rounded-xl cursor-pointer p-0.5 shadow-2xs"
                    />
                    <input
                      type="text"
                      value={config.frame.frameColor}
                      onChange={(e) => updateFrame({ frameColor: e.target.value })}
                      className="w-24 px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#15151c] border border-neutral-200/80 dark:border-white/[0.08] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium block mb-1">
                    Text Color
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.frame.textColor}
                      onChange={(e) => updateFrame({ textColor: e.target.value })}
                      className="w-9 h-9 rounded-xl cursor-pointer p-0.5 shadow-2xs"
                    />
                    <input
                      type="text"
                      value={config.frame.textColor}
                      onChange={(e) => updateFrame({ textColor: e.target.value })}
                      className="w-24 px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-[#15151c] border border-neutral-200/80 dark:border-white/[0.08] font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: 3D & VISUAL EFFECTS */}
      {/* ========================================================= */}
      {activeTab === 'effects' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-neutral-50/70 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                  Enable 3D Perspective & Depth
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Simulates realistic studio lighting, depth extrusion, and tactile shadows
                </p>
              </div>
              <input
                id="checkbox-enable-3d"
                type="checkbox"
                checked={config.effect3D.enabled}
                onChange={(e) => updateEffect3D({ enabled: e.target.checked })}
                className="w-4 h-4 rounded-md border-neutral-300 dark:border-neutral-700 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>

            {config.effect3D.enabled && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    3D Visual Archetype
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(
                      [
                        { id: 'soft3d', label: 'Soft Studio' },
                        { id: 'raised', label: 'Tactile Card' },
                        { id: 'glass', label: 'Frosted Glass' },
                        { id: 'neon', label: 'Ambient Neon' },
                      ] as { id: Effect3DStyle; label: string }[]
                    ).map((st) => (
                      <button
                        key={st.id}
                        id={`effect-style-${st.id}`}
                        type="button"
                        onClick={() => updateEffect3D({ style: st.id })}
                        className={`p-3 rounded-2xl border text-center transition-all active:scale-95 ${
                          config.effect3D.style === st.id
                            ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 font-bold ring-2 ring-violet-500/20 shadow-xs'
                            : 'border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#15151c] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/20 font-medium'
                        }`}
                      >
                        <span className="text-xs block">{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                  <input
                    id="checkbox-floating-animation"
                    type="checkbox"
                    checked={config.effect3D.floating}
                    onChange={(e) => updateEffect3D({ floating: e.target.checked })}
                    className="w-4 h-4 rounded-md border-neutral-300 dark:border-neutral-700 text-violet-600 focus:ring-violet-500 cursor-pointer"
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                    Enable subtle dynamic float animation in showcase view
                  </span>
                </label>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: PRESETS & ADVANCED SETTINGS */}
      {/* ========================================================= */}
      {activeTab === 'presets' && (
        <div className="space-y-6">
          {/* Template Gallery Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 border border-violet-200/80 dark:border-violet-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  Design Template Library
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Save custom styles with real-time snapshots to your personal workspace.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onSaveAsTemplate && (
                <button
                  id="btn-save-as-template-banner"
                  type="button"
                  onClick={onSaveAsTemplate}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white dark:bg-[#16161f] hover:bg-neutral-50 dark:hover:bg-[#1e1e28] text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-white/10 text-xs font-semibold shadow-2xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Bookmark className="w-3.5 h-3.5 text-violet-500" />
                  <span>Save Style</span>
                </button>
              )}

              {onOpenGallery && (
                <button
                  id="btn-open-gallery-banner"
                  type="button"
                  onClick={onOpenGallery}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  <span>Open Gallery</span>
                </button>
              )}
            </div>
          </div>

          {/* Pre-made Templates */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2.5">
              Curated Production Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  id={`preset-${tmpl.id}`}
                  type="button"
                  onClick={() => {
                    onChangeConfig({
                      ...config,
                      ...tmpl.config,
                    });
                    onToast(`Loaded ${tmpl.name} template`);
                  }}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/60 dark:bg-white/[0.02] hover:border-violet-400 dark:hover:border-violet-500 text-left transition-all group active:scale-[0.99]"
                >
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${tmpl.previewGradient} shrink-0 shadow-sm`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                        {tmpl.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-normal">
                        ({tmpl.category})
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                      {tmpl.tagline}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Technical Controls */}
          <div className="p-5 rounded-2xl bg-neutral-50/70 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.08] space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              Advanced Scan Parameters
            </span>

            {/* Error Correction Level */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span>Reed-Solomon Error Recovery</span>
                  <ScanabilityTooltip
                    title="Reed-Solomon Error Correction"
                    impactLevel="critical"
                    simpleExplanation="Mathematical parity bits allowing scanning algorithms to reconstruct missing or occluded areas."
                    scanEffect="Level L (7%), M (15%), Q (25%), H (30%). Higher recovery increases dot density slightly."
                    recommendation="Always use Level H if a brand logo is embedded."
                    guideTopic="error-correction"
                    onOpenGuide={onOpenScanGuide}
                  />
                </div>
                <span className="font-mono text-neutral-400">
                  {config.errorCorrectionLevel} (
                  {config.errorCorrectionLevel === 'L'
                    ? '7%'
                    : config.errorCorrectionLevel === 'M'
                    ? '15%'
                    : config.errorCorrectionLevel === 'Q'
                    ? '25%'
                    : '30% Recovery'}
                  )
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as ('L' | 'M' | 'Q' | 'H')[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => updateConfig({ errorCorrectionLevel: lvl })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                      config.errorCorrectionLevel === lvl
                        ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 ring-1 ring-violet-500/20'
                        : 'border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#15151c] text-neutral-500'
                    }`}
                  >
                    Level {lvl}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1.5">
                Level H is automatically activated when brand logos are embedded to replace covered matrix dots.
              </p>
            </div>

            {/* Quiet Zone (Margin) */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span>Quiet Zone (Border Margin)</span>
                  <ScanabilityTooltip
                    title="Quiet Zone (Safety Border)"
                    impactLevel="high"
                    simpleExplanation="The empty blank margin around the outside perimeter of the QR code."
                    scanEffect="Without a quiet zone, nearby text, graphic borders, or screen edges can be mistaken for QR data, causing scans to fail."
                    recommendation="Keep at least 4px - 8px margin so cameras isolate the matrix immediately."
                    guideTopic="margin"
                    onOpenGuide={onOpenScanGuide}
                  />
                </div>
                <span className="font-mono text-neutral-400">{config.margin}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="2"
                value={config.margin}
                onChange={(e) => updateConfig({ margin: parseInt(e.target.value) })}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
