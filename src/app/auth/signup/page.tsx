"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const ok = await signup(name.trim(), email.trim(), password);
    if (!ok) {
      setError("Account already exists with this email.");
      setIsLoading(false);
      return;
    }
    router.push("/shop");
  };

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Sign up"
          title="Create your studio account."
          subtitle="Save favorites, track orders, and get early drop access."
        />
        <form
          onSubmit={handleSubmit}
          className="mt-10 max-w-lg rounded-3xl border border-black/5 bg-white/70 p-6"
        >
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-4 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
          />
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-4 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
          />
          {error ? (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          ) : null}
          <button 
            disabled={isLoading}
            className="mt-6 w-full rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand disabled:bg-black/50"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>

          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/70 px-2 tracking-widest text-black/40">Or join with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => toast.info("Google signup coming soon")}
              type="button"
              className="flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-xs uppercase tracking-widest text-black transition-all hover:bg-white hover:border-black/30"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button
              onClick={() => toast.info("GitHub signup coming soon")}
              type="button"
              className="flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-xs uppercase tracking-widest text-black transition-all hover:bg-white hover:border-black/30"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </button>
          </div>

          <div className="mt-6 border-t border-black/5 pt-6 text-center">
            <p className="text-xs text-black/60 uppercase tracking-widest">
              Already have an account?
            </p>
            <Link 
              href="/auth/login"
              className="mt-3 inline-block w-full rounded-full border border-black/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-black transition-colors hover:border-black/30"
            >
              Log in to studio
            </Link>
          </div>
        </form>
      </section>
      <Footer />
    </div>
  );
}

