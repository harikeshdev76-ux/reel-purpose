"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Size } from "@prisma/client";

export type CartItem = {
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string;
  price: number; // cents
  size: Size;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: Size) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CART_STORAGE_KEY = "rp-cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read persisted cart on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, []);

  // Persist on every change — but only after hydration, so the empty initial
  // state never clobbers a previously stored cart.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore write failures (storage unavailable / quota exceeded).
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const index = prev.findIndex(
        (i) => i.productId === item.productId && i.size === item.size,
      );
      if (index >= 0) {
        const next = [...prev];
        next[index] = {
          ...next[index],
          quantity: next[index].quantity + item.quantity,
        };
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string, size: Size) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
