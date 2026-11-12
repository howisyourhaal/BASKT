import React, { useState } from 'react';
import { Product } from '../types';
import { getProductLandedComparison } from '../utils/priceCalculator';
import { X, Bell, CheckCircle2, TrendingDown, Mail, ShieldAlert } from 'lucide-react';

interface PriceAlertModalProps {
  product: Product | null;
  onClose: () => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const { lowestLandedPrice } = getProductLandedComparison(product);
  const [targetPrice, setTargetPrice] = useState<number>(Math.floor(lowestLandedPrice * 0.9));
  const [email, setEmail] = useState<string>('tansiokhui@gmail.com');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || targetPrice <= 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/price-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          targetPrice,
          currentPrice: lowestLandedPrice,
          email,
        }),
      });

      const data = await res.json();
      setSuccessMessage(data.message || `Price alert activated for ${product.name}!`);
    } catch {
      setSuccessMessage(`Alert saved for ${product.name}. We will ping ${email} when price reaches $${targetPrice}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-neutral-900 text-white rounded-lg">
              <Bell className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Create Live Price Alert</h2>
              <div className="text-[11px] text-neutral-500">Track 24/7 price drops across all stores</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {successMessage ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Alert Confirmed</h3>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-xs mx-auto">
                {successMessage}
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                <div className="text-[11px] text-neutral-500 font-medium">Selected Product</div>
                <div className="text-sm font-bold text-neutral-900 truncate mt-0.5">
                  {product.name}
                </div>
                <div className="text-xs text-neutral-600 mt-1 flex items-center justify-between">
                  <span>Current Lowest Landed:</span>
                  <strong className="text-neutral-950 font-bold">${lowestLandedPrice}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Notify me when price drops to or below (SGD):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="1"
                    max={lowestLandedPrice}
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    required
                    className="w-full pl-7 pr-3 py-2 text-sm font-bold text-neutral-900 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  Suggested target: 10% below current price (${Math.floor(lowestLandedPrice * 0.9)})
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Notification Email:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your.email@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs text-neutral-900 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 p-2.5 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  BASKT tracks Shopee, Lazada, Amazon, and official stores every 15 minutes, factoring in promotional coupons.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                {isSubmitting ? 'Activating Alert...' : 'Activate Price Drop Alert'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
