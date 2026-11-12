import React, { useState } from 'react';
import { Search, Camera, Sparkles, X, ArrowUpDown, SlidersHorizontal, ShieldCheck, Truck, Tag } from 'lucide-react';
import { ProductCategory, SortOption } from '../types';

interface HeroSearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ProductCategory;
  onCategoryChange: (cat: ProductCategory) => void;
  onOpenVisualSearch: () => void;
  onOpenConcierge: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalProductsCount: number;
}

const CATEGORIES: ProductCategory[] = [
  'All',
  'Electronics',
  'Watches',
  'Perfume / Toiletries',
  'Branded Bags',
  'Organic Expensive Food',
];

const POPULAR_SEARCHES = [
  'Logitech MX Master 3S',
  'Tissot PRX Powermatic',
  'Le Labo Santal 33',
  'Songmont Reset Bag',
  'Kagoshima A5 Wagyu',
  'Apple Watch Ultra 2',
  'Sony WH-1000XM5',
  'Comvita Manuka Honey 25+'
];

export const HeroSearchBar: React.FC<HeroSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onOpenVisualSearch,
  onOpenConcierge,
  sortBy,
  onSortChange,
  totalProductsCount,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="bg-gradient-to-b from-neutral-50 via-white to-[#FBFBFB] border-b border-neutral-200 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        {/* Editorial Subtitle Kicker without pill enclosing */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          <span>Skyscanner for Elevated Goods</span>
          <span aria-hidden="true">·</span>
          <span>True Landed Costs</span>
          <span aria-hidden="true">·</span>
          <span>Verified Retailers</span>
        </div>

        {/* Primary Headline with text-wrap: balance */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 max-w-3xl mx-auto" style={{ textWrap: 'balance' }}>
          Compare real out-of-pocket prices for luxury & electronics.
        </h1>

        <p className="text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Find the guaranteed lowest price with shipping costs, Singapore customs, and active retailer discount codes automatically calculated in 1 click.
        </p>

        {/* Search Matrix Box */}
        <div className="mt-8 bg-white border border-neutral-300 rounded-2xl shadow-sm p-3 sm:p-4 text-left transition-all duration-200 hover:border-neutral-400">
          <div className="flex flex-col md:flex-row items-stretch gap-2">
            {/* Search Input */}
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder="Search products, brands (e.g. Logitech, Tissot, Le Labo, Wagyu, Polène)..."
                className="w-full pl-11 pr-10 py-3 text-sm text-neutral-900 placeholder-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-neutral-900 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 p-1 text-neutral-400 hover:text-neutral-700"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Visual Search Button */}
            <button
              onClick={onOpenVisualSearch}
              className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors whitespace-nowrap shrink-0"
              title="Search by image or photo"
            >
              <Camera className="w-4 h-4 text-neutral-600" />
              <span>Search by Image</span>
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenConcierge}
              className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ask AI Concierge</span>
            </button>
          </div>

          {/* Quick Category Segmented Buttons */}
          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-neutral-500 whitespace-nowrap shrink-0 mr-1">
              Category:
            </span>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Search Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-neutral-500">
          <span className="font-medium text-neutral-600">Popular comparisons:</span>
          {POPULAR_SEARCHES.map((query) => (
            <button
              key={query}
              onClick={() => onSearchChange(query)}
              className="text-neutral-600 hover:text-neutral-950 underline underline-offset-2 transition-colors"
            >
              {query}
            </button>
          ))}
        </div>

        {/* 3 Core Value Propositions (Resolving PDF Page 4 Problems) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 text-left">
          <div className="bg-white border border-neutral-200/80 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-neutral-900">Singapore Shipping Transparency</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Flags local vs overseas stock, shipping fees, and freight forwarder requirements upfront.
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800 shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-neutral-900">Auto-Applied Vouchers & Promo Codes</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Factors in bank rebates and platform coupons for true out-of-pocket prices.
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-100 text-neutral-800 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-neutral-900">100% Verified Authentic Stock</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Compares official flagship stores, certified department boutiques, and authorisations.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
