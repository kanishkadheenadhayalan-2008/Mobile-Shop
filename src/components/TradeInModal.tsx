import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Check, Sparkles, RefreshCw, Copy } from 'lucide-react';
import { TRADE_IN_DATA, PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';

export const TradeInModal: React.FC = () => {
  const { closeModal, openPdpModal } = useStore();

  const [selectedBrand, setSelectedBrand] = useState(TRADE_IN_DATA[0].brand);
  const [selectedModel, setSelectedModel] = useState(TRADE_IN_DATA[0].models[0].name);
  const [powersOn, setPowersOn] = useState(true);
  const [screenCondition, setScreenCondition] = useState<'flawless' | 'scratched' | 'cracked'>('flawless');
  const [copiedCode, setCopiedCode] = useState(false);

  const brandModels = TRADE_IN_DATA.find((b) => b.brand === selectedBrand)?.models || [];
  const modelInfo = brandModels.find((m) => m.name === selectedModel) || brandModels[0];

  // Valuation algorithm
  let multiplier = 1.0;
  if (!powersOn) {
    multiplier = 0.15;
  } else {
    if (screenCondition === 'scratched') multiplier = 0.8;
    if (screenCondition === 'cracked') multiplier = 0.45;
  }

  const estimatedValue = modelInfo ? Math.round(modelInfo.maxCredit * multiplier) : 0;
  const voucherCode = `TRADE-${selectedBrand.slice(0, 3).toUpperCase()}${estimatedValue}`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText?.(voucherCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleUpgradeNow = () => {
    closeModal();
    // open the flagship device
    openPdpModal(PRODUCTS[0]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#14151a]">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">
              AURA Instant Trade-In Valuation
            </span>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close trade-in dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Intro */}
          <div>
            <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Hardware Buyback</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display">
              Turn your current smartphone into instant savings.
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Select your current handset and condition. Receive a guaranteed trade-in voucher credit applicable instantly at checkout.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* 1. Device Brand & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Device Manufacturer
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    const newModels =
                      TRADE_IN_DATA.find((b) => b.brand === e.target.value)?.models || [];
                    if (newModels.length > 0) setSelectedModel(newModels[0].name);
                  }}
                  className="w-full bg-[#181a1f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {TRADE_IN_DATA.map((b) => (
                    <option key={b.brand} value={b.brand} className="bg-neutral-900">
                      {b.brand}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Current Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-[#181a1f] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {brandModels.map((m) => (
                    <option key={m.name} value={m.name} className="bg-neutral-900">
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Condition Questions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/6 text-xs">
                <div>
                  <div className="font-semibold text-white">Does the device power on normally?</div>
                  <div className="text-[11px] text-neutral-400">
                    Display lights up, touches respond, buttons click
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPowersOn(true)}
                    className={`py-1 px-3 rounded-md text-xs font-medium cursor-pointer ${
                      powersOn
                        ? 'bg-amber-400 text-neutral-950 font-semibold'
                        : 'border border-white/10 text-neutral-400'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setPowersOn(false)}
                    className={`py-1 px-3 rounded-md text-xs font-medium cursor-pointer ${
                      !powersOn
                        ? 'bg-rose-500 text-white font-semibold'
                        : 'border border-white/10 text-neutral-400'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Screen & Glass Condition
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'flawless', label: 'Flawless', desc: 'No visible micro-scratches' },
                    { id: 'scratched', label: 'Good', desc: 'Normal light micro-wear' },
                    { id: 'cracked', label: 'Cracked', desc: 'Cracked front or rear glass' },
                  ].map((cond) => (
                    <button
                      key={cond.id}
                      onClick={() => setScreenCondition(cond.id as any)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                        screenCondition === cond.id
                          ? 'border-amber-400 bg-amber-500/10 text-white'
                          : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white">{cond.label}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{cond.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Instant Valuation Result Card */}
            <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-white/12 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-neutral-400 uppercase tracking-wider">
                    Estimated Buyback Credit
                  </div>
                  <div className="text-3xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                    ${estimatedValue}.00
                  </div>
                </div>

                <div className="text-right text-xs text-neutral-400">
                  <span>Device: </span>
                  <span className="text-white font-medium">{selectedModel}</span>
                </div>
              </div>

              {/* Voucher Code Box */}
              <div className="p-3 rounded-lg bg-black/40 border border-white/8 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="text-[11px] text-neutral-500">Your Trade-In Voucher Code</div>
                  <div className="font-mono font-bold text-amber-300 tracking-wider">
                    {voucherCode}
                  </div>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="py-1 px-3 bg-white/10 hover:bg-white/20 text-white rounded-md text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleUpgradeNow}
                  className="flex-1 py-3 px-5 bg-white text-neutral-950 font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Select New Phone & Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* How it works 3-step proof */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-400">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-white font-semibold">1. Instant Credit</div>
                <p className="text-[11px] text-neutral-400">
                  Value is immediately deducted from your new purchase at checkout.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-white font-semibold">2. Prepaid Box</div>
                <p className="text-[11px] text-neutral-400">
                  We ship you a secure, prepaid return box with your new device.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                <div className="text-white font-semibold">3. Transfer & Send</div>
                <p className="text-[11px] text-neutral-400">
                  Take 14 days to transfer your data, then drop off the return box.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
