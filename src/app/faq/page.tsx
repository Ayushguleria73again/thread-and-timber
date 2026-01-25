import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import FAQClient from "@/components/ui/FAQClient";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="FAQ"
          title="Frequently asked questions"
          subtitle="Find answers to common questions about our products, shipping, and returns."
        />
        <FAQClient />
      </section>
      <Footer />
    </div>
  );
}
