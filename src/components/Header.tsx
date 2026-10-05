import React, { useState } from 'react';
import { ShoppingBag, Heart, SlidersHorizontal, Search, Menu, X, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const {
    cartCount,
    wishlist,
    compareList,
    openCartDrawer,
    openCompareModal,
    openTradeInModal,
    openTrackerModal,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const scrollToCatalog = (catId?: string) => {
    if (catId) onSelectCategory(catId);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d0e]/95 backdrop-blur-md border-b border-white/8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-2xl font-bold tracking-tighter text-white font-display flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-sm"
        >
          <span>AURA</span>
          <span className="text-amber-500 font-normal">.</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400"
        >
          <button
            onClick={() => scrollToCatalog('flagship')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Flagships
          </button>
          <button
            onClick={() => scrollToCatalog('foldable')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Foldables
          </button>
          <button
            onClick={() => scrollToCatalog('tablet')}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Tablets
          </button>
          <button
            onClick={openTradeInModal}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Trade-In
          </button>
          <button
            onClick={openCompareModal}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap relative"
          >
            Compare
            {compareList.length > 0 && (
              <span className="ml-1 text-[11px] text-amber-400 font-mono tabular-nums">
                ({compareList.length})
              </span>
            )}
          </button>
          <button
            onClick={() => openTrackerModal()}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Track Order</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions & utility affordances */}
        <div className="flex items-center gap-3">
          {/* Quick Search Toggle / Input */}
          <div className="relative">
            {showSearchInput ? (
              <div className="flex items-center bg-[#181a1f] border border-white/10 rounded-lg px-2.5 py-1 text-sm">
                <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search phones, specs..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="bg-transparent text-white placeholder-neutral-500 focus:outline-none w-36 sm:w-48 text-xs"
                />
                <button
                  onClick={() => {
                    setShowSearchInput(false);
                    onSearchChange('');
                  }}
                  className="text-neutral-400 hover:text-white ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                aria-label="Open search"
                className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Compare Trigger button for mobile & quick access */}
          <button
            onClick={openCompareModal}
            aria-label="Compare phones"
            className="hidden sm:flex items-center gap-1.5 p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {compareList.length > 0 && (
              <span className="text-xs font-mono tabular-nums text-neutral-300">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => scrollToCatalog()}
            aria-label="Wishlist items"
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer relative"
          >
            <Heart
              className={`w-4 h-4 ${
                wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''
              }`}
            />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center font-mono tabular-nums">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag Drawer Trigger */}
          <button
            onClick={openCartDrawer}
            aria-label="View Shopping Bag"
            className="flex items-center gap-2 py-2 px-3.5 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 border border-white/10 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="font-mono tabular-nums">{cartCount}</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111215] border-b border-white/10 px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2 text-sm text-neutral-300">
            <button
              onClick={() => scrollToCatalog('flagship')}
              className="text-left py-2 hover:text-white transition-colors"
            >
              Flagship Smartphones
            </button>
            <button
              onClick={() => scrollToCatalog('foldable')}
              className="text-left py-2 hover:text-white transition-colors"
            >
              Foldables & Horizon Series
            </button>
            <button
              onClick={() => scrollToCatalog('tablet')}
              className="text-left py-2 hover:text-white transition-colors"
            >
              Mobile Slates & Tablets
            </button>
            <button
              onClick={() => scrollToCatalog('gear')}
              className="text-left py-2 hover:text-white transition-colors"
            >
              Audio & Power Gear
            </button>
            <div className="pt-2 border-t border-white/10 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openTradeInModal();
                }}
                className="text-left py-2 text-amber-400 font-medium"
              >
                Estimate Device Trade-In Credit
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCompareModal();
                }}
                className="text-left py-2 flex items-center justify-between"
              >
                <span>Compare Selected Devices</span>
                <span className="font-mono tabular-nums text-xs text-neutral-500">
                  {compareList.length} selected
                </span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openTrackerModal();
                }}
                className="text-left py-2 flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-neutral-400" />
                <span>Track Existing Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
