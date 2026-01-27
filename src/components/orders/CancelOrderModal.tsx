"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiAlertTriangle, FiChevronDown } from "react-icons/fi";

type CancelOrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isCancelling: boolean;
};

const reasons = [
  "Changed my mind",
  "Found a better price elsewhere",
  "Ordered by mistake",
  "Shipping is too slow",
  "Other"
];

export default function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  isCancelling
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = selectedReason === "Other" ? otherReason : selectedReason;
    if (!finalReason) return;
    onConfirm(finalReason);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-8 lg:p-10 shadow-massive"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-black/20 hover:text-black transition-colors"
            >
              <FiX size={20} />
            </button>

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FiAlertTriangle size={28} />
            </div>

            <h3 className="text-2xl font-serif italic text-black">Dissolve Order</h3>
            <p className="mt-2 text-[10px] uppercase tracking-widest text-black/40 font-bold">Rescind Artisan Acquisition</p>

            <p className="mt-6 text-sm leading-relaxed text-black/60">
              Are you certain you wish to cancel this studio order? This action will halt the crafting process and initiate a refund to your original payment method.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="relative">
                <label className="text-[9px] uppercase tracking-widest text-black/40 font-bold mb-2 block ml-1">Reason for Withdrawal</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex w-full items-center justify-between rounded-2xl border border-black/10 bg-sand/20 px-4 py-3 text-sm text-black outline-none focus:border-moss transition-colors"
                  >
                    <span>{selectedReason || "Select a reason..."}</span>
                    <FiChevronDown className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-xl"
                      >
                        {reasons.map((reason) => (
                          <button
                            key={reason}
                            type="button"
                            onClick={() => {
                              setSelectedReason(reason);
                              setShowDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-black/70 hover:bg-sand/50 hover:text-black transition-colors"
                          >
                            {reason}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence>
                {selectedReason === "Other" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <textarea
                      placeholder="Please specify your reason..."
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-black/10 bg-sand/20 px-4 py-3 text-sm text-black outline-none focus:border-moss transition-colors min-h-[100px] resize-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-full border border-black/5 py-4 text-[10px] uppercase tracking-widest text-black/40 font-bold hover:bg-black/5 transition-colors"
                >
                  Return to Order
                </button>
                <button
                  type="submit"
                  disabled={isCancelling || !selectedReason || (selectedReason === "Other" && !otherReason)}
                  className="flex-1 rounded-full bg-red-600 py-4 text-[10px] uppercase tracking-widest text-white font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isCancelling ? "Processing..." : "Confirm Cancellation"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
