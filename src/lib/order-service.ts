import { db } from './firebase';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import type { Order } from './types';

/**
 * Fetch user's order history from Firestore
 */
export async function getUserOrderHistory(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return orders;
  } catch (error) {
    console.error("Error fetching user order history:", error);
    throw error;
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

