import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Shipping Policy"
          title="Shipping information"
          subtitle="Everything you need to know about shipping your handcrafted pieces."
        />
        <div className="mt-10 space-y-6">
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <h3 className="mb-4 font-semibold text-black">Domestic Shipping</h3>
            <p className="text-sm text-black/70">
              Standard shipping within the United States takes 5-7 business days
              and costs $8.00. Express shipping (2-3 business days) is available
              for $15.00. Orders are processed within 1-2 business days.
            </p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <h3 className="mb-4 font-semibold text-black">International Shipping</h3>
            <p className="text-sm text-black/70">
              We ship worldwide. International shipping times vary by destination,
              typically 10-14 business days. Shipping costs are calculated at
              checkout based on your location. Customers are responsible for any
              customs duties or taxes.
            </p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <h3 className="mb-4 font-semibold text-black">Tracking</h3>
            <p className="text-sm text-black/70">
              Once your order ships, you'll receive a tracking number via email.
              You can track your package using the link provided or through your
              account dashboard.
            </p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <h3 className="mb-4 font-semibold text-black">Packaging</h3>
            <p className="text-sm text-black/70">
              All items are carefully packaged in recycled materials. We use
              minimal packaging to reduce waste while ensuring your items arrive
              safely.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
