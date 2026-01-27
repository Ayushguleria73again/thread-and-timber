"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FiCreditCard, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { saveOrder } from "@/lib/orders";
import { toast } from "sonner";

export default function PaymentClient() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  
  // State Hooks (All at the top)
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateProv, setStateProv] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("India");
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useWallet, setUseWallet] = useState(false);
  const [isCheckoutSuccessful, setIsCheckoutSuccessful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address logic
  const applyAddress = (addr: any) => {
    setStreet(addr.street || addr.address || "");
    setCity(addr.city || "");
    setStateProv(addr.state || "");
    setZip(addr.zip || "");
    setCountry(addr.country || "India");
    setSelectedAddressId(addr.id || addr._id);
  };

  // 1. Initial Address Load (Only once or when user changes significantly)
  useEffect(() => {
    if (user?.addresses && (user.addresses || []).length > 0 && !selectedAddressId) {
      const addrList = user.addresses || [];
      const defaultAddr = addrList.find((a: any) => a.isDefault) || addrList[0];
      if (defaultAddr) {
          applyAddress(defaultAddr);
      }
    }
    if (user && !cardName) {
        setCardName(user.name);
    }
  }, [user, selectedAddressId, cardName]);

  // 2. Redirect Guard
  useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/payment");
    } else if (items.length === 0 && !isCheckoutSuccessful) {
      router.push("/cart");
    }
  }, [user, items.length, router]);

  // Derived Values (Memoized for stability)
  const discountAmount = useMemo(() => {
    if (!couponData) return 0;
    const applicableSubtotal = couponData.applicableCategory && couponData.applicableCategory !== "All"
      ? (items || [])
          .filter(item => (item as any).category === couponData.applicableCategory)
          .reduce((sum, item) => sum + item.price * item.quantity, 0)
      : subtotal;
    if (applicableSubtotal === 0) return 0;
    return couponData.type === 'percentage' 
      ? applicableSubtotal * (couponData.value / 100) 
      : Math.min(couponData.value, applicableSubtotal);
  }, [couponData, items, subtotal]);

  const shipping = 500;
  const tax = subtotal * 0.08;

  const rawTotal = useMemo(() => {
      return subtotal + shipping + tax - discountAmount;
  }, [subtotal, discountAmount, shipping, tax]);

  const walletAmountUsed = useMemo(() => {
      return useWallet ? Math.min(user?.walletBalance || 0, rawTotal) : 0;
  }, [useWallet, user?.walletBalance, rawTotal]);

  const total = useMemo(() => {
      return Math.max(0, rawTotal - walletAmountUsed);
  }, [rawTotal, walletAmountUsed]);

  if (!user || items.length === 0) {
    return (
        <div className="flex h-64 items-center justify-center bg-sand/50 rounded-3xl animate-pulse">
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/20">Syncing studio checkout...</p>
        </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode })
      });
      const data = await res.json();
      if (res.ok) {
        setCouponData(data);
        if (data.applicableCategory && data.applicableCategory !== "All") {
          toast.success(`Coupon "${data.code}" applied for ${data.applicableCategory} items`);
        } else {
          toast.success(`Coupon "${data.code}" applied: ${data.description}`);
        }
      } else {
        toast.error(data.message || "Invalid coupon code");
      }
    } catch (error) {
      toast.error("Failed to validate coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Card formatting helpers
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


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    // Basic validity check - Only if payment is still required
    if (total > 0) {
        if (cardNumber.replace(/\s/g, "").length < 16) {
            toast.error("Please enter a valid card number");
            return;
        }
        if (expiry.length < 7) {
            toast.error("Please enter a valid expiry date");
            return;
        }
        if (cvc.length < 3) {
            toast.error("Please enter a valid security code");
            return;
        }
    }

    const token = localStorage.getItem("thread-timber-token");
    const orderData = {
      items: (items || []).map((item: any) => ({
        product: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total,
      walletAmountUsed,
      discountAmount,
      couponCode: couponData?.code,
      email: user.email,
      shippingAddress: {
        name: cardName || user.name,
        street: street,
        city: city,
        state: stateProv,
        zip: zip,
        country: country
      }
    };

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const savedOrder = await res.json();
        setIsCheckoutSuccessful(true);
        toast.success("Order placed successfully! Entering studio foyer...");
        clearCart();
        router.push(`/orders/${savedOrder._id}`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong. Is the server running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={handleSubmit} className="rounded-[2.5rem] border border-black/5 bg-white/70 p-8 lg:p-10 shadow-soft">
        <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sand">
                <FiCreditCard className="text-xl" />
            </div>
            <div>
                <h3 className="text-lg font-serif italic text-black leading-tight">Secure Payment</h3>
                <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Encrypted Studio Transaction</p>
            </div>
        </div>

        <div className="space-y-6">
          <div className={`group transition-opacity duration-300 ${total === 0 && useWallet ? "opacity-40" : ""}`}>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 mb-2 block ml-1">Cardholder Identity</label>
            <input
              type="text"
              placeholder="Name on card"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required={total > 0}
              disabled={total === 0 && useWallet}
              autoComplete="cc-name"
              className="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm text-black outline-none focus:border-moss transition-colors disabled:cursor-not-allowed"
            />
          </div>

          <div className={`group transition-opacity duration-300 ${total === 0 && useWallet ? "opacity-40" : ""}`}>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 mb-2 block ml-1">Card Details</label>
            <div className={`overflow-hidden rounded-2xl border border-black/10 bg-white divide-y divide-black/10 focus-within:border-moss transition-colors ${total === 0 && useWallet ? "bg-black/5" : ""}`}>
                <div className="relative">
                    <input
                      type="tel"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required={total > 0}
                      disabled={total === 0 && useWallet}
                      autoComplete="cc-number"
                      inputMode="numeric"
                      className="w-full bg-transparent px-5 py-5 text-base tracking-[0.2em] text-black outline-none placeholder:text-black/10 disabled:cursor-not-allowed"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-2">
                        <div className="h-6 w-10 rounded bg-black/5" />
                        <div className="h-6 w-10 rounded bg-black/5" />
                    </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-black/10">
                    <input
                      type="tel"
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      required={total > 0}
                      disabled={total === 0 && useWallet}
                      autoComplete="cc-exp"
                      inputMode="numeric"
                      className="w-full bg-transparent px-5 py-5 text-sm tracking-widest text-black outline-none placeholder:text-black/10 disabled:cursor-not-allowed"
                    />
                    <div className="relative">
                        <input
                          type="tel"
                          placeholder="CVC"
                          value={cvc}
                          onChange={handleCvcChange}
                          required={total > 0}
                          disabled={total === 0 && useWallet}
                          autoComplete="cc-csc"
                          inputMode="numeric"
                          className="w-full bg-transparent px-5 py-5 text-sm tracking-widest text-black outline-none placeholder:text-black/10 disabled:cursor-not-allowed"
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            <FiCreditCard className="text-black/10" />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <h3 className="mt-12 text-lg font-serif italic text-black flex items-center gap-2">
            <span className="h-1 w-8 bg-moss/20 rounded-full" /> Dispatch Selection
        </h3>
        
        {user?.addresses && (user.addresses || []).length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(user.addresses || []).map((addr: any) => (
              <button
                key={addr.id || addr._id}
                type="button"
                onClick={() => applyAddress(addr)}
                className={`flex flex-col rounded-2xl border p-4 text-left transition-all ${
                  selectedAddressId === (addr.id || addr._id)
                    ? "border-moss bg-moss/[0.03] ring-1 ring-moss"
                    : "border-black/5 bg-white/50 hover:border-black/20"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="rounded-full bg-moss/10 px-2 py-0.5 text-[8px] uppercase tracking-widest text-moss">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs font-semibold text-black truncate w-full">{addr.name}</p>
                <p className="mt-1 text-[10px] text-black/60 truncate w-full">{addr.street || addr.address}</p>
                <p className="text-[10px] text-black/60 truncate w-full">{addr.city}, {addr.state}</p>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Street address"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-moss outline-none transition-colors text-black"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-moss outline-none transition-colors text-black"
            />
            <input
              type="text"
              placeholder="State / Province"
              value={stateProv}
              onChange={(e) => setStateProv(e.target.value)}
              required
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-moss outline-none transition-colors text-black"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="ZIP / Postal code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-moss outline-none transition-colors text-black"
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-moss outline-none transition-colors text-black"
            >
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
            </select>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-5 text-[10px] uppercase tracking-[0.3em] font-bold text-sand shadow-xl shadow-black/20 hover:bg-black/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiCreditCard /> {isSubmitting ? "Processing Studio Transaction..." : `Complete Artisan Acquisition — ${formatCurrency(total)}`}
        </motion.button>

        <div className="mt-12 border-t border-black/5 pt-10">
          <h3 className="text-lg font-serif italic text-black leading-tight">Exclusive Drop Code</h3>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-black/40 font-bold">Inscribe your studio referral for artisan discounts.</p>
          <div className="mt-6 flex gap-3">
            <input
              type="text"
              placeholder="e.g. STUDIO10"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={!!couponData}
              className="flex-1 rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm focus:border-moss outline-none uppercase tracking-widest disabled:bg-black/5 text-black"
            />
            {couponData ? (
              <button
                type="button"
                onClick={() => { setCouponData(null); setCouponCode(""); }}
                className="rounded-2xl border border-black/10 px-8 py-4 text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 font-bold transition-colors"
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon || !couponCode}
                className="rounded-2xl bg-moss px-10 py-4 text-[10px] uppercase tracking-widest text-sand font-bold disabled:bg-moss/40 shadow-lg shadow-moss/10 hover:shadow-moss/20 transition-all active:scale-95"
              >
                {isApplyingCoupon ? "..." : "Apply Code"}
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="rounded-[2rem] border border-black/5 bg-white/60 p-8 self-start sticky top-24 shadow-soft">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-moss mb-6">Artisan Summary</p>
        <div className="space-y-4 text-sm text-black/70">
          <div className="flex justify-between">
            <span>Handcrafted Pieces ({items.length})</span>
            <span className="font-medium text-black">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Studio Courier</span>
            <span className="font-medium text-black">{formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span>Craft Levies</span>
            <span className="font-medium text-black">{formatCurrency(tax)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-moss font-medium">
              <span>Studio Discount</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          {walletAmountUsed > 0 && (
            <div className="flex justify-between text-blue-600 font-medium">
                <span>Wallet Credit</span>
                <span>-{formatCurrency(walletAmountUsed)}</span>
            </div>
          )}
          <div className="pt-4 border-t border-black/5 flex justify-between text-lg font-serif italic text-black">
            <span>Total Acquisition</span>
            <span className="font-sans font-bold not-italic">{formatCurrency(total)}</span>
          </div>
        </div>

        {user && (user.walletBalance || 0) > 0 && (
            <div className="mt-8 pt-6 border-t border-black/5">
                <button
                    type="button"
                    onClick={() => setUseWallet(!useWallet)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all ${
                        useWallet
                            ? "border-moss bg-moss/[0.03] ring-1 ring-moss"
                            : "border-black/10 bg-white hover:border-black/20"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${useWallet ? 'bg-moss border-moss text-sand' : 'border-black/10'}`}>
                            {useWallet && <FiPlus className="text-xs" />}
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-black">Use Wallet Balance</p>
                            <p className="text-[8px] text-black/40 uppercase tracking-widest">Available: {formatCurrency(user.walletBalance || 0)}</p>
                        </div>
                    </div>
                </button>
            </div>
        )}
        
        <div className="mt-8 p-4 rounded-2xl bg-sand/40 border border-black/5">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 mb-2">Need Assistance?</p>
            <p className="text-xs text-black/70 leading-relaxed">Reach our studio team at <span className="font-bold underline">studio@threadtimber.co</span> for bespoke order queries.</p>
        </div>
      </div>
    </div>
  );
}
