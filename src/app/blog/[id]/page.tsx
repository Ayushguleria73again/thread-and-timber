import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";

type BlogPageProps = {
  params: { id: string };
};

// Data fetching function
async function getPost(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
  try {
    const res = await fetch(`${apiUrl}/posts/${id}`, {
      // Revalidate every hour or use 'no-store' for instant updates
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) {
        return null;
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  // Format content for display (simple paragraphs)
  const paragraphs = post.content ? post.content.split('\n').filter((p: string) => p.trim()) : [];

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12 max-w-4xl mx-auto">
        <Link 
            href="/blog" 
            className="mb-8 inline-block text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors"
        >
            ← Back to Journal
        </Link>

        {/* Header */}
        <div className="mb-12">
            <span className="mb-4 block text-xs font-serif italic text-moss">
            {post.category || "Studio Notes"}
            </span>
            <h1 className="mb-6 font-serif text-4xl font-medium text-black md:text-5xl leading-tight">
            {post.title}
            </h1>
            <div className="flex items-center gap-4 border-y border-black/5 py-4 text-[10px] uppercase tracking-widest text-black/60">
                <span>{post.author || "Team Thread & Timber"}</span>
                <span>•</span>
                <span>{new Date(post.createdAt || post.date).toLocaleDateString()}</span>
                <span className="ml-auto">{post.readTime || "5 min read"}</span>
            </div>
        </div>

        {/* Hero Image */}
        <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/5">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose prose-stone mx-auto max-w-none prose-headings:font-serif prose-p:font-light prose-p:leading-relaxed prose-p:text-black/80">
            {paragraphs.map((paragraph: string, index: number) => (
                <p key={index} className="mb-6 indent-8 md:indent-0">{paragraph}</p>
            ))}
        </div>

        {/* CTA */}
        <div className="mt-16 border-t border-black/10 pt-8 text-center">
            <p className="mb-6 text-sm italic text-black/60">
                "Simple, natural, and timeless."
            </p>
            <Link
            href="/blog"
            className="inline-block rounded-full bg-black px-8 py-3 text-xs uppercase tracking-[0.2em] text-sand transition-transform hover:scale-105"
            >
            Read More Stories
            </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
