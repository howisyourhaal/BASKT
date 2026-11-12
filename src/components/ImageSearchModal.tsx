import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Loader2, Sparkles, Check, ArrowRight, RefreshCw } from 'lucide-react';

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIdentifySuccess: (result: {
    productName: string;
    brand: string;
    category: string;
    estimatedPriceSGD: number;
    recommendedQuery: string;
  }) => void;
}

// Sample presets for instant testing
const PRESET_SAMPLES = [
  {
    name: 'Tissot PRX Watch',
    url: '/src/assets/images/baskt_hero_watch_1794467220057.jpg',
    category: 'Watches',
  },
  {
    name: 'Santal 33 Perfume',
    url: '/src/assets/images/baskt_perfume_amber_1794467217907.jpg',
    category: 'Perfume/Toiletries',
  },
  {
    name: 'Sony WH-1000XM5',
    url: '/src/assets/images/baskt_audio_headphones_1794467218124.jpg',
    category: 'Electronics',
  },
  {
    name: 'Porter Tanker Bag',
    url: '/src/assets/images/baskt_artisan_bag_1794467219321.jpg',
    category: 'Branded Bags',
  },
  {
    name: 'Raw Manuka Honey',
    url: '/src/assets/images/baskt_organic_honey_1794467219456.jpg',
    category: 'Organic Expensive Food',
  },
];

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  isOpen,
  onClose,
  onIdentifySuccess,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (presetUrl: string) => {
    try {
      setError(null);
      setResult(null);
      setSelectedImage(presetUrl);
      setAnalyzing(true);

      // Fetch the preset image to convert to base64
      const response = await fetch(presetUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        analyzeImage(base64);
      };
      reader.readAsDataURL(blob);
    } catch {
      setAnalyzing(false);
      setError('Could not load preset sample.');
    }
  };

  const analyzeImage = async (base64: string) => {
    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/identify-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: 'image/jpeg',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze product image');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with vision intelligence model.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyResult = () => {
    if (!result) return;
    onIdentifySuccess(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">Visual Product Search</h3>
              <p className="text-xs text-stone-500">Multimodal Gemini AI Product Recognition</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Upload or Drop Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              selectedImage
                ? 'border-stone-300 bg-stone-50/50'
                : 'border-stone-300 hover:border-stone-900 bg-stone-50/50 hover:bg-stone-100/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {selectedImage ? (
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-32 rounded-lg overflow-hidden border border-stone-200 shadow-sm bg-stone-100 mb-2">
                  <img
                    src={selectedImage}
                    alt="Uploaded Product"
                    className="w-full h-full object-cover"
                  />
                  {analyzing && (
                    <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[2px] flex items-center justify-center text-white">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                </div>
                <span className="text-xs text-stone-500 flex items-center gap-1 hover:text-stone-900">
                  <RefreshCw className="w-3 h-3" /> Change or upload another photo
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-600 mx-auto flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-stone-900">Click to upload photo</span>
                  <span className="text-sm text-stone-500"> or drag and drop</span>
                </div>
                <p className="text-xs text-stone-400">
                  PNG, JPG, or WEBP of watches, perfumes, audio gear, bags, or luxury food
                </p>
              </div>
            )}
          </div>

          {/* Quick Presets */}
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Or Try A Preset Elevated Good:
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {PRESET_SAMPLES.map(sample => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => handleSelectPreset(sample.url)}
                  className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200/70 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-4 h-4 rounded object-cover"
                  />
                  <span>{sample.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Result Banner */}
          {analyzing && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-3 text-amber-900">
              <Loader2 className="w-5 h-5 animate-spin shrink-0 text-amber-700" />
              <div className="text-xs">
                <div className="font-semibold">Gemini 3.8 Flash Vision Scanning...</div>
                <div>Extracting dial marks, packaging typography, brand hallmarks, and current retail specs.</div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          {result && !analyzing && (
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono text-amber-700 font-semibold uppercase">
                    {result.brand || 'Identified Brand'} · {result.category}
                  </div>
                  <h4 className="text-base font-bold text-stone-950 mt-0.5">
                    {result.productName}
                  </h4>
                </div>
                {result.estimatedPriceSGD && (
                  <div className="text-right">
                    <div className="text-[11px] text-stone-400">Est. Retail</div>
                    <div className="text-sm font-mono font-bold text-stone-900">
                      S${result.estimatedPriceSGD}
                    </div>
                  </div>
                )}
              </div>

              {result.keyVisualFeatures && (
                <div className="text-xs text-stone-600 space-y-1">
                  <div className="font-semibold text-stone-800">Visual Hallmarks Detected:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-600 pl-1">
                    {result.keyVisualFeatures.map((feat: string, i: number) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.curatorComment && (
                <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs text-stone-600 italic">
                  "{result.curatorComment}"
                </div>
              )}

              <button
                type="button"
                onClick={handleApplyResult}
                className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Compare Prices on "{result.productName}"</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
