import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info, ExternalLink, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export type ScanImpactLevel = 'critical' | 'high' | 'moderate' | 'low';

export interface ScanabilityTooltipProps {
  title: string;
  impactLevel: ScanImpactLevel;
  simpleExplanation: string;
  scanEffect: string;
  recommendation?: string;
  guideTopic?: string;
  onOpenGuide?: (topic?: string) => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const ScanabilityTooltip: React.FC<ScanabilityTooltipProps> = ({
  title,
  impactLevel,
  simpleExplanation,
  scanEffect,
  recommendation,
  guideTopic,
  onOpenGuide,
  position = 'top',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const getImpactBadge = () => {
    switch (impactLevel) {
      case 'critical':
        return {
          label: 'Critical Scan Impact',
          badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
          icon: ShieldAlert,
        };
      case 'high':
        return {
          label: 'High Scan Impact',
          badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          icon: Info,
        };
      case 'moderate':
        return {
          label: 'Moderate Impact',
          badgeClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
          icon: Info,
        };
      case 'low':
      default:
        return {
          label: 'Visual Styling',
          badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          icon: CheckCircle2,
        };
    }
  };

  const impact = getImpactBadge();
  const ImpactIcon = impact.icon;

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className={`p-1 rounded-lg text-neutral-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-white/[0.06] transition-all focus:outline-none focus:ring-1 focus:ring-violet-500/40 ${
          isOpen ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-white/[0.08]' : ''
        }`}
        title={`Scanability tip for ${title}`}
        aria-label={`Scanability explanation for ${title}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 w-72 sm:w-80 p-4 rounded-2xl bg-white dark:bg-[#121218] border border-neutral-200/90 dark:border-white/[0.12] shadow-[0_12px_35px_rgba(0,0,0,0.25)] text-left animate-in fade-in zoom-in-95 duration-150 ${
            position === 'top'
              ? 'bottom-full mb-2 -left-2 sm:left-1/2 sm:-translate-x-1/2'
              : position === 'bottom'
              ? 'top-full mt-2 -left-2 sm:left-1/2 sm:-translate-x-1/2'
              : position === 'left'
              ? 'right-full mr-2 top-1/2 -translate-y-1/2'
              : 'left-full ml-2 top-1/2 -translate-y-1/2'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-neutral-100 dark:border-white/[0.06]">
            <div>
              <h5 className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
                <span>{title}</span>
              </h5>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mt-1 rounded-md border ${impact.badgeClass}`}
              >
                <ImpactIcon className="w-2.5 h-2.5" />
                <span>{impact.label}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/[0.05]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Simple Explanation */}
          <div className="py-2.5 space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                In Simple Words:
              </span>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
                {simpleExplanation}
              </p>
            </div>

            <div className="p-2 rounded-xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/[0.06]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 block mb-0.5">
                How It Affects Phone Scanning:
              </span>
              <p className="text-neutral-700 dark:text-neutral-200 text-[11px] leading-snug">
                {scanEffect}
              </p>
            </div>

            {recommendation && (
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-start gap-1.5 pt-0.5">
                <span className="font-bold text-neutral-700 dark:text-neutral-300 shrink-0">
                  Tip:
                </span>
                <span>{recommendation}</span>
              </div>
            )}
          </div>

          {/* Learn More link */}
          {onOpenGuide && (
            <div className="pt-2 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] text-neutral-400">Want deeper advice?</span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenGuide(guideTopic);
                }}
                className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 inline-flex items-center gap-1 group"
              >
                <span>Open Scan Guide</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
