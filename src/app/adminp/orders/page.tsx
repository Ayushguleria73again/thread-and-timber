"use client";

import { useEffect, useState } from "react";
import { FiSearch, FiFilter, FiEye, FiCheckCircle, FiClock, FiTruck } from "react-icons/fi";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("thread-timber-token");
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const safeOrders = Array.isArray(data) ? data : (data.orders || []);
          setOrders(safeOrders);
        }
      } catch (error) {
        toast.error("Failed to fetch studio orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const token = localStorage.getItem("thread-timber-token");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
        toast.success(`Order status updated to ${status}`);
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);

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
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Order Fulfillment</h2>
          <p className="text-[10px] uppercase tracking-widest text-black/40 mt-1">Manage and track mindful maker orders.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20" />
                <input 
                    placeholder="Search Order ID..." 
                    className="rounded-2xl border border-black/5 bg-white px-10 py-2 text-xs outline-none focus:border-black/10 w-full sm:w-64"
                />
            </div>
            <div className="relative">
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="rounded-2xl border border-black/5 bg-white pl-4 pr-10 py-2 text-xs outline-none appearance-none cursor-pointer text-black"
                >
                    <option value="all">All Status</option>
                    {ORDER_STATUSES.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/20">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
            </div>
        </div>
      </div>

      <div className="rounded-3xl border border-black/5 bg-white overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-black/5 bg-black/[0.02]">
              <tr className="text-[10px] uppercase tracking-widest text-black/40 font-bold">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03]">
              {loading ? (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-xs text-black/20 animate-pulse font-medium">Syncing studio orders...</td>
                  </tr>
              ) : filteredOrders.length === 0 ? (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-xs text-black/20 italic font-medium">No orders found matching criteria</td>
                  </tr>
              ) : filteredOrders.map((order: any) => (
                <tr key={order._id} className="text-xs transition-hover hover:bg-black/[0.005] group">
                  <td className="px-6 py-5">
                      <span className="font-serif italic text-black/40 group-hover:text-black transition-colors font-medium">#{order._id.slice(-8).toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-5">
                      <p className="font-bold text-black">{order.shippingAddress.name}</p>
                      <p className="text-[10px] text-black/30 truncate max-w-[120px]">{order.user?.email || 'Guest'}</p>
                  </td>
                  <td className="px-6 py-5 font-bold text-black">{formatCurrency(order.total)}</td>
                  <td className="px-6 py-5">
                    <div className="relative inline-block">
                        <select 
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className={`rounded-full pl-3 pr-8 py-1.5 text-[8px] uppercase tracking-widest font-bold appearance-none cursor-pointer outline-none ring-1 ring-inset ring-transparent focus:ring-black/10 transition-all ${getStatusStyle(order.status)}`}
                        >
                            {ORDER_STATUSES.map(s => (
                                <option key={s} value={s} className="bg-white text-black font-sans uppercase">{s}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current opacity-40">
                             <svg width="8" height="5" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-black/40 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                        className="p-2.5 rounded-xl bg-black/[0.03] text-black/40 hover:text-black hover:bg-black/[0.06] transition-all"
                        title="View Details"
                      >
                        <FiEye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onStatusUpdate={(id, status) => {
            updateStatus(id, status);
            if (selectedOrder) setSelectedOrder({ ...selectedOrder, status });
        }}
      />
    </div>
  );
}
