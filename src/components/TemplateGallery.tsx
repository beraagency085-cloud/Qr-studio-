import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutTemplate,
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  Search,
  Download,
  Upload,
  Sparkles,
  Camera,
  Copy,
  Clock,
  Palette,
  ExternalLink,
} from 'lucide-react';
import { QRConfig, SavedTemplate } from '../types';
import { PRESET_TEMPLATES } from '../utils/presets';
import { generateTemplateThumbnail } from '../utils/qrExporter';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: QRConfig;
  currentPayload: string;
  onApplyTemplate: (config: Partial<QRConfig>, templateName: string) => void;
  onToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
  initialMode?: 'gallery' | 'save-dialog';
  onTemplatesCountChange?: (count: number) => void;
}

const STORAGE_KEY_TEMPLATES = 'qr_studio_custom_templates_v1';

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  isOpen,
  onClose,
  currentConfig,
  currentPayload,
  onApplyTemplate,
  onToast,
  initialMode = 'gallery',
  onTemplatesCountChange,
}) => {
  // Custom templates loaded from localStorage
  const [customTemplates, setCustomTemplates] = useState<SavedTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEMPLATES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load custom templates from localStorage', e);
    }
    return [];
  });

  // Modal tab: 'gallery' or 'save-dialog'
  const [viewMode, setViewMode] = useState<'gallery' | 'save-dialog'>(initialMode);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'custom' | 'system'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Save Dialog Form State
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Template State
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize count changes to parent
  useEffect(() => {
    onTemplatesCountChange?.(customTemplates.length);
  }, [customTemplates.length, onTemplatesCountChange]);

  // Sync custom templates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(customTemplates));
    } catch (e) {
      console.error('Failed to persist custom templates', e);
    }
  }, [customTemplates]);

  // Handle initialMode when opening
  useEffect(() => {
    if (isOpen) {
      if (initialMode === 'save-dialog') {
        handleOpenSaveDialog();
      } else {
        setViewMode('gallery');
      }
    }
  }, [isOpen, initialMode]);

  // When opening Save Dialog, generate snapshot thumbnail of current design
  const handleOpenSaveDialog = async () => {
    setViewMode('save-dialog');
    setNewTemplateName(
      `Custom ${currentConfig.dotType.charAt(0).toUpperCase() + currentConfig.dotType.slice(1)} Style`
    );
    setNewTemplateDesc('');
    setIsGeneratingThumbnail(true);

    try {
      const thumb = await generateTemplateThumbnail(currentConfig, currentPayload || 'https://example.com');
      setThumbnailPreview(thumb);
    } catch (err) {
      console.error('Failed to generate thumbnail', err);
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  // Save new template
  const handleSaveTemplate = async () => {
    if (!newTemplateName.trim()) {
      onToast('Template name required', 'Please give your template a memorable name.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // Ensure we have a snapshot thumbnail
      let thumb = thumbnailPreview;
      if (!thumb) {
        thumb = await generateTemplateThumbnail(currentConfig, currentPayload || 'https://example.com');
      }

      const newTemplate: SavedTemplate = {
        id: 'tmpl_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
        name: newTemplateName.trim(),
        description: newTemplateDesc.trim() || undefined,
        createdAt: Date.now(),
        thumbnail: thumb,
        config: { ...currentConfig },
        isBuiltIn: false,
      };

      setCustomTemplates((prev) => [newTemplate, ...prev]);
      onToast('Template Saved!', `"${newTemplate.name}" added to your template library.`, 'success');
      setViewMode('gallery');
      setCategoryFilter('custom');
    } catch (err) {
      console.error(err);
      onToast('Failed to save template', 'An error occurred during template creation.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a custom template
  const handleDeleteTemplate = (id: string, name: string) => {
    setCustomTemplates((prev) => prev.filter((t) => t.id !== id));
    onToast('Template Deleted', `"${name}" removed from templates.`, 'info');
  };

  // Rename a template
  const handleStartRename = (template: SavedTemplate) => {
    setEditingTemplateId(template.id);
    setEditedName(template.name);
  };

  const handleSaveRename = (id: string) => {
    if (!editedName.trim()) return;
    setCustomTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: editedName.trim() } : t))
    );
    setEditingTemplateId(null);
    onToast('Template Renamed', undefined, 'success');
  };

  // Export custom templates as JSON
  const handleExportTemplates = () => {
    if (customTemplates.length === 0) {
      onToast('No custom templates to export', undefined, 'info');
      return;
    }
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(customTemplates, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `qr_studio_templates_${Date.now()}.json`);
    downloadAnchor.click();
    onToast('Templates Exported', 'JSON file downloaded successfully.', 'success');
  };

  // Import custom templates from JSON
  const handleImportTemplates = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          // Validate basic structure
          const valid = imported.filter((item) => item.id && item.name && item.config);
          if (valid.length > 0) {
            setCustomTemplates((prev) => {
              const existingIds = new Set(prev.map((p) => p.id));
              const newItems = valid.filter((v) => !existingIds.has(v.id));
              return [...newItems, ...prev];
            });
            onToast('Import Successful', `Added ${valid.length} template(s).`, 'success');
          } else {
            onToast('Invalid template file', 'No valid templates found in JSON.', 'error');
          }
        }
      } catch (err) {
        console.error(err);
        onToast('Import Failed', 'Could not parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  // Filter templates
  const filteredCustom = customTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSystem = PRESET_TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      id="template-gallery-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        id="template-gallery-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#0e0e13] border border-neutral-200/80 dark:border-white/[0.08] rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200/80 dark:border-white/[0.06] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white">
                  Design Template Library
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800/60">
                  {customTemplates.length} Custom Saved
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Browse curated production styles or capture your active design with real-time snapshots
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === 'gallery' ? (
              <button
                id="btn-open-save-dialog"
                type="button"
                onClick={handleOpenSaveDialog}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Save Current Style</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setViewMode('gallery')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
              >
                Back to Gallery
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ========================================================= */}
          {/* VIEW: SAVE CURRENT AS TEMPLATE DIALOG */}
          {/* ========================================================= */}
          {viewMode === 'save-dialog' ? (
            <div className="max-w-xl mx-auto space-y-5 py-2">
              <div className="text-center space-y-1">
                <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                  Save Design Configuration
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Captures your active geometry, colors, gradient, logo, 3D effect, and frame.
                </p>
              </div>

              {/* Snapshot Preview Card */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-neutral-50/70 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.08]">
                <div className="w-40 h-40 rounded-2xl bg-white dark:bg-[#15151c] border border-neutral-200/80 dark:border-white/[0.08] shadow-sm flex items-center justify-center overflow-hidden relative">
                  {isGeneratingThumbnail ? (
                    <div className="flex flex-col items-center gap-2 text-neutral-400">
                      <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[11px]">Capturing snapshot...</span>
                    </div>
                  ) : thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Template Thumbnail"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-xs text-neutral-400">Preview</span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 mt-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                  Thumbnail snapshot generated directly from current canvas
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Template Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-new-template-name"
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="e.g. Obsidian Royal or Minimal Clean"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50/80 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/[0.08] focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Description or Usage Tag (Optional)
                  </label>
                  <input
                    id="input-new-template-desc"
                    type="text"
                    value={newTemplateDesc}
                    onChange={(e) => setNewTemplateDesc(e.target.value)}
                    placeholder="e.g. Luxury business cards, VIP event badges"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50/80 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/[0.08] focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                {/* Configuration Specs Summary */}
                <div className="p-4 rounded-2xl bg-neutral-50/70 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.08] text-xs space-y-2 text-neutral-600 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>Pattern Geometry:</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-200 capitalize">
                      {currentConfig.dotType} dots • {currentConfig.cornerSquareType} eyes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Branding Logo:</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                      {currentConfig.hasLogo ? currentConfig.logo.name || 'Custom Logo Attached' : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visual Treatment:</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-200 capitalize">
                      {currentConfig.frame.style !== 'none' ? currentConfig.frame.style : 'Clean QR'}
                      {currentConfig.effect3D.enabled ? ` • 3D (${currentConfig.effect3D.style})` : ''}
                    </span>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('gallery')}
                    className="flex-1 py-2.5 rounded-xl border border-neutral-200/80 dark:border-white/[0.08] text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-confirm-save-template"
                    type="button"
                    onClick={handleSaveTemplate}
                    disabled={isSaving || !newTemplateName.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-violet-500/20 disabled:opacity-50 transition-all active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save to Template Gallery'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* VIEW: TEMPLATE GALLERY CARDS */
            /* ========================================================= */
            <div className="space-y-6">
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-neutral-50/80 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/[0.08] focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Filter Chips & Import/Export */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex p-1 rounded-xl bg-neutral-100/80 dark:bg-white/[0.04] border border-neutral-200/80 dark:border-white/[0.08]">
                    {(['all', 'custom', 'system'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                          categoryFilter === cat
                            ? 'bg-white dark:bg-[#16161f] text-violet-700 dark:text-violet-300 shadow-2xs font-bold ring-1 ring-violet-500/20'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                        }`}
                      >
                        {cat === 'all' ? 'All' : cat === 'custom' ? `My Saved (${customTemplates.length})` : 'System'}
                      </button>
                    ))}
                  </div>

                  {/* Export & Import Buttons */}
                  <div className="flex items-center gap-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportTemplates}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-colors border border-neutral-200/60 dark:border-white/[0.06]"
                      title="Import templates from JSON"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleExportTemplates}
                      className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/[0.05] transition-colors border border-neutral-200/60 dark:border-white/[0.06]"
                      title="Export custom templates to JSON file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECTION: MY CUSTOM SAVED TEMPLATES */}
              {/* ========================================================= */}
              {(categoryFilter === 'all' || categoryFilter === 'custom') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      My Saved Templates ({filteredCustom.length})
                    </h4>
                  </div>

                  {filteredCustom.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl border-2 border-dashed border-neutral-200/80 dark:border-white/[0.08] bg-neutral-50/40 dark:bg-white/[0.01] space-y-2">
                      <LayoutTemplate className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto" />
                      <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        No custom templates saved yet
                      </p>
                      <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                        Customize your QR with logos, gradients, or frames and save it here to reuse anytime!
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenSaveDialog}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 mt-2 rounded-xl text-xs font-bold bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/60 border border-violet-200/80 dark:border-violet-800/40 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Save Active Design
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredCustom.map((tmpl) => {
                        const isEditing = editingTemplateId === tmpl.id;
                        return (
                          <div
                            key={tmpl.id}
                            id={`saved-template-card-${tmpl.id}`}
                            className="group rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#121218] hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-lg transition-all flex flex-col overflow-hidden"
                          >
                            {/* Thumbnail Snapshot Container */}
                            <div className="h-40 bg-neutral-50 dark:bg-[#16161f] flex items-center justify-center p-3 relative border-b border-neutral-200/80 dark:border-white/[0.08]">
                              <img
                                src={tmpl.thumbnail}
                                alt={tmpl.name}
                                className="max-h-full max-w-full object-contain drop-shadow-sm rounded-lg"
                              />

                              {/* Apply Template Overlay Button */}
                              <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onApplyTemplate(tmpl.config, tmpl.name);
                                    onClose();
                                  }}
                                  className="py-2 px-4 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-lg hover:bg-violet-500 active:scale-95 transition-all flex items-center gap-1.5"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Apply Design</span>
                                </button>
                              </div>

                              {/* Timestamp Badge */}
                              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xs text-[10px] text-neutral-500 font-mono">
                                {new Date(tmpl.createdAt).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>

                            {/* Card Details & Actions */}
                            <div className="p-3.5 flex-1 flex flex-col justify-between gap-2">
                              <div>
                                {isEditing ? (
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={editedName}
                                      onChange={(e) => setEditedName(e.target.value)}
                                      className="w-full px-2 py-1 text-xs rounded-lg bg-white dark:bg-neutral-900 border border-violet-500 font-semibold"
                                      autoFocus
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleSaveRename(tmpl.id)}
                                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between gap-1">
                                    <h5 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                                      {tmpl.name}
                                    </h5>
                                    <button
                                      type="button"
                                      onClick={() => handleStartRename(tmpl)}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-opacity"
                                      title="Rename"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}

                                {tmpl.description && (
                                  <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                                    {tmpl.description}
                                  </p>
                                )}
                              </div>

                              {/* Specs & Delete Footer */}
                              <div className="flex items-center justify-between pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 text-[10px] text-neutral-400">
                                <span className="capitalize">
                                  {tmpl.config.dotType} • {tmpl.config.frame.style}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTemplate(tmpl.id, tmpl.name)}
                                  className="text-neutral-400 hover:text-rose-500 p-1 rounded transition-colors"
                                  title="Delete template"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* SECTION: SYSTEM BUILT-IN PRESETS */}
              {/* ========================================================= */}
              {(categoryFilter === 'all' || categoryFilter === 'system') && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Curated Production Presets ({filteredSystem.length})
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredSystem.map((tmpl) => (
                      <div
                        key={tmpl.id}
                        id={`system-template-card-${tmpl.id}`}
                        onClick={() => {
                          onApplyTemplate(tmpl.config, tmpl.name);
                          onClose();
                        }}
                        className="group p-4 rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#121218] hover:border-violet-500 dark:hover:border-violet-500 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tmpl.previewGradient} shrink-0 shadow-sm flex items-center justify-center text-white`}
                          >
                            <Sparkles className="w-5 h-5 opacity-90" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                                {tmpl.name}
                              </h5>
                              <span className="text-[10px] text-neutral-400 font-normal">
                                • {tmpl.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5">
                              {tmpl.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 text-violet-600 dark:text-violet-400 font-medium">
                          <span>Click to Apply</span>
                          <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-200/80 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.02] flex items-center justify-between text-xs text-neutral-400">
          <span>Saved templates are stored client-side in localStorage for maximum privacy</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-neutral-200/80 dark:border-white/[0.08] text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-100 dark:hover:bg-white/[0.05]"
          >
            Close Gallery
          </button>
        </div>
      </div>
    </div>
  );
};
