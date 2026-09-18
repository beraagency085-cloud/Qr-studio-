import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ContentForm } from './components/ContentForm';
import { DesignPanel } from './components/DesignPanel';
import { QRPreview } from './components/QRPreview';
import { HistoryDrawer } from './components/HistoryDrawer';
import { BatchModal } from './components/BatchModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { TemplateGallery } from './components/TemplateGallery';
import { ScanabilityGuide } from './components/ScanabilityGuide';
import { LandingSections } from './components/LandingSections';
import { Footer } from './components/Footer';
import { ScanTestModal } from './components/ScanTestModal';
import { GuidesModal } from './components/GuidesModal';
import { InfoModals, InfoModalType } from './components/InfoModals';
import { ToastContainer, ToastMessage } from './components/Toast';
import { QRConfig, HistoryItem, ContentType } from './types';
import { DEFAULT_QR_CONFIG, PRESET_TEMPLATES, QUICK_LOGOS } from './utils/presets';
import { generateQrPayload, getContentSummary } from './utils/qrPayload';
import { downloadQRCode, copyQRCodeToClipboard } from './utils/qrExporter';
import { generateRandomSurpriseStyle } from './utils/randomizer';

const STORAGE_KEY_CONFIG = 'qr_studio_active_config_v1';
const STORAGE_KEY_HISTORY = 'qr_studio_history_v1';
const STORAGE_KEY_THEME = 'qr_studio_theme_v1';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // QR Configuration state
  const [config, setConfig] = useState<QRConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        return { ...DEFAULT_QR_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_QR_CONFIG;
  });

  // History state (Last 15 generated items)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Modals & Drawers state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryInitialMode, setGalleryInitialMode] = useState<'gallery' | 'save-dialog'>('gallery');
  const [isScanGuideOpen, setIsScanGuideOpen] = useState(false);
  const [scanGuideTopic, setScanGuideTopic] = useState<string | undefined>(undefined);
  const [isScanTestOpen, setIsScanTestOpen] = useState(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [initialGuideSlug, setInitialGuideSlug] = useState<string | undefined>(undefined);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>('privacy');

  const handleOpenScanGuide = useCallback((topic?: string) => {
    setScanGuideTopic(topic);
    setIsScanGuideOpen(true);
  }, []);

  const [customTemplatesCount, setCustomTemplatesCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('qr_studio_custom_templates_v1');
      if (saved) return JSON.parse(saved).length;
    } catch (e) {
      // ignore
    }
    return 0;
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (title: string, description?: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync theme class to <html> and <body>
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (darkMode) {
      root.classList.add('dark');
      body?.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      root.classList.remove('dark');
      body?.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  // Persist active configuration
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config]);

  // Persist history (limit to 15 items)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 15)));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Calculate current payload string
  const currentPayload = useMemo(() => {
    return generateQrPayload(config.contentType, config.contentData);
  }, [config.contentType, config.contentData]);

  // Automatically record to history debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!currentPayload || currentPayload === 'https://example.com') return;

      const summary = getContentSummary(config.contentType, config.contentData);
      setHistory((prev) => {
        // Prevent duplicate consecutive entries
        if (prev.length > 0 && prev[0].rawValue === currentPayload) {
          return prev;
        }
        const newItem: HistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          title: summary,
          timestamp: Date.now(),
          contentType: config.contentType,
          contentSummary: summary,
          rawValue: currentPayload,
          config,
          isFavorite: false,
        };
        return [newItem, ...prev.filter((item) => item.rawValue !== currentPayload)].slice(0, 15);
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentPayload, config]);

  // Surprise Me: Randomize high-contrast aesthetic combination
  const handleSurpriseMe = () => {
    const randomized = generateRandomSurpriseStyle(config);
    setConfig(randomized);
    addToast('Surprise Style Generated! 🎲', 'Generated unique scannable palette and module styling.', 'success');
  };

  // Reset to default
  const handleReset = () => {
    setConfig(DEFAULT_QR_CONFIG);
    addToast('Settings Reset', 'Restored to clean default layout.', 'info');
  };

  // Favorite toggle for current code
  const isCurrentFavorite = useMemo(() => {
    const match = history.find((h) => h.rawValue === currentPayload);
    return !!match?.isFavorite;
  }, [history, currentPayload]);

  const handleToggleCurrentFavorite = () => {
    setHistory((prev) => {
      const match = prev.find((h) => h.rawValue === currentPayload);
      if (match) {
        return prev.map((h) =>
          h.id === match.id ? { ...h, isFavorite: !h.isFavorite } : h
        );
      } else {
        const summary = getContentSummary(config.contentType, config.contentData);
        const newItem: HistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          title: summary,
          timestamp: Date.now(),
          contentType: config.contentType,
          contentSummary: summary,
          rawValue: currentPayload,
          config,
          isFavorite: true,
        };
        return [newItem, ...prev].slice(0, 15);
      }
    });

    addToast(
      isCurrentFavorite ? 'Removed from favorites' : 'Saved to favorites',
      undefined,
      'success'
    );
  };

  // Restore history item
  const handleRestoreHistory = (item: HistoryItem) => {
    setConfig(item.config);
    addToast('Restored QR code', item.contentSummary, 'info');
  };

  const handleToggleHistoryFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((h) => (h.id === id ? { ...h, isFavorite: !h.isFavorite } : h))
    );
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    addToast('Item removed from history');
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    addToast('History cleared');
  };

  // Template Gallery handlers
  const handleOpenGallery = () => {
    setGalleryInitialMode('gallery');
    setIsGalleryOpen(true);
  };

  const handleOpenSaveTemplate = () => {
    setGalleryInitialMode('save-dialog');
    setIsGalleryOpen(true);
  };

  const handleApplyTemplate = (partialConfig: Partial<QRConfig>, templateName: string) => {
    setConfig((prev) => {
      const templateHasLogo =
        partialConfig.hasLogo !== undefined
          ? partialConfig.hasLogo
          : Boolean(partialConfig.logo?.image);

      return {
        ...prev,
        ...partialConfig,
        hasLogo: templateHasLogo,
        logo: {
          ...(prev.logo || DEFAULT_QR_CONFIG.logo),
          ...(partialConfig.logo || {}),
        },
        frame: {
          ...(prev.frame || DEFAULT_QR_CONFIG.frame),
          ...(partialConfig.frame || {}),
        },
        effect3D: {
          ...(prev.effect3D || DEFAULT_QR_CONFIG.effect3D),
          ...(partialConfig.effect3D || {}),
        },
        gradient: {
          ...(prev.gradient || DEFAULT_QR_CONFIG.gradient),
          ...(partialConfig.gradient || {}),
        },
      };
    });
    addToast('Template Applied', `"${templateName}" style loaded into studio.`, 'success');
  };

  // Keyboard Shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        downloadQRCode(config, currentPayload, 'png', 2, 'qr-studio-code');
        addToast('Export started (Ctrl+S)', undefined, 'success');
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'r' && !isInput) {
        e.preventDefault();
        handleSurpriseMe();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 't' && !isInput) {
        e.preventDefault();
        handleOpenGallery();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b' && !isInput) {
        e.preventDefault();
        setIsBatchOpen((prev) => !prev);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'h' && !isInput) {
        e.preventDefault();
        setIsHistoryOpen((prev) => !prev);
        return;
      }

      if (e.key === 'Escape') {
        setIsHistoryOpen(false);
        setIsBatchOpen(false);
        setIsShortcutsOpen(false);
        setIsGalleryOpen(false);
        setIsScanGuideOpen(false);
      }

      if (e.key === '?' && !isInput) {
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config, currentPayload, addToast]);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'dark' : ''
      } bg-neutral-50/50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors overflow-x-hidden w-full max-w-full`}
    >
      {/* Top Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onSurpriseMe={handleSurpriseMe}
        onReset={handleReset}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onOpenGallery={handleOpenGallery}
        customTemplatesCount={customTemplatesCount}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        isBatchMode={isBatchOpen}
        onToggleBatchMode={() => setIsBatchOpen(true)}
        onOpenScanGuide={() => handleOpenScanGuide()}
        onOpenScanTest={() => setIsScanTestOpen(true)}
        onOpenGuides={(slug?: string) => {
          setInitialGuideSlug(slug);
          setIsGuidesOpen(true);
        }}
      />

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Content Inputs & Full Design Studio (7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Content Type Form */}
            <ContentForm
              contentType={config.contentType}
              contentData={config.contentData}
              onChangeType={(type: ContentType) =>
                setConfig({ ...config, contentType: type })
              }
              onChangeData={(data: Record<string, any>) =>
                setConfig({ ...config, contentData: data })
              }
              onChangeCustomRaw={(raw: string) =>
                setConfig({ ...config, customRawText: raw })
              }
            />

            {/* Step 2: Design & Styling Panel (Logo, Shapes, Colors, Frames, 3D, Presets) */}
            <DesignPanel
              config={config}
              onChangeConfig={setConfig}
              onToast={addToast}
              onOpenGallery={handleOpenGallery}
              onSaveAsTemplate={handleOpenSaveTemplate}
              onOpenScanGuide={handleOpenScanGuide}
            />
          </div>

          {/* Right Column: Sticky Live Preview & Action Exporter (5 Cols on desktop) */}
          <div className="lg:col-span-5">
            <QRPreview
              config={config}
              payload={currentPayload}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleCurrentFavorite}
              onToast={addToast}
              onOpenScanGuide={handleOpenScanGuide}
              onOpenScanTest={() => setIsScanTestOpen(true)}
              onSurpriseMe={handleSurpriseMe}
            />
          </div>
        </div>

        {/* SEO Landing Sections: How it works, Use Cases, Features, Trust Signals, FAQs */}
        <LandingSections
          onSelectContentType={(type: ContentType, sampleData?: any) => {
            setConfig((prev) => ({
              ...prev,
              contentType: type,
              contentData: sampleData || prev.contentData,
            }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenScanTest={() => setIsScanTestOpen(true)}
          onSurpriseMe={handleSurpriseMe}
          onOpenBatch={() => setIsBatchOpen(true)}
          onSelectTemplate={(templatePartial: Partial<QRConfig>) => {
            handleApplyTemplate(templatePartial, 'Use Case Preset');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenGuides={(slug?: string) => {
            setInitialGuideSlug(slug);
            setIsGuidesOpen(true);
          }}
          onOpenScanAdvisor={(topic?: string) => handleOpenScanGuide(topic)}
          onOpenInfoModal={(type: InfoModalType) => {
            setInfoModalType(type);
            setIsInfoModalOpen(true);
          }}
        />
      </main>

      {/* Comprehensive Rich Footer */}
      <Footer
        onOpenInfoModal={(type) => {
          setInfoModalType(type);
          setIsInfoModalOpen(true);
        }}
        onOpenGuides={(slug) => {
          setInitialGuideSlug(slug);
          setIsGuidesOpen(true);
        }}
        onOpenScanAdvisor={() => handleOpenScanGuide()}
        onOpenScanTest={() => setIsScanTestOpen(true)}
        onOpenBatch={() => setIsBatchOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Modals & Overlays */}
      <ScanTestModal
        isOpen={isScanTestOpen}
        onClose={() => setIsScanTestOpen(false)}
        currentConfig={config}
        currentPayload={currentPayload}
        onToast={addToast}
      />

      <GuidesModal
        isOpen={isGuidesOpen}
        onClose={() => setIsGuidesOpen(false)}
        initialSlug={initialGuideSlug}
        onSelectTemplate={(template) => {
          handleApplyTemplate(template, 'Guide Template');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenScanTest={() => setIsScanTestOpen(true)}
      />

      <InfoModals
        isOpen={isInfoModalOpen}
        modalType={infoModalType}
        onClose={() => setIsInfoModalOpen(false)}
      />
      <TemplateGallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        currentConfig={config}
        currentPayload={currentPayload}
        onApplyTemplate={handleApplyTemplate}
        onToast={addToast}
        initialMode={galleryInitialMode}
        onTemplatesCountChange={setCustomTemplatesCount}
      />

      <ScanabilityGuide
        isOpen={isScanGuideOpen}
        onClose={() => setIsScanGuideOpen(false)}
        config={config}
        payload={currentPayload}
        onUpdateConfig={(partial: Partial<QRConfig>) => {
          setConfig((prev) => ({ ...prev, ...partial }));
          addToast('Applied optimized scan settings', undefined, 'success');
        }}
        onToast={addToast}
        initialTopic={scanGuideTopic}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onRestore={handleRestoreHistory}
        onToggleFavorite={handleToggleHistoryFavorite}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      <BatchModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        config={config}
        onToast={addToast}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
