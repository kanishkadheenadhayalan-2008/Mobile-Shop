export interface ColorOption {
  name: string;
  hex: string;
  image?: string;
}

export interface StorageOption {
  capacity: string;
  priceDelta: number; // e.g. 0 for base, +100 for 256GB
}

export interface TechSpecs {
  display: string;
  resolution: string;
  refreshRate: string;
  brightness: string;
  processor: string;
  gpu: string;
  npu: string;
  mainCamera: string;
  telephotoCamera: string;
  ultraWideCamera: string;
  frontCamera: string;
  battery: string;
  charging: string;
  os: string;
  weight: string;
  dimensions: string;
  waterResistance: string;
  materials: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: 'flagship' | 'foldable' | 'compact' | 'tablet' | 'gear';
  brand: string;
  basePrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  colors: ColorOption[];
  storageOptions: StorageOption[];
  badge?: string;
  description: string;
  keyFeatures: string[];
  specs: TechSpecs;
  reviews: Review[];
  inStock: boolean;
  isNew?: boolean;
}

export interface TradeInOption {
  brand: string;
  models: {
    name: string;
    maxCredit: number;
  }[];
}

export interface CartItem {
  id: string; // unique item cart instance id
  productId: string;
  name: string;
  image: string;
  color: ColorOption;
  storage: StorageOption;
  carrier: string;
  unitPrice: number;
  quantity: number;
  tradeInCredit: number;
  tradeInDevice?: string;
}

export interface OrderItem {
  name: string;
  color: string;
  storage: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tradeInTotal: number;
  tax: number;
  total: number;
  paymentMethod: 'card' | 'apple_pay' | 'cod';
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  trackingNumber: string;
  estimatedDelivery: string;
}
