import React, { useState } from 'react';
import { X, Package, Check, Copy, Truck, Clock, ShieldCheck, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderTrackerModal: React.FC = () => {
  const { orders, activeModal, closeModal } = useStore();

  const initialOrderId = activeModal.trackOrderId || orders[0]?.id || '';
  const [searchInput, setSearchInput] = useState(initialOrderId);
  const [copied, setCopied] = useState(false);

  const currentOrder = orders.find(
    (o) => o.id.toLowerCase() === searchInput.trim().toLowerCase()
  ) || orders[0];

  const milestones = [
    { title: 'Order Verified & Secured', desc: 'Payment verified and allocated in inventory', done: true, time: 'Oct 04, 14:32' },
    { title: 'Cleanroom Testing & Packaging', desc: 'Hardware passed diagnostic checks and optical sensor calibration', done: true, time: 'Oct 05, 08:15' },
    { title: 'Dispatched via Air Courier', desc: 'Departed central fulfillment hub via Express Air Cargo', done: currentOrder?.status === 'shipped' || currentOrder?.status === 'delivered', time: 'Oct 05, 18:40' },
    { title: 'Out for Local Delivery', desc: 'Courier en route to shipping address with secure signature', done: currentOrder?.status === 'delivered', time: 'Expected Oct 07' },
  ];

  const handleCopyTracking = () => {
    if (currentOrder?.trackingNumber) {
      navigator.clipboard?.writeText?.(currentOrder.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#14151a]">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">Live Shipment Tracker</span>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracker Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Order Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Enter Order # (e.g. AUR-928410)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[#181a20] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 uppercase font-mono"
              />
            </div>
            {orders.length > 1 && (
              <select
                value={currentOrder?.id}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-[#181a20] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id} className="bg-neutral-900">
                    {o.id} ({o.items[0]?.name})
                  </option>
                ))}
              </select>
            )}
          </div>

          {currentOrder ? (
            <div className="space-y-6">
              {/* Order Status Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/10 space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="text-[11px] text-neutral-500 uppercase tracking-wider">
                      Tracking Identification
                    </div>
                    <div className="text-base font-bold font-mono text-white mt-0.5">
                      {currentOrder.id}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-amber-400">
                      {currentOrder.trackingNumber}
                    </span>
                    <button
                      onClick={handleCopyTracking}
                      className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy tracking code"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/8 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-neutral-500">Destination</div>
                    <div className="text-white font-medium mt-0.5">
                      {currentOrder.customer.city}, {currentOrder.customer.state}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Expected Arrival</div>
                    <div className="text-emerald-400 font-medium mt-0.5">
                      {currentOrder.estimatedDelivery} (Expedited)
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestone Timeline */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Transit Milestones
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                  {milestones.map((m, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-[23px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          m.done
                            ? 'bg-amber-400 text-neutral-950 font-bold'
                            : 'bg-neutral-800 border border-white/20 text-neutral-500'
                        }`}
                      >
                        {m.done ? '✓' : idx + 1}
                      </div>

                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${m.done ? 'text-white' : 'text-neutral-500'}`}>
                            {m.title}
                          </span>
                          <span className="text-[11px] text-neutral-500 font-mono">
                            {m.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Content Summary */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/6 text-xs space-y-2">
                <div className="font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Parcel Contents:</span>
                </div>
                <div className="space-y-1 text-neutral-400">
                  {currentOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.name} ({item.color}, {item.storage})</span>
                      <span className="font-mono">Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-neutral-400 space-y-2">
              <p>No active order found with identifier &ldquo;{searchInput}&rdquo;.</p>
              <p className="text-neutral-500">
                Please double check your order number or check your order confirmation email.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
