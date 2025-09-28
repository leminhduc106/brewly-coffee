"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DeliveryAddressForm } from "@/components/delivery-address-form";
import {
  CreditCard,
  DollarSign,
  Gift,
  Loader2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  QrCode,
  MapPin,
  Store,
  Truck,
} from "lucide-react";
import type { CartItem, DeliveryAddress } from "@/lib/types";
import { sampleUser } from "@/lib/data";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// Type definitions for checkout steps and payment methods
type CheckoutStep = "review" | "delivery" | "payment" | "confirmation";
type PaymentMethod = "cash" | "qr" | "points";

// Simple loyalty points calculation: 1 point per 1000 VND spent
function calculateLoyaltyPoints(orderTotal: number): { loyaltyPoints: number } {
  return { loyaltyPoints: Math.round(orderTotal / 1000) };
}

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>("review");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qr");
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Delivery state
  const [deliveryOption, setDeliveryOption] = useState<"pickup" | "delivery">(
    "pickup"
  );
  const [deliveryAddress, setDeliveryAddress] =
    useState<DeliveryAddress | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Calculate final total including delivery fee
  const finalTotal = cartTotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be signed in to place an order.",
      });
      router.push("/login");
      return;
    }

    if (!user.uid) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Invalid user session. Please log in again.",
      });
      router.push("/login");
      return;
    }

    // Validate delivery address if delivery option is selected
    if (deliveryOption === "delivery") {
      if (!deliveryAddress) {
        toast({
          variant: "destructive",
          title: "Delivery Address Required",
          description: "Please provide delivery address for home delivery.",
        });
        return;
      }

      // Basic validation for required fields
      if (
        !deliveryAddress.recipientName?.trim() ||
        !deliveryAddress.phoneNumber?.trim() ||
        !deliveryAddress.streetAddress?.trim() ||
        !deliveryAddress.ward?.trim() ||
        !deliveryAddress.district ||
        !deliveryAddress.city
      ) {
        toast({
          variant: "destructive",
          title: "Incomplete Address",
          description: "Please complete all required delivery address fields.",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Prepare order data with delivery information
      const orderData: {
        userId: string;
        items: CartItem[];
        total: number;
        subtotal: number;
        deliveryFee: number;
        deliveryOption: "pickup" | "delivery";
        deliveryAddress?: DeliveryAddress;
        paymentMethod: PaymentMethod;
        createdAt: string;
        status: string;
        pointsUsed?: number;
      } = {
        userId: user.uid,
        items: cart,
        total: finalTotal,
        subtotal: cartTotal,
        deliveryFee: deliveryFee,
        deliveryOption: deliveryOption,
        paymentMethod,
        createdAt: Timestamp.now().toDate().toISOString(),
        status: "completed",
      };

      // Add delivery address if delivery option is selected
      if (deliveryOption === "delivery" && deliveryAddress) {
        orderData.deliveryAddress = deliveryAddress;
      }

      // Points payment: check and deduct points
      if (paymentMethod === "points") {
        // 1 point = 1,000 VND (so 100 points = 100,000 VND)
        const pointsCost = Math.round(finalTotal / 1000);
        // For now, use sampleUser data since we don't have real user documents yet
        // In production, you'd fetch from Firestore user documents
        const userPoints = sampleUser.loyaltyPoints;

        if (userPoints < pointsCost) {
          toast({
            variant: "destructive",
            title: "Insufficient Points",
            description: "You do not have enough points to pay for this order.",
          });
          setIsLoading(false);
          return;
        }

        // Note: In production, you'd deduct points from the user's Firestore document here
        // For now, we'll just record that points were used
        orderData.pointsUsed = pointsCost;
      }

      // Save order to Firestore
      const orderDoc = await addDoc(collection(db, "orders"), orderData);
      setOrderId(orderDoc.id);

      // Calculate loyalty points (for earning new points)
      const pointsResult = calculateLoyaltyPoints(finalTotal);

      // Note: In production, you'd update user loyalty points in Firestore here
      // For now, we'll just show the points earned in the success message

      toast({
        title: "Order Placed Successfully!",
        description:
          paymentMethod === "points"
            ? `You used ${orderData.pointsUsed} points.`
            : `You've earned ${pointsResult.loyaltyPoints} loyalty points.`,
      });

      // Store payment method, delivery option and userId in localStorage for confirmation step
      if (typeof window !== "undefined") {
        window.localStorage.setItem("paymentMethod", paymentMethod);
        window.localStorage.setItem("deliveryOption", deliveryOption);
        window.localStorage.setItem("userId", user.uid);
      }

      clearCart();
      setStep("confirmation");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast({
        variant: "destructive",
        title: "Order Failed",
        description:
          "There was a problem placing your order. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "review":
        return <ReviewStep cart={cart} cartTotal={cartTotal} />;
      case "delivery":
        return (
          <DeliveryAddressForm
            deliveryOption={deliveryOption}
            onDeliveryOptionChange={setDeliveryOption}
            deliveryAddress={deliveryAddress}
            onDeliveryAddressChange={setDeliveryAddress}
            deliveryFee={deliveryFee}
            onDeliveryFeeChange={setDeliveryFee}
          />
        );
      case "payment":
        return (
          <PaymentStep
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            userPoints={sampleUser.loyaltyPoints}
            orderTotal={finalTotal}
            subtotal={cartTotal}
            deliveryFee={deliveryFee}
            deliveryOption={deliveryOption}
          />
        );
      case "confirmation":
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
          {step === "confirmation"
            ? "Thank you for your order!"
            : step === "review"
            ? "Review your items before proceeding."
            : step === "delivery"
            ? "Choose pickup or delivery option."
            : step === "payment"
            ? "Select your preferred payment method."
            : "Complete your purchase in just a few steps."}
        </p>
      </div>

      <Card className="shadow-2xl rounded-3xl">
        <CardContent className="p-8">
          {renderStep()}

          <Separator className="my-8" />

          <div className="flex justify-between items-center">
            {/* Back buttons */}
            {step === "delivery" && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep("review")}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Review
              </Button>
            )}

            {step === "payment" && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep("delivery")}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Delivery
              </Button>
            )}

            {/* Spacer for single button layouts */}
            {(step === "confirmation" || step === "review") && <div />}

            {/* Forward/Action buttons */}
            {step === "review" && (
              <Button
                size="lg"
                className="w-full"
                onClick={() => setStep("delivery")}
              >
                Continue to Delivery <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}

            {step === "delivery" && (
              <Button
                size="lg"
                onClick={() => {
                  // Validate delivery step before proceeding
                  if (deliveryOption === "delivery") {
                    if (
                      !deliveryAddress ||
                      !deliveryAddress.recipientName?.trim() ||
                      !deliveryAddress.phoneNumber?.trim() ||
                      !deliveryAddress.streetAddress?.trim() ||
                      !deliveryAddress.ward?.trim() ||
                      !deliveryAddress.district ||
                      !deliveryAddress.city
                    ) {
                      toast({
                        variant: "destructive",
                        title: "Incomplete Address",
                        description:
                          "Please complete all required delivery address fields.",
                      });
                      return;
                    }
                  }
                  setStep("payment");
                }}
              >
                Proceed to Payment <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}

            {step === "payment" && (
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
                {isLoading ? "Processing..." : `Thanh toán ${finalTotal.toLocaleString()}₫`}
              </Button>
            )}

            {step === "confirmation" && (
              <Button
                size="lg"
                className="w-full"
                onClick={() => router.push("/menu")}
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
              <div className="flex flex-col">
                <p className="font-semibold text-lg">{item.name}</p>
                <p className="text-sm text-muted-foreground">({item.nameVi})</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {item.quantity} x {item.price.toLocaleString()}₫
              </p>
            </div>
          </div>
          <p className="font-semibold text-lg">
            {(item.quantity * item.price).toLocaleString()}₫
          </p>
        </div>
      ))}
    </div>
    <Separator className="my-6" />
    <div className="flex justify-between text-xl font-bold">
      <span>Total</span>
      <span>{cartTotal.toLocaleString()}₫</span>
    </div>
  </div>
);

const PaymentStep = ({
  paymentMethod,
  setPaymentMethod,
  userPoints,
  orderTotal,
  subtotal,
  deliveryFee,
  deliveryOption,
}: {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  userPoints: number;
  orderTotal: number;
  subtotal: number;
  deliveryFee: number;
  deliveryOption: "pickup" | "delivery";
}) => {
  const pointsCost = Math.round(orderTotal / 100); // 1 point per 100 VND
  const canPayWithPoints = userPoints >= pointsCost;

  return (
    <div>
      <h2 className="font-headline text-3xl mb-6">Select Payment Method</h2>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-3">
          Tổng Kết Đơn Hàng / Order Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal / Tạm tính:</span>
            <span>{subtotal.toLocaleString()}₫</span>
          </div>
          <div className="flex justify-between">
            <span>
              {deliveryOption === "delivery"
                ? "Delivery Fee / Phí giao hàng:"
                : "Pickup / Nhận tại quầy:"}
            </span>
            <span>
              {deliveryFee > 0 ? `${deliveryFee.toLocaleString()}₫` : "Miễn phí"}
            </span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total / Tổng cộng:</span>
            <span className="text-primary">{orderTotal.toLocaleString()}₫</span>
          </div>
        </div>
      </div>

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
              {deliveryOption === "delivery"
                ? "Pay with cash when your order is delivered."
                : "Pay with cash at the counter when you pick up your order."}
            </p>
          </div>
        </Label>
        <Label
          htmlFor="points"
          className={`flex items-center gap-4 p-4 border rounded-2xl ${
            canPayWithPoints
              ? "cursor-pointer hover:bg-muted/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
              : "cursor-not-allowed opacity-50"
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
              {pointsCost.toLocaleString()} points needed. You have{" "}
              {userPoints.toLocaleString()}.
            </p>
          </div>
        </Label>
      </RadioGroup>
    </div>
  );
};

const ConfirmationStep = ({ orderId }: { orderId: string | null }) => {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod>("qr");
  const [storedDeliveryOption, setStoredDeliveryOption] = useState<
    "pickup" | "delivery"
  >("pickup");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMethod = window.localStorage.getItem(
        "paymentMethod"
      ) as PaymentMethod;
      if (storedMethod) setPaymentMethodState(storedMethod);

      const storedDelivery = window.localStorage.getItem("deliveryOption") as
        | "pickup"
        | "delivery";
      if (storedDelivery) setStoredDeliveryOption(storedDelivery);
    }
  }, []);

  useEffect(() => {
    if (paymentMethod === "qr" && orderId) {
      const paymentLink = `https://brewly-coffee.com/pay?orderId=${orderId}`;
      QRCode.toDataURL(paymentLink)
        .then((url: string) => setQrUrl(url))
        .catch(() => setQrUrl(""));
    }
  }, [paymentMethod, orderId]);

  return (
    <div className="text-center py-8">
      <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
      <h2 className="font-headline text-4xl">Cảm ơn! / Thank You!</h2>
      <p className="text-lg text-muted-foreground mt-2">
        Đơn hàng của bạn đã được đặt thành công.
      </p>
      <p className="text-sm text-muted-foreground">
        Your order has been placed successfully.
      </p>
      {orderId && (
        <p className="text-xl font-semibold mt-4">
          Order ID: <span className="text-primary">{orderId}</span>
        </p>
      )}

      {/* Delivery/Pickup Information */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg max-w-md mx-auto">
        {storedDeliveryOption === "pickup" ? (
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <Store className="h-5 w-5 text-primary" />
              <p className="font-semibold">Store Pickup / Nhận tại quầy</p>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              📍 123 Nguyễn Huệ, Q1, TP.HCM
            </p>
            <p className="text-sm text-muted-foreground">
              ⏰ Ready in 15-20 minutes / Sẵn sàng sau 15-20 phút
            </p>
          </div>
        ) : (
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-5 w-5 text-primary" />
              <p className="font-semibold">Home Delivery / Giao hàng</p>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              🚚 Estimated delivery: 30-45 minutes
            </p>
            <p className="text-sm text-muted-foreground">
              📱 You'll receive updates via SMS/phone
            </p>
          </div>
        )}
      </div>

      {/* Payment Instructions */}
      {paymentMethod === "qr" && (
        <div className="mt-6">
          <p className="font-semibold">
            Show this QR code at the counter to pay:
          </p>
          <div className="flex justify-center mt-4">
            {qrUrl ? (
              <img src={qrUrl} alt="QR Code" className="w-32 h-32" />
            ) : (
              <span>Generating QR code...</span>
            )}
          </div>
        </div>
      )}
      {paymentMethod === "cash" && (
        <p className="mt-6 font-semibold">
          {storedDeliveryOption === "pickup"
            ? "Pay with cash at the counter when you pick up your order."
            : "Pay with cash when your order is delivered to you."}
        </p>
      )}
      {paymentMethod === "points" && (
        <p className="mt-6 font-semibold">
          Paid with loyalty points. Thank you for being a loyal customer!
        </p>
      )}
    </div>
  );
};
