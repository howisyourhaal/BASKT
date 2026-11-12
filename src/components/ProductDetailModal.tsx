import React, { useState } from 'react';
import { Product, RetailerOption } from '../types';
import { calculateRetailerLandedCost, getProductLandedComparison } from '../utils/priceCalculator';
import { X, ExternalLink, ShieldCheck, Truck, Tag, Bell, Bookmark, Check, Copy, TrendingDown, Store, AlertCircle, Info } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSetAlert: (product: Product) => void;
  isBookmarked: boolean;
  onToggleBookmark: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSetAlert,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'compare' | 'history' | 'specs'>('compare');

  if (!product) return null;

  const comparison = getProductLandedComparison(product);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-start justify-between gap-4 bg-neutral-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
              <span>{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>MSRP ${product.msrp}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950">
              {product.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSetAlert(product)}
              className="p-2 border border-neutral-200 hover:border-neutral-300 rounded-lg text-neutral-700 hover:text-neutral-900 transition-colors"
              title="Set Price Drop Alert"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleBookmark(product)}
              className={`p-2 border rounded-lg transition-colors ${
                isBookmarked
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-neutral-900'
              }`}
              title="Bookmark to Watchlist"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={onClose}
              className="p-2 border border-neutral-200 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-neutral-200 flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('compare')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'compare'
                ? 'border-neutral-900 text-neutral-950 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Live Price Comparison ({product.retailers.length} Stores)
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-neutral-900 text-neutral-950 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Price History & Timing
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-neutral-900 text-neutral-950 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Specifications & Details
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'compare' && (
            <div className="space-y-6">
              {/* Highlight Banner: Lowest Landed Cost */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
                      Guaranteed Lowest Landed Price
                    </div>
                    <div className="text-2xl font-bold text-emerald-950 tabular-nums">
                      ${comparison.lowestLandedPrice}{' '}
                      <span className="text-xs font-normal text-emerald-800">
                        on {comparison.cheapestRetailer.retailerName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-neutral-500">Savings vs MSRP</div>
                    <div className="text-sm font-semibold text-emerald-700">
                      Save ${comparison.highestSavings} (
                      {Math.round(((product.msrp - comparison.lowestLandedPrice) / product.msrp) * 100)}%)
                    </div>
                  </div>

                  <a
                    href={comparison.cheapestRetailer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                  >
                    <span>Claim Lowest Deal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Problem 4 Solutions Transparency Callout */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-neutral-600 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span>
                    <strong>BASKT Landed Formula:</strong> Base Price + Delivery Fee to Singapore - Validated Vouchers = True Final Price.
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500">Updated in real-time</span>
              </div>

              {/* Retailers Comparison Matrix */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200">
                {comparison.retailers.map((item, idx) => {
                  const ret = item.retailer;
                  const isLowest = item.isLowest;

                  return (
                    <div
                      key={ret.id}
                      className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isLowest ? 'bg-emerald-50/30' : 'bg-white hover:bg-neutral-50/50'
                      }`}
                    >
                      {/* Left: Retailer info */}
                      <div className="space-y-1.5 md:max-w-[340px]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-neutral-900">
                            {ret.retailerName}
                          </span>
                          {ret.isOfficialFlagship && (
                            <span className="text-[10px] font-semibold text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Official Flagship
                            </span>
                          )}
                          {isLowest && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              Cheapest
                            </span>
                          )}
                        </div>

                        {/* Shipping & Location info (addresses PDF Page 4) */}
                        <div className="text-xs text-neutral-500 flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-neutral-400" />
                            {ret.shippingCost === 0 ? (
                              <strong className="text-emerald-700 font-medium">Free Delivery</strong>
                            ) : (
                              `+$${ret.shippingCost.toFixed(2)} delivery`
                            )}
                          </span>
                          <span>·</span>
                          <span>{ret.shippingDays}</span>
                          {ret.storeLocation && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1 text-neutral-700 font-medium">
                                <Store className="w-3 h-3 text-neutral-500" />
                                {ret.storeLocation}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Warranty & Return Trust */}
                        <div className="text-[11px] text-neutral-500">
                          <span>{ret.warranty}</span>
                          <span className="mx-1.5">·</span>
                          <span>{ret.returnPolicy}</span>
                        </div>
                      </div>

                      {/* Middle: Promo Codes & Discounts */}
                      <div className="space-y-1 md:text-right">
                        {ret.promoCodes && ret.promoCodes.length > 0 ? (
                          <div className="flex flex-col md:items-end gap-1">
                            {ret.promoCodes.map((promo) => (
                              <div
                                key={promo.code}
                                className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded text-[11px] text-neutral-700"
                              >
                                <Tag className="w-3 h-3 text-neutral-500" />
                                <span className="font-mono font-semibold">{promo.code}</span>
                                <span className="text-emerald-600 font-medium">(-${promo.discountAmount})</span>
                                <button
                                  onClick={() => handleCopyCode(promo.code)}
                                  className="ml-1 text-neutral-500 hover:text-neutral-900 p-0.5"
                                  title="Copy promo code"
                                >
                                  {copiedCode === promo.code ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-neutral-400">No active coupons</span>
                        )}

                        <div className="text-[11px] text-neutral-500">
                          Base: ${ret.basePrice}{' '}
                          {ret.shippingCost > 0 && `+ $${ret.shippingCost.toFixed(2)} ship`}
                          {item.promoDiscount > 0 && ` - $${item.promoDiscount} code`}
                        </div>
                      </div>

                      {/* Right: Total Price & CTA */}
                      <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                        <div>
                          <div className="text-xs text-neutral-500 md:text-right">Total Landed</div>
                          <div className="text-xl font-bold text-neutral-950 tabular-nums">
                            ${item.totalLandedPrice}
                          </div>
                        </div>

                        <a
                          href={ret.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
                            isLowest
                              ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                          }`}
                        >
                          <span>Go to Store</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Verdict Banner */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 bg-neutral-900 text-white rounded-lg shrink-0">
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    BASKT Price Intelligence Verdict
                  </div>
                  <div className="text-base font-bold text-neutral-900 mt-0.5">
                    {product.bestTimeToBuy === 'BUY_NOW' ? 'Recommendation: Buy Now' : 'Recommendation: Fair Price'}
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    {product.priceVerdictReason}
                  </p>
                </div>
              </div>

              {/* Price Trend Chart SVG */}
              <div className="border border-neutral-200 rounded-xl p-5 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-neutral-900">
                    90-Day Price Fluctuations (SGD)
                  </div>
                  <div className="text-xs text-neutral-500">
                    All-time lowest: <strong className="text-emerald-700">${Math.min(...product.priceHistory.map((p) => p.price))}</strong>
                  </div>
                </div>

                {/* SVG Line Graph */}
                <div className="h-44 w-full relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#f3f4f6" strokeWidth="1" />

                    {/* Calculate SVG Coordinates */}
                    {(() => {
                      const prices = product.priceHistory.map((p) => p.price);
                      const min = Math.min(...prices) * 0.95;
                      const max = Math.max(...prices) * 1.05;
                      const range = max - min || 1;

                      const points = product.priceHistory.map((pt, i) => {
                        const x = (i / (product.priceHistory.length - 1)) * 480 + 10;
                        const y = 140 - ((pt.price - min) / range) * 110;
                        return { x, y, pt };
                      });

                      const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                      const areaD = `${pathD} L ${points[points.length - 1].x} 145 L ${points[0].x} 145 Z`;

                      return (
                        <>
                          <path d={areaD} fill="url(#priceGradient)" />
                          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

                          {points.map((p, idx) => (
                            <g key={idx}>
                              <circle cx={p.x} cy={p.y} r="4" fill="#065f46" stroke="#ffffff" strokeWidth="2" />
                              <text
                                x={p.x}
                                y={p.y - 10}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="bold"
                                fill="#111827"
                              >
                                ${p.pt.price}
                              </text>
                              <text
                                x={p.x}
                                y="145"
                                textAnchor="middle"
                                fontSize="9"
                                fill="#9ca3af"
                              >
                                {p.pt.date}
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              {/* Set Price Drop Alert Banner */}
              <div className="bg-neutral-900 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                    Never Overpay
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">
                    Want an email when the price drops further?
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    We track price changes across all stores 24/7.
                  </div>
                </div>

                <button
                  onClick={() => onSetAlert(product)}
                  className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <Bell className="w-4 h-4" />
                  <span>Create Price Alert</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Key Specifications</h3>
                <div className="mt-3 border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200 text-xs">
                  {Object.entries(product.keySpecs).map(([specKey, specVal]) => (
                    <div key={specKey} className="flex p-3">
                      <span className="w-1/3 font-medium text-neutral-500">{specKey}</span>
                      <span className="w-2/3 font-medium text-neutral-900">{specVal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Curated Tags & Highlights</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-600">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="bg-neutral-100 px-2.5 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-50 p-4 rounded-xl text-xs text-neutral-600 space-y-1 border border-neutral-200">
                <div className="font-semibold text-neutral-800">Authenticity & Warranty Policy</div>
                <p>
                  BASKT monitors only verified retail merchants, official flagships, and authorized Singapore distributors. All warranty terms reflect standard manufacturer local coverage or official international backing.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <div>
            Prices include Singapore Goods & Services Tax (GST) where applicable.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
