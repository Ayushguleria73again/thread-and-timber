"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiLayers } from "react-icons/fi";
import { toast } from "sonner";
import Image from "next/image";
import ProductFormModal from "@/components/admin/ProductFormModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [search, setSearch] = useState("");

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
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl italic font-light text-black">Studio Collections</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/30 mt-1">Manage handcrafted goods and artisan inventory.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20" />
                <input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search catalog..." 
                    className="rounded-full border border-black/5 bg-white px-10 py-2 text-xs outline-none focus:border-black/10 w-full sm:w-64 h-12"
                />
            </div>
            <button 
              onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
              className="flex items-center gap-3 h-12 rounded-full bg-black px-8 text-[10px] uppercase tracking-[0.4em] font-bold text-sand shadow-xl shadow-black/10 transition hover:bg-black/90 active:scale-95 whitespace-nowrap"
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
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-serif text-2xl italic font-light text-black">{category}</h3>
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/20 mt-1">{catProducts.length} pieces in collection</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
                        {catProducts.map((product: any) => (
                            <motion.div 
                                key={product._id || product.id} 
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="min-w-[280px] w-[280px] snap-start"
                            >
                                <div className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-black/[0.03] bg-white shadow-soft transition-all duration-500 hover:shadow-massive">
                                    <Image 
                                        src={product.image} 
                                        alt={product.name} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    
                                    {/* Admin Actions Overlay */}
                                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                                        <button 
                                            onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                                            className="h-10 w-10 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-xl text-black hover:bg-white transition-all shadow-lg active:scale-90"
                                        >
                                            <FiEdit2 className="text-sm" />
                                        </button>
                                        <button 
                                            onClick={() => deleteProduct(product._id || product.id)}
                                            className="h-10 w-10 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90"
                                        >
                                            <FiTrash2 className="text-sm" />
                                        </button>
                                    </div>

                                    {/* Info Overlay */}
                                    <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                        <p className="text-[8px] uppercase tracking-[0.4em] font-bold text-white/60 mb-1">{product.category}</p>
                                        <h4 className="font-serif text-xl italic font-light text-white mb-3">{product.name}</h4>
                                        <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">Stock: {product.stock ?? product.inventory}</span>
                                            <span className="text-lg font-serif italic text-sand">Rs.{product.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
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
