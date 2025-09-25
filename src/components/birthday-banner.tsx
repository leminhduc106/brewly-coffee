"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Cake, Sparkles, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BirthdayBannerProps {
  userName?: string;
  onClaimReward?: () => void;
  isRewardClaimed?: boolean;
  nextBirthdayDays?: number;
}

export function BirthdayBanner({ 
  userName, 
  onClaimReward, 
  isRewardClaimed = false,
  nextBirthdayDays
}: BirthdayBannerProps) {
  const { toast } = useToast();

  const handleClaimReward = () => {
    if (onClaimReward) {
      onClaimReward();
    }
    toast({
      title: "🎉 Happy Birthday!",
      description: "You've earned 100 bonus loyalty points and a free pastry! The reward has been added to your account.",
      duration: 5000,
    });
  };

  // Birthday banner (shows on user's actual birthday)
  if (nextBirthdayDays === 0) {
    return (
      <Card className="mb-6 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border-pink-200 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Cake className="h-8 w-8 text-pink-600" />
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-pink-900 dark:text-pink-100 mb-1">
                  🎂 Happy Birthday{userName ? `, ${userName}` : ''}! 🎂
                </h2>
                <p className="text-pink-700 dark:text-pink-300">
                  It's your special day! Enjoy a free pastry and 100 bonus points on us.
                </p>
              </div>
            </div>
            {!isRewardClaimed && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-sm">100 Points</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gift className="h-4 w-4 text-pink-600" />
                    <span className="font-medium text-sm">Free Pastry</span>
                  </div>
                </div>
                <Button 
                  onClick={handleClaimReward}
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Claim Reward
                </Button>
              </div>
            )}
            {isRewardClaimed && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Gift className="mr-1 h-3 w-3" />
                Reward Claimed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Upcoming birthday banner (shows 3 days before birthday)
  if (nextBirthdayDays && nextBirthdayDays <= 3 && nextBirthdayDays > 0) {
    return (
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Cake className="h-6 w-6 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                🎈 Your birthday is coming up!
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {nextBirthdayDays === 1 
                  ? "Tomorrow you'll get 100 bonus points and a free pastry!" 
                  : `In ${nextBirthdayDays} days you'll get 100 bonus points and a free pastry!`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}