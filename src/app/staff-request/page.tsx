"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, onSnapshot, getDoc } from 'firebase/firestore';
import { Shield, Coffee, RefreshCw, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { stores } from '@/lib/data';

interface StaffAccessRequestDoc {
  uid: string;
  email: string;
  currentRole: string;
  desiredRole: 'staff' | 'manager';
  desiredStore: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Simple request form: a normal user submits desired store + role.
 * Manager/Admin later approves in Firestore by setting role/storeId manually (future admin UI).
 */
export default function StaffAccessRequestPage() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [desiredRole, setDesiredRole] = useState<'staff' | 'manager'>('staff');
  const [storeId, setStoreId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [request, setRequest] = useState<StaffAccessRequestDoc | null>(null);
  const [checking, setChecking] = useState(false);

  const submitRequest = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Please sign in first' });
      return;
    }
    if (!storeId) {
      toast({ variant: 'destructive', title: 'Select store location' });
      return;
    }
    try {
      setSubmitting(true);
      await setDoc(doc(db, 'staffAccessRequests', user.uid), {
        uid: user.uid,
        email: user.email,
        currentRole: userProfile?.role || 'customer',
        desiredRole,
        desiredStore: storeId,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Request Submitted', description: 'Manager will review and approve.' });
    } catch (e: any) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Submission failed', description: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Subscribe to existing request if user logged in
  useEffect(() => {
    if (!user) { setRequest(null); return; }
    const ref = doc(db, 'staffAccessRequests', user.uid);
    let unsub: (() => void) | undefined;
    try {
      unsub = onSnapshot(ref, snap => {
        if (snap.exists()) {
          setRequest(snap.data() as StaffAccessRequestDoc);
        } else {
          setRequest(null);
        }
      }, (err) => {
        if (err.code === 'permission-denied') {
          // Fallback single get (may also fail) but provide nicer UI hint
            console.warn('Listener permission denied. Likely rules not deployed yet.', err);
        }
      });
    } catch (e) {
      console.warn('Failed to attach listener', e);
    }
    return () => { if (unsub) unsub(); };
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Coffee className="w-10 h-10 text-primary mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold">Staff Access Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user && (
            <p className="text-sm text-muted-foreground text-center">Please sign in first then reload this page.</p>
          )}
          {user && (
            <>
              <div>
                <Label>Email</Label>
                <Input value={user.email || ''} disabled />
              </div>
              <div>
                <Label>Desired Role</Label>
                <div className="flex gap-2 mt-1">
                  {(['staff','manager'] as const).map(r => (
                    <Button key={r} type="button" variant={desiredRole===r? 'default':'outline'} onClick={()=>setDesiredRole(r)}>{r}</Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Store ID</Label>
                <Select value={storeId} onValueChange={v=>setStoreId(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Example: embassy-hcm / embassy-hanoi / embassy-danang</p>
              </div>
              <Button disabled={submitting} className="w-full" onClick={submitRequest}>
                {submitting? 'Submitting...' : 'Submit Request'}
              </Button>
            </>
          )}
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm flex gap-2">
            <Shield className="w-4 h-4 text-amber-600 mt-0.5" />
            <p>After approval, a manager will assign your role. This prevents customers from self-creating staff accounts.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
