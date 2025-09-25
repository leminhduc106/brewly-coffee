
"use client";

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
import { Plus } from 'lucide-react';
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

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    const defaultOptions = {
      size: product.options.size[0] || 'M',
      milk: product.options.milkTypes?.[0] || 'Dairy',
    };
    addItem(product, defaultOptions);
  };

  return (
    <Dialog>
      <Card className="w-full overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group rounded-3xl">
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
            </CardHeader>
            <CardContent className="p-6 cursor-pointer">
              <CardTitle className="font-headline text-2xl">{product.name}</CardTitle>
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
          <DialogTitle className="font-headline text-3xl">{product.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            {product.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <Image
                src={product.imageUrl}
                alt={product.name}
                width={600}
                height={400}
                className="rounded-lg object-cover w-full aspect-[3/2]"
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
