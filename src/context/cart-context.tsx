"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import type { Product, CartItem } from '@/lib/types';
import { db } from '@/lib/firebase';
import { useAuth } from './auth-context';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (product: Product, options: { size: string; milk: string; toppings?: string[] }) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  repeatOrder: (items: CartItem[]) => void;
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
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('brewly-cart');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const isInitialLoad = useRef(true);

  // Load cart from Firestore on login
  useEffect(() => {
    const loadUserCart = async () => {
      if (user) {
        const cartRef = doc(db, 'carts', user.uid);
        const snap = await getDoc(cartRef);
        let userCart: CartItem[] = [];
        if (snap.exists()) {
          userCart = snap.data().cart || [];
        }
        // Merge local cart with Firestore cart on first login
        const localCart = JSON.parse(localStorage.getItem('brewly-cart') || '[]');
        const mergedCart = mergeCarts(userCart, localCart);
        setCart(mergedCart);
        localStorage.removeItem('brewly-cart');
      }
    };
    if (user && isInitialLoad.current) {
      loadUserCart();
      isInitialLoad.current = false;
    }
    if (!user) {
      isInitialLoad.current = true;
    }
  }, [user]);

  // Save cart to Firestore for logged-in users, else localStorage
  useEffect(() => {
    if (user) {
      const cartRef = doc(db, 'carts', user.uid);
      setDoc(cartRef, { cart }, { merge: true });
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('brewly-cart', JSON.stringify(cart));
      }
    }
  }, [cart, user]);

  // Merge two carts (by product, size, milk)
  function mergeCarts(cartA: CartItem[], cartB: CartItem[]): CartItem[] {
    const merged: CartItem[] = [...cartA];
    cartB.forEach(itemB => {
      const match = merged.find(itemA =>
        itemA.id === itemB.id &&
        itemA.selectedSize === itemB.selectedSize &&
        itemA.selectedMilk === itemB.selectedMilk
      );
      if (match) {
        // Instead of summing, take the max quantity
        match.quantity = Math.max(match.quantity, itemB.quantity);
      } else {
        merged.push(itemB);
      }
    });
    return merged;
  }

  const addItem = (product: Product, options: { size: string; milk: string; toppings?: string[] }) => {
    setCart(prevCart => {
      // Check if an identical item is already in the cart (including toppings)
      const existingItem = prevCart.find(item => 
        item.id === product.id && 
        item.selectedSize === options.size && 
        item.selectedMilk === options.milk &&
        JSON.stringify(item.selectedToppings || []) === JSON.stringify(options.toppings || [])
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
          cartId: `${product.id}-${options.size}-${options.milk}-${Date.now()}`,
          quantity: 1,
          selectedSize: options.size,
          selectedMilk: options.milk,
          selectedToppings: options.toppings || [],
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

  // Repeat order: replace cart with given items
  const repeatOrder = (items: CartItem[]) => {
    // Remove cartId to avoid duplicates, regenerate new ones
    const newItems = items.map(item => ({
      ...item,
      cartId: `${item.id}-${item.selectedSize}-${item.selectedMilk}-${Date.now()}-${Math.random()}`
    }));
    setCart(newItems);
    setIsOpen(true);
  };

  return (
    <CartContext.Provider
      value={{ cart, isOpen, setIsOpen, addItem, removeItem, updateQuantity, clearCart, cartTotal, cartCount, repeatOrder }}
    >
      {children}
    </CartContext.Provider>
  );
};
