import React from 'react';
import { X, SlidersHorizontal, Plus, Trash2, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const ComparisonModal: React.FC = () => {
  const { compareList, toggleCompare, clearCompare, openPdpModal, closeModal } = useStore();

  const selectedProducts: Product[] = compareList
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const availableToAdd = PRODUCTS.filter((p) => !compareList.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#111215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#14151a]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">
              Side-by-Side Mobile Comparison Matrix
            </span>
            <span className="text-xs text-neutral-400 font-mono tabular-nums">
              ({selectedProducts.length} of 3 devices)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {selectedProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={closeModal}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Close comparison modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Matrix Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {selectedProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <SlidersHorizontal className="w-12 h-12 text-neutral-600 mx-auto" />
              <div className="text-neutral-400 text-sm">
                No mobile devices selected for comparison yet.
              </div>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Select any phone or tablet from the catalog to compare hardware specifications, camera sensors, and battery performance.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[650px]">
                {/* Column Headers (Device Cards) */}
                <div className="grid grid-cols-4 gap-4 pb-6 border-b border-white/10 items-stretch">
                  <div className="flex flex-col justify-end text-xs text-neutral-400 font-medium">
                    <span>Hardware Attributes</span>
                  </div>

                  {selectedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-xl bg-neutral-900/80 border border-white/10 flex flex-col justify-between space-y-3 relative group"
                    >
                      <button
                        onClick={() => toggleCompare(prod.id)}
                        className="absolute top-2 right-2 p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                        title="Remove device from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-950 flex items-center justify-center p-2">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-neutral-500">
                          {prod.brand}
                        </div>
                        <div className="text-sm font-bold text-white line-clamp-1">{prod.name}</div>
                        <div className="text-base font-bold font-mono tabular-nums text-amber-400 mt-1">
                          ${prod.basePrice}
                        </div>
                      </div>

                      <button
                        onClick={() => openPdpModal(prod)}
                        className="w-full py-2 px-3 bg-white text-neutral-950 font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Configure</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add Slot if < 3 */}
                  {selectedProducts.length < 3 && (
                    <div className="p-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div className="text-xs text-neutral-400">Add Another Phone</div>
                      <select
                        onChange={(e) => {
                          if (e.target.value) toggleCompare(e.target.value);
                        }}
                        defaultValue=""
                        className="w-full text-xs bg-neutral-800 border border-white/10 rounded-md p-1.5 text-white cursor-pointer"
                      >
                        <option value="" disabled>
                          Select device...
                        </option>
                        {availableToAdd.map((p) => (
                          <option key={p.id} value={p.id} className="bg-neutral-900">
                            {p.name} (${p.basePrice})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Specs Rows with Tabular Figures */}
                <div className="divide-y divide-white/5 text-xs">
                  {/* Category */}
                  <div className="grid grid-cols-4 gap-4 py-3 items-center">
                    <span className="text-neutral-400 font-medium">Form Factor</span>
                    {selectedProducts.map((p) => (
                      <span key={p.id} className="text-white capitalize">
                        {p.category}
                      </span>
                    ))}
                  </div>

                  {/* Display */}
                  <div className="grid grid-cols-4 gap-4 py-3 items-center">
                    <span className="text-neutral-400 font-medium">Display & Refresh</span>
                    {selectedProducts.map((p) => (
                      <div key={p.id} className="space-y-0.5">
                        <div className="text-white font-medium">{p.specs.display}</div>
                        <div className="text-neutral-500 font-mono text-[11px]">
                          {p.specs.resolution} · {p.specs.refreshRate}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Peak Brightness */}
                  <div className="grid grid-cols-4 gap-4 py-3 items-center">
                    <span className="text-neutral-400 font-medium">Peak Luminance</span>
                    {selectedProducts.map((p) => (
                      <span key={p.id} className="text-neutral-300 font-mono tabular-nums">
                        {p.specs.brightness}
                      </span>
                    ))}
                  </div>

                  {/* Processor & Architecture */}
                  <div className="grid grid-cols-4 gap-4 py-3 items-center">
                    <span className="text-neutral-400 font-medium">Silicon Core & NPU</span>
                    {selectedProducts.map((p) => (
                      <div key={p.id} className="space-y-0.5">
                        <div className="text-white font-medium">{p.specs.processor}</div>
                        <div className="text-neutral-500 font-mono text-[11px]">{p.specs.npu}</div>
                      </div>
                    ))}
                  </div>

                  {/* Main Optical Sensor */}
                  <div className="grid grid-cols-4 gap-4 py-3 items-center">
                    <span className="text-neutral-400 font-medium">Primary Camera Sensor</span>
                    {selectedProducts.map((p) => (
                      <span key={p.id} className="text-neutral-200">
                        {p.specs.mainCamera}
                      </span>
                    ))}
                  </div>

                  {/* Telephoto Optic */}
                  <div className="grid grid-cols-4 gap-4 py-3 items-center">
                    <span className="text-neutral-400 font-medium">Telephoto Zoom Optic</span>
                    {selectedProducts.map((p) => (
                      <span key={p.id} className="text-neutral-200">
                        {p.specs.telephotoCamera}
                      </span>
                    ))}
                  </div>

                  {/* Battery & Charging */}
                  <div className="grid grid-cols-4 gap-4 py-3 items-center">
                    <span className="text-neutral-400 font-medium">Battery & Rapid Charge</span>
                    {selectedProducts.map((p) => (
                      <div key={p.id} className="space-y-0.5">
                        <div className="text-white font-mono tabular-nums font-semibold">
                          {p.specs.battery}
                        </div>
                        <div className="text-neutral-500 text-[11px]">{p.specs.charging}</div>
                      </div>
                    ))}
                  </div>

                  {/* Weight & Dimensions */}
                  <div className="grid grid-cols-4 gap-4 py-3 items-center">
                    <span className="text-neutral-400 font-medium">Weight & Construction</span>
                    {selectedProducts.map((p) => (
                      <div key={p.id} className="space-y-0.5">
                        <div className="text-white font-mono tabular-nums">{p.specs.weight}</div>
                        <div className="text-neutral-500 text-[11px]">{p.specs.materials}</div>
                      </div>
                    ))}
                  </div>

                  {/* Durability */}
                  <div className="grid grid-cols-4 gap-4 py-3 items-center">
                    <span className="text-neutral-400 font-medium">Ingress Protection</span>
                    {selectedProducts.map((p) => (
                      <span key={p.id} className="text-neutral-200">
                        {p.specs.waterResistance}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
