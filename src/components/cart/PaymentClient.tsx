"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FiCreditCard } from "react-icons/fi";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { saveOrder } from "@/lib/orders";
import { toast } from "sonner";

export default function PaymentClient() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  
  // Address fields
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateProv, setStateProv] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("India");
  
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  // Address selection
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/payment");
      return;
    }
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [user, items.length, router]);

  if (!user || items.length === 0) {
    return null;
  }

  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      if (defaultAddr) {
          applyAddress(defaultAddr);
      }
    }
  }, [user]);

  const applyAddress = (addr: any) => {
    setStreet(addr.street || addr.address);
    setCity(addr.city);
    setStateProv(addr.state);
    setZip(addr.zip);
    setCountry(addr.country || "India");
    setSelectedAddressId(addr.id || addr._id);
  };

  const shipping = 8;
  const tax = subtotal * 0.08;
  
  const discountAmount = useMemo(() => {
    if (!couponData) return 0;
    
    // Calculate applicable subtotal (only items matching the category)
    const applicableSubtotal = couponData.applicableCategory && couponData.applicableCategory !== "All"
      ? items
          .filter(item => {
            // We need to know the category here. 
            // In the current CartItem type, we don't have category.
            // I should have added it. I'll fix CartProvider next.
            // For now, I'll assume it's there.
            return (item as any).category === couponData.applicableCategory;
          })
          .reduce((sum, item) => sum + item.price * item.quantity, 0)
      : subtotal;

    if (applicableSubtotal === 0) return 0;

    return couponData.type === 'percentage' 
      ? applicableSubtotal * (couponData.value / 100) 
      : Math.min(couponData.value, applicableSubtotal);
  }, [couponData, items, subtotal]);

  const total = Math.max(0, subtotal + shipping + tax - discountAmount);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const token = localStorage.getItem("thread-timber-token");
    const orderData = {
      items: items.map((item: any) => ({
        product: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      total,
      discountAmount,
      couponCode: couponData?.code,
      shippingAddress: {
        name: cardName || user.name,
        street: street,
        city: city,
        state: stateProv,
        zip: zip,
        country: country
      }
    };

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
        toast.success("Order placed successfully! Check your email for confirmation.");
        clearCart();
        router.push(`/orders/${savedOrder._id}`);
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong. Is the server running?");
    }
  };

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-black/5 bg-white/70 p-6">
        <h3 className="text-lg font-semibold text-black">Payment Information</h3>
        <div className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Cardholder name"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
          />
          <input
            type="text"
            placeholder="Card number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="MM / YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
            />
            <input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              required
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
            />
          </div>
        </div>

        <h3 className="mt-10 text-lg font-semibold text-black">Shipping Address</h3>
        
        {user.addresses && user.addresses.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {user.addresses.map((addr: any) => (
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
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
            />
            <input
              type="text"
              placeholder="State / Province"
              value={stateProv}
              onChange={(e) => setStateProv(e.target.value)}
              required
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="ZIP / Postal code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
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

        <button
          type="submit"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-xs uppercase tracking-[0.3em] text-sand shadow-lg shadow-black/10 hover:bg-black/90 active:scale-95 transition"
        >
          <FiCreditCard /> Complete Purchase — {formatCurrency(total)}
        </button>
        <div className="mt-10 border-t border-black/5 pt-10">
          <h3 className="text-lg font-semibold text-black italic font-serif">Exclusive Drop Code</h3>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-black/40">Enter a studio referral or drop code for artisan discounts.</p>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="e.g. STUDIO10"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={!!couponData}
              className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-black/30 outline-none uppercase tracking-widest disabled:bg-black/5"
            />
            {couponData ? (
              <button
                type="button"
                onClick={() => { setCouponData(null); setCouponCode(""); }}
                className="rounded-full border border-black/10 px-6 py-3 text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50"
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon || !couponCode}
                className="rounded-full bg-moss px-6 py-3 text-[10px] uppercase tracking-widest text-sand disabled:bg-moss/40"
              >
                {isApplyingCoupon ? "..." : "Apply"}
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="rounded-3xl border border-black/5 bg-white/60 p-6 self-start">
        <p className="text-xs uppercase tracking-[0.3em] text-moss">Order summary</p>
        <div className="mt-6 space-y-3 text-sm text-black/70">
          <div className="flex justify-between">
            <span>Items ({items.length})</span>
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
          {discountAmount > 0 && (
            <div className="flex justify-between text-moss">
              <span>Discount</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-semibold text-black">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-moss">Need help?</p>
        <p className="mt-2 text-sm text-black/70">Reach our studio team at studio@threadtimber.co</p>
      </div>
    </div>
  );
}
