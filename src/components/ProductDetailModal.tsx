import React, { useState } from 'react';
import { X, Check, Shield, Truck, RotateCcw, Heart, SlidersHorizontal, ChevronRight, Star } from 'lucide-react';
import { Product, ColorOption, StorageOption } from '../types';
import { CARRIER_OPTIONS, TRADE_IN_DATA } from '../data/products';
import { useStore } from '../context/StoreContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isInCompare,
  } = useStore();

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption>(product.storageOptions[0]);
  const [selectedCarrier, setSelectedCarrier] = useState(CARRIER_OPTIONS[0].name);

  // Trade-in module state within PDP
  const [wantsTradeIn, setWantsTradeIn] = useState(false);
  const [tradeInBrand, setTradeInBrand] = useState(TRADE_IN_DATA[0].brand);
  const [tradeInModel, setTradeInModel] = useState(TRADE_IN_DATA[0].models[0].name);
  const [tradeInCondition, setTradeInCondition] = useState<'flawless' | 'good' | 'cracked'>('good');

  // Active specs/reviews tab
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorited = isWishlisted(product.id);
  const isCompared = isInCompare(product.id);

  // Calculate trade-in valuation
  const currentBrandModels = TRADE_IN_DATA.find((b) => b.brand === tradeInBrand)?.models || [];
  const selectedModelData = currentBrandModels.find((m) => m.name === tradeInModel) || currentBrandModels[0];
  const maxCredit = selectedModelData ? selectedModelData.maxCredit : 0;

  const conditionMultiplier =
    tradeInCondition === 'flawless' ? 1 : tradeInCondition === 'good' ? 0.8 : 0.45;
  const calculatedTradeInCredit = wantsTradeIn ? Math.round(maxCredit * conditionMultiplier) : 0;

  // Final price calculation
  const currentPrice = product.basePrice + selectedStorage.priceDelta;
  const netPrice = Math.max(0, currentPrice - calculatedTradeInCredit);
  const monthlyEstimate = (netPrice / 24).toFixed(2);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      image: selectedImage || product.image,
      color: selectedColor,
      storage: selectedStorage,
      carrier: selectedCarrier,
      unitPrice: currentPrice,
      quantity: 1,
      tradeInCredit: calculatedTradeInCredit,
      tradeInDevice: wantsTradeIn ? `${tradeInBrand} ${selectedModelData?.name || ''} (${tradeInCondition})` : undefined,
    });
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#111215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Sticky Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#14151a]">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
              {product.brand}
            </span>
            <span className="text-neutral-600">/</span>
            <span className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompare(product.id)}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
              }`}
              title="Compare with other phones"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">{isCompared ? 'Compared' : 'Compare'}</span>
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isFavorited
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
              }`}
              title="Add to wishlist"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer ml-1"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body: Contiguous purchase module */}
        <div className="overflow-y-auto flex-1 p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Gallery & Visual showcase */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Image viewer */}
              <div className="relative aspect-[4/3] sm:aspect-square bg-neutral-900/80 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center p-4">
                <img
                  src={selectedImage}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              {product.gallery.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.gallery.map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(thumb)}
                      className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        selectedImage === thumb ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={thumb}
                        alt={`${product.name} view ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Highlights List */}
              <div className="pt-4 border-t border-white/8 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Key Capabilities
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  {product.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="lg:col-span-6 space-y-6">
              {/* Product Header & Pricing */}
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                  <span>★ {product.rating.toFixed(1)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.reviewCount} Verified Ratings</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-medium">In Stock & Ready to Ship</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                  {product.name}
                </h2>
                <p className="text-sm text-neutral-400 mt-1">{product.tagline}</p>

                {/* Price Display */}
                <div className="mt-4 p-4 rounded-xl bg-neutral-900/90 border border-white/8 flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold font-mono tabular-nums text-white">
                        ${netPrice}
                      </span>
                      {calculatedTradeInCredit > 0 && (
                        <span className="text-sm font-mono tabular-nums text-neutral-500 line-through">
                          ${currentPrice}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5">
                      or <span className="text-white font-mono tabular-nums font-semibold">${monthlyEstimate}/mo</span> for 24 mos with 0% APR
                    </div>
                  </div>

                  {calculatedTradeInCredit > 0 && (
                    <div className="text-right">
                      <span className="text-xs font-medium text-emerald-400 font-mono tabular-nums">
                        -${calculatedTradeInCredit} Trade-in Credit
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 1. Finish / Color Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-300">Finish</span>
                  <span className="text-neutral-400">{selectedColor.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      aria-label={color.name}
                      className={`relative w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedColor.name === color.name
                          ? 'border-white scale-110 shadow-md ring-2 ring-white/20'
                          : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Storage Capacity Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-300">Storage Capacity</span>
                  <span className="text-neutral-400">Selected: {selectedStorage.capacity}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {product.storageOptions.map((opt) => (
                    <button
                      key={opt.capacity}
                      onClick={() => setSelectedStorage(opt)}
                      className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                        selectedStorage.capacity === opt.capacity
                          ? 'bg-white text-neutral-950 font-semibold border-white shadow-sm'
                          : 'bg-neutral-900 border-white/10 text-neutral-300 hover:border-white/30'
                      }`}
                    >
                      <div className="text-xs font-bold font-mono">{opt.capacity}</div>
                      <div className="text-[11px] opacity-75 font-mono tabular-nums mt-0.5">
                        {opt.priceDelta === 0 ? 'Included' : `+$${opt.priceDelta}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Connectivity / Carrier */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-300">Network Connectivity</span>
                  <span className="text-neutral-400">{selectedCarrier}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {CARRIER_OPTIONS.map((carrier) => (
                    <button
                      key={carrier.id}
                      onClick={() => setSelectedCarrier(carrier.name)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                        selectedCarrier === carrier.name
                          ? 'border-amber-400 bg-amber-500/10 text-white'
                          : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="font-medium">{carrier.name}</div>
                      <div className="text-[10px] text-neutral-500 truncate">{carrier.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Trade-In Module */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/8 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Trade-In Your Current Device</div>
                    <div className="text-[11px] text-neutral-400">Save up to $650 with instant credit</div>
                  </div>
                  <button
                    onClick={() => setWantsTradeIn(!wantsTradeIn)}
                    className={`py-1 px-3 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                      wantsTradeIn
                        ? 'bg-amber-400 text-neutral-950 border-amber-400 font-semibold'
                        : 'border-white/10 text-neutral-300 hover:border-white/30'
                    }`}
                  >
                    {wantsTradeIn ? 'Active' : '+ Add Trade-In'}
                  </button>
                </div>

                {wantsTradeIn && (
                  <div className="pt-2 border-t border-white/6 space-y-2.5 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-neutral-400 block mb-1 text-[11px]">Brand</label>
                        <select
                          value={tradeInBrand}
                          onChange={(e) => {
                            setTradeInBrand(e.target.value);
                            const newModels = TRADE_IN_DATA.find((b) => b.brand === e.target.value)?.models || [];
                            if (newModels.length > 0) setTradeInModel(newModels[0].name);
                          }}
                          className="w-full bg-neutral-800 border border-white/10 rounded-md p-1.5 text-white"
                        >
                          {TRADE_IN_DATA.map((b) => (
                            <option key={b.brand} value={b.brand} className="bg-neutral-900">
                              {b.brand}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1 text-[11px]">Model</label>
                        <select
                          value={tradeInModel}
                          onChange={(e) => setTradeInModel(e.target.value)}
                          className="w-full bg-neutral-800 border border-white/10 rounded-md p-1.5 text-white truncate"
                        >
                          {currentBrandModels.map((m) => (
                            <option key={m.name} value={m.name} className="bg-neutral-900">
                              {m.name} (up to ${m.maxCredit})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1 text-[11px]">Physical Condition</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'flawless', label: 'Flawless (100%)' },
                          { id: 'good', label: 'Good (80%)' },
                          { id: 'cracked', label: 'Cracked (45%)' },
                        ].map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setTradeInCondition(c.id as any)}
                            className={`p-1.5 rounded border text-center text-[11px] cursor-pointer ${
                              tradeInCondition === c.id
                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                                : 'border-white/10 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs text-neutral-300">
                      <span>Applied Instant Discount:</span>
                      <span className="font-mono tabular-nums font-bold text-emerald-400">
                        -${calculatedTradeInCredit}.00
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Contiguous Add to Bag Button */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xl ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-neutral-950 hover:bg-neutral-200'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <>
                      <span>Add to Bag</span>
                      <span className="text-neutral-500">·</span>
                      <span className="font-mono tabular-nums">${netPrice}</span>
                    </>
                  )}
                </button>

                {/* Purchase Trust Markers */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-neutral-400 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Free Express Ship</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-300" />
                    <span>30-Day Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-neutral-300" />
                    <span>2-Yr Aura Care</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Technical Specifications & Verified Reviews Tabs */}
          <div className="mt-12 pt-8 border-t border-white/8">
            <div className="flex items-center gap-6 border-b border-white/8 mb-6">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'specs'
                    ? 'border-white text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Detailed Technical Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
                  activeTab === 'reviews'
                    ? 'border-white text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <span>Customer Reviews</span>
                <span className="text-xs font-mono text-neutral-500">
                  ({product.reviews.length})
                </span>
              </button>
            </div>

            {activeTab === 'specs' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
                {Object.entries(product.specs).map(([key, value]) => {
                  const formattedKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase());
                  return (
                    <div
                      key={key}
                      className="flex items-baseline justify-between py-2 border-b border-white/5"
                    >
                      <span className="text-neutral-400 font-medium">{formattedKey}</span>
                      <span className="text-neutral-200 font-mono text-right max-w-xs">{value}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-neutral-900/60 border border-white/6 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{rev.author}</span>
                        {rev.verified && (
                          <span className="text-[11px] text-emerald-400">· Verified Buyer</span>
                        )}
                      </div>
                      <span className="text-neutral-500">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400' : 'text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="font-semibold text-neutral-200">{rev.title}</div>
                    <p className="text-neutral-400 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
