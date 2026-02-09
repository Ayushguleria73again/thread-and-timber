"use client";

import Link from "next/link";
import { FiUser, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  return (
    <header className="border-b border-black/5 bg-sand/80 backdrop-blur">
      <div className="container-pad flex items-center justify-between py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-ink text-sand">
            <span className="flex h-full w-full items-center justify-center text-xs font-semibold tracking-[0.2em]">
              TT
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em]">
              Thread & Timber
            </p>
            <p className="text-xs text-ink/60">Handcrafted apparel</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.25em] text-ink/70 md:flex">
          <Link href="/shop">Shop</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden items-center gap-2 text-xs uppercase tracking-[0.24em] text-ink/70 sm:flex">
                <FiUser /> Hi, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={logout}
                className="rounded-full border border-ink/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-ink"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-ink"
              >
                <FiUser /> Log in
              </Link>
              <Link
                href="/auth/signup"
                className="hidden rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.24em] text-sand sm:inline"
              >
                Sign up
              </Link>
            </>
          )}
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-ink"
          >
            <FiShoppingBag /> Cart ({itemCount})
          </Link>
        </div>
      </div>
    </header>
  );
}

