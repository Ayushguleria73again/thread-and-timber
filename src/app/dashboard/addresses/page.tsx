"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMapPin, FiPlus, FiTrash2, FiCheck } from "react-icons/fi";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";
import AddressBook from "@/components/auth/AddressBook";

export default function AddressesPage() {
  const router = useRouter();
  const { user, updateAddresses } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/dashboard/addresses");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
            <SectionHeading
              label="Collection Points"
              title="Your Studio Registry"
              subtitle="Curate and manage the destinations for your artisan pieces."
            />
            
            <div className="mt-12">
                <AddressBook 
                    addresses={user.addresses || []} 
                    onUpdate={updateAddresses} 
                />
            </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
