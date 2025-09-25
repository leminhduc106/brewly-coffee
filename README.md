# Brewly Coffee ☕

A modern, feature-rich coffee shop web app built with Next.js, TypeScript, Tailwind CSS, Firebase, and Radix UI. Designed for real-world deployment, Brewly Coffee offers loyalty rewards, personalized recommendations, order tracking, and more—all optimized for the Firebase Spark plan.

---

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, custom components
- **Backend:** Firebase (Firestore, Auth, Hosting)
- **State Management:** React Context
- **Persistence:** Firestore, localStorage
- **Icons:** Lucide

---

## 🌟 Key Features

- **Favorites/Wishlist:** Heart products, view favorites, sync with Firestore
- **Personalized Recommendations:** Smart suggestions based on favorites & history
- **Order Status Tracking:** Real-time updates (Preparing, Ready, Completed)
- **Referral Program:** Unique codes, bonus points for referrals
- **Birthday Rewards:** Special banner & bonus on user birthday
- **Push Notifications (Planned):** Order updates & promos via FCM
- **Store Announcements/Promos (Planned):** Dynamic banners from Firestore
- **Feedback/Rating System (Planned):** Post-order feedback
- **Accessibility Features (Planned):** High-contrast, large text, keyboard nav
- **QR Code Loyalty (Planned):** Scan to earn/redeem points
- **Multi-language Support (Planned):** English/Vietnamese toggle
- **Order Repeat/Quick Reorder (Planned):** One-click reorder
- **Store Hours & Holiday Notices (Planned):** Dynamic, Firestore-managed
- **Contactless Pickup Instructions (Planned):** Map, code, clear steps
- **Guest Checkout (Planned):** Order without sign-in (limited features)

---

## 🗂️ Project Structure

```
├── src/
│   ├── app/                # Next.js app router pages
│   │   ├── menu/           # Menu & favorites
│   │   ├── login/          # Auth (sign in/up)
│   │   ├── checkout/       # Checkout flow
│   │   ├── journey/        # User journey map
│   │   └── ...
│   ├── components/         # UI & feature components
│   │   ├── product-card.tsx
│   │   ├── birthday-banner.tsx
│   │   ├── recommendations.tsx
│   │   ├── referral-system.tsx
│   │   └── ui/             # Radix UI wrappers
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Data, types, firebase, user-service
│   └── ...
├── public/                 # Static assets
├── docs/                   # Project blueprints
├── tailwind.config.ts      # Tailwind setup
├── firebase.json           # Firebase hosting config
├── package.json            # Dependencies & scripts
└── ...
```

---

## 🛠️ Setup & Development

1. **Clone the repo:**
   ```sh
   git clone https://github.com/leminhduc106/brewly-coffee.git
   cd brewly-coffee
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure Firebase:**
   - Update `src/lib/firebase.ts` with your Firebase project config
   - Ensure Firestore & Auth are enabled in Firebase Console
4. **Run locally:**
   ```sh
   npm run dev
   ```
5. **Deploy:**
   - Use `firebase deploy` for hosting

---

## 🔒 Authentication

- Email/password & Google sign-in
- User profiles stored in Firestore (`users` collection)
- Birthday, referral code, loyalty points tracked per user

---

## 🧩 Component Highlights

- **ProductCard:** Heart/favorite logic, add to cart
- **BirthdayBanner:** Shows on user's birthday, claim reward
- **Recommendations:** Personalized suggestions
- **ReferralSystem:** Share/copy code, track referrals
- **Order Status:** Color-coded badges, real-time updates

---

## 📝 Development Notes

- **Firebase Spark Plan:** All features optimized for free tier
- **Type Safety:** All logic uses TypeScript interfaces
- **UI/UX:** Modern, mobile-friendly, accessible
- **Extensible:** Easy to add new features (see TODOs)

---

## 📋 TODOs & Roadmap

- [x] Favorites/Wishlist
- [x] Personalized Recommendations
- [x] Order Status Tracking
- [x] Referral Program
- [x] Birthday Rewards
- [ ] Push Notifications (Web)
- [ ] Store Announcements/Promos
- [x] Feedback/Rating System
- [ ] Accessibility Features
- [ ] QR Code Loyalty
- [ ] Multi-language Support
- [ ] Order Repeat/Quick Reorder
- [x] Store Hours & Holiday Notices
- [x] Contactless Pickup Instructions
- [ ] Guest Checkout

---

## 📚 Documentation

- See `docs/blueprint.md` for feature specs & architecture
- See `copilot-instruction.md` for AI development guidelines

---

## 💡 Contributing

Pull requests welcome! Please follow the code style and add tests for new features.

---

## 🏆 License

MIT
