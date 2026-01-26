"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type DropdownItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type DropdownProps = {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  side?: "top" | "bottom";
};

export default function Dropdown({
  trigger,
  items,
  align = "left",
  side = "bottom"
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
        className="relative inline-block text-left" 
        ref={dropdownRef}
        onMouseLeave={() => setIsOpen(false)}
    >
      <div
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ 
                opacity: 0, 
                y: side === "bottom" ? 10 : -10, 
                scale: 0.95 
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ 
                opacity: 0, 
                y: side === "bottom" ? 10 : -10, 
                scale: 0.95 
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-50 w-56 rounded-[1.5rem] border border-black/5 bg-white/90 backdrop-blur-2xl shadow-massive outline-none ${
              align === "right" ? "right-0" : "left-0"
            } ${
              side === "bottom" ? "top-full mt-3" : "bottom-full mb-3"
            } origin-${side === "bottom" ? "top" : "bottom"}-${align}`}
          >
            <div className="p-2">
              {(items || []).map((item: any, index: number) => {
                const isLink = item.href && !item.href.includes("javascript:");
                const content = (
                  <>
                    {item.icon && <span className="text-base text-moss group-hover:scale-110 transition-transform">{item.icon}</span>}
                    <span className="font-bold">{item.label}</span>
                  </>
                );

                const handleClick = () => {
                  item.onClick?.();
                  setIsOpen(false);
                };

                const baseStyles = "group flex w-full items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-black/60 hover:bg-black/5 hover:text-black rounded-xl transition-all active:scale-[0.98]";

                if (isLink) {
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={baseStyles}
                      onClick={() => setIsOpen(false)}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={handleClick}
                    className={baseStyles}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
