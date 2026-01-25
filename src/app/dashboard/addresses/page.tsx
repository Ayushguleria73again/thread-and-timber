"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMapPin, FiPlus, FiTrash2, FiCheck } from "react-icons/fi";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";
import { type Address } from "@/lib/auth";

export default function AddressesPage() {
  const router = useRouter();
  const { user, updateAddresses } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    label: "Home",
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US"
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/dashboard/addresses");
    }
  }, [user, router]);

  const handleAdd = async () => {
    if (!formData.name || !formData.street) return;
    
    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      label: formData.label,
      name: formData.name,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      country: formData.country,
      isDefault: (user?.addresses?.length || 0) === 0
    };

    const updated = [...(user?.addresses || []), newAddress];
    await updateAddresses(updated);
    
    setFormData({
      label: "Home",
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "US"
    });
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    const updated = (user?.addresses || []).filter((addr) => addr.id !== id);
    await updateAddresses(updated);
  };

  const setDefault = async (id: string) => {
    const updated = (user?.addresses || []).map((addr) => ({
      ...addr,
      isDefault: addr.id === id
    }));
    await updateAddresses(updated);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Addresses"
          title="Saved addresses"
          subtitle="Manage your shipping addresses for faster checkout."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {(user.addresses || []).map((address) => (
            <div
              key={address.id}
              className={`rounded-3xl border p-6 transition-all ${
                address.isDefault ? "border-moss bg-moss/[0.03]" : "border-black/5 bg-white/70"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block rounded-full border border-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-black/60">
                      {address.label}
                    </span>
                    {address.isDefault && (
                        <span className="flex items-center gap-1 rounded-full bg-moss px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-sand">
                            <FiCheck /> Default
                        </span>
                    )}
                  </div>
                  <p className="font-semibold text-black">{address.name}</p>
                  <p className="mt-2 text-sm text-black/70">{address.street}</p>
                  <p className="text-sm text-black/70">
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-sm text-black/70">{address.country}</p>
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => setDefault(address.id)}
                      className="rounded-full border border-black/10 p-2 hover:border-moss hover:text-moss transition-colors"
                      title="Set as Default"
                    >
                      <FiCheck className="text-sm" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="rounded-full border border-black/10 p-2 hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {isAdding ? (
            <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
              <h3 className="mb-4 font-semibold text-black">Add New Address</h3>
              <div className="space-y-3">
                <select
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm outline-none"
                >
                  <option>Home</option>
                  <option>Work</option>
                  <option>Studio</option>
                  <option>Other</option>
                </select>
                <input
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/30"
                />
                <input
                  placeholder="Street address"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/30"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/30"
                  />
                  <input
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/30"
                  />
                </div>
                <input
                  placeholder="ZIP code"
                  value={formData.zip}
                  onChange={(e) =>
                    setFormData({ ...formData, zip: e.target.value })
                  }
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-black/30"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAdd}
                    className="flex-1 rounded-full bg-black px-4 py-2 text-xs uppercase tracking-[0.24em] text-sand"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="flex-1 rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-black"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="flex h-full min-h-[200px] items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-black/20 bg-white/50 text-black/70 transition hover:border-black/40"
            >
              <FiPlus /> Add New Address
            </button>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
