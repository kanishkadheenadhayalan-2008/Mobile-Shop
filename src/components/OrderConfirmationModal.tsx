import React from 'react';
import { CheckCircle2, Package, Printer, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderConfirmationModal: React.FC = () => {
  const { activeModal, openTrackerModal, closeModal } = useStore();
  const order = activeModal.lastOrder;

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleTrack = () => {
    closeModal();
    openTrackerModal(order.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#14151a]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white">Order Confirmed</span>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close confirmation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Success Banner */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white font-display">
              Thank You for Your Order
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              We have received your flagship order. A confirmation email and tracking link have been dispatched to <span className="text-white font-medium">{order.customer.email}</span>.
            </p>
          </div>

          {/* Key Identifiers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-neutral-900/80 border border-white/8 text-xs">
            <div>
              <div className="text-neutral-500">Order Number</div>
              <div className="font-mono font-bold text-white text-sm mt-0.5">{order.id}</div>
            </div>
            <div>
              <div className="text-neutral-500">Tracking Reference</div>
              <div className="font-mono text-amber-400 mt-0.5">{order.trackingNumber}</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-neutral-500">Estimated Delivery</div>
              <div className="text-white font-medium mt-0.5">{order.estimatedDelivery}</div>
            </div>
          </div>

          {/* Itemized Order Breakdown */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Purchased Hardware
            </div>

            <div className="divide-y divide-white/6 border border-white/8 rounded-xl bg-[#14151a] overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover bg-neutral-900 p-1 shrink-0"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-[11px] text-neutral-400">
                      {item.color} · {item.storage} (Qty: {item.quantity})
                    </div>
                  </div>
                  <div className="font-mono font-semibold text-white tabular-nums">
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}

              <div className="p-4 bg-neutral-900/90 space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-white">
                    ${order.subtotal.toLocaleString()}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                {order.tradeInTotal > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Trade-In Hardware Credit</span>
                    <span className="font-mono tabular-nums">-${order.tradeInTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Sales Tax</span>
                  <span className="font-mono tabular-nums text-white">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Priority Courier Dispatch</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/8 font-bold text-white text-sm">
                  <span>Total Paid</span>
                  <span className="font-mono tabular-nums text-amber-400">
                    ${order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/6 text-xs text-neutral-300 flex items-start justify-between">
            <div>
              <div className="font-semibold text-white">Shipping To:</div>
              <div className="mt-1 text-neutral-400">
                {order.customer.fullName}
                <br />
                {order.customer.address}
                <br />
                {order.customer.city}, {order.customer.state} {order.customer.zipCode}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Signature Required Upon Delivery</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleTrack}
              className="flex-1 py-3 px-5 bg-white text-neutral-950 font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Package className="w-4 h-4" />
              <span>Track Live Delivery Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handlePrint}
              className="py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
