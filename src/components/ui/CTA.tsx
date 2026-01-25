"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const NEWSLETTER_KEY = "thread-timber-newsletter";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const subscribers = JSON.parse(
      window.localStorage.getItem(NEWSLETTER_KEY) || "[]"
    );
    if (!subscribers.includes(email.trim())) {
      subscribers.push(email.trim());
      window.localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subscribers));
    }
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="container-pad pb-20 pt-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-black px-6 py-10 text-sand sm:px-10"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-clay">
              Stay in the loop
            </p>
            <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">
              Get first access to small-batch drops.
            </h3>
            <p className="mt-3 max-w-lg text-sm text-sand/70">
              We release limited pieces every month. Join the list for early
              access and behind-the-scenes notes from the atelier.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-sand/20 bg-transparent px-4 py-3 text-sm text-sand placeholder:text-sand/50 sm:w-64"
              placeholder="Email address"
              required
            />
            <button
              type="submit"
              className="rounded-full bg-sand px-6 py-3 text-xs uppercase tracking-[0.24em] text-black"
            >
              {submitted ? "Subscribed!" : "Notify me"}
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}

