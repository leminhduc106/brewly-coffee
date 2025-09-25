
export interface Product {
  id: string;
  name: string;
  category: 'coffee' | 'tea' | 'pastries';
  type: 'hot' | 'cold';
  price: number;
  imageUrl: string;
  description: string;
  options: {
    size: string[];
    milkTypes: string[];
    toppings: string[];
  };
}

export interface Store {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  openingHours: string;
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedSize: string;
  selectedMilk: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'cash' | 'qr' | 'points';
  createdAt: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  feedback?: string; // User's written feedback
  rating?: number;   // User's rating (1-5 stars)
}

export interface User {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  loyaltyPoints: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  referralCode?: string;
  referredBy?: string;
  birthday?: string; // ISO string format (YYYY-MM-DD)
}
