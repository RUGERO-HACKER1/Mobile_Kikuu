import React, { createContext, useContext, useMemo, useState } from 'react';

export type PendingReview = {
  orderId: string;
  productId: string;
  productName: string;
};

type ReviewsContextValue = {
  pending: PendingReview[];
  addMany: (items: PendingReview[]) => void;
  markReviewed: (orderId: string, productId: string) => void;
  count: number;
};

const ReviewsContext = createContext<ReviewsContextValue | undefined>(undefined);

export const ReviewsProvider = ({ children }) => {
  const [pending, setPending] = useState<PendingReview[]>([]);

  const addMany: ReviewsContextValue['addMany'] = (items) => {
    setPending((prev) => {
      const existingKeys = new Set(prev.map((p) => `${p.orderId}:${p.productId}`));
      const merged = [...prev];
      for (const it of items) {
        const key = `${it.orderId}:${it.productId}`;
        if (!existingKeys.has(key)) merged.push(it);
      }
      return merged;
    });
  };

  const markReviewed: ReviewsContextValue['markReviewed'] = (orderId, productId) => {
    setPending((prev) => prev.filter((p) => !(p.orderId === orderId && p.productId === productId)));
  };

  const count = useMemo(() => pending.length, [pending]);

  const value = useMemo(() => ({ pending, addMany, markReviewed, count }), [pending, count]);
  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
};

export const useReviews = () => {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider');
  return ctx;
};


