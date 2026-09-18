import React from 'react';
import {
  X,
  Clock,
  Star,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRestore,
  onToggleFavorite,
  onDeleteItem,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="history-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        id="history-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-white dark:bg-[#0e0e13] border-l border-neutral-200/80 dark:border-white/[0.08] shadow-[-25px_0_60px_rgba(0,0,0,0.4)] flex flex-col p-6 overflow-hidden animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/80 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                Generation History
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Recent 15 sessions (locally stored & private)
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

        {/* List of items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <Sparkles className="w-8 h-8 stroke-1 text-violet-400 dark:text-violet-500 mb-2 opacity-60" />
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                No history recorded yet
              </p>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                Generated codes will automatically save here so you can recall, restyle, or export them anytime.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                onClick={() => {
                  onRestore(item);
                  onClose();
                }}
                className="group p-3.5 rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#121218] hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-md cursor-pointer transition-all flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-white/[0.06]">
                      {item.contentType}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {item.contentSummary}
                  </p>
                  <p className="text-[11px] text-neutral-400 truncate font-mono mt-0.5">
                    {item.rawValue}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(item.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      item.isFavorite
                        ? 'text-amber-500 bg-amber-500/10'
                        : 'text-neutral-400 hover:text-amber-500 hover:bg-amber-500/10'
                    }`}
                    title="Bookmark"
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-500' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <ChevronRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-violet-500 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-neutral-200/80 dark:border-white/[0.06] flex justify-between items-center">
            <span className="text-xs text-neutral-400">{items.length} saved entries</span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition-colors"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
