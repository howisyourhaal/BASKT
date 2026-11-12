import React from 'react';
import { Sparkles, Camera, MapPin, Bookmark } from 'lucide-react';

interface HeaderProps {
  onOpenVisualSearch: () => void;
  onOpenConcierge: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  deliveryLocation: string;
  onSelectLocation: (loc: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenVisualSearch,
  onOpenConcierge,
  onOpenWatchlist,
  watchlistCount,
  deliveryLocation,
  onSelectLocation,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <a href="/" className="text-xl font-bold tracking-tight text-neutral-950 whitespace-nowrap shrink-0 flex items-center gap-2">
          <span>BASKT</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
            Price Intelligence
          </span>
        </a>

        {/* Zone 2: 4-5 concise navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-neutral-950 transition-colors whitespace-nowrap shrink-0"
          >
            Price Comparison
          </button>
          <button
            onClick={onOpenVisualSearch}
            className="flex items-center gap-1.5 hover:text-neutral-950 transition-colors whitespace-nowrap shrink-0"
          >
            <Camera className="w-4 h-4 text-neutral-500" />
            <span>Visual Lens</span>
          </button>
          <button
            onClick={onOpenConcierge}
            className="flex items-center gap-1.5 hover:text-neutral-950 transition-colors whitespace-nowrap shrink-0 text-amber-700 font-semibold"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI Shopping Concierge</span>
          </button>
          <button
            onClick={onOpenWatchlist}
            className="flex items-center gap-1.5 hover:text-neutral-950 transition-colors whitespace-nowrap shrink-0"
          >
            <Bookmark className="w-4 h-4 text-neutral-500" />
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="text-xs font-semibold tabular-nums text-white bg-neutral-900 rounded-full px-1.5 py-0.2">
                {watchlistCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Location Delivery Selector (Addresses Page 2 & Page 4 'Ships to SG' requirement) */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
              <span>Ships to: {deliveryLocation}</span>
            </button>
            <div className="absolute right-0 mt-1 w-44 bg-white border border-neutral-200 rounded-md shadow-lg hidden group-hover:block z-50 p-1">
              <div className="px-2 py-1 text-[11px] font-semibold text-neutral-600">Select Destination</div>
              <button
                onClick={() => onSelectLocation('Singapore (SG 🇸🇬)')}
                className="w-full text-left px-2 py-1.5 text-xs hover:bg-neutral-100 rounded text-neutral-800 flex items-center justify-between"
              >
                <span>Singapore 🇸🇬</span>
                <span className="text-[10px] text-emerald-600 font-medium">GST & Duties calc</span>
              </button>
              <button
                onClick={() => onSelectLocation('Malaysia (MY 🇲🇾)')}
                className="w-full text-left px-2 py-1.5 text-xs hover:bg-neutral-100 rounded text-neutral-800 flex items-center justify-between"
              >
                <span>Malaysia 🇲🇾</span>
                <span className="text-[10px] text-neutral-500">Cross-border</span>
              </button>
              <button
                onClick={() => onSelectLocation('United States (US 🇺🇸)')}
                className="w-full text-left px-2 py-1.5 text-xs hover:bg-neutral-100 rounded text-neutral-800 flex items-center justify-between"
              >
                <span>United States 🇺🇸</span>
                <span className="text-[10px] text-neutral-500">Global</span>
              </button>
            </div>
          </div>

          <button
            onClick={onOpenConcierge}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Concierge</span>
          </button>
        </div>
      </div>
    </header>
  );
};
