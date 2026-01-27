"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiCreditCard, FiArrowLeft, FiGift, FiShield } from "react-icons/fi";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatCurrency } from "@/lib/utils";

export default function GiftCardCheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [pendingData, setPendingData] = useState<any>(null);
  
  // Payment states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("thread-timber-gift-card-pending");
    if (!stored) {
      router.push("/gift-cards");
      return;
    }
    setPendingData(JSON.parse(stored));
    if (user) setCardName(user.name);
  }, [user, router]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + " / " + value.slice(2);
    }
    setExpiry(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    setCvc(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !pendingData) return;

    if (cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Invalid card number");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("thread-timber-token");
      
      const res = await fetch(`${apiUrl}/gift-cards/purchase`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(pendingData),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Artisan token for ₹${pendingData.amount} dispatched! Code: ${data.code}`);
        localStorage.removeItem("thread-timber-gift-card-pending");
        router.push("/dashboard");
      } else {
        toast.error("Order transmission error");
      }
    } catch (error) {
      toast.error("Studio server unavailable");
    } finally {
      setLoading(false);
    }
  };

  if (!pendingData) return null;

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="group mb-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 hover:text-black transition-colors"
          >
            <FiArrowLeft className="text-sm transition-transform group-hover:-translate-x-1" />
            Selection Summary
          </button>

          <SectionHeading
            label="Acquisition"
            title="Secure Artisan Dispatch"
            subtitle="Finalize your gift card purchase using our encrypted studio payment gateway."
          />

          <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_350px]">
            {/* Payment Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2.5rem] border border-black/5 bg-white/70 p-8 shadow-soft backdrop-blur-xl md:p-12"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-1">Cardholder Name</label>
                  <input
                    placeholder="Enter full name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-black/5 bg-sand/30 px-5 py-4 text-sm outline-none transition-all focus:border-black/10 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-1">Card Details</label>
                  <div className="overflow-hidden rounded-2xl border border-black/5 bg-sand/30 divide-y divide-black/5">
                    <input
                      type="tel"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                      className="w-full bg-transparent px-5 py-5 text-base tracking-[0.2em] outline-none"
                    />
                    <div className="grid grid-cols-2 divide-x divide-black/5">
                        <input
                            type="tel"
                            placeholder="MM / YY"
                            value={expiry}
                            onChange={handleExpiryChange}
                            required
                            className="bg-transparent px-5 py-5 text-sm tracking-widest outline-none"
                        />
                        <input
                            type="tel"
                            placeholder="CVC"
                            value={cvc}
                            onChange={handleCvcChange}
                            required
                            className="bg-transparent px-5 py-5 text-sm tracking-widest outline-none"
                        />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-black/5 p-4 text-[10px] uppercase tracking-widest text-black/40 font-bold">
                    <FiShield className="text-base text-moss" />
                    256-bit Himalayan Encryption Active
                </div>

                <button
                  disabled={loading}
                  className="w-full rounded-full bg-black py-4 text-[10px] uppercase tracking-[0.4em] font-bold text-sand shadow-lg shadow-black/10 transition-all hover:bg-black/90 active:scale-[0.98] disabled:bg-black/40"
                >
                  {loading ? "Authorizing..." : `Authorize Dispatch — ₹${pendingData.amount}`}
                </button>
              </form>
            </motion.div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
                <div className="rounded-[2rem] border border-black/5 bg-white/40 p-8 shadow-soft blur-backdrop-sm">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 mb-6 pb-4 border-b border-black/5">Token Summary</h4>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <FiGift className="text-moss" />
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Item</p>
                                <p className="text-sm font-serif italic text-black">Artisan Gift Card</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Recipient</p>
                            <p className="mt-1 text-sm text-black truncate">{pendingData.recipientEmail}</p>
                        </div>
                        {pendingData.message && (
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Message</p>
                                <p className="mt-1 text-[10px] text-black/60 italic leading-relaxed">{pendingData.message}</p>
                            </div>
                        )}
                        <div className="pt-4 mt-4 border-t border-black/5">
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40">Total Credit</p>
                            <p className="mt-2 text-3xl font-serif italic text-black">₹{pendingData.amount}</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
