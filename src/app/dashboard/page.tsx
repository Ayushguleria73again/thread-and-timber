"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiPackage, FiHeart, FiUser, FiMapPin } from "react-icons/fi";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";
import { getOrdersByUser } from "@/lib/orders";
import { useWishlist } from "@/components/auth/WishlistProvider";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  const orders = user ? getOrdersByUser(user.id) : [];
  const recentOrders = orders.slice(0, 3);

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
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
      value: 1,
      icon: FiMapPin,
      href: "/dashboard/addresses"
    }
  ];

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Dashboard"
          title={`Welcome back, ${user.name.split(" ")[0]}`}
          subtitle="Manage your account, orders, and preferences."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="rounded-3xl border border-black/5 bg-white/70 p-6 transition hover:-translate-y-1"
              >
                <Icon className="mb-4 text-2xl text-moss" />
                <p className="text-xs uppercase tracking-[0.3em] text-moss">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-black">
                  {stat.value}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black">Recent Orders</h3>
              <Link
                href="/dashboard/orders"
                className="text-xs uppercase tracking-[0.24em] text-moss"
              >
                View All
              </Link>
            </div>
            {recentOrders.length > 0 ? (
              <div className="mt-4 space-y-3">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between rounded-2xl border border-black/5 bg-sand/50 p-4"
                  >
                    <div>
                      <p className="font-medium text-black">
                        Order #{order.id.slice(-8)}
                      </p>
                      <p className="text-sm text-black/70">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-black">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-xs uppercase tracking-[0.2em] text-black/60">
                        {order.status}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-black/70">No orders yet</p>
            )}
          </div>

          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black">Quick Actions</h3>
            </div>
            <div className="mt-4 space-y-3">
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-2xl border border-black/5 bg-sand/50 p-4"
              >
                <FiUser className="text-moss" />
                <span className="text-sm text-black">Account Settings</span>
              </Link>
              <Link
                href="/dashboard/addresses"
                className="flex items-center gap-3 rounded-2xl border border-black/5 bg-sand/50 p-4"
              >
                <FiMapPin className="text-moss" />
                <span className="text-sm text-black">Manage Addresses</span>
              </Link>
              <Link
                href="/dashboard/wishlist"
                className="flex items-center gap-3 rounded-2xl border border-black/5 bg-sand/50 p-4"
              >
                <FiHeart className="text-moss" />
                <span className="text-sm text-black">Wishlist</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
