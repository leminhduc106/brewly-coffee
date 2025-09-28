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
    name: "Caramel Macchiato",
    nameVi: "Caramel Macchiato",
    category: "coffee",
    type: "hot",
    price: 4.75,
    imageUrl: "https://picsum.photos/600/400",
    description: "Rich espresso with steamed milk and a sweet caramel drizzle.",
    descriptionVi: "Espresso đậm đà với sữa hấp và caramel ngọt ngào.",
    origin: {
      country: "Colombia",
      lat: 5.0,
      lng: -74.0,
      farmImageUrl: "https://picsum.photos/400/300?random=1",
      story:
        "Sourced from high-altitude farms in the Colombian Andes, known for their rich, balanced flavor.",
    },
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Dairy", "Oat", "Almond"],
      toppings: ["Caramel Drizzle", "Whipped Cream"],
    },
  },
  {
    id: "2",
    name: "Iced Matcha Latte",
    nameVi: "Matcha Latte Đá",
    category: "tea",
    type: "cold",
    price: 5.25,
    imageUrl: "https://picsum.photos/600/401",
    description: "Earthy matcha green tea with cold milk, served over ice.",
    descriptionVi: "Trà xanh matcha thơm với sữa lạnh, phục vụ với đá.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Dairy", "Oat", "Almond"],
      toppings: [],
    },
  },
  {
    id: "3",
    name: "Almond Croissant",
    nameVi: "Bánh Sừng Bò Hạnh Nhân",
    category: "pastries",
    type: "hot", // N/A for pastries but for filtering purposes
    price: 3.5,
    imageUrl: "https://picsum.photos/600/402",
    description: "Buttery croissant filled with sweet almond paste.",
    descriptionVi: "Bánh sừng bò bơ nhân kem hạnh nhân ngọt ngào.",
    options: {
      size: [],
      milkTypes: [],
      toppings: [],
    },
  },
];

export const allProducts: Product[] = [
  ...featuredProducts,
  {
    id: "4",
    name: "Classic Drip Coffee",
    nameVi: "Cà Phê Phin Truyền Thống",
    category: "coffee",
    type: "hot",
    price: 2.5,
    imageUrl: "https://picsum.photos/600/403",
    description:
      "A well-rounded, flavorful, and aromatic cup of our house blend.",
    descriptionVi: "Tách cà phê house blend đậm đà, thơm ngon và cân bằng.",
    origin: {
      country: "Brazil",
      lat: -15.0,
      lng: -47.0,
      farmImageUrl: "https://picsum.photos/400/300?random=2",
      story:
        "From the fertile lands of Minas Gerais, Brazil's premier coffee region.",
    },
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Dairy", "Oat", "Almond"],
      toppings: [],
    },
  },
  {
    id: "5",
    name: "Cold Brew",
    nameVi: "Cà Phê Cold Brew",
    category: "coffee",
    type: "cold",
    price: 4.5,
    imageUrl: "https://picsum.photos/600/404",
    description:
      "Slow-steeped for a smooth, rich, and less acidic coffee experience.",
    descriptionVi: "Ủ chậm để có vị mềm mại, đậm đà và ít chua.",
    origin: {
      country: "Ethiopia",
      lat: 9.0,
      lng: 38.7,
      farmImageUrl: "https://picsum.photos/400/300?random=3",
      story:
        "From the birthplace of coffee, Ethiopian highlands offer unique floral notes.",
    },
    options: {
      size: ["S", "M", "L"],
      milkTypes: ["Dairy", "Oat", "Almond"],
      toppings: ["Sweet Cream"],
    },
  },
  {
    id: "6",
    name: "Earl Grey Tea",
    nameVi: "Trà Earl Grey",
    category: "tea",
    type: "hot",
    price: 3.0,
    imageUrl: "https://picsum.photos/600/405",
    description:
      "Black tea with a distinctive citrus flavor from bergamot oil.",
    descriptionVi: "Trà đen với hương cam quýt đặc trưng từ tinh dầu bergamot.",
    options: {
      size: ["S", "M", "L"],
      milkTypes: [],
      toppings: ["Lemon Slice"],
    },
  },
  {
    id: "7",
    name: "Chocolate Chip Cookie",
    nameVi: "Bánh Quy Choco Chip",
    category: "pastries",
    type: "hot", // N/A
    price: 2.75,
    imageUrl: "https://picsum.photos/600/406",
    description: "A classic, gooey chocolate chip cookie, baked fresh.",
    descriptionVi: "Bánh quy chocolate chip truyền thống, nướng tươi mỗi ngày.",
    options: {
      size: [],
      milkTypes: [],
      toppings: [],
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
    total: 22.5,
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
    total: 15.75,
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
    total: 31.0,
    paymentMethod: "points",
    createdAt: "2023-10-15T09:15:00Z",
    status: "preparing",
  },
  {
    id: "order004",
    userId: "user123",
    items: [],
    total: 8.5,
    paymentMethod: "cash",
    createdAt: "2023-10-28T16:45:00Z",
    status: "ready",
  },
];
