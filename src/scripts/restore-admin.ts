import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Emergency script to restore admin role to the bootstrap user
 * Run this in the browser console on your app
 */
export async function restoreBootstrapAdmin() {
  const bootstrapUid = "sLIFvrUvNcWz9dH8VCqYAPwUrs43"; // Your UID
  
  try {
    console.log('Restoring admin role for bootstrap user:', bootstrapUid);
    
    const userRef = doc(db, 'users', bootstrapUid);
    await updateDoc(userRef, { 
      role: 'admin' 
    });
    
    console.log('✅ Admin role restored successfully!');
    console.log('Please refresh the page to see the changes.');
    
    return { success: true, message: 'Admin role restored' };
  } catch (error) {
    console.error('❌ Failed to restore admin role:', error);
    return { success: false, error };
  }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🔧 Admin restoration script loaded');
  console.log('Run: restoreBootstrapAdmin() to fix your admin role');
  (window as any).restoreBootstrapAdmin = restoreBootstrapAdmin;
}