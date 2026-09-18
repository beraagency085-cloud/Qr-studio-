import jsQR from 'jsqr';

export interface DecodedQRResult {
  success: boolean;
  data: string;
  error?: string;
  location?: {
    topLeftCorner: { x: number; y: number };
    topRightCorner: { x: number; y: number };
    bottomRightCorner: { x: number; y: number };
    bottomLeftCorner: { x: number; y: number };
  };
}

/**
 * Decodes a QR code directly from a HTMLCanvasElement or ImageData
 */
export function decodeCanvasQR(canvas: HTMLCanvasElement): DecodedQRResult {
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      return { success: false, data: '', error: 'Could not access canvas context' };
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });

    if (code && code.data) {
      return {
        success: true,
        data: code.data,
        location: code.location,
      };
    }

    return {
      success: false,
      data: '',
      error: 'No QR code pattern detected in the image',
    };
  } catch (err: any) {
    return {
      success: false,
      data: '',
      error: err?.message || 'Decoding failed',
    };
  }
}

/**
 * Decodes a QR code from an Image file or Data URL
 */
export async function decodeImageFileQR(fileOrUrl: File | string): Promise<DecodedQRResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ success: false, data: '', error: 'Canvas context initialization failed' });
          return;
        }

        ctx.drawImage(img, 0, 0);
        const res = decodeCanvasQR(canvas);
        resolve(res);
      } catch (e: any) {
        resolve({ success: false, data: '', error: e?.message || 'Error processing image' });
      }
    };

    img.onerror = () => {
      resolve({ success: false, data: '', error: 'Failed to load image for scanning' });
    };

    if (typeof fileOrUrl === 'string') {
      img.src = fileOrUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        resolve({ success: false, data: '', error: 'Failed to read image file' });
      };
      reader.readAsDataURL(fileOrUrl);
    }
  });
}
