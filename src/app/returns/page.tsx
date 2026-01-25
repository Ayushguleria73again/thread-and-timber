import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Returns Policy"
          title="Returns and exchanges"
          subtitle="Our commitment to your satisfaction with our handcrafted pieces."
        />
        <div className="mt-10 space-y-6">
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <h3 className="mb-4 font-semibold text-black">Return Window</h3>
            <p className="text-sm text-black/70">
              We accept returns within 30 days of purchase. Items must be unworn,
              unwashed, and in original packaging with all tags attached.
            </p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <h3 className="mb-4 font-semibold text-black">How to Return</h3>
            <ol className="space-y-2 text-sm text-black/70">
              <li>1. Contact us at studio@threadtimber.co with your order number</li>
              <li>2. We'll provide a return label and instructions</li>
              <li>3. Package the item securely and ship it back</li>
              <li>4. Once received, we'll process your refund within 5-7 business days</li>
            </ol>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <h3 className="mb-4 font-semibold text-black">Exchanges</h3>
            <p className="text-sm text-black/70">
              Exchanges are available for different sizes if the item is in stock.
              Contact us to arrange an exchange. You'll be responsible for return
              shipping costs.
            </p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
            <h3 className="mb-4 font-semibold text-black">Refunds</h3>
            <p className="text-sm text-black/70">
              Refunds are issued to the original payment method. Processing takes
              5-7 business days after we receive and inspect the returned item.
              Shipping costs are non-refundable unless the item is defective.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
