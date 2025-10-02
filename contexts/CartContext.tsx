import React, { createContext, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  currency: string; // e.g., RWF, USD
  image?: any;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalCents: number;
  currency: string | null;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem: CartContextValue['addItem'] = (item, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === item.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem: CartContextValue['removeItem'] = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity: CartContextValue['updateQuantity'] = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items]
  );

  const subtotalCents = useMemo(
    () => items.reduce((sum, it) => sum + it.priceCents * it.quantity, 0),
    [items]
  );

  const currency = items.length > 0 ? items[0].currency : null;

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotalCents,
    currency,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    Alert.alert('Cart Error', 'useCart must be used within a CartProvider');
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};

export const formatMoney = (cents: number, currency: string | null) => {
  const amount = (cents / 100).toFixed(2);
  if (!currency) return amount;
  return `${amount} ${currency}`;
};


