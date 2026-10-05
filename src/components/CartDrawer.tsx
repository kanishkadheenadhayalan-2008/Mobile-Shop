import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    appliedPromo,
    applyPromo,
    removePromo,
    cartSubtotal,
    cartDiscount,
    cartTradeInTotal,
    cartTax,
    cartTotal,
    closeModal,
    openCheckoutModal,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoMessage({ text: res.message, error: !res.success });
    if (res.success) setPromoInput('');
  };

  const freeShippingThreshold = 100;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111215] border-l border-white/10 flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 bg-[#14151a]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Your Shopping Bag
              </h2>
              <span className="text-xs font-mono tabular-nums text-neutral-400">
                ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            </div>

            <button
              onClick={closeModal}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Progress */}
          <div className="px-6 py-3 bg-[#16181e] border-b border-white/6 text-xs">
            <div className="flex items-center justify-between text-neutral-300 mb-1">
              <span>{isFreeShipping ? 'Complimentary Priority Express Shipping Unlocked' : 'Add more for Free Priority Shipping'}</span>
              <span className="font-mono text-emerald-400 font-semibold">100% Free</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cart Itemized List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-white/6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-white/5 mx-auto flex items-center justify-center text-neutral-500">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="text-sm text-neutral-300 font-medium">Your shopping bag is empty</div>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Explore our engineered lineup of smartphones, foldables, and accessories.
                </p>
                <button
                  onClick={closeModal}
                  className="py-2 px-5 bg-white text-neutral-950 font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-neutral-900 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 p-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Specs */}
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5">
                        <span>{item.color.name}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{item.storage.capacity}</span>
                      </div>

                      {item.tradeInCredit > 0 && (
                        <div className="text-[11px] text-emerald-400 mt-0.5">
                          Trade-In: -${item.tradeInCredit} credit applied
                        </div>
                      )}
                    </div>

                    {/* Stepper & Price Row */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-white/10 rounded-lg bg-neutral-900 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 px-2 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 px-2 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold font-mono tabular-nums text-white">
                          ${(item.unitPrice * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/8 bg-[#14151a] space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. UPGRADE50)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full bg-[#181a20] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-3.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium border border-white/10 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-md">
                    <span>{appliedPromo.label} ({appliedPromo.code})</span>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="text-xs text-neutral-400 hover:text-rose-400 underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoMessage && !appliedPromo && (
                  <div className={`text-[11px] ${promoMessage.error ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {promoMessage.text}
                  </div>
                )}
              </form>

              {/* Cost Calculation Breakdown with tabular figures */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-white/6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-white">
                    ${cartSubtotal.toLocaleString()}
                  </span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promotional Discount</span>
                    <span className="font-mono tabular-nums">-${cartDiscount.toFixed(2)}</span>
                  </div>
                )}

                {cartTradeInTotal > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Trade-In Hardware Credit</span>
                    <span className="font-mono tabular-nums">-${cartTradeInTotal.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Tax (8.25%)</span>
                  <span className="font-mono tabular-nums text-white">${cartTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-medium">Free Express</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-white/8 text-sm font-bold text-white">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums text-base text-amber-400">
                    ${cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={openCheckoutModal}
                className="w-full py-3.5 px-6 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs rounded-xl transition-all duration-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>256-Bit Encrypted Checkout · 30-Day Return Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
