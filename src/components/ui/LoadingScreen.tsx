"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type LoadingScreenProps = {
  isLoading: boolean;
};

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShow(false), 800); // Buffer for smooth exit
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAF8F6]"
        >
          {/* Ambient Texture/Glow */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-moss/5 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-clay/10 blur-[120px]" />

          <div className="relative flex flex-col items-center">
            {/* Animated Logo Mark */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                rotate: [0, 10, 0, -10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative h-20 w-20 flex items-center justify-center rounded-full bg-black text-sand shadow-massive"
            >
              <span className="text-sm font-bold tracking-[0.2em]">TT</span>
              <div className="absolute -inset-2 rounded-full border border-moss/20 animate-[spin_8s_linear_infinite]" />
            </motion.div>

            {/* Brand Text Reveal */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="font-serif text-2xl italic font-medium tracking-[0.1em] text-black">
                Thread & Timber
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 overflow-hidden">
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/30">
                  Illuminating Studio
                </p>
                <div className="flex gap-1">
                    <motion.span 
                        animate={{ opacity: [0, 1, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                        className="h-1 w-1 rounded-full bg-moss" 
                    />
                    <motion.span 
                        animate={{ opacity: [0, 1, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                        className="h-1 w-1 rounded-full bg-moss" 
                    />
                    <motion.span 
                        animate={{ opacity: [0, 1, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                        className="h-1 w-1 rounded-full bg-moss" 
                    />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Progress Bar */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-px bg-black/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-moss"
              initial={{ width: "0%" }}
              animate={{ width: isLoading ? "60%" : "100%" }}
              transition={{ 
                duration: isLoading ? 10 : 0.5,
                ease: "easeOut"
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
