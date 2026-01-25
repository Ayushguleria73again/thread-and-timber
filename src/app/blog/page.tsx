"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Journal"
          title="Studio notes and slow craft stories."
          subtitle="Short reads from the atelier on textiles, dyes, and mindful wardrobes."
        />
        {loading ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 animate-pulse rounded-3xl bg-white/40" />
                ))}
            </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id || post._id}
                href={`/blog/${post.slug || post.id}`}
                className="rounded-3xl border border-black/5 bg-white/70 p-6 transition hover:-translate-y-1 hover:border-black/10"
              >
                <div className="flex gap-2 text-xs uppercase tracking-[0.24em] text-moss">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-black">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm text-black/70">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-black/60">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="rounded-full border px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

