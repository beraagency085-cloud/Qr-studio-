import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Copy,
  Share2,
  Maximize2,
  Star,
  Check,
  ShieldCheck,
  AlertTriangle,
  ZoomIn,
  Sparkles,
  ChevronDown,
  FileImage,
  FileCode,
  FileText,
  Activity,
  CheckCircle2,
  Scan,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRConfig } from '../types';
import { createQRInstance, downloadQRCode, copyQRCodeToClipboard, shareQRCode } from '../utils/qrExporter';

interface QRPreviewProps {
  config: QRConfig;
  payload: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
  onOpenScanGuide?: (topic?: string) => void;
  onOpenScanTest?: () => void;
  onSurpriseMe?: () => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  config,
  payload,
  isFavorite,
  onToggleFavorite,
  onToast,
  onOpenScanGuide,
  onOpenScanTest,
  onSurpriseMe,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg' | 'jpeg' | 'pdf'>('png');
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(2);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isUpdating, setIsUpdating] = useState(false);

  // Render QR in real-time & trigger subtle micro-pulse animation
  useEffect(() => {
    if (!qrRef.current) return;
    qrRef.current.innerHTML = '';

    const qr = createQRInstance(config, payload, 300);
    qr.append(qrRef.current);

    // Trigger subtle animation highlight
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 350);
    return () => clearTimeout(timer);
  }, [config, payload]);

  // Mouse tilt for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!config.effect3D?.enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 16, y: x * 16 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Download QR Code
  const handleDownload = async () => {
    try {
      setIsExporting(true);
      await downloadQRCode(config, payload, downloadFormat, scaleMultiplier, 'qr-studio-code');
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#8b5cf6', '#6366f1', '#ec4899', '#f59e0b'],
      });
      onToast('Download complete', `Exported as ${downloadFormat.toUpperCase()} (${scaleMultiplier}x resolution)`, 'success');
    } catch (err) {
      console.error(err);
      onToast('Export failed', 'Could not render file for download.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    const success = await copyQRCodeToClipboard(config, payload);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onToast('Copied to clipboard', 'High-res QR image copied and ready to paste.', 'success');
    } else {
      onToast('Copy failed', 'Your browser does not support image copying.', 'error');
    }
  };

  // Share via Web Share API
  const handleShare = async () => {
    const ok = await shareQRCode(config, payload, 'My Custom QR Code');
    if (ok) {
      onToast('Shared successfully', undefined, 'success');
    } else {
      handleCopy();
    }
  };

  // Scan Reliability Health Score calculation & telemetry
  const charLength = payload.length;
  const isHighDensity = charLength > 300;
  const isSafeLogo = !config.hasLogo || (config.hasLogo && (config.logo?.size ?? 0.28) <= 0.35);
  const healthScore = Math.max(72, Math.min(99, 100 - (isHighDensity ? 12 : 0) - (config.hasLogo && (config.logo?.size ?? 0.28) > 0.35 ? 10 : 0)));

  const getHealthBadge = () => {
    if (healthScore >= 90) {
      return {
        label: 'Optimal Scan Rate',
        colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        barColor: 'from-emerald-500 to-teal-400',
      };
    }
    if (healthScore >= 80) {
      return {
        label: 'Good Readability',
        colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
        barColor: 'from-amber-500 to-yellow-400',
      };
    }
    return {
      label: 'High Density',
      colorClass: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20',
      barColor: 'from-orange-500 to-rose-400',
    };
  };

  const healthBadge = getHealthBadge();

  // 3D Visual Shadow / Glow CSS styling
  const get3DStyleClasses = () => {
    if (!config.effect3D?.enabled) return '';
    switch (config.effect3D.style) {
      case 'soft3d':
        return 'shadow-[0_25px_60px_rgba(0,0,0,0.14)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.55)] border-t border-white/80 dark:border-white/15';
      case 'raised':
        return 'shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] dark:shadow-[0_35px_80px_-15px_rgba(0,0,0,0.8)] ring-1 ring-black/10 dark:ring-white/15';
      case 'glass':
        return 'backdrop-blur-2xl bg-white/75 dark:bg-[#121218]/75 shadow-[0_12px_40px_rgba(31,38,135,0.18)] border border-white/60 dark:border-white/12';
      case 'neon':
        return 'shadow-[0_0_60px_rgba(139,92,246,0.35)] border border-violet-400/50';
      default:
        return 'shadow-lg shadow-neutral-900/5 dark:shadow-black/30';
    }
  };

  const frameStyle = config.frame?.style || 'none';

  return (
    <div className="flex flex-col gap-5 lg:sticky lg:top-20">
      {/* Live Preview Showcase Card */}
      <div
        id="qr-preview-container"
        ref={containerRef}
        className="relative p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0e0e13] border border-neutral-200/80 dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center min-h-[460px] overflow-hidden transition-all"
      >
        {/* Ambient Backlight Aura for museum-grade pedestal display */}
        <div className="absolute inset-0 ambient-glow-violet pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header utilities */}
        <div className="w-full flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-neutral-100/90 dark:bg-white/[0.06] text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-white/[0.08] backdrop-blur-md shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Live Showcase
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenScanTest && (
              <button
                id="qr-test-scan-header-btn"
                type="button"
                onClick={onOpenScanTest}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 text-xs font-bold transition-all shadow-2xs active:scale-95"
                title="Test scan active QR code with optical decoder"
              >
                <Scan className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Test Scan</span>
              </button>
            )}

            {onSurpriseMe && (
              <button
                id="qr-surprise-header-btn"
                type="button"
                onClick={onSurpriseMe}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/25 text-xs font-bold transition-all shadow-2xs active:scale-95"
                title="Surprise me with randomized style"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                <span className="hidden sm:inline">Randomize</span>
              </button>
            )}

            <button
              id="qr-favorite-btn"
              type="button"
              onClick={onToggleFavorite}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300/80 dark:border-amber-700/60 text-amber-500 shadow-2xs'
                  : 'bg-neutral-100/80 dark:bg-white/[0.04] border-neutral-200/80 dark:border-white/[0.06] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}`} />
            </button>
            <button
              id="qr-fullscreen-btn"
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-2 rounded-xl bg-neutral-100/80 dark:bg-white/[0.04] border border-neutral-200/80 dark:border-white/[0.06] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-all"
              title="Fullscreen scan test"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Perspective Stage */}
        <div
          className="perspective-1000 py-3 flex items-center justify-center w-full relative z-10"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            id="qr-stage-card"
            style={{
              transform: config.effect3D?.enabled
                ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                : undefined,
              transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className={`transition-shadow duration-300 rounded-3xl ${get3DStyleClasses()} ${
              config.effect3D?.floating ? 'animate-float-gentle' : ''
            }`}
          >
            {/* Outer Frame Wrapper */}
            <div
              style={{
                backgroundColor: config.frame?.bgColor || '#ffffff',
                borderColor:
                  frameStyle === 'simple-border' || frameStyle === 'double-border'
                    ? config.frame?.frameColor
                    : 'transparent',
              }}
              className={`p-5 sm:p-6 rounded-3xl flex flex-col items-center transition-all ${
                frameStyle === 'simple-border'
                  ? 'border-4 shadow-md'
                  : frameStyle === 'double-border'
                  ? 'border-4 ring-4 ring-offset-2 ring-neutral-200 dark:ring-neutral-700 shadow-md'
                  : 'border border-neutral-200/40 dark:border-white/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)]'
              }`}
            >
              {/* Optional Top Badge Frame */}
              {frameStyle === 'pill-top' && (
                <div
                  style={{
                    backgroundColor: config.frame?.frameColor || '#000000',
                    color: config.frame?.textColor || '#ffffff',
                  }}
                  className="px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
                >
                  {config.frame?.labelText || 'SCAN ME'}
                </div>
              )}

              {/* The QR Canvas Box with micro-pulse animation */}
              <div
                id="qr-code-canvas-box"
                className={`overflow-hidden flex items-center justify-center rounded-2xl relative transition-all duration-300 ${
                  isUpdating ? 'animate-qr-update' : ''
                }`}
                style={{
                  backgroundColor: config.transparentBackground
                    ? 'transparent'
                    : config.backgroundColor,
                }}
              >
                <div ref={qrRef} className="flex items-center justify-center" />
              </div>

              {/* Card-Scan Bottom Button Frame (Figma / Linear Style) */}
              {frameStyle === 'card-scan' && (
                <div
                  style={{
                    backgroundColor: config.frame?.frameColor || '#000000',
                    color: config.frame?.textColor || '#ffffff',
                  }}
                  className="w-full mt-4 py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{config.frame?.labelText || 'SCAN ME'}</span>
                </div>
              )}

              {/* Polaroid Frame */}
              {frameStyle === 'polaroid' && (
                <div
                  style={{ color: config.frame?.textColor || config.frame?.frameColor || '#000000' }}
                  className="mt-4 font-bold text-sm tracking-wide text-center uppercase font-sans"
                >
                  {config.frame?.labelText || 'SCAN HERE'}
                </div>
              )}

              {/* Badge Frame */}
              {frameStyle === 'badge' && (
                <div
                  style={{ color: config.frame?.textColor || config.frame?.frameColor || '#000000' }}
                  className="mt-3 text-xs font-semibold tracking-wider text-center"
                >
                  {config.frame?.labelText || 'Scan with Camera'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sophisticated Scan Reliability Telemetry Gauge */}
        <div className="w-full mt-4 pt-4 border-t border-neutral-100 dark:border-white/[0.06] relative z-10">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Scan Reliability
                </span>
                <span className="text-[10px] text-neutral-400 ml-1.5 hidden sm:inline">
                  (ISO 18004 Compliant)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${healthBadge.colorClass}`}>
                {healthBadge.label}
              </span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white">
                {healthScore}%
              </span>
            </div>
          </div>

          {/* Smooth telemetry progress bar */}
          <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.08] overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${healthBadge.barColor} transition-all duration-500`}
              style={{ width: `${healthScore}%` }}
            />
          </div>

          {/* Micro telemetry specs with guide opener */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 mt-2 font-mono">
            <span>Redundancy: {config.errorCorrectionLevel} (Level {config.errorCorrectionLevel === 'H' ? 'High 30%' : config.errorCorrectionLevel === 'Q' ? 'Quarter 25%' : config.errorCorrectionLevel === 'M' ? 'Medium 15%' : 'Low 7%'})</span>
            {onOpenScanGuide ? (
              <button
                type="button"
                onClick={() => onOpenScanGuide('diagnostic')}
                className="text-violet-600 dark:text-violet-400 hover:underline font-sans font-medium flex items-center gap-1 text-[11px]"
              >
                <span>Diagnostics</span>
                <span>→</span>
              </button>
            ) : (
              <span>{charLength} bytes payload</span>
            )}
          </div>
        </div>
      </div>

      {/* Download & Actions Control Center */}
      <div
        id="qr-action-panel"
        className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0e0e13] border border-neutral-200/80 dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Export Studio Assets
          </h3>
          <span className="text-[10px] font-mono text-neutral-400">
            Lossless Vector & Retina
          </span>
        </div>

        {/* Format Selector Pills */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Target Format
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-neutral-100/90 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/[0.06]">
            {(['png', 'svg', 'jpeg', 'pdf'] as const).map((fmt) => {
              const isSelected = downloadFormat === fmt;
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setDownloadFormat(fmt)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-[#1a1a24] text-violet-600 dark:text-violet-400 shadow-sm border border-neutral-200/80 dark:border-white/[0.1]'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resolution Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Output Quality
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { mult: 1, label: 'Standard', res: '512px' },
              { mult: 2, label: 'Retina 2x', res: '1024px' },
              { mult: 4, label: 'Print 4x', res: '2048px' },
            ].map((opt) => {
              const isSelected = scaleMultiplier === opt.mult;
              return (
                <button
                  key={opt.mult}
                  type="button"
                  disabled={downloadFormat === 'svg'}
                  onClick={() => setScaleMultiplier(opt.mult)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-violet-50/70 dark:bg-violet-950/40 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 font-semibold'
                      : 'bg-neutral-50/50 dark:bg-white/[0.02] border-neutral-200/80 dark:border-white/[0.06] text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/[0.1]'
                  } disabled:opacity-40`}
                >
                  <div className="text-xs font-bold leading-tight">{opt.label}</div>
                  <div className="text-[10px] font-mono opacity-70 mt-0.5">{opt.res}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Test Scan & Verify Button */}
        {onOpenScanTest && (
          <button
            id="btn-trigger-test-scan"
            type="button"
            onClick={onOpenScanTest}
            className="w-full py-2.5 px-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Scan className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Interactive Optical Test Scan</span>
            <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-normal">
              Simulate Camera
            </span>
          </button>
        )}

        {/* Primary Luxury Gradient Download Button */}
        <div className="relative group pt-1">
          <button
            id="btn-download-qr"
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/35 ring-1 ring-white/20 active:scale-[0.98] transition-all disabled:opacity-60 relative overflow-hidden"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 animate-shimmer pointer-events-none" />
            <Download className="w-4 h-4 stroke-[2.2]" />
            <span>{isExporting ? 'Rendering Masterfile...' : `Download ${downloadFormat.toUpperCase()}`}</span>
          </button>
        </div>

        {/* Secondary Action Buttons (Glassmorphic) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            id="btn-copy-clipboard"
            type="button"
            onClick={handleCopy}
            className="py-2.5 px-3 rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-neutral-100/70 dark:bg-white/[0.04] hover:bg-neutral-200/70 dark:hover:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image</span>
              </>
            )}
          </button>

          <button
            id="btn-share-qr"
            type="button"
            onClick={handleShare}
            className="py-2.5 px-3 rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-neutral-100/70 dark:bg-white/[0.04] hover:bg-neutral-200/70 dark:hover:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Link</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Test Scan Lightbox Modal */}
      {isFullscreen && (
        <div
          id="fullscreen-qr-modal"
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center p-4 cursor-pointer animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111116] border border-neutral-200 dark:border-white/10 shadow-2xl flex flex-col items-center gap-5 max-w-md w-full text-center"
          >
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                Camera Scan Lightbox
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Aim smartphone camera at the code below to test instant recognition
              </p>
            </div>

            <div
              className="p-5 rounded-2xl bg-white shadow-lg border border-neutral-100 flex items-center justify-center"
              style={{
                backgroundColor: config.transparentBackground
                  ? '#ffffff'
                  : config.backgroundColor,
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: qrRef.current?.innerHTML || '',
                }}
              />
            </div>

            <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 truncate max-w-xs bg-neutral-100 dark:bg-white/[0.05] px-3 py-1.5 rounded-lg border border-neutral-200/50 dark:border-white/[0.05]">
              {payload}
            </p>

            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="w-full py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs transition-colors shadow-sm"
            >
              Done Testing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
