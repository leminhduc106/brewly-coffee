"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { createStaffProfile, getUserProfile } from '@/lib/user-service';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, UserPlus, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface StaffAccessRequest {
  uid: string;
  email: string;
  currentRole: string;
  desiredRole: 'staff' | 'manager';
  desiredStore: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
  updatedAt?: any;
}

export default function StaffRequestsAdminPage() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<StaffAccessRequest[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Subscribe to requests
  useEffect(() => {
    const qReq = query(collection(db, 'staffAccessRequests'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(qReq, snap => {
      const data: StaffAccessRequest[] = [];
      snap.forEach(d => data.push({ ...(d.data() as any) }));
      setRequests(data);
    });
    return () => unsub();
  }, []);

  const handleApprove = async (r: StaffAccessRequest) => {
    setProcessing(r.uid);
    try {
      // Create or update staff profile
      await createStaffProfile(r.uid, {
        role: r.desiredRole,
        storeId: r.desiredStore,
        email: r.email,
        name: r.email.split('@')[0], // fallback name
      });
      await updateDoc(doc(db, 'staffAccessRequests', r.uid), {
        status: 'approved',
        updatedAt: new Date().toISOString(),
      });
      toast({ title: 'Approved', description: `${r.email} is now ${r.desiredRole}` });
    } catch (e: any) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Approval failed', description: e.message });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (r: StaffAccessRequest) => {
    setProcessing(r.uid);
    try {
      await updateDoc(doc(db, 'staffAccessRequests', r.uid), {
        status: 'rejected',
        updatedAt: new Date().toISOString(),
      });
      toast({ title: 'Rejected', description: `${r.email} request marked rejected` });
    } catch (e: any) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Rejection failed', description: e.message });
    } finally {
      setProcessing(null);
    }
  };

  const handleRefreshProfiles = async () => {
    setRefreshing(true);
    try {
      // Force re-fetch of user profiles to ensure UI (outside) picks up changes; placeholder action.
      await Promise.all(requests.map(r => getUserProfile(r.uid)));
      toast({ title: 'Profiles refreshed' });
    } catch (e:any) {
      toast({ variant: 'destructive', title: 'Refresh failed', description: e.message });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['manager','admin']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" /> Staff Access Requests
            </h1>
            <Button onClick={handleRefreshProfiles} disabled={refreshing} variant="outline" className="flex items-center gap-2">
              {refreshing && <RefreshCw className="w-4 h-4 animate-spin" />}
              Refresh Profiles
            </Button>
          </div>
          {requests.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No access requests.
              </CardContent>
            </Card>
          )}
          <div className="space-y-4">
            {requests.map(r => (
              <Card key={r.uid} className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <UserPlus className="w-4 h-4" /> {r.email}
                    <Badge variant={r.status === 'pending' ? 'secondary' : r.status === 'approved' ? 'default' : 'outline'}>
                      {r.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline">Current: {r.currentRole}</Badge>
                    <Badge className="bg-primary">Requested: {r.desiredRole}</Badge>
                    <Badge variant="outline">Store: {r.desiredStore}</Badge>
                  </div>
                  {r.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={() => handleApprove(r)} disabled={!!processing} className="flex-1 flex items-center gap-1">
                        {processing === r.uid ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(r)} disabled={!!processing} className="flex-1 flex items-center gap-1">
                        {processing === r.uid ? <RefreshCw className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Reject
                      </Button>
                    </div>
                  )}
                  {r.status === 'approved' && (
                    <p className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Role granted</p>
                  )}
                  {r.status === 'rejected' && (
                    <p className="text-red-600 flex items-center gap-1"><XCircle className="w-4 h-4" /> Request rejected</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
