"use client";

import { useState, useEffect } from "react";
import { FiX, FiCheck, FiImage, FiTag, FiLayers, FiDollarSign, FiPlus } from "react-icons/fi";
import { toast } from "sonner";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any; // If present, it's an edit
}

export default function ProductFormModal({ isOpen, onClose, onSuccess, product }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "T-Shirts",
    stock: 10,
    materials: "Organic Cotton",
    image: "/images/products/placeholder.jpg",
    isFeatured: false,
    palette: ["#F6F2EC"],
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Auto-fill form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        category: product.category || "T-Shirts",
        stock: product.stock || 10,
        materials: product.materials || "Organic Cotton",
        image: product.image || "/images/products/placeholder.jpg",
        isFeatured: product.isFeatured || false,
        palette: product.palette || ["#F6F2EC"],
      });
      setImagePreview(product.image || "");
    } else {
      // Reset form for new product
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "T-Shirts",
        stock: 10,
        materials: "Organic Cotton",
        image: "/images/products/placeholder.jpg",
        isFeatured: false,
        palette: ["#F6F2EC"],
      });
      setImagePreview("");
    }
    setImageFile(null);
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const token = localStorage.getItem("thread-timber-token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = product 
      ? `${apiUrl}/admin/products/${product._id}`
      : `${apiUrl}/admin/products`;
    
    const method = product ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success(product ? "Collection piece updated" : "New piece added to studio");
        onSuccess();
        onClose();
      } else {
        toast.error("Failed to save collection piece");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-lg rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-serif italic font-medium text-black">
                {product ? "Refine Collection Piece" : "New Artisan Drop"}
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-black/40 mt-1">Master studio inventory entry.</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors">
              <FiX className="text-black/40" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 block">Name</label>
              <input 
                required
                className="w-full rounded-2xl border border-black/5 bg-sand/30 px-4 py-3 text-sm focus:border-black/10 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 block">Description</label>
              <textarea 
                required
                rows={3}
                className="w-full rounded-2xl border border-black/5 bg-sand/30 px-4 py-3 text-sm focus:border-black/10 outline-none resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 block">Price (Rs.)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 text-sm">₹</span>
                <input 
                  required
                  type="number"
                  className="w-full rounded-2xl border border-black/5 bg-sand/30 pl-10 pr-4 py-3 text-sm focus:border-black/10 outline-none"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 block">Stock Level</label>
              <div className="relative">
                <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
                <input 
                  required
                  type="number"
                  className="w-full rounded-2xl border border-black/5 bg-sand/30 pl-10 pr-4 py-3 text-sm focus:border-black/10 outline-none"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 block">Category</label>
              <select 
                className="w-full rounded-2xl border border-black/5 bg-sand/30 px-4 py-3 text-sm focus:border-black/10 outline-none appearance-none cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="T-Shirts">T-Shirts</option>
                <option value="Jackets">Jackets</option>
                <option value="Accessories">Accessories</option>
                <option value="Home Goods">Home Goods</option>
                <option value="Apparel">Apparel (General)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 block">Materials</label>
              <input 
                required
                placeholder="e.g. Organic Cotton, Linen"
                className="w-full rounded-2xl border border-black/5 bg-sand/30 px-4 py-3 text-sm focus:border-black/10 outline-none"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-2 block">Product Image</label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative group">
                    <div className="relative h-48 w-full rounded-2xl border border-black/5 bg-sand/30 overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer rounded-full bg-white px-6 py-2 text-[10px] uppercase tracking-widest text-black shadow-lg">
                          Change Image
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 w-full rounded-2xl border-2 border-dashed border-black/10 bg-sand/30 cursor-pointer hover:border-black/20 transition-colors">
                    <FiImage className="text-4xl text-black/20 mb-2" />
                    <span className="text-[10px] uppercase tracking-widest text-black/40">Click to upload image</span>
                    <span className="text-[8px] uppercase tracking-widest text-black/20 mt-1">PNG, JPG up to 5MB</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-black/[0.03]">
             <div className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    id="featured"
                    className="h-4 w-4 rounded border-black/10 text-black focus:ring-black"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                />
                <label htmlFor="featured" className="text-[10px] uppercase tracking-widest font-bold text-black/40">Featured best seller</label>
             </div>
             
             <div className="flex gap-2">
                <button type="button" onClick={onClose} className="px-6 py-3 text-[10px] uppercase tracking-widest text-black/40 hover:text-black">Cancel</button>
                <button 
                  disabled={loading}
                  className="flex items-center gap-2 rounded-full bg-black px-8 py-3 text-[10px] uppercase tracking-widest text-sand shadow-lg shadow-black/10 transition hover:bg-black/90 disabled:bg-black/40"
                >
                  {loading ? "..." : (product ? <FiCheck /> : <FiPlus />)}
                  {loading ? "Saving" : (product ? "Update Piece" : "Add Drop")}
                </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}
