"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle, FiPackage, FiTruck, FiHome, FiArrowRight, FiDownload, FiMapPin, FiCalendar, FiArrowLeft } from "react-icons/fi";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import CancelOrderModal from "@/components/orders/CancelOrderModal";

const statusSteps = [
  { key: "pending", label: "Studio Received", icon: FiCheckCircle },
  { key: "processing", label: "Crafting", icon: FiPackage },
  { key: "shipped", label: "In Transit", icon: FiTruck },
  { key: "delivered", label: "Delivered", icon: FiHome }
];

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
   const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const fetchOrder = async () => {
      const token = localStorage.getItem("thread-timber-token");
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/orders/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          router.push("/dashboard/orders");
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

     fetchOrder();
  }, [params.id, user, router]);

  const handleCancelOrder = async (reason: string) => {
    setIsCancelling(true);
    const token = localStorage.getItem("thread-timber-token");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/orders/${params.id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (res.ok) {
        toast.success("Order cancelled successfully");
        // Refetch order to show updated status
        const updatedOrder = await res.json();
        setOrder(updatedOrder.order);
        setIsCancelModalOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) return (
      <div className="flex h-screen items-center justify-center bg-sand text-ink/40">
          <p className="text-[10px] uppercase tracking-[0.3em] animate-pulse">Retaining studio record...</p>
      </div>
  );

  if (!order) return null;

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === order.status
  );

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-16 lg:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Header Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[3rem] border border-black/5 bg-white/70 p-10 lg:p-16 text-center shadow-soft overflow-hidden relative"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-clay via-moss to-clay opacity-30" />
            
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-moss/5 text-moss ring-8 ring-moss/5 animate-in zoom-in duration-500">
               <FiCheckCircle className="text-4xl" />
            </div>
            
            <p className="text-[10px] uppercase tracking-[0.4em] text-moss font-bold mb-4">Payment Complete</p>
            <h1 className="text-4xl lg:text-5xl font-serif italic text-black leading-tight">
              A piece of our studio,<br />soon in your hands.
            </h1>
            <p className="mt-6 text-sm text-black/50 max-w-sm mx-auto leading-relaxed">
              Thread & Timber Order <span className="font-bold text-black italic">#{order._id?.slice(-8).toUpperCase()}</span> is officially confirmed and moving to the craft table.
            </p>
            
            <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => toast.success("Confirmation sent to email")}
                  className="flex items-center gap-2 rounded-full border border-black/10 px-8 py-3 text-[10px] uppercase tracking-widest text-black hover:bg-black hover:text-sand transition-all"
                >
                  <FiDownload /> Store Invoice
                </button>
                <Link
                  href="/shop"
                  className="flex items-center gap-2 rounded-full bg-black px-8 py-3 text-[10px] uppercase tracking-widest text-sand shadow-lg shadow-black/10 hover:bg-black/90 transition-all active:scale-95"
                >
                  Return to Studio <FiArrowRight />
                </Link>
            </div>
          </motion.div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-8">
                {/* Timeline */}
                <div className="rounded-[2.5rem] border border-black/5 bg-white/60 p-8 lg:p-10">
                    <SectionHeading
                      label="Tracking"
                      title="Artisan Workflow"
                      subtitle="Follow the progress of your handcrafted pieces from loom to label."
                    />
                    <div className="mt-12 flex items-center justify-between relative px-2">
                      {/* Connector Line */}
                      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-black/[0.03] -translate-y-1/2 z-0" />
                      <div className={`absolute top-1/2 left-0 h-[2px] bg-moss -translate-y-1/2 z-0 transition-all duration-1000`} style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }} />
                      
                      {statusSteps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isPast = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const isFuture = index > currentStepIndex;
                        
                        return (
                          <div key={step.key} className="flex flex-col items-center gap-3 relative z-10">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                                isPast ? "border-moss bg-moss text-sand" : 
                                isCurrent ? "border-moss bg-white text-moss scale-110 shadow-lg ring-4 ring-moss/5" : 
                                "border-black/5 bg-sand text-black/20"
                              }`}
                            >
                              <StepIcon className={isCurrent ? "text-lg" : "text-sm"} />
                            </div>
                            <span className={`text-[8px] uppercase tracking-widest font-bold whitespace-nowrap ${isCurrent ? 'text-black' : 'text-black/30'}`}>
                                {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                </div>

                {/* Items */}
                <div className="rounded-[2.5rem] border border-black/5 bg-white/60 p-8 lg:p-10">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-black flex items-center gap-2 mb-8">
                        <FiPackage className="text-moss" /> Items from this batch
                    </h3>
                    <div className="space-y-6">
                        {(order.items || []).map((item: any) => (
                            <div key={item.product} className="flex items-center gap-6 group">
                                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-sand transition-transform group-hover:scale-105">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-black leading-tight">{item.name}</p>
                                    <p className="mt-1 text-[10px] uppercase tracking-widest text-black/40 font-bold">Qty: {item.quantity} • {formatCurrency(item.price)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-black">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Meta details */}
                <aside className="rounded-[2.5rem] border border-black/5 bg-sand/30 p-8 space-y-8">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-moss font-bold mb-4 flex items-center gap-2"><FiCalendar /> Order Summary</p>
                        <div className="space-y-3">
                            <div className="flex justify-between text-[11px] uppercase tracking-widest">
                                <span className="text-black/40">Acquisition Date</span>
                                <span className="text-black font-bold">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex justify-between text-[11px] uppercase tracking-widest">
                                <span className="text-black/40">Method</span>
                                <span className="text-black font-bold">Digital Payment</span>
                            </div>
                            <div className="flex justify-between items-baseline pt-4 border-t border-black/5">
                                <span className="text-xs font-serif italic text-black">Total Value</span>
                                <span className="text-xl font-bold text-black">{formatCurrency(order.total || 0)}</span>
                            </div>
                            {order.status === 'cancelled' && order.refundStatus && (
                              <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-center">
                                <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Refund Status</span>
                                <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${
                                    order.refundStatus === 'completed' ? 'bg-green-50 text-moss border-green-100' : 'bg-red-50 text-red-500 border-red-100'
                                }`}>
                                  {order.refundStatus === 'completed' ? 'Refectored' : 'Pending Processing'}
                                </span>
                              </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-moss font-bold mb-4 flex items-center gap-2"><FiMapPin /> Studio Ship-To</p>
                        <div className="rounded-2xl border border-black/5 bg-white/50 p-5">
                            <p className="text-sm font-bold text-black mb-2">{order.shippingAddress?.name}</p>
                            <div className="text-xs text-black/60 leading-relaxed space-y-1">
                                <p>{order.shippingAddress?.address || order.shippingAddress?.street}</p>
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                                <p className="uppercase tracking-widest text-[10px] font-bold text-black/30 mt-2">{order.shippingAddress?.country}</p>
                            </div>
                        </div>
                    </div>

                     <Link 
                      href="/dashboard/orders"
                      className="flex items-center justify-center gap-2 w-full rounded-full border border-black/5 bg-white py-4 text-[10px] uppercase tracking-widest text-black hover:bg-clay/10 transition-colors"
                    >
                      <FiArrowLeft /> View All Orders
                    </Link>

                    {order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'shipped' && (
                      <button 
                        onClick={() => setIsCancelModalOpen(true)}
                        className="flex items-center justify-center gap-2 w-full rounded-full border border-red-500/20 bg-red-50/50 py-4 text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors mt-4"
                      >
                        Cancel Artisan Order
                      </button>
                    )}
                </aside>

                <div className="rounded-[2.5rem] border border-black/5 bg-black p-8 text-sand overflow-hidden relative group">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-sand/40 mb-4 italic">Next Step</p>
                    <p className="text-lg font-serif italic font-medium leading-tight">Your order will now enter the crafting queue.</p>
                    <div className="mt-8 flex h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-1/4 bg-moss rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>
       <Footer />

      <CancelOrderModal 
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
        isCancelling={isCancelling}
      />
    </div>
  );
}
