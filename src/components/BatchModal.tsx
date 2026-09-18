import React, { useState } from 'react';
import {
  Layers,
  X,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { QRConfig } from '../types';
import { downloadQRCode } from '../utils/qrExporter';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: QRConfig;
  onToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

export const BatchModal: React.FC<BatchModalProps> = ({
  isOpen,
  onClose,
  config,
  onToast,
}) => {
  const [inputText, setInputText] = useState(
    'https://example.com/item-1\nhttps://example.com/item-2\nhttps://example.com/item-3\nhttps://example.com/item-4'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  if (!isOpen) return null;

  const lines = inputText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const handleDownloadAll = async () => {
    if (lines.length === 0) {
      onToast('No items to process', 'Please enter at least one line.', 'error');
      return;
    }

    setIsProcessing(true);
    setProcessedCount(0);

    try {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const cleanName = `batch_qr_${i + 1}_${line.slice(0, 15).replace(/[^a-zA-Z0-9]/g, '_')}`;
        await downloadQRCode(config, line, 'png', 2, cleanName);
        setProcessedCount(i + 1);
        // Small breathing delay to prevent browser throttling
        await new Promise((r) => setTimeout(r, 250));
      }
      onToast('Batch complete', `Successfully downloaded ${lines.length} QR codes.`, 'success');
    } catch (err) {
      console.error(err);
      onToast('Batch error', 'An issue occurred during batch download.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="batch-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="batch-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-[#0e0e13] border border-neutral-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.4)] space-y-5 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/80 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                Batch Generation Engine
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Bulk export custom branded QR codes using your current visual styling
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

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Enter Target URLs or Values (one per line)
          </label>
          <textarea
            id="batch-textarea"
            rows={6}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="https://example.com/item-1&#10;https://example.com/item-2&#10;https://example.com/item-3"
            className="w-full p-3.5 rounded-2xl text-xs font-mono bg-neutral-50/80 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/[0.08] focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none text-neutral-800 dark:text-neutral-200"
          />
          <div className="flex justify-between items-center text-[11px] text-neutral-400 mt-2 px-1">
            <span className="font-medium text-violet-600 dark:text-violet-400">{lines.length} items queued</span>
            <span>Applies active palette, dots, corners & logos</span>
          </div>
        </div>

        {isProcessing && (
          <div className="p-3.5 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-800/40 text-xs text-violet-800 dark:text-violet-200 flex items-center gap-3">
            <span className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin shrink-0" />
            <span className="font-medium">
              Generating & downloading: {processedCount} of {lines.length}...
            </span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-neutral-200/80 dark:border-white/[0.08] text-neutral-700 dark:text-neutral-300 font-semibold text-xs hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-start-batch-download"
            type="button"
            onClick={handleDownloadAll}
            disabled={isProcessing || lines.length === 0}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-violet-500/20 disabled:opacity-50 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Batch ({lines.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
