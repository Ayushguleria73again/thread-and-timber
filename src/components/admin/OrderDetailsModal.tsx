"use client";

import { FiX, FiClock, FiMapPin, FiPackage, FiUser, FiInfo } from "react-icons/fi";
import { formatCurrency } from "@/lib/utils";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onStatusUpdate?: (id: string, status: string) => void;
}

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetailsModal({ isOpen, onClose, order, onStatusUpdate }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-clay/20 text-ink';
      case 'shipped': return 'bg-moss/10 text-moss';
      case 'delivered': return 'bg-moss text-sand';
      case 'cancelled': return 'bg-red-50 text-red-500';
      case 'pending': return 'bg-black/5 text-black/40';
      default: return 'bg-black/5 text-black/40';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl rounded-[2.5rem] border border-black/5 bg-white overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-8 border-b border-black/[0.03]">
          <div>
            <h2 className="text-xl font-serif italic font-medium text-black">Order Fulfillment Detail</h2>
            <p className="text-[10px] uppercase tracking-widest text-black/40 mt-1">Order ID: #{order._id.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5"><FiX /></button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-8 space-y-8">
            {/* Status & Date */}
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-sand/50 p-5">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-3 flex items-center gap-2"><FiClock /> Studio Status</p>
                    <div className="relative inline-block">
                        <select 
                            value={order.status}
                            onChange={(e) => onStatusUpdate?.(order._id, e.target.value)}
                            className={`rounded-full pl-4 pr-10 py-2 text-[10px] uppercase tracking-widest font-bold appearance-none cursor-pointer outline-none ring-1 ring-inset ring-transparent focus:ring-black/10 transition-all ${getStatusStyle(order.status)}`}
                        >
                            {ORDER_STATUSES.map(s => (
                                <option key={s} value={s} className="bg-white text-black font-sans uppercase">{s}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-40">
                             <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl bg-sand/50 p-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 flex items-center gap-2"><FiInfo /> Date Placed</p>
                    <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
            </div>

            {/* Customer & Shipping */}
            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                   <p className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-4 flex items-center gap-2"><FiUser /> Mindful Maker</p>
                   <p className="text-sm font-bold text-black">{order.shippingAddress.name}</p>
                   <p className="text-xs text-black/60 truncate">{order.user?.email || 'Guest User'}</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-4 flex items-center gap-2"><FiMapPin /> Studio Shipping</p>
                   <div className="text-xs text-black/60 space-y-1">
                      <p>{order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                      <p>{order.shippingAddress.country}</p>
                   </div>
                </div>
            </div>

            {/* Line Items */}
            <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-4 flex items-center gap-2"><FiPackage /> Artisan Pieces</p>
                <div className="space-y-4">
                    {(order.items || []).map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between py-2 border-b border-black/[0.03] last:border-0">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-sand overflow-hidden border border-black/5">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-black">{item.name}</p>
                                    <p className="text-[10px] text-black/40 uppercase tracking-widest">Qty: {item.quantity} • {formatCurrency(item.price)}</p>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-black">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Financial Summary */}
            <div className="rounded-3xl border border-black/5 bg-sand/30 p-6 space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-black/40 uppercase tracking-widest font-bold">Subtotal</span>
                    <span className="font-bold">{formatCurrency(order.total - 8 - (order.total * 0.08))}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-black/40 uppercase tracking-widest font-bold">Artisan Discount</span>
                    <span className="text-moss">-{formatCurrency(order.discountAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-black/[0.03]">
                    <span className="text-black font-bold uppercase tracking-widest">Total Amount</span>
                    <span className="font-bold text-moss">{formatCurrency(order.total)}</span>
                </div>
            </div>
        </div>

        <div className="p-8 bg-black/[0.02] border-t border-black/[0.03] flex justify-end">
            <button onClick={onClose} className="rounded-full bg-black px-8 py-3 text-[10px] uppercase tracking-widest text-sand shadow-lg shadow-black/10">Done Viewing</button>
        </div>
      </div>
    </div>
  );
}
