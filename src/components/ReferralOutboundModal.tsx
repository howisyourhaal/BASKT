import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Check, Copy, ShieldCheck, Loader2 } from 'lucide-react';
import { Product, StoreOffer } from '../data/products.ts';

interface ReferralOutboundModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: {
    product: Product;
    offer: StoreOffer;
    netPrice: number;
    appliedPromo?: string;
  } | null;
}

export const ReferralOutboundModal: React.FC<ReferralOutboundModalProps> = ({
  isOpen,
  onClose,
  deal,
}) => {
  const [copied, setCopied] = useState(false);
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        setRedirecting(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !deal) return null;

  const { product, offer, netPrice, appliedPromo } = deal;

  const handleCopyCode = () => {
    if (appliedPromo) {
      navigator.clipboard.writeText(appliedPromo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenStore = () => {
    window.open(offer.directBuyUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-900 text-sm">Transferring to Retailer</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-5">
          {redirecting ? (
            <div className="py-6 space-y-3">
              <Loader2 className="w-10 h-10 animate-spin text-stone-950 mx-auto" />
              <h4 className="font-bold text-stone-900 text-base">
                Verifying live inventory on {offer.storeName}...
              </h4>
              <p className="text-xs text-stone-500">
                Securing lowest landed price guarantee & promo code application
              </p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-stone-950">
                  Ready to complete on {offer.storeName}
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  We've locked in the lowest verified landed price for Singapore delivery.
                </p>
              </div>

              {/* Deal Breakdown Box */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-left space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Product:</span>
                  <span className="font-semibold text-stone-900 text-right truncate max-w-[200px]">
                    {product.title}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Store:</span>
                  <span className="font-semibold text-stone-900">{offer.storeName}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery to SG:</span>
                  <span className="font-semibold text-emerald-700">{offer.deliveryEstimate}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Warranty:</span>
                  <span className="font-semibold text-stone-900 truncate max-w-[180px]">{offer.warranty}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="font-bold text-stone-900">Final Landed Price:</span>
                  <span className="text-xl font-bold font-mono text-stone-950">
                    S${netPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Promo Code to Copy */}
              {appliedPromo && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-[10px] text-amber-800 font-semibold uppercase tracking-wider">
                      Promo Code
                    </div>
                    <div className="font-mono font-bold text-sm text-stone-950">
                      {appliedPromo}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-amber-200/70 hover:bg-amber-300 text-amber-900 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              )}

              {/* Affiliate & Landed info */}
              <div className="text-[11px] text-stone-400">
                Tracking Session Ref: <span className="font-mono">BSKT-AFF-SG-{offer.id.slice(0, 8)}</span>
              </div>

              {/* Action */}
              <button
                onClick={handleOpenStore}
                className="w-full py-3 bg-stone-950 hover:bg-stone-800 text-white font-medium text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to {offer.storeName}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
