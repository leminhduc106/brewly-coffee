
"use client";

import { useState } from 'react';
import { allProducts } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('all');

  const categories = ['all', 'coffee', 'tea', 'pastries'];

  const filteredProducts =
    activeTab === 'all'
      ? allProducts
      : allProducts.filter((p) => p.category === activeTab);

  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl text-primary">Our Menu</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our wide selection of handcrafted beverages and freshly baked pastries.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col items-center mb-12">
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize px-6">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
