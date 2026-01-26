"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import Dropdown from "@/components/ui/Dropdown";

export default function FloatingNav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const shopItems = [
    { label: "All Products", href: "/shop" },
    { label: "T-Shirts", href: "/shop?category=T-Shirts" },
    { label: "Jackets", href: "/shop?category=Jackets" },
    { label: "Accessories", href: "/shop?category=Accessories" },
    { label: "Home Goods", href: "/shop?category=Home Goods" },
  ];

  if (pathname.startsWith("/adminp") || 
      pathname.startsWith("/dashboard") || 
      pathname.startsWith("/auth") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/gift-cards") ||
      pathname.startsWith("/products") ||
      pathname.startsWith("/cart")) {
    return null;
  }

  return (
    <div className="fixed bottom-10 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
      <motion.nav
        variants={{
          visible: { opacity: 1, scale: 1, y: 0 },
          hidden: { opacity: 0, scale: 0.9, y: 40 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className="pointer-events-auto flex items-center p-1.5 rounded-[2rem] border border-white/40 bg-white/40 backdrop-blur-3xl shadow-massive overflow-hidden"
      >
        <div className="flex items-center gap-1">
          <Dropdown
            side="top"
            trigger={
              <button className="flex items-center gap-1.5 rounded-full px-5 py-3 text-[10px] uppercase tracking-[0.3em] font-bold text-black/60 transition-all hover:bg-black/5 hover:text-black active:scale-95">
                Shop <FiChevronDown className="text-xs opacity-20" />
              </button>
            }
            items={shopItems}
          />
          
          <div className="h-4 w-px bg-black/[0.03] mx-1 hidden sm:block" />

          <Link 
            href="/blog" 
            className="rounded-full px-5 py-3 text-[10px] uppercase tracking-[0.3em] font-bold text-black/60 transition-all hover:bg-black/5 hover:text-black active:scale-95"
          >
            Journal
          </Link>

          <Link 
            href="/about" 
            className="hidden sm:flex rounded-full px-5 py-3 text-[10px] uppercase tracking-[0.3em] font-bold text-black/60 transition-all hover:bg-black/5 hover:text-black active:scale-95"
          >
            Studio
          </Link>

          <Link 
            href="/contact" 
            className="rounded-full px-5 py-3 text-[10px] uppercase tracking-[0.3em] font-bold text-black/60 transition-all hover:bg-black/5 hover:text-black active:scale-95"
          >
            Reach
          </Link>

          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-black text-sand ml-1 cursor-pointer hover:rotate-12 transition-transform shadow-lg active:scale-90" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
