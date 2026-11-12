import React from 'react';
import { Sparkles, MapPin, SlidersHorizontal, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentLocation: string;
  onLocationChange: (loc: string) => void;
  onOpenAssistant: () => void;
  savedAlertsCount: number;
  onViewAlerts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onLocationChange,
  onOpenAssistant,
  savedAlertsCount,
  onViewAlerts,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#072044] border-b border-[#0f3263] text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#0062E3] text-white flex items-center justify-center font-bold tracking-tighter text-base group-hover:bg-[#0051bd] transition-colors shadow-sm">
              B
            </div>
            <span className="font-bold tracking-tight text-xl text-white font-sans">
              BASKT
            </span>
          </a>
          <span className="hidden sm:inline-block text-xs text-sky-200/60 font-mono tracking-wider uppercase border-l border-white/20 pl-3">
            $50 — $2,000 Goods
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-sky-100/90">
          <a href="#explore" className="hover:text-white transition-colors whitespace-nowrap">
            Compare
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors whitespace-nowrap">
            How It Works
          </a>
          <button
            onClick={onViewAlerts}
            className="hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <span>Price Alerts</span>
            {savedAlertsCount > 0 && (
              <span className="text-xs font-mono bg-[#0062E3] text-white px-1.5 py-0.2 rounded-full font-semibold">
                {savedAlertsCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-1.5 text-xs text-sky-300 bg-[#0a2f5f] border border-sky-400/25 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Landed Cost Verified</span>
          </div>
        </nav>

        {/* Zone 3: Actions (Location Selector & AI Concierge) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Location Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-sky-100 bg-[#0c2e5c] hover:bg-[#123b74] border border-[#184687] rounded-lg transition-colors whitespace-nowrap cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{currentLocation}</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white text-stone-900 border border-stone-200 rounded-xl shadow-xl p-1.5 hidden group-hover:block transition-all z-50">
              <div className="text-[11px] font-semibold text-stone-400 px-2.5 py-1 uppercase tracking-wider">
                Buying Destination
              </div>
              {[
                { code: 'Singapore (SGD $)', label: 'Singapore (SGD S$)' },
                { code: 'Malaysia (MYR RM)', label: 'Malaysia (MYR RM)' },
                { code: 'Hong Kong (HKD $)', label: 'Hong Kong (HKD $)' },
              ].map(loc => (
                <button
                  key={loc.code}
                  onClick={() => onLocationChange(loc.code)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    currentLocation === loc.code
                      ? 'bg-[#072044] text-white font-medium'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{loc.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Scout Button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-[#0062E3] hover:bg-[#0051bd] rounded-lg transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">AI Shopping Scout</span>
            <span className="sm:hidden">Scout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
