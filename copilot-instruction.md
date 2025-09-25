# Copilot Instruction: Brewly Coffee Project

## Project Overview

Brewly Coffee is a modern, responsive coffee shop web application built with Next.js, TypeScript, Tailwind CSS, Radix UI, and Firebase. It features dynamic product display, cart management, secure authentication, loyalty points, order history, and a store locator. The codebase is modular, scalable, and designed for rapid feature development.

---

## 1. Main Features & Business Logic

- **Product Display**: Menu items (coffee, tea, pastries) are fetched from Firestore and rendered with images, names, prices, and options.
- **Menu Filtering**: Users can filter products by category (hot/cold, tea/coffee, pastries) using tabs.
- **Cart Management**: Slide-in cart drawer for adding, removing, updating quantity, and viewing selected items. Cart state is managed via React Context.
- **Checkout Flow**: Multi-step checkout with payment method selection (cash, QR, points), order review, and confirmation. Loyalty points are calculated using Google Generative AI.
- **Authentication**: Firebase Auth supports email/password and Google login. Auth state is managed via React Context.
- **Order History**: Past orders are displayed for the logged-in user, fetched from Firestore (mocked in `lib/data.ts`).
- **Store Locator**: Map with store markers using Leaflet.js and React-Leaflet, sourced from Firestore (mocked in `lib/data.ts`).
- **Loyalty Points**: Points are calculated per order, with AI logic in checkout and a simulator in the Loyalty Points Calculator component.

---

## 2. Project Structure

```
root/
├── src/
│   ├── app/                # Next.js app directory (routing, pages)
│   │   ├── layout.tsx      # Root layout, providers, global styles
│   │   ├── page.tsx        # Home page (hero, featured, loyalty, orders, stores)
│   │   ├── menu/page.tsx   # Menu page (filtering, product grid)
│   │   ├── checkout/page.tsx # Checkout flow
│   │   ├── login/page.tsx  # Login page
│   │   ├── journey/page.tsx # Product journey map
│   ├── components/
│   │   ├── header.tsx      # Top navigation bar
│   │   ├── cart-drawer.tsx # Slide-in cart drawer
│   │   ├── product-card.tsx # Product display card
│   │   ├── loyalty-points-calculator.tsx # Points simulator
│   │   ├── journey-map.tsx # Map of product origins
│   │   ├── ui/             # Radix UI wrappers (button, sheet, dialog, etc.)
│   ├── context/
│   │   ├── auth-context.tsx # Auth state/context
│   │   ├── cart-context.tsx # Cart state/context
│   ├── hooks/
│   │   ├── use-toast.ts     # Toast notification system
│   │   ├── use-mobile.tsx   # Mobile breakpoint detection
│   ├── lib/
│   │   ├── types.ts         # TypeScript types (Product, CartItem, User, etc.)
│   │   ├── data.ts          # Mock data for products, stores, users, orders
│   │   ├── firebase.ts      # Firebase config/init
│   │   ├── utils.ts         # Utility functions (classnames)
│   │   ├── image-loader.ts  # Custom image loader for Next.js
├── public/                  # Static assets
├── docs/blueprint.md        # Feature blueprint & style guide
├── package.json             # Scripts, dependencies
├── tailwind.config.ts       # Tailwind CSS config
├── postcss.config.mjs       # PostCSS config
├── firebase.json            # Firebase hosting config
├── tsconfig.json            # TypeScript config
```

---

## 3. Key Context Providers

- **AuthProvider** (`src/context/auth-context.tsx`):
  - Provides `user`, `loading`, `signUp`, `signIn`, `signInWithGoogle`, `signOutUser`.
  - Wraps the app in `layout.tsx`.
- **CartProvider** (`src/context/cart-context.tsx`):
  - Provides `cart`, `isOpen`, `setIsOpen`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `cartTotal`, `cartCount`.
  - Used by cart drawer, product card, checkout, header.

---

## 4. UI Components & Styling

- **Radix UI**: Used for dialogs, sheets, tabs, dropdowns, etc. All wrappers are in `src/components/ui/`.
- **Tailwind CSS**: Utility-first styling. Colors, fonts, and layout follow the style guide in `docs/blueprint.md`.
- **Custom Components**: ProductCard, CartDrawer, LoyaltyPointsCalculator, JourneyMap, Header, etc.
- **Responsive Design**: Mobile breakpoints via Tailwind and `use-mobile.tsx`.

---

## 5. Data Models (see `src/lib/types.ts`)

- **Product**: id, name, category, type, price, imageUrl, description, options
- **CartItem**: Product + cartId, quantity, selectedSize, selectedMilk
- **Order**: id, userId, items, total, paymentMethod, createdAt, status
- **User**: uid, name, email, avatar, loyaltyPoints, tier
- **Store**: id, name, address, lat, lng, openingHours

---

## 6. Firebase Integration

- **Config**: See `src/lib/firebase.ts` for config and initialization.
- **Auth**: Email/password and Google login via Firebase Auth.
- **Firestore**: Intended for products, orders, stores (mocked in `lib/data.ts`).
- **Hosting**: Deploy via `firebase deploy --only hosting`.

---

## 7. AI Features

- **Google Generative AI**: Used in checkout to calculate loyalty points based on order history and total. API key required via `NEXT_PUBLIC_GEMINI_API_KEY`.
- **LoyaltyPointsCalculator**: Simulates points calculation for a given order total.

---

## 8. Adding Features & Prompts

- **To add a new product**: Update `lib/data.ts` and/or connect to Firestore.
- **To add a new page**: Create a new file in `src/app/` and add routing.
- **To add a new UI component**: Place in `src/components/` or `src/components/ui/`.
- **To add a new context**: Place in `src/context/` and wrap in `layout.tsx`.
- **To add a new hook**: Place in `src/hooks/`.
- **To add a new style**: Update Tailwind config or use utility classes.
- **To add authentication logic**: Use `auth-context.tsx` and Firebase Auth methods.
- **To add cart logic**: Use `cart-context.tsx` and CartProvider methods.
- **To add AI features**: Use Google Generative AI SDK and follow the pattern in checkout.

---

## 9. Development & Hot Reload

- **Run locally with hot reload**: `npm run dev` (default port 9002)
- **Build for production**: `npm run build`
- **Serve static build**: `npm run start`
- **Deploy to Firebase**: `npm run deploy`

---

## 10. Style Guide (see `docs/blueprint.md`)

- **Primary color**: #6B4226 (earthy brown)
- **Background**: #F5F0E6 (cream)
- **Accent**: #2E473B (dark green)
- **Fonts**: 'Playfair' for headlines, 'Inter' for body
- **Minimalistic icons, subtle animations (Framer Motion)**

---

## 11. Useful Prompts for Copilot

- "Add a new product to the menu."
- "Implement a new payment method in checkout."
- "Show user tier and points in the header."
- "Add Google Maps integration to store locator."
- "Connect menu page to Firestore."
- "Add Facebook login to authentication."
- "Show order details in order history."
- "Add dark mode support."
- "Add admin dashboard for managing products."

---

## 12. Best Practices

- Use context providers for global state (auth, cart).
- Use TypeScript for all new code.
- Use Radix UI and Tailwind for consistent UI.
- Keep business logic in context/hooks, UI in components.
- Use mock data in `lib/data.ts` for rapid prototyping.
- Use environment variables for secrets (API keys).

---

## 13. References

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Generative AI SDK](https://ai.google.dev/)

---

## 14. Quick Start

1. Install dependencies: `npm install`
2. Set up `.env.local` with Firebase and Gemini API keys
3. Run dev server: `npm run dev`
4. Open [http://localhost:9002](http://localhost:9002)

---

## 15. File Reference

- `src/app/` - Pages and routing
- `src/components/` - UI and business components
- `src/context/` - Global state providers
- `src/hooks/` - Custom hooks
- `src/lib/` - Types, data, utils, Firebase
- `public/` - Static assets
- `docs/` - Blueprint and documentation

---

## 16. How to Ask for Features

- Be specific: "Add a new loyalty tier called Diamond."
- Reference files/components: "Update `cart-context.tsx` to support discounts."
- Describe UI/UX: "Show a modal when checkout is successful."
- Specify data changes: "Add a new product to `lib/data.ts`."
- Request integration: "Connect menu page to Firestore."

---

## 17. How to Extend

- Add new context providers for global state
- Add new UI components in `src/components/`
- Add new pages in `src/app/`
- Add new hooks in `src/hooks/`
- Add new types in `src/lib/types.ts`
- Add new mock data in `src/lib/data.ts`

---

## 18. Troubleshooting

- If hot reload doesn't work, restart `npm run dev`
- If Firebase deploy fails, check `firebase.json` and credentials
- If AI features fail, check `NEXT_PUBLIC_GEMINI_API_KEY`
- For styling issues, check Tailwind config and classnames

---

## 19. Contact & Contribution

- For questions, see README and blueprint
- For new features, follow the structure above
- For contributions, use TypeScript, context, and modular components

---

This instruction file is designed for Copilot and future developers to quickly understand, extend, and prompt for new features in Brewly Coffee.
