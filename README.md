# Thread & Timber - Artisan Storefront

The premium frontend for Thread & Timber, crafted with Next.js, Tailwind CSS, and Framer Motion. This foyer serves as the digital entrance to a high-fidelity artisan ecosystem.

## The Artisan Experience
A high-fidelity shopping experience designed for slow fashion and mindful acquisitions:
- **Artisan Dashboard**: A cinematic, glassmorphic portal for managing studio profiles and tracking handcrafted collections.
- **Virtual Studio Wallet**: Seamlessly redeem artisan tokens and utilize store credit for bespoke acquisitions.
- **Automated Registry Dispatch**: Secure, beautifully-styled email notifications for every order and gift card transmission.
- **Responsive Craftsmanship**: Mobile-optimized category sliders and navigation that scale elegantly across all viewports.
- **Cinematic Motion**: Orchestrated entry animations and micro-interactions powered by Framer Motion.
- **Premium Typography**: Himalayan-inspired serif branding and meticulous layout design.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Glassmorphism & Custom Palettes)
- **Animations**: Framer Motion
- **Icons**: React Icons (Feather & Artisan symbols)
- **State Management**: React Context (Auth, Cart, Wishlist, Wallet Sync)
- **Notifications**: Sonner (High-contrast toasts)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Backend server running on port 5001

### Installation
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

### Opening the Storefront
- **Development Mode**:
  ```bash
  npm run dev
  ```
  Visit [http://localhost:3000](http://localhost:3000)

## Key Features
- **Artisan Dashboard**: `/dashboard` - A premium home base for mindful makers.
- **Virtual Wallet**: Integrated redemption and checkout balance usage.
- **Category Sliders**: High-fidelity horizontal scrolling on mobile galleries.
- **Floating Navigation**: Context-aware nav that intelligently appears based on artisan flow.
- **Artisan Reviews**: Glowing star ratings and community-driven acquisition feedback.
- **Admin Panel**: `/adminp` - Elite inventory and sales registry management.
- **SEO Optimized**: High-fidelity structured data and semantically crafted markup.
