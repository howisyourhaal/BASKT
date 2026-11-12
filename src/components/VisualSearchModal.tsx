import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Sparkles, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { VisualSearchResult } from '../types';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (searchTerm: string, category?: string) => void;
}

const SAMPLE_PRESETS = [
  {
    title: 'Ergonomic Mouse',
    subtitle: 'Logitech MX Series',
    image: '/src/assets/images/baskt_electronics_mouse_1794467495655.jpg',
    category: 'Electronics',
    query: 'Logitech MX Master 3S',
  },
  {
    title: 'Swiss Steel Watch',
    subtitle: 'Tissot PRX 80',
    image: '/src/assets/images/baskt_watch_tissot_1794467496890.jpg',
    category: 'Watches',
    query: 'Tissot PRX Powermatic',
  },
  {
    title: 'Niche Fragrance',
    subtitle: 'Le Labo Santal 33',
    image: '/src/assets/images/baskt_perfume_lelabo_1794467497150.jpg',
    category: 'Perfume / Toiletries',
    query: 'Le Labo Santal 33',
  },
  {
    title: 'Designer Crossbody Bag',
    subtitle: 'Songmont Reset Tofu',
    image: '/src/assets/images/baskt_bag_songmont_1794467497216.jpg',
    category: 'Branded Bags',
    query: 'Songmont',
  },
];

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<VisualSearchResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      analyzeImage(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (preset: typeof SAMPLE_PRESETS[0]) => {
    setSelectedImage(preset.image);
    setIsScanning(true);
    setErrorMsg(null);
    setResult(null);

    try {
      // Fetch preset image to convert to base64
      const response = await fetch(preset.image);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        analyzeImage(base64, blob.type);
      };
      reader.readAsDataURL(blob);
    } catch {
      // Fallback
      setTimeout(() => {
        setIsScanning(false);
        setResult({
          identifiedName: preset.title,
          brand: preset.subtitle,
          category: preset.category as any,
          attributes: ['Precision Craftsmanship', 'Elevated Everyday', 'Verified Deals'],
          suggestedQuery: preset.query,
          confidence: 0.96,
        });
      }, 900);
    }
  };

  const analyzeImage = async (base64: string, mimeType: string) => {
    setIsScanning(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch('/api/search/visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });

      if (!res.ok) {
        throw new Error('Visual recognition service unavailable');
      }

      const data = await res.json();
      setResult({
        identifiedName: data.identifiedName || 'Detected Merchandise',
        brand: data.brand || 'Premium Brand',
        category: data.category || 'Electronics',
        attributes: data.attributes || ['Elevated Design', 'Verified Model'],
        suggestedQuery: data.suggestedQuery || data.identifiedName || '',
        confidence: data.confidence || 0.9,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not analyze image. Please try again or select one of the presets.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleApplyResult = () => {
    if (result) {
      onSelectResult(result.suggestedQuery || result.identifiedName, result.category);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-neutral-900 text-white rounded-lg">
              <Camera className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-950">Visual Price Search Lens</h2>
              <p className="text-xs text-neutral-500">
                Snap or upload a photo to identify models and find the cheapest price.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-neutral-50/50 hover:bg-neutral-50 flex flex-col items-center justify-center space-y-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="p-3 bg-white rounded-full shadow-xs border border-neutral-200 text-neutral-700">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-neutral-800">
              Click to upload photo or take picture
            </div>
            <div className="text-[11px] text-neutral-400">
              Supports JPEG, PNG, WebP up to 15MB
            </div>
          </div>

          {/* Preset Samples */}
          <div>
            <div className="text-xs font-semibold text-neutral-600 mb-2.5">
              Or try instant sample snapshots:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="group text-left border border-neutral-200 hover:border-neutral-900 rounded-xl overflow-hidden p-2 transition-all bg-white hover:shadow-xs flex flex-col"
                >
                  <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-2">
                    <img
                      src={preset.image}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="text-xs font-semibold text-neutral-900 truncate">
                    {preset.title}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate">
                    {preset.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Preview & AI Scanning Result */}
          {selectedImage && (
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/70 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-200 shrink-0 border border-neutral-300 relative">
                  <img
                    src={selectedImage}
                    alt="Uploaded candidate"
                    className="w-full h-full object-cover"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  {isScanning ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        <span>Scanning product geometry & catalog...</span>
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Analyzing brand markings, dial textures, and product silhouettes...
                      </div>
                    </div>
                  ) : result ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Product Match Identified ({Math.round(result.confidence * 100)}% Match)</span>
                      </div>
                      <div className="text-sm font-bold text-neutral-950">
                        {result.identifiedName}
                      </div>
                      <div className="text-xs text-neutral-500">
                        Brand: <strong>{result.brand}</strong> · Category: {result.category}
                      </div>
                    </div>
                  ) : errorMsg ? (
                    <div className="text-xs text-red-600">{errorMsg}</div>
                  ) : null}
                </div>
              </div>

              {result && (
                <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1 text-[11px] text-neutral-600">
                    {result.attributes.map((attr, idx) => (
                      <span key={idx} className="bg-white border border-neutral-200 px-2 py-0.5 rounded">
                        {attr}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={handleApplyResult}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shadow-xs"
                  >
                    <span>View Price Comparison</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
