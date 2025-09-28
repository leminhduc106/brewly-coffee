"use client";

import React from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import { Plus, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [selectedSize, setSelectedSize] = React.useState(
    product.options.size[0] || "M"
  );
  const [selectedMilk, setSelectedMilk] = React.useState(
    product.options.milkTypes?.[0] || "Dairy"
  );
  const [selectedToppings, setSelectedToppings] = React.useState<string[]>([]);

  const handleAddToCart = () => {
    addItem(product, {
      size: selectedSize,
      milk: selectedMilk,
      toppings: selectedToppings,
    });
  };

  return (
    <Dialog>
      <Card className="w-full overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group rounded-3xl relative flex flex-col h-full">
        <DialogTrigger asChild>
          <div>
            <CardHeader className="p-0 cursor-pointer">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={600}
                height={400}
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={`${product.category} ${product.name
                  .split(" ")[0]
                  .toLowerCase()}`}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
                aria-label={
                  isFavorite(product.id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <Heart
                  className={`h-6 w-6 ${
                    isFavorite(product.id)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400"
                  } ${isFavorite(product.id) ? "" : "fill-none"}`}
                />
              </Button>
            </CardHeader>
            <CardContent className="p-6 cursor-pointer flex-1 flex flex-col">
              <CardTitle className="font-headline text-xl flex items-start justify-between gap-2 mb-3">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="truncate">{product.name}</span>
                  <span className="text-sm font-normal text-muted-foreground truncate">
                    ({product.nameVi})
                  </span>
                </div>
                {isFavorite(product.id) && (
                  <Heart className="h-4 w-4 text-red-500 fill-red-500 flex-shrink-0" />
                )}
              </CardTitle>
              <div className="text-sm text-muted-foreground flex-1 overflow-hidden">
                <p
                  className="mb-1 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: "1.4em",
                    maxHeight: "2.8em",
                  }}
                >
                  {product.description}
                </p>
                <p className="text-xs italic truncate">
                  ({product.descriptionVi})
                </p>
              </div>
            </CardContent>
          </div>
        </DialogTrigger>
        <CardFooter className="flex items-center justify-between p-6 pt-0">
          <p className="text-2xl font-bold text-primary">
            {product.price.toLocaleString()}₫
          </p>
          <Button onClick={handleAddToCart} size="lg">
            <Plus className="mr-2 h-5 w-5" /> Add
          </Button>
        </CardFooter>
      </Card>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl flex items-center gap-2">
            <div className="flex flex-col">
              <span>{product.name}</span>
              <span className="text-lg font-normal text-muted-foreground">
                ({product.nameVi})
              </span>
            </div>
            {isFavorite(product.id) && (
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2 space-y-2">
            <p>{product.description}</p>
            <p className="italic">({product.descriptionVi})</p>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 px-2 sm:px-4 max-h-[70vh] overflow-y-auto">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={400}
            className="rounded-lg object-cover w-full aspect-[3/2] mb-2"
          />
          <div className="space-y-4">
            {/* Size Selector */}
            <div>
              <label className="block font-medium mb-1">Size</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {product.options.size.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            {/* Milk Selector */}
            {product.options.milkTypes &&
              product.options.milkTypes.length > 0 && (
                <div>
                  <label className="block font-medium mb-1">Milk</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={selectedMilk}
                    onChange={(e) => setSelectedMilk(e.target.value)}
                  >
                    {product.options.milkTypes.map((milk) => (
                      <option key={milk} value={milk}>
                        {milk}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            {/* Toppings Selector */}
            {product.options.toppings &&
              product.options.toppings.length > 0 && (
                <div>
                  <label className="block font-medium mb-1">Toppings</label>
                  <div className="flex flex-wrap gap-2">
                    {product.options.toppings.map((topping) => (
                      <label
                        key={topping}
                        className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          value={topping}
                          checked={selectedToppings.includes(topping)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedToppings([
                                ...selectedToppings,
                                topping,
                              ]);
                            } else {
                              setSelectedToppings(
                                selectedToppings.filter((t) => t !== topping)
                              );
                            }
                          }}
                        />
                        {topping}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            <Button className="mt-6 w-full" size="lg" onClick={handleAddToCart}>
              <Plus className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
