// Guest Checkout Service
// Handles orders for users without accounts (walk-in customers)

import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import { isValidPhoneNumber, sanitizePhoneNumber } from "./utils";
import type { CartItem, DeliveryAddress, Order } from "./types";

export interface GuestOrderData {
  guestInfo: {
    name: string;
    phoneNumber: string;
    email?: string; // Optional for receipt
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "cash" | "qr";
  deliveryOption: "pickup" | "delivery";
  storeId: string;
  deliveryAddress?: DeliveryAddress;
  specialInstructions?: string;
}

/**
 * Create an order for a guest user (no account required)
 * For in-store/walk-in customers
 */
export async function createGuestOrder(
  guestOrderData: GuestOrderData
): Promise<string> {
  try {
    const now = new Date().toISOString();

    // Build guest order object (using proper Order interface)
    const guestOrder: Omit<Order, "id"> & {
      isGuestOrder: boolean;
      guestInfo: GuestOrderData["guestInfo"];
    } = {
      // Use a special guest user ID that won't conflict with real users
      userId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isGuestOrder: true,
      guestInfo: guestOrderData.guestInfo,
      items: guestOrderData.items,
      subtotal: guestOrderData.subtotal,
      deliveryFee: guestOrderData.deliveryFee,
      total: guestOrderData.total,
      paymentMethod: guestOrderData.paymentMethod,
      deliveryOption: guestOrderData.deliveryOption,
      storeId: guestOrderData.storeId,
      status: "pending",
      createdAt: now,
      statusHistory: [
        {
          status: "pending",
          timestamp: now,
          updatedBy: "system",
          notes: `Guest order placed by ${guestOrderData.guestInfo.name}`,
        },
      ],
      estimatedTime: calculateGuestOrderPrepTime(guestOrderData.items),
    };

    // Add optional fields
    if (guestOrderData.deliveryAddress) {
      guestOrder.deliveryAddress = guestOrderData.deliveryAddress;
    }
    if (guestOrderData.specialInstructions) {
      guestOrder.specialInstructions = guestOrderData.specialInstructions;
    }

    // Save to Firestore
    const docRef = await addDoc(collection(db, "orders"), guestOrder);

    console.log("Guest order created:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating guest order:", error);
    console.error("Error details:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create guest order: ${error.message}`);
    }
    throw new Error("Failed to create guest order. Please try again.");
  }
}

/**
 * Calculate estimated prep time for guest orders
 */
function calculateGuestOrderPrepTime(items: CartItem[]): number {
  // Base time: 5 minutes
  let estimatedTime = 5;

  // Add 2 minutes per item
  estimatedTime += items.reduce((sum, item) => sum + item.quantity * 2, 0);

  // Cap at 30 minutes
  return Math.min(estimatedTime, 30);
}

/**
 * Validate guest order data
 */
export function validateGuestOrderData(data: Partial<GuestOrderData>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check guest info
  if (!data.guestInfo?.name?.trim()) {
    errors.push("Tên khách hàng không được để trống / Guest name is required");
  }

  if (!data.guestInfo?.phoneNumber?.trim()) {
    errors.push("Số điện thoại không được để trống / Phone number is required");
  } else if (!isValidPhoneNumber(data.guestInfo.phoneNumber)) {
    errors.push(
      "Số điện thoại không hợp lệ. Hỗ trợ số quốc tế (ví dụ: +441234567890) / Invalid phone. International numbers supported (e.g., +441234567890)"
    );
  }

  // Check items
  if (!data.items || data.items.length === 0) {
    errors.push("Giỏ hàng trống / Cart is empty");
  }

  // Check payment method (guest orders limited to cash/qr)
  if (data.paymentMethod && !["cash", "qr"].includes(data.paymentMethod)) {
    errors.push(
      "Khách vãng lai chỉ thanh toán bằng tiền mặt hoặc QR / Guest orders only support cash or QR payment"
    );
  }

  // Check delivery address if delivery option
  if (data.deliveryOption === "delivery") {
    if (!data.deliveryAddress) {
      errors.push(
        "Cần địa chỉ giao hàng / Delivery address required for delivery orders"
      );
    } else {
      const addr = data.deliveryAddress;
      if (
        !addr.recipientName ||
        !addr.phoneNumber ||
        !addr.streetAddress ||
        !addr.city
      ) {
        errors.push(
          "Thông tin địa chỉ giao hàng thiếu / Incomplete delivery address"
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate a guest order tracking code
 * Format: G-YYYYMMDD-XXXX (e.g., G-20250928-1234)
 */
export function generateGuestTrackingCode(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `G-${dateStr}-${random}`;
}

/**
 * Check if order can be placed as guest
 */
export function canPlaceGuestOrder(
  deliveryOption: "pickup" | "delivery",
  paymentMethod: string
): {
  allowed: boolean;
  reason?: string;
} {
  // Guest orders only for pickup or delivery
  // No points payment for guests
  if (paymentMethod === "points" || paymentMethod === "comp") {
    return {
      allowed: false,
      reason:
        "Thanh toán bằng điểm thưởng chỉ dành cho thành viên / Loyalty points payment requires membership",
    };
  }

  // All good
  return { allowed: true };
}

/**
 * Convert guest order to user order (when guest creates account)
 */
export async function convertGuestOrderToUserOrder(
  guestOrderId: string,
  userId: string
): Promise<void> {
  // This would be implemented when we add the "Create Account After Order" feature
  // For now, it's a placeholder
  console.log(`Converting guest order ${guestOrderId} to user ${userId}`);
  // Implementation: Update order document with real userId, remove isGuestOrder flag
}
