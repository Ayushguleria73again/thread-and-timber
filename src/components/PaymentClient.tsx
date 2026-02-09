"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiCreditCard } from "react-icons/fi";
import { useCart } from "@/components/CartProvider";
import type { User } from "@/lib/auth";

type PaymentClientProps = {
  user: User;
};

export default function PaymentClient({ user }: PaymentClientProps) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const shipping = 8;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearCart();
    router.push("/shop?order=success");
  };

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-black/5 bg-white/70 p-6">
        <h3 className="text-lg font-semibold text-ink">Billing details</h3>
        <input
          type="text"
          placeholder="Cardholder name"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          required
          className="mt-4 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm"
        />
        <input
          type="text"
          placeholder="Card number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
          className="mt-4 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="MM / YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            required
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm"
          />
          <input
            type="text"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            required
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm"
          />
        </div>
        <input
          type="text"
          placeholder="Billing address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="mt-4 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm"
        />
        <button
          type="submit"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand"
        >
          <FiCreditCard /> Pay ${total.toFixed(2)}
        </button>
      </form>
      <div className="rounded-3xl border border-black/5 bg-white/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-moss">Order summary</p>
        <div className="mt-6 space-y-3 text-sm text-ink/70">
          <div className="flex justify-between">
            <span>Items ({items.length})</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-ink">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-moss">Need help?</p>
        <p className="mt-2 text-sm text-ink/70">Reach our studio team at studio@threadtimber.co</p>
      </div>
    </div>
  );
}
