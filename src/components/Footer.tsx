"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-sand">
      <div className="container-pad flex flex-col gap-6 py-10 text-sm text-ink/70 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-ink">
            Crafted in small batches
          </p>
          <p className="mt-2 max-w-md">
            Each piece is cut, stitched, and finished by hand in our studio. We
            ship worldwide in recycled packaging.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em]">
          <Link href="/shop">Shop</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

