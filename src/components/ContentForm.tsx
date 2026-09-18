import React, { useState } from 'react';
import {
  Link as LinkIcon,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  Wifi,
  UserCheck,
  MapPin,
  Calendar,
  Share2,
  Coins,
  Code2,
  Eye,
  EyeOff,
  Sparkles,
  Check,
} from 'lucide-react';
import { ContentType } from '../types';
import { generateQrPayload } from '../utils/qrPayload';

interface ContentFormProps {
  contentType: ContentType;
  contentData: Record<string, any>;
  customRawText?: string;
  onChangeType: (type: ContentType) => void;
  onChangeData: (data: Record<string, any>) => void;
  onChangeCustomRaw: (raw: string) => void;
}

interface ContentTypeTab {
  id: ContentType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CONTENT_TYPES: ContentTypeTab[] = [
  { id: 'url', label: 'URL', icon: LinkIcon },
  { id: 'text', label: 'Text', icon: FileText },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'sms', label: 'SMS', icon: MessageSquare },
  { id: 'whatsapp', label: 'WhatsApp', icon: Share2 },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'vcard', label: 'vCard', icon: UserCheck },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'event', label: 'Event', icon: Calendar },
  { id: 'social', label: 'Social', icon: Share2 },
  { id: 'crypto', label: 'Crypto', icon: Coins },
];

export const ContentForm: React.FC<ContentFormProps> = ({
  contentType,
  contentData,
  onChangeType,
  onChangeData,
}) => {
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  const updateField = (key: string, value: any) => {
    onChangeData({ ...contentData, [key]: value });
  };

  const payload = generateQrPayload(contentType, contentData);

  // Quick-fill sample data
  const handleLoadSample = () => {
    switch (contentType) {
      case 'url':
        onChangeData({ url: 'https://figma.com/@qrstudio' });
        break;
      case 'text':
        onChangeData({ text: 'Welcome to QR Studio! Scan to unlock our latest release.' });
        break;
      case 'email':
        onChangeData({
          email: 'hello@brand.studio',
          subject: 'Partnership Inquiry',
          body: 'Hi Team, I scanned your QR code and would love to collaborate!',
        });
        break;
      case 'phone':
        onChangeData({ phone: '+1 (555) 349-9201' });
        break;
      case 'sms':
        onChangeData({ phone: '+1 (555) 839-2041', message: 'Hello! I am scanning from your poster.' });
        break;
      case 'whatsapp':
        onChangeData({ phone: '+15553499201', message: 'Hi, I would like to book an appointment!' });
        break;
      case 'wifi':
        onChangeData({
          ssid: 'Studio_Guest_5G',
          password: 'supersecretwifi',
          encryption: 'WPA',
          hidden: false,
        });
        break;
      case 'vcard':
        onChangeData({
          firstName: 'Alex',
          lastName: 'Morgan',
          company: 'Creative Labs',
          title: 'Design Director',
          phone: '+1 (415) 890-1200',
          email: 'alex@creativelabs.io',
          url: 'https://creativelabs.io',
          street: '550 Howard St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          country: 'USA',
        });
        break;
      case 'location':
        onChangeData({
          query: 'Empire State Building, New York, NY',
          latitude: '40.748817',
          longitude: '-73.985428',
        });
        break;
      case 'event':
        onChangeData({
          title: 'Design Tech Summit 2026',
          location: 'Moscone Center, SF',
          description: 'Keynote session & design system workshop.',
          startDate: '2026-10-15T09:00',
          endDate: '2026-10-15T18:00',
        });
        break;
      case 'social':
        onChangeData({ platform: 'instagram', username: 'figmadesign' });
        break;
      case 'crypto':
        onChangeData({
          currency: 'bitcoin',
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          amount: '0.005',
        });
        break;
    }
  };

  return (
    <div
      id="content-input-card"
      className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0e0e13] border border-neutral-200/80 dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] transition-all"
    >
      <div className="flex items-center justify-between gap-2 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Content & Data Destination
            </h2>
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            Choose what opens or triggers when this code is scanned
          </p>
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 border border-violet-200/60 dark:border-violet-800/50 transition-all active:scale-95 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Fill Demo Data</span>
        </button>
      </div>

      {/* Content Type Selector Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 p-1.5 rounded-2xl bg-neutral-100/80 dark:bg-white/[0.04] border border-neutral-200/60 dark:border-white/[0.06] mb-6">
        {CONTENT_TYPES.map((tab) => {
          const Icon = tab.icon;
          const isActive = contentType === tab.id;
          return (
            <button
              key={tab.id}
              id={`content-tab-${tab.id}`}
              type="button"
              onClick={() => onChangeType(tab.id)}
              className={`flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 rounded-xl text-xs transition-all ${
                isActive
                  ? 'bg-white dark:bg-[#16161f] text-violet-700 dark:text-violet-300 font-bold shadow-xs border border-neutral-200/80 dark:border-white/[0.1] ring-1 ring-violet-500/20'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.02] font-medium'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'opacity-70'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Specific Type Input Fields */}
      <div className="space-y-4">
        {contentType === 'url' && (
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Website URL
            </label>
            <div className="relative">
              <input
                id="input-url"
                type="url"
                value={contentData.url || ''}
                onChange={(e) => updateField('url', e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full pl-3 pr-10 py-2.5 rounded-xl text-sm bg-neutral-50/70 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/[0.08] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none font-mono transition-colors"
              />
              <LinkIcon className="absolute right-3.5 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1.5">
              Supports standard HTTP/HTTPS links, deep links, or redirects.
            </p>
          </div>
        )}

        {contentType === 'text' && (
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Plain Text or Note
            </label>
            <textarea
              id="input-text"
              rows={3}
              value={contentData.text || ''}
              onChange={(e) => updateField('text', e.target.value)}
              placeholder="Enter message, instructions, serial number, or note..."
              className="w-full p-3 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans transition-colors resize-none"
            />
          </div>
        )}

        {contentType === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Recipient Email
              </label>
              <input
                id="input-email-to"
                type="email"
                value={contentData.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="contact@company.com"
                className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Subject (Optional)
                </label>
                <input
                  id="input-email-subject"
                  type="text"
                  value={contentData.subject || ''}
                  onChange={(e) => updateField('subject', e.target.value)}
                  placeholder="Hello!"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Pre-filled Body (Optional)
                </label>
                <input
                  id="input-email-body"
                  type="text"
                  value={contentData.body || ''}
                  onChange={(e) => updateField('body', e.target.value)}
                  placeholder="Inquiry about services..."
                  className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                />
              </div>
            </div>
          </div>
        )}

        {contentType === 'phone' && (
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <input
                id="input-phone"
                type="tel"
                value={contentData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full pl-3 pr-10 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <Phone className="absolute right-3 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Include country code for international compatibility (e.g. +1, +44).
            </p>
          </div>
        )}

        {contentType === 'sms' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Phone Number
              </label>
              <input
                id="input-sms-phone"
                type="tel"
                value={contentData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Pre-filled SMS Message
              </label>
              <textarea
                id="input-sms-message"
                rows={2}
                value={contentData.message || ''}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Text message to send..."
                className="w-full p-3 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
              />
            </div>
          </div>
        )}

        {contentType === 'whatsapp' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                WhatsApp Phone Number (with Country Code)
              </label>
              <input
                id="input-whatsapp-phone"
                type="tel"
                value={contentData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+14155552671 (no dashes or spaces)"
                className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Initial Chat Message (Optional)
              </label>
              <input
                id="input-whatsapp-msg"
                type="text"
                value={contentData.message || ''}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Hello! Let's connect on WhatsApp"
                className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
          </div>
        )}

        {contentType === 'wifi' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Network Name (SSID)
                </label>
                <input
                  id="input-wifi-ssid"
                  type="text"
                  value={contentData.ssid || ''}
                  onChange={(e) => updateField('ssid', e.target.value)}
                  placeholder="Home_WiFi_5G"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Encryption
                </label>
                <select
                  id="select-wifi-encryption"
                  value={contentData.encryption || 'WPA'}
                  onChange={(e) => updateField('encryption', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>
            </div>

            {contentData.encryption !== 'nopass' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="input-wifi-password"
                    type={showWifiPassword ? 'text' : 'password'}
                    value={contentData.password || ''}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="Enter network password"
                    className="w-full pl-3 pr-10 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWifiPassword(!showWifiPassword)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                id="checkbox-wifi-hidden"
                type="checkbox"
                checked={!!contentData.hidden}
                onChange={(e) => updateField('hidden', e.target.checked)}
                className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                Hidden Network (SSID is not broadcasting)
              </span>
            </label>
          </div>
        )}

        {contentType === 'vcard' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  First Name
                </label>
                <input
                  id="input-vcard-firstname"
                  type="text"
                  value={contentData.firstName || ''}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="Jane"
                  className="w-full px-3 py-1.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Last Name
                </label>
                <input
                  id="input-vcard-lastname"
                  type="text"
                  value={contentData.lastName || ''}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Doe"
                  className="w-full px-3 py-1.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Company / Organization
                </label>
                <input
                  id="input-vcard-company"
                  type="text"
                  value={contentData.company || ''}
                  onChange={(e) => updateField('company', e.target.value)}
                  placeholder="Design Inc"
                  className="w-full px-3 py-1.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Job Title
                </label>
                <input
                  id="input-vcard-title"
                  type="text"
                  value={contentData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Senior Partner"
                  className="w-full px-3 py-1.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Phone
                </label>
                <input
                  id="input-vcard-phone"
                  type="tel"
                  value={contentData.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3 py-1.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Email
                </label>
                <input
                  id="input-vcard-email"
                  type="email"
                  value={contentData.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="jane@doe.com"
                  className="w-full px-3 py-1.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Website
              </label>
              <input
                id="input-vcard-url"
                type="url"
                value={contentData.url || ''}
                onChange={(e) => updateField('url', e.target.value)}
                placeholder="https://janedoe.com"
                className="w-full px-3 py-1.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800"
              />
            </div>
          </div>
        )}

        {contentType === 'location' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Location Address or Place Name
              </label>
              <input
                id="input-location-query"
                type="text"
                value={contentData.query || ''}
                onChange={(e) => updateField('query', e.target.value)}
                placeholder="Eiffel Tower, Paris or 1600 Amphitheatre Pkwy"
                className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>
            <div className="text-center text-xs text-neutral-400">or precise GPS coordinates</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Latitude
                </label>
                <input
                  id="input-location-lat"
                  type="text"
                  value={contentData.latitude || ''}
                  onChange={(e) => updateField('latitude', e.target.value)}
                  placeholder="37.7749"
                  className="w-full px-3 py-1.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Longitude
                </label>
                <input
                  id="input-location-lng"
                  type="text"
                  value={contentData.longitude || ''}
                  onChange={(e) => updateField('longitude', e.target.value)}
                  placeholder="-122.4194"
                  className="w-full px-3 py-1.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {contentType === 'event' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Event Title
              </label>
              <input
                id="input-event-title"
                type="text"
                value={contentData.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Design Showcase 2026"
                className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Starts At
                </label>
                <input
                  id="input-event-start"
                  type="datetime-local"
                  value={contentData.startDate || '2026-10-15T10:00'}
                  onChange={(e) => updateField('startDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Ends At
                </label>
                <input
                  id="input-event-end"
                  type="datetime-local"
                  value={contentData.endDate || '2026-10-15T12:00'}
                  onChange={(e) => updateField('endDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Location or Zoom Link
              </label>
              <input
                id="input-event-location"
                type="text"
                value={contentData.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="Grand Ballroom / https://meet.google.com/..."
                className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800"
              />
            </div>
          </div>
        )}

        {contentType === 'social' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Social Platform
                </label>
                <select
                  id="select-social-platform"
                  value={contentData.platform || 'instagram'}
                  onChange={(e) => updateField('platform', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800"
                >
                  <option value="instagram">Instagram</option>
                  <option value="twitter">X (formerly Twitter)</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Handle or Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-neutral-400 text-sm">@</span>
                  <input
                    id="input-social-username"
                    type="text"
                    value={contentData.username || ''}
                    onChange={(e) => updateField('username', e.target.value.replace(/^@/, ''))}
                    placeholder="username"
                    className="w-full pl-7 pr-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {contentType === 'crypto' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Cryptocurrency
                </label>
                <select
                  id="select-crypto-currency"
                  value={contentData.currency || 'bitcoin'}
                  onChange={(e) => updateField('currency', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800"
                >
                  <option value="bitcoin">Bitcoin (BTC)</option>
                  <option value="ethereum">Ethereum (ETH)</option>
                  <option value="solana">Solana (SOL)</option>
                  <option value="usdt">Tether (USDT)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Wallet Address
                </label>
                <input
                  id="input-crypto-address"
                  type="text"
                  value={contentData.address || ''}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Enter wallet address"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Amount (Optional)
              </label>
              <input
                id="input-crypto-amount"
                type="text"
                value={contentData.amount || ''}
                onChange={(e) => updateField('amount', e.target.value)}
                placeholder="0.05"
                className="w-full px-3 py-2 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Payload info & Character count bar */}
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
        <span className="truncate max-w-[260px] sm:max-w-md font-mono" title={payload}>
          Raw: {payload}
        </span>
        <span className="shrink-0 ml-2 font-medium">
          {payload.length} chars
        </span>
      </div>
    </div>
  );
};
