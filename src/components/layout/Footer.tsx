"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

export default function Footer() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("http://localhost:5001/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        toast.success("Welcome to the studio list!");
      } else {
        setStatus("error");
        toast.error("Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("error");
      toast.error("Something went wrong.");
    }
  };

  return (
    <footer className="border-t border-black/5 bg-sand">
      <div className="container-pad py-16 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-lg italic font-medium text-black">
              Crafted in small batches
            </p>
            <p className="mt-4 text-sm leading-relaxed text-black/60 font-sans">
              Each piece is cut, stitched, and finished by hand in our studio. We
              ship worldwide in recycled packaging.
            </p>
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black mb-4">Newsletter</p>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Sign up for drops"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-full border border-black/10 bg-white/50 px-4 py-2 text-xs outline-none focus:border-black/30"
                />
                <button
                  disabled={status === "loading"}
                  className="rounded-full bg-black px-4 py-2 text-[10px] uppercase tracking-widest text-sand"
                >
                  {status === "loading" ? "..." : "Join"}
                </button>
              </form>
              {status === "success" && <p className="mt-2 text-[10px] text-moss uppercase tracking-widest">Added to atelier list</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 text-[10px] uppercase tracking-[0.2em] sm:grid-cols-4 lg:gap-x-12">
            <div className="space-y-4">
              <p className="font-bold text-black">Shop</p>
              <div className="flex flex-col gap-2 text-black/50">
                <Link href="/shop" className="hover:text-black transition-colors">All Products</Link>
                <Link href="/gift-cards" className="hover:text-black transition-colors">Gift Cards</Link>
                <Link href="/size-guide" className="hover:text-black transition-colors">Size Guide</Link>
              </div>
            </div>
            <div className="space-y-4">
              <p className="font-bold text-black">Info</p>
              <div className="flex flex-col gap-2 text-black/50">
                <Link href="/about" className="hover:text-black transition-colors">About</Link>
                <Link href="/blog" className="hover:text-black transition-colors">Blog</Link>
                <Link href="/faq" className="hover:text-black transition-colors">FAQ</Link>
              </div>
            </div>
            <div className="space-y-4">
              <p className="font-bold text-black">Policies</p>
              <div className="flex flex-col gap-2 text-black/50">
                <Link href="/shipping" className="hover:text-black transition-colors">Shipping</Link>
                <Link href="/returns" className="hover:text-black transition-colors">Returns</Link>
                <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
              </div>
            </div>
            <div className="space-y-4">
              <p className="font-bold text-black">Account</p>
              <div className="flex flex-col gap-2 text-black/50">
                <Link href="/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
                {!user && (
                  <Link href="/auth/login" className="hover:text-black transition-colors">Login</Link>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-black/[0.03] pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-[10px] uppercase tracking-[0.2em] text-black/40">
          <p>© 2026 Thread & Timber Studio</p>
          <p>Handcrafted for mindful makers</p>
        </div>
      </div>
    </footer>
  );
}
