"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import Head from "next/head";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";

// Dynamic Imports for Performance
const CategorySlider = dynamic(() => import("@/components/product/CategorySlider"), { 
  loading: () => <div className="h-96 w-full animate-pulse bg-black/5 rounded-[3rem] my-12" />
});
const TestimonialsSection = dynamic(() => import("@/components/ui/TestimonialsSection"));
const RecentlyViewedSection = dynamic(() => import("@/components/product/RecentlyViewedSection"));
const CTA = dynamic(() => import("@/components/ui/CTA"));

import { allProducts, type Product } from "@/lib/products";
import SectionHeading from "@/components/ui/SectionHeading";

// Structured Data for SEO
const structuredData = {
  "@context": "",
  "@type": "Store",
  "name": "Thread & Timber",
  "description": "Handcrafted apparel studio specializing in sustainable, small-batch clothing and artisan goods made with natural fibers.",
  "url": "",
  "logo": "",
  "image": "",
  "priceRange": "₹₹-₹₹₹",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  },
  "sameAs": [
    "",
    ""
  ]
};

const stats = [
  { label: "Pieces made", value: "2,400+" },
  { label: "Natural dyes", value: "18" },
  { label: "Studio days", value: "312" }
];

const values = [
  {
    title: "Handwoven textures",
    description:
      "Every fabric is woven in-house and finished with softening washes."
  },
  {
    title: "Thoughtful patterns",
    description:
      "Minimal silhouettes designed to layer effortlessly year-round."
  },
  {
    title: "Small-batch only",
    description:
      "We keep runs limited so every piece feels unique and collectible."
  }
];

const CATEGORIES = ['T-Shirts', 'Jackets', 'Accessories', 'Home Goods'];

import { useGlobalLoading } from "@/components/ui/GlobalLoadingProvider";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { setIsLoading } = useGlobalLoading();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/products`);
        if (res.ok) {
          const data = await res.json();
          const rawProducts = Array.isArray(data) ? data : (data.products || []);
          const transformed = rawProducts.map((p: any) => ({
            ...p,
            id: p._id || p.id,
            inventory: p.stock ?? p.inventory,
            tag: p.isFeatured ? "best seller" : (p.tag || "crafted"),
            sizes: p.sizes || ["S", "M", "L", "XL"],
          }));
          setProducts(transformed);
        } else {
          setProducts(allProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products");
        setProducts(allProducts);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [setIsLoading]);

  const categorizedProducts = useMemo(() => {
    return CATEGORIES.reduce((acc: any, category) => {
      acc[category] = products.filter(p => p.category === category);
      return acc;
    }, {});
  }, [products]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-sand">
      <main>
        {/* Cinematic Hero Section */}
        <section className="relative overflow-hidden bg-[#FAF8F6] pt-24 pb-16 lg:pt-32 lg:pb-24">
          {/* Ambient Texture/Glow */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-moss/5 blur-[120px]" />
          <div className="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 -translate-y-1/2 rounded-full bg-clay/10 blur-[120px]" />

          <div className="container-pad relative">
            <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-start">
              <div className="flex flex-col">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="inline-block rounded-full border border-moss/10 bg-moss/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] font-bold text-moss mb-8">
                    Artisan Studio № 021
                  </span>
                  
                  <h1 className="font-serif text-5xl font-light italic leading-[1.1] text-black sm:text-7xl lg:text-8xl">
                    <motion.span 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 1 }}
                      className="block"
                    >
                      Mindful 
                    </motion.span>
                    <motion.span 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 1 }}
                      className="block pl-12 sm:pl-24"
                    >
                      Textures.
                    </motion.span>
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="mt-10 max-w-lg text-lg leading-relaxed text-black/60 font-medium"
                >
                  Handcrafted apparel studio specializing in sustainable, small-batch collections made with natural fibers and vintage-inspired dye techniques.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="mt-12 flex flex-col gap-5 sm:flex-row"
                >
                  <Link
                    href="/shop"
                    className="flex items-center justify-center rounded-full bg-black px-10 py-5 text-[10px] uppercase tracking-[0.4em] font-bold text-sand shadow-xl shadow-black/10 hover:bg-black/90 hover:shadow-2xl transition-all active:scale-95"
                  >
                    Explore Drop
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center justify-center rounded-full border border-black/10 bg-white/40 px-10 py-5 text-[10px] uppercase tracking-[0.4em] font-bold text-black backdrop-blur-sm hover:bg-white hover:border-black/30 transition-all active:scale-95"
                  >
                    Our Process
                  </Link>
                </motion.div>

                <div className="mt-20 grid grid-cols-3 gap-8 border-t border-black/5 pt-12">
                  {stats.map((stat: any, idx: number) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + (idx * 0.1), duration: 0.8 }}
                      className="group cursor-default"
                    >
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/30 transition-colors group-hover:text-moss">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-3xl font-serif italic text-black font-light group-hover:translate-x-1 transition-transform">
                        {stat.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98, rotate: -1 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative hidden lg:block"
              >
                <div className="aspect-[4/5] w-full overflow-hidden rounded-[4rem] border border-black/5 bg-white shadow-massive">
                    <img 
                      src="https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?q=80&w=2670&auto=format&fit=crop" 
                      alt="Artisan Studio Preview" 
                      className="h-full w-full object-cover transition-transform duration-[3s] hover:scale-105"
                    />
                    <div className="absolute inset-x-8 bottom-8 rounded-3xl bg-white/20 p-8 shadow-soft backdrop-blur-2xl border border-white/20">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">Journal № 04</p>
                        <h3 className="mt-3 font-serif text-2xl italic text-white leading-tight">From loom to label — a story of texture.</h3>
                        <Link href="/about" className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-white hover:gap-5 transition-all">
                            Read More <span className="h-px w-8 bg-white/30" />
                        </Link>
                    </div>
                </div>
                
                {/* Secondary Floating Card */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="absolute -bottom-10 -left-20 w-64 rounded-[2rem] border border-black/5 bg-sand p-6 shadow-2xl backdrop-blur-xl border-white/50"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-moss/10 text-moss mb-4 font-bold text-xs italic font-serif">T&T</div>
                    <p className="text-xs font-semibold text-black leading-relaxed">Small runs. Natural dyes. Slow craft.</p>
                    <p className="mt-2 text-[10px] text-black/40 italic">Delivered monthly to our studio members.</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Category Sliders - Mobile Optimized */}
        {loading ? (
          <section className="container-pad py-10">
            <div className="flex items-center justify-center py-20">
              <p className="text-[10px] uppercase tracking-widest text-black/20 animate-pulse">
                Loading collections...
              </p>
            </div>
          </section>
        ) : (
          <>
            {CATEGORIES.map((category) => {
              const categoryProducts = categorizedProducts[category] || [];
              return (
                <CategorySlider
                  key={category}
                  category={category}
                  products={categoryProducts}
                />
              );
            })}
          </>
        )}

        <section className="container-pad py-12">
          <SectionHeading
            label="Our values"
            title="Designed to last, crafted to soften."
            subtitle="We use natural fibers, vintage hardware, and vegetable dyes to create calm, everyday staples."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-black/5 bg-white/70 p-6"
              >
                <h3 className="text-lg font-semibold text-black">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm text-black/70">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container-pad py-12">
          <SectionHeading
            label="Studio process"
            title="A calm, intentional workflow."
            subtitle="We take time with each step, from sketch to stitch, to make pieces that soften beautifully."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {["Sketch", "Weave", "Finish"].map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-black/5 bg-white/60 p-6"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-moss">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-black">{step}</h3>
                <p className="mt-3 text-sm text-black/70">
                  {step === "Sketch"
                    ? "We draft relaxed silhouettes with movement and texture."
                    : step === "Weave"
                      ? "Fabrics are woven and dyed in limited batches."
                      : "Each garment is washed and finished by hand."}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <TestimonialsSection />

        <RecentlyViewedSection />

        <CTA />
      </main>

      <Footer />
    </div>
    </>
  );
}

