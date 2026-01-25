"use client";

import { useState } from "react";
import { FiGift } from "react-icons/fi";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";

const GIFT_CARD_AMOUNTS = [25, 50, 100, 150, 200];

export default function GiftCardsPage() {
  const { user } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");

  const handlePurchase = () => {
    if (!user) {
      alert("Please log in to purchase gift cards");
      return;
    }
    alert(
      `Gift card of $${selectedAmount || customAmount} would be sent to ${recipientEmail}`
    );
  };

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Gift Cards"
          title="Give the gift of handcrafted style"
          subtitle="Purchase a gift card for someone special to choose their favorite pieces."
        />
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <h3 className="mb-6 flex items-center gap-2 font-semibold text-black">
              <FiGift /> Select Amount
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {GIFT_CARD_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                    selectedAmount === amount && !customAmount
                      ? "border-moss bg-moss text-sand"
                      : "border-black/10 text-black"
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                placeholder="Custom amount"
                min="10"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <h3 className="mb-6 font-semibold text-black">Recipient Details</h3>
            <div className="space-y-4">
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Recipient email"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                required
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Personal message (optional)"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                rows={4}
              />
              <div className="rounded-2xl border border-black/5 bg-sand/50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-moss">
                  Total
                </p>
                <p className="mt-2 text-2xl font-semibold text-black">
                  ${selectedAmount || customAmount || 0}
                </p>
              </div>
              <button
                onClick={handlePurchase}
                className="w-full rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand"
              >
                Purchase Gift Card
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
