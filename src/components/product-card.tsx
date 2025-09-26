
"use client";

import React from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { Plus, Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';

interface ProductCardProps {
  product: Product;
}

// Simple local favorites for Spark plan (can be replaced with Firestore logic)
function useFavorites() {
  const [favorites, setFavorites] = React.useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    }
    return [];
  });

  React.useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [selectedSize, setSelectedSize] = React.useState(product.options.size[0] || 'M');
  const [selectedMilk, setSelectedMilk] = React.useState(product.options.milkTypes?.[0] || 'Dairy');
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
      <Card className="w-full overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group rounded-3xl relative">
        <DialogTrigger asChild>
          <div>
            <CardHeader className="p-0 cursor-pointer">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={600}
                height={400}
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={`${product.category} ${product.name.split(' ')[0].toLowerCase()}`}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
                aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`h-6 w-6 ${isFavorite(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'} ${isFavorite(product.id) ? '' : 'fill-none'}`} />
              </Button>
            </CardHeader>
            <CardContent className="p-6 cursor-pointer">
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                {product.name}
                {isFavorite(product.id) && <Heart className="h-4 w-4 text-red-500 fill-red-500" />}
              </CardTitle>
              <p className="mt-2 text-base text-muted-foreground h-12">
                {product.description}
              </p>
            </CardContent>
          </div>
        </DialogTrigger>
        <CardFooter className="flex items-center justify-between p-6 pt-0">
          <p className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
          <Button onClick={handleAddToCart} size="lg">
            <Plus className="mr-2 h-5 w-5" /> Add
          </Button>
        </CardFooter>
      </Card>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl flex items-center gap-2">
            {product.name}
            {isFavorite(product.id) && <Heart className="h-4 w-4 text-red-500 fill-red-500" />}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            {product.description}
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
                onChange={e => setSelectedSize(e.target.value)}
              >
                {product.options.size.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            {/* Milk Selector */}
            {product.options.milkTypes && product.options.milkTypes.length > 0 && (
              <div>
                <label className="block font-medium mb-1">Milk</label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={selectedMilk}
                  onChange={e => setSelectedMilk(e.target.value)}
                >
                  {product.options.milkTypes.map(milk => (
                    <option key={milk} value={milk}>{milk}</option>
                  ))}
                </select>
              </div>
            )}
            {/* Toppings Selector */}
            {product.options.toppings && product.options.toppings.length > 0 && (
              <div>
                <label className="block font-medium mb-1">Toppings</label>
                <div className="flex flex-wrap gap-2">
                  {product.options.toppings.map(topping => (
                    <label key={topping} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg">
                      <input
                        type="checkbox"
                        value={topping}
                        checked={selectedToppings.includes(topping)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedToppings([...selectedToppings, topping]);
                          } else {
                            setSelectedToppings(selectedToppings.filter(t => t !== topping));
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
