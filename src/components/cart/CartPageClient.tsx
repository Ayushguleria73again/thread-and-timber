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
  const shipping = 8;
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
          <div className="mt-6 space-y-3">
            <div className="space-y-3 text-sm text-black/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-black">
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

