import React, { useState, useMemo } from 'react';
import { Header } from './components/Header.tsx';
import { HeroSearch } from './components/HeroSearch.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ProductComparisonView } from './components/ProductComparisonView.tsx';
import { ImageSearchModal } from './components/ImageSearchModal.tsx';
import { VoiceSearchModal } from './components/VoiceSearchModal.tsx';
import { AIScoutDrawer } from './components/AIScoutDrawer.tsx';
import { PriceAlertModal } from './components/PriceAlertModal.tsx';
import { ReferralOutboundModal } from './components/ReferralOutboundModal.tsx';
import { SavedAlertsModal, SavedAlert } from './components/SavedAlertsModal.tsx';
import { INITIAL_PRODUCTS, Product, StoreOffer, calculateLandedCost } from './data/products.ts';
import {
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

export default function App() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Singapore (SGD $)');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(2000);
  const [minPriceFilter, setMinPriceFilter] = useState<number>(50);

  // Modals state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedAlertProduct, setSelectedAlertProduct] = useState<Product | null>(null);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [activeDeal, setActiveDeal] = useState<{
    product: Product;
    offer: StoreOffer;
    netPrice: number;
    appliedPromo?: string;
  } | null>(null);
  const [isSavedAlertsOpen, setIsSavedAlertsOpen] = useState(false);
  const [savedAlerts, setSavedAlerts] = useState<SavedAlert[]>([]);

  // Live Refresh Status
  const [lastRefreshTime, setLastRefreshTime] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Search query filter (matches title, brand, category, tags, or description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          product.title.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.tags.some(t => t.toLowerCase().includes(q)) ||
          product.description.toLowerCase().includes(q);

        if (!matchesQuery) return false;
      }

      // Price filter (target range > $50 and < $2,000 from deck)
      const minLanded = Math.min(...product.offers.map(o => calculateLandedCost(o).netPrice));
      if (minLanded < minPriceFilter || minLanded > maxPriceFilter) {
        return false;
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery, minPriceFilter, maxPriceFilter]);

  const handleLiveRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/retailers/live-refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: selectedProduct?.id }),
      });
      const data = await res.json();
      if (data.lastChecked) {
        setLastRefreshTime(data.lastChecked);
      }
    } catch {
      setLastRefreshTime('Just now');
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const handleIdentifySuccess = (result: {
    productName: string;
    brand: string;
    category: string;
    estimatedPriceSGD: number;
    recommendedQuery: string;
  }) => {
    setSearchQuery(result.recommendedQuery || result.productName);
    if (result.category) {
      setSelectedCategory(result.category);
    }

    // Try matching an exact product in our catalog
    const matched = products.find(
      p =>
        p.title.toLowerCase().includes(result.recommendedQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(result.brand.toLowerCase()) ||
        result.recommendedQuery.toLowerCase().includes(p.brand.toLowerCase())
    );

    if (matched) {
      setSelectedProduct(matched);
    }
  };

  const handleSaveAlert = (alertData: {
    productId: string;
    productTitle: string;
    targetPrice: number;
    currentPrice: number;
    email: string;
  }) => {
    setSavedAlerts(prev => [
      ...prev.filter(a => a.productId !== alertData.productId),
      {
        ...alertData,
        dateCreated: new Date().toLocaleDateString('en-SG'),
      },
    ]);
  };

  const handleRemoveAlert = (productId: string) => {
    setSavedAlerts(prev => prev.filter(a => a.productId !== productId));
  };

  const handleDealClick = (
    offer: StoreOffer,
    product: Product,
    netPrice: number,
    appliedPromo?: string
  ) => {
    setActiveDeal({
      product,
      offer,
      netPrice,
      appliedPromo,
    });
    setIsReferralModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      {/* Top Bar */}
      <Header
        currentLocation={currentLocation}
        onLocationChange={setCurrentLocation}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        savedAlertsCount={savedAlerts.length}
        onViewAlerts={() => setIsSavedAlertsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedProduct ? (
          <ProductComparisonView
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onOpenAlertModal={p => {
              setSelectedAlertProduct(p);
              setIsAlertModalOpen(true);
            }}
            onSelectDeal={handleDealClick}
            onRefreshPrices={handleLiveRefresh}
            lastRefreshTime={lastRefreshTime}
            isRefreshing={isRefreshing}
          />
        ) : (
          <>
            {/* Skyscanner Hero & Search Bar */}
            <HeroSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={q => {
                if (q) setSearchQuery(q);
              }}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              onOpenImageModal={() => setIsImageModalOpen(true)}
              onOpenAssistant={() => setIsAssistantOpen(true)}
            />

            {/* Catalog Grid Section */}
            <section id="explore" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* Filter controls row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-stone-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-medium text-stone-950">
                    {selectedCategory ? `${selectedCategory}` : 'Elevated Everyday Goods'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Showing {filteredProducts.length} curated luxury items with verified landed pricing
                  </p>
                </div>

                {/* Price Range Filter Slider (Rough Target Range: $50 to $2,000 from deck) */}
                <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-xl border border-stone-200 text-xs">
                  <span className="text-stone-500 font-medium">Max Price:</span>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={maxPriceFilter}
                    onChange={e => setMaxPriceFilter(Number(e.target.value))}
                    className="w-24 sm:w-32 accent-stone-950 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-stone-900 w-16 text-right">
                    ≤ S${maxPriceFilter}
                  </span>
                  {(searchQuery || selectedCategory || maxPriceFilter < 2000) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('');
                        setMaxPriceFilter(2000);
                      }}
                      title="Reset filters"
                      className="ml-1 text-stone-400 hover:text-stone-900 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={setSelectedProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                    <SlidersHorizontal className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      No matching elevated goods found
                    </h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                      Try clearing search filters or ask our AI Scout to recommend similar goods within your budget.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('');
                        setMaxPriceFilter(2000);
                      }}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => setIsAssistantOpen(true)}
                      className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ask AI Scout</span>
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* How It Works & Business Model Section */}
            <section id="how-it-works" className="bg-stone-100/70 border-t border-stone-200 py-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <div className="text-xs font-mono font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    The BASKT Transparency Standard
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-950 tracking-tight">
                    Why Skyscanner Works for Elevated Goods
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2">
                    When shopping for goods between $50 and $2,000, unbundled shipping and hidden promo codes routinely distort the true cheapest price.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-950 text-white flex items-center justify-center font-mono font-bold text-sm">
                      01
                    </div>
                    <h3 className="font-semibold text-stone-900 text-base">
                      Unified Retailer Intelligence
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      We scrape and index real-time inventory from Shopee Mall, Lazada LazMall, Amazon SG, Taobao Tmall Global, and direct brand flagship boutiques.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-mono font-bold text-sm">
                      02
                    </div>
                    <h3 className="font-semibold text-stone-900 text-base">
                      True Landed Cost Math
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Landed Price = Item Base + Direct Freight - Auto-stacked Vouchers. No surprises at final payment gateway, with clear Singapore customs and warranty flags.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-mono font-bold text-sm">
                      03
                    </div>
                    <h3 className="font-semibold text-stone-900 text-base">
                      AI Scout Decision Engine
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Unsure about specific calibers, materials, or silent vs tactile switches? Tell the AI Scout your lifestyle context and get curated recommendations instantly.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="bg-[#072044] text-sky-200/70 py-12 border-t border-[#0f3263] text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-tight text-white text-base">BASKT</span>
            <span className="text-sky-400/40">·</span>
            <span className="text-sky-100/80">Consumer Price Comparison for Elevated Goods ($50 – $2,000)</span>
          </div>

          <div className="flex items-center gap-6 text-sky-200/80">
            <button
              onClick={() => {
                setSelectedProduct(null);
                setSelectedCategory('');
                setSearchQuery('');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Compare Goods
            </button>
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Shopping Scout
            </button>
            <button
              onClick={() => setIsSavedAlertsOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Tracked Alerts
            </button>
          </div>

          <div className="text-sky-300/70 font-mono text-[11px]">
            Singapore · Landed Pricing Verified
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ImageSearchModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onIdentifySuccess={handleIdentifySuccess}
      />

      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onVoiceSearchSubmit={text => {
          setSearchQuery(text);
          setSelectedCategory('');
        }}
      />

      <AIScoutDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onSelectProductQuery={(q, cat) => {
          setSearchQuery(q);
          if (cat) setSelectedCategory(cat);
          const matched = products.find(
            p =>
              p.title.toLowerCase().includes(q.toLowerCase()) ||
              p.brand.toLowerCase().includes(q.toLowerCase())
          );
          if (matched) {
            setSelectedProduct(matched);
          }
        }}
        currentCategory={selectedCategory}
        currentSearch={searchQuery}
      />

      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => {
          setIsAlertModalOpen(false);
          setSelectedAlertProduct(null);
        }}
        product={selectedAlertProduct}
        onSaveAlert={handleSaveAlert}
      />

      <ReferralOutboundModal
        isOpen={isReferralModalOpen}
        onClose={() => {
          setIsReferralModalOpen(false);
          setActiveDeal(null);
        }}
        deal={activeDeal}
      />

      <SavedAlertsModal
        isOpen={isSavedAlertsOpen}
        onClose={() => setIsSavedAlertsOpen(false)}
        alerts={savedAlerts}
        onRemoveAlert={handleRemoveAlert}
        onSelectProduct={productId => {
          const matched = products.find(p => p.id === productId);
          if (matched) {
            setSelectedProduct(matched);
          }
        }}
      />
    </div>
  );
}
