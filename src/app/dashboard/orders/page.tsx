"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPackage, FiTruck, FiCheck, FiClock, FiShoppingBag, FiChevronRight } from "react-icons/fi";
import { formatCurrency } from "@/lib/utils";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
        const token = localStorage.getItem("thread-timber-token");
        if (!token) return;
        
        try {
            const res = await fetch("http://localhost:5001/api/orders/myorders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            toast.error("Failed to load order history");
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        fetchOrders();
    }
  }, [user]);

  if (!user) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing": return <FiClock className="text-orange-500" />;
      case "shipped": return <FiTruck className="text-blue-500" />;
      case "delivered": return <FiCheck className="text-moss" />;
      default: return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
        case "processing": return "bg-orange-50 text-orange-700 border-orange-200";
        case "shipped": return "bg-blue-50 text-blue-700 border-blue-200";
        case "delivered": return "bg-green-50 text-moss border-green-200";
        default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Order History"
          title="Your collection pieces"
          subtitle="Track your shipments and view past artisan acquisitions."
        />

        <div className="mt-10">
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 w-full animate-pulse rounded-3xl bg-white/40 border border-black/5" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-black/5 bg-white/70 py-20 text-center">
                    <div className="mb-4 rounded-full bg-sand p-6">
                        <FiPackage className="text-4xl text-black/20" />
                    </div>
                    <h3 className="text-xl font-serif italic text-black">No orders yet</h3>
                    <p className="mt-2 text-sm text-black/60 max-w-sm">
                        You haven't acquired any handcrafted pieces yet. Explore our latest drops.
                    </p>
                    <Link
                        href="/shop"
                        className="mt-6 rounded-full bg-black px-8 py-3 text-[10px] uppercase tracking-widest text-sand shadow-lg hover:bg-black/90"
                    >
                        Browse Collection
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="group overflow-hidden rounded-3xl border border-black/5 bg-white/80 transition hover:border-black/10 hover:shadow-soft">
                            <div className="border-b border-black/5 bg-sand/20 p-6 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-full bg-white p-3 shadow-sm text-black/60">
                                        <FiShoppingBag />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Order #{order._id.slice(-6)}</p>
                                        <p className="text-xs text-black/60">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-widest font-semibold ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </div>
                                    <p className="font-serif italic text-lg font-medium text-black">
                                        {formatCurrency(order.total)}
                                    </p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.orderItems.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-black/5 bg-sand">
                                                {/* Image handling would verify specific structure, using placeholder for safety if needed */}
                                                <img 
                                                    src={item.image || "/images/products/placeholder.jpg"} 
                                                    alt={item.name} 
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-black">{item.name}</h4>
                                                <p className="text-xs text-black/60">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium text-black">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 flex justify-end border-t border-black/5 pt-4">
                                    <button 
                                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-moss hover:text-black transition-colors"
                                        onClick={() => toast.success("Invoice requested sent to email")}
                                    >
                                        Download Invoice <FiChevronRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
