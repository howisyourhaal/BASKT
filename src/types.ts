export type ProductCategory =
  | 'All'
  | 'Electronics'
  | 'Watches'
  | 'Perfume / Toiletries'
  | 'Branded Bags'
  | 'Organic Expensive Food';

export type RetailerType = 'online_marketplace' | 'brand_direct' | 'department_store' | 'duty_free';

export interface PromoCode {
  code: string;
  discountAmount: number;
  description: string;
}

export interface RetailerOption {
  id: string;
  retailerName: string;
  logo: string;
  type: RetailerType;
  basePrice: number;
  shippingCost: number;
  shippingDays: string;
  shipsToSG: boolean;
  shippingType: 'Direct Local' | 'Cross-border Direct' | 'Freight Forwarder Required' | 'Store Pickup Available';
  promoCodes: PromoCode[];
  inStock: boolean;
  stockCount?: number;
  authenticGuaranteed: boolean;
  warranty: string;
  returnPolicy: string;
  rating: number;
  reviewsCount: number;
  url: string;
  storeLocation?: string;
  isOfficialFlagship?: boolean;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  image: string;
  msrp: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  keySpecs: Record<string, string>;
  priceHistory: PricePoint[];
  bestTimeToBuy: 'BUY_NOW' | 'FAIR_PRICE' | 'WAIT_FOR_DROP';
  priceVerdictReason: string;
  retailers: RetailerOption[];
}

export type SortOption =
  | 'price_landed_asc'
  | 'price_landed_desc'
  | 'discount_desc'
  | 'rating_desc'
  | 'shipping_fastest';

export interface FilterState {
  category: ProductCategory;
  minPrice: number;
  maxPrice: number;
  shipsToSGOnly: boolean;
  inStockOnly: boolean;
  storePickupOnly: boolean;
  brand: string;
  searchQuery: string;
  sortBy: SortOption;
}

export interface VisualSearchResult {
  identifiedName: string;
  brand: string;
  category: ProductCategory;
  attributes: string[];
  suggestedQuery: string;
  confidence: number;
}
