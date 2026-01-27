"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiShoppingBag, FiTrash2, FiMinus, FiPlus, FiTag } from "react-icons/fi";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

export default function CartPageClient() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [discountError, setDiscountError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    
    setIsValidating(true);
    setDiscountError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code: discountCode.toUpperCase(),
          cartTotal: subtotal,
          cartItems: items
        })
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setAppliedDiscount(data.coupon);
        toast.success(`Coupon "${data.coupon.code}" applied!`);
      } else {
        setDiscountError(data.message || "Invalid or expired code");
        toast.error(data.message || "Invalid coupon code");
      }
    } catch (error) {
      setDiscountError("Failed to validate coupon");
      toast.error("Failed to validate coupon");
    } finally {
      setIsValidating(false);
    }
  };

  const calculateDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    
    // If category-specific, only apply to matching items
    if (appliedDiscount.applicableCategory) {
      const categoryTotal = items
        .filter(item => item.category === appliedDiscount.applicableCategory)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return appliedDiscount.type === "percentage"
        ? (categoryTotal * appliedDiscount.value) / 100
        : Math.min(appliedDiscount.value, categoryTotal);
    }
    
    // Apply to entire cart
    return appliedDiscount.type === "percentage"
      ? (subtotal * appliedDiscount.value) / 100
      : Math.min(appliedDiscount.value, subtotal);
  };

  const discountAmount = calculateDiscountAmount();
  const shipping = 500;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shipping + tax;

  if (items.length === 0) {
    return (
      <section className="container-pad py-16">
        <div className="rounded-3xl border border-black/5 bg-white/70 p-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-moss">
            Your cart is empty
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-black">
            Ready for a handcrafted piece?
          </h2>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand"
          >
            <FiShoppingBag /> Browse the shop
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-pad py-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-4">
          {(items || []).map((item: any) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-3xl border border-black/5 bg-white/70 p-5 sm:flex-row sm:items-center"
            >
              <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-black/5 sm:h-24 sm:w-24">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-black">{item.name}</h3>
                {item.size && (
                  <p className="text-[10px] uppercase tracking-widest text-moss font-bold mt-1">
                    Size: {item.size}
                  </p>
                )}
                <p className="text-sm text-black/70">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10"
                >
                  <FiMinus />
                </button>
                <span className="text-sm uppercase tracking-[0.24em] text-black">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10"
                >
                  <FiPlus />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="flex items-center gap-1 text-xs uppercase tracking-[0.24em] text-black/60"
              >
                <FiTrash2 /> Remove
              </button>
            </div>
          ))}
        </div>
        <div className="h-fit rounded-3xl border border-black/5 bg-white/70 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-moss">
            Order summary
          </p>
          <div className="mt-6 space-y-4">
            {/* Coupon Section */}
            <div className="border-b border-black/5 pb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-moss" />
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Have a coupon?"
                    className="w-full rounded-2xl border border-black/10 bg-white/50 py-2.5 pl-10 pr-4 text-sm placeholder:text-black/30 focus:border-black/20 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleApplyDiscount}
                  disabled={isValidating || !discountCode.trim()}
                  className="rounded-2xl bg-black px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-sand transition-all hover:bg-black/90 disabled:opacity-50"
                >
                  {isValidating ? "..." : "Apply"}
                </button>
              </div>
              {discountError && (
                <p className="mt-2 text-[10px] text-red-500">{discountError}</p>
              )}
              {appliedDiscount && (
                <div className="mt-2 flex items-center justify-between rounded-xl bg-moss/10 px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-moss">
                    Coupon "{appliedDiscount.code}" applied
                  </span>
                  <button
                    onClick={() => {
                      setAppliedDiscount(null);
                      setDiscountCode("");
                    }}
                    className="text-moss hover:text-moss/80"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 text-sm text-black/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-moss font-medium">
                  <span>Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-black pt-2 border-t border-black/5">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          <Link
            href={user ? "/payment" : "/auth/login?redirect=/payment"}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand"
          >
            <FiShoppingBag /> Checkout
          </Link>
          <button
            onClick={clearCart}
            className="mt-3 w-full rounded-full border border-black/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-black"
          >
            Clear cart
          </button>
        </div>
      </div>
    </section>
  );
}

