"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiLayers } from "react-icons/fi";
import { toast } from "sonner";
import Image from "next/image";
import ProductFormModal from "@/components/admin/ProductFormModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

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
        setProducts(prev => prev.filter(p => p._id !== id));
        toast.success("Piece removed from collections");
      }
    } catch (error) {
      toast.error("Failed to remove product");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-black">Product Inventory</h2>
          <p className="text-[10px] uppercase tracking-widest text-black/40 mt-1">Manage handcrafted collections and material details.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20" />
                <input 
                    placeholder="Search catalog..." 
                    className="rounded-2xl border border-black/5 bg-white px-10 py-2 text-xs outline-none focus:border-black/10 w-full sm:w-64"
                />
            </div>
            <button 
              onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 rounded-2xl bg-black px-6 py-2 text-[10px] uppercase tracking-widest text-sand shadow-lg shadow-black/10 transition hover:bg-black/90 active:scale-95"
            >
              <FiPlus /> New Piece
            </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
            Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-64 rounded-3xl bg-white/50 animate-pulse border border-black/5" />
            ))
        ) : products.map((product: any) => (
          <div key={product._id} className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft transition-hover hover:border-black/10">
            <div className="relative h-48 w-full overflow-hidden bg-sand/50">
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[8px] uppercase tracking-widest font-bold text-black border border-black/5">
                  {product.category}
                </span>
              </div>
              <div className="absolute top-3 right-3 flex gap-1">
                <button 
                  onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                  className="p-2 rounded-xl bg-white/90 backdrop-blur-md text-black/60 hover:text-black hover:bg-white shadow-sm transition-all"
                >
                  <FiEdit2 size={14} />
                </button>
                <button 
                  onClick={() => deleteProduct(product._id)}
                  className="p-2 rounded-xl bg-white/90 backdrop-blur-md text-red-400 hover:text-red-500 hover:bg-white shadow-sm transition-all"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-1 mb-2">
                 <h3 className="text-xs font-bold text-black truncate">{product.name}</h3>
                 <p className="text-xs font-bold text-moss">${product.price}</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-black/40">
                <span className="flex items-center gap-1 font-bold">
                    <FiLayers /> {product.stock} left
                </span>
                <span className="truncate">{product.materials}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProducts}
        product={editingProduct}
      />
    </div>
  );
}
