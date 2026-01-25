"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Head from "next/head";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import CategorySlider from "@/components/product/CategorySlider";
import SectionHeading from "@/components/ui/SectionHeading";
import { allProducts, type Product } from "@/lib/products";
import TestimonialsSection from "@/components/ui/TestimonialsSection";
import RecentlyViewedSection from "@/components/product/RecentlyViewedSection";
import CTA from "@/components/ui/CTA";

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Thread & Timber",
  "description": "Handcrafted apparel studio specializing in sustainable, small-batch clothing and artisan goods made with natural fibers.",
  "url": "https://threadandtimber.com",
  "logo": "https://threadandtimber.com/logo.png",
  "image": "https://threadandtimber.com/og-image.jpg",
  "priceRange": "₹₹-₹₹₹",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  },
  "sameAs": [
    "https://instagram.com/threadandtimber",
    "https://twitter.com/threadandtimber"
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/products`);
        if (res.ok) {
          const data = await res.json();
          const transformed = data.map((p: any) => ({
            ...p,
            id: p._id,
            inventory: p.stock,
            tag: p.isFeatured ? "best seller" : "crafted",
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
      }
    };

    fetchProducts();
  }, []);

  const getProductsByCategory = (category: string) => {
    return products.filter(p => p.category === category);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-sand">
      <main>
        <section className="container-pad py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="flex flex-col gap-6">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xs uppercase tracking-[0.3em] text-moss"
              >
                Handcrafted apparel studio
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-semibold text-black sm:text-5xl"
              >
                Minimal pieces for slow wardrobes and mindful makers.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
                className="max-w-xl text-base text-black/70 sm:text-lg"
              >
                We craft tees, jackets, and accessories using natural fibers and
                vintage-inspired dye techniques. Each drop is made in small
                batches by a dedicated studio team.
              </motion.p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/shop"
                  className="rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand"
                >
                  Shop the drop
                </Link>
                <Link
                  href="/about"
                  className="rounded-full border border-black/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-black"
                >
                  Our process
                </Link>
              </div>
              <div className="grid gap-6 pt-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-black/5 bg-white/60 px-5 py-4"
                  >
                    <p className="text-xs uppercase tracking-[0.28em] text-moss">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-black">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-soft"
            >
              <div className="grid gap-4">
                <div className="rounded-3xl bg-clay/70 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-moss">
                    Craft journal
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-black">
                    From loom to label
                  </h3>
                  <p className="mt-3 text-sm text-black/70">
                    See the texture, stitching, and hand-finished details in
                    our studio.
                  </p>
                </div>
                <div className="rounded-3xl border border-dashed border-black/10 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-moss">
                    Studio updates
                  </p>
                  <p className="mt-3 text-sm text-black/70">
                    Small runs. Natural dyes. Slow craft. Delivered monthly.
                  </p>
                </div>
              </div>
            </motion.div>
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
              const categoryProducts = getProductsByCategory(category);
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

