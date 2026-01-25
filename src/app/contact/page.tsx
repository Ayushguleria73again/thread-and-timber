"use client";

import { useState } from "react";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Contact"
          title="Let us know what you're looking for."
          subtitle="We respond within 2 business days. For custom sizing or wholesale, add details below."
        />
        <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-3xl border border-black/5 bg-white/70 p-6">
            <input
              placeholder="Full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
            />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
            />
            <input
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
            />
            <textarea
              placeholder="Tell us about your request"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="min-h-[160px] rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
            />
            <button
              disabled={status === "loading"}
              className="rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand disabled:bg-black/50 transition"
            >
              {status === "loading" ? "Sending..." : "Send message"}
            </button>
            {status === "success" && <p className="text-center text-xs uppercase tracking-widest text-moss mt-2">Message received. Speak soon.</p>}
          </form>
          <div className="rounded-3xl border border-black/5 bg-white/60 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-moss">
              Studio hours
            </p>
            <p className="mt-3 text-sm text-black/70">
              Mon - Fri, 10am - 6pm
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-moss">
              Address
            </p>
            <p className="mt-3 text-sm text-black/70">
              24 Atelier Lane, Sonoma, CA
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-moss">
              Email
            </p>
            <p className="mt-3 text-sm text-black/70">studio@threadtimber.co</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

