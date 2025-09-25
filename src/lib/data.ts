import type { Product, Store, User, Order } from './types';

export const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Caramel Macchiato',
    category: 'coffee',
    type: 'hot',
    price: 4.75,
    imageUrl: 'https://picsum.photos/600/400',
    description: 'Rich espresso with steamed milk and a sweet caramel drizzle.',
    options: {
      size: ['S', 'M', 'L'],
      milkTypes: ['Dairy', 'Oat', 'Almond'],
      toppings: ['Caramel Drizzle', 'Whipped Cream'],
    },
  },
  {
    id: '2',
    name: 'Iced Matcha Latte',
    category: 'tea',
    type: 'cold',
    price: 5.25,
    imageUrl: 'https://picsum.photos/600/401',
    description: 'Earthy matcha green tea with cold milk, served over ice.',
    options: {
      size: ['S', 'M', 'L'],
      milkTypes: ['Dairy', 'Oat', 'Almond'],
      toppings: [],
    },
  },
  {
    id: '3',
    name: 'Almond Croissant',
    category: 'pastries',
    type: 'hot', // N/A for pastries but for filtering purposes
    price: 3.5,
    imageUrl: 'https://picsum.photos/600/402',
    description: 'Buttery croissant filled with sweet almond paste.',
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
    id: '4',
    name: 'Classic Drip Coffee',
    category: 'coffee',
    type: 'hot',
    price: 2.5,
    imageUrl: 'https://picsum.photos/600/403',
    description:
      'A well-rounded, flavorful, and aromatic cup of our house blend.',
    options: {
      size: ['S', 'M', 'L'],
      milkTypes: ['Dairy', 'Oat', 'Almond'],
      toppings: [],
    },
  },
  {
    id: '5',
    name: 'Cold Brew',
    category: 'coffee',
    type: 'cold',
    price: 4.5,
    imageUrl: 'https://picsum.photos/600/404',
    description:
      'Slow-steeped for a smooth, rich, and less acidic coffee experience.',
    options: {
      size: ['S', 'M', 'L'],
      milkTypes: ['Dairy', 'Oat', 'Almond'],
      toppings: ['Sweet Cream'],
    },
  },
  {
    id: '6',
    name: 'Earl Grey Tea',
    category: 'tea',
    type: 'hot',
    price: 3.0,
    imageUrl: 'https://picsum.photos/600/405',
    description: 'Black tea with a distinctive citrus flavor from bergamot oil.',
    options: {
      size: ['S', 'M', 'L'],
      milkTypes: [],
      toppings: ['Lemon Slice'],
    },
  },
  {
    id: '7',
    name: 'Chocolate Chip Cookie',
    category: 'pastries',
    type: 'hot', // N/A
    price: 2.75,
    imageUrl: 'https://picsum.photos/600/406',
    description: 'A classic, gooey chocolate chip cookie, baked fresh.',
    options: {
      size: [],
      milkTypes: [],
      toppings: [],
    },
  },
];

export const stores: Store[] = [
  {
    id: '1',
    name: 'Brewly Downtown',
    address: '123 Main St, Anytown, USA',
    lat: 34.0522,
    lng: -118.2437,
    openingHours: '7am - 7pm',
  },
  {
    id: '2',
    name: 'Brewly Uptown',
    address: '456 Oak Ave, Anytown, USA',
    lat: 34.0622,
    lng: -118.2537,
    openingHours: '6am - 9pm',
  },
];

export const sampleUser: User = {
  uid: 'user123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  loyaltyPoints: 1250,
  tier: 'Gold',
};

export const pastOrders: Order[] = [
  {
    id: 'order001',
    userId: 'user123',
    items: [], // simplified for this mock
    total: 22.5,
    paymentMethod: 'qr',
    createdAt: '2023-10-26T10:00:00Z',
    status: 'completed',
  },
  {
    id: 'order002',
    userId: 'user123',
    items: [],
    total: 15.75,
    paymentMethod: 'cash',
    createdAt: '2023-10-20T14:30:00Z',
    status: 'completed',
  },
  {
    id: 'order003',
    userId: 'user123',
    items: [],
    total: 31.0,
    paymentMethod: 'points',
    createdAt: '2023-10-15T09:15:00Z',
    status: 'completed',
  },
];
