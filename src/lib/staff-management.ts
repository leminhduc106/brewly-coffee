import { db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import type { StaffMember, User } from './types';

/**
 * Get staff members for a specific store
 */
export async function getStoreStaff(storeId: string): Promise<StaffMember[]> {
  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("storeId", "==", storeId),
      where("role", "in", ["staff", "manager"])
    );
    
    const querySnapshot = await getDocs(q);
    const staff: StaffMember[] = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      staff.push({
        uid: doc.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        storeId: userData.storeId,
        employeeId: userData.employeeId,
        avatar: userData.avatar,
        isOnline: false, // We'll implement online status later
        currentOrders: [] // We'll populate this from active orders
      });
    });
    
    return staff;
  } catch (error) {
    console.error("Error fetching store staff:", error);
    throw error;
  }
}

/**
 * Get staff member by ID
 */
export async function getStaffMember(staffId: string): Promise<User | null> {
  try {
    const userRef = doc(db, "users", staffId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { uid: userSnap.id, ...userSnap.data() } as User;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching staff member:", error);
    throw error;
  }
}

/**
 * Check if user has staff permissions for a store
 */
export function hasStaffPermissions(user: User | null, storeId: string): boolean {
  if (!user) return false;
  
  const staffRoles = ['staff', 'manager', 'admin'];
  return staffRoles.includes(user.role) && user.storeId === storeId;
}

/**
 * Check if user has manager permissions
 */
export function hasManagerPermissions(user: User | null): boolean {
  if (!user) return false;
  
  const managerRoles = ['manager', 'admin'];
  return managerRoles.includes(user.role);
}

/**
 * Calculate estimated preparation time based on order items
 */
export function calculateEstimatedPrepTime(items: any[]): number {
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