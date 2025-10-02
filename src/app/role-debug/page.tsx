"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Shield, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RoleDebugPage() {
  const { user, userProfile, refreshUserProfile, loading } = useAuth();
  const { toast } = useToast();
  const [metaExists, setMetaExists] = useState<boolean | null>(null);
  const [metaData, setMetaData] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [directDocRole, setDirectDocRole] = useState<string | null>(null);

  const loadStatus = async () => {
    if (!user) return;
    setChecking(true);
    try {
      // meta/bootstrap
      const metaRef = doc(db, 'meta', 'bootstrap');
      const metaSnap = await getDoc(metaRef);
      if (metaSnap.exists()) {
        setMetaExists(true);
        setMetaData(metaSnap.data());
      } else {
        setMetaExists(false);
        setMetaData(null);
      }
      // direct user doc
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setDirectDocRole(userSnap.data().role);
      } else {
        setDirectDocRole('(no user doc)');
      }
    } catch (e:any) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Status check failed', description: e.message });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (user) loadStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleRefreshProfile = async () => {
    await refreshUserProfile();
    await loadStatus();
    toast({ title: 'Refreshed' });
  };

  const attemptBootstrap = async () => {
    if (!user) return;
    if (metaExists) {
      toast({ variant: 'destructive', title: 'Bootstrap already done' });
      return;
    }
    setPromoting(true);
    try {
      // Try elevate role first (rules allow only if bootstrap not complete)
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { role: 'admin' });
      // Create bootstrap marker
      const metaRef = doc(db, 'meta', 'bootstrap');
      await setDoc(metaRef, { firstAdmin: user.uid, createdAt: new Date().toISOString() });
      await refreshUserProfile();
      await loadStatus();
      toast({ title: 'Promoted to admin (bootstrap)' });
    } catch (e:any) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Bootstrap failed', description: e.message });
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5" /> Role / Bootstrap Debug
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!user && <p>Please sign in first.</p>}
          {user && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded border bg-white space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Auth UID</p>
                  <p className="text-sm font-mono break-all">{user.uid}</p>
                  <p className="text-xs font-semibold text-muted-foreground mt-2">Email</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div className="p-4 rounded border bg-white space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">userProfile.role (from context)</p>
                  <Badge variant="outline">{userProfile?.role || '(none)'}</Badge>
                  <p className="text-xs font-semibold text-muted-foreground">Direct Firestore role</p>
                  <Badge>{directDocRole || '(loading)'}</Badge>
                  <p className="text-xs font-semibold text-muted-foreground">Bootstrap meta exists?</p>
                  <Badge variant={metaExists ? 'default' : 'secondary'}>{metaExists ? 'YES' : 'NO'}</Badge>
                  {metaExists && metaData && (
                    <p className="text-xs text-muted-foreground">firstAdmin: {metaData.firstAdmin}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleRefreshProfile} disabled={checking} variant="outline" className="flex items-center gap-2">
                  {checking && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Refresh
                </Button>
                {!metaExists && (userProfile?.role === 'customer' || directDocRole === 'customer') && (
                  <Button onClick={attemptBootstrap} disabled={promoting} className="flex items-center gap-2">
                    {promoting && <RefreshCw className="w-4 h-4 animate-spin" />}
                    <KeyRound className="w-4 h-4" /> Become First Admin
                  </Button>
                )}
              </div>

              <div className="p-4 rounded border bg-muted/30 text-xs leading-relaxed">
                <p className="font-semibold mb-1">How this should work:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>First ever user signs up (only one user doc exists).</li>
                  <li>App updates their role to admin and writes meta/bootstrap.</li>
                  <li>Later users stay customer until approved.</li>
                </ol>
                <p className="mt-2 font-semibold">If self-promotion fails:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Rules may not have deployed (redeploy then refresh).</li>
                  <li>Existing meta/bootstrap doc blocks bootstrap (delete it then retry if safe).</li>
                  <li>User doc missing role=customer prior to update (rare race – use button again).</li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
