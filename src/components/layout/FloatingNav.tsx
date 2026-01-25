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
      pathname.startsWith("/cart")) {
    return null;
  }

  return (
    <div className="fixed top-20 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <motion.nav
        variants={{
          visible: { opacity: 1, scale: 1, y: 0 },
          hidden: { opacity: 0, scale: 0.9, y: -20 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ 
          duration: 0.5, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-black/[0.03] bg-sand/60 px-2 py-2 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center">
          <Dropdown
            trigger={
              <button className="flex items-center gap-1 rounded-full px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] text-black/60 transition-all hover:bg-black/[0.03] hover:text-black">
                Shop <FiChevronDown className="text-[10px] opacity-40" />
              </button>
            }
            items={shopItems}
          />
          <Link 
            href="/blog" 
            className="rounded-full px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] font-medium text-black/60 transition-all hover:bg-black/[0.03] hover:text-black"
          >
            Journal
          </Link>
          <Link 
            href="/about" 
            className="rounded-full px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] font-medium text-black/60 transition-all hover:bg-black/[0.03] hover:text-black"
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="rounded-full px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] font-medium text-black/60 transition-all hover:bg-black/[0.03] hover:text-black"
          >
            Contact
          </Link>
        </div>
      </motion.nav>
    </div>
  );
}
