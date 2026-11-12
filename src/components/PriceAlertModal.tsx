import React, { useState } from 'react';
import { X, Bell, Check, ArrowRight } from 'lucide-react';
import { Product, calculateLandedCost } from '../data/products.ts';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSaveAlert: (alert: {
    productId: string;
    productTitle: string;
    targetPrice: number;
    currentPrice: number;
    email: string;
  }) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  product,
  onSaveAlert,
}) => {
  if (!isOpen || !product) return null;

  const minLanded = Math.min(...product.offers.map(o => calculateLandedCost(o).netPrice));
  const suggestedTarget = Math.round(minLanded * 0.92); // 8% drop target

  const [targetPrice, setTargetPrice] = useState(suggestedTarget);
  const [email, setEmail] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || targetPrice <= 0) return;

    onSaveAlert({
      productId: product.id,
      productTitle: product.title,
      targetPrice,
      currentPrice: minLanded,
      email,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">Price Drop Alert</h3>
              <p className="text-xs text-stone-500">Skyscanner-style price monitoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isSaved ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-base">Price Alert Activated!</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                We'll email you immediately at <span className="font-semibold text-stone-800">{email}</span> if {product.title} drops below S${targetPrice}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 h-12 rounded-lg object-cover bg-stone-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-stone-500 truncate">{product.brand}</div>
                  <div className="font-semibold text-stone-900 text-xs sm:text-sm truncate">
                    {product.title}
                  </div>
                  <div className="text-xs font-mono font-medium text-stone-700 mt-0.5">
                    Current Best: S${minLanded.toFixed(0)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Notify me when price drops below (SGD):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-stone-400 font-bold">
                    S$
                  </span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={e => setTargetPrice(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono font-bold text-base outline-none focus:border-stone-950 focus:bg-white"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setTargetPrice(Math.round(minLanded * 0.95))}
                    className="text-[11px] px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-medium cursor-pointer"
                  >
                    -5% (S${Math.round(minLanded * 0.95)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetPrice(Math.round(minLanded * 0.9))}
                    className="text-[11px] px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-medium cursor-pointer"
                  >
                    -10% (S${Math.round(minLanded * 0.9)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetPrice(Math.round(minLanded * 0.85))}
                    className="text-[11px] px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-medium cursor-pointer"
                  >
                    -15% (S${Math.round(minLanded * 0.85)})
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your notification email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm outline-none focus:border-stone-950 focus:bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-2"
              >
                <span>Create BASKT Price Tracker</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
