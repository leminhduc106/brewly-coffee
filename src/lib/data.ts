export const storeAnnouncements: StoreAnnouncement[] = [
  {
    id: "promo1",
    title: "Pumpkin Spice Latte Returns!",
    message:
      "Celebrate fall with our seasonal favorite. Available until October 31.",
    type: "promo",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    startDate: "2025-09-15",
    endDate: "2025-10-31",
  },
  {
    id: "event1",
    title: "Live Music Friday",
    message:
      "Join us for live acoustic music every Friday 6-8pm at Brewly Downtown.",
    type: "event",
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    startDate: "2025-09-01",
    endDate: "2025-12-31",
  },
  {
    id: "info1",
    title: "New Store Hours",
    message: "Uptown location now open until 10pm on weekends!",
    type: "info",
    startDate: "2025-09-20",
  },
];

import type {
  Product,
  Store,
  User,
  Order,
  StoreAnnouncement,
} from "./types";

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Ambassador's Signature Blend",
    nameVi: "Pha Chế Đặc Trưng Đại Sứ",
    category: "ca-phe-truyen-thong",
    type: "hot",
    price: 85000,
    imageUrl: "https://picsum.photos/600/400",
    description:
      "Our flagship diplomatic blend combining the finest Vietnamese and Philippine coffee beans in perfect harmony.",
    descriptionVi: "Pha chế hài hòa hoàn hảo giữa hạt cà phê Việt Nam và Philippines thượng hạng.",
    origin: {
      country: "Vietnam",
      lat: 16.0,
      lng: 108.0,
      farmImageUrl: "https://picsum.photos/400/300?random=1",
      story:
        "From the rolling hills of Dalat, Vietnam's premier coffee region.",
    },
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Condensed Milk", "Dairy", "Black"],
      toppings: [],
    },
  },
  {
    id: "2",
    name: "Manila-Saigon Express",
    nameVi: "Chuyến Tàu Manila-Sài Gòn",
    category: "ca-phe-pha-may",
    type: "hot",
    price: 115000,
    imageUrl: "https://picsum.photos/600/401",
    description: "A fusion blend showcasing the coffee cultures of both nations - rich Filipino barako with Vietnamese robusta, finished with condensed milk.",
    descriptionVi: "Pha chế kết hợp văn hóa cà phê của hai quốc gia - barako Philippines đậm đà với robusta Việt Nam, hoàn thiện bằng sữa đặc.",
    origin: {
      country: "Colombia",
      lat: 5.0,
      lng: -74.0,
      farmImageUrl: "https://picsum.photos/400/300?random=2",
      story: "Sourced from high-altitude farms in the Colombian Andes.",
    },
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Dairy", "Oat", "Almond"],
      toppings: ["Caramel Drizzle", "Whipped Cream"],
    },
  },
  {
    id: "3",
    name: "Mango Smoothie",
    nameVi: "Sinh Tố Xoài",
    category: "da-xay-smoothie",
    type: "cold",
    price: 125000,
    imageUrl: "https://picsum.photos/600/402",
    description:
      "Fresh mango blended with ice and yogurt for a tropical treat.",
    descriptionVi:
      "Xoài tươi xay với đá và sữa chua tạo nên hương vị nhiệt đới.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Yogurt", "Coconut Milk", "Dairy"],
      toppings: ["Whipped Cream", "Coconut Flakes"],
    },
  },
];

export const allProducts: Product[] = [
  ...featuredProducts,
  // NHÓM CÀ PHÊ TRUYỀN THỐNG VIỆT NAM
  {
    id: "4",
    name: "Iced Vietnamese Coffee",
    nameVi: "Cà Phê Đá Việt Nam",
    category: "ca-phe-truyen-thong",
    type: "cold",
    price: 90000,
    imageUrl: "https://picsum.photos/600/403",
    description:
      "Traditional Vietnamese drip coffee served over ice with condensed milk.",
    descriptionVi:
      "Cà phê phin truyền thống Việt Nam với đá và sữa đặc ngọt ngào.",
    origin: {
      country: "Vietnam",
      lat: 16.0,
      lng: 108.0,
      farmImageUrl: "https://picsum.photos/400/300?random=4",
      story: "From the coffee highlands of Dalat and Buon Ma Thuot.",
    },
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Condensed Milk", "Black"],
      toppings: [],
    },
  },
  {
    id: "5",
    name: "Egg Coffee",
    nameVi: "Cà Phê Trứng",
    category: "ca-phe-truyen-thong",
    type: "hot",
    price: 108000,
    imageUrl: "https://picsum.photos/600/404",
    description: "Hanoi-style coffee topped with creamy whipped egg foam.",
    descriptionVi: "Cà phê kiểu Hà Nội với lớp bọt trứng béo ngậy mịn màng.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: [],
      toppings: [],
    },
  },

  // NHÓM CÀ PHÊ PHA MÁY (ESPRESSO-BASED)
  {
    id: "6",
    name: "Americano",
    nameVi: "Americano",
    category: "ca-phe-pha-may",
    type: "hot",
    price: 78000,
    imageUrl: "https://picsum.photos/600/405",
    description:
      "Bold espresso diluted with hot water for a clean, smooth taste.",
    descriptionVi:
      "Espresso đậm đà pha loãng với nước nóng tạo vị mạnh mẽ nhưng êm dịu.",
    origin: {
      country: "Brazil",
      lat: -15.0,
      lng: -47.0,
      farmImageUrl: "https://picsum.photos/400/300?random=5",
      story:
        "From the fertile lands of Minas Gerais, Brazil's premier coffee region.",
    },
    options: {
      size: ["S", "M", "L"],
      milkTypes: [],
      toppings: [],
    },
  },
  {
    id: "7",
    name: "Cappuccino",
    nameVi: "Cappuccino",
    category: "ca-phe-pha-may",
    type: "hot",
    price: 102000,
    imageUrl: "https://picsum.photos/600/406",
    description: "Espresso with steamed milk and a thick layer of milk foam.",
    descriptionVi: "Espresso với sữa hấp và lớp bọt sữa dày đặc truyền thống.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Dairy", "Oat", "Almond"],
      toppings: ["Cinnamon", "Cocoa Powder"],
    },
  },
  {
    id: "8",
    name: "Latte",
    nameVi: "Latte",
    category: "ca-phe-pha-may",
    type: "hot",
    price: 108000,
    imageUrl: "https://picsum.photos/600/407",
    description: "Smooth espresso with steamed milk and light foam.",
    descriptionVi: "Espresso mềm mại với sữa hấp và lớp bọt nhẹ êm dịu.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Dairy", "Oat", "Almond", "Coconut"],
      toppings: ["Vanilla Syrup", "Caramel Drizzle"],
    },
  },

  // NHÓM TRÀ VÀ TRÀ SỮA
  {
    id: "9",
    name: "Thai Milk Tea",
    nameVi: "Trà Sữa Thái",
    category: "tra-tra-sua",
    type: "cold",
    price: 115000,
    imageUrl: "https://picsum.photos/600/408",
    description:
      "Sweet and creamy Thai-style tea with condensed milk over ice.",
    descriptionVi: "Trà sữa kiểu Thái ngọt ngào và béo ngậy với sữa đặc và đá.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Condensed Milk", "Fresh Milk"],
      toppings: ["Pearls", "Jelly", "Pudding"],
    },
  },
  {
    id: "10",
    name: "Jasmine Green Tea",
    nameVi: "Trà Xanh Hoa Nhài",
    category: "tra-tra-sua",
    type: "hot",
    price: 85000,
    imageUrl: "https://picsum.photos/600/409",
    description: "Delicate green tea infused with jasmine flowers.",
    descriptionVi: "Trà xanh nhẹ nhàng thấm hương hoa nhài thơm ngát.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: [],
      toppings: ["Honey", "Lemon Slice"],
    },
  },
  {
    id: "11",
    name: "Taro Milk Tea",
    nameVi: "Trà Sữa Khoai Môn",
    category: "tra-tra-sua",
    type: "cold",
    price: 120000,
    imageUrl: "https://picsum.photos/600/410",
    description: "Creamy taro-flavored milk tea with a beautiful purple color.",
    descriptionVi: "Trà sữa vị khoai môn béo ngậy với màu tím đẹp mắt.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Fresh Milk", "Coconut Milk"],
      toppings: ["Pearls", "Taro Bits", "Whipped Cream"],
    },
  },

  // NHÓM ĐÁ XAY (BLENDED/SMOOTHIE)
  {
    id: "12",
    name: "Strawberry Smoothie",
    nameVi: "Sinh Tố Dâu Tây",
    category: "da-xay-smoothie",
    type: "cold",
    price: 132000,
    imageUrl: "https://picsum.photos/600/411",
    description: "Fresh strawberries blended with yogurt and ice.",
    descriptionVi: "Dâu tây tươi xay với sữa chua và đá mát lạnh.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Yogurt", "Fresh Milk", "Coconut Milk"],
      toppings: ["Whipped Cream", "Fresh Strawberries"],
    },
  },
  {
    id: "13",
    name: "Avocado Smoothie",
    nameVi: "Sinh Tố Bơ",
    category: "da-xay-smoothie",
    type: "cold",
    price: 125000,
    imageUrl: "https://picsum.photos/600/412",
    description: "Creamy avocado blended with condensed milk and ice.",
    descriptionVi: "Bơ béo ngậy xay với sữa đặc và đá mát lạnh.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Condensed Milk", "Fresh Milk"],
      toppings: ["Coconut Flakes", "Condensed Milk Drizzle"],
    },
  },
  {
    id: "14",
    name: "Coffee Frappe",
    nameVi: "Cà Phê Frappe",
    category: "da-xay-smoothie",
    type: "cold",
    price: 115000,
    imageUrl: "https://picsum.photos/600/413",
    description: "Iced coffee blended with milk and whipped cream.",
    descriptionVi: "Cà phê đá xay với sữa tươi và kem tuyết trắng xốp.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Fresh Milk", "Oat Milk"],
      toppings: ["Whipped Cream", "Coffee Beans", "Chocolate Syrup"],
    },
  },

  // NHÓM SODA & NƯỚC GIẢI KHÁT KHÁC
  {
    id: "15",
    name: "Lemon Soda",
    nameVi: "Soda Chanh",
    category: "soda-nuoc-giai-khat",
    type: "cold",
    price: 90000,
    imageUrl: "https://picsum.photos/600/414",
    description: "Refreshing lemon soda with fresh mint leaves.",
    descriptionVi: "Soda chanh tươi mát với lá bạc hà thơm mát.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: [],
      toppings: ["Mint Leaves", "Lemon Slices"],
    },
  },
  {
    id: "16",
    name: "Passion Fruit Juice",
    nameVi: "Nước Chanh Dây",
    category: "soda-nuoc-giai-khat",
    type: "cold",
    price: 95000,
    imageUrl: "https://picsum.photos/600/415",
    description: "Fresh passion fruit juice with a tangy and sweet flavor.",
    descriptionVi: "Nước chanh dây tươi với vị chua ngọt đặc trưng.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: [],
      toppings: ["Ice", "Sugar Syrup"],
    },
  },
  {
    id: "17",
    name: "Orange Juice",
    nameVi: "Nước Cam Tươi",
    category: "soda-nuoc-giai-khat",
    type: "cold",
    price: 102000,
    imageUrl: "https://picsum.photos/600/416",
    description: "Freshly squeezed orange juice packed with vitamin C.",
    descriptionVi: "Nước cam vắt tươi giàu vitamin C tốt cho sức khỏe.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: [],
      toppings: ["Orange Slices", "Ice"],
    },
  },

  // MÓN ĂN KÈM
  {
    id: "18",
    name: "Almond Croissant",
    nameVi: "Bánh Sừng Bò Hạnh Nhân",
    category: "mon-an-kem",
    type: "hot",
    price: 85000,
    imageUrl: "https://picsum.photos/600/417",
    description: "Buttery croissant filled with sweet almond paste.",
    descriptionVi: "Bánh sừng bò bơ nhân kem hạnh nhân ngọt ngào.",
    options: {
      size: [],
      milkTypes: [],
      toppings: [],
    },
  },
  {
    id: "19",
    name: "Chocolate Chip Cookie",
    nameVi: "Bánh Quy Choco Chip",
    category: "mon-an-kem",
    type: "hot",
    price: 66000,
    imageUrl: "https://picsum.photos/600/418",
    description: "A classic, gooey chocolate chip cookie, baked fresh.",
    descriptionVi: "Bánh quy chocolate chip truyền thống, nướng tươi mỗi ngày.",
    options: {
      size: [],
      milkTypes: [],
      toppings: [],
    },
  },
  {
    id: "20",
    name: "Vietnamese Sandwich",
    nameVi: "Bánh Mì Việt Nam",
    category: "mon-an-kem",
    type: "hot",
    price: 155000,
    imageUrl: "https://picsum.photos/600/419",
    description:
      "Traditional Vietnamese sandwich with pork, pate, and fresh vegetables.",
    descriptionVi: "Bánh mì truyền thống Việt Nam với thịt, pate và rau tươi.",
    options: {
      size: [],
      milkTypes: [],
      toppings: ["Extra Vegetables", "Chili Sauce", "Mayo"],
    },
  },
  {
    id: "21",
    name: "Tiramisu",
    nameVi: "Bánh Tiramisu",
    category: "mon-an-kem",
    type: "cold",
    price: 108000,
    imageUrl: "https://picsum.photos/600/420",
    description:
      "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone.",
    descriptionVi:
      "Bánh ngọt Italia truyền thống với bánh quy cà phê và kem mascarpone.",
    options: {
      size: [],
      milkTypes: [],
      toppings: ["Cocoa Powder", "Coffee Beans"],
    },
  },
];

export const stores: Store[] = [
  {
    id: "1",
    name: "AMBASSADOR's COFFEE - Embassy District",
    address: "45 Hai Bà Trưng, Quận 1, Thành phố Hồ Chí Minh, Vietnam",
    lat: 10.7769,
    lng: 106.7009,
    openingHours: "7:00 - 22:00",
    holidayNotices: [
      {
        date: "2025-09-02",
        message: "Special hours for Vietnam Independence Day: 8:00 - 20:00",
        isClosed: false,
      },
      {
        date: "2025-06-12",
        message: "Celebrating Philippines Independence Day with special menu",
        isClosed: false,
      },
    ],
  },
  {
    id: "2",
    name: "AMBASSADOR's COFFEE - Cultural Quarter",
    address: "78 Đống Đa, Quận Hai Bà Trưng, Hà Nội, Vietnam",
    lat: 21.0285,
    lng: 105.8542,
    openingHours: "6:30 - 21:30",
    holidayNotices: [
      {
        date: "2025-09-02",
        message: "Special hours for Vietnam Independence Day: 8:00 - 20:00",
        isClosed: false,
      },
      {
        date: "2025-06-12",
        message: "Celebrating Philippines Independence Day with special menu",
        isClosed: false,
      },
    ],
  },
  {
    id: "3",
    name: "AMBASSADOR's COFFEE - Diplomatic Haven",
    address: "156 Trần Hưng Đạo, Quận 5, Thành phố Hồ Chí Minh, Vietnam",
    lat: 10.7575,
    lng: 106.6835,
    openingHours: "7:30 - 21:00",
    holidayNotices: [
      {
        date: "2025-09-02",
        message: "Special hours for Vietnam Independence Day: 8:00 - 20:00",
        isClosed: false,
      },
      {
        date: "2025-06-12",
        message: "Celebrating Philippines Independence Day with special menu",
        isClosed: false,
      },
    ],
  },
];

export const sampleUser: User = {
  uid: "user123",
  name: "Alex Doe",
  email: "alex.doe@example.com",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  loyaltyPoints: 1250,
  tier: "Gold",
};

export const pastOrders: Order[] = [
  {
    id: "order001",
    userId: "user123",
    items: [], // simplified for this mock
    total: 540000,
    subtotal: 480000,
    deliveryFee: 60000,
    deliveryOption: "delivery",
    deliveryAddress: {
      recipientName: "Nguyễn Văn A",
      phoneNumber: "0901234567",
      streetAddress: "123 Đường ABC",
      ward: "Phường Bến Nghé",
      district: "Quận 1",
      city: "Thành phố Hồ Chí Minh",
      specialInstructions: "Gọi trước khi giao",
    },
    paymentMethod: "qr",
    createdAt: "2023-10-26T10:00:00Z",
    status: "completed",
    feedback: "Great service and delicious coffee!",
    rating: 5,
  },
  {
    id: "order002",
    userId: "user123",
    items: [],
    total: 378000,
    subtotal: 378000,
    deliveryFee: 0,
    deliveryOption: "pickup",
    paymentMethod: "cash",
    createdAt: "2023-10-20T14:30:00Z",
    status: "completed",
    feedback: "",
    rating: 0,
  },
  {
    id: "order003",
    userId: "user123",
    items: [],
    total: 744000,
    subtotal: 660000,
    deliveryFee: 84000,
    deliveryOption: "delivery",
    deliveryAddress: {
      recipientName: "Trần Thị B",
      phoneNumber: "0987654321",
      streetAddress: "456 Đường XYZ",
      ward: "Phường Tân Định",
      district: "Quận 3",
      city: "Thành phố Hồ Chí Minh",
    },
    paymentMethod: "points",
    createdAt: "2023-10-15T09:15:00Z",
    status: "preparing",
  },
  {
    id: "order004",
    userId: "user123",
    items: [],
    total: 204000,
    subtotal: 204000,
    deliveryFee: 0,
    deliveryOption: "pickup",
    paymentMethod: "cash",
    createdAt: "2023-10-28T16:45:00Z",
    status: "ready",
  },
];
