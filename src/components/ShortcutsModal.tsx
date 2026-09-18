import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + S / ⌘ + S', desc: 'Download QR Code image' },
    { key: 'Ctrl + C / ⌘ + C', desc: 'Copy QR image to clipboard (when not typing)' },
    { key: 'Ctrl + R / ⌘ + R', desc: 'Surprise Me (Randomize fresh style)' },
    { key: 'Ctrl + T / ⌘ + T', desc: 'Open Template Gallery' },
    { key: 'Ctrl + B / ⌘ + B', desc: 'Toggle Batch Mode' },
    { key: 'Ctrl + H / ⌘ + H', desc: 'Open History drawer' },
    { key: 'Esc', desc: 'Close modals or overlays' },
  ];

  return (
    <div
      id="shortcuts-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="shortcuts-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#0e0e13] border border-neutral-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.4)] space-y-5 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/80 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                Command & Shortcuts
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Precision workflow hotkeys for power users
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

        <div className="space-y-2">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06]"
            >
              <span className="text-xs text-neutral-600 dark:text-neutral-300">
                {sc.desc}
              </span>
              <kbd className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg bg-white dark:bg-[#16161f] border border-neutral-200/80 dark:border-white/[0.1] text-violet-700 dark:text-violet-300 shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 transition-all active:scale-95"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
