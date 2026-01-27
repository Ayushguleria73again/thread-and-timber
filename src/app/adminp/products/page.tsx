"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiLayers, FiX } from "react-icons/fi";
import { toast } from "sonner";
import Image from "next/image";
import ProductFormModal from "@/components/admin/ProductFormModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [activeTouchId, setActiveTouchId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/products`);
      if (res.ok) {
        const data = await res.json();
        const rawProducts = Array.isArray(data) ? data : (data.products || []);
        setProducts(rawProducts);
      }
    } catch (error) {
      toast.error("Failed to fetch collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this piece from the studio?")) return;
    
    const token = localStorage.getItem("thread-timber-token");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
        toast.success("Piece removed from collections");
      }
    } catch (error) {
      toast.error("Failed to remove product");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const categorizedProducts = useMemo(() => {
    return filteredProducts.reduce((acc: any, p) => {
        const cat = p.category || "Uncategorized";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(p);
        return acc;
    }, {});
  }, [filteredProducts]);

  return (
    <div className="space-y-8 lg:space-y-12 pb-20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-serif text-3xl italic font-light text-black lg:text-4xl">Studio Collections</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/30 mt-2 lg:mt-1">Manage handcrafted goods and artisan inventory.</p>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-initial">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
                <input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search catalog..." 
                    className="w-full sm:w-64 h-12 rounded-full border border-black/5 bg-white px-12 text-xs outline-none focus:border-black/10 transition-all font-medium"
                />
                {search && (
                    <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black">
                        <FiX />
                    </button>
                )}
            </div>
            
            <button 
              onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
              className="flex items-center justify-center gap-3 h-12 rounded-full bg-black px-8 text-[10px] uppercase tracking-[0.4em] font-bold text-sand shadow-xl shadow-black/10 transition hover:bg-black/90 active:scale-95 whitespace-nowrap"
            >
              <FiPlus className="text-sm" /> New Piece
            </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array(8).fill(0).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-white/50 animate-pulse border border-black/[0.03]" />
            ))}
        </div>
      ) : (
        <div className="space-y-16">
            {Object.entries(categorizedProducts).map(([category, catProducts]: [string, any]) => (
                <section key={category}>
                    <div className="container-pad flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-serif text-2xl italic font-light text-black">{category}</h3>
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/20 mt-1">{catProducts.length} pieces in collection</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar px-5 lg:px-0">
                        {catProducts.map((product: any) => {
                            const pid = product._id || product.id;
                            const isTouched = activeTouchId === pid;

                            return (
                                <motion.div 
                                    key={pid} 
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    onClick={() => setActiveTouchId(isTouched ? null : pid)}
                                    className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] snap-center lg:snap-start"
                                >
                                    <div className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-black/[0.03] bg-white shadow-soft transition-all duration-500 hover:shadow-massive cursor-pointer">
                                        <Image 
                                            src={product.image || "https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?q=80&w=2670&auto=format&fit=crop"} 
                                            alt={product.name} 
                                            fill 
                                            sizes="320px"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        
                                        {/* Cinematic Overlays */}
                                        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${isTouched ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'}`} />
                                        
                                        {/* Admin Actions Overlay */}
                                        <div className={`absolute top-6 right-6 flex gap-2 z-20 transition-all duration-500 ${isTouched ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0'}`}>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setEditingProduct(product); setIsModalOpen(true); }}
                                                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-2xl text-white border border-white/20 hover:bg-white hover:text-black transition-all shadow-lg active:scale-90"
                                            >
                                                <FiEdit2 className="text-sm" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); deleteProduct(pid); }}
                                                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-2xl text-red-300 border border-white/20 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90"
                                            >
                                                <FiTrash2 className="text-sm" />
                                            </button>
                                        </div>

                                        {/* Info Overlay */}
                                        <div className={`absolute inset-x-8 bottom-8 transition-all duration-500 ${isTouched ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0'}`}>
                                            <p className="text-[8px] uppercase tracking-[0.4em] font-bold text-white/50 mb-2">{product.category}</p>
                                            <h4 className="font-serif text-2xl italic font-light text-white mb-4 leading-tight">{product.name}</h4>
                                            
                                            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">
                                                    <FiLayers /> <span>{product.stock ?? product.inventory}</span>
                                                </div>
                                                <span className="text-xl font-serif italic text-sand">₹{product.price}</span>
                                            </div>
                                        </div>

                                        {/* Mobile Tap Hint */}
                                        {!isTouched && (
                                            <div className="absolute inset-0 z-10 lg:hidden" />
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
      )}

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProducts}
        product={editingProduct}
      />
    </div>
  );
}
