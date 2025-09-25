"use client";

import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const {
    isOpen,
    setIsOpen,
    cart,
    removeItem,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {cart.length > 0 ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-6 py-6">
                {cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                        data-ai-hint="product image"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 rounded-md border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.cartId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="flex flex-col sm:flex-col gap-4 border-t bg-background p-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="grid gap-2">
                <Button size="lg" className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    clearCart();
                    setIsOpen(false);
                  }}
                >
                  Clear Cart
                </Button>
              </div>
            </SheetFooter>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-6">
            <h3 className="font-headline text-2xl">Your cart is empty</h3>
            <p className="text-muted-foreground">
              Looks like you haven't added anything yet.
            </p>
            <SheetClose asChild>
              <Button>Continue Shopping</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
