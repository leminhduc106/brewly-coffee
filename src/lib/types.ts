export interface StoreAnnouncement {
  id: string;
  title: string;
  message: string;
  type: "promo" | "info" | "event";
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
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
  paymentMethod: "cash" | "qr" | "points" | "comp";
  createdAt: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
  feedback?: string; // User's written feedback
  rating?: number; // User's rating (1-5 stars)
  // Staff management fields
  assignedTo?: string; // Staff member handling the order
  estimatedTime?: number; // Estimated preparation time in minutes
  statusHistory?: OrderStatusUpdate[]; // Track status changes
  specialInstructions?: string; // Staff notes
  storeId?: string; // Which embassy location
}

export interface OrderStatusUpdate {
  status: Order['status'];
  timestamp: string;
  updatedBy: string; // Staff member who updated
  notes?: string;
}

// Staff dashboard specific types
export interface StaffMember {
  uid: string;
  name: string;
  email: string;
  role: "staff" | "manager";
  storeId: string;
  employeeId: string;
  avatar?: string;
  isOnline: boolean;
  currentOrders: string[]; // Order IDs currently assigned
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
  role: "customer" | "staff" | "manager" | "admin"; // Role-based access control
  storeId?: string; // Which embassy location they work at
  permissions?: string[]; // Specific permissions
  employeeId?: string; // Staff identification number
  hireDate?: string; // When they joined the team
}
