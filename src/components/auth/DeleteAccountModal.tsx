"use client";

import { FiAlertTriangle, FiX } from "react-icons/fi";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm, isLoading }: DeleteAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-red-100 bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors"
        >
            <FiX className="text-black/20" />
        </button>

        <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <FiAlertTriangle size={32} />
            </div>

            <h3 className="text-xl font-serif italic text-black">Studio Exit Registry</h3>
            <p className="mt-2 text-[10px] uppercase tracking-widest text-black/40 font-bold">Identity Revocation</p>
            
            <p className="mt-6 text-sm leading-relaxed text-black/60">
                Are you certain you wish to permanently dissolve your studio account? This action will remove your artisan profile and saved collections from our registry.
            </p>

            <div className="mt-8 space-y-3 w-full">
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="w-full rounded-full bg-red-600 py-4 text-[10px] uppercase tracking-[0.3em] font-bold text-sand shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
                >
                    {isLoading ? "Revoking Identity..." : "Confirm Account Dissolution"}
                </button>
                <button
                    onClick={onClose}
                    className="w-full rounded-full border border-black/5 bg-sand/20 py-4 text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 transition-colors hover:bg-sand/40"
                >
                    Return to Studio
                </button>
            </div>

            <p className="mt-8 text-[9px] uppercase tracking-widest text-black/20 font-medium">
                Historic order records will be maintained for dispatch registries.
            </p>
        </div>
      </div>
    </div>
  );
}
