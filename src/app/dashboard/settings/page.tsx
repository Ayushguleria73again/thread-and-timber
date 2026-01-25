"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { toast } from "sonner";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/components/auth/AuthProvider";

import { NotificationSettings, AccessibilitySettings, LocalizationSettings, PrivacySettings, SustainabilitySettings } from "@/components/auth/PreferenceSettings";
import AddressBook from "@/components/auth/AddressBook";
import DeleteAccountModal from "@/components/auth/DeleteAccountModal";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, updatePreferences, updateAddresses } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setName(user.name);
    setEmail(user.email);
  }, [user, router]);

  if (!user) return null;

  const defaultPreferences = {
    notifications: { collections: true, journal: true, restock: false },
    accessibility: { reducedMotion: false, largeText: false },
    privacy: { publicWishlist: false },
    sustainability: { showImpact: true },
    localization: { currency: "INR", language: "en" }
  };

  const prefs = user.preferences || defaultPreferences;

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    const token = localStorage.getItem("thread-timber-token");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email })
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("thread-timber-token");
    setIsDeleting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success("Account deleted. We hope to see you again.");
        logout();
        router.push("/");
      } else {
        toast.error("Failed to delete account");
        setIsDeleting(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <SectionHeading
          label="Account Settings"
          title="Manage your account"
          subtitle="Tailor your studio experience and preferences."
        />
        
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Left Column: Profile & Security */}
          <div className="space-y-8">
            <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-black">
                <FiUser /> Profile Information
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                />
                <button
                  onClick={handleSaveProfile}
                  className="w-full rounded-full bg-black py-3 text-xs uppercase tracking-[0.3em] text-sand"
                >
                  Save Profile
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-black">
                <FiLock /> Security
              </h3>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                />
                <button className="w-full rounded-full border border-black/10 py-3 text-xs uppercase tracking-[0.3em] text-black">
                  Update Password
                </button>
              </div>
            </div>

            <AddressBook 
               addresses={user.addresses || []} 
               onUpdate={updateAddresses} 
            />
          </div>

          {/* Right Column: Preferences */}
          <div className="space-y-8">
            <NotificationSettings 
              preferences={prefs} 
              updatePreferences={updatePreferences} 
            />
            
            <LocalizationSettings 
              preferences={prefs} 
              updatePreferences={updatePreferences} 
            />

            <AccessibilitySettings 
              preferences={prefs} 
              updatePreferences={updatePreferences} 
            />

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
              <PrivacySettings 
                preferences={prefs} 
                updatePreferences={updatePreferences} 
              />
              <SustainabilitySettings 
                preferences={prefs} 
                updatePreferences={updatePreferences} 
              />
            </div>

            <div className="pt-4 space-y-4">
              <button
                onClick={logout}
                className="w-full rounded-full border border-black/5 bg-white py-3 text-xs uppercase tracking-[0.3em] text-black transition-colors hover:bg-black hover:text-sand"
              >
                Log Out of Account
              </button>
              
              <div className="rounded-3xl border border-red-100 bg-red-50/30 p-8">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-red-500 mb-2">Danger Zone</h4>
                <p className="text-xs text-black/40 mb-6 leading-relaxed">Closing your account will remove your artisan profile, wishlist, and saved addresses permanently. Historic order records will be maintained for dispatch registries.</p>
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full rounded-full border border-red-200 bg-red-50 py-3 text-[10px] uppercase tracking-[0.3em] text-red-600 font-bold transition-all hover:bg-red-600 hover:text-white"
                >
                    Delete Studio Account
                </button>
              </div>
            </div>
          </div>
        </div>

        <DeleteAccountModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteAccount}
            isLoading={isDeleting}
        />
      </section>
      <Footer />
    </div>
  );
}
