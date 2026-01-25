"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign, FiTag } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({ revenue: 0, aov: 0, activeOrders: 0, totalMakers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("thread-timber-token");
      try {
        const [ordersRes, metricsRes] = await Promise.all([
          fetch("http://localhost:5001/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5001/api/admin/metrics", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setRecentOrders(ordersData.slice(0, 5));
        }
        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          setMetrics(metricsData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard pulse");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = [
    { label: "Monthly Revenue", value: formatCurrency(Number(metrics.revenue)), change: "+12.5%", icon: <FiDollarSign />, color: "bg-moss" },
    { label: "Active Orders", value: metrics.activeOrders.toString(), change: "+4", icon: <FiShoppingBag />, color: "bg-clay" },
    { label: "New Makers", value: metrics.totalMakers.toString(), change: "+18%", icon: <FiUsers />, color: "bg-black" },
    { label: "AOV", value: formatCurrency(Number(metrics.aov)), change: "+2.1%", icon: <FiTrendingUp />, color: "bg-sand" },
  ];

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <SectionHeading
          label="Artisan Dashboard"
          title="Studio Overview"
          subtitle="Real-time pulse of your handcrafted apparel business."
        />
        <div className="hidden sm:block text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Last Updated</p>
            <p className="text-xs font-semibold text-black">Jan 25, 2026 • 13:45</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-soft transition-hover hover:border-black/10"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-2xl p-3 text-sand ${stat.color} shadow-lg shadow-black/5 transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-moss">{stat.change}</span>
            </div>
            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-black">{stat.value}</p>
            </div>
            
            {/* Minimalist chart decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_0.4fr]">
        <div className="rounded-3xl border border-black/5 bg-white/60 p-8 backdrop-blur-xl">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-black mb-8">Recent Orders</h3>
            <div className="space-y-6">
                {loading ? (
                    <p className="px-4 py-8 text-center text-[10px] uppercase tracking-widest text-black/20 animate-pulse">Fetching studio pulse...</p>
                ) : recentOrders.length === 0 ? (
                    <p className="px-4 py-8 text-center text-[10px] uppercase tracking-widest text-black/20 italic">No recent studio activity</p>
                ) : recentOrders.map((order: any) => (
                    <div key={order._id} className="flex items-center justify-between py-4 border-b border-black/[0.03] last:border-0 hover:bg-black/[0.01] px-4 -mx-4 rounded-2xl transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-sand flex items-center justify-center text-[10px] font-serif italic text-black/40">#{order._id.slice(-4).toUpperCase()}</div>
                            <div>
                                <p className="text-xs font-bold text-black">{order.shippingAddress.name}</p>
                                <p className="text-[9px] uppercase tracking-widest text-black/40">{order.items.length} Items • {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-black">{formatCurrency(order.total)}</p>
                            <p className={`text-[8px] uppercase tracking-widest font-bold ${order.status === 'delivered' ? 'text-moss' : 'text-clay-700'}`}>{order.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-8">
            <div className="rounded-3xl border border-black/5 bg-black p-8 text-sand shadow-xl">
                <p className="text-[10px] uppercase tracking-[0.3em] text-sand/40">Studio Goal</p>
                <p className="mt-2 text-xl font-serif italic font-medium leading-tight">"Slow craft, sustainable growth."</p>
                <div className="mt-8 space-y-4">
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-[72%] bg-clay rounded-full" />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-sand/60">72% of batch target reached</p>
                </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-8">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-black mb-4">Quick Links</h4>
                <div className="grid gap-3">
                    <Link href="/adminp/products" className="flex items-center justify-between rounded-xl bg-sand/50 px-4 py-3 text-[10px] uppercase tracking-widest text-black hover:bg-sand transition-colors">
                        Add Piece <FiShoppingBag />
                    </Link>
                    <Link href="/adminp/coupons" className="flex items-center justify-between rounded-xl bg-sand/50 px-4 py-3 text-[10px] uppercase tracking-widest text-black hover:bg-sand transition-colors">
                        New Coupon <FiTag />
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
