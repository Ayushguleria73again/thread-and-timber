import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { WishlistProvider } from "@/components/auth/WishlistProvider";
import { RecentlyViewedProvider } from "@/components/product/RecentlyViewedProvider";
import Navbar from "@/components/layout/Navbar";
import FloatingNav from "@/components/layout/FloatingNav";
import { Toaster } from "sonner";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Thread & Timber - Handcrafted Apparel",
  description:
    "Minimal, handcrafted apparel for the makers who value texture, comfort, and story."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body className={`${outfit.className} antialiased`}>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#F6F2EC",
              color: "#1A1A1A",
              border: "1px solid rgba(0,0,0,0.05)",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              fontFamily: "inherit",
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              padding: "16px 24px",
            }
          }}
        />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <Navbar />
                <FloatingNav />
                {children}
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

