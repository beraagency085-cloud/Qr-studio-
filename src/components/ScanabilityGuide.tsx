import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Zap,
  ArrowRight,
  Eye,
  Sliders,
  Palette,
  Maximize2,
  Layers,
  Info,
  Check,
} from 'lucide-react';
import { QRConfig, DotType } from '../types';
import {
  analyzeQRScanability,
  MODULE_STYLE_INFO,
  ERROR_CORRECTION_EXPLANATIONS,
} from '../utils/scanability';

interface ScanabilityGuideProps {
  isOpen: boolean;
  onClose: () => void;
  config: QRConfig;
  payload: string;
  onUpdateConfig: (partial: Partial<QRConfig>) => void;
  onToast: (title: string, desc?: string, type?: 'success' | 'error' | 'info') => void;
  initialTopic?: string;
}

export const ScanabilityGuide: React.FC<ScanabilityGuideProps> = ({
  isOpen,
  onClose,
  config,
  payload,
  onUpdateConfig,
  onToast,
  initialTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'modules' | 'error-correction' | 'contrast' | 'faq'>('diagnostics');

  useEffect(() => {
    if (initialTopic) {
      if (initialTopic === 'error-correction') setActiveTab('error-correction');
      else if (initialTopic === 'modules' || initialTopic === 'shapes') setActiveTab('modules');
      else if (initialTopic === 'contrast' || initialTopic === 'colors') setActiveTab('contrast');
      else if (initialTopic === 'faq') setActiveTab('faq');
      else setActiveTab('diagnostics');
    }
  }, [initialTopic, isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const diag = analyzeQRScanability(config, payload);

  // Auto-optimize action
  const handleAutoOptimize = () => {
    const hasLogo = config.hasLogo && !!config.logo?.image;
    onUpdateConfig({
      errorCorrectionLevel: hasLogo ? 'H' : 'M',
      margin: Math.max(config.margin ?? 4, 4),
      dotType: config.dotType === 'classy-rounded' ? 'rounded' : config.dotType,
      logo: hasLogo
        ? {
            ...config.logo,
            size: Math.min(config.logo?.size ?? 0.28, 0.3),
            hideBackgroundDots: true,
          }
        : config.logo,
    });
    onToast(
      'Scanability Optimized',
      'Configured safe error recovery, margin, and module balance.',
      'success'
    );
  };

  return (
    <div
      id="scanability-guide-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="scanability-guide-panel"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl h-full bg-white dark:bg-[#0e0e13] border-l border-neutral-200/80 dark:border-white/[0.08] shadow-[-25px_0_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in slide-in-from-right duration-250"
      >
        {/* Panel Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200/80 dark:border-white/[0.06] flex items-center justify-between gap-4 bg-white/80 dark:bg-[#0e0e13]/80 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                  Scanability & Design Guide
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/40">
                  Beginner Friendly
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Simple explanations of how shapes, colors & recovery affect camera scans
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02] overflow-x-auto text-xs no-scrollbar">
          {[
            { id: 'diagnostics', label: 'Live Diagnostic', icon: Zap },
            { id: 'modules', label: 'Module Styles', icon: Sliders },
            { id: 'error-correction', label: 'Error Recovery', icon: ShieldCheck },
            { id: 'contrast', label: 'Contrast & Margins', icon: Palette },
            { id: 'faq', label: 'How Scanning Works', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white dark:bg-[#16161f] text-emerald-700 dark:text-emerald-400 font-bold shadow-2xs border border-neutral-200/80 dark:border-white/[0.08]'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ========================================================= */}
          {/* TAB 1: LIVE DIAGNOSTICS */}
          {/* ========================================================= */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-6">
              {/* Overall Health Score Card */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  diag.score >= 90
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40'
                    : diag.score >= 75
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/40'
                    : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                      Active Scan Reliability Index
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-neutral-900 dark:text-white font-mono">
                        {diag.score}%
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          diag.rating === 'Optimal'
                            ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                            : diag.rating === 'Good'
                            ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                            : diag.rating === 'Moderate'
                            ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {diag.rating} Readability
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoOptimize}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Optimize</span>
                  </button>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-3 leading-relaxed">
                  {diag.summary}
                </p>

                {/* Progress bar */}
                <div className="w-full h-2 bg-neutral-200/80 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      diag.score >= 90
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : diag.score >= 75
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-rose-500 to-orange-400'
                    }`}
                    style={{ width: `${diag.score}%` }}
                  />
                </div>
              </div>

              {/* Actionable Live Advisories */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Settings Diagnostic Breakdown
                </h4>

                {/* 1. Module Style Check */}
                <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                          Module Shape: {diag.dotTypeAnalysis.name}
                        </h5>
                        <span className="text-[11px] text-neutral-400">
                          {diag.dotTypeAnalysis.compatibility}% Scanner Compatibility
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('modules')}
                      className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                    >
                      <span>Explore Shapes</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    {diag.dotTypeAnalysis.explanation}
                  </p>
                </div>

                {/* 2. Error Recovery vs Logo Check */}
                <div
                  className={`p-4 rounded-2xl border space-y-2 ${
                    config.hasLogo && config.errorCorrectionLevel !== 'H'
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
                      : 'bg-neutral-50/80 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                          <span>Error Recovery: {diag.errorCorrectionAnalysis.level}</span>
                          <span className="text-[10px] font-normal text-neutral-400">
                            ({diag.errorCorrectionAnalysis.recoveryPercent})
                          </span>
                        </h5>
                        <span className="text-[11px] text-neutral-400">
                          {config.hasLogo ? 'Brand Logo is Active' : 'No Logo Active'}
                        </span>
                      </div>
                    </div>

                    {config.hasLogo && config.errorCorrectionLevel !== 'H' && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateConfig({ errorCorrectionLevel: 'H' });
                          onToast('Updated to Level H', 'Ensures cameras scan through your logo.', 'success');
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-2xs transition-all active:scale-95"
                      >
                        Set Level H
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    {diag.errorCorrectionAnalysis.actionableTip}
                  </p>
                </div>

                {/* 3. Color Contrast Check */}
                <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                          Color Contrast Ratio: {diag.contrastAnalysis.ratio}:1
                        </h5>
                        <span
                          className={`text-[11px] font-medium ${
                            diag.contrastAnalysis.isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                          }`}
                        >
                          {diag.contrastAnalysis.isGood ? 'Meets Safe Standard' : 'Below Recommended Contrast'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    {diag.contrastAnalysis.message}
                  </p>
                </div>

                {/* 4. Margin (Quiet Zone) */}
                <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                          Border Margin: {diag.marginAnalysis.margin}px
                        </h5>
                        <span className="text-[11px] text-neutral-400">
                          {diag.marginAnalysis.isAdequate ? 'Sufficient Breathing Room' : 'Warning: Tiny Margin'}
                        </span>
                      </div>
                    </div>
                    {diag.marginAnalysis.margin < 2 && (
                      <button
                        type="button"
                        onClick={() => onUpdateConfig({ margin: 4 })}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all"
                      >
                        Set to 4px
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    {diag.marginAnalysis.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: MODULE STYLES (DOTS & GEOMETRY) */}
          {/* ========================================================= */}
          {activeTab === 'modules' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  How Module Styles Affect Scanners
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                  The tiny dots in a QR code are called &quot;modules&quot;. Camera sensors look for the sharp corners and spacing of these modules to read your data bits (zeros and ones).
                </p>
              </div>

              {/* Styles Grid */}
              <div className="space-y-3">
                {(
                  [
                    'square',
                    'rounded',
                    'extra-rounded',
                    'dots',
                    'classy',
                    'classy-rounded',
                  ] as DotType[]
                ).map((dotKey) => {
                  const info = MODULE_STYLE_INFO[dotKey];
                  const isCurrent = config.dotType === dotKey;

                  return (
                    <div
                      key={dotKey}
                      onClick={() => onUpdateConfig({ dotType: dotKey })}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-violet-500 bg-violet-50/60 dark:bg-violet-950/40 shadow-sm ring-1 ring-violet-500/30'
                          : 'border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">
                            {info.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-600 text-white">
                              Active
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {info.ratingText}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-2">
                        {info.detailedScanImpact}
                      </p>

                      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                        <span className="font-semibold text-neutral-600 dark:text-neutral-300">Best for:</span>
                        <span>{info.bestUsedFor}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Rule of Thumb */}
              <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 text-xs space-y-1.5 text-neutral-700 dark:text-neutral-300">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Golden Rule for Module Shapes:
                </span>
                <p>
                  Standard <strong>Squares</strong> or <strong>Rounded</strong> corners provide the safest universal reliability. If using artistic <strong>Circular Dots</strong> or <strong>Diamonds</strong>, always maintain maximum contrast (e.g. black on pure white) and test across 2 different phone models.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: ERROR CORRECTION DEEP DIVE */}
          {/* ========================================================= */}
          {activeTab === 'error-correction' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  What is Error Correction (Reed-Solomon)?
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                  Think of error correction as built-in <strong>data backup copies</strong>. If your printed QR code gets scratched, folded, smudged, or has a logo placed in the center, the camera uses mathematical formulas to reconstruct the missing information!
                </p>
              </div>

              {/* Logo Warning Card */}
              {config.hasLogo && (
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    config.errorCorrectionLevel === 'H'
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200'
                      : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">
                      {config.errorCorrectionLevel === 'H'
                        ? 'Level H Active — Safe for Brand Logos'
                        : 'Brand Logo Detected with Lower Recovery Level'}
                    </p>
                    <p className="text-[11px] leading-relaxed opacity-90">
                      When you add a brand logo to the center of a QR code, it covers up to 25% of the data dots. <strong>Level H (30% recovery)</strong> is required so smartphone cameras can restore those covered pixels effortlessly.
                    </p>
                  </div>
                </div>
              )}

              {/* 4 Levels Comparison Cards */}
              <div className="space-y-3">
                {(['L', 'M', 'Q', 'H'] as ('L' | 'M' | 'Q' | 'H')[]).map((lvl) => {
                  const info = ERROR_CORRECTION_EXPLANATIONS[lvl];
                  const isCurrent = config.errorCorrectionLevel === lvl;

                  return (
                    <div
                      key={lvl}
                      onClick={() => onUpdateConfig({ errorCorrectionLevel: lvl })}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-violet-500 bg-violet-50/60 dark:bg-violet-950/40 shadow-sm ring-1 ring-violet-500/30'
                          : 'border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02] hover:border-neutral-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">
                            {info.name}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-400">
                            {info.recovery}
                          </span>
                        </div>

                        {isCurrent ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-600 text-white">
                            Selected
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline"
                          >
                            Select
                          </button>
                        )}
                      </div>

                      <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 block mb-1">
                        {info.headline}
                      </span>

                      <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-2">
                        {info.simpleExplanation}
                      </p>

                      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 pt-1 border-t border-neutral-200/50 dark:border-white/[0.05]">
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                          Recommended use:
                        </span>
                        <span>{info.whenToUse}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: CONTRAST, MARGINS & CAMERAS */}
          {/* ========================================================= */}
          {activeTab === 'contrast' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Color Contrast & Quiet Zone (Margins)
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                  Optical sensors rely on luminance differences (brightness) rather than pure color tint.
                </p>
              </div>

              {/* Contrast Explained */}
              <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Rule 1: Dark-on-Light Scans 3x Faster
                  </h5>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Current: {diag.contrastAnalysis.ratio}:1
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Camera auto-exposure algorithms expect the background to be light (reflective) and the dots to be dark (absorptive). Inverted codes (white dots on black background) work well on modern iOS and Android, but may struggle on older supermarket barcode scanners.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateConfig({
                        foregroundColor: '#000000',
                        backgroundColor: '#ffffff',
                        transparentBackground: false,
                        useGradient: false,
                      });
                      onToast('Reset to Classic Contrast', 'Black dots on pure white.', 'info');
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 transition-all"
                  >
                    Set Pure Black on White
                  </button>
                </div>
              </div>

              {/* Quiet Zone Explained */}
              <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Rule 2: The Quiet Zone (Breathing Room)
                  </h5>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Current: {config.margin}px
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  The white border surrounding the QR code is officially called the <strong>Quiet Zone</strong>. Cameras need this gap to distinguish where the QR code ends and where nearby website banners, printed text, or packaging artwork begins!
                </p>
                <div className="flex items-center gap-2">
                  {[0, 2, 4, 8].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onUpdateConfig({ margin: m })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        config.margin === m
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300'
                          : 'border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {m}px {m === 4 ? '(Standard)' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: HOW SCANNING WORKS (FAQ / 101) */}
          {/* ========================================================= */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  How a Smartphone Camera Reads Your QR Code
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                  QR stands for &quot;Quick Response&quot;. Here is the step-by-step process that happens in 50 milliseconds when you point your phone camera:
                </p>
              </div>

              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Locating the 3 Corner Eyes (Position Markers)
                  </h5>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    The camera first looks for the 3 large square eyes located at the top-left, top-right, and bottom-left corners. These tell the camera exactly which way is right-side up, even if you hold your phone upside down or sideways!
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Measuring Grid Resolution & Skew (Timing Tracks)
                  </h5>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    Thin alternating lines of dots connect the eyes. The camera counts the rows and columns to measure the angle and perspective distortion, flattening the image digitally in real time.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Decoding Data Modules & Error Correction
                  </h5>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    The camera reads the remaining black-and-white pixels as binary code (URL, text, Wi-Fi password). If any pixels are obscured by a company logo or physical dirt, Reed-Solomon mathematics reconstructs them instantly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/60 dark:bg-white/[0.02] flex items-center justify-between text-xs">
          <span className="text-neutral-400 text-[11px]">
            Scanability updates live as you tweak settings
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            Done Learning
          </button>
        </div>
      </div>
    </div>
  );
};
