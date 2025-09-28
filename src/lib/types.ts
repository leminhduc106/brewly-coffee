export interface StoreAnnouncement {
  id: string;
  title: string;
  message: string;
  type: "promo" | "info" | "event";
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
}
export interface ContactlessPickupInstructions {
  storeId: string;
  pickupCode: string;
  mapUrl: string;
  steps: string[];
}

export interface ProductOrigin {
  country: string;
  lat: number;
  lng: number;
  farmImageUrl: string;
  story: string;
}

export interface Product {
  id: string;
  name: string;
  nameVi: string; // Vietnamese name
  category:
    | "ca-phe-truyen-thong"
    | "ca-phe-pha-may"
    | "tra-tra-sua"
    | "da-xay-smoothie"
    | "soda-nuoc-giai-khat"
    | "mon-an-kem";
  type: "hot" | "cold";
  price: number;
  imageUrl: string;
  description: string;
  descriptionVi: string; // Vietnamese description
  origin?: ProductOrigin; // Optional origin for coffee journey map
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
  holidayNotices?: HolidayNotice[];
}

export interface HolidayNotice {
  date: string; // ISO date string
  message: string;
  isClosed?: boolean;
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedSize: string;
  selectedMilk: string;
  selectedToppings?: string[];
}

export interface DeliveryAddress {
  recipientName: string; // Tên người nhận
  recipientNameVi?: string; // Vietnamese name if different
  phoneNumber: string; // Số điện thoại
  streetAddress: string; // Địa chỉ chi tiết
  ward: string; // Phường/Xã
  district: string; // Quận/Huyện
  city: string; // Thành phố/Tỉnh
  postalCode?: string; // Mã bưu điện
  specialInstructions?: string; // Ghi chú giao hàng
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number; // Subtotal before delivery fee
  deliveryFee: number; // Phí giao hàng
  deliveryOption: "pickup" | "delivery"; // Nhận tại quầy hoặc giao hàng
  deliveryAddress?: DeliveryAddress; // Required if deliveryOption is "delivery"
  paymentMethod: "cash" | "qr" | "points";
  createdAt: string;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  feedback?: string; // User's written feedback
  rating?: number; // User's rating (1-5 stars)
}

export interface User {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  loyaltyPoints: number;
  tier: "Silver" | "Gold" | "Platinum";
  referralCode?: string;
  referredBy?: string;
  birthday?: string; // ISO string format (YYYY-MM-DD)
  role?: "user" | "admin"; // For RBAC
}
