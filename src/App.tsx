/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ComparisonModal } from './components/ComparisonModal';
import { TradeInModal } from './components/TradeInModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { Footer } from './components/Footer';

function MainStore() {
  const { activeModal, closeModal } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-neutral-100 flex flex-col selection:bg-amber-400 selection:text-neutral-950">
      {/* 1. Slim Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Top Bar Navigation Contract */}
      <Header
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* 3. Hero Campaign Showcase */}
        <Hero />

        {/* 4. Complete Engineered Hardware Catalog */}
        <ProductCatalog
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />
      </main>

      {/* 5. Restrained Brand Footer */}
      <Footer />

      {/* Global Interactive Modals and Drawers */}
      {activeModal.type === 'pdp' && activeModal.selectedProduct && (
        <ProductDetailModal
          product={activeModal.selectedProduct}
          onClose={closeModal}
        />
      )}

      {activeModal.type === 'compare' && <ComparisonModal />}

      {activeModal.type === 'tradein' && <TradeInModal />}

      {activeModal.type === 'cart' && <CartDrawer />}

      {activeModal.type === 'checkout' && <CheckoutModal />}

      {activeModal.type === 'confirmation' && <OrderConfirmationModal />}

      {activeModal.type === 'tracker' && <OrderTrackerModal />}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainStore />
    </StoreProvider>
  );
}
