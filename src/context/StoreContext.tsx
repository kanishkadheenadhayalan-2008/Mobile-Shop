import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Order, Product } from '../types';
import { PRODUCTS, PROMO_CODES } from '../data/products';

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  compareList: string[];
  appliedPromo: { code: string; discount: number; type: 'fixed' | 'percent'; label: string } | null;
  orders: Order[];
  activeModal: {
    type: 'pdp' | 'compare' | 'tradein' | 'cart' | 'checkout' | 'confirmation' | 'tracker' | null;
    selectedProduct?: Product;
    lastOrder?: Order;
    trackOrderId?: string;
  };
  cartSubtotal: number;
  cartDiscount: number;
  cartTradeInTotal: number;
  cartTax: number;
  cartTotal: number;
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggleCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  placeOrder: (customer: Order['customer'], paymentMethod: Order['paymentMethod']) => Order;
  openPdpModal: (product: Product) => void;
  openCompareModal: () => void;
  openTradeInModal: () => void;
  openCartDrawer: () => void;
  openCheckoutModal: () => void;
  openTrackerModal: (orderId?: string) => void;
  closeModal: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare state (up to 3 products)
  const [compareList, setCompareList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_compare');
      return saved ? JSON.parse(saved) : ['aura-titan-16-pro', 'aura-optic-ultra'];
    } catch {
      return ['aura-titan-16-pro', 'aura-optic-ultra'];
    }
  });

  // Promo discount
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
    type: 'fixed' | 'percent';
    label: string;
  } | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('aura_orders');
      if (saved) return JSON.parse(saved);
      // Default demo mock order for tracking demonstration
      const demoOrder: Order = {
        id: 'AUR-928410',
        createdAt: '2026-10-04T14:32:00Z',
        customer: {
          fullName: 'Alexander Wright',
          email: 'alexander.wright@example.com',
          phone: '+1 (555) 349-8812',
          address: '742 Silicon Parkway, Suite 400',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94107',
        },
        items: [
          {
            name: 'AURA Titan 16 Pro',
            color: 'Natural Titanium',
            storage: '256GB',
            quantity: 1,
            price: 1299,
            image: '/src/assets/images/hero_flagship_phone_1791194258764.jpg',
          },
        ],
        subtotal: 1299,
        discount: 50,
        tradeInTotal: 440,
        tax: 68.72,
        total: 877.72,
        paymentMethod: 'apple_pay',
        status: 'shipped',
        trackingNumber: 'AUR-EXP-88931294',
        estimatedDelivery: 'Oct 07, 2026',
      };
      return [demoOrder];
    } catch {
      return [];
    }
  });

  // Modal controller
  const [activeModal, setActiveModal] = useState<{
    type: 'pdp' | 'compare' | 'tradein' | 'cart' | 'checkout' | 'confirmation' | 'tracker' | null;
    selectedProduct?: Product;
    lastOrder?: Order;
    trackOrderId?: string;
  }>({ type: null });

  // Persistence
  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('aura_compare', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem('aura_orders', JSON.stringify(orders));
  }, [orders]);

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartTradeInTotal = cart.reduce((sum, item) => sum + (item.tradeInCredit || 0) * item.quantity, 0);

  let rawDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'fixed') {
      rawDiscount = appliedPromo.discount;
    } else {
      rawDiscount = (cartSubtotal * appliedPromo.discount) / 100;
    }
  }
  const cartDiscount = Math.min(rawDiscount, cartSubtotal);

  const discountedSubtotal = Math.max(0, cartSubtotal - cartDiscount - cartTradeInTotal);
  // Estimated 8.25% state & local tax
  const cartTax = discountedSubtotal > 0 ? Number((discountedSubtotal * 0.0825).toFixed(2)) : 0;
  const cartTotal = discountedSubtotal > 0 ? Number((discountedSubtotal + cartTax).toFixed(2)) : 0;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const existingIndex = cart.findIndex(
      (c) =>
        c.productId === item.productId &&
        c.color.name === item.color.name &&
        c.storage.capacity === item.storage.capacity &&
        c.carrier === item.carrier
    );

    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((c, idx) => (idx === existingIndex ? { ...c, quantity: c.quantity + item.quantity } : c))
      );
    } else {
      const newItem: CartItem = {
        ...item,
        id: `${item.productId}-${item.color.name}-${item.storage.capacity}-${Date.now()}`,
      };
      setCart((prev) => [newItem, ...prev]);
    }

    // Open cart drawer immediately for positive confirmation
    setActiveModal({ type: 'cart' });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const toggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        // replace first item if full
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  };

  const isInCompare = (productId: string) => compareList.includes(productId);
  const clearCompare = () => setCompareList([]);

  const applyPromo = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (PROMO_CODES[cleanCode]) {
      const promo = PROMO_CODES[cleanCode];
      setAppliedPromo({
        code: cleanCode,
        discount: promo.discount,
        type: promo.type,
        label: promo.label,
      });
      return { success: true, message: `Applied: ${promo.label}` };
    }
    return { success: false, message: 'Invalid or expired promotional code.' };
  };

  const removePromo = () => setAppliedPromo(null);

  const placeOrder = (customer: Order['customer'], paymentMethod: Order['paymentMethod']): Order => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const trackingSuffix = Math.floor(10000000 + Math.random() * 90000000);

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newOrder: Order = {
      id: `AUR-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      customer,
      items: cart.map((item) => ({
        name: item.name,
        color: item.color.name,
        storage: item.storage.capacity,
        quantity: item.quantity,
        price: item.unitPrice,
        image: item.image,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      tradeInTotal: cartTradeInTotal,
      tax: cartTax,
      total: cartTotal,
      paymentMethod,
      status: 'confirmed',
      trackingNumber: `AUR-EXP-${trackingSuffix}`,
      estimatedDelivery: formattedDelivery,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedPromo(null);
    setActiveModal({ type: 'confirmation', lastOrder: newOrder });
    return newOrder;
  };

  const openPdpModal = (product: Product) => setActiveModal({ type: 'pdp', selectedProduct: product });
  const openCompareModal = () => setActiveModal({ type: 'compare' });
  const openTradeInModal = () => setActiveModal({ type: 'tradein' });
  const openCartDrawer = () => setActiveModal({ type: 'cart' });
  const openCheckoutModal = () => setActiveModal({ type: 'checkout' });
  const openTrackerModal = (orderId?: string) =>
    setActiveModal({ type: 'tracker', trackOrderId: orderId || orders[0]?.id });
  const closeModal = () => setActiveModal({ type: null });

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        compareList,
        appliedPromo,
        orders,
        activeModal,
        cartSubtotal,
        cartDiscount,
        cartTradeInTotal,
        cartTax,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        toggleCompare,
        isInCompare,
        clearCompare,
        applyPromo,
        removePromo,
        placeOrder,
        openPdpModal,
        openCompareModal,
        openTradeInModal,
        openCartDrawer,
        openCheckoutModal,
        openTrackerModal,
        closeModal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
