# 🗺️ Complete Routes & URL Guide - AMBASSADOR's COFFEE

## 📋 All Available Routes/URLs

### 🏠 **Customer-Facing Routes**

| Route       | Purpose         | Access Level  | Description                                                   |
| ----------- | --------------- | ------------- | ------------------------------------------------------------- |
| `/`         | Homepage        | Public        | Main landing page with menu preview, store info, and ordering |
| `/menu`     | Menu & Ordering | Public        | Browse products, add to cart, place orders                    |
| `/checkout` | Order Checkout  | Authenticated | Complete order with payment and delivery details              |
| `/journey`  | Coffee Journey  | Public        | Interactive map showing coffee origins and story              |
| `/login`    | Authentication  | Public        | Sign in/up page for customers                                 |

### 👨‍💼 **Staff & Employee Routes**

| Route            | Purpose              | Access Level        | Description                                    |
| ---------------- | -------------------- | ------------------- | ---------------------------------------------- |
| `/staff`         | Staff Dashboard      | Staff/Manager/Admin | Main operations dashboard for order management |
| `/staff-join`    | Staff Onboarding     | Public              | Information page about joining as staff        |
| `/staff-signup`  | Staff Registration   | Public              | Create new staff accounts (functional)         |
| `/staff-request` | Staff Access Request | Authenticated       | Request staff role elevation                   |

### 🛡️ **Admin Panel Routes**

| Route                     | Purpose          | Access Level | Description                                           |
| ------------------------- | ---------------- | ------------ | ----------------------------------------------------- |
| `/admin`                  | Admin Dashboard  | Admin Only   | System overview, test data creation, order statistics |
| `/admin/user-management`  | User Management  | Admin Only   | Promote/demote user roles, search users               |
| `/admin/staff-management` | Staff Management | Admin Only   | _(Empty folder - future feature)_                     |
| `/admin/staff-requests`   | Staff Requests   | Admin Only   | Manage staff role requests and approvals              |

### 🔧 **Development & Debug Routes**

| Route             | Purpose        | Access Level | Description                       |
| ----------------- | -------------- | ------------ | --------------------------------- |
| `/role-debug`     | Role Debugging | Public       | Debug user roles and permissions  |
| `/admin-testing`  | Admin Testing  | Public       | _(Empty folder - deprecated)_     |
| `/manager-simple` | Simple Manager | Manager+     | _(Empty folder - future feature)_ |

### 🌐 **Internationalization Routes**

| Route       | Purpose         | Access Level | Description                            |
| ----------- | --------------- | ------------ | -------------------------------------- |
| `/[locale]` | Localized Pages | Public       | _(Empty folder - future i18n support)_ |

---

## 🎯 **Routes by User Role**

### 👤 **Customer (role: 'customer')**

- ✅ `/` - Homepage
- ✅ `/menu` - Browse and order
- ✅ `/checkout` - Complete orders
- ✅ `/journey` - Coffee story
- ✅ `/login` - Authentication
- ✅ `/staff-join` - View staff info
- ✅ `/staff-signup` - Apply for staff
- ✅ `/staff-request` - Request staff access
- ❌ `/staff` - Blocked by ProtectedRoute
- ❌ `/admin/**` - Blocked by ProtectedRoute

### 👨‍💼 **Staff (role: 'staff')**

- ✅ All customer routes
- ✅ `/staff` - Staff dashboard with order management
- ❌ `/admin/**` - Blocked by ProtectedRoute

### 👩‍💼 **Manager (role: 'manager')**

- ✅ All staff routes
- ✅ Additional permissions within `/staff` dashboard
- ❌ `/admin/**` - Blocked by ProtectedRoute

### 🛡️ **Admin (role: 'admin')**

- ✅ All routes (full access)
- ✅ `/admin` - System administration
- ✅ `/admin/user-management` - Manage user roles
- ✅ `/admin/staff-requests` - Approve staff requests

---

## 🔐 **Route Protection & Access Control**

### **Protected Routes**

```typescript
// Admin routes (admin-only)
/admin/**  → ProtectedRoute allowedRoles: ['admin']

// Staff routes (staff+)
/staff     → ProtectedRoute allowedRoles: ['staff', 'manager', 'admin']

// Authenticated routes (any logged-in user)
/checkout  → Requires authentication but no role restriction
```

### **Public Routes**

```typescript
// No authentication required
/, /emnu,
  /journey, /gilno,
  /staff-join, /affst - signup,
  /staff-request, /elor - debug;
```

---

## 🚀 **Navigation Flow**

### **Customer Journey:**

1. `/` (Homepage) → Browse products
2. `/menu` → Add items to cart
3. `/checkout` → Complete order
4. Back to `/` or `/menu` for more orders

### **Staff Journey:**

1. `/login` → Sign in with staff account
2. `/staff` → Dashboard appears in header
3. `/staff` → Manage orders through tabs:
   - Order Queue → Confirm new orders
   - Preparing → Update order progress
   - Ready → Mark orders complete
   - All Orders → View full history

### **Admin Journey:**

1. `/login` → Sign in with admin account
2. `/admin` → Admin panel appears
3. `/admin/user-management` → Manage user roles
4. `/admin/staff-requests` → Review staff applications
5. `/staff` → Also access staff dashboard for operations

### **Staff Application Journey:**

1. `/staff-join` → Learn about staff benefits
2. `/staff-signup` → Create account and apply
3. Admin reviews in `/admin/staff-requests`
4. Once approved → Access `/staff` dashboard

---

## 📱 **Mobile-Responsive Routes**

All routes are fully responsive and optimized for:

- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)

Special mobile optimizations:

- `/staff` dashboard has collapsible sidebar
- `/menu` shows mobile-friendly product cards
- `/admin` panels stack vertically on mobile

---

## 🔍 **Route Testing Guide**

### **Test as Customer:**

```
1. Visit / → Should see homepage
2. Visit /menu → Should see products
3. Visit /staff → Should be redirected/blocked
4. Visit /admin → Should be redirected/blocked
```

### **Test as Staff:**

```
1. Visit /staff → Should see order dashboard
2. Visit /admin → Should be redirected/blocked
3. Should see "Staff Dashboard" button in header
```

### **Test as Admin:**

```
1. Visit /admin → Should see admin panel
2. Visit /admin/user-management → Should see user list
3. Visit /staff → Should also work (admin has all access)
4. Should see both "Staff Dashboard" and admin navigation
```

---

## 📝 **Notes**

- **Empty Folders:** Some route folders exist but are empty (future features):

  - `/admin/staff-management/`
  - `/admin-testing/`
  - `/manager-simple/`
  - `/[locale]/`

- **Legacy Routes:** Some routes mentioned in docs may not exist or are deprecated

- **Dynamic Routes:** Currently no dynamic routes like `/product/[id]` - all products handled in `/menu`

- **API Routes:** No API routes in `src/app/api/` - all data handled via Firebase client SDK

This guide covers all functional routes in the application as of October 2025.
