"use client";

import { useState } from "react";
import { Address } from "@/lib/auth";
import { FiMapPin, FiTrash2, FiPlus } from "react-icons/fi";

interface AddressBookProps {
  addresses: Address[];
  onUpdate: (addresses: Address[]) => void;
}

export default function AddressBook({ addresses, onUpdate }: AddressBookProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  const removeAddress = (id: string) => {
    onUpdate(addresses.filter(a => a.id !== id));
  };

  const setDefault = (id: string) => {
    onUpdate(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  const handleAdd = () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip) return;
    
    const address: Address = {
        id: Math.random().toString(36).substr(2, 9),
        label: newAddress.label || "Home",
        isDefault: addresses.length === 0,
        name: newAddress.name,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        zip: newAddress.zip,
        country: newAddress.country || "India"
    };
    
    onUpdate([...addresses, address]);
    setIsAdding(false);
    setNewAddress({});
  };

  return (
    <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-black">
          <FiMapPin /> Address Book
        </h3>
        <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-black/60 hover:text-black"
        >
          <FiPlus /> {isAdding ? "Cancel" : "Add New"}
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 rounded-2xl border border-black/5 bg-white p-4 animate-in fade-in slide-in-from-top-2">
            <div className="grid gap-3">
                <input 
                    placeholder="Full Name" 
                    className="w-full rounded-xl border border-black/10 bg-sand/20 px-3 py-2 text-sm outline-none focus:border-moss"
                    value={newAddress.name || ""}
                    onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                />
                <input 
                    placeholder="Street Address" 
                    className="w-full rounded-xl border border-black/10 bg-sand/20 px-3 py-2 text-sm outline-none focus:border-moss"
                    value={newAddress.street || ""}
                    onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-3">
                    <input 
                        placeholder="City" 
                        className="w-full rounded-xl border border-black/10 bg-sand/20 px-3 py-2 text-sm outline-none focus:border-moss"
                        value={newAddress.city || ""}
                        onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                    />
                    <input 
                        placeholder="State" 
                        className="w-full rounded-xl border border-black/10 bg-sand/20 px-3 py-2 text-sm outline-none focus:border-moss"
                        value={newAddress.state || ""}
                        onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <input 
                        placeholder="ZIP Code" 
                        className="w-full rounded-xl border border-black/10 bg-sand/20 px-3 py-2 text-sm outline-none focus:border-moss"
                        value={newAddress.zip || ""}
                        onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                    />
                    <select 
                        className="w-full rounded-xl border border-black/10 bg-sand/20 px-3 py-2 text-sm outline-none focus:border-moss"
                        value={newAddress.label || "Home"}
                        onChange={e => setNewAddress({...newAddress, label: e.target.value})}
                    >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Studio">Studio</option>
                    </select>
                </div>
                <button 
                    onClick={handleAdd}
                    className="mt-2 w-full rounded-xl bg-black py-2 text-xs uppercase tracking-widest text-sand hover:bg-black/90"
                >
                    Save Address
                </button>
            </div>
        </div>
      )}

      {addresses.length === 0 && !isAdding ? (
          <p className="py-4 text-center text-sm text-black/40 italic">No saved addresses yet.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((address: any) => (
            <div 
              key={address.id} 
              className={`relative rounded-2xl border p-4 transition-all ${
                address.isDefault ? "border-moss bg-moss/[0.03]" : "border-black/5 bg-white"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-black/40">
                    {address.label} {address.isDefault && "• Default"}
                  </span>
                  <p className="mt-1 text-sm font-medium text-black">{address.name}</p>
                  <p className="text-xs text-black/60">{address.street}</p>
                  <p className="text-xs text-black/60">{address.city}, {address.state} {address.zip}</p>
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <button 
                      onClick={() => setDefault(address.id)}
                      className="text-xs text-moss hover:underline"
                    >
                      Set default
                    </button>
                  )}
                  <button 
                    onClick={() => removeAddress(address.id)}
                    className="text-black/40 hover:text-red-500"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
