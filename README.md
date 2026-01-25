# Thread & Timber - Artisan Storefront

The premium frontend for Thread & Timber, crafted with Next.js, Tailwind CSS, and Framer Motion.

## The Artisan Experience
A high-fidelity shopping experience designed for slow fashion:
- **Responsive Design**: Mobile-optimized category sliders and navigation
- **Dynamic Shop**: Filterable collections with real-time stock status
- **Secure Checkout**: Integrated payment flow with coupon validation
- **User Dashboard**: Manage profiles, addresses, and view order history
- **Interactive details**: Premium typography, micro-animations, and smooth transitions

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons (Feather)
- **State Management**: React Context (Auth, Cart, Wishlist)
- **Notifications**: Sonner

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
- **Category Sliders**: Horizontal scrolling collections on mobile
- **Floating Navigation**: Smart nav that appears on scroll
- **Artisan Reviews**: Glowing star ratings and community feedback
- **Admin Panel**: `/adminp` for inventory and sales management
- **SEO Optimized**: Structured data and semantic markup
