"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AuthLandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);
  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Account"
          title="Sign in to save your handcrafted picks."
          subtitle="Create an account to track orders, save items, and check out faster."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/5 bg-white/70 p-8">
            <h3 className="text-xl font-semibold text-black">Log in</h3>
            <p className="mt-3 text-sm text-black/70">
              Welcome back. Access your saved cart and recent orders.
            </p>
            <Link
              href="/auth/login"
              className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand"
            >
              Log in
            </Link>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white/70 p-8">
            <h3 className="text-xl font-semibold text-black">Sign up</h3>
            <p className="mt-3 text-sm text-black/70">
              Create a new account for early access and studio updates.
            </p>
            <Link
              href="/auth/signup"
              className="mt-6 inline-block rounded-full border border-black/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-black"
            >
              Sign up
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

