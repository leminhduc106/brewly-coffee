"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Copy, Gift, Users, Share2 } from 'lucide-react';

interface ReferralSystemProps {
  userReferralCode?: string;
  totalReferrals?: number;
  earnedPoints?: number;
}

export function ReferralSystem({ 
  userReferralCode = "BREW123", 
  totalReferrals = 5, 
  earnedPoints = 250 
}: ReferralSystemProps) {
  const [referralCode, setReferralCode] = useState('');
  const { toast } = useToast();

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userReferralCode);
    toast({
      title: "Copied!",
      description: "Your referral code has been copied to clipboard.",
    });
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Brewly Coffee - Get Free Points!',
        text: `Use my referral code ${userReferralCode} and get bonus loyalty points at Brewly Coffee!`,
        url: `${window.location.origin}?ref=${userReferralCode}`,
      });
    } else {
      copyReferralCode();
    }
  };

  const applyReferralCode = () => {
    if (!referralCode.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Please enter a referral code.",
      });
      return;
    }

    // Simulate referral code application
    toast({
      title: "Success!",
      description: `Referral code ${referralCode} applied! You'll get bonus points on your next order.`,
    });
    setReferralCode('');
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Your Referral Code */}
      <Card className="shadow-lg rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            Your Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-primary/10 rounded-2xl">
            <p className="text-3xl font-bold font-mono text-primary mb-2">
              {userReferralCode}
            </p>
            <p className="text-sm text-muted-foreground">
              Share this code with friends to earn points!
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={copyReferralCode} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy Code
            </Button>
            <Button onClick={shareReferral} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold text-primary">{totalReferrals}</span>
              </div>
              <p className="text-xs text-muted-foreground">Friends Referred</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Gift className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold text-primary">{earnedPoints}</span>
              </div>
              <p className="text-xs text-muted-foreground">Points Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apply Referral Code */}
      <Card className="shadow-lg rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Have a Referral Code?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referral-input">Enter friend's referral code</Label>
            <Input
              id="referral-input"
              placeholder="e.g., BREW456"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className="font-mono"
            />
          </div>
          
          <Button onClick={applyReferralCode} className="w-full">
            Apply Code
          </Button>

          <div className="bg-muted/30 rounded-2xl p-4 space-y-2">
            <h4 className="font-semibold text-sm">How it works:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Enter a friend's referral code</li>
              <li>• Get 50 bonus points on your next order</li>
              <li>• Your friend gets 100 points too!</li>
              <li>• Start earning your own referral rewards</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}