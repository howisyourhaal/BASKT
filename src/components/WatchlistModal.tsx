import React from 'react';
import { Product } from '../types';
import { getProductLandedComparison } from '../utils/priceCalculator';
import { X, Bookmark, Trash2, ExternalLink, TrendingDown, ArrowRight } from 'lucide-react';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: Product[];
  onRemove: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  watchlist,
  onRemove,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-neutral-900 text-white rounded-lg">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Your Saved Watchlist</h2>
              <div className="text-[11px] text-neutral-500">
                {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} being tracked
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
          {watchlist.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Bookmark className="w-10 h-10 text-neutral-300 mx-auto" />
              <div className="text-sm font-semibold text-neutral-700">Your Watchlist is empty</div>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Click the bookmark icon on any product to save it here and track real-time price drops.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {watchlist.map((prod) => {
                const comparison = getProductLandedComparison(prod);

                return (
                  <div
                    key={prod.id}
                    className="py-3 flex items-center justify-between gap-4 hover:bg-neutral-50/70 p-2 rounded-xl transition-colors"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      onClick={() => {
                        onSelectProduct(prod);
                        onClose();
                      }}
                    >
                      <div className="w-14 h-14 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] text-neutral-500 font-medium">{prod.brand}</div>
                        <div className="text-xs font-bold text-neutral-900 truncate">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-neutral-600 flex items-center gap-2 mt-0.5">
                          <span>
                            Lowest: <strong className="text-emerald-700 font-bold">${comparison.lowestLandedPrice}</strong>
                          </span>
                          <span>·</span>
                          <span className="truncate">{comparison.cheapestRetailer.retailerName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onSelectProduct(prod);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span>Compare</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onRemove(prod.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
