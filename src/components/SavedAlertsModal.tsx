import React from 'react';
import { X, Bell, Trash2, ArrowUpRight } from 'lucide-react';

export interface SavedAlert {
  productId: string;
  productTitle: string;
  targetPrice: number;
  currentPrice: number;
  email: string;
  dateCreated: string;
}

interface SavedAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: SavedAlert[];
  onRemoveAlert: (productId: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const SavedAlertsModal: React.FC<SavedAlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onRemoveAlert,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">Active Price Trackers</h3>
              <p className="text-xs text-stone-500">{alerts.length} active notifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-stone-500 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-stone-300" />
              <div className="text-sm font-medium text-stone-700">No active price trackers</div>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Open any product comparison and tap "Track Price Drop" to get notified when prices drop.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {alerts.map(alert => (
                <div
                  key={alert.productId}
                  className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3"
                >
                  <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => {
                      onSelectProduct(alert.productId);
                      onClose();
                    }}
                  >
                    <h5 className="font-semibold text-stone-900 text-xs sm:text-sm truncate hover:text-amber-700">
                      {alert.productTitle}
                    </h5>
                    <div className="flex items-center gap-2 mt-1 text-xs text-stone-500 font-mono">
                      <span>Target: <strong className="text-stone-900">S${alert.targetPrice}</strong></span>
                      <span>·</span>
                      <span>Current: S${alert.currentPrice}</span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      Notify: {alert.email}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onSelectProduct(alert.productId);
                        onClose();
                      }}
                      title="View Product"
                      className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveAlert(alert.productId)}
                      title="Delete Tracker"
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
