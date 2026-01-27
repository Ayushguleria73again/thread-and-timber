"use client";

import Switch from "@/components/ui/Switch";
import { User } from "@/lib/auth";

interface SectionProps {
  preferences: User["preferences"];
  updatePreferences: (prefs: User["preferences"]) => void;
}

export function NotificationSettings({ preferences, updatePreferences }: SectionProps) {
  if (!preferences) return null;
  
  const toggle = (key: keyof typeof preferences.notifications) => {
    updatePreferences({
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: !preferences.notifications[key]
      }
    });
  };

  return (
    <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
      <h3 className="mb-4 font-semibold text-black">Newsletter & Drop Alerts</h3>
      <div className="space-y-4">
        {[
          { id: 'collections', label: 'New Collection Alerts', desc: 'Be the first to hear about seasonal drops.' },
          { id: 'journal', label: 'Journal Updates', desc: 'Studio stories and artisan interviews.' },
          { id: 'restock', label: 'Stock Notifications', desc: 'Alerts for when sold-out items return.' }
        ].map((item: any) => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">{item.label}</p>
              <p className="text-xs text-black/60">{item.desc}</p>
            </div>
            <Switch 
               checked={preferences.notifications[item.id as keyof typeof preferences.notifications]} 
               onChange={() => toggle(item.id as keyof typeof preferences.notifications)} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AccessibilitySettings({ preferences, updatePreferences }: SectionProps) {
  if (!preferences) return null;

  const toggle = (key: keyof typeof preferences.accessibility) => {
    updatePreferences({
      ...preferences,
      accessibility: {
        ...preferences.accessibility,
        [key]: !preferences.accessibility[key]
      }
    });
  };

  return (
    <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
      <h3 className="mb-4 font-semibold text-black">Accessibility</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-black">Reduced Motion</p>
            <p className="text-xs text-black/60">Minimize animations and smooth scrolling.</p>
          </div>
          <Switch 
            checked={preferences.accessibility.reducedMotion} 
            onChange={() => toggle('reducedMotion')} 
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-black">Large Text Mode</p>
            <p className="text-xs text-black/60">Increase font sizes for better legibility.</p>
          </div>
          <Switch 
            checked={preferences.accessibility.largeText} 
            onChange={() => toggle('largeText')} 
          />
        </div>
      </div>
    </div>
  );
}

export function LocalizationSettings({ preferences, updatePreferences }: SectionProps) {
  if (!preferences) return null;

  const handleChange = (key: keyof typeof preferences.localization, value: string) => {
    updatePreferences({
      ...preferences,
      localization: {
        ...preferences.localization,
        [key]: value
      }
    });
  };

  return (
    <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
      <h3 className="mb-4 font-semibold text-black">Currency & Localization</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-black/50">Currency</label>
          <select 
            value={preferences.localization.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-black/50">Language</label>
          <select 
            value={preferences.localization.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function PrivacySettings({ preferences, updatePreferences }: SectionProps) {
  if (!preferences) return null;

  return (
    <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
      <h3 className="mb-4 font-semibold text-black">Privacy</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-black">Public Wishlist</p>
          <p className="text-xs text-black/60">Allow others to view your saved pieces via a shareable link.</p>
        </div>
        <Switch 
          checked={preferences.privacy.publicWishlist} 
          onChange={() => updatePreferences({
            ...preferences,
            privacy: { ...preferences.privacy, publicWishlist: !preferences.privacy.publicWishlist }
          })} 
        />
      </div>
    </div>
  );
}

export function SustainabilitySettings({ preferences, updatePreferences }: SectionProps) {
  if (!preferences) return null;

  return (
    <div className="rounded-3xl border border-black/5 bg-white/70 p-6">
      <h3 className="mb-4 font-semibold text-black">Brand Story</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-black">Sustainability Impact Report</p>
          <p className="text-xs text-black/60">Show your environmental impact from choosing slow craft.</p>
        </div>
        <Switch 
          checked={preferences.sustainability.showImpact} 
          onChange={() => updatePreferences({
            ...preferences,
            sustainability: { ...preferences.sustainability, showImpact: !preferences.sustainability.showImpact }
          })} 
        />
      </div>
    </div>
  );
}
