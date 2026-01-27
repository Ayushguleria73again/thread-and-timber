"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FiSearch, FiPackage, FiTruck, FiCheck, FiClock } from "react-icons/fi";
import { toast } from "sonner";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { formatCurrency } from "@/lib/utils";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setOrderId(id);
      handleTrackWithId(id);
    }
  }, [searchParams]);

  const handleTrackWithId = async (id: string) => {
    if (!id.trim()) {
      toast.error("Please enter an Order No.");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/orders/track/${id.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        toast.error("Order not found. Please verify your Order No.");
        setOrder(null);
      }
    } catch (error) {
      toast.error("Failed to track order");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    handleTrackWithId(orderId);
  };

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
          label="Track Dispatch"
          title="Monitor your artisan acquisition"
          subtitle="Enter your Order No. to view real-time dispatch status."
        />

        <form onSubmit={handleTrack} className="mt-10 max-w-2xl mx-auto">
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <label className="block text-xs uppercase tracking-widest text-black/50 mb-2">
              Order No. (Order ID)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter your order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand disabled:bg-black/50"
              >
                <FiSearch /> {loading ? "Tracking..." : "Track"}
              </button>
            </div>
          </div>
        </form>

        {order && (
          <div className="mt-10 max-w-2xl mx-auto space-y-6">
            <div className="rounded-3xl border border-black/5 bg-white/80 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Order No.</p>
                  <p className="text-lg font-serif italic text-black mt-1">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] uppercase tracking-widest font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>

              <div className="border-t border-black/5 pt-6 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-2">Dispatch Address</p>
                  <p className="text-sm text-black/70">
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-2">Acquisition Date</p>
                  <p className="text-sm text-black/70">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white/80 p-8">
              <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-4">Collection Pieces</p>
              <div className="space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 pb-4 border-b border-black/5 last:border-0">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-black/5 bg-sand">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-black">{item.name}</h4>
                      <p className="text-xs text-black/60">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-black">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-black/5 flex justify-between items-center">
                <span className="text-sm uppercase tracking-widest text-black/40 font-bold">Total Investment</span>
                <span className="text-xl font-serif italic text-black">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-black/40 animate-pulse">Loading tracking interface...</p>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
