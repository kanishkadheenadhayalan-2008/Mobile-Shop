import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, Cpu, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const flagship = PRODUCTS[0]; // Aura Titan 16 Pro
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const { openPdpModal } = useStore();

  const activeColor = flagship.colors[selectedColorIdx];

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#0c0d0e] border-b border-white/8 pt-8 pb-16 lg:pt-12 lg:pb-24">
      {/* Background ambient lighting accent */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: activeColor.hex }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Quiet 1-line text kicker without pill badge box */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Next Horizon in Mobile Engineering</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.08] font-display">
              Titanium Precision. Pure Silicon Sovereignty.
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed">
              Meet the {flagship.name}. Sculpted from Grade 5 aerospace titanium with the pioneering 3nm Hyperion architecture and a 200MP periscope array designed for master-class captures.
            </p>

            {/* Interactive Finish Selector preview */}
            <div className="pt-2 space-y-2.5">
              <div className="text-xs text-neutral-400">
                <span>Selected Finish: </span>
                <span className="text-white font-medium">{activeColor.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {flagship.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIdx(idx)}
                    aria-label={`Select ${color.name} finish`}
                    className={`relative w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                      selectedColorIdx === idx
                        ? 'border-white scale-110 shadow-lg'
                        : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColorIdx === idx && (
                      <span className="absolute inset-0 rounded-full border border-black/40" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openPdpModal(flagship)}
                className="py-3 px-6 text-sm font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <span>Configure & Buy</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToCatalog}
                className="py-3 px-5 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Explore Full Lineup
              </button>
            </div>

            {/* Proof metrics & trust markers adjacent to claim */}
            <div className="pt-6 border-t border-white/8 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-xl font-bold font-mono tabular-nums text-white">3nm</div>
                <div className="text-xs text-neutral-400">Hyperion Core</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono tabular-nums text-white">200MP</div>
                <div className="text-xs text-neutral-400">Triple Periscope</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono tabular-nums text-white">5,400<span className="text-sm font-normal">mAh</span></div>
                <div className="text-xs text-neutral-400">Dual Silicon Cell</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Product Frame with subtle glass elevation */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-white/10 shadow-2xl group">
                <img
                  src={flagship.image}
                  alt={flagship.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover aspect-[16/10] sm:aspect-[16/11] transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Subtle overlay specifications callout in bottom corner */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-neutral-400">Starting from </span>
                    <span className="text-white font-mono tabular-nums font-semibold text-sm">
                      ${flagship.basePrice}
                    </span>
                    <span className="text-neutral-400 text-[11px] block">
                      or $49.95/mo with 0% APR
                    </span>
                  </div>

                  <button
                    onClick={() => openPdpModal(flagship)}
                    className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md font-medium text-xs border border-white/10 transition-colors cursor-pointer"
                  >
                    Quick Specs
                  </button>
                </div>
              </div>

              {/* Trust statement footer bar */}
              <div className="mt-4 flex items-center justify-between text-xs text-neutral-400 px-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2-Year Manufacturer Warranty</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Next-Day Express Dispatch</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
