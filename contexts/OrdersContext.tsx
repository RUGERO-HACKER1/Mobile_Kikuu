import React, { createContext, useContext, useMemo, useState } from 'react';

// --- UPDATED TYPES ---
// Use a union type for all possible statuses to make it robust
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type OrderItem = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  quantity: number;
};

export type Order = {
  id: string;
  createdAt: string; // ISO date
  status: OrderStatus; // Use the new union type
  items: OrderItem[];
  subtotalCents: number;
  currency: string;
};

type OrdersContextValue = {
  orders: Order[];
  addOrder: (order: Order) => void;
  clearOrders: () => void;
  // --- ADMIN FUNCTION ADDED ---
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
};

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: 'Delivered',
    items: [
      { id: 'p1', name: 'Wireless Earbuds', priceCents: 499900, currency: 'RWF', quantity: 1 },
      { id: 'p3', name: 'Portable Speaker', priceCents: 755000, currency: 'RWF', quantity: 1 },
    ],
    subtotalCents: 499900 + 755000,
    currency: 'RWF',
  },
  {
    id: 'ORD-1002',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'Processing',
    items: [
      { id: 'p2', name: 'Smartwatch', priceCents: 1999900, currency: 'RWF', quantity: 1 },
    ],
    subtotalCents: 1999900,
    currency: 'RWF',
  },
  {
    id: 'ORD-1003',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    status: 'Cancelled',
    items: [
      { id: 'p4', name: 'USB-C Cable', priceCents: 120000, currency: 'RWF', quantity: 2 },
    ],
    subtotalCents: 240000,
    currency: 'RWF',
  },
];

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);

  const addOrder: OrdersContextValue['addOrder'] = (order) => {
    // Add new orders to the beginning of the array
    setOrders((prev) => [order, ...prev]); 
  };

  const clearOrders = () => setOrders([]);

  // --- NEW ADMIN LOGIC: Update order status by ID ---
  const updateOrderStatus: OrdersContextValue['updateOrderStatus'] = (orderId, newStatus) => {
    setOrders((prevOrders) => 
      prevOrders.map((order) => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
    // In a real app, this is where you'd call an API to persist the change.
    console.log(`[OrdersContext] Order ${orderId} status updated to: ${newStatus}`);
  };
  // -----------------------------------------------------

  const value = useMemo(() => ({ 
    orders, 
    addOrder, 
    clearOrders, 
    updateOrderStatus // <-- EXPOSED FOR ADMIN USE
  }), [orders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
};