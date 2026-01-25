import type { Product } from "./products";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
};

const ORDERS_KEY = "thread-timber-orders";

export const getStoredOrders = (): Order[] => {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(ORDERS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as Order[];
  } catch {
    return [];
  }
};

export const saveOrder = (order: Order) => {
  if (typeof window === "undefined") return;
  const orders = getStoredOrders();
  orders.unshift(order);
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const getOrdersByUser = (userId: string): Order[] => {
  return getStoredOrders().filter((order) => order.userId === userId);
};

export const getOrderById = (orderId: string): Order | null => {
  return getStoredOrders().find((order) => order.id === orderId) || null;
};

export const updateOrderStatus = (orderId: string, status: Order["status"]) => {
  if (typeof window === "undefined") return;
  const orders = getStoredOrders();
  const updated = orders.map((order) =>
    order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
  );
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
};
