import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  Download,
  Palette,
  Layers,
  FileCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Utensils,
  Briefcase,
  Calendar,
  Share2,
  Wifi,
  Package,
  BookOpen,
  HelpCircle,
  Smartphone,
  Eye,
  Zap,
  Sliders,
} from 'lucide-react';
import { ContentType, QRConfig } from '../types';
import { QR_GUIDE_ARTICLES } from './GuidesModal';
import { InfoModalType } from './InfoModals';

interface LandingSectionsProps {
  onSelectContentType: (type: ContentType, sampleData?: any) => void;
  onOpenGuides: (guideSlug?: string) => void;
  onOpenScanAdvisor: (topic?: string) => void;
  onOpenScanTest: () => void;
  onSurpriseMe: () => void;
  onOpenBatch: () => void;
  onOpenInfoModal?: (type: InfoModalType) => void;
  onSelectTemplate?: (partialConfig: Partial<QRConfig>) => void;
}

export const LandingSections: React.FC<LandingSectionsProps> = ({
  onSelectContentType,
  onOpenGuides,
  onOpenScanAdvisor,
  onOpenScanTest,
  onSurpriseMe,
  onOpenBatch,
  onOpenInfoModal,
  onSelectTemplate,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const FAQS = [
    {
      q: 'Are these QR codes truly 100% free forever with no expiration?',
      a: 'Yes, absolutely. QR Studio generates permanent static QR codes where your data (URL, Wi-Fi password, vCard contact) is encoded directly into the optical matrix dots. Because no middleman redirect servers are used, your codes will function indefinitely without subscription renewals, limits, or ads.',
    },
    {
      q: 'Is my data and Wi-Fi password safe?',
      a: '100% yes. QR Studio operates purely on the client side inside your web browser using HTML5 Canvas and JavaScript. No payload strings, uploaded logos, or Wi-Fi credentials are ever sent to remote servers or stored in any database.',
    },
    {
      q: 'Which file format should I download for printing: SVG, PNG, or PDF?',
      a: 'For commercial print shops, vinyl banners, laser engraving, packaging, and business cards, always download SVG (Scalable Vector Graphics). SVGs scale infinitely to billboard size without losing crispness. For quick web sharing, social media, or email signatures, high-resolution PNG is ideal. For ready-to-print single sheets, use our PDF vector export.',
    },
    {
      q: 'Why do some custom-colored QR codes fail to scan?',
      a: 'Camera sensors require optical contrast (a minimum 4.5:1 luminance ratio) to separate dark modules from the light canvas. If you use pale yellow on white, or light gray on dark gray, older phones will struggle. Our built-in Scanability Advisor monitors contrast in real time and flags any risky color combinations.',
    },
    {
      q: 'Can I add my business logo without breaking scanability?',
      a: 'Yes! Simply keep Error Correction at Level H (30% Reed-Solomon redundancy) and keep your logo size within 18% - 24% of the canvas. This allows smartphone cameras to reconstruct any matrix dots covered by your logo.',
    },
    {
      q: 'Can I generate hundreds of QR codes at once for inventory or badges?',
      a: 'Yes. Use our Batch QR Generator (accessible via the top navigation bar) to upload a standard CSV spreadsheet and download all rendered vector QR codes packaged in a single ZIP archive.',
    },
  ];

  const USE_CASES = [
    {
      id: 'business',
      title: 'Business & Networking',
      tag: 'vCard & Profile',
      icon: Briefcase,
      color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40',
      description:
        'Put contact vCards on business cards so clients can save your phone number, email, and LinkedIn with a single camera tap.',
      type: 'vcard' as ContentType,
      sampleData: {
        firstName: 'Sarah',
        lastName: 'Jenkins',
        organization: 'Apex Media Group',
        title: 'Managing Director',
        phone: '+1 (555) 234-5678',
        email: 'sarah@apexmediagroup.com',
        url: 'https://apexmediagroup.com',
      },
    },
    {
      id: 'restaurant',
      title: 'Restaurants & Dining',
      tag: 'Contactless Menu',
      icon: Utensils,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40',
      description:
        'Replace sticky physical menus with stylish table-tent QR codes. Customers browse daily specials and order from their phones.',
      type: 'url' as ContentType,
      sampleData: {
        url: 'https://bistrolumiere.com/dinner-menu',
      },
    },
    {
      id: 'wifi',
      title: 'Cafes, Hotels & Offices',
      tag: 'Instant Wi-Fi',
      icon: Wifi,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40',
      description:
        'Let guests connect instantly without typing complicated passwords or asking staff repeatedly.',
      type: 'wifi' as ContentType,
      sampleData: {
        ssid: 'Lumiere_Guest_WiFi',
        password: 'WelcomeGuests2026',
        encryption: 'WPA',
        hidden: false,
      },
    },
    {
      id: 'events',
      title: 'Events & Ticketing',
      tag: 'RSVP & Calendar',
      icon: Calendar,
      color: 'from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400 border-violet-200/60 dark:border-violet-800/40',
      description:
        'Direct attendees to event registration pages, interactive venue maps, or one-tap calendar invites.',
      type: 'event' as ContentType,
      sampleData: {
        title: 'TechVision Global Summit 2026',
        location: 'Metro Convention Center, Hall B',
        startDate: '2026-10-15T09:00',
        endDate: '2026-10-15T18:00',
        description: 'Keynote sessions on future technology and design craftsmanship.',
      },
    },
    {
      id: 'social',
      title: 'Social Media & Creators',
      tag: 'Multi-link Hub',
      icon: Share2,
      color: 'from-pink-500/10 to-rose-500/10 text-pink-600 dark:text-pink-400 border-pink-200/60 dark:border-pink-800/40',
      description:
        'Grow followers faster. Display QR codes on YouTube video outros, Instagram stories, stream overlays, and merchandise.',
      type: 'url' as ContentType,
      sampleData: {
        url: 'https://instagram.com/qrstudio_official',
      },
    },
    {
      id: 'packaging',
      title: 'Retail & Packaging',
      tag: 'Manuals & Warranty',
      icon: Package,
      color: 'from-cyan-500/10 to-sky-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200/60 dark:border-cyan-800/40',
      description:
        'Print high-density vector QR codes on product boxes for quick video setup guides, PDF manuals, and warranty claims.',
      type: 'url' as ContentType,
      sampleData: {
        url: 'https://support.brandhardware.com/manual-setup',
      },
    },
  ];

  const FEATURES = [
    {
      title: 'Custom Brand Logo Support',
      desc: 'Embed any PNG, SVG, or JPG company logo into the center. Features smart auto-clearing so dots never clash with your brand icon.',
      badge: 'Smart Clear',
      icon: Sparkles,
    },
    {
      title: 'Linear & Radial Gradients',
      desc: 'Blend two-tone color spectrums with adjustable rotation angles, accompanied by real-time WCAG contrast telemetry.',
      badge: 'Contrast Safe',
      icon: Palette,
    },
    {
      title: '3D Tilt & Studio Perspective',
      desc: 'Simulate realistic phone angles, glossy card glare, elevation shadows, and bevel depths for marketing mockups.',
      badge: 'Interactive 3D',
      icon: Layers,
    },
    {
      title: 'Vector SVG, 4K PNG & PDF',
      desc: 'Export infinitely scalable vector SVGs for commercial offset printing or crisp 4K PNGs for web publishing.',
      badge: 'Print Ready',
      icon: Download,
    },
    {
      title: 'Call-to-Action Frame Banners',
      desc: 'Surround codes with styled promotional frames like "SCAN ME", "ORDER HERE", or "CONNECT WI-FI" to boost conversion by 40%.',
      badge: 'High Conversion',
      icon: Sliders,
    },
    {
      title: 'Bulk CSV Batch Generation',
      desc: 'Generate hundreds of customized QR codes at once from a CSV spreadsheet and download them as an organized ZIP archive.',
      badge: 'High Volume',
      icon: FileCheck,
    },
  ];

  return (
    <div className="mt-16 space-y-20 border-t border-neutral-200/70 dark:border-white/[0.06] pt-14 w-full max-w-full overflow-hidden">
      {/* 1. TRUST SIGNALS BANNER */}
      <section id="trust-signals" className="w-full">
        <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 text-white dark:bg-[#12121a] border border-neutral-800 dark:border-white/10 shadow-xl relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">100% Free & No Sign-up</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  No hidden trials, paywalls, or accounts required. Unlimited downloads forever.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Zero-Data Privacy</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  All rendering happens in your local browser. Your data never touches a server.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">No Watermarks</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Export clean, production-grade vector designs ready for commercial branding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">Never Expires</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Pure static encoding guarantees your QR codes work permanently without disruption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (3-4 STEPS) */}
      <section id="how-it-works" className="w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/40 uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-3 tracking-tight">
            How to Create a Custom QR Code in Seconds
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Follow these simple steps to generate high-contrast, fully branded QR codes that scan on the first try.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative p-6 rounded-3xl bg-white dark:bg-[#111118] border border-neutral-200/80 dark:border-white/[0.08] shadow-xs hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 font-black text-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
              Choose Content Type
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Select what you want to encode: Website URL, Wi-Fi Network, Contact vCard, Email, Phone, or Event Invite.
            </p>
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex items-center gap-1.5 text-[11px] font-semibold text-violet-600 dark:text-violet-400">
              <span>8 Standard Data Types</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 rounded-3xl bg-white dark:bg-[#111118] border border-neutral-200/80 dark:border-white/[0.08] shadow-xs hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 font-black text-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
              Style Shapes, Colors & Logo
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Personalize dot shapes, rounded finder eyes, curated brand color gradients, and upload your high-res company logo.
            </p>
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex items-center gap-1.5 text-[11px] font-semibold text-pink-600 dark:text-pink-400">
              <span>Automatic Background Clearing</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 rounded-3xl bg-white dark:bg-[#111118] border border-neutral-200/80 dark:border-white/[0.08] shadow-xs hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
              Verify Scanability
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Our real-time Scan Advisor checks contrast ratios, quiet zones, and ISO 18004 reliability with a one-click test scan.
            </p>
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <button
                type="button"
                onClick={onOpenScanTest}
                className="hover:underline flex items-center gap-1"
              >
                <span>Run Test Scan Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative p-6 rounded-3xl bg-white dark:bg-[#111118] border border-neutral-200/80 dark:border-white/[0.08] shadow-xs hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              04
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
              Download or Print
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Download razor-sharp vector SVG for commercial printing, 4K PNG for web sharing, or print-ready single-sheet PDF.
            </p>
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/[0.06] flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              <span>SVG • PNG • PDF Vector</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. USE CASES / WHO IS THIS FOR (INTERACTIVE CARDS) */}
      <section id="use-cases" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 uppercase tracking-wider">
              Tailored Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-3 tracking-tight">
              Who is QR Studio For?
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Click any industry card to instantly load pre-configured sample data into the generator.
            </p>
          </div>

          <button
            type="button"
            onClick={onSurpriseMe}
            className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400 dark:text-violet-600" />
            <span>🎲 Surprise Me / Random Style</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#111118] border border-neutral-200/80 dark:border-white/[0.08] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-violet-500/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br ${uc.color} border`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-white/[0.06]">
                      {uc.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
                    {uc.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {uc.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-neutral-100 dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectContentType(uc.type, uc.sampleData);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-neutral-50 hover:bg-violet-50 dark:bg-white/[0.03] dark:hover:bg-violet-950/40 text-neutral-700 hover:text-violet-700 dark:text-neutral-300 dark:hover:text-violet-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-neutral-200/60 dark:border-white/[0.06] hover:border-violet-300"
                  >
                    <span>Load Demo in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURES HIGHLIGHT */}
      <section id="features" className="w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 uppercase tracking-wider">
            Engineered for Precision
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-3 tracking-tight">
            Professional Features That Elevate Your Brand
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Every styling option is crafted to maintain optical scanability while providing complete creative freedom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#111118] border border-neutral-200/80 dark:border-white/[0.08] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/40">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. GUIDES & TUTORIALS SHOWCASE */}
      <section id="guides-preview" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/40 uppercase tracking-wider">
              Educational Guides & SEO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-3 tracking-tight">
              Master QR Code Design & Best Practices
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Read comprehensive guides to boost your print reliability and scan rates.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenGuides()}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-colors flex items-center gap-1.5"
          >
            <span>View All Guides</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QR_GUIDE_ARTICLES.slice(0, 3).map((art) => {
            const Icon = art.icon;
            return (
              <div
                key={art.id}
                onClick={() => onOpenGuides(art.slug)}
                className="p-6 rounded-3xl bg-white dark:bg-[#111118] border border-neutral-200/80 dark:border-white/[0.08] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group hover:border-violet-400"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300">
                      {art.category}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">{art.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-white/[0.06] flex items-center justify-between text-xs font-bold text-violet-600 dark:text-violet-400">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="faqs" className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 uppercase tracking-wider">
            Clear Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Everything you need to know about QR codes, pricing, privacy, and printing.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200/80 dark:border-white/[0.08] bg-white dark:bg-[#111118] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-neutral-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-violet-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-white/[0.04] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
