import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSearchBar } from './components/HeroSearchBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { VisualSearchModal } from './components/VisualSearchModal';
import { ShoppingConciergeDrawer } from './components/ShoppingConciergeDrawer';
import { PriceAlertModal } from './components/PriceAlertModal';
import { WatchlistModal } from './components/WatchlistModal';
import { FilterSidebar } from './components/FilterSidebar';
import { INITIAL_PRODUCTS } from './data/mockProducts';
import { Product, ProductCategory, FilterState, SortOption } from './types';
import { getProductLandedComparison } from './utils/priceCalculator';
import { Sparkles, SlidersHorizontal, RefreshCw, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export default function App() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [alertProduct, setAlertProduct] = useState<Product | null>(null);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  // Watchlist state initialized with first product
  const [watchlist, setWatchlist] = useState<Product[]>([INITIAL_PRODUCTS[0]]);
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Singapore (SG 🇸🇬)');

  const [filterState, setFilterState] = useState<FilterState>({
    category: 'All',
    minPrice: 50,
    maxPrice: 5000,
    shipsToSGOnly: false,
    inStockOnly: false,
    storePickupOnly: false,
    brand: 'All',
    searchQuery: '',
    sortBy: 'price_landed_asc',
  });

  // Extract available brands
  const availableBrands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach((p) => brandSet.add(p.brand));
    return Array.from(brandSet).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (filterState.category !== 'All' && product.category !== filterState.category) {
          return false;
        }

        // Brand filter
        if (filterState.brand !== 'All' && product.brand !== filterState.brand) {
          return false;
        }

        // Search Query filter
        if (filterState.searchQuery.trim()) {
          const q = filterState.searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchTags = product.tags.some((t) => t.toLowerCase().includes(q));
          const matchCategory = product.category.toLowerCase().includes(q);
          const matchDescription = product.description.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchTags && !matchCategory && !matchDescription) {
            return false;
          }
        }

        const comparison = getProductLandedComparison(product);

        // Price range filter
        if (
          comparison.lowestLandedPrice < filterState.minPrice ||
          comparison.lowestLandedPrice > filterState.maxPrice
        ) {
          return false;
        }

        // Ships to SG filter (PDF Page 4)
        if (filterState.shipsToSGOnly) {
          const hasSGShip = product.retailers.some(
            (r) => r.shipsToSG && r.shippingType !== 'Freight Forwarder Required'
          );
          if (!hasSGShip) return false;
        }

        // In-store pickup filter
        if (filterState.storePickupOnly) {
          const hasStore = product.retailers.some((r) => r.shippingType === 'Store Pickup Available');
          if (!hasStore) return false;
        }

        // In-stock filter
        if (filterState.inStockOnly) {
          const hasStock = product.retailers.some((r) => r.inStock);
          if (!hasStock) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const compA = getProductLandedComparison(a);
        const compB = getProductLandedComparison(b);

        if (filterState.sortBy === 'price_landed_asc') {
          return compA.lowestLandedPrice - compB.lowestLandedPrice;
        }
        if (filterState.sortBy === 'price_landed_desc') {
          return compB.lowestLandedPrice - compA.lowestLandedPrice;
        }
        if (filterState.sortBy === 'discount_desc') {
          const discA = ((a.msrp - compA.lowestLandedPrice) / a.msrp) * 100;
          const discB = ((b.msrp - compB.lowestLandedPrice) / b.msrp) * 100;
          return discB - discA;
        }
        if (filterState.sortBy === 'rating_desc') {
          return b.rating - a.rating;
        }
        if (filterState.sortBy === 'shipping_fastest') {
          const fastA = compA.cheapestRetailer.shippingDays.toLowerCase().includes('same-day') || compA.cheapestRetailer.shippingDays.toLowerCase().includes('tomorrow') ? 1 : 0;
          const fastB = compB.cheapestRetailer.shippingDays.toLowerCase().includes('same-day') || compB.cheapestRetailer.shippingDays.toLowerCase().includes('tomorrow') ? 1 : 0;
          return fastB - fastA;
        }
        return 0;
      });
  }, [products, filterState]);

  const handleToggleBookmark = (product: Product) => {
    setWatchlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleResetFilters = () => {
    setFilterState({
      category: 'All',
      minPrice: 50,
      maxPrice: 5000,
      shipsToSGOnly: false,
      inStockOnly: false,
      storePickupOnly: false,
      brand: 'All',
      searchQuery: '',
      sortBy: 'price_landed_asc',
    });
  };

  const handleApplySearchResult = (searchTerm: string, category?: string) => {
    setFilterState((prev) => ({
      ...prev,
      searchQuery: searchTerm,
      category: category ? (category as ProductCategory) : prev.category,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFB] text-neutral-900">
      {/* Top Bar Header adhering strictly to Top Bar Contract */}
      <Header
        onOpenVisualSearch={() => setIsVisualSearchOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlist.length}
        deliveryLocation={deliveryLocation}
        onSelectLocation={(loc) => setDeliveryLocation(loc)}
      />

      {/* Hero Search & Comparison Bar */}
      <HeroSearchBar
        searchQuery={filterState.searchQuery}
        onSearchChange={(q) => setFilterState((prev) => ({ ...prev, searchQuery: q }))}
        selectedCategory={filterState.category}
        onCategoryChange={(cat) => setFilterState((prev) => ({ ...prev, category: cat }))}
        onOpenVisualSearch={() => setIsVisualSearchOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        sortBy={filterState.sortBy}
        onSortChange={(sort) => setFilterState((prev) => ({ ...prev, sortBy: sort }))}
        totalProductsCount={filteredProducts.length}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Filter Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <FilterSidebar
              filterState={filterState}
              onFilterChange={(partial) => setFilterState((prev) => ({ ...prev, ...partial }))}
              onResetFilters={handleResetFilters}
              availableBrands={availableBrands}
            />
          </div>

          {/* Right Column: Comparison Results */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            {/* Results bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-900">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Product Deal' : 'Product Deals'}
                </span>
                {filterState.category !== 'All' && (
                  <span className="text-xs text-neutral-500">
                    in <strong>{filterState.category}</strong>
                  </span>
                )}
                {filterState.searchQuery && (
                  <span className="text-xs text-neutral-500">
                    matching "{filterState.searchQuery}"
                  </span>
                )}
              </div>

              <div className="text-xs text-neutral-500 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>Showing landed rates for {deliveryLocation}</span>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onSetAlert={(p) => setAlertProduct(p)}
                    isBookmarked={watchlist.some((w) => w.id === product.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">No matching products found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  We couldn't find any products matching your current filters or search term. Try expanding your price range or search query.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                  <button
                    onClick={() => setIsConciergeOpen(true)}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ask AI Concierge</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-10 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-neutral-900 text-sm tracking-tight flex items-center gap-2 justify-center md:justify-start">
              <span>BASKT</span>
              <span className="text-[10px] uppercase font-semibold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded">
                Elevated Everyday Goods
              </span>
            </div>
            <p className="max-w-md">
              A Skyscanner-style independent price comparison engine for electronics, horology, niche fragrances, designer leather goods, and fine organic groceries.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-neutral-600 font-medium">
            <button onClick={() => setIsVisualSearchOpen(true)} className="hover:text-neutral-900">
              Visual Lens Search
            </button>
            <button onClick={() => setIsConciergeOpen(true)} className="hover:text-neutral-900">
              AI Concierge
            </button>
            <button onClick={() => setIsWatchlistOpen(true)} className="hover:text-neutral-900">
              Watchlist ({watchlist.length})
            </button>
            <span>Singapore GST Compliant</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-neutral-100 text-[11px] text-neutral-400 text-center">
          Prices and promo vouchers are refreshed continuously across Shopee Mall, LazMall, Amazon SG/US, Takashimaya, Tangs, and official brand boutiques.
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSetAlert={(p) => setAlertProduct(p)}
        isBookmarked={selectedProduct ? watchlist.some((w) => w.id === selectedProduct.id) : false}
        onToggleBookmark={handleToggleBookmark}
      />

      <VisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
        onSelectResult={handleApplySearchResult}
      />

      <ShoppingConciergeDrawer
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        onApplyRecommendation={handleApplySearchResult}
        currentCategory={filterState.category}
      />

      <PriceAlertModal
        product={alertProduct}
        onClose={() => setAlertProduct(null)}
      />

      <WatchlistModal
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        onRemove={(id) => setWatchlist((prev) => prev.filter((p) => p.id !== id))}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />
    </div>
  );
}
