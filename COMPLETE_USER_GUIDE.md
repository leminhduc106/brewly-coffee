# 📚 AMBASSADOR's COFFEE - Complete User Guide

# 📚 AMBASSADOR's COFFEE - Hướng Dẫn Sử Dụng Hoàn Chỉnh

---

## 🎯 **Table of Contents / Mục Lục**

### English Version

1. [System Overview](#system-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Getting Started](#getting-started)
4. [Customer Guide](#customer-guide)
5. [Staff Dashboard Guide](#staff-dashboard-guide)
6. [Manager Guide](#manager-guide)
7. [Admin Setup & Testing](#admin-setup--testing)
8. [Troubleshooting](#troubleshooting)

### Vietnamese Version / Phiên Bản Tiếng Việt

1. [Tổng Quan Hệ Thống](#tổng-quan-hệ-thống)
2. [Vai Trò & Quyền Hạn](#vai-trò--quyền-hạn)
3. [Bắt Đầu Sử Dụng](#bắt-đầu-sử-dụng)
4. [Hướng Dẫn Khách Hàng](#hướng-dẫn-khách-hàng)
5. [Hướng Dẫn Nhân Viên](#hướng-dẫn-nhân-viên)
6. [Hướng Dẫn Quản Lý](#hướng-dẫn-quản-lý)
7. [Cài Đặt Admin & Test](#cài-đặt-admin--test)
8. [Khắc Phục Sự Cố](#khắc-phục-sự-cố)

---

## 🌟 **System Overview**

AMBASSADOR's COFFEE is a comprehensive coffee shop management system with three core components:

### **🏪 Components:**

- **Customer App** - Order drinks, track history, loyalty program
- **Staff Dashboard** - Manage orders, update status, kitchen display
- **Admin Panel** - User management, analytics, system setup

### **🔧 Technology Stack:**

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Firebase (Firestore, Authentication)
- **Real-time:** Firebase listeners for live updates
- **Payments:** Integrated QR code and points system

---

## 🎭 **User Roles & Permissions**

### **👤 Customer**

- ✅ Browse menu and place orders
- ✅ Track order history and reorder
- ✅ Manage delivery addresses
- ✅ Loyalty points and rewards
- ❌ Cannot access staff areas

### **👨‍💼 Staff**

- ✅ View incoming orders in real-time
- ✅ Update order status (pending → preparing → ready → completed)
- ✅ Access kitchen display system
- ✅ View today's order statistics
- ❌ Cannot manage other staff or access analytics

### **👩‍💼 Manager**

- ✅ All staff permissions
- ✅ View analytics and reports
- ✅ Manage staff in their store
- ✅ Access advanced features
- ❌ Cannot manage system-wide settings

### **🔧 Admin**

- ✅ Full system access
- ✅ Create and manage all user accounts
- ✅ System configuration
- ✅ Multi-store management

---

## 🚀 **Getting Started**

### **Step 1: First Time Setup**

1. **Visit the Website:** `https://your-domain.com`
2. **Create Account:** Click "Sign Up" → Enter email & password
3. **Verify Email:** Check your email for verification link
4. **Complete Profile:** Add name, phone, birthday (optional)

### **Step 2: Understanding the Interface**

**🏠 Homepage Features:**

- Embassy locations with interactive map
- Featured diplomatic coffee specials
- Loyalty points progress tracker
- Order history (after placing orders)

**📱 Navigation:**

- **Menu** - Browse all drinks and food
- **Cart** - Review items before checkout
- **Profile** - Account settings and history
- **Staff Dashboard** - (Only visible to staff/managers)

---

## 👥 **Customer Guide**

### **🛒 Placing Your First Order**

#### **Step 1: Browse Menu**

1. Click **"Menu"** from navigation
2. Browse categories:
   - ☕ Traditional Coffee (Cà Phê Truyền Thống)
   - 🤖 Machine Coffee (Cà Phê Pha Máy)
   - 🧋 Tea & Milk Tea (Trà & Trà Sữa)
   - 🥤 Smoothies (Đá Xay & Smoothie)
   - 🥤 Beverages (Soda & Nước Giải Khát)
   - 🍞 Food (Món Ăn Kèm)

#### **Step 2: Customize Your Drink**

1. **Click on any product** → Product details modal opens
2. **Choose Size:** Tall, Grande, or Venti
3. **Select Milk:** Whole milk, oat milk, almond milk, etc.
4. **Add Toppings:** Extra shot, vanilla syrup, etc.
5. **Set Quantity:** Use +/- buttons
6. **Add to Cart:** Click the blue "Add to Cart" button

#### **Step 3: Review Cart**

1. **Click Cart Icon** (top right) → Cart drawer opens
2. **Review Items:** Check quantities and customizations
3. **Modify if needed:** Change quantities or remove items
4. **Proceed to Checkout:** Click "Checkout" button

#### **Step 4: Checkout Process**

**🔍 Review Order:**

- Verify all items and quantities
- Check total amount
- Click "Continue to Delivery"

**🚚 Choose Delivery Option:**

- **Pickup:** Collect at embassy location (FREE)
- **Delivery:** Get it delivered to your address

**For Delivery Orders:**

1. **Enter Address Details:**
   - Recipient name and phone
   - Street address
   - Select Ward (Phường) → Auto-loads Districts
   - Select District (Quận) → Auto-loads City
   - Add special delivery instructions
2. **Delivery Fee:** Automatically calculated (10K-40K VND)

**💳 Payment Method:**

1. **QR Code Payment:** Scan to pay via banking app
2. **Cash Payment:** Pay on delivery/pickup
3. **Loyalty Points:** Use accumulated points (100 points = 100,000₫)

**✅ Order Confirmation:**

- Get order ID for tracking
- QR code for payment (if selected)
- Estimated pickup/delivery time
- Store location and contact info

### **📊 Tracking Your Orders**

#### **Order History:**

1. **Go to Homepage** → Scroll to "Your Order History"
2. **View All Past Orders:** See date, items, total, status
3. **Reorder Feature:** Click "Reorder" → Items added to cart
4. **Rate & Review:** Leave feedback for completed orders

#### **Order Statuses:**

- 🟡 **Pending** - Order received, waiting for staff confirmation
- 🔵 **Confirmed** - Staff confirmed, preparing to start
- 🟡 **Preparing** - Kitchen is making your drinks
- 🟢 **Ready** - Order ready for pickup/delivery
- ✅ **Completed** - Order successfully delivered/picked up

### **🎁 Loyalty Program**

#### **Earning Points:**

- **1 point = 1,000₫ spent**
- Automatic calculation on every order
- Bonus points on special occasions
- Birthday rewards (100 bonus points + free pastry)

#### **Using Points:**

- **100 points = 100,000₫ discount**
- Select "Pay with Points" during checkout
- Points deducted automatically
- View balance on homepage

#### **Loyalty Tiers:**

- 🥈 **Silver** (0-999 points): Basic benefits
- 🥇 **Gold** (1000-1999 points): 5% bonus points
- 💎 **Platinum** (2000+ points): 10% bonus points + exclusive offers

---

## 👨‍💼 **Staff Dashboard Guide**

### **🔐 Accessing Staff Dashboard**

#### **Prerequisites:**

- Must have staff/manager role assigned
- Account must be linked to a specific embassy location
- Must be logged in with staff credentials

#### **Access Methods:**

1. **Direct URL:** Visit `/staff`
2. **Homepage Button:** "Staff Dashboard" appears for staff users
3. **Bookmark:** Save staff URL for quick access

### **📊 Dashboard Overview**

#### **Header Information:**

- **Embassy Location:** Shows which location you're managing
- **Your Name & Role:** Staff/Manager badge
- **Real-time Clock:** Current time display

#### **Statistics Cards:**

- **📦 Total Orders:** Today's order count
- **⏳ Pending:** Orders waiting for confirmation
- **☕ Preparing:** Orders currently being made
- **💰 Revenue:** Today's total earnings

### **📋 Order Management**

#### **Order Queue Tab:**

**👀 View Incoming Orders:**

- Orders appear in real-time (no refresh needed)
- Shows order time, customer info, items
- Color-coded status badges
- Delivery vs pickup indicators

**📱 Order Information Display:**

- **Order ID:** Last 8 characters for easy reference
- **Time:** When order was placed + "time ago"
- **Customer Details:** Name, phone, address (for delivery)
- **Items:** All drinks with customizations clearly shown
- **Total Amount:** Final price including delivery fees

**⚡ Status Update Actions:**

1. **Pending Orders:**

   - Click **"Confirm Order"** → Changes to "Confirmed"
   - Sends notification to customer

2. **Confirmed Orders:**

   - Click **"Start Preparing"** → Changes to "Preparing"
   - Auto-calculates estimated preparation time
   - Assigns order to your staff ID

3. **Preparing Orders:**

   - Click **"Mark Ready"** → Changes to "Ready"
   - Notifies customer for pickup/delivery

4. **Ready Orders:**
   - Click **"Complete Order"** → Changes to "Completed"
   - Order removed from active queue

#### **Kitchen Display Tab:**

**🍳 Optimized for Kitchen Staff:**

- **Large, Clear Text:** Easy to read while cooking
- **Item Focus:** Emphasizes drink names and customizations
- **Special Instructions:** Highlighted in orange
- **Quantity Badges:** Large, visible quantity indicators
- **Time Tracking:** Shows how long order has been preparing

**📱 Kitchen Layout:**

- 2-column grid on desktop
- Single column on mobile/tablet
- Auto-refreshes with new orders
- Only shows "Confirmed" and "Preparing" orders

### **⏰ Time Management**

#### **Estimated Preparation Times:**

- **Traditional Coffee:** 4 minutes per item
- **Machine Coffee:** 2 minutes per item
- **Tea & Milk Tea:** 5 minutes per item
- **Smoothies:** 6 minutes per item
- **Food Items:** 8 minutes per item
- **Auto-calculated** based on order complexity

#### **Time Tracking Features:**

- Shows "time since order placed"
- Estimated completion time
- Color coding for urgency (red if taking too long)

---

## 👩‍💼 **Manager Guide**

### **👑 Additional Manager Features**

#### **Advanced Analytics:**

- View detailed daily/weekly/monthly reports
- Track staff performance metrics
- Monitor popular items and trends
- Revenue analysis by time periods

#### **Staff Management:**

- View all staff in your location
- Monitor active staff members
- Assign orders to specific staff
- Track completion times per staff member

#### **Inventory Insights:**

- Popular item tracking
- Peak hour analysis
- Customer preference patterns
- Seasonal trend identification

---

## 🔧 **Admin Setup & Testing**

### **🎯 Quick Setup for Testing**

#### **Method 1: Use Admin Testing Panel**

1. **Visit:** `/admin-testing`
2. **Create Test Accounts:** Click "Create Test Staff Accounts"
3. **Go to Firebase Console** → Authentication
4. **Create Firebase Auth users** with these emails:
   - `manager@ambassadors-coffee.com`
   - `staff@ambassadors-coffee.com`
   - `staff-hanoi@ambassadors-coffee.com`
5. **Use any password** (e.g., "password123")

#### **Method 2: Promote Your Current Account**

1. **Visit:** `/admin-testing`
2. **Click:** "Make Me Manager"
3. **Refresh page** → You'll see "Staff Dashboard" button
4. **Access:** `/staff` to use the dashboard

### **🛠️ Manual Staff Account Creation**

#### **Step 1: Create Firebase Auth Account**

1. Go to **Firebase Console** → **Authentication**
2. Click **"Add User"**
3. Enter **email** and **password**
4. Copy the **User UID**

#### **Step 2: Create Firestore Profile**

1. Go to **Firestore Database** → **users** collection
2. Create new document with **User UID** as ID
3. Add these fields:

```javascript
{
  uid: "user_uid_here",
  name: "Staff Name",
  email: "staff@ambassadors-coffee.com",
  role: "staff", // or "manager"
  storeId: "embassy-hcm", // or "embassy-hanoi"
  employeeId: "EMP001",
  loyaltyPoints: 0,
  tier: "Silver",
  hireDate: "2023-01-15",
  avatar: "https://i.pravatar.cc/150?u=staff001"
}
```

### **🏪 Store Configuration**

#### **Available Stores:**

- **embassy-hcm** - Embassy Ho Chi Minh City
- **embassy-hanoi** - Embassy Hanoi
- **embassy-danang** - Embassy Da Nang

#### **Adding New Stores:**

1. Update `stores` array in `/src/lib/data.ts`
2. Add store ID, name, address, coordinates
3. Update staff accounts with new `storeId`

### **🔒 Firebase Security Rules**

#### **Required Firestore Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Customer orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null &&
        (request.auth.uid == resource.data.userId ||
         isStaffAtStore(request.auth.uid, resource.data.storeId));
    }

    // User profiles
    match /users/{userId} {
      allow read, write: if request.auth != null &&
        (request.auth.uid == userId || isManager(request.auth.uid));
    }

    // Helper functions
    function isStaffAtStore(uid, storeId) {
      return exists(/databases/$(database)/documents/users/$(uid)) &&
        get(/databases/$(database)/documents/users/$(uid)).data.role in ['staff', 'manager', 'admin'] &&
        (get(/databases/$(database)/documents/users/$(uid)).data.storeId == storeId ||
         get(/databases/$(database)/documents/users/$(uid)).data.role == 'admin');
    }

    function isManager(uid) {
      return exists(/databases/$(database)/documents/users/$(uid)) &&
        get(/databases/$(database)/documents/users/$(uid)).data.role in ['manager', 'admin'];
    }
  }
}
```

---

# 🇻🇳 **PHIÊN BẢN TIẾNG VIỆT**

---

## 🌟 **Tổng Quan Hệ Thống**

AMBASSADOR's COFFEE là hệ thống quản lý quán cà phê toàn diện với ba thành phần chính:

### **🏪 Các Thành Phần:**

- **Ứng Dụng Khách Hàng** - Đặt đồ uống, theo dõi lịch sử, tích điểm
- **Bảng Điều Khiển Nhân Viên** - Quản lý đơn hàng, cập nhật trạng thái
- **Panel Quản Trị** - Quản lý người dùng, thống kê, cài đặt hệ thống

---

## 🎭 **Vai Trò & Quyền Hạn**

### **👤 Khách Hàng**

- ✅ Xem menu và đặt hàng
- ✅ Theo dõi lịch sử và đặt lại đơn hàng
- ✅ Quản lý địa chỉ giao hàng
- ✅ Tích điểm thành viên và ưu đãi
- ❌ Không thể truy cập khu vực nhân viên

### **👨‍💼 Nhân Viên**

- ✅ Xem đơn hàng mới theo thời gian thực
- ✅ Cập nhật trạng thái (chờ → chuẩn bị → sẵn sàng → hoàn thành)
- ✅ Sử dụng màn hình bếp
- ✅ Xem thống kê đơn hàng hôm nay
- ❌ Không thể quản lý nhân viên khác

### **👩‍💼 Quản Lý**

- ✅ Tất cả quyền của nhân viên
- ✅ Xem báo cáo và thống kê
- ✅ Quản lý nhân viên tại cửa hàng
- ✅ Truy cập tính năng nâng cao

### **🔧 Quản Trị Viên**

- ✅ Toàn quyền truy cập hệ thống
- ✅ Tạo và quản lý tài khoản
- ✅ Cấu hình hệ thống
- ✅ Quản lý đa cửa hàng

---

## 🚀 **Bắt Đầu Sử Dụng**

### **Bước 1: Thiết Lập Lần Đầu**

1. **Truy Cập Website:** `https://your-domain.com`
2. **Tạo Tài Khoản:** Nhấp "Đăng Ký" → Nhập email & mật khẩu
3. **Xác Minh Email:** Kiểm tra email để xác minh
4. **Hoàn Thành Hồ Sơ:** Thêm tên, số điện thoại, sinh nhật

### **Bước 2: Hiểu Giao Diện**

**🏠 Tính Năng Trang Chủ:**

- Bản đồ các vị trí đại sứ quán tương tác
- Đặc sản cà phê ngoại giao nổi bật
- Thanh tiến độ điểm thành viên
- Lịch sử đơn hàng (sau khi đặt hàng)

---

## 👥 **Hướng Dẫn Khách Hàng**

### **🛒 Đặt Đơn Hàng Đầu Tiên**

#### **Bước 1: Duyệt Menu**

1. Nhấp **"Thực Đơn"** từ menu điều hướng
2. Duyệt các danh mục:
   - ☕ Cà Phê Truyền Thống
   - 🤖 Cà Phê Pha Máy
   - 🧋 Trà & Trà Sữa
   - 🥤 Đá Xay & Smoothie
   - 🥤 Soda & Nước Giải Khát
   - 🍞 Món Ăn Kèm

#### **Bước 2: Tùy Chỉnh Đồ Uống**

1. **Nhấp vào sản phẩm** → Cửa sổ chi tiết mở ra
2. **Chọn Size:** Tall, Grande, hoặc Venti
3. **Chọn Loại Sữa:** Sữa tươi, sữa yến mạch, sữa hạnh nhân...
4. **Thêm Topping:** Extra shot, siro vanilla...
5. **Đặt Số Lượng:** Dùng nút +/-
6. **Thêm Vào Giỏ:** Nhấp nút "Thêm Vào Giỏ Hàng"

#### **Bước 3: Kiểm Tra Giỏ Hàng**

1. **Nhấp Biểu Tượng Giỏ** (góc phải) → Ngăn kéo giỏ hàng mở
2. **Xem Lại Sản Phẩm:** Kiểm tra số lượng và tùy chỉnh
3. **Sửa Đổi Nếu Cần:** Thay đổi số lượng hoặc xóa sản phẩm
4. **Tiến Hành Thanh Toán:** Nhấp nút "Thanh Toán"

#### **Bước 4: Quy Trình Thanh Toán**

**🔍 Xem Lại Đơn Hàng:**

- Xác minh tất cả sản phẩm và số lượng
- Kiểm tra tổng tiền
- Nhấp "Tiếp Tục Đến Giao Hàng"

**🚚 Chọn Hình Thức Giao Hàng:**

- **Tự Đến Lấy:** Thu thập tại vị trí đại sứ quán (MIỄN PHÍ)
- **Giao Hàng:** Giao đến địa chỉ của bạn

**Với Đơn Giao Hàng:**

1. **Nhập Chi Tiết Địa Chỉ:**
   - Tên người nhận và số điện thoại
   - Địa chỉ chi tiết
   - Chọn Phường → Tự động tải Quận
   - Chọn Quận → Tự động tải Thành phố
   - Thêm hướng dẫn giao hàng đặc biệt
2. **Phí Giao Hàng:** Tự động tính (10K-40K VND)

**💳 Phương Thức Thanh Toán:**

1. **QR Code:** Quét để thanh toán qua ứng dụng ngân hàng
2. **Tiền Mặt:** Thanh toán khi giao hàng/lấy hàng
3. **Điểm Thành Viên:** Sử dụng điểm tích lũy (100 điểm = 100,000₫)

### **📊 Theo Dõi Đơn Hàng**

#### **Lịch Sử Đơn Hàng:**

1. **Về Trang Chủ** → Cuộn đến "Lịch Sử Đơn Hàng"
2. **Xem Tất Cả Đơn Cũ:** Ngày, sản phẩm, tổng tiền, trạng thái
3. **Tính Năng Đặt Lại:** Nhấp "Đặt Lại" → Sản phẩm thêm vào giỏ
4. **Đánh Giá:** Để lại phản hồi cho đơn hàng hoàn thành

#### **Trạng Thái Đơn Hàng:**

- 🟡 **Chờ Xử Lý** - Đã nhận đơn, đợi nhân viên xác nhận
- 🔵 **Đã Xác Nhận** - Nhân viên xác nhận, chuẩn bị làm
- 🟡 **Đang Chuẩn Bị** - Bếp đang pha chế đồ uống
- 🟢 **Sẵn Sàng** - Đơn hàng sẵn sàng lấy/giao
- ✅ **Hoàn Thành** - Đã giao/lấy thành công

### **🎁 Chương Trình Thành Viên**

#### **Tích Điểm:**

- **1 điểm = 1,000₫ chi tiêu**
- Tự động tính trên mỗi đơn hàng
- Điểm thưởng dịp đặc biệt
- Quà sinh nhật (100 điểm + bánh ngọt miễn phí)

#### **Sử Dụng Điểm:**

- **100 điểm = 100,000₫ giảm giá**
- Chọn "Thanh Toán Bằng Điểm" khi checkout
- Điểm tự động trừ
- Xem số dư trên trang chủ

---

## 👨‍💼 **Hướng Dẫn Nhân Viên**

### **🔐 Truy Cập Bảng Điều Khiển Nhân Viên**

#### **Điều Kiện:**

- Phải có vai trò nhân viên/quản lý được chỉ định
- Tài khoản phải liên kết với vị trí đại sứ quán cụ thể
- Phải đăng nhập bằng thông tin nhân viên

#### **Cách Truy Cập:**

1. **URL Trực Tiếp:** Truy cập `/staff`
2. **Nút Trang Chủ:** "Bảng Điều Khiển Nhân Viên" xuất hiện cho nhân viên
3. **Bookmark:** Lưu URL nhân viên để truy cập nhanh

### **📊 Tổng Quan Bảng Điều Khiển**

#### **Thông Tin Header:**

- **Vị Trí Đại Sứ Quán:** Hiển thị vị trí bạn đang quản lý
- **Tên & Vai Trò:** Badge nhân viên/quản lý
- **Đồng Hồ Thời Gian Thực:** Hiển thị giờ hiện tại

#### **Thẻ Thống Kê:**

- **📦 Tổng Đơn Hàng:** Số đơn hàng hôm nay
- **⏳ Chờ Xử Lý:** Đơn hàng đợi xác nhận
- **☕ Đang Chuẩn Bị:** Đơn hàng đang làm
- **💰 Doanh Thu:** Tổng thu hôm nay

### **📋 Quản Lý Đơn Hàng**

#### **Tab Hàng Đợi Đơn Hàng:**

**👀 Xem Đơn Hàng Mới:**

- Đơn hàng xuất hiện theo thời gian thực (không cần refresh)
- Hiển thị thời gian đặt, thông tin khách, sản phẩm
- Badge trạng thái có mã màu
- Chỉ báo giao hàng vs tự lấy

**📱 Hiển Thị Thông Tin Đơn Hàng:**

- **ID Đơn Hàng:** 8 ký tự cuối để tham chiếu dễ dàng
- **Thời Gian:** Khi đặt hàng + "cách đây bao lâu"
- **Chi Tiết Khách:** Tên, điện thoại, địa chỉ (với giao hàng)
- **Sản Phẩm:** Tất cả đồ uống với tùy chỉnh hiển thị rõ ràng
- **Tổng Tiền:** Giá cuối cùng bao gồm phí giao hàng

**⚡ Hành Động Cập Nhật Trạng Thái:**

1. **Đơn Chờ Xử Lý:**

   - Nhấp **"Xác Nhận Đơn Hàng"** → Chuyển sang "Đã Xác Nhận"
   - Gửi thông báo cho khách hàng

2. **Đơn Đã Xác Nhận:**

   - Nhấp **"Bắt Đầu Chuẩn Bị"** → Chuyển sang "Đang Chuẩn Bị"
   - Tự động tính thời gian chuẩn bị ước tính
   - Gán đơn hàng cho ID nhân viên của bạn

3. **Đơn Đang Chuẩn Bị:**

   - Nhấp **"Đánh Dấu Sẵn Sàng"** → Chuyển sang "Sẵn Sàng"
   - Thông báo khách hàng đến lấy/giao hàng

4. **Đơn Sẵn Sàng:**
   - Nhấp **"Hoàn Thành Đơn Hàng"** → Chuyển sang "Hoàn Thành"
   - Đơn hàng được xóa khỏi hàng đợi hoạt động

---

## 🔧 **Cài Đặt Admin & Test**

### **🎯 Thiết Lập Nhanh Để Test**

#### **Cách 1: Sử Dụng Panel Test Admin**

1. **Truy Cập:** `/admin-testing`
2. **Tạo Tài Khoản Test:** Nhấp "Tạo Tài Khoản Nhân Viên Test"
3. **Vào Firebase Console** → Authentication
4. **Tạo người dùng Firebase Auth** với các email:
   - `manager@ambassadors-coffee.com`
   - `staff@ambassadors-coffee.com`
   - `staff-hanoi@ambassadors-coffee.com`
5. **Dùng mật khẩu bất kỳ** (ví dụ: "password123")

#### **Cách 2: Thăng Cấp Tài Khoản Hiện Tại**

1. **Truy Cập:** `/admin-testing`
2. **Nhấp:** "Làm Tôi Thành Quản Lý"
3. **Refresh trang** → Sẽ thấy nút "Bảng Điều Khiển Nhân Viên"
4. **Truy Cập:** `/staff` để sử dụng bảng điều khiển

### **🛠️ Tạo Tài Khoản Nhân Viên Thủ Công**

#### **Bước 1: Tạo Tài Khoản Firebase Auth**

1. Vào **Firebase Console** → **Authentication**
2. Nhấp **"Thêm Người Dùng"**
3. Nhập **email** và **mật khẩu**
4. Sao chép **User UID**

#### **Bước 2: Tạo Profile Firestore**

1. Vào **Firestore Database** → collection **users**
2. Tạo document mới với **User UID** làm ID
3. Thêm các trường này:

```javascript
{
  uid: "user_uid_here",
  name: "Tên Nhân Viên",
  email: "staff@ambassadors-coffee.com",
  role: "staff", // hoặc "manager"
  storeId: "embassy-hcm", // hoặc "embassy-hanoi"
  employeeId: "EMP001",
  loyaltyPoints: 0,
  tier: "Silver",
  hireDate: "2023-01-15",
  avatar: "https://i.pravatar.cc/150?u=staff001"
}
```

---

## 🚨 **Troubleshooting / Khắc Phục Sự Cố**

### **🔒 Lỗi "Access Denied" / "Truy Cập Bị Từ Chối"**

**Nguyên nhân:** Tài khoản không có vai trò staff/manager
**Giải pháp:**

1. Kiểm tra vai trò trong Firestore Database → users → [your-uid]
2. Đảm bảo trường `role` = "staff", "manager", hoặc "admin"
3. Đảm bảo có trường `storeId` phù hợp

### **📱 Firebase Index Error / Lỗi Index Firebase**

**Nguyên nhân:** Chưa tạo composite index cho queries
**Giải pháp:**

1. Nhấp vào link trong console error
2. Chờ 2-5 phút để Firebase build index
3. Refresh lại trang

### **🔥 Permission Denied / Không Có Quyền**

**Nguyên nhân:** Firestore security rules chưa đúng
**Giải pháp:**

1. Cập nhật Firestore Rules theo hướng dẫn trên
2. Deploy rules và chờ 1-2 phút
3. Test lại

### **📊 No Orders Showing / Không Hiển Thị Đơn Hàng**

**Nguyên nhân:**

- Chưa có đơn hàng nào với `storeId` phù hợp
- Orders chưa có trường `storeId`
  **Giải pháp:**

1. Đặt đơn hàng test
2. Kiểm tra orders trong Firestore có trường `storeId`
3. Đảm bảo `storeId` của nhân viên trùng với orders

### **🌐 Real-time Updates Not Working / Cập Nhật Thời Gian Thực Không Hoạt Động**

**Nguyên nhân:** Firebase listeners chưa được thiết lập đúng
**Giải pháp:**

1. Check network connection
2. Refresh trang staff dashboard
3. Kiểm tra console errors

---

## 📞 **Support / Hỗ Trợ**

### **🎯 Quick Reference / Tham Khảo Nhanh**

#### **Important URLs:**

- **Customer App:** `/`
- **Staff Dashboard:** `/staff`
- **Admin Testing:** `/admin-testing`

#### **Test Accounts:**

- **Manager:** manager@ambassadors-coffee.com
- **Staff HCM:** staff@ambassadors-coffee.com
- **Staff Hanoi:** staff-hanoi@ambassadors-coffee.com

#### **Store IDs:**

- **embassy-hcm** - Embassy Ho Chi Minh City
- **embassy-hanoi** - Embassy Hanoi
- **embassy-danang** - Embassy Da Nang

---

## 🎉 **Conclusion / Kết Luận**

This complete system provides:
/ Hệ thống hoàn chỉnh này cung cấp:

✅ **Professional coffee shop management / Quản lý quán cà phê chuyên nghiệp**
✅ **Real-time order processing / Xử lý đơn hàng thời gian thực**  
✅ **Role-based access control / Kiểm soát truy cập theo vai trò**
✅ **Comprehensive customer experience / Trải nghiệm khách hàng toàn diện**
✅ **Production-ready deployment / Sẵn sàng triển khai thực tế**

**Ready for real-world coffee shop operations! ☕**
**Sẵn sàng cho hoạt động quán cà phê thực tế! ☕**
