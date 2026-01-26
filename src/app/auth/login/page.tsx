"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";

import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, socialLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.replace(redirect);
    }
  }, [user, router, searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const ok = await login(email.trim(), password);
    if (!ok) {
      setError("Invalid email or password.");
      setIsLoading(false);
      return;
    }
    const redirect = searchParams.get("redirect") || "/";
    router.push(redirect);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 max-w-lg rounded-3xl border border-black/5 bg-white/70 p-6"
    >
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
      />
      <input
        type="password"
        placeholder="Password"
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
        {isLoading ? "Authenticating..." : "Log in"}
      </button>
      
      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-black/10"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white/70 px-2 tracking-widest text-black/40">Or continue with</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3">
        <button
          onClick={() => signIn("google")}
          type="button"
          className="flex items-center justify-center gap-3 rounded-full border border-black/10 bg-white px-6 py-4 text-xs uppercase tracking-widest text-black transition-all hover:border-black/30 hover:shadow-lg active:scale-[0.98]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <button
          onClick={() => signIn("facebook")}
          type="button"
          className="flex items-center justify-center gap-3 rounded-full bg-[#1877F2] px-6 py-4 text-xs uppercase tracking-widest text-white transition-all hover:bg-[#166fe5] hover:shadow-lg active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Continue with Facebook
        </button>

        <button
          onClick={() => signIn("apple")}
          type="button"
          className="flex items-center justify-center gap-3 rounded-full bg-black px-6 py-4 text-xs uppercase tracking-widest text-white transition-all hover:shadow-lg active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.75 1.18-.02 2.31-.93 3.57-.84 1.51.1 2.63.63 3.38 1.7-3.14 1.87-2.61 5.92.51 7.23-.62 1.57-1.44 3.12-2.54 4.13zM12.03 7.25c-.02-2.23 1.83-4.11 3.99-4.25.13 2.58-2.51 4.55-3.99 4.25z" />
          </svg>
          Continue with Apple
        </button>
      </div>

      <div className="mt-8 border-t border-black/5 pt-8 text-center">
        <p className="text-xs text-black/60 uppercase tracking-widest">
          Artisan Account — Register as Maker
        </p>
        <Link 
          href="/auth/signup"
          className="mt-3 inline-block w-full rounded-full border border-black/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-black transition-colors hover:border-black/30"
        >
          Create Studio Identity
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Log in"
          title="Welcome back to the studio."
          subtitle="Access your saved pieces and order history."
        />
        <Suspense fallback={
          <div className="mt-10 max-w-lg rounded-3xl border border-black/5 bg-white/70 p-6 flex items-center justify-center">
            <p className="text-sm uppercase tracking-widest text-black/40 animate-pulse">Loading login studio...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </section>
      <Footer />
    </div>
  );
}

