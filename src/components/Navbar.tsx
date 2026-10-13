import { Sparkles, Footprints } from 'lucide-react';

interface NavbarProps {
  currentTab: 'today' | 'missions' | 'history' | 'guide';
  onSelectTab: (tab: 'today' | 'missions' | 'history' | 'guide') => void;
  isWalkActive: boolean;
  onOpenWalk: () => void;
  onQuickStart: () => void;
}

export function Navbar({
  currentTab,
  onSelectTab,
  isWalkActive,
  onOpenWalk,
  onQuickStart,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#F8F9F5]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectTab('today')}
          className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2 whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
        >
          <span className="w-8 h-8 rounded-full bg-emerald-800 text-stone-100 flex items-center justify-center font-serif text-base">
            🌿
          </span>
          <span>NatureHeal</span>
        </button>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('today')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'today'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => onSelectTab('missions')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'missions'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            Sensory Walks
          </button>
          <button
            onClick={() => onSelectTab('guide')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'guide'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            Voice Guide
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'history'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-stone-900'
            }`}
          >
            Detox Log
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {isWalkActive ? (
            <button
              onClick={onOpenWalk}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-98 whitespace-nowrap shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Active Walk</span>
            </button>
          ) : (
            <button
              onClick={onQuickStart}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-50 bg-emerald-900 hover:bg-emerald-800 rounded-xl transition-all shadow-sm active:scale-98 whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Footprints className="w-4 h-4" />
              <span>Step Outside</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
