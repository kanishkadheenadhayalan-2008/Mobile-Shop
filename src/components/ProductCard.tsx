import React, { useState } from 'react';
import { Heart, SlidersHorizontal, Check, Eye, Smartphone } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    openPdpModal,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isInCompare,
    addToCart,
  } = useStore();

  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isWishlisted(product.id);
  const compared = isInCompare(product.id);
  const activeColor = product.colors[activeColorIdx] || product.colors[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      color: activeColor,
      storage: product.storageOptions[0],
      carrier: 'Unlocked (SIM-Free)',
      unitPrice: product.basePrice,
      quantity: 1,
      tradeInCredit: 0,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <article
      onClick={() => openPdpModal(product)}
      className="group relative flex flex-col bg-[#141519] border border-white/8 hover:border-white/20 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      {/* Top action row: Wishlist and Compare affordances */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(product.id);
          }}
          aria-label={compared ? 'Remove from compare' : 'Add to compare'}
          title={compared ? 'In comparison' : 'Compare device specs'}
          className={`p-2 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
            compared
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-black/50 text-neutral-400 hover:text-white hover:bg-black/70 border border-white/10'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          title={isFavorited ? 'Saved in wishlist' : 'Save to wishlist'}
          className={`p-2 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
            isFavorited
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-black/50 text-neutral-400 hover:text-white hover:bg-black/70 border border-white/10'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Subtle single editorial kicker if applicable */}
      {product.badge && (
        <div className="absolute top-3.5 left-3.5 z-20">
          <span className="text-[11px] font-medium tracking-wide text-neutral-300 bg-neutral-900/80 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
            {product.badge}
          </span>
        </div>
      )}

      {/* Visual Slot: takes ~65% of upper card space */}
      <div className="relative w-full aspect-[4/3] bg-neutral-900/60 overflow-hidden flex items-center justify-center p-4">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-lg text-neutral-500 gap-2">
            <Smartphone className="w-10 h-10 text-neutral-400" />
            <span className="text-xs text-neutral-400">{product.name}</span>
          </div>
        )}

        {/* Quick view hover badge */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 bg-neutral-900/90 text-white text-xs font-medium rounded-md border border-white/15 backdrop-blur-sm">
            <Eye className="w-3.5 h-3.5" />
            <span>View Specifications</span>
          </span>
        </div>
      </div>

      {/* Card Content & Purchasing info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata: Category and Rating with typographic separator */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
            <span className="uppercase tracking-wider font-medium text-[11px] text-neutral-500">
              {product.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span>★ {product.rating.toFixed(1)}</span>
            <span className="text-neutral-500">({product.reviewCount})</span>
          </div>

          {/* Product Title */}
          <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-amber-300 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Quiet 1-line summary */}
          <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Color Swatch Dots */}
        <div
          className="flex items-center gap-1.5 pt-1"
          onClick={(e) => e.stopPropagation()}
        >
          {product.colors.map((color, idx) => (
            <button
              key={color.name}
              onClick={() => setActiveColorIdx(idx)}
              aria-label={`Select ${color.name}`}
              title={color.name}
              className={`w-3.5 h-3.5 rounded-full border transition-transform cursor-pointer ${
                activeColorIdx === idx
                  ? 'border-white scale-125'
                  : 'border-transparent opacity-75 hover:opacity-100 hover:scale-110'
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
          <span className="text-[11px] text-neutral-400 ml-1 truncate">
            {activeColor.name}
          </span>
        </div>

        {/* Pricing & Contiguous Action */}
        <div className="pt-2 border-t border-white/6 flex items-center justify-between gap-2">
          <div>
            <div className="text-xs text-neutral-500">Starting from</div>
            <div className="text-base font-bold text-white font-mono tabular-nums">
              ${product.basePrice}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickAdd}
              className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-neutral-900 hover:bg-neutral-200'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <span>Quick Add</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
