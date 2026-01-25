import CTA from "@/components/ui/CTA";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";

const timeline = [
  {
    year: "2017",
    detail: "Thread & Timber began as a one-room studio and a single loom."
  },
  {
    year: "2020",
    detail: "We expanded into natural dye workshops and small-batch drops."
  },
  {
    year: "2024",
    detail: "Our studio team grew to six makers and a rotating group of artisans."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Our story"
          title="A slow studio for mindful wardrobes."
          subtitle="We design timeless pieces that honor craft, texture, and everyday comfort."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {timeline.map((entry) => (
            <div
              key={entry.year}
              className="rounded-3xl border border-black/5 bg-white/70 p-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-moss">
                {entry.year}
              </p>
              <p className="mt-4 text-sm text-black/70">{entry.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-3xl border border-black/5 bg-white/60 p-8">
          <p className="text-sm text-black/70">
            Every piece is cut, stitched, and washed in our studio. We work with
            natural fibers, plant-based dyes, and recycled hardware so each item
            feels soft, lived-in, and ready to collect more stories.
          </p>
        </div>
      </section>
      <CTA />
      <Footer />
    </div>
  );
}

