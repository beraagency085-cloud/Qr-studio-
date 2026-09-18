import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Wifi,
  Sparkles,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  QrCode,
  Layers,
  ChevronRight,
  Palette,
} from 'lucide-react';
import { ContentType } from '../types';

export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Branding' | 'Reliability' | 'Connectivity' | 'Strategy';
  readTime: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  summary: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
      takeaway?: string;
      checklist?: string[];
    }[];
    faq: { q: string; a: string }[];
  };
  suggestedAction?: {
    label: string;
    actionType: 'type' | 'preset' | 'advisor';
    target: ContentType | string;
  };
}

export const QR_GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: 'logo-guide',
    slug: 'how-to-create-qr-code-with-logo',
    title: 'How to Create a QR Code with a Logo (Without Breaking Scans)',
    subtitle: 'Step-by-step branding guide for embedding crisp company icons safely',
    category: 'Branding',
    readTime: '4 min read',
    icon: Sparkles,
    tags: ['Logo Design', 'Reed-Solomon Level H', 'Brand Identity', 'Vector SVG'],
    summary:
      'Learn how to embed your company logo into QR codes while preserving 100% optical readability across all iOS and Android smartphone cameras.',
    content: {
      intro:
        'A custom logo turns an anonymous black-and-white pixel grid into a recognizable branded asset. However, placing a logo occludes the QR matrix. Here is how to guarantee flawless scans.',
      sections: [
        {
          heading: '1. Switch Error Correction to Level H (30%)',
          body: 'QR codes use Reed-Solomon mathematical parity bits. Standard QR codes use Level M (15% redundancy). When placing a logo in the center, you are physically covering up to 20% of the dots. By raising error correction to Level H, up to 30% of the entire code can be obstructed or damaged while remaining 100% readable.',
          takeaway: 'Never place a logo on Level L (7%) — older cameras will fail instantly.',
          checklist: [
            'Turn on Error Correction Level H before adding your logo',
            'Leave a minimum 3-module margin around the logo so it does not merge with nearby dots',
          ],
        },
        {
          heading: '2. Optimal Logo Sizing (18% to 25% Rule)',
          body: 'Your logo should occupy between 18% and 24% of the total QR code canvas width. If the logo is too small, users cannot recognize your brand. If the logo is too large (> 30%), camera sensor algorithms cannot reconstruct the underlying data payload.',
          takeaway: 'Our studio automatically scales and clears the background under your logo.',
        },
        {
          heading: '3. Protect the Three Position Finder Eyes',
          body: 'QR readers locate and orient the matrix using the three large square eyes located at the top-left, top-right, and bottom-left corners. Keep your logo centered and never let logo artwork overlap or intrude into these three corner squares.',
          takeaway: 'Never place corner icons that compete with the three finder eyes.',
        },
      ],
      faq: [
        {
          q: 'Can I use transparent PNG logos?',
          a: 'Yes! Transparent PNGs look cleanest. In QR Studio, our smart logo engine creates a soft halo or margin so dark logos never blend into dark pattern modules.',
        },
        {
          q: 'Will my logo-embedded QR code work on older Android phones?',
          a: 'Yes, provided you keep contrast high (> 7:1) and use Reed-Solomon Level H.',
        },
      ],
    },
    suggestedAction: {
      label: 'Try Logo Customizer',
      actionType: 'preset',
      target: 'design',
    },
  },
  {
    id: 'wifi-guide',
    slug: 'wifi-qr-code-guide',
    title: 'The Ultimate Wi-Fi QR Code Guide (Instant Guest Connect)',
    subtitle: 'Allow guests and restaurant customers to join your network in 1 second without typing passwords',
    category: 'Connectivity',
    readTime: '3 min read',
    icon: Wifi,
    tags: ['Wi-Fi', 'WPA3 / WPA2', 'Hospitality', 'Office Network'],
    summary:
      'Everything you need to know about generating safe, instant-connect Wi-Fi QR codes for cafes, hotels, Airbnbs, and modern office spaces.',
    content: {
      intro:
        'Typing 16-character alphanumeric passwords into smartphones is frustrating and prone to errors. With a standardized Wi-Fi QR code (`WIFI:S:MyNetwork;T:WPA;P:SecretKey;;`), any smartphone instantly displays a "Join Network" prompt with a single camera tap.',
      sections: [
        {
          heading: '1. How Wi-Fi QR Codes Work Natively',
          body: 'Both Apple iOS (Camera app) and Google Android (Google Lens & Native Camera) natively parse the Wi-Fi protocol string without installing any 3rd-party software. When scanned, the phone automatically negotiates SSID encryption and connects.',
          takeaway: 'No app download or browser visit required — purely native OS connection.',
        },
        {
          heading: '2. Network Security Protocols (WPA/WPA2/WPA3 vs Open)',
          body: 'Always verify your network security standard. Most modern routers use WPA/WPA2-Personal or WPA3. If your network has no password, select "None" to generate an open join token.',
          checklist: [
            'Exact case sensitivity matters for SSID names (e.g., "Guest_WiFi" vs "guest_wifi")',
            'Check the "Hidden SSID" toggle if your router does not broadcast its network beacon',
          ],
        },
        {
          heading: '3. Best Practices for Table Tents & Counter Signs',
          body: 'Print the Wi-Fi QR code at minimum 3.5cm x 3.5cm (1.4" x 1.4") so patrons can scan from their seats. Use a frame banner with the callout "CONNECT TO FREE WI-FI".',
          takeaway: 'Glossy acrylic table stands prevent glare while keeping printouts clean.',
        },
      ],
      faq: [
        {
          q: 'Is sharing Wi-Fi via QR code secure?',
          a: 'Yes. The QR code contains the same password you would manually speak or write on a chalkboard. Only people in optical sight of the code can scan and join.',
        },
        {
          q: 'Does it work for 5GHz and 2.4GHz bands?',
          a: 'Yes, phones will connect to whichever band matches your SSID name automatically.',
        },
      ],
    },
    suggestedAction: {
      label: 'Create Wi-Fi QR Code Now',
      actionType: 'type',
      target: 'wifi',
    },
  },
  {
    id: 'practices-guide',
    slug: 'best-qr-code-practices',
    title: 'Best QR Code Practices: Sizing, Contrast & Print Checklist',
    subtitle: 'Industry-standard guidelines to ensure your QR codes scan on the first attempt, every time',
    category: 'Reliability',
    readTime: '5 min read',
    icon: ShieldCheck,
    tags: ['ISO 18004', 'Quiet Zone', 'Print Sizing', 'Color Contrast'],
    summary:
      'Avoid costly print reprints by following the golden rules of QR code design: optical contrast ratios, minimum print dimensions, and quiet zone safety buffers.',
    content: {
      intro:
        'A QR code that fails to scan damages customer trust and wastes printing budgets. Following three foundational rules ensures 100% scan success across all hardware.',
      sections: [
        {
          heading: '1. The 10:1 Scan Distance Formula',
          body: 'As a universal rule of thumb, the size of the QR code should be roughly 1/10th of the reading distance. For example, if someone scans a business card at 20 cm distance, the code must be at least 2 cm wide. For a billboard scanned from 10 meters away, the QR code must be at least 1 meter wide.',
          takeaway: 'Minimum absolute print size for small items (business cards) is 20mm x 20mm (0.8").',
          checklist: [
            'Business cards / flyers: 2.0 cm - 3.5 cm (0.8" - 1.4")',
            'Table tents / posters: 5.0 cm - 8.0 cm (2.0" - 3.2")',
            'Store windows / banners: 15.0 cm - 30.0 cm (6" - 12")',
          ],
        },
        {
          heading: '2. High Optical Contrast (Minimum 4.5:1)',
          body: 'Mobile camera sensors convert color images into high-contrast grayscale thresholds to detect modules. Dark foreground modules against a light background yield the fastest auto-focus. Avoid light yellow, pastel gray, or inverted white dots on light gray.',
          takeaway: 'Our built-in Contrast Telemetry meter warns you whenever ratio dips under 4.5:1.',
        },
        {
          heading: '3. Never Omit the Quiet Zone',
          body: 'The Quiet Zone is the blank margin framing the entire QR matrix. Per ISO 18004 specifications, it must be at least 4 modules wide. If text, packaging lines, or edge trims touch the outer dots, mobile scanners cannot delineate the matrix boundaries.',
          takeaway: 'Leave at least 4px - 8px margin in QR Studio before downloading.',
        },
      ],
      faq: [
        {
          q: 'Should I download SVG or PNG for print?',
          a: 'Always choose SVG (Scalable Vector Graphics) for high-resolution print, foil stamping, laser engraving, and packaging. SVGs remain razor-sharp at infinite resolution.',
        },
        {
          q: 'Do static QR codes ever expire?',
          a: 'Never! Static QR codes directly store the destination text or URL inside the matrix dots. As long as your website exists, the QR code will function forever.',
        },
      ],
    },
    suggestedAction: {
      label: 'Open Scan Advisor',
      actionType: 'advisor',
      target: 'diagnostic',
    },
  },
  {
    id: 'static-dynamic-guide',
    slug: 'static-vs-dynamic-qr-codes',
    title: 'Static vs Dynamic QR Codes: Which Do You Actually Need?',
    subtitle: 'Understanding the key differences in privacy, permanence, data storage, and scan tracking',
    category: 'Strategy',
    readTime: '3 min read',
    icon: Layers,
    tags: ['Static vs Dynamic', 'Privacy First', 'No Subscription', 'Data Security'],
    summary:
      'Compare static in-browser QR codes versus subscription-based dynamic codes to make the best decision for your business.',
    content: {
      intro:
        'Many online QR services charge $20 to $50/month under the guise of "dynamic codes," only to hijack your links or display ads when subscriptions expire. Here is why pure static QR codes are superior for 90% of business needs.',
      sections: [
        {
          heading: '1. What is a Static QR Code?',
          body: 'A static QR code encodes your raw data (such as https://yourwebsite.com or Wi-Fi credentials) directly into the module dots. When a user points their camera, the phone decodes the data locally with zero middleman servers.',
          takeaway: '100% Free, permanent forever, zero risk of third-party downtime or redirection hijack.',
          checklist: [
            'Zero recurring monthly bills',
            'Complete data privacy — no third party tracks your customer visits',
            'Will continue to work 50 years from now',
          ],
        },
        {
          heading: '2. When Do You Need Dynamic vs Static?',
          body: 'If you want to track marketing campaign ROI, use your own Google Analytics UTM parameters (e.g. `?utm_source=flyer&utm_campaign=summer`) inside a static QR code! You receive free analytics inside your own Google Analytics dashboard without paying a middleman.',
          takeaway: 'Add UTM campaign parameters directly in our Website URL builder.',
        },
      ],
      faq: [
        {
          q: 'Why do other websites show broken codes when free trials end?',
          a: 'Commercial QR generators route users through their proprietary redirect servers. When your trial ends, they deactivate the redirect. QR Studio creates direct, un-hijackable static codes that are yours forever.',
        },
      ],
    },
    suggestedAction: {
      label: 'Build Static URL QR',
      actionType: 'type',
      target: 'url',
    },
  },
];

interface GuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGuideSlug?: string;
  initialSlug?: string;
  onSelectContentType?: (type: ContentType) => void;
  onOpenScanAdvisor?: (topic?: string) => void;
  onOpenDesignTab?: () => void;
  onSelectTemplate?: (template: any) => void;
  onOpenScanTest?: () => void;
}

export const GuidesModal: React.FC<GuidesModalProps> = ({
  isOpen,
  onClose,
  initialGuideSlug,
  initialSlug,
  onSelectContentType,
  onOpenScanAdvisor,
  onOpenDesignTab,
  onSelectTemplate,
  onOpenScanTest,
}) => {
  const targetSlug = initialSlug || initialGuideSlug;
  const [selectedGuideId, setSelectedGuideId] = useState<string>(
    () => {
      if (targetSlug) {
        const found = QR_GUIDE_ARTICLES.find(
          (a) => a.slug === targetSlug || a.id === targetSlug
        );
        if (found) return found.id;
      }
      return QR_GUIDE_ARTICLES[0].id;
    }
  );

  if (!isOpen) return null;

  const currentArticle =
    QR_GUIDE_ARTICLES.find((a) => a.id === selectedGuideId) || QR_GUIDE_ARTICLES[0];

  const handleAction = (action?: GuideArticle['suggestedAction']) => {
    if (!action) return;
    onClose();
    if (action.actionType === 'type' && onSelectContentType) {
      onSelectContentType(action.target as ContentType);
    } else if (action.actionType === 'advisor' && onOpenScanAdvisor) {
      onOpenScanAdvisor(action.target as string);
    } else if (action.actionType === 'preset' && onOpenDesignTab) {
      onOpenDesignTab();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="guides-blog-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl bg-white dark:bg-[#0e0e13] rounded-3xl border border-neutral-200/80 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]"
      >
        {/* Left Sidebar: Guide List */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-white/[0.08] bg-neutral-50/70 dark:bg-white/[0.01] flex flex-col shrink-0">
          <div className="p-5 border-b border-neutral-100 dark:border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Knowledge Base & Guides
                </h3>
                <p className="text-[11px] text-neutral-500">Expert QR tutorials & best practices</p>
              </div>
            </div>
          </div>

          <div className="p-3 space-y-1.5 overflow-y-auto max-h-56 md:max-h-full flex-1">
            {QR_GUIDE_ARTICLES.map((article) => {
              const Icon = article.icon;
              const isSelected = article.id === currentArticle.id;
              return (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => setSelectedGuideId(article.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'hover:bg-neutral-200/60 dark:hover:bg-white/[0.05] text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-200/70 dark:bg-white/[0.06] text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          isSelected ? 'text-violet-200' : 'text-violet-600 dark:text-violet-400'
                        }`}
                      >
                        {article.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono ${
                          isSelected ? 'text-violet-200' : 'text-neutral-400'
                        }`}
                      >
                        {article.readTime}
                      </span>
                    </div>
                    <p
                      className={`text-xs font-bold leading-snug line-clamp-2 ${
                        isSelected ? 'text-white' : 'text-neutral-900 dark:text-white'
                      }`}
                    >
                      {article.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Article Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0e0e13]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/40">
                {currentArticle.category}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {currentArticle.readTime}
              </span>
            </div>
            <button
              id="close-guides-btn"
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-neutral-800 dark:text-neutral-200">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
                {currentArticle.title}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 font-medium">
                {currentArticle.subtitle}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {currentArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-white/[0.04] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Intro Lead */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.06] text-xs md:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {currentArticle.content.intro}
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {currentArticle.content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2.5">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-600" />
                    <span>{sec.heading}</span>
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {sec.body}
                  </p>

                  {sec.checklist && (
                    <div className="p-3.5 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 space-y-1.5 my-2">
                      <span className="text-[11px] font-bold text-violet-800 dark:text-violet-300 uppercase tracking-wider block">
                        Recommended Checklist:
                      </span>
                      {sec.checklist.map((item, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.takeaway && (
                    <div className="text-xs font-semibold text-violet-700 dark:text-violet-300 pl-3 border-l-2 border-violet-500">
                      Pro-tip: {sec.takeaway}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* FAQs */}
            {currentArticle.content.faq.length > 0 && (
              <div className="pt-4 border-t border-neutral-100 dark:border-white/[0.06] space-y-3">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-violet-500" />
                  <span>Frequently Asked Questions</span>
                </h4>
                <div className="space-y-2.5">
                  {currentArticle.content.faq.map((item, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-3.5 rounded-xl bg-neutral-50/80 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.05]"
                    >
                      <span className="text-xs font-bold text-neutral-900 dark:text-white block mb-1">
                        {item.q}
                      </span>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            {currentArticle.suggestedAction && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <h5 className="text-sm font-bold">Ready to apply these techniques?</h5>
                  <p className="text-xs text-violet-100">
                    Jump straight into the generator with optimal settings pre-configured.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAction(currentArticle.suggestedAction)}
                  className="px-4 py-2.5 rounded-xl bg-white text-violet-900 hover:bg-neutral-100 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 shrink-0"
                >
                  <span>{currentArticle.suggestedAction.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
