"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="container-pad pb-20 pt-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-ink px-6 py-10 text-sand sm:px-10"
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
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <input
              className="w-full rounded-full border border-sand/20 bg-transparent px-4 py-3 text-sm text-sand placeholder:text-sand/50 sm:w-64"
              placeholder="Email address"
            />
            <button className="rounded-full bg-sand px-6 py-3 text-xs uppercase tracking-[0.24em] text-ink">
              Notify me
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

