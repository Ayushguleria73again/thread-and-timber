"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiTag, FiCalendar, FiPercent, FiDollarSign } from "react-icons/fi";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "percentage",
    value: 0,
    expiryDate: "",
    description: "",
    applicableCategory: "All"
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      const token = localStorage.getItem("thread-timber-token");
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ;
        const res = await fetch(`${apiUrl}/admin/coupons`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCoupons(data);
        }
      } catch (error) {
        toast.error("Failed to fetch active coupons");
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("thread-timber-token");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ;
      const res = await fetch(`${apiUrl}/admin/coupons`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newCoupon)
      });
      if (res.ok) {
        const data = await res.json();
        setCoupons([data, ...coupons]);
        setIsAdding(false);
        setNewCoupon({ code: "", type: "percentage", value: 0, expiryDate: "", description: "", applicableCategory: "All" });
        toast.success(`Coupon ${data.code} created for the studio`);
      }
    } catch (error) {
      toast.error("Failed to create promotion");
    }
  };

  const deleteCoupon = async (id: string) => {
    const token = localStorage.getItem("thread-timber-token");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ;
      const res = await fetch(`${apiUrl}/admin/coupons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c._id !== id));
        toast.success("Promotion removed from studio");
      }
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Promotions & Drops</h2>
          <p className="text-[10px] uppercase tracking-widest text-black/40 mt-1">Manage studio referral and exclusive drop codes.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 rounded-2xl bg-black px-6 py-2 text-[10px] uppercase tracking-widest text-sand shadow-lg shadow-black/10 transition hover:bg-black/90 active:scale-95"
          >
            <FiPlus /> New Coupon
          </button>
        )}
      </div>

      {isAdding && (
         <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-soft animate-in fade-in slide-in-from-top-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-black mb-6">Create New Drop Code</h3>
            <form onSubmit={handleAdd} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
               <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 block">Promo Code</label>
                  <input 
                    required 
                    placeholder="e.g. STUDIO10" 
                    className="w-full rounded-2xl border border-black/5 bg-sand/30 px-4 py-3 text-sm focus:border-black/10 outline-none uppercase tracking-widest"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  />
               </div>
               <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 block">Type</label>
                  <select 
                    className="w-full rounded-2xl border border-black/5 bg-sand/30 px-4 py-3 text-sm focus:border-black/10 outline-none appearance-none cursor-pointer"
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
               </div>
               <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 block">Value</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full rounded-2xl border border-black/5 bg-sand/30 px-4 py-3 text-sm focus:border-black/10 outline-none"
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                  />
               </div>
               <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 block">Expiry Date</label>
                  <input 
                    required 
                    type="date" 
                    className="w-full rounded-2xl border border-black/5 bg-sand/30 px-4 py-3 text-sm focus:border-black/10 outline-none"
                    value={newCoupon.expiryDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                  />
               </div>
               <div className="sm:col-span-2 lg:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 block">Description</label>
                  <input 
                    placeholder="e.g. 10% off for mindful makers" 
                    className="w-full rounded-2xl border border-black/5 bg-sand/30 px-4 py-3 text-sm focus:border-black/10 outline-none"
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  />
               </div>
               <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 text-[10px] uppercase tracking-widest text-black/40 hover:text-black">Cancel</button>
                  <button type="submit" className="rounded-full bg-black px-8 py-3 text-[10px] uppercase tracking-widest text-sand shadow-lg shadow-black/10">Create Artisan Drop</button>
               </div>
            </form>
         </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {loading ? (
            Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-40 rounded-3xl bg-white/50 animate-pulse border border-black/5" />
            ))
        ) : coupons.map((coupon: any) => (
          <div key={coupon._id} className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-soft transition-hover hover:border-black/10">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sand text-black/60 shadow-inner group-hover:bg-moss group-hover:text-sand transition-colors">
                {coupon.type === 'percentage' ? <FiPercent /> : <FiDollarSign />}
              </div>
              <button 
                onClick={() => deleteCoupon(coupon._id)}
                className="rounded-xl p-2 text-black/20 hover:bg-red-50 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
            
            <div className="mt-6 flex items-baseline gap-2">
                <h3 className="text-xl font-bold uppercase tracking-widest text-black">{coupon.code}</h3>
                <span className="text-[10px] font-bold text-moss">
                    {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-black/40 truncate">{coupon.description}</p>
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-[8px] uppercase tracking-widest text-black/40 font-bold border border-black/5">
                    {coupon.applicableCategory || 'All'}
                </span>
            </div>
            
            <div className="mt-8 flex items-center justify-between border-t border-black/[0.03] pt-4">
                <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-black/40 font-bold">
                    <FiCalendar /> Expires {new Date(coupon.expiryDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-moss font-bold">
                    <div className="h-1.5 w-1.5 rounded-full bg-moss animate-pulse" /> Active
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
