"use client";

import { useState } from "react";
import { Address } from "@/lib/auth";
import { FiMapPin, FiTrash2, FiPlus, FiEdit2, FiCheck, FiX } from "react-icons/fi";

interface AddressBookProps {
  addresses: Address[];
  onUpdate: (addresses: Address[]) => void;
}

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia", 
  "Germany", "France", "Japan", "Singapore", "United Arab Emirates"
];

const AddressForm = ({ 
    formData, 
    setFormData, 
    handleSave, 
    cancelAction, 
    isEdit = false 
  }: {
    formData: Partial<Address>;
    setFormData: (data: Partial<Address>) => void;
    handleSave: () => void;
    cancelAction: () => void;
    isEdit?: boolean;
  }) => (
    <div className="mb-6 rounded-2xl border border-black/10 bg-white p-5 shadow-soft animate-in fade-in slide-in-from-top-2">
        <h4 className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-4">
            {isEdit ? "Revising Artisan Address" : "New Collection Destination"}
        </h4>
        <div className="grid gap-3">
            <input 
                placeholder="Full Name" 
                className="w-full rounded-xl border border-black/10 bg-sand/20 px-4 py-3 text-sm outline-none focus:border-moss transition-colors text-black"
                value={formData.name || ""}
                onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <input 
                placeholder="Street Address" 
                className="w-full rounded-xl border border-black/10 bg-sand/20 px-4 py-3 text-sm outline-none focus:border-moss transition-colors text-black"
                value={formData.street || ""}
                onChange={e => setFormData({...formData, street: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-3">
                <input 
                    placeholder="City" 
                    className="w-full rounded-xl border border-black/10 bg-sand/20 px-4 py-3 text-sm outline-none focus:border-moss transition-colors text-black"
                    value={formData.city || ""}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                />
                <input 
                    placeholder="State / Province" 
                    className="w-full rounded-xl border border-black/10 bg-sand/20 px-4 py-3 text-sm outline-none focus:border-moss transition-colors text-black"
                    value={formData.state || ""}
                    onChange={e => setFormData({...formData, state: e.target.value})}
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <input 
                    placeholder="ZIP / Postal Code" 
                    className="w-full rounded-xl border border-black/10 bg-sand/20 px-4 py-3 text-sm outline-none focus:border-moss transition-colors text-black"
                    value={formData.zip || ""}
                    onChange={e => setFormData({...formData, zip: e.target.value})}
                />
                <div className="relative">
                    <select 
                        className="w-full rounded-xl border border-black/10 bg-sand/20 px-4 py-3 text-sm outline-none focus:border-moss appearance-none cursor-pointer text-black"
                        value={formData.country || "India"}
                        onChange={e => setFormData({...formData, country: e.target.value})}
                    >
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
            <select 
                className="w-full rounded-xl border border-black/10 bg-sand/20 px-4 py-3 text-sm outline-none focus:border-moss appearance-none cursor-pointer text-black"
                value={formData.label || "Home"}
                onChange={e => setFormData({...formData, label: e.target.value})}
            >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Studio">Studio</option>
                <option value="Other">Other</option>
            </select>
            <div className="flex gap-3 mt-2">
                <button 
                    onClick={cancelAction}
                    className="flex-1 rounded-xl border border-black/5 py-3 text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    className="flex-[2] rounded-xl bg-black py-3 text-[10px] uppercase tracking-widest text-sand hover:bg-black/90 shadow-lg shadow-black/10 transition-all active:scale-95"
                >
                    {isEdit ? "Update Address" : "Save Piece Location"}
                </button>
            </div>
        </div>
    </div>
);

export default function AddressBook({ addresses, onUpdate }: AddressBookProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({});

  const removeAddress = (id: string) => {
    onUpdate(addresses.filter(a => a.id !== id));
  };

  const setDefault = (id: string) => {
    onUpdate(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  const handleSave = () => {
    if (!formData.name || !formData.street || !formData.city || !formData.state || !formData.zip) return;
    
    if (editingId) {
      // Update existing
      onUpdate(addresses.map(a => a.id === editingId ? { ...a, ...formData } as Address : a));
      setEditingId(null);
    } else {
      // Add new
      const address: Address = {
          id: Math.random().toString(36).substr(2, 9),
          label: formData.label || "Home",
          isDefault: addresses.length === 0,
          name: formData.name as string,
          street: formData.street as string,
          city: formData.city as string,
          state: formData.state as string,
          zip: formData.zip as string,
          country: formData.country || "India"
      };
      onUpdate([...addresses, address]);
      setIsAdding(false);
    }
    setFormData({});
  };

  const startEdit = (addr: Address) => {
    setEditingId(addr.id);
    setFormData(addr);
    setIsAdding(false);
  };

  const cancelAction = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  return (
    <div className="rounded-[2.5rem] border border-black/5 bg-white/70 p-8 lg:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
            <h3 className="flex items-center gap-2 text-lg font-serif italic text-black">
              <FiMapPin className="text-moss" /> Address Book
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-black/40 mt-1">Manage your studio dispatch points.</p>
        </div>
        {!isAdding && !editingId && (
          <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 rounded-full bg-black px-6 py-2 text-[10px] uppercase tracking-widest text-sand shadow-lg shadow-black/10 hover:bg-black/90 transition-all active:scale-95"
          >
            <FiPlus /> Add New
          </button>
        )}
      </div>

      {isAdding && <AddressForm formData={formData} setFormData={setFormData} handleSave={handleSave} cancelAction={cancelAction} />}

      {(addresses || []).length === 0 && !isAdding ? (
          <div className="py-12 text-center rounded-3xl border border-dashed border-black/10 bg-sand/20">
              <p className="text-sm text-black/40 italic">No saved dispatch points yet.</p>
          </div>
      ) : (
        <div className="space-y-4">
          {(addresses || []).map((address: any) => (
            <div key={address.id}>
              {editingId === address.id ? (
                <AddressForm isEdit formData={formData} setFormData={setFormData} handleSave={handleSave} cancelAction={cancelAction} />
              ) : (
                <div 
                  className={`group relative rounded-3xl border p-6 transition-all duration-300 ${
                    address.isDefault ? "border-moss bg-moss/[0.02] shadow-sm" : "border-black/5 bg-white/50 hover:bg-white hover:border-black/10"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${address.isDefault ? 'bg-moss text-sand' : 'bg-black/5 text-black/40'}`}>
                            {address.label}
                          </span>
                          {address.isDefault && <span className="text-[9px] font-bold uppercase tracking-widest text-moss">Default Dispatch</span>}
                      </div>
                      <p className="text-sm font-bold text-black">{address.name}</p>
                      <p className="mt-1 text-xs text-black/60 leading-relaxed">{address.street}</p>
                      <p className="text-xs text-black/60">{address.city}, {address.state} {address.zip}</p>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-black/20">{address.country}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => startEdit(address)}
                            className="p-2 rounded-xl bg-white border border-black/5 text-black/40 hover:text-black hover:border-black/10 shadow-sm transition-all"
                            title="Edit Address"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button 
                            onClick={() => removeAddress(address.id)}
                            className="p-2 rounded-xl bg-white border border-black/5 text-black/40 hover:text-red-500 hover:border-red-100 shadow-sm transition-all"
                            title="Delete Address"
                          >
                            <FiTrash2 size={14} />
                          </button>
                       </div>
                       {!address.isDefault && (
                        <button 
                          onClick={() => setDefault(address.id)}
                          className="text-[9px] uppercase tracking-widest font-bold text-moss hover:bg-moss hover:text-sand px-3 py-1.5 rounded-lg border border-moss/20 transition-all mt-2"
                        >
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
