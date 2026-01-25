"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { FiLayout, FiShoppingBag, FiTruck, FiTag, FiBarChart2, FiSettings, FiExternalLink } from "react-icons/fi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If auth is loaded and user is not admin, redirect
    if (user && !user.isAdmin) {
       router.push("/dashboard");
    }
    if (!user) {
        // router.push("/auth/login?redirect=/admin");
    }
  }, [user, router]);

  if (!user || !user.isAdmin) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-sand">
            <p className="text-xs uppercase tracking-[0.3em] text-ink/40 animate-pulse">Authenticating Artisan Access...</p>
        </div>
    );
  }

  const navItems = [
    { label: "Overview", href: "/adminp", icon: <FiBarChart2 /> },
    { label: "Orders", href: "/adminp/orders", icon: <FiTruck /> },
    { label: "Products", href: "/adminp/products", icon: <FiShoppingBag /> },
    { label: "Coupons", href: "/adminp/coupons", icon: <FiTag /> },
    { label: "Metrics", href: "/adminp/metrics", icon: <FiLayout /> },
  ];

  return (
    <div className="flex min-h-screen bg-sand/50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-8 w-8 rounded-full bg-black text-sand flex items-center justify-center text-[10px] font-bold">TT</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-black">Artisan Admin</p>
              <p className="text-[8px] uppercase tracking-widest text-black/40">Studio Management</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.2em] transition-all ${
                    isActive
                      ? "bg-black text-sand shadow-lg shadow-black/10"
                      : "text-black/60 hover:bg-black/5 hover:text-black"
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-black/5 space-y-2">
            <Link href="/" className="flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-black/40 hover:text-black">
                <FiExternalLink /> View Website
            </Link>
            <div className="flex items-center gap-3 px-4 py-2">
                <div className="h-6 w-6 rounded-full bg-clay ring-1 ring-black/5" />
                <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-black truncate">{user.name}</p>
                    <p className="text-[8px] text-black/40 truncate">Master Artisan</p>
                </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-8 lg:p-12">
            {children}
        </div>
      </main>
    </div>
  );
}
