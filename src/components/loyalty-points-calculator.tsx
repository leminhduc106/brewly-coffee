"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
// Removed fake data imports - now using real calculations only

const formSchema = z.object({
  orderTotal: z.coerce.number().min(1000, {
    message: 'Tổng đơn hàng phải ít nhất 1,000₫.',
  }),
});

export function LoyaltyPointsCalculator() {
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderTotal: 100000,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setEarnedPoints(null);
    
    // Real calculation: 1 point per 1000 VND
    const points = Math.round(values.orderTotal / 1000);
    setEarnedPoints(points);
    setIsLoading(false);
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row items-end gap-4"
        >
          <FormField
            control={form.control}
            name="orderTotal"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormLabel>Tổng đơn hàng (₫)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1000"
                    placeholder="VD: 100,000"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Đang tính...' : 'Tính điểm'}
          </Button>
        </form>
      </Form>

      {earnedPoints !== null && (
        <Card className="mt-4 bg-primary/10 border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-sm font-medium">You would earn:</p>
            <p className="font-headline text-4xl text-primary flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              {earnedPoints}
              <span className="font-body text-2xl text-primary/80">points</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
