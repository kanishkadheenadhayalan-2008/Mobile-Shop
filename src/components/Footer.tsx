import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, RefreshCw, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { openTradeInModal, openCompareModal, openTrackerModal } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2500);
  };

  return (
    <footer className="bg-[#090a0c] border-t border-white/8 pt-16 pb-12 text-xs text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Trust Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-white/8">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">2-Year Full Care Guarantee</div>
              <p className="text-neutral-400 text-xs mt-0.5 leading-relaxed">
                Every AURA flagship includes comprehensive hardware protection against manufacturing faults and battery degradation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">30-Day Risk-Free Trial</div>
              <p className="text-neutral-400 text-xs mt-0.5 leading-relaxed">
                Test your new smartphone in real-world conditions. Complimentary returns and prepaid postage if not completely satisfied.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Circular Trade-In Program</div>
              <p className="text-neutral-400 text-xs mt-0.5 leading-relaxed">
                Up to $650 instant buyback credit for old devices. 100% of traded materials are ethically recycled or repurposed.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Newsletter Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <a href="/" className="text-2xl font-bold tracking-tighter text-white font-display inline-block">
              AURA<span className="text-amber-500">.</span>
            </a>
            <p className="text-neutral-400 text-xs max-w-sm leading-relaxed">
              Pioneering mobile hardware engineered with aerospace titanium, custom silicon architecture, and precision optics. Designed for uncompromising creators and demanding professionals.
            </p>
            <div className="text-neutral-500 text-[11px]">
              Customer Concierge: support@auramobile.tech · 1-800-287-2662
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Hardware Lineup
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  Aura Titan 16 Pro
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  Horizon Fold Series
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  Optic Ultra 1-Inch
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  Lumina Compact Series
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  Pad Ultra 13 Slate
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Store & Services
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={openTradeInModal}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Instant Trade-In Valuation
                </button>
              </li>
              <li>
                <button
                  onClick={openCompareModal}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Side-by-Side Comparison
                </button>
              </li>
              <li>
                <button
                  onClick={() => openTrackerModal()}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Track Order Shipment
                </button>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  Accessories & MagCharge
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-white transition-colors">
                  AuraOS 16 Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Hardware Release Alerts */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Silicon & Hardware Dispatch
            </div>
            <p className="text-xs text-neutral-400">
              Receive confidential briefing notes on upcoming silicon fabrication, OS major updates, and exclusive private pre-order access.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#14151a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="py-2 px-3.5 bg-white text-neutral-950 font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-emerald-400">
                  Subscribed! Welcome to the AURA Developer & Hardware Dispatch.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Quiet Copyright Row */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © 2026 AURA Mobile Technologies Inc. All rights reserved. Built with precision.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-300 cursor-pointer">Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-neutral-300 cursor-pointer">Hardware Warranty Terms</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-neutral-300 cursor-pointer">Recycling & Environmental Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
