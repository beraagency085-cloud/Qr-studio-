import QRCodeStyling from 'qr-code-styling';
import { jsPDF } from 'jspdf';
import { QRConfig } from '../types';

/**
 * Builds an off-screen QRCodeStyling instance with targeted options
 */
export function createQRInstance(config: QRConfig, payload: string, size = 512): QRCodeStyling {
  // Dot options
  const dotsOptions: any = {
    type: config.dotType,
  };

  if (config.useGradient && config.gradient.colorStops.length > 0) {
    dotsOptions.gradient = {
      type: config.gradient.type,
      rotation: (config.gradient.rotation * Math.PI) / 180,
      colorStops: config.gradient.colorStops.map((stop) => ({
        offset: stop.offset,
        color: stop.color,
      })),
    };
  } else {
    dotsOptions.color = config.foregroundColor;
  }

  // Corners square options
  const cornersSquareOptions: any = {
    type: config.cornerSquareType,
    color: config.customCornerColors ? config.cornerSquareColor : config.foregroundColor,
  };

  // Corners dot options
  const cornersDotOptions: any = {
    type: config.cornerDotType,
    color: config.customCornerColors ? config.cornerDotColor : config.foregroundColor,
  };

  // Background options
  const backgroundOptions: any = {
    color: config.transparentBackground ? 'rgba(0,0,0,0)' : config.backgroundColor,
  };

  // Image / Logo - qr-code-styling requires imageOptions to always be an object with valid boolean/number fields
  const hasValidLogo = Boolean(config.hasLogo && config.logo?.image);
  const image = hasValidLogo ? config.logo?.image : undefined;
  const imageOptions = {
    hideBackgroundDots: hasValidLogo ? (config.logo?.hideBackgroundDots !== false) : false,
    imageSize: config.logo?.size ?? 0.28,
    margin: config.logo?.margin ?? 6,
    crossOrigin: 'anonymous',
  };

  return new QRCodeStyling({
    width: size,
    height: size,
    type: 'canvas',
    data: payload,
    image,
    margin: config.margin,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: hasValidLogo ? 'H' : config.errorCorrectionLevel,
    },
    imageOptions,
    dotsOptions,
    cornersSquareOptions,
    cornersDotOptions,
    backgroundOptions,
  });
}

/**
 * Renders the framed composite (or naked QR) to an HTMLCanvasElement
 */
export async function renderCompositeCanvas(
  config: QRConfig,
  payload: string,
  targetSize = 1024
): Promise<HTMLCanvasElement> {
  const qr = createQRInstance(config, payload, targetSize);
  const rawBlob = await qr.getRawData('png');
  if (!rawBlob) throw new Error('Failed to generate raw QR data');

  const img = new Image();
  const url = URL.createObjectURL(rawBlob as Blob);

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const frameStyle = config.frame.style;

  if (frameStyle === 'none') {
    canvas.width = targetSize;
    canvas.height = targetSize;
    if (!config.transparentBackground) {
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, targetSize, targetSize);
    }
    ctx.drawImage(img, 0, 0, targetSize, targetSize);
    URL.revokeObjectURL(url);
    return canvas;
  }

  // Handle framed exports with Figma-grade cards
  const padding = Math.round(targetSize * 0.08);
  const extraBottom =
    frameStyle === 'card-scan' ? Math.round(targetSize * 0.16) :
    frameStyle === 'polaroid' ? Math.round(targetSize * 0.22) :
    frameStyle === 'badge' ? Math.round(targetSize * 0.14) :
    padding;

  const extraTop = frameStyle === 'pill-top' ? Math.round(targetSize * 0.14) : padding;

  canvas.width = targetSize + padding * 2;
  canvas.height = targetSize + extraTop + extraBottom;

  // Background
  const cardBg = config.frame.bgColor || '#ffffff';
  ctx.fillStyle = cardBg;
  const radius = Math.round(targetSize * 0.04);

  // Rounded rectangle card
  drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, radius);
  ctx.fill();

  // Subtle border if required
  if (frameStyle === 'simple-border' || frameStyle === 'double-border') {
    ctx.strokeStyle = config.frame.frameColor;
    ctx.lineWidth = Math.round(targetSize * 0.015);
    drawRoundedRect(ctx, 6, 6, canvas.width - 12, canvas.height - 12, radius);
    ctx.stroke();

    if (frameStyle === 'double-border') {
      ctx.lineWidth = Math.round(targetSize * 0.008);
      drawRoundedRect(ctx, 16, 16, canvas.width - 32, canvas.height - 32, Math.max(2, radius - 8));
      ctx.stroke();
    }
  }

  // Draw QR code image
  ctx.drawImage(img, padding, extraTop, targetSize, targetSize);

  // Draw decorative scan banner or button
  const label = config.frame.labelText || 'SCAN ME';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (frameStyle === 'card-scan') {
    const btnW = Math.round(targetSize * 0.55);
    const btnH = Math.round(targetSize * 0.09);
    const btnX = (canvas.width - btnW) / 2;
    const btnY = canvas.height - padding - btnH / 2 - Math.round(targetSize * 0.02);

    ctx.fillStyle = config.frame.frameColor;
    drawRoundedRect(ctx, btnX, btnY, btnW, btnH, btnH / 2);
    ctx.fill();

    ctx.fillStyle = config.frame.textColor || '#ffffff';
    ctx.font = `bold ${Math.round(btnH * 0.42)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(label, canvas.width / 2, btnY + btnH / 2);
  } else if (frameStyle === 'polaroid' || frameStyle === 'badge') {
    ctx.fillStyle = config.frame.textColor || config.frame.frameColor;
    ctx.font = `700 ${Math.round(targetSize * 0.045)}px "Plus Jakarta Sans", sans-serif`;
    const textY = canvas.height - extraBottom / 2;
    ctx.fillText(label, canvas.width / 2, textY);
  } else if (frameStyle === 'pill-top') {
    const btnW = Math.round(targetSize * 0.5);
    const btnH = Math.round(targetSize * 0.08);
    const btnX = (canvas.width - btnW) / 2;
    const btnY = Math.round(extraTop * 0.2);

    ctx.fillStyle = config.frame.frameColor;
    drawRoundedRect(ctx, btnX, btnY, btnW, btnH, btnH / 2);
    ctx.fill();

    ctx.fillStyle = config.frame.textColor || '#ffffff';
    ctx.font = `bold ${Math.round(btnH * 0.45)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(label, canvas.width / 2, btnY + btnH / 2);
  }

  URL.revokeObjectURL(url);
  return canvas;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Download QR Code in specific format and resolution
 */
export async function downloadQRCode(
  config: QRConfig,
  payload: string,
  format: 'png' | 'jpeg' | 'svg' | 'pdf',
  scaleMultiplier = 2,
  filename = 'qrcode'
): Promise<void> {
  const baseSize = config.resolution || 512;
  const targetSize = Math.min(2048, baseSize * scaleMultiplier);

  if (format === 'svg') {
    // If no frame, export native vector SVG directly from qr-code-styling
    const qr = createQRInstance(config, payload, targetSize);
    await qr.download({
      name: filename,
      extension: 'svg',
    });
    return;
  }

  const canvas = await renderCompositeCanvas(config, payload, targetSize);

  if (format === 'pdf') {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    // Center on A4 (210mm x 297mm)
    const printW = 120;
    const printH = (canvas.height / canvas.width) * printW;
    const posX = (210 - printW) / 2;
    const posY = (297 - printH) / 2;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text(filename.replace(/[-_]/g, ' ').toUpperCase(), 105, posY - 10, { align: 'center' });
    pdf.addImage(imgData, 'PNG', posX, posY, printW, printH);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(120, 120, 120);
    pdf.text('Generated with QR Studio • Scan with any smartphone camera', 105, posY + printH + 12, { align: 'center' });

    pdf.save(`${filename}.pdf`);
    return;
  }

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL(mimeType, 0.95);
  const anchor = document.createElement('a');
  anchor.download = `${filename}.${format}`;
  anchor.href = dataUrl;
  anchor.click();
}

/**
 * Copy PNG image directly to system clipboard
 */
export async function copyQRCodeToClipboard(config: QRConfig, payload: string): Promise<boolean> {
  try {
    const canvas = await renderCompositeCanvas(config, payload, 1024);
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          resolve(true);
        } catch (e) {
          console.error('Clipboard write error:', e);
          resolve(false);
        }
      }, 'image/png');
    });
  } catch (err) {
    console.error('Copy QR error:', err);
    return false;
  }
}

/**
 * Share via Web Share API
 */
export async function shareQRCode(config: QRConfig, payload: string, title = 'My QR Code'): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    const canvas = await renderCompositeCanvas(config, payload, 1024);
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          const file = new File([blob], 'qrcode.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title,
              text: 'Scan this QR Code',
              files: [file],
            });
            resolve(true);
          } else {
            await navigator.share({
              title,
              text: payload,
            });
            resolve(true);
          }
        } catch (err) {
          if ((err as any).name !== 'AbortError') {
            console.error('Share error:', err);
          }
          resolve(false);
        }
      }, 'image/png');
    });
  } catch {
    return false;
  }
}

/**
 * Generates a lightweight PNG base64 thumbnail snapshot of the current QR design
 */
export async function generateTemplateThumbnail(
  config: QRConfig,
  payload = 'https://example.com'
): Promise<string> {
  const canvas = await renderCompositeCanvas(config, payload, 220);
  return canvas.toDataURL('image/png', 0.85);
}
