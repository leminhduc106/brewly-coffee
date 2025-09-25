"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Product, CartItem } from '@/lib/types';

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (product: Product, options: { size: string; milk: string }) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product: Product, options: { size: string; milk: string }) => {
    setCart(prevCart => {
      // Check if an identical item is already in the cart
      const existingItem = prevCart.find(item => 
        item.id === product.id && 
        item.selectedSize === options.size && 
        item.selectedMilk === options.milk
      );

      if (existingItem) {
        // If it exists, just increase quantity
        return prevCart.map(item =>
          item.cartId === existingItem.cartId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If not, add as a new item
        const newCartItem: CartItem = {
          ...product,
          cartId: `${product.id}-${options.size}-${options.milk}-${Date.now()}`, // create a unique ID
          quantity: 1,
          selectedSize: options.size,
          selectedMilk: options.milk,
        };
        return [...prevCart, newCartItem];
      }
    });
    setIsOpen(true);
  };

  const removeItem = (cartId: string) => {
    setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.cartId === cartId ? { ...item, quantity } : item
        )
      );
    }
  };
  
  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, isOpen, setIsOpen, addItem, removeItem, updateQuantity, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
