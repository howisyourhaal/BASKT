import React, { useState } from 'react';
import { Product, StoreOffer, calculateLandedCost } from '../data/products.ts';
import {
  ArrowLeft,
  Bell,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Truck,
  CheckCircle,
  Tag,
  AlertCircle,
  TrendingDown,
  Info,
  Clock,
  Star,
} from 'lucide-react';

interface ProductComparisonViewProps {
  product: Product;
  onBack: () => void;
  onOpenAlertModal: (product: Product) => void;
  onSelectDeal: (offer: StoreOffer, product: Product, netPrice: number, appliedPromo?: string) => void;
  onRefreshPrices: () => void;
  lastRefreshTime: string;
  isRefreshing: boolean;
}

type SortFilterTab = 'cheapest' | 'fastest' | 'best';

export const ProductComparisonView: React.FC<ProductComparisonViewProps> = ({
  product,
  onBack,
  onOpenAlertModal,
  onSelectDeal,
  onRefreshPrices,
  lastRefreshTime,
  isRefreshing,
}) => {
  const [activeTab, setActiveTab] = useState<SortFilterTab>('cheapest');
  const [activePromoOverrides, setActivePromoOverrides] = useState<Record<string, string | undefined>>({});
  const [filterSGLocalWarrantyOnly, setFilterSGLocalWarrantyOnly] = useState(false);

  // Compute calculated offers with landed cost
  const processedOffers = product.offers.map(offer => {
    const overridePromo = activePromoOverrides[offer.id];
    const landed = calculateLandedCost(offer, overridePromo);
    return {
      offer,
      landed,
    };
  });

  // Filter if user toggled SG local warranty only
  const filteredOffers = processedOffers.filter(item => {
    if (filterSGLocalWarrantyOnly) {
      return (
        item.offer.warranty.toLowerCase().includes('sg') ||
        item.offer.warranty.toLowerCase().includes('official') ||
        item.offer.warranty.toLowerCase().includes('singapore')
      );
    }
    return true;
  });

  // Highlight Cards: Find best, cheapest, and fastest
  const cheapestOffer = [...processedOffers].sort(
    (a, b) => a.landed.netPrice - b.landed.netPrice
  )[0];

  const fastestOffer = [...processedOffers].sort(
    (a, b) => a.offer.deliveryDaysMin - b.offer.deliveryDaysMin
  )[0];

  // Best Value is high rating, local warranty, and good price
  const bestValueOffer =
    [...processedOffers].sort((a, b) => {
      const aScore = (a.offer.sellerRating * 200) - a.landed.netPrice;
      const bScore = (b.offer.sellerRating * 200) - b.landed.netPrice;
      return bScore - aScore;
    })[0] || cheapestOffer;

  // Sort displayed list based on activeTab
  const sortedOffers = [...filteredOffers].sort((a, b) => {
    if (activeTab === 'cheapest') {
      return a.landed.netPrice - b.landed.netPrice;
    }
    if (activeTab === 'fastest') {
      return a.offer.deliveryDaysMin - b.offer.deliveryDaysMin;
    }
    if (activeTab === 'best') {
      return b.offer.sellerRating - a.offer.sellerRating;
    }
    return 0;
  });

  const togglePromoCode = (offerId: string, promoCode: string) => {
    setActivePromoOverrides(prev => ({
      ...prev,
      [offerId]: prev[offerId] === promoCode ? undefined : promoCode,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors p-1.5 -ml-1.5 rounded-lg hover:bg-stone-200/60 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Goods</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Live Refresh Button */}
          <button
            onClick={onRefreshPrices}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-600' : 'text-stone-500'}`} />
            <span className="hidden sm:inline">Updated {lastRefreshTime}</span>
            <span className="sm:hidden">Refresh</span>
          </button>

          {/* Price Alert Button */}
          <button
            onClick={() => onOpenAlertModal(product)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300/80 rounded-lg transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-amber-800" />
            <span>Track Price Drop</span>
          </button>
        </div>
      </div>

      {/* Main Product Header Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Product Thumbnail */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="aspect-[4/3] rounded-xl bg-stone-100 overflow-hidden border border-stone-200">
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-1">
                <span className="uppercase tracking-wider font-semibold text-stone-800">
                  {product.brand}
                </span>
                <span>·</span>
                <span>{product.category}</span>
                <span>·</span>
                <span className="text-emerald-700 font-semibold">Landed Cost Engine</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-stone-950 tracking-tight">
                {product.title}
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                {product.description}
              </p>

              {/* Specs Grid */}
              <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {product.specs.map((spec, i) => (
                  <div key={i} className="text-stone-600">
                    <span className="text-stone-400 block text-[11px] font-medium">{spec.label}</span>
                    <span className="font-semibold text-stone-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Curator Note */}
            {product.aiCuratorNotes && (
              <div className="mt-4 p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900">BASKT Buyer Intel: </span>
                  {product.aiCuratorNotes}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skyscanner-Style 3-Card Highlight Summary */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
          Top Flight Recommendations
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Cheapest */}
          <div
            onClick={() => setActiveTab('cheapest')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'cheapest'
                ? 'bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-white border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Cheapest Deal
              </span>
              <span className="text-[11px] text-stone-400 font-mono">Net Landed</span>
            </div>
            <div className="text-2xl font-bold font-mono text-stone-950 tabular-nums">
              S${cheapestOffer?.landed.netPrice.toFixed(2)}
            </div>
            <div className="text-xs text-stone-600 mt-1 font-medium">
              {cheapestOffer?.offer.storeName}
            </div>
            <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{cheapestOffer?.offer.deliveryEstimate}</span>
            </div>
          </div>

          {/* 2. Fastest */}
          <div
            onClick={() => setActiveTab('fastest')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'fastest'
                ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20'
                : 'bg-white border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                Fastest Delivery
              </span>
              <span className="text-[11px] text-stone-400 font-mono">Priority SG</span>
            </div>
            <div className="text-2xl font-bold font-mono text-stone-950 tabular-nums">
              S${fastestOffer?.landed.netPrice.toFixed(2)}
            </div>
            <div className="text-xs text-stone-600 mt-1 font-medium">
              {fastestOffer?.offer.storeName}
            </div>
            <div className="text-[11px] text-blue-700 font-semibold mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{fastestOffer?.offer.deliveryEstimate}</span>
            </div>
          </div>

          {/* 3. Best Value */}
          <div
            onClick={() => setActiveTab('best')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'best'
                ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-white border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                Best Value Choice
              </span>
              <span className="text-[11px] text-stone-400 font-mono">Local Warranty</span>
            </div>
            <div className="text-2xl font-bold font-mono text-stone-950 tabular-nums">
              S${bestValueOffer?.landed.netPrice.toFixed(2)}
            </div>
            <div className="text-xs text-stone-600 mt-1 font-medium">
              {bestValueOffer?.offer.storeName}
            </div>
            <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span className="truncate">{bestValueOffer?.offer.warranty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skyscanner Filter / Segmented Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
          <button
            onClick={() => setActiveTab('cheapest')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'cheapest'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Cheapest First
          </button>
          <button
            onClick={() => setActiveTab('fastest')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'fastest'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Fastest Delivery
          </button>
          <button
            onClick={() => setActiveTab('best')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'best'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Highest Rated & Warranty
          </button>
        </div>

        {/* Local SG Warranty Toggle */}
        <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filterSGLocalWarrantyOnly}
            onChange={e => setFilterSGLocalWarrantyOnly(e.target.checked)}
            className="rounded border-stone-300 text-stone-950 focus:ring-stone-950"
          />
          <span>Official Singapore Local Warranty only</span>
        </label>
      </div>

      {/* Retailers List (Solving the 3 Deck Problems: Ships to SG, Shipping fee separated, Promo codes unapplied) */}
      <div className="space-y-4 mb-10">
        {sortedOffers.map(({ offer, landed }) => {
          const isCheapestItem = landed.netPrice === cheapestOffer.landed.netPrice;

          return (
            <div
              key={offer.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md ${
                isCheapestItem
                  ? 'border-emerald-300 ring-1 ring-emerald-500/10'
                  : 'border-stone-200'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                {/* Store Branding & Authenticity */}
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm sm:text-base">
                      {offer.storeName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                    <span className="text-emerald-700 font-semibold">{offer.storeBadge}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono text-stone-700">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {offer.sellerRating} ({offer.sellerReviews.toLocaleString()})
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-stone-600 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="line-clamp-1">{offer.warranty}</span>
                  </div>
                </div>

                {/* Delivery & Shipping to SG Details (Deck Problem 1: "Does it ship to SG?") */}
                <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-stone-100 pt-3 lg:pt-0 lg:pl-4 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-900 font-semibold">
                    <Truck className="w-3.5 h-3.5 text-stone-500" />
                    <span>{offer.deliveryEstimate}</span>
                  </div>

                  <div className="mt-1 text-stone-500">
                    Ships from: <span className="text-stone-800 font-medium">{offer.originCountry}</span>
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    <span>Direct Singapore Delivery Guaranteed</span>
                  </div>
                </div>

                {/* Promo Code Stacking (Deck Problem 3: "Retailers have promo codes not considered in price") */}
                <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-stone-100 pt-3 lg:pt-0 lg:pl-4 text-xs">
                  <div className="text-[11px] text-stone-400 font-medium mb-1">
                    Verified Promo Codes
                  </div>
                  {offer.availablePromos.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {offer.availablePromos.map(promo => {
                        const isApplied = landed.activePromo?.code === promo.code;
                        return (
                          <button
                            key={promo.code}
                            type="button"
                            onClick={() => togglePromoCode(offer.id, promo.code)}
                            className={`px-2 py-1 rounded text-[11px] text-left font-mono font-medium border flex items-center justify-between cursor-pointer transition-colors ${
                              isApplied
                                ? 'bg-amber-100/80 border-amber-400 text-amber-900 font-semibold'
                                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                            }`}
                          >
                            <span className="flex items-center gap-1 truncate">
                              <Tag className="w-3 h-3 text-amber-700 shrink-0" />
                              {promo.code}
                            </span>
                            <span className="text-emerald-700 font-semibold shrink-0">
                              -S${promo.discount}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-stone-400 italic text-[11px]">No active vouchers</div>
                  )}
                </div>

                {/* Landed Price & Direct Buy (Deck Problem 2: "Shipping costs are separated") */}
                <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-stone-100 pt-3 lg:pt-0 lg:pl-4 flex flex-col justify-between items-start lg:items-end">
                  <div className="text-left lg:text-right">
                    <div className="text-[11px] text-stone-400 font-medium">
                      Total Landed Price
                    </div>
                    <div className="text-2xl font-bold font-mono text-stone-950 tabular-nums">
                      S${landed.netPrice.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                      Base: S${landed.basePrice} · Freight: {landed.shippingFee === 0 ? 'FREE' : `+S$${landed.shippingFee}`}
                      {landed.promoDiscount > 0 && (
                        <span className="text-emerald-700 font-semibold">
                          {' '}· Promo: -S${landed.promoDiscount}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onSelectDeal(offer, product, landed.netPrice, landed.activePromo?.code)
                    }
                    className="w-full lg:w-auto mt-3 px-5 py-2.5 bg-stone-950 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Go to Store</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skyscanner-Style 90-Day Price Trend History */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-semibold text-stone-950 text-base flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              90-Day Landed Price History
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Price trends tracked across Singapore authorized distributors & global importers
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-stone-600 font-medium">Current Best: S${cheapestOffer?.landed.netPrice.toFixed(0)}</span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-400 font-mono">Market High: S${product.marketPriceSG}</span>
          </div>
        </div>

        {/* Visual Trend Bars */}
        <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44 pt-6 border-b border-stone-100 pb-2">
          {product.priceTrend.map((point, index) => {
            const isLatest = index === product.priceTrend.length - 1;
            // Height ratio based on max market price
            const heightPercent = Math.max(25, Math.min(100, (point.low / product.marketPriceSG) * 100));

            return (
              <div key={index} className="flex flex-col items-center h-full justify-end group">
                {/* Floating tooltip */}
                <div className="text-[10px] font-mono text-stone-500 mb-1 group-hover:text-stone-900 font-medium">
                  S${point.low}
                </div>
                <div className="w-full max-w-[48px] bg-stone-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full transition-all duration-500 rounded-t-md ${
                      isLatest
                        ? 'bg-emerald-600 group-hover:bg-emerald-500'
                        : 'bg-stone-300 group-hover:bg-stone-400'
                    }`}
                  />
                </div>
                <div className={`mt-2 text-xs font-mono font-medium ${isLatest ? 'text-emerald-700 font-bold' : 'text-stone-500'}`}>
                  {point.date}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-stone-500 gap-2">
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Good time to buy: Current lowest price is near a 6-month historical low.</span>
          </div>
          <button
            onClick={() => onOpenAlertModal(product)}
            className="text-stone-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Set a price drop alert for this item</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
