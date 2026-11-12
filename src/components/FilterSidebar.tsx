import React from 'react';
import { FilterState, ProductCategory, SortOption } from '../types';
import { SlidersHorizontal, RotateCcw, MapPin, Store, CheckCircle } from 'lucide-react';

interface FilterSidebarProps {
  filterState: FilterState;
  onFilterChange: (newState: Partial<FilterState>) => void;
  onResetFilters: () => void;
  availableBrands: string[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filterState,
  onFilterChange,
  onResetFilters,
  availableBrands,
}) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
          <SlidersHorizontal className="w-4 h-4 text-neutral-600" />
          <span>Filters & Sort</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
          Sort Results By
        </label>
        <select
          value={filterState.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
          className="w-full text-xs py-2 px-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:border-neutral-900"
        >
          <option value="price_landed_asc">Lowest Landed Price (Cheapest)</option>
          <option value="discount_desc">Highest Discount vs MSRP (%)</option>
          <option value="rating_desc">Top Customer Rated</option>
          <option value="shipping_fastest">Fastest Delivery (Same-Day / Tomorrow)</option>
          <option value="price_landed_desc">Highest Price First</option>
        </select>
      </div>

      {/* Price Range Slider ($50 - $5,000) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-800 uppercase tracking-wider">
          <span>Price Range (SGD)</span>
          <span className="text-neutral-900 font-mono font-semibold">
            ${filterState.minPrice} – ${filterState.maxPrice}
          </span>
        </div>

        <input
          type="range"
          min="50"
          max="5000"
          step="50"
          value={filterState.maxPrice}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-neutral-900 cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span>$50</span>
          <span>$2,500</span>
          <span>$5,000+</span>
        </div>
      </div>

      {/* Singapore Location & Shipping Feasibility (Solves PDF Page 4) */}
      <div className="space-y-3 pt-3 border-t border-neutral-100">
        <div className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-neutral-500" />
          <span>Singapore Delivery Feasibility</span>
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-700">
          <input
            type="checkbox"
            checked={filterState.shipsToSGOnly}
            onChange={(e) => onFilterChange({ shipsToSGOnly: e.target.checked })}
            className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-0 accent-neutral-900"
          />
          <div>
            <span className="font-semibold text-neutral-900">Ships to Singapore Guaranteed</span>
            <div className="text-[11px] text-neutral-500">
              Hides stores requiring 3rd-party US/UK forwarders
            </div>
          </div>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-700">
          <input
            type="checkbox"
            checked={filterState.storePickupOnly}
            onChange={(e) => onFilterChange({ storePickupOnly: e.target.checked })}
            className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-0 accent-neutral-900"
          />
          <div>
            <span className="font-semibold text-neutral-900 flex items-center gap-1">
              <Store className="w-3 h-3 text-neutral-500" />
              Store Pickup Available
            </span>
            <div className="text-[11px] text-neutral-500">
              Orchard / MBS / Millenia Walk physical boutiques
            </div>
          </div>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-700">
          <input
            type="checkbox"
            checked={filterState.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-0 accent-neutral-900"
          />
          <div>
            <span className="font-semibold text-neutral-900 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              In Stock Only
            </span>
            <div className="text-[11px] text-neutral-500">
              Ready for immediate dispatch
            </div>
          </div>
        </label>
      </div>

      {/* Brands Filter */}
      <div className="space-y-2 pt-3 border-t border-neutral-100">
        <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
          Filter by Brand
        </label>
        <select
          value={filterState.brand}
          onChange={(e) => onFilterChange({ brand: e.target.value })}
          className="w-full text-xs py-2 px-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:border-neutral-900"
        >
          <option value="All">All Brands</option>
          {availableBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Retailer Ecosystem */}
      <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 space-y-1">
        <div className="font-semibold text-neutral-700">Monitored Stores:</div>
        <div>Shopee Mall · LazMall · Amazon SG & US · Apple Direct · Tangs · Takashimaya · iShopChangi · Tissot · Le Labo · Songmont · Donki</div>
      </div>
    </div>
  );
};
