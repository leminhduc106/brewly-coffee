
'use client';

import { useState } from 'react';
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
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

type CheckoutStep = 'review' | 'payment' | 'confirmation';
type PaymentMethod = 'cash' | 'qr' | 'points';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

const generationConfig = {
  temperature: 0.2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
  threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

async function calculateLoyaltyPoints(
  orderTotal: number,
  userId: string,
  pastOrderHistory: string
): Promise<{ loyaltyPoints: number }> {
  const prompt = `You are a loyalty point system for a coffee shop. Your response must be a valid JSON object.

  Given the order total, user ID, and past order history, you will respond with the number of loyalty points the user should receive.
  The JSON output should be in the format: { "loyaltyPoints": <number> }.

  RULES:
  - If the user has no prior order history (pastOrderHistory is an empty array '[]'), give them 10 points for every dollar spent.
  - If the user has a prior order history, calculate the average of the last 3 order totals. Award 10 points for every dollar spent over their average, and 5 points for every dollar spent under their average.
  - The final point value must be a whole integer. Round any decimal results.

  DATA:
  - Order Total: ${orderTotal}
  - User ID: ${userId}
  - Past Order History (JSON array of amounts): ${pastOrderHistory}
  `;

  try {
    const result = await model.generateContent(prompt, {
    });
    const response = result.response;
    const text = response.text();
    // Clean the response to ensure it's valid JSON
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedResult = JSON.parse(cleanedText);
    return {
      loyaltyPoints: Math.round(parsedResult.loyaltyPoints || 0),
    };
  } catch (error) {
    console.error('AI Loyalty Points calculation failed:', error);
    // Fallback to a simple calculation if AI fails
    return { loyaltyPoints: Math.round(orderTotal * 5) };
  }
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
     if (!API_KEY) {
      toast({
        variant: 'destructive',
        title: 'Configuration Error',
        description:
          'The AI feature is not configured. Please set the API key.',
      });
      setIsLoading(false);
      return;
    }


    setIsLoading(true);
    try {
      // Simulate API call to place order
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save order to Firestore
      const orderDoc = await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: cart,
        total: cartTotal,
        paymentMethod,
        createdAt: Timestamp.now().toDate().toISOString(),
        status: 'completed',
      });
      setOrderId(orderDoc.id);

      // AI-powered loyalty points calculation
      // Fetch user's real past orders for loyalty calculation
      const ordersSnapshot = await getDocs(query(collection(db, 'orders'), where('userId', '==', user.uid)));
  const pastOrderTotals = JSON.stringify(ordersSnapshot.docs.map((doc: any) => doc.data().total));
      const pointsResult = await calculateLoyaltyPoints(
        cartTotal,
        user.uid,
        pastOrderTotals
      );

      toast({
        title: 'Order Placed Successfully!',
        description: `You've earned ${pointsResult.loyaltyPoints} loyalty points.`,
      });

      clearCart();
      setStep('confirmation');
    } catch (error) {
      console.error('Failed to place order:', error);
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description:
          'There was a problem placing your order. Please try again.',
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

const ConfirmationStep = ({ orderId }: { orderId: string | null }) => (
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
    <p className="mt-4">
      Please show this confirmation at the counter to pick up your order.
    </p>
  </div>
);

