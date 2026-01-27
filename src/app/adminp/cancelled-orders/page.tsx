"use client";

import { useEffect, useState } from "react";
import { FiSearch, FiFilter, FiEye, FiAlertCircle, FiClock, FiCreditCard } from "react-icons/fi";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";

export default function AdminCancelledOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
          const allOrders = Array.isArray(data) ? data : (data.orders || []);
          // Filter only cancelled orders
          const cancelled = allOrders.filter((o: any) => o.status === 'cancelled');
          setOrders(cancelled);
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

  const updateRefundStatus = async (orderId: string, refundStatus: string) => {
    const token = localStorage.getItem("thread-timber-token");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/admin/orders/${orderId}/refund-status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ refundStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, refundStatus } : o));
        toast.success(`Refund status updated to ${refundStatus}`);
        if (refundStatus === 'completed') {
          toast.success('Refund completion email sent to customer');
        }
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update refund status");
      }
    } catch (error) {
      toast.error("Failed to update refund status");
    }
  };

  const getRefundStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-moss/10 text-moss';
      case 'pending': return 'bg-orange-50 text-orange-600';
      case 'failed': return 'bg-red-50 text-red-500';
      default: return 'bg-black/5 text-black/40';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-red-600">Refund Administration</h2>
          <p className="text-[10px] uppercase tracking-widest text-black/40 mt-1">Manage studio withdrawals and artisan settlements.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20" />
                <input 
                    placeholder="Search Order ID..." 
                    className="rounded-2xl border border-black/5 bg-white px-10 py-2 text-xs outline-none focus:border-black/10 w-full sm:w-64"
                />
            </div>
        </div>
      </div>

      <div className="rounded-3xl border border-black/5 bg-white overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-black/5 bg-black/[0.02]">
              <tr className="text-[10px] uppercase tracking-widest text-black/40 font-bold">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer UPI</th>
                <th className="px-6 py-4">Refund Amount</th>
                <th className="px-6 py-4">Refund Status</th>
                <th className="px-6 py-4">Date Cancelled</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03]">
              {loading ? (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-xs text-black/20 animate-pulse font-medium">Syncing cancelled orders...</td>
                  </tr>
              ) : orders.length === 0 ? (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-xs text-black/20 italic font-medium">No cancelled orders found</td>
                  </tr>
              ) : orders.map((order: any) => (
                <tr key={order._id} className="text-xs transition-hover hover:bg-black/[0.005] group">
                  <td className="px-6 py-5">
                      <span className="font-serif italic text-black/40 group-hover:text-black transition-colors font-medium">#{order._id.slice(-8).toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-5">
                      <p className="font-bold text-black select-all">{order.refundUpiId || 'Not Provided'}</p>
                      <p className="text-[10px] text-black/30">{order.shippingAddress.name}</p>
                  </td>
                  <td className="px-6 py-5 font-bold text-red-600">{formatCurrency(order.refundAmount || order.total)}</td>
                  <td className="px-6 py-5">
                    <div className="relative inline-block">
                        <select 
                            value={order.refundStatus || 'pending'}
                            onChange={(e) => updateRefundStatus(order._id, e.target.value)}
                            className={`rounded-full pl-3 pr-8 py-1.5 text-[8px] uppercase tracking-widest font-bold appearance-none cursor-pointer outline-none ring-1 ring-inset ring-transparent focus:ring-black/10 transition-all ${getRefundStatusStyle(order.refundStatus || 'pending')}`}
                        >
                            <option value="pending" className="bg-white text-black font-sans uppercase">pending</option>
                            <option value="completed" className="bg-white text-black font-sans uppercase">completed</option>
                            <option value="failed" className="bg-white text-black font-sans uppercase">failed</option>
                        </select>
                        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current opacity-40">
                             <svg width="8" height="5" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-black/40 font-medium">
                    {order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end items-center gap-2">
                       <button 
                        onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                        className="p-2.5 rounded-xl bg-black/[0.03] text-black/40 hover:text-black hover:bg-black/[0.06] transition-all"
                        title="View Refund Details"
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
