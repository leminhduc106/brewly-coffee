import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  arrayUnion,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  limit,
  getDoc
} from 'firebase/firestore';
import type { Order, CartItem, DeliveryAddress, OrderStatusUpdate } from './types';

/**
 * Create a new customer order
 */
export async function createOrder(orderData: {
  userId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cash' | 'qr' | 'points';
  deliveryOption: 'pickup' | 'delivery';
  storeId: string;
  deliveryAddress?: DeliveryAddress;
  pointsUsed?: number;
  specialInstructions?: string;
}): Promise<string> {
  try {
    const now = new Date().toISOString();
    
    // Build order object without undefined fields (Firebase doesn't allow undefined)
    const order: any = {
      userId: orderData.userId,
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      deliveryOption: orderData.deliveryOption,
      storeId: orderData.storeId,
      status: 'pending',
      createdAt: now,
      statusHistory: [{
        status: 'pending',
        timestamp: now,
        updatedBy: 'system',
        notes: 'Order placed by customer'
      }],
      estimatedTime: calculateEstimatedPrepTime(orderData.items)
    };

    // Only add optional fields if they have values (avoid undefined in Firebase)
    if (orderData.deliveryAddress) {
      order.deliveryAddress = orderData.deliveryAddress;
    }
    
    if (orderData.specialInstructions) {
      order.specialInstructions = orderData.specialInstructions;
    }
    
    if (orderData.pointsUsed) {
      order.pointsUsed = orderData.pointsUsed;
    }

    const docRef = await addDoc(collection(db, "orders"), order);
    console.log("Order created:", docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order. Please try again.");
  }
}

/**
 * Get orders for a specific store - simplified query to avoid index issues
 */
export function subscribeToStoreOrders(
  storeId: string,
  callback: (orders: Order[]) => void
) {
  try {
    const ordersRef = collection(db, "orders");
    // Simple query - just storeId, no complex filtering
    const q = query(
      ordersRef,
      where("storeId", "==", storeId),
      limit(50) // Limit to recent orders
    );

    return onSnapshot(q, (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((doc) => {
        const orderData = { id: doc.id, ...doc.data() } as Order;
        orders.push(orderData);
      });
      
      // Sort by creation time client-side
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log(`Loaded ${orders.length} orders for store ${storeId}`);
      callback(orders);
    }, (error) => {
      console.error("Error subscribing to orders:", error);
      callback([]);
    });
  } catch (error) {
    console.error("Error setting up order subscription:", error);
    callback([]);
    return () => {}; // Return empty unsubscribe function
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: Order['status'],
  staffId: string,
  notes?: string,
  estimatedTime?: number
): Promise<void> {
  try {
    const orderRef = doc(db, "orders", orderId);
    
    // Create status update object, only include notes if it's not undefined
    const statusUpdate: OrderStatusUpdate = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      updatedBy: staffId
    };

    // Only add notes if it's provided and not undefined
    if (notes && notes.trim() !== '') {
      statusUpdate.notes = notes;
    }

    const updateData: any = {
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    // Only add statusHistory if we have a valid statusUpdate
    if (statusUpdate) {
      updateData.statusHistory = arrayUnion(statusUpdate);
    }

    if (estimatedTime && estimatedTime > 0) {
      updateData.estimatedTime = estimatedTime;
    }

    if (newStatus === "preparing") {
      updateData.assignedTo = staffId;
    }

    console.log(`Updating order ${orderId} to ${newStatus}...`);
    await updateDoc(orderRef, updateData);
    console.log(`Order ${orderId} successfully updated to ${newStatus}`);
  } catch (error) {
    console.error("Error updating order status:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    } else {
      throw new Error("Failed to update order status: Unknown error");
    }
  }
}

/**
 * Get basic order statistics - simplified to avoid complex queries
 */
export async function getOrderStatistics(storeId: string) {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("storeId", "==", storeId),
      limit(100) // Get recent orders only
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });

    // Filter for today's orders client-side
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= today && orderDate < tomorrow;
    });

    const stats = {
      totalOrders: todayOrders.length,
      pending: todayOrders.filter(o => o.status === 'pending').length,
      confirmed: todayOrders.filter(o => o.status === 'confirmed').length,
      preparing: todayOrders.filter(o => o.status === 'preparing').length,
      ready: todayOrders.filter(o => o.status === 'ready').length,
      completed: todayOrders.filter(o => o.status === 'completed').length,
      cancelled: todayOrders.filter(o => o.status === 'cancelled').length,
      totalRevenue: todayOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total, 0),
      averageOrderValue: todayOrders.length > 0 
        ? todayOrders.reduce((sum, o) => sum + o.total, 0) / todayOrders.length 
        : 0
    };

    return stats;
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    // Return default stats on error
    return {
      totalOrders: 0,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    };
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(
  orderId: string, 
  cancelledBy: string, 
  reason: string
): Promise<void> {
  try {
    const orderRef = doc(db, "orders", orderId);
    
    const statusUpdate: OrderStatusUpdate = {
      status: 'cancelled',
      timestamp: new Date().toISOString(),
      updatedBy: cancelledBy,
      notes: `Order cancelled: ${reason}`
    };

    await updateDoc(orderRef, {
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
      statusHistory: arrayUnion(statusUpdate)
    });

    console.log(`Order ${orderId} cancelled by ${cancelledBy}`);
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw new Error("Failed to cancel order");
  }
}

/**
 * Get a specific order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() } as Order;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

/**
 * Get user's order history - simplified query
 */
export async function getUserOrderHistory(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      limit(20) // Recent orders only
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    // Sort by creation time
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return orders;
  } catch (error) {
    console.error("Error fetching user order history:", error);
    throw error;
  }
}

/**
 * Calculate order statistics for a user
 */
export function calculateOrderStats(orders: Order[]) {
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(order => order.status === "completed").length;
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
  
  return {
    totalOrders,
    totalSpent,
    completedOrders,
    averageOrderValue,
    completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
  };
}

/**
 * Calculate estimated preparation time based on order items
 */
function calculateEstimatedPrepTime(items: CartItem[]): number {
  let totalMinutes = 0;
  
  items.forEach(item => {
    // Base time by category
    let itemTime = 3; // Default 3 minutes
    
    if (item.category === "ca-phe-truyen-thong") itemTime = 4;
    else if (item.category === "ca-phe-pha-may") itemTime = 2;
    else if (item.category === "tra-tra-sua") itemTime = 5;
    else if (item.category === "da-xay-smoothie") itemTime = 6;
    else if (item.category === "mon-an-kem") itemTime = 8;
    
    // Add time per quantity
    totalMinutes += itemTime * item.quantity;
  });
  
  // Minimum 5 minutes, maximum 30 minutes
  return Math.max(5, Math.min(30, totalMinutes));
}

