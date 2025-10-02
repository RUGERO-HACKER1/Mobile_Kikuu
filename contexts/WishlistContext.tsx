import React, { createContext, useContext, useMemo, useState } from 'react';

export type WishlistItem = {
  id: string;
  name: string;
  priceCents?: number;
  currency?: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
};
  
const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const add: WishlistContextValue['add'] = (item) => {
    setItems((prev) => (prev.find((p) => p.id === item.id) ? prev : [item, ...prev]));
  };
  const remove: WishlistContextValue['remove'] = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);
  const count = useMemo(() => items.length, [items]);

  const value = useMemo(() => ({ items, add, remove, clear, count }), [items, count]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};


