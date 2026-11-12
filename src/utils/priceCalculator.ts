import { Product, RetailerOption } from '../types';

export interface LandedCostBreakdown {
  retailer: RetailerOption;
  basePrice: number;
  shippingCost: number;
  promoDiscount: number;
  appliedPromoCode?: string;
  totalLandedPrice: number;
  isLowest: boolean;
  savingsVsMsrp: number;
}

export function calculateRetailerLandedCost(retailer: RetailerOption, msrp: number): LandedCostBreakdown {
  // Find highest applicable promo code
  let bestPromoDiscount = 0;
  let bestPromoCode: string | undefined = undefined;

  if (retailer.promoCodes && retailer.promoCodes.length > 0) {
    const highestPromo = [...retailer.promoCodes].sort((a, b) => b.discountAmount - a.discountAmount)[0];
    if (highestPromo) {
      bestPromoDiscount = highestPromo.discountAmount;
      bestPromoCode = highestPromo.code;
    }
  }

  const total = Math.max(0, retailer.basePrice + retailer.shippingCost - bestPromoDiscount);
  const savings = Math.max(0, msrp - total);

  return {
    retailer,
    basePrice: retailer.basePrice,
    shippingCost: retailer.shippingCost,
    promoDiscount: bestPromoDiscount,
    appliedPromoCode: bestPromoCode,
    totalLandedPrice: Math.round(total * 100) / 100,
    isLowest: false,
    savingsVsMsrp: Math.round(savings * 100) / 100,
  };
}

export function getProductLandedComparison(product: Product): {
  retailers: LandedCostBreakdown[];
  lowestLandedPrice: number;
  cheapestRetailer: RetailerOption;
  highestSavings: number;
} {
  const calculated = product.retailers.map((ret) => calculateRetailerLandedCost(ret, product.msrp));
  calculated.sort((a, b) => a.totalLandedPrice - b.totalLandedPrice);

  if (calculated.length > 0) {
    calculated[0].isLowest = true;
  }

  const cheapest = calculated[0] || {
    totalLandedPrice: product.msrp,
    retailer: product.retailers[0],
    savingsVsMsrp: 0
  };

  return {
    retailers: calculated,
    lowestLandedPrice: cheapest.totalLandedPrice,
    cheapestRetailer: cheapest.retailer,
    highestSavings: cheapest.savingsVsMsrp,
  };
}
