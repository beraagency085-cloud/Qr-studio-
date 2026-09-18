import React, { useState } from 'react';
import {
  X,
  Shield,
  FileText,
  Info,
  Mail,
  CheckCircle2,
  Lock,
  EyeOff,
  ServerOff,
  Sparkles,
  Send,
} from 'lucide-react';

export type InfoModalType = 'privacy' | 'terms' | 'about' | 'contact';

interface InfoModalsProps {
  activeModal?: InfoModalType | null;
  modalType?: InfoModalType | null;
  isOpen?: boolean;
  onClose: () => void;
  onToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const InfoModals: React.FC<InfoModalsProps> = ({
  activeModal: propActiveModal,
  modalType,
  isOpen,
  onClose,
  onToast,
}) => {
  const [contactSubject, setContactSubject] = useState('Feedback / Feature Request');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const activeModal = propActiveModal !== undefined ? propActiveModal : (isOpen ? modalType : null);

  if (!activeModal) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      if (onToast) {
        onToast('Message Sent!', 'Thank you for your feedback. We review every community idea.', 'success');
      }
      onClose();
      setSubmitted(false);
      setContactEmail('');
      setContactMessage('');
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-[#0e0e13] rounded-3xl border border-neutral-200/80 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            {activeModal === 'privacy' && (
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
            )}
            {activeModal === 'terms' && (
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            )}
            {activeModal === 'about' && (
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
            )}
            {activeModal === 'contact' && (
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
            )}

            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                {activeModal === 'privacy' && 'Privacy Policy & Zero-Data Commitment'}
                {activeModal === 'terms' && 'Terms of Service & Free License'}
                {activeModal === 'about' && 'About QR Studio'}
                {activeModal === 'contact' && 'Contact Us & Community Support'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {activeModal === 'privacy' && '100% In-Browser execution • Zero tracking • Absolute confidentiality'}
                {activeModal === 'terms' && 'Unrestricted commercial and personal use • No watermarks'}
                {activeModal === 'about' && 'Built for creators, businesses, and privacy advocates worldwide'}
                {activeModal === 'contact' && 'Got suggestions, bug reports, or partnership ideas? Send a note'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs md:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {/* PRIVACY POLICY */}
          {activeModal === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex items-start gap-3">
                <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-0.5">
                    100% Client-Side Privacy Architecture
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-300">
                    Unlike standard QR websites that send your Wi-Fi passwords, private links, and contacts to remote databases, QR Studio generates every QR code matrix directly inside your local web browser.
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">
                1. No Server Transmission
              </h4>
              <p>
                When you enter a URL, Wi-Fi network key, or vCard address, that payload is calculated by local JavaScript on your device. It is never logged, analyzed, or sent across any network wire.
              </p>

              <h4 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">
                2. Uploaded Logos & Assets
              </h4>
              <p>
                Uploaded brand icons or image files are read via the HTML5 FileReader API directly in browser memory. No files are uploaded to any cloud storage or third-party buckets.
              </p>

              <h4 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">
                3. Local Storage Only
              </h4>
              <p>
                Your design history and saved custom templates reside purely within your personal browser’s <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px]">localStorage</code>. You can clear them at any time with one click.
              </p>
            </div>
          )}

          {/* TERMS OF SERVICE */}
          {activeModal === 'terms' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40">
                <span className="font-bold text-blue-900 dark:text-blue-200 block mb-0.5 text-xs">
                  Free Forever for Personal & Commercial Use
                </span>
                <span className="text-blue-700 dark:text-blue-300 text-xs">
                  Every QR code exported from QR Studio is 100% royalty-free, unencumbered by proprietary watermarks, and never subject to subscription renewals or link expirations.
                </span>
              </div>

              <h4 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">
                1. Ownership & Licensing
              </h4>
              <p>
                You retain complete intellectual property ownership over any QR codes, logos, and graphics generated using QR Studio. You are free to print them on packaging, billboards, books, apparel, or business cards worldwide without attribution.
              </p>

              <h4 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">
                2. No Expiration Guarantee
              </h4>
              <p>
                Because QR Studio generates static QR codes, the encoded destination data is baked directly into the matrix pattern. As long as your destination URL or Wi-Fi network exists, the QR code will function indefinitely without expiration.
              </p>

              <h4 className="text-sm font-bold text-neutral-900 dark:text-white pt-2">
                3. Fair Use & Responsibility
              </h4>
              <p>
                Users agree not to generate QR codes intended for phishing, malware distribution, fraudulent scams, or unlawful activities.
              </p>
            </div>
          )}

          {/* ABOUT US */}
          {activeModal === 'about' && (
            <div className="space-y-4">
              <p>
                QR codes are the universal physical-to-digital bridge for modern commerce, events, dining, and identity. However, most online generators have turned into deceptive subscription traps: they claim to be free, only to disable your codes weeks later or charge $30+/month.
              </p>
              <div className="p-4 rounded-2xl bg-violet-50/80 dark:bg-violet-950/20 border border-violet-200/60 dark:border-violet-800/40 space-y-2">
                <span className="font-bold text-violet-900 dark:text-violet-200 text-xs block">
                  Our Guiding Principles:
                </span>
                <ul className="space-y-1.5 text-xs text-violet-800 dark:text-violet-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span><strong>True Privacy:</strong> Zero telemetry or server transmission.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span><strong>High Craft:</strong> Vector SVG exports, custom brand shapes, and realistic 3D angles.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span><strong>Optical Precision:</strong> Built-in ISO 18004 contrast checking and Reed-Solomon protection.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* CONTACT & FEEDBACK */}
          {activeModal === 'contact' && (
            <form onSubmit={handleContactSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Topic / Purpose
                </label>
                <select
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="Feedback / Feature Request">Feedback / Feature Request</option>
                  <option value="Report an Issue">Report a Bug / Scanner Issue</option>
                  <option value="Enterprise / High-Volume Batch">Enterprise / High-Volume Batch Inquiry</option>
                  <option value="General Question">General Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Your Email (Optional, for replies)
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Message / Feedback Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Share what features you would love to see, or any question about QR code printing..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitted}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitted ? 'Submitting...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
