"use client";

import Link from "next/link";
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
    { label: "Dashboard", href: "/dashboard", icon: <FiLayout /> },
    { label: "My Orders", href: "/dashboard/orders", icon: <FiPackage /> },
    { label: `Wishlist (${wishlistItems.length})`, href: "/dashboard/wishlist", icon: <FiHeart /> },
    { label: "Settings", href: "/dashboard/settings", icon: <FiSettings /> },
    { label: "Log out", href: "#", icon: <FiLogOut />, onClick: logout },
  ] : [];

  // Custom renderer for account items to handle the logout click
  const renderAccountDropdown = () => {
    if (!user) return null;

    return (
      <Dropdown
        align="right"
        trigger={
          <button className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-black transition-colors hover:border-black/30">
            <FiUser /> {user.name.split(" ")[0]} <FiChevronDown />
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
    <header className="sticky top-0 z-50 border-b border-black/5 bg-sand/80 backdrop-blur-md">
      <div className="container-pad flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-full bg-black text-sand transition-transform group-hover:scale-105">
            <span className="flex h-full w-full items-center justify-center text-xs font-semibold tracking-[0.2em]">
              TT
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="font-serif text-base italic font-medium tracking-[0.1em]">
              Thread & Timber
            </p>
            <p className="text-[10px] text-black/60 uppercase tracking-widest">Handcrafted apparel</p>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchBar />
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              renderAccountDropdown()
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-black transition-colors hover:border-black/30"
                >
                  <FiUser /> <span className="hidden sm:inline">Log in</span>
                </Link>
              </div>
            )}

            <Link
              href="/cart"
              className="group relative flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-black transition-colors hover:border-black/30"
            >
              <FiShoppingBag className="transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="ml-1 font-semibold">({itemCount})</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

