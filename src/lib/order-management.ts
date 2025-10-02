import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import type { Order, CartItem, DeliveryAddress, OrderStatusUpdate } from './types';

/**
 * Create a new order in Firebase
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
    
    const order: Omit<Order, 'id'> = {
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
      deliveryAddress: orderData.deliveryAddress,
      specialInstructions: orderData.specialInstructions,
      estimatedTime: calculateEstimatedPrepTime(orderData.items)
    };

    // Add pointsUsed if it exists
    if (orderData.pointsUsed) {
      (order as any).pointsUsed = orderData.pointsUsed;
    }

    const docRef = await addDoc(collection(db, "orders"), order);
    console.log("Order created with ID:", docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order. Please try again.");
  }
}

/**
 * Update order status (used by staff dashboard)
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
    
    const statusUpdate: OrderStatusUpdate = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      updatedBy: staffId,
      notes
    };

    const updateData: any = {
      status: newStatus,
      statusHistory: arrayUnion(statusUpdate),
      updatedAt: new Date().toISOString()
    };

    if (estimatedTime) {
      updateData.estimatedTime = estimatedTime;
    }

    if (newStatus === "preparing") {
      updateData.assignedTo = staffId;
    }

    await updateDoc(orderRef, updateData);
    console.log(`Order ${orderId} updated to ${newStatus}`);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}

/**
 * Get real-time orders for a specific store
 * Simplified to avoid complex index requirements
 */
export function subscribeToStoreOrders(
  storeId: string,
  statusFilter?: Order['status'][],
  callback?: (orders: Order[]) => void
) {
  const ordersRef = collection(db, "orders");
  // Simple query - just filter by storeId
  const q = query(ordersRef, where("storeId", "==", storeId));

  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      const orderData = { id: doc.id, ...doc.data() } as Order;
      
      // Apply status filter in memory
      if (!statusFilter || statusFilter.includes(orderData.status)) {
        orders.push(orderData);
      }
    });

    // Sort by creation time in memory (newest first for staff)
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(`Loaded ${orders.length} orders for store ${storeId}`);
    callback?.(orders);
  }, (error) => {
    console.error("Error subscribing to store orders:", error);
    callback?.([]);
  });
}

/**
 * Get order statistics for a store
 * Simplified to avoid complex queries
 */
export async function getStoreOrderStats(
  storeId: string,
  dateRange?: { start: Date; end: Date }
): Promise<{
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  statusBreakdown: Record<Order['status'], number>;
}> {
  try {
    const ordersRef = collection(db, "orders");
    // Simple query - just get all orders for this store
    const q = query(ordersRef, where("storeId", "==", storeId));

    const querySnapshot = await getDocs(q);
    let orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });

    // Filter by date range in memory if provided
    if (dateRange) {
      orders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= dateRange.start && orderDate <= dateRange.end;
      });
    }

    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      totalRevenue: orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total, 0),
      averageOrderValue: orders.length > 0 
        ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length 
        : 0,
      statusBreakdown: {
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        ready: orders.filter(o => o.status === 'ready').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
      }
    };

    return stats;
  } catch (error) {
    console.error("Error getting store order stats:", error);
    throw new Error("Failed to load order statistics");
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
      statusHistory: arrayUnion(statusUpdate),
      updatedAt: new Date().toISOString(),
      cancellationReason: reason
    });

    console.log(`Order ${orderId} cancelled by ${cancelledBy}`);
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw new Error("Failed to cancel order");
  }
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

/**
 * Delete an order (admin only)
 */
export async function deleteOrder(orderId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "orders", orderId));
    console.log(`Order ${orderId} deleted`);
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error("Failed to delete order");
  }
}