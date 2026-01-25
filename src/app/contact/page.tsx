"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiInstagram, FiTwitter, FiMail, FiMapPin, FiClock, FiSend, FiMessageSquare } from "react-icons/fi";
import { FaPinterestP } from "react-icons/fa";
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

  const socials = [
    { name: "Instagram", icon: <FiInstagram />, href: "#", color: "hover:text-pink-500" },
    { name: "Pinterest", icon: <FaPinterestP />, href: "#", color: "hover:text-red-600" },
    { name: "X (Twitter)", icon: <FiTwitter />, href: "#", color: "hover:text-black" },
  ];

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Inquiries"
            title="Connect with the Studio"
            subtitle="Whether it's a sizing request, custom collaboration, or wholesale inquiry, our artisans are here to assist."
          />
          
          <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_400px]">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="rounded-[2.5rem] border border-black/5 bg-white/70 p-8 shadow-soft backdrop-blur-xl md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-1">Your Name</label>
                      <input
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full rounded-2xl border border-black/5 bg-sand/30 px-5 py-4 text-sm outline-none transition-all focus:border-black/10 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full rounded-2xl border border-black/5 bg-sand/30 px-5 py-4 text-sm outline-none transition-all focus:border-black/10 focus:bg-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-1">Subject</label>
                    <input
                      placeholder="Custom Order / Wholesale / Support"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full rounded-2xl border border-black/5 bg-sand/30 px-5 py-4 text-sm outline-none transition-all focus:border-black/10 focus:bg-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 ml-1">Message</label>
                    <textarea
                      placeholder="Describe your artisan request..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full rounded-2xl border border-black/5 bg-sand/30 px-5 py-4 text-sm outline-none transition-all focus:border-black/10 focus:bg-white resize-none"
                    />
                  </div>
                  
                  <button
                    disabled={status === "loading"}
                    className="group flex w-full items-center justify-center gap-3 rounded-full bg-black py-4 text-[10px] uppercase tracking-[0.4em] font-bold text-sand shadow-lg shadow-black/10 transition-all hover:bg-black/90 active:scale-[0.98] disabled:bg-black/40"
                  >
                    {status === "loading" ? "Dispatching..." : (
                      <>
                        <FiSend className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        Send Dispatch
                      </>
                    )}
                  </button>

                  {status === "success" && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl bg-moss/5 border border-moss/10 p-4 text-center text-[10px] uppercase tracking-widest text-moss font-bold mt-4"
                    >
                      Registry entry received. We will respond shortly.
                    </motion.p>
                  )}
                  {status === "error" && (
                    <p className="rounded-2xl bg-red-500/5 border border-red-500/10 p-4 text-center text-[10px] uppercase tracking-widest text-red-500 font-bold mt-4">
                      Dispatch failed. Please retry your transmission.
                    </p>
                  )}
                </form>
              </div>
            </div>

            {/* Studio Info & Socials */}
            <div className="space-y-8 lg:pt-4">
              <div className="rounded-[2.5rem] border border-black/5 bg-white/40 p-8 shadow-soft backdrop-blur-xl">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 mb-8 border-b border-black/5 pb-4">Studio Registry</h3>
                
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-sand shadow-lg shadow-black/5">
                      <FiClock />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Studio Hours</p>
                      <p className="mt-1 text-sm font-serif italic text-black">Mon - Fri, 10am - 6pm</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-sand shadow-lg shadow-black/5">
                      <FiMapPin />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Headquarters</p>
                      <p className="mt-1 text-sm font-serif italic text-black">Kangra, Himachal Pradesh, India</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-sand shadow-lg shadow-black/5">
                      <FiMail />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-black/40">Artisan Support</p>
                      <p className="mt-1 text-sm font-serif italic text-black">studio@threadtimber.in</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-black/5">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-black/40 mb-6">Gallery Presence</p>
                  <div className="flex gap-4">
                    {socials.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-black/5 text-xl text-black/40 shadow-sm transition-all hover:-translate-y-1 hover:border-black/10 hover:shadow-md ${social.color}`}
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Newsletter Callout or Secondary Info */}
              <div className="rounded-[2.5rem] bg-moss p-10 text-sand shadow-lg shadow-moss/10">
                <FiMessageSquare className="mb-4 text-3xl opacity-50" />
                <h4 className="font-serif text-xl italic leading-tight">Join our artisan circle for first access to Himalayan drops.</h4>
                <p className="mt-4 text-[10px] uppercase tracking-widest opacity-60">Subscriber registry open now</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

