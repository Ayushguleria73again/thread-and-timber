"use client";

import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
const testimonials = [
  {
    id: 1,
    text: "The quality of the linen is unlike anything I've found elsewhere. It breathes with you.",
    author: "Elena R.",
    role: "Visual Artist",
    location: "Portland, OR"
  },
  {
    id: 2,
    text: "I love knowing exactly who made my jacket. The stitch details are incredible.",
    author: "Marcus T.",
    role: "Architect",
    location: "Austin, TX"
  },
  {
    id: 3,
    text: "Sustainable fashion that actually feels luxurious. My wardrobe staples for years.",
    author: "Sarah J.",
    role: "Ceramicist",
    location: "Brooklyn, NY"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="container-pad py-12">
      <SectionHeading
        label="Testimonials"
        title="What our customers say"
        subtitle="Real stories from makers who love our handcrafted pieces."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial: any, index: number) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-black/5 bg-white/70 p-6"
          >
            <div className="mb-4 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className="fill-moss text-moss"
                />
              ))}
            </div>
            <p className="mb-4 text-sm text-black/70">"{testimonial.text}"</p>
            <div>
              <p className="font-semibold text-black">{testimonial.author}</p>
              <p className="text-xs text-black/60">{testimonial.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
