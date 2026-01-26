"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiCheckCircle, FiPackage, FiArrowRight, FiShoppingBag, FiTruck } from "react-icons/fi";
import { formatCurrency } from "@/lib/utils";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 260, 
      damping: 20,
      delay: 0.1
    }
  }
};

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem("thread-timber-token");
        const res = await fetch(`${apiUrl}/orders/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-sand">
        <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-t-2 border-black animate-spin" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Registering acquisition...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-sand p-6 text-center">
            <h2 className="font-serif text-3xl italic text-black">Registry Entry Not Found</h2>
            <p className="mt-4 text-xs uppercase tracking-widest text-black/40">The studio could not locate this acquisition record.</p>
            <Link href="/dashboard" className="mt-8 rounded-full bg-black px-8 py-3 text-[10px] uppercase tracking-[0.3em] text-sand">
                Return to Dashboard
            </Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-20 lg:py-32">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header & Checkmark */}
          <div className="flex flex-col items-center text-center">
            <motion.div variants={checkmarkVariants} className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-moss/10">
                <FiCheckCircle className="text-5xl text-moss" />
            </motion.div>
            
            <motion.div variants={itemVariants}>
                <SectionHeading
                    label="Acquisition Confirmed"
                    title="Treasures Registered."
                    subtitle={`Registry ID: ${order._id.slice(-8).toUpperCase()}`}
                />
            </motion.div>
          </div>

          <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_350px]">
            {/* Details Panel */}
            <motion.div variants={itemVariants} className="space-y-8">
                <div className="rounded-[2.5rem] border border-black/5 bg-white/70 p-10 shadow-soft backdrop-blur-xl">
                    <h3 className="flex items-center gap-3 font-serif text-xl italic text-black mb-8 border-b border-black/5 pb-6">
                        <FiPackage className="text-moss" /> Artisan Dispatch Recap
                    </h3>
                    
                    <div className="space-y-6">
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-black/5 bg-sand/30">
                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-black">{item.name}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-black/40">{item.quantity} × {formatCurrency(item.price)}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-black">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-black/5 space-y-3">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest text-black/40 font-bold">
                            <span>Studio Logistics</span>
                            <span>{formatCurrency(8)}</span>
                        </div>
                        <div className="flex justify-between text-[10px] uppercase tracking-widest text-black/40 font-bold">
                            <span>Craft Levies</span>
                            <span>{formatCurrency(order.total * 0.08)}</span>
                        </div>
                        <div className="flex justify-between font-serif text-2xl italic text-black pt-2">
                            <span>Total Registry</span>
                            <span className="font-sans font-bold not-italic">{formatCurrency(order.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                        href="/dashboard"
                        className="flex-1 rounded-full border border-black/10 bg-white px-8 py-5 text-center text-[10px] uppercase tracking-[0.3em] font-bold text-black hover:bg-black/5 transition-all flex items-center justify-center gap-2"
                    >
                        Registry Portal
                    </Link>
                    <Link 
                        href="/shop"
                        className="flex-1 rounded-full bg-black px-8 py-5 text-center text-[10px] uppercase tracking-[0.3em] font-bold text-sand shadow-xl shadow-black/20 hover:bg-black/90 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        Return to Drop <FiArrowRight />
                    </Link>
                </div>
            </motion.div>

            {/* Status Sidebar */}
            <motion.div variants={itemVariants} className="space-y-6">
                <div className="rounded-[2rem] border border-black/5 bg-white/40 p-8 shadow-soft backdrop-blur-sm">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 mb-6 pb-4 border-b border-black/5">Acquisition Status</h4>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-moss/10 text-moss">
                                <FiCheckCircle />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-black">Order Placed</p>
                                <p className="mt-1 text-[10px] text-black/60 italic leading-relaxed">The studio has officially registered your interest.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 opacity-40">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 text-black">
                                <FiTruck />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-black">Courier Dispatch</p>
                                <p className="mt-1 text-[10px] text-black/60 italic leading-relaxed">Tracking credentials will be transmitted shortly.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-sand/60 border border-black/5 italic text-black/40 text-[10px] leading-relaxed text-center">
                    A digital certificate of this acquisition has been dispatched to your registered email.
                </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
