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

  // Smart defaults based on product category - no user selection needed
  const getDefaultOptions = () => {
    const defaultSize = product.options.size[0] || "Regular";
    const defaultMilk = product.options.milkTypes?.[0] || "Regular";
    
    return {
      size: defaultSize,
      milk: defaultMilk,
      toppings: [] // Start with no toppings for simplicity
    };
  };

  const handleQuickAdd = () => {
    const options = getDefaultOptions();
    addItem(product, options);
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
          <Button onClick={handleQuickAdd} size="lg">
            <Plus className="mr-2 h-5 w-5" /> Add
          </Button>
        </CardFooter>
      </Card>
      {/* Simplified Modal - Just for viewing details */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
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
        
        <div className="space-y-4">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={500}
            height={300}
            className="rounded-lg object-cover w-full aspect-[5/3]"
          />

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-2xl font-bold text-primary">
              {product.price.toLocaleString()}₫
            </p>
            <Button onClick={handleQuickAdd} size="lg" className="min-w-[120px]">
              <Plus className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
