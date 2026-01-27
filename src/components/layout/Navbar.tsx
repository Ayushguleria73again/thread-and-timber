"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiUser, FiShoppingBag, FiHeart, FiChevronDown, FiSettings, FiLogOut, FiLayout, FiPackage } from "react-icons/fi";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWishlist } from "@/components/auth/WishlistProvider";
import SearchBar from "@/components/layout/SearchBar";
import Dropdown from "@/components/ui/Dropdown";

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const accountItems = user ? [
    { label: "Dashboard", href: "/dashboard", icon: <FiLayout className="text-moss" /> },
    { label: "My Orders", href: "/dashboard/orders", icon: <FiPackage className="text-moss" /> },
    { label: `Wishlist (${wishlistItems.length})`, href: "/dashboard/wishlist", icon: <FiHeart className="text-moss" /> },
    { label: "Settings", href: "/dashboard/settings", icon: <FiSettings className="text-moss" /> },
    { label: "Log out", href: "#", icon: <FiLogOut className="text-red-400" />, onClick: logout },
  ] : [];

  const renderAccountDropdown = () => {
    if (!user) return null;

    return (
      <Dropdown
        align="right"
        trigger={
          <button className="flex items-center gap-2 rounded-full border border-black/[0.03] bg-white/40 px-4 py-2.5 text-[10px] uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-white hover:shadow-soft active:scale-95">
            <FiUser className="text-xs" /> {user.name.split(" ")[0]} <FiChevronDown className="opacity-30" />
          </button>
        }
        items={(accountItems || []).map(item => ({
          ...item,
          href: item.label === "Log out" ? "" : item.href
        }))}
      />
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Background Layer with subtle gradient and blur */}
      <div className="absolute inset-0 border-b border-black/[0.03] bg-[#FAF8F6]/80 backdrop-blur-xl transition-all duration-500" />
      
      <div className="container-pad relative flex items-center justify-between py-5 lg:py-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative h-10 w-10 flex items-center justify-center rounded-full bg-black text-sand transition-all duration-500 group-hover:rotate-[360deg] shadow-massive">
            <span className="text-[10px] font-bold tracking-[0.2em] transform transition-transform group-hover:scale-90">
              TT
            </span>
            <div className="absolute -inset-1 rounded-full border border-moss/20 animate-[spin_10s_linear_infinite]" />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-serif text-lg italic font-medium tracking-[0.05em] text-black">
                Thread & Timber
              </p>
              <p className="text-[8px] text-black/30 uppercase tracking-[0.4em] font-bold mt-0.5">Handcrafted Studio</p>
            </motion.div>
          </div>
        </Link>

        {/* Center Search - Desktop Only */}
        <div className="hidden lg:block flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="lg:hidden">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              renderAccountDropdown()
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-3 rounded-full border border-black/[0.03] bg-white/40 px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] font-bold text-black transition-all hover:bg-white hover:shadow-soft active:scale-95"
              >
                <FiUser className="text-xs" /> 
                <span className="hidden sm:inline">Join Us</span>
              </Link>
            )}

            <Link
              href="/cart"
              className="group relative flex items-center gap-3 rounded-full bg-black px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] font-bold text-sand transition-all hover:bg-black/90 shadow-xl shadow-black/10 active:scale-95"
            >
              <FiShoppingBag className="text-xs transition-transform group-hover:-rotate-12" />
              <span className="hidden sm:inline">Collection</span>
              {itemCount > 0 && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-sand text-black text-[8px] font-black">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

