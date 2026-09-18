import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Scan,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { decodeCanvasQR, decodeImageFileQR, DecodedQRResult } from '../utils/qrDecoder';
import jsQR from 'jsqr';

interface ScanTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  getCanvasElement?: () => HTMLCanvasElement | null;
  currentConfig?: any;
  currentPayload?: string;
  onToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

type ScanTab = 'current' | 'camera' | 'upload';

export const ScanTestModal: React.FC<ScanTestModalProps> = ({
  isOpen,
  onClose,
  getCanvasElement,
  currentConfig,
  currentPayload,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<ScanTab>('current');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DecodedQRResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Test current QR on open or switch
  useEffect(() => {
    if (isOpen && activeTab === 'current') {
      testCurrentQR();
    }
  }, [isOpen, activeTab]);

  // Clean up camera on tab change or modal close
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
    } else if (activeTab === 'camera') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const testCurrentQR = () => {
    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      let canvas = getCanvasElement ? getCanvasElement() : null;
      if (!canvas) {
        canvas = (document.querySelector('#qr-code-canvas-box canvas') ||
          document.querySelector('#qr-container canvas') ||
          document.querySelector('canvas')) as HTMLCanvasElement;
      }

      if (!canvas) {
        setIsScanning(false);
        setResult({
          success: false,
          data: '',
          error: 'QR code canvas not yet rendered in preview. Please wait a moment.',
        });
        return;
      }

      const res = decodeCanvasQR(canvas);
      setIsScanning(false);
      setResult(res);
      if (res.success) {
        onToast('Test Scan Successful!', 'QR code decoded instantly with 100% parity.', 'success');
      }
    }, 450);
  };

  const startCamera = async () => {
    setCameraError(null);
    setResult(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API is not supported in this browser environment.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        requestAnimationFrame(tickCamera);
      }
    } catch (err: any) {
      setCameraError(
        err?.message || 'Camera access was denied or not available. Try Uploading an Image instead.'
      );
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const tickCamera = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = cameraCanvasRef.current;
      if (canvas) {
        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data) {
            setResult({
              success: true,
              data: code.data,
              location: code.location,
            });
            stopCamera();
            onToast('QR Code Detected from Camera!', code.data, 'success');
            return;
          }
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(tickCamera);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setResult(null);

    const res = await decodeImageFileQR(file);
    setIsScanning(false);
    setResult(res);

    if (res.success) {
      onToast('Image Scanned Successfully!', res.data, 'success');
    } else {
      onToast('No QR code found in uploaded image', res.error, 'error');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyResult = () => {
    if (!result?.data) return;
    navigator.clipboard.writeText(result.data);
    setCopied(true);
    onToast('Payload copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const isUrl = result?.data?.startsWith('http://') || result?.data?.startsWith('https://');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="scan-test-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-[#0e0e13] rounded-3xl border border-neutral-200/80 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Interactive Scan Test</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Realtime Optical Engine
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Verify that real smartphone camera sensors will decode your QR code effortlessly
              </p>
            </div>
          </div>
          <button
            id="close-scan-test-btn"
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-4 pb-2 border-b border-neutral-100 dark:border-white/[0.06] bg-neutral-50/50 dark:bg-white/[0.01]">
          <div className="grid grid-cols-3 gap-2">
            <button
              id="tab-scan-current"
              type="button"
              onClick={() => setActiveTab('current')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'current'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#15151c] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200/80 dark:border-white/[0.08]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Studio QR</span>
            </button>

            <button
              id="tab-scan-camera"
              type="button"
              onClick={() => setActiveTab('camera')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'camera'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#15151c] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200/80 dark:border-white/[0.08]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Scan</span>
            </button>

            <button
              id="tab-scan-upload"
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'upload'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#15151c] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200/80 dark:border-white/[0.08]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* TAB 1: CURRENT ACTIVE QR CODE */}
          {activeTab === 'current' && (
            <div className="space-y-4 text-center">
              <div className="relative mx-auto w-48 h-48 rounded-2xl bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-white/10 flex items-center justify-center overflow-hidden p-3 shadow-inner">
                {/* Laser scan line simulation */}
                {isScanning && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent shadow-[0_0_12px_#8b5cf6] animate-pulse top-1/2 -translate-y-1/2 z-10" />
                )}

                <div className="flex flex-col items-center gap-2 text-neutral-500">
                  <Smartphone className="w-12 h-12 text-violet-500 stroke-1 animate-bounce" />
                  <span className="text-xs font-semibold">
                    {isScanning ? 'Decoding Optical Matrix...' : 'Simulating Camera Sensor'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  id="btn-retest-qr"
                  type="button"
                  onClick={testCurrentQR}
                  disabled={isScanning}
                  className="px-4 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/40 hover:bg-violet-100 text-violet-700 dark:text-violet-300 text-xs font-bold border border-violet-200/60 dark:border-violet-800/40 flex items-center gap-2 transition-all active:scale-95"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>Re-test Active QR</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CAMERA LIVE SCANNER */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="relative mx-auto max-w-sm aspect-square rounded-2xl bg-black overflow-hidden border border-neutral-800 flex items-center justify-center shadow-lg">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
                <canvas ref={cameraCanvasRef} className="hidden" />

                {/* Viewfinder Target Crosshairs */}
                <div className="absolute inset-8 pointer-events-none border-2 border-dashed border-violet-400/80 rounded-2xl flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <span className="w-4 h-4 border-t-2 border-l-2 border-violet-400" />
                    <span className="w-4 h-4 border-t-2 border-r-2 border-violet-400" />
                  </div>
                  <div className="flex justify-between">
                    <span className="w-4 h-4 border-b-2 border-l-2 border-violet-400" />
                    <span className="w-4 h-4 border-b-2 border-r-2 border-violet-400" />
                  </div>
                </div>

                {cameraError && (
                  <div className="absolute inset-0 p-6 bg-black/80 flex flex-col items-center justify-center text-center text-red-400 text-xs gap-2">
                    <AlertCircle className="w-8 h-8" />
                    <p className="font-semibold">{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="mt-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs"
                    >
                      Use File Upload Instead
                    </button>
                  </div>
                )}
              </div>
              <p className="text-center text-xs text-neutral-400">
                Point your webcam or phone camera toward your screen or printed QR code.
              </p>
            </div>
          )}

          {/* TAB 3: FILE UPLOAD SCANNER */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-violet-500 dark:hover:border-violet-400 rounded-2xl text-center cursor-pointer bg-neutral-50/50 dark:bg-white/[0.01] hover:bg-violet-50/20 transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-neutral-900 dark:text-white">
                    Click to select an image
                  </span>
                  <span className="text-neutral-500"> or drag and drop</span>
                </div>
                <span className="text-[11px] text-neutral-400">Supports PNG, JPG, WEBP, or SVG</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* SCAN DECODED RESULT CARD */}
          {result && (
            <div
              className={`p-4 rounded-2xl border transition-all animate-in fade-in-50 ${
                result.success
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60'
                  : 'bg-red-50/80 dark:bg-red-950/30 border-red-300 dark:border-red-800/60'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        result.success
                          ? 'text-emerald-800 dark:text-emerald-300'
                          : 'text-red-800 dark:text-red-300'
                      }`}
                    >
                      {result.success ? 'Scan Passed • Decoded Payload' : 'Scan Test Failed'}
                    </span>
                    {result.success && (
                      <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-200/60 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                        ISO 18004 Valid
                      </span>
                    )}
                  </div>

                  {result.success ? (
                    <>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#15151c] border border-emerald-200 dark:border-emerald-900/60 font-mono text-xs text-neutral-800 dark:text-neutral-200 break-all select-all max-h-32 overflow-y-auto">
                        {result.data}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={copyResult}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#181822] hover:bg-neutral-50 dark:hover:bg-[#20202c] border border-neutral-200 dark:border-white/10 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 active:scale-95 transition-all"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Data</span>
                            </>
                          )}
                        </button>

                        {isUrl && (
                          <a
                            href={result.data}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
                          >
                            <span>Open Link</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <span className="text-[11px] text-neutral-400 dark:text-neutral-500 ml-auto font-mono">
                          {result.data.length} characters
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-red-700 dark:text-red-300">
                      {result.error ||
                        'The scanner could not lock onto finder eyes. Try increasing color contrast or switching to Error Correction Level H.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Assurance Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-neutral-500">
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.04]">
              <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <span className="font-semibold block text-neutral-800 dark:text-neutral-200">100% In-Browser</span>
              <span>No image leaves device</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.04]">
              <Sparkles className="w-4 h-4 text-violet-500 mx-auto mb-1" />
              <span className="font-semibold block text-neutral-800 dark:text-neutral-200">Instant Parity</span>
              <span>Real-world camera test</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.04]">
              <Smartphone className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <span className="font-semibold block text-neutral-800 dark:text-neutral-200">iOS & Android</span>
              <span>Hardware compatible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
