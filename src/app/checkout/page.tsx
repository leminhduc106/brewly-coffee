'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard,
  DollarSign,
  Gift,
  Loader2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  QrCode,
} from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { sampleUser } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';

// Type definitions for checkout steps and payment methods
type CheckoutStep = 'review' | 'payment' | 'confirmation';
type PaymentMethod = 'cash' | 'qr' | 'points';

// Simple loyalty points calculation: 10 points per dollar spent
function calculateLoyaltyPoints(orderTotal: number): { loyaltyPoints: number } {
  return { loyaltyPoints: Math.round(orderTotal * 10) };
}

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>('review');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr');
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be signed in to place an order.',
      });
      router.push('/login');
      return;
    }

    if (!user.uid) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'Invalid user session. Please log in again.',
      });
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Prepare order data
      const orderData: {
        userId: string;
        items: CartItem[];
        total: number;
        paymentMethod: PaymentMethod;
        createdAt: string;
        status: string;
        pointsUsed?: number;
      } = {
        userId: user.uid,
        items: cart,
        total: cartTotal,
        paymentMethod,
        createdAt: Timestamp.now().toDate().toISOString(),
        status: 'completed',
      };

      // Points payment: check and deduct points
      if (paymentMethod === 'points') {
        const pointsCost = Math.round(cartTotal * 100);
        // For now, use sampleUser data since we don't have real user documents yet
        // In production, you'd fetch from Firestore user documents
        const userPoints = sampleUser.loyaltyPoints;
        
        if (userPoints < pointsCost) {
          toast({
            variant: 'destructive',
            title: 'Insufficient Points',
            description: 'You do not have enough points to pay for this order.',
          });
          setIsLoading(false);
          return;
        }
        
        // Note: In production, you'd deduct points from the user's Firestore document here
        // For now, we'll just record that points were used
        orderData.pointsUsed = pointsCost;
      }

      // Save order to Firestore
      const orderDoc = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(orderDoc.id);

      // Calculate loyalty points (for earning new points)
      const pointsResult = calculateLoyaltyPoints(cartTotal);

      // Note: In production, you'd update user loyalty points in Firestore here
      // For now, we'll just show the points earned in the success message

      toast({
        title: 'Order Placed Successfully!',
        description:
          paymentMethod === 'points'
            ? `You used ${orderData.pointsUsed} points.`
            : `You've earned ${pointsResult.loyaltyPoints} loyalty points.`,
      });

      // Store payment method and userId in localStorage for confirmation step
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('paymentMethod', paymentMethod);
        window.localStorage.setItem('userId', user.uid);
      }
      
      clearCart();
      setStep('confirmation');
    } catch (error) {
      console.error('Failed to place order:', error);
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: 'There was a problem placing your order. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'review':
        return <ReviewStep cart={cart} cartTotal={cartTotal} />;
      case 'payment':
        return (
          <PaymentStep
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            userPoints={sampleUser.loyaltyPoints}
            orderTotal={cartTotal}
          />
        );
      case 'confirmation':
        return <ConfirmationStep orderId={orderId} />;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl text-primary">
          Checkout
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {step === 'confirmation'
            ? 'Thank you for your order!'
            : 'Complete your purchase in just a few steps.'}
        </p>
      </div>

      <Card className="shadow-2xl rounded-3xl">
        <CardContent className="p-8">
          {renderStep()}

          <Separator className="my-8" />

          <div className="flex justify-between items-center">
            {step === 'payment' && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep('review')}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Review
              </Button>
            )}

            {step !== 'confirmation' && step !== 'review' && (
              <div /> // Placeholder for spacing
            )}
            
            {step === 'review' && (
              <Button size="lg" className="w-full" onClick={() => setStep('payment')}>
                Proceed to Payment <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}

            {step === 'payment' && (
              <Button
                size="lg"
                onClick={handlePlaceOrder}
                disabled={isLoading || cart.length === 0}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-5 w-5" />
                )}
                {isLoading ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
              </Button>
            )}

            {step === 'confirmation' && (
              <Button
                size="lg"
                className="w-full"
                onClick={() => router.push('/menu')}
              >
                Continue Shopping
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const ReviewStep = ({
  cart,
  cartTotal,
}: {
  cart: CartItem[];
  cartTotal: number;
}) => (
  <div>
    <h2 className="font-headline text-3xl mb-6">Review Your Order</h2>
    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
      {cart.map((item) => (
        <div key={item.cartId} className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={64}
              height={64}
              className="rounded-lg object-cover"
              data-ai-hint="product image"
            />
            <div>
              <p className="font-semibold text-lg">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {item.quantity} x ${item.price.toFixed(2)}
              </p>
            </div>
          </div>
          <p className="font-semibold text-lg">
            ${(item.quantity * item.price).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
    <Separator className="my-6" />
    <div className="flex justify-between text-xl font-bold">
      <span>Total</span>
      <span>${cartTotal.toFixed(2)}</span>
    </div>
  </div>
);

const PaymentStep = ({
  paymentMethod,
  setPaymentMethod,
  userPoints,
  orderTotal,
}: {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  userPoints: number;
  orderTotal: number;
}) => {
  const pointsCost = Math.round(orderTotal * 100); // 100 points per dollar
  const canPayWithPoints = userPoints >= pointsCost;

  return (
    <div>
      <h2 className="font-headline text-3xl mb-6">Select Payment Method</h2>
      <RadioGroup
        value={paymentMethod}
        onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
        className="space-y-4"
      >
        <Label
          htmlFor="qr"
          className="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-muted/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
        >
          <RadioGroupItem value="qr" id="qr" />
          <QrCode className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <p className="font-semibold text-lg">Pay with QR Code</p>
            <p className="text-sm text-muted-foreground">
              Scan the code at the counter to pay securely.
            </p>
          </div>
        </Label>
        <Label
          htmlFor="cash"
          className="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-muted/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
        >
          <RadioGroupItem value="cash" id="cash" />
          <DollarSign className="h-8 w-8 text-primary" />
           <div className="flex-1">
            <p className="font-semibold text-lg">Pay with Cash</p>
            <p className="text-sm text-muted-foreground">
              Pay with cash at the counter when you pick up your order.
            </p>
          </div>
        </Label>
        <Label
          htmlFor="points"
          className={`flex items-center gap-4 p-4 border rounded-2xl ${
            canPayWithPoints
              ? 'cursor-pointer hover:bg-muted/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary'
              : 'cursor-not-allowed opacity-50'
          }`}
        >
          <RadioGroupItem
            value="points"
            id="points"
            disabled={!canPayWithPoints}
          />
          <Gift className="h-8 w-8 text-primary" />
           <div className="flex-1">
            <p className="font-semibold text-lg">Pay with Points</p>
            <p className="text-sm text-muted-foreground">
              {pointsCost.toLocaleString()} points needed. You have{' '}
              {userPoints.toLocaleString()}.
            </p>
          </div>
        </Label>
      </RadioGroup>
    </div>
  );
};

const ConfirmationStep = ({ orderId }: { orderId: string | null }) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod>('qr');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMethod = window.localStorage.getItem('paymentMethod') as PaymentMethod;
      if (storedMethod) setPaymentMethodState(storedMethod);
    }
  }, []);

  useEffect(() => {
    if (paymentMethod === 'qr' && orderId) {
      const paymentLink = `https://brewly-coffee.com/pay?orderId=${orderId}`;
      QRCode.toDataURL(paymentLink)
        .then((url: string) => setQrUrl(url))
        .catch(() => setQrUrl(''));
    }
  }, [paymentMethod, orderId]);

  return (
    <div className="text-center py-8">
      <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
      <h2 className="font-headline text-4xl">Thank You!</h2>
      <p className="text-lg text-muted-foreground mt-2">
        Your order has been placed successfully.
      </p>
      {orderId && (
        <p className="text-xl font-semibold mt-4">
          Order ID: <span className="text-primary">{orderId}</span>
        </p>
      )}
      {paymentMethod === 'qr' && (
        <div className="mt-6">
          <p className="font-semibold">Show this QR code at the counter to pay:</p>
          <div className="flex justify-center mt-4">
            {qrUrl ? (
              <img src={qrUrl} alt="QR Code" className="w-32 h-32" />
            ) : (
              <span>Generating QR code...</span>
            )}
          </div>
        </div>
      )}
      {paymentMethod === 'cash' && (
        <p className="mt-6 font-semibold">Pay with cash at the counter when you pick up your order.</p>
      )}
      {paymentMethod === 'points' && (
        <p className="mt-6 font-semibold">Paid with loyalty points. Thank you for being a loyal customer!</p>
      )}
    </div>
  );
};

