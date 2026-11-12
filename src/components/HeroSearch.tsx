import React, { useState } from 'react';
import { Search, Mic, Camera, ArrowRight, CheckCircle2, Sliders, Shield } from 'lucide-react';

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q?: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenVoiceModal: () => void;
  onOpenImageModal: () => void;
  onOpenAssistant: () => void;
}

const CATEGORIES = [
  'All Goods',
  'Watches',
  'Perfume/Toiletries',
  'Electronics',
  'Branded Bags',
  'Organic Expensive Food',
];

const POPULAR_SEARCHES = [
  { term: 'Tissot PRX', cat: 'Watches' },
  { term: 'Le Labo Santal 33', cat: 'Perfume/Toiletries' },
  { term: 'Sony WH-1000XM5', cat: 'Electronics' },
  { term: 'Porter Tanker Helmet Bag', cat: 'Branded Bags' },
  { term: 'Comvita UMF 20+ Honey', cat: 'Organic Expensive Food' },
  { term: 'Logitech MX Master 3S', cat: 'Electronics' },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedCategory,
  onSelectCategory,
  onOpenVoiceModal,
  onOpenImageModal,
  onOpenAssistant,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <section className="relative pt-10 pb-12 bg-gradient-to-b from-stone-100/80 via-stone-50 to-stone-50 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Brand Lead */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-200/70 rounded-full text-xs font-medium text-stone-700 mb-4">
            <span>The Skyscanner for Elevated Everyday Merchandise</span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-900 font-mono font-semibold">S$50 — S$2,000</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-stone-950 mb-4 leading-tight text-balance">
            Compare Real-Time Landed Prices on Everyday Luxury
          </h1>
          <p className="text-base sm:text-lg text-stone-600 font-normal max-w-2xl mx-auto leading-relaxed">
            One search across Shopee, Lazada, Amazon, Taobao, and brand flagships. True net cost calculated with verified shipping to Singapore and promo code stacking.
          </p>
        </div>

        {/* Skyscanner-Style Search Console */}
        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/60 border border-stone-200/90 p-3 sm:p-5 transition-all">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-stone-100 no-scrollbar">
            {CATEGORIES.map(category => {
              const isSelected =
                category === 'All Goods'
                  ? selectedCategory === ''
                  : selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => onSelectCategory(category === 'All Goods' ? '' : category)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-stone-950 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Unified Input Box */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div
              className={`flex-1 flex items-center gap-3 px-4 py-3 bg-stone-50 rounded-xl border transition-all ${
                isFocused ? 'bg-white border-stone-900 ring-2 ring-stone-900/10' : 'border-stone-200'
              }`}
            >
              <Search className="w-5 h-5 text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder="Search any product, brand or model (e.g., Tissot PRX, Santal 33, MX Master, Honey)..."
                className="w-full bg-transparent border-none outline-none text-stone-900 placeholder:text-stone-400 text-sm sm:text-base font-medium"
              />

              {/* Modality Triggers: Voice & Image */}
              <div className="flex items-center gap-1 shrink-0 border-l border-stone-200 pl-2">
                <button
                  type="button"
                  onClick={onOpenVoiceModal}
                  title="Search with Voice"
                  className="p-2 text-stone-500 hover:text-stone-950 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onOpenImageModal}
                  title="Upload or Snap a Picture"
                  className="p-2 text-stone-500 hover:text-stone-950 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Skyscanner Search Action */}
            <button
              type="submit"
              className="px-6 py-3.5 bg-stone-950 hover:bg-stone-800 text-white font-medium text-sm sm:text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Compare Prices</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Assistant Trigger Callout */}
          <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-stone-700">Trending:</span>
              {POPULAR_SEARCHES.map(item => (
                <button
                  key={item.term}
                  type="button"
                  onClick={() => {
                    onSearchChange(item.term);
                    onSelectCategory(item.cat);
                    onSearchSubmit(item.term);
                  }}
                  className="hover:text-stone-950 hover:underline transition-colors text-stone-600 cursor-pointer"
                >
                  {item.term}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onOpenAssistant}
              className="text-amber-800 font-medium hover:text-amber-950 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Need help deciding features? Ask AI Scout</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* 3 Core Value Propositions from Deck */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="flex items-start gap-3 p-3.5 bg-white/70 border border-stone-200/80 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-900">True Landed Cost Breakdown</div>
              <div className="text-[12px] text-stone-500 mt-0.5 leading-snug">
                Never get misled by hidden shipping or freight. Base price + freight + taxes combined.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-white/70 border border-stone-200/80 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-900">Auto-Stacked Retailer Promo Codes</div>
              <div className="text-[12px] text-stone-500 mt-0.5 leading-snug">
                We check official platform vouchers and card deals so you pay the real net checkout rate.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-white/70 border border-stone-200/80 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-900">Singapore Delivery & Warranty Filter</div>
              <div className="text-[12px] text-stone-500 mt-0.5 leading-snug">
                Clear badges indicating direct SG shipping, transit days, and official local warranty support.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
