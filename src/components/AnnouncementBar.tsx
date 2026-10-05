import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { openTradeInModal } = useStore();

  if (dismissed) return null;

  return (
    <aside
      aria-label="Promotion announcement"
      className="relative z-30 bg-[#16181d] border-b border-white/5 text-xs text-neutral-300 py-2 px-4 select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <span className="text-amber-400/90 font-medium">Limited Pre-Order Event</span>
          <span className="hidden sm:inline text-neutral-500">·</span>
          <span className="hidden sm:inline text-neutral-300">
            Receive up to $650 instant credit when trading in your current phone
          </span>
          <button
            onClick={openTradeInModal}
            className="inline-flex items-center gap-1 font-semibold text-white underline underline-offset-4 hover:text-amber-300 transition-colors ml-1 cursor-pointer"
          >
            <span>Value Your Device</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-neutral-400 hover:text-white p-0.5 rounded transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
