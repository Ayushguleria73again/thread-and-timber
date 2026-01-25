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
          setOrders(data);
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

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-clay/20 text-ink';
      case 'shipped': return 'bg-moss/10 text-moss';
      case 'delivered': return 'bg-moss text-sand';
      case 'cancelled': return 'bg-red-50 text-red-500';
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
            <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-2xl border border-black/5 bg-white px-4 py-2 text-xs outline-none appearance-none pr-8 cursor-pointer"
            >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
            </select>
        </div>
      </div>

      <div className="rounded-3xl border border-black/5 bg-white overflow-hidden shadow-soft">
        <table className="w-full text-left">
          <thead className="border-b border-black/5 bg-black/[0.02]">
            <tr className="text-[10px] uppercase tracking-widest text-black/40">
              <th className="px-6 py-4 font-bold">Order ID</th>
              <th className="px-6 py-4 font-bold">Customer</th>
              <th className="px-6 py-4 font-bold">Total</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.03]">
            {loading ? (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-xs text-black/20 animate-pulse">Loading orders...</td>
                </tr>
            ) : filteredOrders.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-xs text-black/20 italic">No orders found matching criteria</td>
                </tr>
            ) : filteredOrders.map((order) => (
              <tr key={order._id} className="text-xs transition-hover hover:bg-black/[0.01]">
                <td className="px-6 py-5">
                    <span className="font-serif italic text-black/40">#{order._id.slice(-6).toUpperCase()}</span>
                </td>
                <td className="px-6 py-5 font-medium">{order.shippingAddress.name}</td>
                <td className="px-6 py-5 font-bold">{formatCurrency(order.total)}</td>
                <td className="px-6 py-5">
                  <span className={`rounded-full px-3 py-1 text-[8px] uppercase tracking-widest font-bold ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-black/40">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    {order.status === 'pending' && (
                        <button 
                            onClick={() => updateStatus(order._id, 'processing')}
                            className="p-2 rounded-xl hover:bg-clay/10 text-ink/60 transition-colors"
                            title="Process Order"
                        >
                            <FiClock />
                        </button>
                    )}
                    {order.status === 'processing' && (
                        <button 
                            onClick={() => updateStatus(order._id, 'shipped')}
                            className="p-2 rounded-xl hover:bg-moss/10 text-moss transition-colors"
                            title="Ship Order"
                        >
                            <FiTruck />
                        </button>
                    )}
                    {order.status === 'shipped' && (
                        <button 
                            onClick={() => updateStatus(order._id, 'delivered')}
                            className="p-2 rounded-xl hover:bg-moss text-sand transition-colors"
                            title="Deliver Order"
                        >
                            <FiCheckCircle />
                        </button>
                    )}
                    <button 
                      onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                      className="p-2 rounded-xl hover:bg-black/5 text-black/60 transition-colors"
                    >
                      <FiEye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}
