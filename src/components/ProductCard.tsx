import React from 'react';
import { Product, calculateLandedCost } from '../data/products.ts';
import { ArrowUpRight, ShieldCheck, Clock, Truck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  // Compute cheapest landed price across offers
  const landedCosts = product.offers.map(o => calculateLandedCost(o).netPrice);
  const minLandedPrice = Math.min(...landedCosts);
  const maxLandedPrice = Math.max(...landedCosts);
  const maxSavings = Math.max(0, product.marketPriceSG - minLandedPrice);

  // Find the fastest delivery
  const fastestDays = Math.min(...product.offers.map(o => o.deliveryDaysMin));

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border border-stone-200/90 hover:border-stone-400 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          onError={(e) => {
            // Elegant fallback container if image fails to load
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />

        {/* Savings Badge */}
        {maxSavings > 0 && (
          <div className="absolute top-3 right-3 bg-stone-950 text-white text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md shadow-xs">
            Save up to S${maxSavings.toFixed(0)}
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-medium text-stone-900 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-2xs">
          <Truck className="w-3 h-3 text-stone-700" />
          <span>SG delivery from {fastestDays} {fastestDays === 1 ? 'day' : 'days'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata strictly unboxed with dot separator (§1.A Anti-Slop Discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-stone-700">
              {product.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>

          <h3 className="font-semibold text-stone-900 text-base leading-snug group-hover:text-amber-800 transition-colors line-clamp-2">
            {product.title}
          </h3>

          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>

          {/* Quick specs */}
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded text-stone-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-end justify-between">
          <div>
            <div className="text-[11px] text-stone-400 font-medium">
              Lowest Landed Price
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-stone-950 tabular-nums">
                S${minLandedPrice.toFixed(0)}
              </span>
              {product.marketPriceSG > minLandedPrice && (
                <span className="text-xs text-stone-400 line-through font-mono">
                  S${product.marketPriceSG}
                </span>
              )}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" />
              <span>{product.offers.length} stores compared</span>
            </div>
          </div>

          <button
            type="button"
            className="p-2.5 rounded-xl bg-stone-100 group-hover:bg-stone-950 text-stone-700 group-hover:text-white transition-all shadow-2xs"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
