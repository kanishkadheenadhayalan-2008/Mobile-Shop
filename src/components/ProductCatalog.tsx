import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Heart } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';

interface ProductCatalogProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
}) => {
  const { wishlist, compareList, openCompareModal } = useStore();

  const [priceRange, setPriceRange] = useState<'all' | 'under700' | '700to1200' | 'above1200'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', label: 'All Hardware' },
    { id: 'flagship', label: 'Flagship Phones' },
    { id: 'foldable', label: 'Foldables' },
    { id: 'compact', label: 'Compact Series' },
    { id: 'tablet', label: 'Slates & Tablets' },
    { id: 'gear', label: 'Audio & Gear' },
  ];

  // Filtering & Sorting pipeline
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category match
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesSpecs = Object.values(product.specs).some((val) =>
          val.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesDesc && !matchesSpecs) return false;
      }

      // Price match
      if (priceRange === 'under700' && product.basePrice >= 700) return false;
      if (
        priceRange === '700to1200' &&
        (product.basePrice < 700 || product.basePrice > 1200)
      ) {
        return false;
      }
      if (priceRange === 'above1200' && product.basePrice <= 1200) return false;

      // Wishlist filter
      if (showOnlyWishlist && !wishlist.includes(product.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default order
    });
  }, [selectedCategory, searchQuery, priceRange, showOnlyWishlist, sortBy, wishlist]);

  const activeFilterCount =
    (priceRange !== 'all' ? 1 : 0) +
    (showOnlyWishlist ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    onSelectCategory('all');
    setPriceRange('all');
    setShowOnlyWishlist(false);
    onClearSearch();
  };

  return (
    <section id="catalog-section" className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/8">
        <div>
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            Engineered Catalog
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Next-Generation Mobile Devices
          </h2>
        </div>

        {/* Comparison Floating pill / button if items selected */}
        {compareList.length > 0 && (
          <button
            onClick={openCompareModal}
            className="self-start md:self-auto py-2 px-4 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Compare {compareList.length} Devices Side-by-Side</span>
          </button>
        )}
      </div>

      {/* Segmented Filter Control Bar (Permitted button tabs as interactive controls per skill) */}
      <div className="pt-6 pb-4 flex flex-wrap items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#15161b] rounded-xl border border-white/8 overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`py-1.5 px-3.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary Filter & Sort triggers */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Wishlist toggle */}
          <button
            onClick={() => setShowOnlyWishlist(!showOnlyWishlist)}
            className={`py-1.5 px-3 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showOnlyWishlist
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-[#15161b] border-white/8 text-neutral-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlyWishlist ? 'fill-rose-400' : ''}`} />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          {/* Filter options toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`py-1.5 px-3 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showFilters || priceRange !== 'all'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-[#15161b] border-white/8 text-neutral-400 hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {priceRange !== 'all' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
          </button>

          {/* Sort selector */}
          <div className="flex items-center bg-[#15161b] border border-white/8 rounded-lg px-2.5 py-1 text-xs text-neutral-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 mr-1.5 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-neutral-300 focus:outline-none cursor-pointer pr-1"
            >
              <option value="featured" className="bg-neutral-900">Featured</option>
              <option value="price-asc" className="bg-neutral-900">Price: Low to High</option>
              <option value="price-desc" className="bg-neutral-900">Price: High to Low</option>
              <option value="rating" className="bg-neutral-900">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expanded Filter Drawer if toggled */}
      {showFilters && (
        <div className="mb-6 p-4 rounded-xl bg-[#141519] border border-white/8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="font-semibold text-neutral-300 mb-2">Price Range</div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under700', label: 'Under $700' },
                { id: '700to1200', label: '$700 – $1,200' },
                { id: 'above1200', label: 'Above $1,200' },
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setPriceRange(range.id as any)}
                  className={`py-1 px-2.5 rounded-md border text-xs cursor-pointer ${
                    priceRange === range.id
                      ? 'bg-white text-black font-semibold border-white'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold text-neutral-300 mb-2">Active Invariants</div>
            <div className="text-neutral-400 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>All devices backed by official 2-year warranty</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Unlocked global dual SIM + eSIM ready</span>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 md:col-span-1 flex items-end justify-end">
            {activeFilterCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="py-1 px-3 text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer"
              >
                Clear all active filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active filters indicators with typographic separators (anti-pill) */}
      <div className="flex items-center justify-between text-xs text-neutral-400 pb-6">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <span className="text-white font-mono tabular-nums font-semibold">
            {filteredProducts.length}
          </span>
          <span>devices</span>
          {searchQuery && (
            <>
              <span aria-hidden="true">·</span>
              <span>matching &ldquo;{searchQuery}&rdquo;</span>
              <button
                onClick={onClearSearch}
                className="text-amber-400 hover:underline ml-1 cursor-pointer"
              >
                Clear
              </button>
            </>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={resetAllFilters}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Product Grid: 3 columns desktop, 2 columns tablet, 1 column mobile */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-2xl bg-[#141519] border border-white/8 space-y-4">
          <div className="text-neutral-400 text-sm">
            No devices matched the selected criteria.
          </div>
          <button
            onClick={resetAllFilters}
            className="py-2 px-5 bg-white text-neutral-900 font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
