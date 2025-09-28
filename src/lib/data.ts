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
export const contactlessPickupInstructions: ContactlessPickupInstructions[] = [
  {
    storeId: "1",
    pickupCode: "A1B2C3",
    mapUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-118.2457%2C34.0502%2C-118.2417%2C34.0542&layer=mapnik",
    steps: [
      "Arrive at Brewly Downtown and park in the designated pickup zone.",
      "Open your Brewly app and show your pickup code to the staff at the counter.",
      "Your order will be placed on the contactless pickup shelf. Collect your items when your code is called.",
      "Enjoy your order!",
    ],
  },
  {
    storeId: "2",
    pickupCode: "D4E5F6",
    mapUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-118.2557%2C34.0602%2C-118.2517%2C34.0642&layer=mapnik",
    steps: [
      "Arrive at Brewly Uptown and use the curbside pickup entrance.",
      "Show your pickup code to the staff at the window.",
      "Your order will be placed on the contactless pickup table. Wait for your code to be called.",
      "Take your order and enjoy!",
    ],
  },
];
import type {
  Product,
  Store,
  User,
  Order,
  ContactlessPickupInstructions,
  StoreAnnouncement,
} from "./types";

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Vietnamese Drip Coffee",
    nameVi: "Cà Phê Phin Việt Nam",
    category: "ca-phe-truyen-thong",
    type: "hot",
    price: 85000,
    imageUrl: "https://picsum.photos/600/400",
    description:
      "Traditional Vietnamese drip coffee served with condensed milk.",
    descriptionVi: "Cà phê phin truyền thống Việt Nam với sữa đặc ngọt ngào.",
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
    name: "Caramel Macchiato",
    nameVi: "Macchiato Caramel",
    category: "ca-phe-pha-may",
    type: "hot",
    price: 115000,
    imageUrl: "https://picsum.photos/600/401",
    description: "Rich espresso with steamed milk and a sweet caramel drizzle.",
    descriptionVi: "Espresso đậm đà với sữa hấp và caramel ngọt ngào.",
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
    name: "Brewly Downtown",
    address: "123 Main St, Anytown, USA",
    lat: 34.0522,
    lng: -118.2437,
    openingHours: "7am - 7pm",
    holidayNotices: [
      {
        date: "2025-12-25",
        message: "Closed for Christmas Day",
        isClosed: true,
      },
      {
        date: "2025-01-01",
        message: "Open 9am - 3pm for New Year’s Day",
        isClosed: false,
      },
    ],
  },
  {
    id: "2",
    name: "Brewly Uptown",
    address: "456 Oak Ave, Anytown, USA",
    lat: 34.0622,
    lng: -118.2537,
    openingHours: "6am - 9pm",
    holidayNotices: [
      {
        date: "2025-12-25",
        message: "Closed for Christmas Day",
        isClosed: true,
      },
      {
        date: "2025-01-01",
        message: "Open 8am - 2pm for New Year’s Day",
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
