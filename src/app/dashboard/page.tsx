"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FiPackage, 
  FiHeart, 
  FiUser, 
  FiMapPin, 
  FiChevronRight, 
  FiArrowLeft, 
  FiCreditCard,
  FiZap,
  FiActivity,
  FiShield
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWishlist } from "@/components/auth/WishlistProvider";
import { formatCurrency } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const fetchOrders = async () => {
        const token = localStorage.getItem("thread-timber-token");
        if (!token) return;
        
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const res = await fetch(`${apiUrl}/orders/myorders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const safeOrders = Array.isArray(data) ? data : (data.orders || []);
                setOrders(safeOrders);
            }
        } catch (error) {
            console.error("Dashboard: Failed to load order history");
        } finally {
            setLoading(false);
        }
    };

    fetchOrders();
  }, [user, router]);

  if (!user) return null;

  const recentOrders = (orders || []).slice(0, 5);

  const stats = [
    {
      label: "Total Acquisitions",
      value: loading ? "..." : orders.length,
      icon: FiPackage,
      href: "/dashboard/orders",
      gradient: "from-moss/10 to-transparent"
    },
    {
      label: "Wishlist Curation",
      value: wishlistItems.length,
      icon: FiHeart,
      href: "/dashboard/wishlist",
      gradient: "from-red-500/5 to-transparent"
    },
    {
      label: "Studio Credit",
      value: formatCurrency(user.walletBalance || 0),
      icon: FiCreditCard,
      href: "/gift-cards",
      gradient: "from-blue-500/5 to-transparent"
    },
    {
      label: "Active Addresses",
      value: (user.addresses || []).length,
      icon: FiMapPin,
      href: "/dashboard/addresses",
      gradient: "from-amber-500/5 to-transparent"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-moss selection:text-sand">
      {/* Background Decorative Element */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-moss/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] -left-[10%] w-[30%] h-[30%] bg-sand-dark/20 rounded-full blur-[100px]" />
      </div>

      <section className="relative z-10 container-pad py-12 lg:py-20">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
            <motion.div variants={itemVariants}>
              <Link 
                href="/" 
                className="group mb-8 flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 hover:text-black transition-colors"
              >
                <FiArrowLeft className="text-sm transition-transform group-hover:-translate-x-1" />
                Return to Gallery
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-moss animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-moss">Artisan Status: Active</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif italic text-black">
                  Welcome back, {user.name.split(" ")[0]}
                </h1>
                <p className="text-black/40 max-w-lg leading-relaxed italic">
                  Synchronizing your studio preferences and handcrafted acquisition history.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-black/5 bg-white/50 px-5 py-3 backdrop-blur-sm">
                  <p className="text-[8px] uppercase tracking-widest text-black/40 font-bold">Studio Tier</p>
                  <p className="text-xs font-bold text-black flex items-center gap-2 mt-1">
                    <FiShield className="text-moss" /> Artisan Contributor
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={stat.label} variants={itemVariants}>
                    <Link
                      href={stat.href}
                      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-black/5 bg-white/70 p-8 shadow-soft transition-all hover:-translate-y-1 hover:border-black/10 hover:shadow-xl"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      
                      <div className="relative z-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sand transition-transform group-hover:scale-110 group-hover:rotate-3">
                            <Icon className="text-xl text-moss" />
                        </div>
                        <p className="mt-6 text-[10px] uppercase tracking-[0.3em] font-bold text-black/40">
                          {stat.label}
                        </p>
                        <p className="mt-2 text-3xl font-serif italic text-black">
                          {stat.value}
                        </p>
                      </div>

                      <div className="absolute top-8 right-8 transition-all group-hover:translate-x-1 group-hover:text-moss">
                          <FiChevronRight className="text-black/10 group-hover:text-inherit" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
              {/* Recent Orders Section */}
              <motion.div variants={itemVariants} className="rounded-[2.5rem] border border-black/5 bg-white/70 p-8 lg:p-12 shadow-soft backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FiActivity className="text-moss text-xs" />
                      <h3 className="text-xl font-serif italic text-black leading-none">Studio Acquisitions</h3>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Documenting your support for slow craft.</p>
                  </div>
                  <Link
                    href="/dashboard/orders"
                    className="group flex w-fit items-center gap-2 rounded-full bg-black px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold text-sand shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
                  >
                    All History <FiChevronRight className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-24 bg-black/[0.03] rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : (recentOrders || []).length > 0 ? (
                  <div className="space-y-4">
                    {(recentOrders || []).map((order) => (
                      <Link
                        key={order._id}
                        href={`/dashboard/orders`}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-3xl border border-black/5 bg-sand/10 p-6 transition-all hover:bg-white hover:border-black/10 hover:shadow-md"
                      >
                        <div className="flex items-center gap-5">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-black/5 transition-transform group-hover:scale-105">
                                <FiPackage className="text-black/20 group-hover:text-moss/40 transition-colors" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-black">
                                      Registry #{order._id?.slice(-6).toUpperCase()}
                                  </p>
                                  <span className={`h-1.5 w-1.5 rounded-full ${order.status === 'delivered' ? 'bg-moss' : 'bg-amber-400'}`} />
                                </div>
                                <p className="mt-1 text-[10px] uppercase tracking-widest text-black/40 font-bold italic font-serif">
                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0 text-left sm:text-right">
                          <p className="text-lg font-serif italic text-black">
                            {formatCurrency(order.total || 0)}
                          </p>
                          <p className={`text-[8px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full inline-block mt-2 ${
                            order.status === 'delivered' 
                              ? 'bg-moss/10 text-moss' 
                              : 'bg-black/5 text-black/40'
                          }`}>
                            {order.status}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center rounded-[2rem] border border-dashed border-black/10 bg-sand/10">
                      <FiZap className="mx-auto text-black/10 text-3xl mb-4" />
                      <p className="text-xs text-black/40 uppercase tracking-widest font-bold">No acquisitions found</p>
                      <Link href="/shop" className="mt-4 inline-block text-[10px] uppercase tracking-widest text-moss font-bold hover:underline">Begin your curation</Link>
                  </div>
                )}
              </motion.div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-8">
                <motion.div variants={itemVariants} className="rounded-[2.5rem] border border-black/5 bg-white/70 p-8 lg:p-10 shadow-soft backdrop-blur-xl">
                  <div className="mb-8">
                    <h3 className="text-lg font-serif italic text-black leading-none">Artisan Registry</h3>
                    <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mt-2">Personal studio controls.</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: FiUser, label: "Identity Profile", href: "/dashboard/settings" },
                      { icon: FiMapPin, label: "Dispatch Points", href: "/dashboard/addresses" },
                      { icon: FiHeart, label: "Saved Curations", href: "/dashboard/wishlist" },
                      { icon: FiCreditCard, label: "Studio Wallet", href: "/gift-cards" },
                    ].map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="group flex items-center justify-between rounded-2xl border border-black/5 bg-sand/20 p-5 transition-all hover:bg-black hover:border-black active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-black/5 transition-colors group-hover:bg-moss/20 group-hover:border-transparent">
                              <link.icon className="text-moss transition-transform group-hover:scale-110" />
                          </div>
                          <span className="text-[10px] font-bold text-black uppercase tracking-widest group-hover:text-sand">{link.label}</span>
                        </div>
                        <FiChevronRight className="text-black/10 group-hover:text-sand/40 transition-transform group-hover:translate-x-1" />
                      </Link>
                    ))}
                  </div>
                </motion.div>

                {/* Studio Help Banner */}
                <motion.div variants={itemVariants} className="rounded-[2.5rem] bg-moss p-10 text-sand shadow-lg shadow-moss/10">
                  <h4 className="font-serif text-xl italic leading-tight mb-2">Artisan Support</h4>
                  <p className="text-[10px] text-sand/60 uppercase tracking-widest leading-relaxed mb-6">Need specialist assistance?</p>
                  <p className="text-xs leading-relaxed italic opacity-80 mb-8">
                    Our studio team is available for bespoke queries, registry updates, or acquisition help.
                  </p>
                  <a 
                    href="mailto:studio@threadtimber.co" 
                    className="inline-block rounded-full bg-sand px-6 py-2 text-[10px] uppercase tracking-widest font-bold text-black transition-transform hover:scale-105"
                  >
                    Contact Studio
                  </a>
                </motion.div>
              </div>
            </div>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
