"use client";

import React from 'react';
import { allProducts } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';

interface RecommendationsProps {
  currentProduct?: Product;
  userFavorites?: string[];
  maxRecommendations?: number;
}

export function Recommendations({ 
  currentProduct, 
  userFavorites = [], 
  maxRecommendations = 3 
}: RecommendationsProps) {
  const getRecommendations = (): Product[] => {
    let recommendations: Product[] = [];

    // If viewing a specific product, recommend similar category items
    if (currentProduct) {
      recommendations = allProducts.filter(
        (p) => p.id !== currentProduct.id && p.category === currentProduct.category
      );
    }

    // If user has favorites, recommend items from the same categories
    if (userFavorites.length > 0) {
      const favoriteProducts = allProducts.filter(p => userFavorites.includes(p.id));
      const favoriteCategories = [...new Set(favoriteProducts.map(p => p.category))];
      
      const categoryRecommendations = allProducts.filter(
        (p) => favoriteCategories.includes(p.category) && !userFavorites.includes(p.id)
      );
      
      recommendations = [...recommendations, ...categoryRecommendations];
    }

    // If no specific recommendations, show popular items (first few products)
    if (recommendations.length === 0) {
      recommendations = allProducts.slice(0, maxRecommendations);
    }

    // Remove duplicates and limit results
    const uniqueRecommendations = Array.from(
      new Map(recommendations.map(item => [item.id, item])).values()
    );

    return uniqueRecommendations.slice(0, maxRecommendations);
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <h3 className="font-headline text-3xl md:text-4xl text-center mb-12 text-primary">
          You Might Also Like
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}