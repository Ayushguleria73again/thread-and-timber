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
};

export default function Dropdown({
  trigger,
  items,
  align = "left"
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
    <div className="relative inline-block text-left" ref={dropdownRef}>
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
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseLeave={() => setIsOpen(false)}
            className={`absolute z-50 mt-2 w-56 origin-top-${align} rounded-2xl border border-black/5 bg-sand/95 backdrop-blur-md shadow-lg outline-none ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            <div className="py-2">
              {items.map((item: any, index: number) => {
                const isLink = item.href && !item.href.includes("javascript:");
                const content = (
                  <>
                    {item.icon && <span className="text-sm">{item.icon}</span>}
                    {item.label}
                  </>
                );

                const handleClick = () => {
                  item.onClick?.();
                  setIsOpen(false);
                };

                if (isLink) {
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.2em] text-black/70 hover:bg-black/5 transition-colors"
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
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs uppercase tracking-[0.2em] text-black/70 hover:bg-black/5 transition-colors"
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
