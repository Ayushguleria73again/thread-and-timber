import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import PaymentClient from "@/components/cart/PaymentClient";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Payment"
          title="Secure checkout for your handcrafted pieces."
          subtitle="Complete your order with secure payment processing."
        />
        <PaymentClient />
      </section>
      <Footer />
    </div>
  );
}
