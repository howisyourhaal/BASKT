import React from 'react';
import { Product } from '../types';
import { getProductLandedComparison } from '../utils/priceCalculator';
import { Bookmark, Bell, ExternalLink, ChevronRight, CheckCircle2, TrendingDown, Clock, ShieldCheck, Truck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onSetAlert: (product: Product) => void;
  isBookmarked: boolean;
  onToggleBookmark: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onSetAlert,
  isBookmarked,
  onToggleBookmark,
}) => {
  const { retailers, lowestLandedPrice, cheapestRetailer, highestSavings } = getProductLandedComparison(product);

  const bestPromo = cheapestRetailer.promoCodes?.[0];
  const percentSaved = Math.round(((product.msrp - lowestLandedPrice) / product.msrp) * 100);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Product Image Section */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
          onError={(e) => {
            // Elegant CSS fallback container if image fails to load
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback container if image fails */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 flex flex-col items-center justify-center p-4 text-center -z-10">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{product.brand}</span>
          <span className="text-sm font-medium text-neutral-800 mt-1">{product.name}</span>
        </div>

        {/* Top actions: Bookmark & Price Alert */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetAlert(product);
            }}
            className="p-2 bg-white/90 hover:bg-white text-neutral-700 hover:text-neutral-900 rounded-full shadow-sm backdrop-blur-xs transition-colors"
            title="Set Price Drop Alert"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(product);
            }}
            className={`p-2 rounded-full shadow-sm backdrop-blur-xs transition-colors ${
              isBookmarked
                ? 'bg-neutral-900 text-white'
                : 'bg-white/90 hover:bg-white text-neutral-700 hover:text-neutral-900'
            }`}
            title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Best Time to Buy indicator */}
        <div className="absolute bottom-3 left-3 z-10">
          {product.bestTimeToBuy === 'BUY_NOW' && (
            <div className="px-2.5 py-1 bg-emerald-950/90 backdrop-blur-xs text-emerald-300 text-[11px] font-semibold rounded-md flex items-center gap-1 shadow-xs">
              <TrendingDown className="w-3 h-3 text-emerald-400" />
              <span>Great Deal · 90-Day Low</span>
            </div>
          )}
          {product.bestTimeToBuy === 'FAIR_PRICE' && (
            <div className="px-2.5 py-1 bg-neutral-900/85 backdrop-blur-xs text-neutral-300 text-[11px] font-medium rounded-md shadow-xs">
              <span>Fair Standard Price</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Unboxed clean metadata (Zero-Pill Rule) */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span>{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>★ {product.rating} ({product.reviewCount})</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelect(product)}
            className="text-base font-semibold text-neutral-900 mt-1 cursor-pointer hover:text-neutral-700 transition-colors line-clamp-2"
          >
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Landed Price Matrix Box (Skyscanner style) */}
        <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3 space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                Lowest Landed Price
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-neutral-950 tabular-nums">
                  ${lowestLandedPrice}
                </span>
                {product.msrp > lowestLandedPrice && (
                  <span className="text-xs text-neutral-400 line-through tabular-nums">
                    MSRP ${product.msrp}
                  </span>
                )}
              </div>
            </div>

            {percentSaved > 0 && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                Save {percentSaved}% (${highestSavings})
              </span>
            )}
          </div>

          {/* Best Retailer callout */}
          <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-neutral-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium truncate max-w-[170px]">
                {cheapestRetailer.retailerName}
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 whitespace-nowrap">
              {cheapestRetailer.shippingDays}
            </span>
          </div>

          {/* Promo code applied tag */}
          {bestPromo && (
            <div className="text-[11px] text-neutral-600 flex items-center justify-between bg-white px-2 py-1 rounded border border-neutral-200">
              <span className="font-mono font-medium text-neutral-800">{bestPromo.code}</span>
              <span className="text-emerald-600 font-semibold">-${bestPromo.discountAmount} auto-applied</span>
            </div>
          )}
        </div>

        {/* Retailers quick preview count & action */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onSelect(product)}
            className="flex-1 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Compare {product.retailers.length} Stores</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={cheapestRetailer.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2.5 border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-neutral-900 rounded-lg transition-colors flex items-center justify-center"
            title={`Go directly to deal on ${cheapestRetailer.retailerName}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
