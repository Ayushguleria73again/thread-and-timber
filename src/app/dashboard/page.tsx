import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiPackage, FiHeart, FiUser, FiMapPin, FiChevronRight } from "react-icons/fi";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWishlist } from "@/components/auth/WishlistProvider";
import { formatCurrency } from "@/lib/utils";

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
                setOrders(Array.isArray(data) ? data : []);
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

  const recentOrders = (orders || []).slice(0, 3);

  const stats = [
    {
      label: "Total Orders",
      value: loading ? "..." : orders.length,
      icon: FiPackage,
      href: "/dashboard/orders"
    },
    {
      label: "Wishlist Items",
      value: wishlistItems.length,
      icon: FiHeart,
      href: "/dashboard/wishlist"
    },
    {
      label: "Saved Addresses",
      value: (user.addresses || []).length,
      icon: FiMapPin,
      href: "/dashboard/addresses"
    }
  ];

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12 lg:py-20">
        <div className="max-w-6xl mx-auto">
            <SectionHeading
              label="Artisan Dashboard"
              title={`Welcome back, ${user.name.split(" ")[0]}`}
              subtitle="Manage your profile, track collections, and tailor your studio experience."
            />

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {(stats || []).map((stat) => {
                const Icon = stat.icon;
                return (
                  <Link
                    key={stat.label}
                    href={stat.href}
                    className="group relative rounded-[2.5rem] border border-black/5 bg-white/70 p-8 shadow-soft transition-all hover:-translate-y-1 hover:border-black/10"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sand group-hover:bg-moss/5 transition-colors">
                        <Icon className="text-xl text-moss" />
                    </div>
                    <p className="mt-6 text-[10px] uppercase tracking-[0.3em] font-bold text-black/40">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-serif italic text-black">
                      {stat.value}
                    </p>
                    <div className="absolute top-8 right-8 transition-transform group-hover:translate-x-1">
                        <FiChevronRight className="text-black/10" />
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-[2.5rem] border border-black/5 bg-white/70 p-8 lg:p-10 shadow-soft">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-serif italic text-black">Recent Acquisitions</h3>
                    <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mt-1">Your latest handcrafted pieces.</p>
                  </div>
                  <Link
                    href="/dashboard/orders"
                    className="rounded-full bg-black/[0.03] px-6 py-2 text-[10px] uppercase tracking-widest font-bold text-black/40 hover:bg-black hover:text-sand transition-all"
                  >
                    View History
                  </Link>
                </div>

                {loading ? (
                    <div className="space-y-3 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-black/5 rounded-2xl" />)}
                    </div>
                ) : (recentOrders || []).length > 0 ? (
                  <div className="space-y-3">
                    {(recentOrders || []).map((order) => (
                      <Link
                        key={order._id}
                        href={`/dashboard/orders`}
                        className="group flex items-center justify-between rounded-2xl border border-black/5 bg-sand/20 p-5 transition-all hover:bg-white hover:border-black/10"
                      >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center border border-black/5">
                                <FiPackage className="text-black/20" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-black">
                                    Order #{order._id?.slice(-6).toUpperCase()}
                                </p>
                                <p className="text-[10px] uppercase tracking-widest text-black/40 font-medium">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-black">
                            {formatCurrency(order.total || 0)}
                          </p>
                          <p className={`text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${order.status === 'delivered' ? 'bg-moss text-sand' : 'bg-black/5 text-black/40'}`}>
                            {order.status}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center rounded-3xl border border-dashed border-black/10 bg-sand/20">
                      <p className="text-sm text-black/40 italic">No historical data available yet.</p>
                  </div>
                )}
              </div>

              <div className="rounded-[2.5rem] border border-black/5 bg-white/70 p-8 lg:p-10 shadow-soft">
                <div className="mb-8">
                  <h3 className="text-lg font-serif italic text-black">Quick Registry</h3>
                  <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mt-1">Manage your artisan preferences.</p>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-4 rounded-2xl border border-black/5 bg-sand/20 p-5 transition-all hover:bg-moss hover:border-moss group"
                  >
                    <div className="rounded-xl bg-white p-2 border border-black/5 group-hover:border-white/20">
                        <FiUser className="text-moss" />
                    </div>
                    <span className="text-xs font-bold text-black group-hover:text-sand uppercase tracking-widest">Account Profile</span>
                  </Link>
                  <Link
                    href="/dashboard/addresses"
                    className="flex items-center gap-4 rounded-2xl border border-black/5 bg-sand/20 p-5 transition-all hover:bg-moss hover:border-moss group"
                  >
                    <div className="rounded-xl bg-white p-2 border border-black/5 group-hover:border-white/20">
                        <FiMapPin className="text-moss" />
                    </div>
                    <span className="text-xs font-bold text-black group-hover:text-sand uppercase tracking-widest">Dispatch Points</span>
                  </Link>
                  <Link
                    href="/dashboard/wishlist"
                    className="flex items-center gap-4 rounded-2xl border border-black/5 bg-sand/20 p-5 transition-all hover:bg-moss hover:border-moss group"
                  >
                    <div className="rounded-xl bg-white p-2 border border-black/5 group-hover:border-white/20">
                        <FiHeart className="text-moss" />
                    </div>
                    <span className="text-xs font-bold text-black group-hover:text-sand uppercase tracking-widest">Saved Collections</span>
                  </Link>
                </div>
              </div>
            </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
