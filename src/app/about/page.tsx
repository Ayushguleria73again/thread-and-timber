"use client";

import { motion } from "framer-motion";
import CTA from "@/components/ui/CTA";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { FiWind, FiSun, FiHeart, FiLayers, FiAnchor, FiCheckCircle } from "react-icons/fi";

const timeline = [
  {
    year: "2017",
    title: "The Single Loom",
    detail: "Thread & Timber began in a small room in the Kangra Valley with a single hand-loom and a vision for slow, honest textiles."
  },
  {
    year: "2018",
    title: "Natural Sourcing",
    detail: "We established direct partnerships with local Himachali fiber growers, ensuring every thread had a traceable mountain origin."
  },
  {
    year: "2020",
    title: "The Dye Workshop",
    detail: "Experimentation with marigold, walnut husks, and indigo led to our first 100% plant-based dye collection."
  },
  {
    year: "2022",
    title: "Artisan Collective",
    detail: "We expanded into a collective of six master weavers, specializing in the intersection of traditional technique and modern silhouette."
  },
  {
    year: "2024",
    title: "Registry Expansion",
    detail: "Launching our global digital registry to bring Himalayan slow-craft to mindful wardrobes across the world."
  }
];

const philosophy = [
  {
    icon: <FiWind />,
    title: "Slow Craft",
    text: "We reject the frantic pace of the modern industry. Each piece is given the time it deserves to be woven, washed, and finished by hand."
  },
  {
    icon: <FiSun />,
    title: "Natural Sourcing",
    text: "All our fibers—organic cotton, linen, and hemp—are sourced with respect for the soil and the artisans who cultivate them."
  },
  {
    icon: <FiHeart />,
    title: "Mindful Wardrobes",
    text: "We create pieces intended for a lifetime of stories. Every stitch is a commitment to longevity, comfort, and quiet confidence."
  }
];

const processes = [
  {
    number: "01",
    label: "The Fiber",
    title: "Mountain Sourced",
    description: "We begin with the raw material—organic cotton and linen grown in sustainable Himalayan environments, chosen for texture and resilience."
  },
  {
    number: "02",
    label: "The Dye",
    title: "Earth Tones",
    description: "Our pigments come from the earth. Marigold, pomegranate, and indigo are fermented in our studio to create lived-in, soul-soothing colors."
  },
  {
    number: "03",
    label: "The Loom",
    title: "The Rhythm of Hand",
    description: "Our weavers work on traditional hand-looms, where the slight variation in the weave becomes the fingerprint of the artisan."
  },
  {
    number: "04",
    label: "The Stitch",
    title: "Refined Finishing",
    description: "Every seam is finished with care, using recycled hardware and reinforced stitching to ensure your piece ages with grace."
  }
];

const makers = [
  {
    name: "Tenzin",
    role: "Master Weaver",
    bio: "With 30 years of experience in the Kangra tradition, Tenzin oversees the rhythm and tension of every loom."
  },
  {
    name: "Priya",
    role: "Lead Dyer",
    bio: "Priya translates the colors of the valley into our plant-based palettes through meticulous natural fermentation."
  },
  {
    name: "Ravi",
    role: "Studio Manager",
    bio: "Ensuring the studio environment remains a sanctuary for craft and the well-being of our collective."
  }
];

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-sand overflow-hidden">
      {/* Hero Section */}
      <section className="container-pad py-20 lg:py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeInUp}>
                <SectionHeading
                    label="Our Story"
                    title="A Weaver's Sanctuary in the Kangra Valley."
                    subtitle="Born from the rhythm of the loom and the pace of the mountains, Thread & Timber is a slow studio dedicated to the art of honest clothing."
                />
            </motion.div>
            <motion.div 
                {...fadeInUp}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mt-16 h-[500px] w-full rounded-[3rem] border border-black/5 bg-white/40 shadow-soft overflow-hidden relative"
            >
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/20 italic">Immersive Studio Atmosphere</p>
                </div>
                {/* Image Placeholder - In production this would be a high-quality studio hero image */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5" />
            </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white/50 py-24 lg:py-32 border-y border-black/5">
        <div className="container-pad max-w-6xl mx-auto">
            <div className="grid gap-12 md:grid-cols-3">
                {philosophy.map((item, idx) => (
                    <motion.div 
                        key={item.title}
                        {...fadeInUp}
                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="h-12 w-12 rounded-2xl bg-black text-sand flex items-center justify-center text-xl shadow-lg shadow-black/5">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-serif italic text-black">{item.title}</h3>
                        <p className="text-sm text-black/60 leading-relaxed">{item.text}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Artisan Process Section */}
      <section className="container-pad py-24 lg:py-32">
        <div className="max-w-4xl mx-auto mb-20 text-center">
            <SectionHeading
                label="Process"
                title="The Journey of a Single Thread."
                subtitle="We believe in transparency. Here is how your artisan piece moves from earth to wardrobe."
            />
        </div>
        
        <div className="max-w-5xl mx-auto space-y-32">
            {processes.map((step, idx) => (
                <motion.div 
                    key={step.number}
                    {...fadeInUp}
                    className={`flex flex-col gap-12 md:flex-row items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                >
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-serif italic text-black/10">{step.number}</span>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-moss">{step.label}</span>
                        </div>
                        <h3 className="text-3xl font-serif italic text-black">{step.title}</h3>
                        <p className="text-sm text-black/60 leading-relaxed max-w-md">{step.description}</p>
                    </div>
                    <div className="flex-1 w-full aspect-[4/3] rounded-[2.5rem] border border-black/5 bg-white/70 shadow-soft overflow-hidden relative">
                         <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                            <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-black/10">Process Documentation {step.number}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Meet the Makers Section */}
      <section className="bg-moss/5 py-24 lg:py-32 border-y border-black/5">
        <div className="container-pad max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <SectionHeading
                    label="The Collective"
                    title="Meet the Makers"
                    subtitle="Our studio is more than a space; it is a gathered knowledge of hands and hearts."
                />
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
                {makers.map((maker, idx) => (
                    <motion.div 
                        key={maker.name}
                        {...fadeInUp}
                        transition={{ delay: idx * 0.1 }}
                        className="group rounded-[2.5rem] bg-white p-8 shadow-soft border border-black/5 hover:-translate-y-2 transition-all duration-500"
                    >
                        <div className="mb-6 h-48 w-full rounded-2xl bg-sand/60 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                             <div className="absolute inset-0 flex items-center justify-center">
                                <FiHeart className="text-black/5 text-4xl" />
                            </div>
                        </div>
                        <h4 className="text-lg font-serif italic text-black">{maker.name}</h4>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-moss mb-4">{maker.role}</p>
                        <p className="text-sm text-black/60 leading-relaxed">{maker.bio}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container-pad py-24 lg:py-32 relative">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <SectionHeading
                    label="The Path"
                    title="Studio Evolution"
                    subtitle="A chronicle of slow growth and intentional progress."
                />
            </div>
            
            <div className="space-y-12">
                {timeline.map((entry, idx) => (
                    <motion.div 
                        key={entry.year}
                        {...fadeInUp}
                        className="flex gap-8 group"
                    >
                        <div className="shrink-0 space-y-2 text-right w-20">
                            <span className="text-lg font-serif italic text-black block">{entry.year}</span>
                            <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ duration: 1, delay: idx * 0.2 }}
                                    className="h-full bg-moss/30"
                                />
                            </div>
                        </div>
                        <div className="flex-1 pb-12 border-l border-black/5 pl-8 relative">
                            <div className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-black shadow-lg" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-2">{entry.title}</h3>
                            <p className="text-sm text-black/60 leading-relaxed max-w-2xl">{entry.detail}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="pb-24 lg:pb-32">
        <div className="container-pad max-w-4xl mx-auto">
            <motion.div 
                {...fadeInUp}
                className="rounded-[3rem] bg-black p-12 lg:p-20 text-sand text-center relative overflow-hidden"
            >
                <div className="relative z-10 space-y-6">
                    <SectionHeading
                        label="Impact"
                        title="Committed to the Himalayan Soils"
                        subtitle="We aim to leave no footprint other than the one your boots make on the mountain path."
                        center
                    />
                    <div className="flex flex-wrap justify-center gap-8 mt-12">
                        <div className="flex items-center gap-2">
                            <FiCheckCircle className="text-moss" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">100% Traceable Fiber</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiCheckCircle className="text-moss" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Zero Synthetic Dyes</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FiCheckCircle className="text-moss" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Plastic Free Dispatch</span>
                        </div>
                    </div>
                </div>
                <FiAnchor className="absolute -bottom-10 -right-10 text-[10rem] text-white/5 rotate-12" />
            </motion.div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}

