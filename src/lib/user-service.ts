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
    
    // Generate referral code if not provided
    const referralCode = userData.referralCode || generateReferralCode(uid);
    
    await setDoc(userRef, {
      uid,
      loyaltyPoints: 0,
      tier: 'Silver',
      referralCode,
      ...userData,
    }, { merge: true });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

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