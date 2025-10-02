import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User } from './types';

const generateReferralCode = (uid: string): string => {
  // Generate a referral code based on user ID and random string
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const uidPart = uid.substring(0, 4).toUpperCase();
  return `${uidPart}${randomPart}`;
};

export const createUserProfile = async (uid: string, userData: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', uid);
    
    // Check if user already exists to preserve their role
    const existingUser = await getDoc(userRef);
    const existingRole = existingUser.exists() ? existingUser.data()?.role : null;
    
    // Generate referral code if not provided
    const referralCode = userData.referralCode || generateReferralCode(uid);
    
    // Only set default role if user doesn't exist or has no role
    const roleToSet = existingRole || userData.role || 'customer';
    
    await setDoc(userRef, {
      ...userData,
      uid,
      loyaltyPoints: existingUser.exists() ? existingUser.data()?.loyaltyPoints ?? 0 : 0,
      tier: existingUser.exists() ? existingUser.data()?.tier ?? 'Silver' : 'Silver',
      role: roleToSet, // Preserve existing role or use provided/default
      referralCode,
    }, { merge: true });
    
    // Only attempt bootstrap if this is a completely new user
    if (!existingUser.exists()) {
      await maybeBootstrapFirstAdmin(uid);
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Explicit staff/manager profile creator (must be called ONLY from secure server/admin context)
export const createStaffProfile = async (uid: string, staffData: Partial<User> & { role: 'staff' | 'manager' | 'admin'; storeId?: string }) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...staffData,
      uid,
      loyaltyPoints: staffData.loyaltyPoints ?? 0,
      tier: staffData.tier ?? 'Silver',
      employeeId: staffData.employeeId || `EMP${Date.now().toString().slice(-6)}`,
      hireDate: staffData.hireDate || new Date().toISOString().split('T')[0],
    }, { merge: true });
  } catch (error) {
    console.error('Error creating staff profile:', error);
    throw error;
  }
};

// Bootstrap: promote the very first created user to admin automatically
let bootstrapChecked = false;
async function maybeBootstrapFirstAdmin(currentUid: string) {
  if (bootstrapChecked) return; // avoid repeat
  bootstrapChecked = true;
  try {
    // Count how many user docs exist quickly by trying to get a known marker doc.
    // Simpler: create a special doc 'meta/bootstrap' once.
    const metaRef = doc(db, 'meta', 'bootstrap');
    const metaSnap = await getDoc(metaRef);
    if (metaSnap.exists()) return; // already bootstrapped
    // Elevate this user to admin BEFORE creating bootstrap marker (rules allow this only once)
    const userRef = doc(db, 'users', currentUid);
    await updateDoc(userRef, { role: 'admin' });
    // Now mark bootstrap done
    await setDoc(metaRef, { firstAdmin: currentUid, createdAt: new Date().toISOString() });
    console.info('Bootstrap: promoted first user to admin:', currentUid);
  } catch (e) {
    console.warn('Bootstrap admin check failed (non-fatal):', e);
  }
}

export const getUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<User>) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const isTodayUserBirthday = (birthday?: string): boolean => {
  if (!birthday) return false;
  
  const today = new Date();
  const birthDate = new Date(birthday);
  
  return (
    today.getMonth() === birthDate.getMonth() &&
    today.getDate() === birthDate.getDate()
  );
};

export const getNextBirthdayDays = (birthday?: string): number => {
  if (!birthday) return -1;
  
  const today = new Date();
  const birthDate = new Date(birthday);
  
  // Set this year for the birthday
  const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  
  // If birthday already passed this year, calculate for next year
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = thisYearBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};