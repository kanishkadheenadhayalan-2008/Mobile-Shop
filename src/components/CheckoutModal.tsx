import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Banknote, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CheckoutModal: React.FC = () => {
  const { cart, cartSubtotal, cartDiscount, cartTradeInTotal, cartTax, cartTotal, placeOrder, closeModal } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod'>('card');
  const [formData, setFormData] = useState({
    fullName: 'Alexander Wright',
    email: 'alexander.wright@example.com',
    phone: '+1 (555) 349-8812',
    address: '742 Silicon Parkway, Suite 400',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '884',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      placeOrder(
        {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        paymentMethod
      );
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#111215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#14151a]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white">
              AURA Express Encrypted Checkout
            </span>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Shipping & Payment details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Shipping Address */}
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white text-[11px]">
                    1
                  </span>
                  <span>Shipping Destination</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="text-neutral-400 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#181a20] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Email for Shipment Updates</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#181a20] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Mobile Phone (Delivery SMS)</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#181a20] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-neutral-400 block mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-[#181a20] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#181a20] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-neutral-400 block mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-[#181a20] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block mb-1">ZIP Code</label>
                      <input
                        type="text"
                        required
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="w-full bg-[#181a20] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4 pt-4 border-t border-white/8">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white text-[11px]">
                    2
                  </span>
                  <span>Payment Gateway</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'apple_pay', label: 'Apple / Google Pay', icon: CheckCircle2 },
                    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3 rounded-xl border text-center transition-colors cursor-pointer flex flex-col items-center gap-1.5 ${
                          paymentMethod === method.id
                            ? 'border-amber-400 bg-amber-500/10 text-white font-semibold'
                            : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{method.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Conditional Fields based on method */}
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/8 space-y-3 text-xs">
                    <div>
                      <label className="text-neutral-400 block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full bg-[#181a20] border border-white/10 rounded-lg p-2.5 text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-neutral-400 block mb-1">Expiration</label>
                        <input
                          type="text"
                          value={formData.cardExp}
                          onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                          className="w-full bg-[#181a20] border border-white/10 rounded-lg p-2.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-neutral-400 block mb-1">CVC Code</label>
                        <input
                          type="password"
                          value={formData.cardCvc}
                          onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                          className="w-full bg-[#181a20] border border-white/10 rounded-lg p-2.5 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'apple_pay' && (
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/8 text-xs text-neutral-300 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Express One-Touch Verification Ready</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        Biometric authorization will be prompted upon placing order.
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-amber-500/30 text-xs text-neutral-300 space-y-1.5">
                    <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <Banknote className="w-4 h-4" />
                      <span>Cash on Delivery (Pay at Doorstep)</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Please have the exact amount of <span className="text-white font-mono font-bold">${cartTotal}</span> prepared in cash upon carrier delivery. An SMS confirmation will be sent 2 hours before courier arrival.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-white/10 space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Order Breakdown
                </div>

                <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-white/5 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3 text-xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-neutral-950 p-1 shrink-0"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white line-clamp-1">{item.name}</div>
                        <div className="text-[11px] text-neutral-400">
                          {item.color.name} · {item.storage.capacity} (x{item.quantity})
                        </div>
                      </div>
                      <div className="font-mono tabular-nums text-white font-semibold">
                        ${(item.unitPrice * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/8 space-y-1.5 text-xs text-neutral-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums text-white">
                      ${cartSubtotal.toLocaleString()}
                    </span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
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
                    <span>Taxes & Duties</span>
                    <span className="font-mono tabular-nums text-white">${cartTax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-emerald-400 font-medium">Free Expedited</span>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-white/8 text-base font-bold text-white">
                    <span>Total Due</span>
                    <span className="font-mono tabular-nums text-amber-400">
                      ${cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-3.5 px-6 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs rounded-xl transition-all duration-200 shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Order Authorization...</span>
                  ) : (
                    <>
                      <span>Authorize & Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Backed by AURA 30-Day Money-Back Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
