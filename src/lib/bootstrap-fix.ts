import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Emergency fix: restore bootstrap admin role if it was accidentally reset
 */
export async function ensureBootstrapAdminRole(): Promise<void> {
  try {
    // Get the bootstrap metadata
    const metaRef = doc(db, 'meta', 'bootstrap');
    const metaSnap = await getDoc(metaRef);
    
    if (!metaSnap.exists()) {
      return; // No bootstrap user set
    }
    
    const { firstAdmin } = metaSnap.data();
    if (!firstAdmin) {
      return; // No bootstrap admin UID
    }
    
    // Check the bootstrap user's current role
    const userRef = doc(db, 'users', firstAdmin);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.warn('Bootstrap admin user document not found:', firstAdmin);
      return;
    }
    
    const userData = userSnap.data();
    if (userData.role !== 'admin') {
      console.log('🔧 Fixing bootstrap admin role regression...');
      
      // Restore admin role
      await updateDoc(userRef, { role: 'admin' });
      
      console.log('✅ Bootstrap admin role restored for:', firstAdmin);
    }
  } catch (error) {
    console.error('Failed to check/restore bootstrap admin:', error);
  }
}