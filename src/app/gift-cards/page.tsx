"use client";

import { useState } from "react";
import { FiGift, FiPlus, FiCreditCard, FiLock, FiEdit2, FiArrowLeft } from "react-icons/fi";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GIFT_CARD_AMOUNTS = [500, 1000, 2500, 5000, 10000];

export default function GiftCardsPage() {
  const { user, refreshWalletBalance } = useAuth();
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handlePurchaseNavigation = () => {
    if (!user) {
      toast.error("Please log in to purchase gift cards");
      return;
    }
    
    if (!recipientEmail) {
      toast.error("Recipient email is required");
      return;
    }

    const amount = selectedAmount || Number(customAmount);
    if (!amount || amount < 100) {
      toast.error("Minimum gift card amount is ₹100");
      return;
    }

    // Save gift card intent to local storage or state management before redirecting to checkout
    const giftCardData = {
        amount,
        recipientEmail,
        message
    };
    localStorage.setItem("thread-timber-gift-card-pending", JSON.stringify(giftCardData));
    
    router.push("/gift-cards/checkout");
  };

  const handleRedeem = async () => {
    if (!user) {
        toast.error("Please log in to redeem gift cards");
        return;
    }

    if (!redeemCode) {
        toast.error("Please enter a code");
        return;
    }

    setIsRedeeming(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("thread-timber-token");
      const res = await fetch(`${apiUrl}/gift-cards/redeem`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code: redeemCode }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Redeemed! ₹${data.newBalance - (user.walletBalance || 0)} added to your virtual wallet.`);
        setRedeemCode("");
        refreshWalletBalance();
      } else {
        toast.error(data.message || "Invalid or already redeemed card");
      }
    } catch (error) {
        toast.error("Studio server error");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/shop" 
            className="group mb-8 flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 hover:text-black transition-colors"
          >
            <FiArrowLeft className="text-sm transition-transform group-hover:-translate-x-1" />
            Back to Drop
          </Link>
          <SectionHeading
            label="Artist Tokens"
            title="The Gift of Handcrafted Choice"
            subtitle="Share the Thread & Timber collection with those who value texture and story."
          />
          
          <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_400px]">
            {/* Main Selection Area */}
            <div className="space-y-12">
              {/* Purchase Card */}
              <div className="rounded-[2.5rem] border border-black/5 bg-white/70 p-8 shadow-soft backdrop-blur-xl md:p-12">
                <div className="mb-10 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-sand shadow-lg">
                    <FiGift className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif italic text-black">Gift Card Selection</h3>
                    <p className="text-xs text-black/40 uppercase tracking-widest mt-1">Select your artisan credit</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  {GIFT_CARD_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                        setShowManualInput(false);
                      }}
                      className={`rounded-2xl border py-6 text-sm font-bold transition-all ${
                        selectedAmount === amount && !showManualInput
                          ? "border-black bg-black text-sand shadow-lg shadow-black/10"
                          : "border-black/5 bg-sand/30 text-black/40 hover:border-black/10"
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                        setShowManualInput(true);
                        setSelectedAmount(0);
                    }}
                    className={`flex flex-col items-center justify-center rounded-2xl border py-6 text-[10px] uppercase tracking-widest font-bold transition-all ${
                        showManualInput
                          ? "border-black bg-black text-sand shadow-lg shadow-black/10"
                          : "border-black/5 bg-sand/30 text-black/40 hover:border-black/10"
                      }`}
                  >
                    <FiPlus className="mb-1 text-sm" />
                    Manual
                  </button>
                </div>

                <AnimatePresence>
                    {showManualInput && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-8 space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-1">Manual Amount (Minimum ₹100)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 text-sm">₹</span>
                                    <input
                                        type="number"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        placeholder="Enter manual amount..."
                                        className="w-full rounded-2xl border border-black/5 bg-sand/30 pl-10 pr-4 py-4 text-sm outline-none transition-all focus:border-black/10 focus:bg-white"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-8 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-1">Recipient Email</label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="artisan@example.com"
                        className="w-full rounded-2xl border border-black/5 bg-sand/30 px-5 py-4 text-sm outline-none transition-all focus:border-black/10 focus:bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-1">Dispatch Method</label>
                        <div className="flex items-center gap-2 rounded-2xl border border-black/5 bg-sand/10 px-5 py-4 text-sm text-black/40 italic">
                            Digital Credit Drop (Email)
                        </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-1">Personal Message (Optional)</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="A story for the recipient..."
                        className="w-full rounded-2xl border border-black/5 bg-sand/30 px-5 py-4 text-sm outline-none transition-all focus:border-black/10 focus:bg-white resize-none"
                        rows={4}
                    />
                  </div>

                  <div className="rounded-3xl bg-black p-8 text-sand shadow-lg shadow-black/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">Total Credit</p>
                            <p className="mt-1 text-3xl font-serif italic">₹{selectedAmount || customAmount || 0}</p>
                        </div>
                        <button
                            onClick={handlePurchaseNavigation}
                            className="rounded-full bg-sand px-8 py-3 text-[10px] uppercase tracking-[0.3em] font-bold text-black transition-all hover:scale-105 active:scale-95"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Redemption & Balance */}
            <div className="space-y-8 lg:pt-4">
              {/* Virtual Wallet View */}
              <div className="rounded-[2.5rem] border border-black/5 bg-white/40 p-8 shadow-soft backdrop-blur-xl">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 mb-8 border-b border-black/5 pb-4">Virtual Wallet</h3>
                
                {user ? (
                    <div className="space-y-6">
                        <div className="rounded-2xl bg-black px-6 py-8 text-sand shadow-lg shadow-black/10">
                            <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">Available Balance</p>
                            <p className="mt-2 text-3xl font-serif italic">{formatCurrency(user.walletBalance || 0)}</p>
                            <div className="mt-6 flex items-center gap-2 text-[8px] uppercase tracking-widest font-bold text-moss">
                                <FiCreditCard /> Verified Artisan Account
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-black/40">Redeem Artisan Token</h4>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={redeemCode}
                                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                                    placeholder="ENTER 12-CHAR CODE"
                                    className="w-full rounded-xl border border-black/5 bg-sand/30 px-4 py-3 text-xs font-mono outline-none transition-all focus:border-black/10 focus:bg-white"
                                />
                                <button
                                    onClick={handleRedeem}
                                    disabled={isRedeeming || !redeemCode}
                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white py-3 text-[10px] uppercase tracking-[0.2em] font-bold text-black transition-all hover:bg-black hover:text-sand disabled:opacity-30"
                                >
                                    <FiPlus /> {isRedeeming ? "Verifying..." : "Redeem into Wallet"}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sand/50 text-black/20">
                            <FiLock className="text-2xl" />
                        </div>
                        <p className="text-sm text-black/60 italic leading-relaxed">Please log in to your studio account to access your virtual wallet and redeem tokens.</p>
                    </div>
                )}
              </div>

              {/* Gift Card Benefits */}
              <div className="rounded-[2.5rem] bg-moss p-10 text-sand shadow-lg shadow-moss/10">
                <h4 className="font-serif text-xl italic leading-tight">Shared Himalayan Art.</h4>
                <ul className="mt-6 space-y-4">
                    <li className="flex gap-3 text-[10px] uppercase tracking-widest opacity-80">
                        <span className="text-moss-light">✦</span> No Expiration
                    </li>
                    <li className="flex gap-3 text-[10px] uppercase tracking-widest opacity-80">
                        <span className="text-moss-light">✦</span> Unified Studio Wallet
                    </li>
                    <li className="flex gap-3 text-[10px] uppercase tracking-widest opacity-80">
                        <span className="text-moss-light">✦</span> Direct Digital Dispatch
                    </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
