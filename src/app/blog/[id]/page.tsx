import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import posts from "@/data/posts.json";

type BlogPageProps = {
  params: { id: string };
};

export default function BlogDetailPage({ params }: BlogPageProps) {
  const post = posts.find((item) => item.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Studio Journal"
          title={post.title}
          subtitle={post.excerpt}
        />
        <div className="mt-8 rounded-3xl border border-black/5 bg-white/70 p-8 text-sm text-black/70">
          <p>
            We keep a small notebook in the studio to capture the thoughts,
            textures, and conversations behind each drop. This entry reflects
            how we balance calm, utility, and softness in our latest batch.
          </p>
          <p className="mt-4">
            Our team works with low-impact dyes, softened cottons, and slow
            weaving techniques to create pieces that feel familiar from the
            first wear. We invite you to explore the process and take note of
            the subtle details that make each garment unique.
          </p>
          <p className="mt-4">
            Follow along for more notes from the studio and upcoming product
            previews.
          </p>
        </div>
        <Link
          href="/blog"
          className="mt-8 inline-block rounded-full border border-black/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-black"
        >
          Back to journal
        </Link>
      </section>
      <Footer />
    </div>
  );
}

