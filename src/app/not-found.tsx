import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-moss">
          Page not found
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-black">
          We couldn't find that piece.
        </h1>
        <p className="mt-4 text-sm text-black/70">
          Explore the shop for the latest handcrafted items.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand"
        >
          Visit shop
        </Link>
      </section>
      <Footer />
    </div>
  );
}

