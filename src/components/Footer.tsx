import React from 'react';
import {
  QrCode,
  Shield,
  Heart,
  ExternalLink,
  Sparkles,
  Lock,
  Zap,
  BookOpen,
  HelpCircle,
  Mail,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { InfoModalType } from './InfoModals';

interface FooterProps {
  onOpenInfoModal: (type: InfoModalType) => void;
  onOpenGuides: (slug?: string) => void;
  onOpenScanAdvisor: () => void;
  onOpenScanTest: () => void;
  onOpenBatch: () => void;
  onOpenShortcuts: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenInfoModal,
  onOpenGuides,
  onOpenScanAdvisor,
  onOpenScanTest,
  onOpenBatch,
  onOpenShortcuts,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="mt-20 border-t border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0c0c11] text-neutral-600 dark:text-neutral-400 w-full overflow-hidden">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white">
                QR Studio
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                100% Free
              </span>
            </div>

            <p className="text-xs leading-relaxed max-w-sm text-neutral-500 dark:text-neutral-400">
              The professional, privacy-first QR code suite. Designed for entrepreneurs, restaurants,
              creators, and marketers to generate vector-grade QR codes with custom logos,
              gradients, and guaranteed optical scanability.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-medium text-neutral-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Server Logging</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />
                <span>No Watermarks</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Never Expires</span>
              </span>
            </div>
          </div>

          {/* Column 2: Generator Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Studio Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    scrollToSection('use-cases');
                  }}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  Use Cases & Templates
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    scrollToSection('features');
                  }}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  Logo & Shape Customizer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenScanTest}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold"
                >
                  <span>Test Scan Decoder</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenBatch}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  Bulk CSV Batch Generator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenShortcuts}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  Keyboard Shortcuts (<kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">?</kbd>)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Guides & Tutorials */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Knowledge & Guides
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenGuides('how-to-create-qr-code-with-logo')}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-left"
                >
                  How to Add a Logo to QR Code
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenGuides('wifi-qr-code-guide')}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-left"
                >
                  Wi-Fi QR Code Master Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenGuides('best-qr-code-practices')}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-left"
                >
                  Best Print & Contrast Practices
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenGuides('static-vs-dynamic-qr-codes')}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-left"
                >
                  Static vs Dynamic QR Codes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenScanAdvisor}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-medium text-left"
                >
                  Scanability & Diagnostic Advisor
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Trust & Transparency
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('privacy')}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-left"
                >
                  Privacy Policy (100% In-Browser)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('terms')}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-left"
                >
                  Terms of Service & Free License
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('faqs')}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-left"
                >
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('about')}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-left"
                >
                  About QR Studio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('contact')}
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-left"
                >
                  Contact & Feedback
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-100 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© 2026 QR Studio. Engineered with privacy, craftsmanship, and zero telemetry.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => onOpenInfoModal('privacy')}
              className="hover:underline"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenInfoModal('terms')}
              className="hover:underline"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenInfoModal('contact')}
              className="hover:underline"
            >
              Support & Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
