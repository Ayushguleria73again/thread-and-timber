import Link from "next/link";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";

// Data fetching function
async function getPosts() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
  try {
    const res = await fetch(`${apiUrl}/posts`, {
        next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Journal"
          title="Studio notes and slow craft stories."
          subtitle="Short reads from the atelier on textiles, dyes, and mindful wardrobes."
        />
        
        {posts.length === 0 ? (
            <div className="mt-10 text-center py-20 rounded-3xl border border-black/5 bg-white/40">
                <p className="text-sm uppercase tracking-widest text-black/40">No stories published yet.</p>
            </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Link
                key={post.id || post._id}
                href={`/blog/${post.slug || post.id || post._id}`}
                className="group flex flex-col justify-between rounded-3xl border border-black/5 bg-white/70 p-6 transition-all hover:-translate-y-1 hover:border-black/10 hover:shadow-soft"
              >
                <div>
                    <div className="flex gap-2 text-[10px] uppercase tracking-[0.24em] text-moss mb-4">
                    <span>{new Date(post.createdAt || post.date || Date.now()).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.readTime || "Read"}</span>
                    </div>
                    <h3 className="text-xl font-serif font-medium text-black group-hover:text-moss transition-colors">
                    {post.title}
                    </h3>
                    <p className="mt-3 text-sm text-black/70 line-clamp-3">{post.excerpt || post.content?.substring(0, 100)}...</p>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  {(post.tags || []).map((tag: string) => (
                    <span key={tag} className="rounded-full border border-black/5 bg-white px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-black/60">
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
