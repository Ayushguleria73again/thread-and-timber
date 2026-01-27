"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMapPin, FiPlus, FiTrash2, FiCheck, FiArrowLeft } from "react-icons/fi";
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
            <Link 
              href="/" 
              className="group mb-8 flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 hover:text-black transition-colors"
            >
              <FiArrowLeft className="text-sm transition-transform group-hover:-translate-x-1" />
              Back to Studio
            </Link>
            <SectionHeading
              label="Collection Points"
              title="Your Studio Addresses"
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
