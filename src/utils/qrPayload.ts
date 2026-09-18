import { ContentType } from '../types';

export function generateQrPayload(contentType: ContentType, data: Record<string, any>): string {
  switch (contentType) {
    case 'url': {
      let url = (data.url || '').trim();
      if (!url) return 'https://example.com';
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      return url;
    }

    case 'text': {
      return data.text || 'Hello, World!';
    }

    case 'email': {
      const email = (data.email || '').trim();
      const subject = encodeURIComponent(data.subject || '');
      const body = encodeURIComponent(data.body || '');
      let query = '';
      if (subject || body) {
        const parts = [];
        if (subject) parts.push(`subject=${subject}`);
        if (body) parts.push(`body=${body}`);
        query = `?${parts.join('&')}`;
      }
      return `mailto:${email}${query}`;
    }

    case 'phone': {
      const phone = (data.phone || '').trim();
      return `tel:${phone || '+1234567890'}`;
    }

    case 'sms': {
      const phone = (data.phone || '').trim();
      const message = data.message || '';
      return `smsto:${phone}:${message}`;
    }

    case 'whatsapp': {
      const phone = (data.phone || '').replace(/[^0-9+]/g, '');
      const message = encodeURIComponent(data.message || '');
      return `https://wa.me/${phone}${message ? `?text=${message}` : ''}`;
    }

    case 'wifi': {
      const ssid = (data.ssid || '').replace(/([\\;,:"])/g, '\\$1');
      const password = (data.password || '').replace(/([\\;,:"])/g, '\\$1');
      const encryption = data.encryption || 'WPA';
      const hidden = data.hidden ? 'true' : 'false';
      return `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden};;`;
    }

    case 'vcard': {
      const fn = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'John Doe';
      const org = data.company || '';
      const title = data.title || '';
      const phone = data.phone || '';
      const email = data.email || '';
      const url = data.url || '';
      const street = data.street || '';
      const city = data.city || '';
      const state = data.state || '';
      const zip = data.zip || '';
      const country = data.country || '';

      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${data.lastName || ''};${data.firstName || ''};;;`,
        `FN:${fn}`,
      ];
      if (org) lines.push(`ORG:${org}`);
      if (title) lines.push(`TITLE:${title}`);
      if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
      if (email) lines.push(`EMAIL:${email}`);
      if (url) lines.push(`URL:${url}`);
      if (street || city || state || zip || country) {
        lines.push(`ADR;TYPE=WORK:;;${street};${city};${state};${zip};${country}`);
      }
      lines.push('END:VCARD');
      return lines.join('\n');
    }

    case 'location': {
      const lat = data.latitude || '';
      const lng = data.longitude || '';
      const query = (data.query || '').trim();
      if (query) {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      }
      if (lat && lng) {
        return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      }
      return 'https://maps.google.com';
    }

    case 'event': {
      const title = data.title || 'Special Event';
      const location = data.location || '';
      const description = data.description || '';
      const start = (data.startDate || '2026-10-01T10:00:00').replace(/[-:]/g, '');
      const end = (data.endDate || '2026-10-01T12:00:00').replace(/[-:]/g, '');

      return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${title}`,
        `LOCATION:${location}`,
        `DESCRIPTION:${description}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\n');
    }

    case 'social': {
      const platform = data.platform || 'instagram';
      const username = (data.username || '').trim().replace(/^@/, '');
      switch (platform) {
        case 'instagram':
          return `https://instagram.com/${username}`;
        case 'twitter':
          return `https://x.com/${username}`;
        case 'linkedin':
          return username.startsWith('http') ? username : `https://linkedin.com/in/${username}`;
        case 'github':
          return `https://github.com/${username}`;
        case 'youtube':
          return username.startsWith('http') ? username : `https://youtube.com/@${username}`;
        case 'tiktok':
          return `https://tiktok.com/@${username}`;
        case 'facebook':
          return username.startsWith('http') ? username : `https://facebook.com/${username}`;
        default:
          return `https://${platform}.com/${username}`;
      }
    }

    case 'crypto': {
      const currency = (data.currency || 'bitcoin').toLowerCase();
      const address = data.address || '';
      const amount = data.amount || '';
      if (!address) return 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
      if (currency === 'bitcoin') {
        return `bitcoin:${address}${amount ? `?amount=${amount}` : ''}`;
      } else if (currency === 'ethereum') {
        return `ethereum:${address}${amount ? `?value=${amount}` : ''}`;
      } else if (currency === 'solana') {
        return `solana:${address}${amount ? `?amount=${amount}` : ''}`;
      } else {
        return `${currency}:${address}${amount ? `?amount=${amount}` : ''}`;
      }
    }

    default:
      return 'https://example.com';
  }
}

export function getContentSummary(contentType: ContentType, data: Record<string, any>): string {
  switch (contentType) {
    case 'url':
      return data.url || 'https://example.com';
    case 'text':
      return data.text ? (data.text.length > 30 ? data.text.slice(0, 30) + '...' : data.text) : 'Plain text';
    case 'email':
      return data.email || 'Email address';
    case 'phone':
      return data.phone || 'Phone number';
    case 'sms':
      return `SMS to ${data.phone || 'Phone'}`;
    case 'whatsapp':
      return `WhatsApp: ${data.phone || 'Number'}`;
    case 'wifi':
      return `WiFi: ${data.ssid || 'Network'}`;
    case 'vcard':
      return `vCard: ${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Contact Card';
    case 'location':
      return data.query ? `Map: ${data.query}` : 'Map Location';
    case 'event':
      return `Event: ${data.title || 'Calendar Event'}`;
    case 'social':
      return `${data.platform || 'Social'}: @${data.username || ''}`;
    case 'crypto':
      return `${(data.currency || 'Crypto').toUpperCase()} Address`;
    default:
      return 'QR Code';
  }
}
