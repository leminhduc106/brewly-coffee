import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import type { Order, CartItem, DeliveryAddress, User } from './types';

/**
 * Staff order creation with special handling
 * Based on real restaurant POS systems like Square, Toast, etc.
 */
export async function createStaffOrder(
  staffUser: User,
  orderData: {
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentMethod: 'cash' | 'qr' | 'points' | 'comp'; // Added 'comp' for staff comps
    deliveryOption: 'pickup' | 'delivery';
    deliveryAddress?: DeliveryAddress;
    pointsUsed?: number;
    specialInstructions?: string;
    customerNote?: string; // For staff to note who this is for
    isStaffOrder?: boolean;
  }
): Promise<string> {
  try {
    const now = new Date().toISOString();
    
    // Build order object without undefined fields
    const staffOrder: any = {
      userId: staffUser.uid,
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      deliveryOption: orderData.deliveryOption,
      storeId: staffUser.storeId || "embassy-hcm", // Use staff's store
      status: 'confirmed', // Staff orders skip pending and go straight to confirmed
      createdAt: now,
      statusHistory: [{
        status: 'confirmed',
        timestamp: now,
        updatedBy: staffUser.uid,
        notes: `Staff order created by ${staffUser.name} (${staffUser.role})`
      }],
      estimatedTime: calculateEstimatedPrepTime(orderData.items),
      isStaffOrder: true, // Flag to identify staff orders
      staffMember: {
        uid: staffUser.uid,
        name: staffUser.name,
        role: staffUser.role,
        employeeId: staffUser.employeeId
      }
    };

    // Only add optional fields if they have values
    if (orderData.deliveryAddress) {
      staffOrder.deliveryAddress = orderData.deliveryAddress;
    }
    
    if (orderData.specialInstructions) {
      staffOrder.specialInstructions = orderData.specialInstructions;
    }
    
    if (orderData.customerNote) {
      staffOrder.customerNote = orderData.customerNote;
    }
    
    if (orderData.pointsUsed) {
      staffOrder.pointsUsed = orderData.pointsUsed;
    }

    const docRef = await addDoc(collection(db, "orders"), staffOrder);
    console.log("Staff order created:", docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating staff order:", error);
    throw new Error("Failed to create staff order. Please try again.");
  }
}

/**
 * Check if user can place staff orders
 */
export function canPlaceStaffOrders(user: User | null): boolean {
  if (!user) return false;
  return ['staff', 'manager', 'admin'].includes(user.role);
}

/**
 * Get special staff order options
 */
export function getStaffOrderOptions() {
  return {
    paymentMethods: [
      { value: 'cash', label: 'Cash Payment', icon: '💵' },
      { value: 'qr', label: 'QR Payment', icon: '📱' },
      { value: 'points', label: 'Loyalty Points', icon: '⭐' },
      { value: 'comp', label: 'Complimentary (Free)', icon: '🎁' }, // Staff comp option
    ],
    deliveryOptions: [
      { value: 'pickup', label: 'Store Pickup', description: 'Collect from store counter' },
      { value: 'delivery', label: 'Staff Delivery', description: 'Deliver to office/break room' },
    ]
  };
}

/**
 * Calculate estimated preparation time
 */
function calculateEstimatedPrepTime(items: CartItem[]): number {
  let totalMinutes = 0;
  
  items.forEach(item => {
    let itemTime = 3; // Default 3 minutes
    
    if (item.category === "ca-phe-truyen-thong") itemTime = 4;
    else if (item.category === "ca-phe-pha-may") itemTime = 2;
    else if (item.category === "tra-tra-sua") itemTime = 5;
    else if (item.category === "da-xay-smoothie") itemTime = 6;
    else if (item.category === "mon-an-kem") itemTime = 8;
    
    totalMinutes += itemTime * item.quantity;
  });
  
  return Math.max(5, Math.min(30, totalMinutes));
}

/**
 * Get staff order history
 */
export async function getStaffOrderHistory(staffUserId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", staffUserId),
      where("isStaffOrder", "==", true),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error("Error fetching staff order history:", error);
    return [];
  }
}

/**
 * Update staff order for special handling
 */
export async function updateStaffOrder(
  orderId: string,
  updates: {
    status?: Order['status'];
    notes?: string;
    customerNote?: string;
  },
  staffId: string
): Promise<void> {
  try {
    const orderRef = doc(db, "orders", orderId);
    
    const updateData: any = {};
    
    if (updates.status) {
      updateData.status = updates.status;
      updateData.statusHistory = [{
        status: updates.status,
        timestamp: new Date().toISOString(),
        updatedBy: staffId,
        notes: updates.notes || `Status updated to ${updates.status}`
      }];
    }
    
    if (updates.customerNote) {
      updateData.customerNote = updates.customerNote;
    }

    await updateDoc(orderRef, updateData);
    console.log(`Staff order ${orderId} updated`);
  } catch (error) {
    console.error("Error updating staff order:", error);
    throw new Error("Failed to update staff order");
  }
}