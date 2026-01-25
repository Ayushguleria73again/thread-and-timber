import { Suspense } from "react";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import PaymentClient from "@/components/cart/PaymentClient";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-sand">
      <Suspense fallback={
        <section className="container-pad py-20 flex items-center justify-center">
          <p className="text-[10px] uppercase tracking-widest text-black/20 animate-pulse">Initializing secure checkout...</p>
        </section>
      }>
        <section className="container-pad py-12">
          <SectionHeading
            label="Payment"
            title="Secure checkout for your handcrafted pieces."
            subtitle="Complete your order with secure payment processing."
          />
          <PaymentClient />
        </section>
      </Suspense>
      <Footer />
    </div>
  );
}
