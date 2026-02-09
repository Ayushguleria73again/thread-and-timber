"use client";

import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag, FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";

export default function CartPageClient() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <section className="container-pad py-16">
        <div className="rounded-3xl border border-black/5 bg-white/70 p-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-moss">
            Your cart is empty
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-ink">
            Ready for a handcrafted piece?
          </h2>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand"
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
          {items.map((item) => (
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
                <h3 className="text-lg font-semibold text-ink">{item.name}</h3>
                <p className="text-sm text-ink/70">${item.price}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10"
                >
                  <FiMinus />
                </button>
                <span className="text-sm uppercase tracking-[0.24em] text-ink">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10"
                >
                  <FiPlus />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="flex items-center gap-1 text-xs uppercase tracking-[0.24em] text-ink/60"
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
          <div className="mt-6 space-y-3 text-sm text-ink/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$8.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${(subtotal * 0.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-ink">
              <span>Total</span>
              <span>${(subtotal + 8 + subtotal * 0.08).toFixed(2)}</span>
            </div>
          </div>
          <Link
            href={user ? "/payment" : "/auth/login?redirect=/payment"}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand"
          >
            <FiShoppingBag /> Checkout
          </Link>
          <button
            onClick={clearCart}
            className="mt-3 w-full rounded-full border border-ink/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-ink"
          >
            Clear cart
          </button>
        </div>
      </div>
    </section>
  );
}

