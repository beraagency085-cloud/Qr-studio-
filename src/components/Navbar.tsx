import React from 'react';
import {
  QrCode,
  Moon,
  Sun,
  Sparkles,
  Layers,
  Clock,
  RotateCcw,
  Keyboard,
  Share2,
  LayoutTemplate,
  ShieldCheck,
  Scan,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSurpriseMe: () => void;
  onReset: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onOpenGallery: () => void;
  customTemplatesCount: number;
  onOpenShortcuts: () => void;
  isBatchMode: boolean;
  onToggleBatchMode: () => void;
  onOpenScanGuide?: () => void;
  onOpenScanTest?: () => void;
  onOpenGuides?: (guideSlug?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onSurpriseMe,
  onReset,
  onOpenHistory,
  historyCount,
  onOpenGallery,
  customTemplatesCount,
  onOpenShortcuts,
  isBatchMode,
  onToggleBatchMode,
  onOpenScanGuide,
  onOpenScanTest,
  onOpenGuides,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 w-full max-w-full border-b backdrop-blur-xl bg-white/80 dark:bg-[#0b0b0f]/80 border-neutral-200/80 dark:border-white/[0.08] transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-x-clip"
    >
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-violet-500/25 ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105">
              <QrCode className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-30 blur-sm transition-opacity" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 dark:from-white dark:via-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent font-sans">
                QR Studio
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/10 via-violet-500/10 to-indigo-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 dark:border-amber-400/25 shadow-2xs">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 hidden sm:block tracking-normal">
              Privacy-first client-side studio
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Test Scan Optical Decoder Button */}
          {onOpenScanTest && (
            <button
              id="nav-test-scan-btn"
              onClick={onOpenScanTest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 transition-all border border-emerald-500/20 shadow-2xs hover:shadow-xs active:scale-[0.98]"
              title="Test scan active QR code with optical decoder"
            >
              <Scan className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Test Scan</span>
            </button>
          )}

          {/* Guides & Knowledge Base Button */}
          {onOpenGuides && (
            <button
              id="nav-guides-btn"
              onClick={() => onOpenGuides()}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100/90 dark:bg-white/[0.05] hover:bg-neutral-200/90 dark:hover:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 transition-all border border-neutral-200/80 dark:border-white/[0.08] shadow-2xs hover:shadow-xs active:scale-[0.98]"
              title="Read QR code design guides & tutorials"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Guides</span>
            </button>
          )}

          {/* Scanability Diagnostic Guide Button */}
          {onOpenScanGuide && (
            <button
              id="nav-scanguide-btn"
              onClick={onOpenScanGuide}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-500/10 hover:bg-violet-500/15 text-violet-700 dark:text-violet-300 transition-all border border-violet-500/20 shadow-2xs hover:shadow-xs active:scale-[0.98]"
              title="Open Scanability Diagnostic Guide & ISO Rules"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>Scan Advisor</span>
            </button>
          )}

          {/* Template Gallery Button */}
          <button
            id="nav-template-gallery-btn"
            onClick={onOpenGallery}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100/90 dark:bg-white/[0.05] hover:bg-neutral-200/90 dark:hover:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 transition-all border border-neutral-200/80 dark:border-white/[0.08] shadow-2xs hover:shadow-xs active:scale-[0.98]"
            title="Browse and save QR design templates (⌘T)"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
            <span className="hidden sm:inline">Templates</span>
            {customTemplatesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 text-[10px] font-bold">
                {customTemplatesCount}
              </span>
            )}
          </button>

          {/* Mode Switch: Studio vs Batch */}
          <button
            id="toggle-batch-mode-btn"
            onClick={onToggleBatchMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isBatchMode
                ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border-violet-300 dark:border-violet-700/60 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.05] border-transparent'
            }`}
            title="Switch between single QR and batch generation (⌘B)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isBatchMode ? 'Batch Active' : 'Batch Generate'}
            </span>
          </button>

          {/* Surprise Me button */}
          <button
            id="surprise-me-btn"
            onClick={onSurpriseMe}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30 transition-all active:scale-95"
            title="Randomize stylish design (⌘R)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden sm:inline">Surprise Me</span>
          </button>

          <div className="w-px h-5 bg-neutral-200 dark:bg-white/10 mx-1 hidden sm:block" />

          {/* History Drawer Trigger */}
          <button
            id="history-drawer-btn"
            onClick={onOpenHistory}
            className="relative p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-all border border-transparent hover:border-neutral-200 dark:hover:border-white/[0.08]"
            title="View generated QR code history (⌘H)"
            aria-label="History"
          >
            <Clock className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-violet-600 text-[9px] text-white font-bold flex items-center justify-center shadow-xs">
                {historyCount}
              </span>
            )}
          </button>

          {/* Keyboard Shortcuts Trigger */}
          <button
            id="shortcuts-btn"
            onClick={onOpenShortcuts}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-all border border-transparent hover:border-neutral-200 dark:hover:border-white/[0.08] hidden sm:flex"
            title="Keyboard shortcuts (?)"
            aria-label="Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Reset button */}
          <button
            id="reset-studio-btn"
            onClick={onReset}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-all border border-transparent hover:border-neutral-200 dark:hover:border-white/[0.08]"
            title="Reset to default settings"
            aria-label="Reset settings"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/[0.06] transition-all border border-transparent hover:border-neutral-200 dark:hover:border-white/[0.08]"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-600 transition-transform -rotate-12 hover:rotate-0" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
