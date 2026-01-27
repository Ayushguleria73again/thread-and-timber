"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

const foyerVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function SignupPage() {
  const router = useRouter();
  const { signup, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

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
    <div className="min-h-screen bg-[#FAF8F6]">
      <section className="container-pad py-12 lg:py-20">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-moss mb-4">Studio Joinery</p>
            <h1 className="font-serif text-4xl lg:text-5xl italic text-black leading-tight">Create your identity.</h1>
            <p className="mt-4 text-xs uppercase tracking-widest text-black/40 max-w-md">Join the artisan community.</p>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={foyerVariants}
          className="mt-10 mx-auto max-w-lg"
        >
          <form
            onSubmit={handleSubmit}
            className="rounded-[2.5rem] border border-black/5 bg-white/60 p-8 shadow-soft backdrop-blur-xl lg:p-10"
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Artisan Full Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white/50 px-6 py-4 text-sm focus:border-black outline-none transition-all placeholder:text-black/30"
              />
              <input
                type="email"
                placeholder="Registration Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white/50 px-6 py-4 text-sm focus:border-black outline-none transition-all placeholder:text-black/30"
              />
              <input
                type="password"
                placeholder="Create Studio Passkey"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white/50 px-6 py-4 text-sm focus:border-black outline-none transition-all placeholder:text-black/30"
              />
            </div>

            {error && (
                <p className="mt-4 text-[10px] uppercase tracking-widest text-red-500 font-bold ml-2">{error}</p>
            )}

            <button 
              disabled={isLoading}
              className="mt-10 w-full rounded-full bg-black px-8 py-5 text-[10px] uppercase tracking-[0.4em] font-bold text-sand shadow-xl shadow-black/20 hover:bg-black/90 active:scale-[0.98] transition-all disabled:bg-black/40"
            >
              {isLoading ? "Synchronizing..." : "Create Identity"}
            </button>

            <div className="relative my-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/5"></div>
              </div>
              <div className="relative flex justify-center text-[8px] uppercase tracking-[0.3em] font-bold">
                <span className="bg-[#FAF8F6] px-4 text-black/30">Artisan Social Joinery</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => signIn("google")}
                type="button"
                className="flex items-center justify-center gap-3 rounded-2xl border border-black/[0.03] bg-white px-4 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-black transition-all hover:border-black/10 hover:shadow-soft hover:-translate-y-0.5 active:scale-95"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>

              <button
                onClick={() => signIn("facebook")}
                type="button"
                className="flex items-center justify-center gap-3 rounded-2xl border border-black/[0.03] bg-white px-4 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-black transition-all hover:border-black/10 hover:shadow-soft hover:-translate-y-0.5 active:scale-95"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Meta
              </button>
            </div>

            <div className="mt-12 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/20">Existing Member?</p>
                <Link 
                    href="/auth/login"
                    className="mt-4 block text-[10px] uppercase tracking-[0.3em] font-bold text-black underline underline-offset-8 decoration-black/10 hover:decoration-black transition-all"
                >
                    Return to Login
                </Link>
            </div>
          </form>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}

