import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface RoleAuditEntry {
  actor: string;           // User ID who made the change
  actorName: string;       // Display name of actor
  target: string;          // User ID who was changed
  targetName: string;      // Display name of target
  oldRole?: string;        // Previous role (if available)
  newRole: string;         // New role assigned
  at: string;              // ISO timestamp
  method: 'admin-ui' | 'script' | 'bootstrap';  // How the change was made
}

/**
 * Log a role change to the audit collection
 */
export async function logRoleChange(entry: RoleAuditEntry): Promise<void> {
  try {
    const auditRef = doc(collection(db, 'roleAuditLog'));
    await setDoc(auditRef, {
      ...entry,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Failed to log role change:', error);
    // Don't throw - logging failure shouldn't block the role change
  }
}

/**
 * Get recent role change audit logs
 */
export async function getRecentRoleChanges(limit: number = 50) {
  try {
    const { query, orderBy, getDocs } = await import('firebase/firestore');
    const auditRef = collection(db, 'roleAuditLog');
    const q = query(auditRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (RoleAuditEntry & { id: string })[];
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }
}