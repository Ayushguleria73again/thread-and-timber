"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiChevronDown, FiFilter } from "react-icons/fi";
import { formatCurrency } from "@/lib/utils";

export type FilterState = {
  materials: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
};

type FilterSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  availableMaterials: string[];
  availableColors: string[];
  availableSizes: string[];
  priceBounds: [number, number];
};

export default function FilterSidebar({
  isOpen,
  onClose,
  filters,
  setFilters,
  availableMaterials,
  availableColors,
  availableSizes,
  priceBounds
}: FilterSidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("price");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K] extends Array<infer U> ? U : never
  ) => {
    setFilters({
      ...filters,
      [key]: (filters[key] as any[]).includes(value)
        ? (filters[key] as any[]).filter((v) => v !== value)
        : [...(filters[key] as any[]), value]
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm border-l border-black/5 bg-sand p-6 shadow-2xl sm:w-[400px]"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-black/5 pb-6">
                <div>
                  <h2 className="font-serif text-2xl italic text-black">Filters</h2>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-black/40">
                    Refine your collection search
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full border border-black/5 p-2 transition hover:bg-black/5"
                >
                  <FiX />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-6">
                  {/* Price Range */}
                  <div className="border-b border-black/5 pb-6">
                    <button
                      onClick={() => toggleSection("price")}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <span className="text-xs uppercase tracking-[0.2em] font-bold text-black/60">
                        Price Range
                      </span>
                      <FiChevronDown
                        className={`transition-transform ${
                          expandedSection === "price" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSection === "price" && (
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between text-sm text-black">
                          <span>{formatCurrency(filters.priceRange[0])}</span>
                          <span>{formatCurrency(filters.priceRange[1])}</span>
                        </div>
                        <input
                          type="range"
                          min={priceBounds[0]}
                          max={priceBounds[1]}
                          step={500}
                          value={filters.priceRange[1]}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                            })
                          }
                          className="w-full accent-moss"
                        />
                      </div>
                    )}
                  </div>

                  {/* Materials */}
                  <div className="border-b border-black/5 pb-6">
                    <button
                      onClick={() => toggleSection("material")}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <span className="text-xs uppercase tracking-[0.2em] font-bold text-black/60">
                        Material
                      </span>
                      <FiChevronDown
                        className={`transition-transform ${
                          expandedSection === "material" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSection === "material" && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {availableMaterials.map((mat) => (
                          <button
                            key={mat}
                            onClick={() => updateFilter("materials", mat)}
                            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] uppercase tracking-widest transition-all ${
                              filters.materials.includes(mat)
                                ? "border-moss bg-moss text-sand"
                                : "border-black/10 hover:border-black/30"
                            }`}
                          >
                            {filters.materials.includes(mat) && <FiCheck className="text-xs" />}
                            {mat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Colors */}
                  <div className="border-b border-black/5 pb-6">
                    <button
                      onClick={() => toggleSection("color")}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <span className="text-xs uppercase tracking-[0.2em] font-bold text-black/60">
                        Color Palette
                      </span>
                      <FiChevronDown
                        className={`transition-transform ${
                          expandedSection === "color" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSection === "color" && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {availableColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => updateFilter("colors", color)}
                            className={`relative h-10 w-10 rounded-full border shadow-sm transition-transform hover:scale-110 ${
                              filters.colors.includes(color)
                                ? "ring-2 ring-moss ring-offset-2"
                                : "border-black/10"
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          >
                            {filters.colors.includes(color) && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <FiCheck className={`text-xs ${
                                  ["#ffffff", "#f6f2ec"].includes(color.toLowerCase()) 
                                    ? "text-black" 
                                    : "text-white"
                                }`} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                   {/* Sizes */}
                   <div className="border-b border-black/5 pb-6">
                    <button
                      onClick={() => toggleSection("size")}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <span className="text-xs uppercase tracking-[0.2em] font-bold text-black/60">
                        Size
                      </span>
                      <FiChevronDown
                        className={`transition-transform ${
                          expandedSection === "size" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSection === "size" && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {availableSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => updateFilter("sizes", size)}
                            className={`flex min-w-[3rem] justify-center items-center rounded-full border px-3 py-2 text-xs font-medium transition-all ${
                              filters.sizes.includes(size)
                                ? "border-moss bg-moss text-sand"
                                : "border-black/10 hover:border-black/30"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-black/5 pt-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setFilters({
                        materials: [],
                        colors: [],
                        sizes: [],
                        priceRange: [priceBounds[0], priceBounds[1]]
                    })}
                    className="w-1/3 rounded-full border border-black/10 py-3 text-[10px] uppercase tracking-widest text-black hover:bg-black/5"
                  >
                    Clear
                  </button>
                  <button
                    onClick={onClose}
                    className="w-2/3 rounded-full bg-black py-3 text-[10px] uppercase tracking-widest text-sand shadow-lg hover:bg-black/90"
                  >
                    Show Results
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
