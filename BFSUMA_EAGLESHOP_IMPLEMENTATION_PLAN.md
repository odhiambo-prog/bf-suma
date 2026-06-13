# BF SUMA Eagleshop — Full Implementation Plan
> **For CLI Agent Execution** | React + Vite + TypeScript + Supabase
> Base repo: `website/` (existing Vite + React prototype)

---

## Table of Contents
1. [Architecture Decision: Do We Need a Backend?](#1-architecture-decision)
2. [Modularity Strategy](#2-modularity-strategy)
3. [Inventory API Integration](#3-inventory-api-integration)
4. [New Dependencies](#4-new-dependencies)
5. [Folder Structure Refactor](#5-folder-structure-refactor)
6. [Supabase Database Schema](#6-supabase-database-schema)
7. [Shop Configuration System](#7-shop-configuration-system)
8. [Phase-by-Phase Implementation](#8-phase-by-phase-implementation)
9. [Section-by-Section Specifications](#9-section-by-section-specifications)
10. [Admin Content Management](#10-admin-content-management)
11. [Deployment Strategy](#11-deployment-strategy)

---

## 1. Architecture Decision

### Yes — You Need a Backend Layer (But Not a Custom Server)

The existing prototype is purely static. The new feature set requires persistent, manageable content. Here is the exact split:

| Data Type | Source | Reason |
|---|---|---|
| Product catalog + stock levels | Your inventory system (existing) | Already built and deployed |
| Events, FAQ, Reviews, Branches, Join Us content | **Supabase** (new) | Needs CRUD, media uploads, public submissions |
| Hero carousel images | **Supabase Storage** | Uploadable, CDN-served |
| YouTube embeds | Embedded URL string (stored in Supabase) | No upload needed |

### Why Supabase (Not Firebase, Not a Custom Node Server)

- **PostgreSQL database** — structured relational data with foreign keys (events → event_media, etc.)
- **Built-in Storage** — S3-compatible buckets for images and videos, with CDN URLs
- **Auto-generated REST API** — no custom backend code needed for CRUD
- **Row Level Security (RLS)** — public can read, only admins can write/delete — enforced at DB level
- **Free tier** handles this project's scale easily (500MB DB, 1GB storage, 2GB bandwidth)
- **Real-time subscriptions** — if you ever want live event updates on the site
- **Auth** — simple email/password for a lightweight admin panel if needed later

### How It All Fits Together

```
┌─────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Vite)                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Static      │  │  Inventory   │  │   Supabase           │  │
│  │  Config      │  │  API Client  │  │   API Client         │  │
│  │  (shop.ts)   │  │  (REST)      │  │   (supabase-js)      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼────────────────┼──────────────────────┼──────────────┘
          │                │                       │
          ▼                ▼                       ▼
   Shop identity    Your deployed           Supabase Cloud
   (name, brand,    inventory server        (Events, Reviews,
   colors, links)   (products + stock)      FAQ, Branches, etc.)
```

---

## 2. Modularity Strategy

The goal is that this entire codebase can be cloned and rebranded for any BF SUMA branch (or any similar network marketing shop) by editing **one configuration file** and swapping assets. No component code should change.

### The Golden Rule
> Every piece of shop-specific information lives in `src/config/shop.config.ts`. Components never hardcode shop names, colors, phone numbers, or URLs. They always read from config.

### What Goes In Config
```typescript
// src/config/shop.config.ts
export const SHOP_CONFIG = {
  // Identity
  name: "BF SUMA Eagle Shop",
  tagline: "Nairobi's Premier Wellness Destination",
  heroSubtitle: "Discover premium, science-backed supplements designed to optimize your health. From immune boosters to anti-aging wonders, BFSUMA Eagleshop brings Los Angeles quality to Nairobi.",
  logo: "/logo.png",

  // Brand (overrides tailwind defaults at runtime via CSS vars)
  brand: {
    primary: "#006837",      // bfsuma-green
    accent: "#FDB813",       // bfsuma-gold
    light: "#D4E9D2",        // bfsuma-sage
    background: "#FAFAF9",   // bfsuma-warm
  },

  // Contact
  contact: {
    phone: "+254 (0)716626037",
    email: "info@eagleshop.co.ke",
    whatsapp: "+254716626037",
  },

  // Social
  social: {
    facebook: "https://facebook.com/...",
    instagram: "https://instagram.com/...",
    tiktok: "https://tiktok.com/...",
    youtube: "https://youtube.com/...",
  },

  // API endpoints (different per deployment)
  api: {
    inventoryBaseUrl: "https://your-inventory-server.com/api",
    inventoryApiKey: import.meta.env.VITE_INVENTORY_API_KEY,
  },

  // Supabase (different per deployment)
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },

  // SEO
  seo: {
    title: "BF SUMA Eagle Shop | Elevating Wellness in Nairobi",
    description: "Premium health supplements and wellness services in Nairobi.",
    ogImage: "/og-image.jpg",
  },

  // Feature flags (turn sections on/off per deployment)
  features: {
    showEvents: true,
    showReviews: true,
    showJoinUs: true,
    showFAQ: true,
    publicReviewSubmission: true,
  },

  // Join Us program name
  distributorProgram: {
    name: "Eagle Distributor Program",
    ctaLabel: "Become a Distributor",
    ctaLink: "https://register.bfsuma.com",
  },
}
```

### How Modularity Scales to a Network
When you have 10 shops across the network:
- Each shop clones the repo
- Each shop has its own Supabase project (isolated data)
- Each shop connects to the shared inventory server but filters by their branch IDs
- Changing `shop.config.ts` is the only customization needed
- A future "Super Admin" dashboard (separate project) could aggregate data from all Supabase projects via their service keys

---

## 3. Inventory API Integration

Since your inventory system is already deployed, the website will call it via a service layer. This abstraction means if the inventory API changes, you only update one file.

### Service Pattern

```typescript
// src/services/inventory.service.ts

import { SHOP_CONFIG } from '@/config/shop.config'

const BASE = SHOP_CONFIG.api.inventoryBaseUrl
const KEY = SHOP_CONFIG.api.inventoryApiKey

export interface StockLevel {
  branchId: string
  branchName: string
  quantity: number
  inStock: boolean
}

export interface ProductWithStock {
  code: string
  name: string
  category: string
  description?: string
  imageUrl?: string
  stock: StockLevel[]
}

// All inventory calls go through this helper
async function inventoryFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    }
  })
  if (!res.ok) throw new Error(`Inventory API error: ${res.status}`)
  return res.json()
}

export const inventoryService = {
  getProducts: () =>
    inventoryFetch<ProductWithStock[]>('/products'),

  getProductByCode: (code: string) =>
    inventoryFetch<ProductWithStock>(`/products/${code}`),

  getProductsByCategory: (category: string) =>
    inventoryFetch<ProductWithStock[]>(`/products?category=${encodeURIComponent(category)}`),

  getBranches: () =>
    inventoryFetch<{ id: string; name: string }[]>('/branches'),

  getStockByBranch: (branchId: string) =>
    inventoryFetch<StockLevel[]>(`/stock?branch=${branchId}`),
}
```

### Fallback Strategy (If Inventory System Is Unavailable)
- Products fall back to `src/data/products.fallback.ts` (the current `constants.ts` data)
- Stock shows "Contact us for availability"
- Use React Query's `staleTime` and `retry` options

---

## 4. New Dependencies

Run these installs inside the `website/` directory:

```bash
# Routing
npm install react-router-dom

# Data fetching + caching
npm install @tanstack/react-query

# Backend (Supabase)
npm install @supabase/supabase-js

# Carousel (Hero + Join Us)
npm install embla-carousel-react embla-carousel-autoplay

# Video / YouTube embed
npm install react-player

# Form handling + validation
npm install react-hook-form zod @hookform/resolvers

# Image lightbox / gallery
npm install yet-another-react-lightbox

# Date formatting
npm install date-fns

# Toast notifications
npm install react-hot-toast

# Type definitions
npm install -D @types/node
```

**Keep existing:** `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`

**Total new dependencies: 11 packages**

---

## 5. Folder Structure Refactor

Transform the flat `src/` directory into this modular structure:

```
website/src/
│
├── config/
│   └── shop.config.ts            ← THE MODULARITY CORE
│
├── lib/
│   ├── utils.ts                  (existing)
│   ├── supabase.ts               ← Supabase client singleton
│   └── queryClient.ts            ← TanStack Query client config
│
├── services/
│   ├── inventory.service.ts      ← Inventory API calls
│   └── content.service.ts        ← Supabase content helpers
│
├── types/
│   ├── product.types.ts
│   ├── event.types.ts
│   ├── review.types.ts
│   ├── faq.types.ts
│   ├── branch.types.ts
│   └── join-us.types.ts
│
├── hooks/
│   ├── useProducts.ts
│   ├── useEvents.ts
│   ├── useReviews.ts
│   ├── useFAQ.ts
│   └── useBranches.ts
│
├── components/
│   │
│   ├── ui/                       ← Primitive, reusable components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Carousel.tsx          ← Embla wrapper
│   │   ├── YouTubeEmbed.tsx
│   │   ├── MediaGallery.tsx
│   │   ├── GoogleMapEmbed.tsx
│   │   ├── StockBadge.tsx
│   │   ├── Accordion.tsx         ← For FAQ
│   │   ├── TabGroup.tsx          ← For Events filter
│   │   └── SectionHeader.tsx
│   │
│   └── layout/
│       ├── Navbar.tsx            (refactored from App.tsx)
│       ├── Footer.tsx            (refactored from App.tsx)
│       └── Layout.tsx            ← Wraps Navbar + Footer
│
├── pages/
│   ├── Home/
│   │   ├── index.tsx             ← Composes all home sections
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx      (existing About component)
│   │   └── BenefitBanner.tsx
│   │
│   ├── Products/
│   │   ├── index.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductModal.tsx      ← Framer Motion detail view
│   │   ├── CategoryFilter.tsx
│   │   └── BranchStockFilter.tsx
│   │
│   ├── Events/
│   │   ├── index.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventDetail.tsx
│   │   └── EventMediaUploader.tsx
│   │
│   ├── FAQ/
│   │   └── index.tsx
│   │
│   ├── Reviews/
│   │   ├── index.tsx
│   │   ├── ReviewCard.tsx
│   │   └── ReviewSubmitForm.tsx
│   │
│   ├── JoinUs/
│   │   ├── index.tsx
│   │   ├── CompanyEventCard.tsx
│   │   └── BenefitsList.tsx
│   │
│   └── About/
│       ├── index.tsx
│       └── BranchCard.tsx
│
├── assets/
│   └── images/                   (static fallback images)
│
├── App.tsx                       ← Now just router + providers
├── main.tsx                      (existing)
└── index.css                     (existing)
```

---

## 6. Supabase Database Schema

Create these tables in your Supabase project. Run the SQL below in the Supabase SQL editor.

```sql
-- ============================================
-- BRANCHES TABLE
-- ============================================
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  maps_embed_url TEXT,
  maps_link TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the two initial branches
INSERT INTO branches (name, address, maps_embed_url, phone, email) VALUES
('Eagle Shop - Utumishi', '6th Floor, Utumishi Co-op House, Mamlaka Road, Nairobi', 
  'https://www.google.com/maps/embed?...', '+254716626037', 'utumishi@eagleshop.co.ke'),
('Eagle Shop - Branch 2', 'Address Here', 
  'https://www.google.com/maps/embed?...', '+254700000000', 'branch2@eagleshop.co.ke');

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  event_end_date TIMESTAMPTZ,
  location_name TEXT,
  location_address TEXT,
  maps_link TEXT,
  status TEXT CHECK (status IN ('upcoming', 'ongoing', 'past')) NOT NULL DEFAULT 'upcoming',
  youtube_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EVENT MEDIA TABLE
-- ============================================
CREATE TABLE event_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'youtube')) NOT NULL,
  url TEXT NOT NULL,           -- Supabase Storage URL or YouTube URL
  thumbnail_url TEXT,          -- For videos
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FAQ TABLE
-- ============================================
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_name TEXT NOT NULL,
  testimonial TEXT NOT NULL,
  product_used TEXT,
  photo_url TEXT,              -- Optional Supabase Storage URL
  rating INT CHECK (rating BETWEEN 1 AND 5) DEFAULT 5,
  is_approved BOOLEAN DEFAULT false,   -- Admin approves before showing
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMPANY EVENTS TABLE (for Join Us section)
-- Different from regular events — used to market the distributor program
-- ============================================
CREATE TABLE company_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  youtube_url TEXT,
  is_published BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMPANY EVENT MEDIA TABLE
-- ============================================
CREATE TABLE company_event_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_event_id UUID REFERENCES company_events(id) ON DELETE CASCADE,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'youtube')) NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HERO CAROUSEL TABLE
-- ============================================
CREATE TABLE hero_carousel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  link_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Public = read-only. Admin = full access via service key.
-- ============================================

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_event_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_carousel ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read branches" ON branches FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read published events" ON events FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read event media" ON event_media FOR SELECT USING (true);
CREATE POLICY "Public can read FAQs" ON faqs FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public can submit reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read company events" ON company_events FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read company event media" ON company_event_media FOR SELECT USING (true);
CREATE POLICY "Public can read hero carousel" ON hero_carousel FOR SELECT USING (is_active = true);

-- ============================================
-- STORAGE BUCKETS (create in Supabase Dashboard)
-- ============================================
-- Bucket: event-media     (public read, 50MB file limit, images + videos)
-- Bucket: review-photos   (public read, 5MB file limit, images only)
-- Bucket: hero-carousel   (public read, 10MB file limit, images only)
-- Bucket: company-events  (public read, 50MB file limit, images + videos)
```

---

## 7. Shop Configuration System

### Environment Variables (`.env`)
```bash
# .env (gitignored)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_INVENTORY_API_KEY=your-inventory-api-key
VITE_INVENTORY_BASE_URL=https://your-inventory.server.com/api
```

### Supabase Client Singleton
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { SHOP_CONFIG } from '@/config/shop.config'

export const supabase = createClient(
  SHOP_CONFIG.supabase.url,
  SHOP_CONFIG.supabase.anonKey
)
```

### TanStack Query Setup
```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})
```

### App.tsx (New — Router + Providers Only)
```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/lib/queryClient'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Products from '@/pages/Products'
import Events from '@/pages/Events'
import FAQ from '@/pages/FAQ'
import Reviews from '@/pages/Reviews'
import JoinUs from '@/pages/JoinUs'
import About from '@/pages/About'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/events" element={<Events />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  )
}
```

### Navbar Links (Updated)
```typescript
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Events', href: '/events' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Join Us', href: '/join-us' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
]
```

---

## 8. Phase-by-Phase Implementation

Execute these phases in order. Each phase is self-contained and testable.

---

### PHASE 1 — Project Restructure & Config Foundation
**Goal:** New folder structure in place, routing works, config drives the app.

**Tasks:**
1. Install all new dependencies (see §4)
2. Create `src/config/shop.config.ts` with full config object
3. Create `.env` and `.env.example` files
4. Create `src/lib/supabase.ts` and `src/lib/queryClient.ts`
5. Create all empty type files in `src/types/`
6. Create the folder skeleton (all directories from §5)
7. Extract `Navbar` from `App.tsx` → `src/components/layout/Navbar.tsx`
8. Extract `Footer` from `App.tsx` → `src/components/layout/Footer.tsx`
9. Create `src/components/layout/Layout.tsx`
10. Rewrite `App.tsx` to be router + providers only (see §7)
11. Update `tailwind.config.js` to add the `@/` path alias
12. Update `vite.config.ts` to add `@/` path alias pointing to `src/`
13. Move the existing `Hero`, `About`, `ProductsSection`, `BenefitBanner` into their respective page folders
14. Create `src/pages/Home/index.tsx` that composes them all
15. Verify: `npm run dev` loads the site on `/` with existing sections intact

**Tailwind path alias addition:**
```javascript
// vite.config.ts
import path from 'path'
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
})
```

---

### PHASE 2 — Shared UI Component Library
**Goal:** Build the reusable primitives all sections will consume.

**Components to build:**

**`SectionHeader.tsx`** — Consistent section titles with gold divider and subtitle
```
Props: title, subtitle, align ('center' | 'left'), eyebrow (small label above title)
```

**`Badge.tsx`** — Status badge (In Stock / Low Stock / Out of Stock / Upcoming / Ongoing / Past)
```
Props: variant ('green' | 'yellow' | 'red' | 'blue' | 'gray'), label
```

**`Modal.tsx`** — Framer Motion animated overlay modal
```
Props: isOpen, onClose, children, size ('sm' | 'md' | 'lg' | 'xl')
Uses: AnimatePresence, motion.div with backdrop blur
```

**`Carousel.tsx`** — Embla-based carousel wrapper
```
Props: slides (ReactNode[]), autoPlay (boolean), showDots (boolean), showArrows (boolean)
```

**`Accordion.tsx`** — Animated FAQ accordion
```
Props: items ({ question, answer }[]), allowMultiple (boolean)
Uses: Framer Motion height animation (variants with height: 'auto')
```

**`YouTubeEmbed.tsx`** — Safe YouTube embed
```
Props: url (full YouTube URL or embed URL), title
Behavior: Extract video ID, construct embed URL, render iframe
```

**`MediaGallery.tsx`** — Image/video grid with lightbox
```
Props: items ({ type, url, thumbnail?, caption? }[])
Uses: yet-another-react-lightbox for fullscreen view
```

**`GoogleMapEmbed.tsx`** — Iframe map preview
```
Props: embedUrl, height ('sm' | 'md' | 'lg'), title
```

**`StockBadge.tsx`** — Per-branch stock indicator
```
Props: branchName, quantity, inStock
```

**`TabGroup.tsx`** — Animated tab filter bar
```
Props: tabs (string[]), activeTab, onChange
Uses: Framer Motion layoutId for underline indicator
```

---

### PHASE 3 — Hero Section (With Carousel)
**Goal:** Replace static hero image with animated carousel.

**File:** `src/pages/Home/HeroSection.tsx`

**Specification:**
- Left column: existing text content (tagline, headline, CTAs, stats) — keep from prototype
- Right column: `<Carousel>` component showing product/poster images
- Images sourced from `hero_carousel` Supabase table (with `useQuery` hook)
- Fallback: 3-4 static images from `/public/images/` if Supabase is empty
- Auto-play every 4 seconds
- Show slide dots at bottom of carousel panel
- Carousel images have a rounded-2xl border with subtle shadow
- On mobile: carousel is hidden, show single featured image instead

**Data hook:**
```typescript
// src/hooks/useHeroCarousel.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useHeroCarousel() {
  return useQuery({
    queryKey: ['hero-carousel'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_carousel')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}
```

---

### PHASE 4 — Products Section (With Branch Stock + Framer Motion)
**Goal:** Full catalog with per-branch availability and rich interactions.

**Files:**
- `src/pages/Products/index.tsx` — page shell
- `src/pages/Products/ProductGrid.tsx` — grid layout
- `src/pages/Products/ProductCard.tsx` — individual card
- `src/pages/Products/ProductModal.tsx` — full detail overlay
- `src/pages/Products/CategoryFilter.tsx` — tab/pill filters
- `src/pages/Products/BranchStockFilter.tsx` — branch selector

**ProductCard Framer Motion behavior:**
```
Hover: scale(1.03), shadow increase, image slight zoom (scale 1.1 inside overflow-hidden)
Tap/Click: Opens ProductModal via AnimatePresence
Card entrance: staggered fade-in using motion.div variants with staggerChildren
Product image area: whileHover triggers image zoom via CSS scale transition
```

**ProductModal Framer Motion behavior:**
```
Backdrop: fade in (opacity 0 → 1), click to close
Panel: slide up from bottom on mobile (y: 100 → 0), scale from center on desktop
Close button: rotates 90deg on hover
```

**ProductModal contents:**
- Product name + code + category badge
- Product image (full size or placeholder with category icon)
- Description (from inventory API or placeholder)
- Branch stock table:
  | Branch | Status | Stock Level |
  |---|---|---|
  | Eagle Shop - Utumishi | 🟢 In Stock | 24 units |
  | Eagle Shop - Branch 2 | 🔴 Out of Stock | 0 units |
- WhatsApp CTA button (pre-filled message: "Hi, I'm interested in [Product Name]")

**Data hooks:**
```typescript
// src/hooks/useProducts.ts
// Uses inventoryService.getProducts() via TanStack Query
// Falls back to PRODUCTS from constants.ts on error

// src/hooks/useBranches.ts  
// Uses inventoryService.getBranches()
// Falls back to hardcoded branches from shop.config.ts
```

**Branch selector behavior:**
- Dropdown pill: "All Branches" / "Utumishi" / "Branch 2"
- Selecting a branch filters the stock badge shown on each card
- Shows "In Stock" (green), "Low Stock" (yellow, < 5), "Out of Stock" (red) per branch

---

### PHASE 5 — Events Section
**Goal:** Full events management with media, YouTube embeds, and status filtering.

**Files:**
- `src/pages/Events/index.tsx`
- `src/pages/Events/EventCard.tsx`
- `src/pages/Events/EventDetail.tsx`
- `src/types/event.types.ts`

**TypeScript Types:**
```typescript
// src/types/event.types.ts
export type EventStatus = 'upcoming' | 'ongoing' | 'past'

export interface EventMedia {
  id: string
  event_id: string
  media_type: 'image' | 'video' | 'youtube'
  url: string
  thumbnail_url?: string
  caption?: string
  sort_order: number
}

export interface Event {
  id: string
  title: string
  description: string
  event_date: string
  event_end_date?: string
  location_name: string
  location_address: string
  maps_link?: string
  status: EventStatus
  youtube_url?: string
  is_published: boolean
  event_media: EventMedia[]
}
```

**Page Layout:**
- `TabGroup` at top: "All" / "Upcoming" / "Ongoing" / "Past"
- `AnimatePresence` + `motion.div` on grid when tab changes (fade out old, fade in new)
- Events in responsive 3-column grid (1 on mobile, 2 on tablet, 3 on desktop)

**EventCard:**
- Cover image (first image from media array, or gradient placeholder)
- Status badge (color-coded: blue=upcoming, green=ongoing, gray=past)
- Title, date, location name
- Truncated description (2 lines, line-clamp-2)
- "View Details" button → opens EventDetail as modal or navigates to `/events/:id`

**EventDetail:**
- Full description
- Date/time formatted (date-fns: "Saturday, 14 June 2026 at 10:00 AM")
- Location with Google Maps link button
- `MediaGallery` for images
- Embedded video player for uploaded videos (react-player)
- `YouTubeEmbed` for YouTube links
- If event has `youtube_url`, show it at the top of media section

**Data hook:**
```typescript
// src/hooks/useEvents.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { EventStatus } from '@/types/event.types'

export function useEvents(status?: EventStatus) {
  return useQuery({
    queryKey: ['events', status],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*, event_media(*)')
        .eq('is_published', true)
        .order('event_date', { ascending: status !== 'past' })

      if (status) query = query.eq('status', status)
      
      const { data, error } = await query
      if (error) throw error
      return data
    }
  })
}
```

---

### PHASE 6 — FAQ Section
**Goal:** Clean accordion FAQ with Framer Motion animations.

**File:** `src/pages/FAQ/index.tsx`

**Layout:**
- `SectionHeader` with "Frequently Asked Questions"
- Optional category tabs if FAQ has multiple categories (e.g., "Products", "Shipping", "Membership")
- FAQ items rendered using `Accordion` component
- Each item: smooth height animation on expand/collapse using Framer Motion
- Arrow icon rotates 180deg when open

**Accordion Framer Motion pattern:**
```typescript
const variants = {
  open: { height: 'auto', opacity: 1 },
  closed: { height: 0, opacity: 0 }
}
// Use motion.div with variants, initial="closed", animate={isOpen ? "open" : "closed"}
// transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
```

**Data hook:**
```typescript
// src/hooks/useFAQ.ts
export function useFAQ(category?: string) {
  return useQuery({
    queryKey: ['faq', category],
    queryFn: async () => {
      let query = supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('sort_order')
      if (category) query = query.eq('category', category)
      const { data, error } = await query
      if (error) throw error
      return data
    }
  })
}
```

**Seed data to pre-populate Supabase:**
Include at least 8-10 FAQs covering:
- What is BF SUMA?
- Are the products safe?
- How do I know which product is right for me?
- Where can I buy the products?
- What is the distributor program?
- Do you ship outside Nairobi?
- Are the products certified?
- How do I contact support?

---

### PHASE 7 — Reviews Section
**Goal:** Display testimonials + public submission form.

**Files:**
- `src/pages/Reviews/index.tsx`
- `src/pages/Reviews/ReviewCard.tsx`
- `src/pages/Reviews/ReviewSubmitForm.tsx`

**ReviewCard:**
- Reviewer photo (circular, 60px) or fallback initials avatar
- Star rating (1-5) using filled/empty stars
- Testimonial text (truncated at 3 lines, "Read more" to expand)
- Reviewer name + product used (if provided)

**ReviewSubmitForm:**
- Uses `react-hook-form` + `zod` for validation
- Fields:
  - Your Name (required, min 2 chars)
  - Your Review (required, min 20 chars, max 500 chars)
  - Product Used (optional, text input or select from product list)
  - Your Photo (optional, file upload, max 5MB, images only)
- On submit:
  1. If photo provided: upload to Supabase Storage `review-photos` bucket
  2. Insert review record with `is_approved: false`
  3. Show success toast: "Thank you! Your review will appear after approval."
- Validation error messages in red below each field

**Photo upload pattern:**
```typescript
// Upload photo to Supabase storage
const file = formData.photo[0]
const ext = file.name.split('.').pop()
const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

const { data: uploadData, error: uploadError } = await supabase.storage
  .from('review-photos')
  .upload(filename, file, { contentType: file.type })

if (uploadError) throw uploadError

const { data: { publicUrl } } = supabase.storage
  .from('review-photos')
  .getPublicUrl(filename)

// Use publicUrl when inserting the review record
```

**Page layout:**
- `SectionHeader`: "What Our Customers Say"
- Masonry-style or 3-column card grid (use CSS columns or grid)
- "Share Your Experience" button → opens ReviewSubmitForm in modal
- Show only `is_approved = true` reviews to public

---

### PHASE 8 — Join Us Section
**Goal:** Distributor program marketing page.

**Files:**
- `src/pages/JoinUs/index.tsx`
- `src/pages/JoinUs/CompanyEventCard.tsx`
- `src/pages/JoinUs/BenefitsList.tsx`

**Page Sections (in order):**

**8a. Hero Banner**
- Full-width section with gradient background (bfsuma-green to dark)
- "Join the Eagle Distributor Network" headline
- Subtitle from `SHOP_CONFIG.distributorProgram`
- CTA button → `SHOP_CONFIG.distributorProgram.ctaLink`

**8b. Program Overview**
- 2-column layout: text left, image/graphic right
- What the program is: brief paragraph
- Who it's for: bullet points (entrepreneurs, health enthusiasts, those seeking passive income)

**8c. Benefits**
- Animated grid of benefit cards (staggered entrance with Framer Motion)
- Example benefits:
  - Earn commissions on every sale
  - Access to exclusive training resources
  - Be part of an international network
  - Monthly performance bonuses
  - Free product samples
  - Personal health coaching support
- Each benefit: icon + title + short description

**8d. Company Events Showcase**
- `SectionHeader`: "Our Success Stories"
- Horizontal scrolling carousel of `company_events` records
- Each card: event title, date, description, image carousel (from `company_event_media`), YouTube embed if available
- Card click → expands in modal showing full media

**8e. Tools & Resources**
- Grid of resource cards (static content from config or hardcoded initially):
  - Product catalog PDF download
  - Training materials link
  - WhatsApp community group link
  - Support contact

**8f. Final CTA**
- Large centered section: "Ready to Start Your Journey?"
- CTA button linking to registration

---

### PHASE 9 — About Us Section
**Goal:** Mission/vision + editable branch directory.

**Files:**
- `src/pages/About/index.tsx`
- `src/pages/About/BranchCard.tsx`

**Page Sections:**

**9a. Vision & Mission**
- 2-column or stacked cards
- Vision text from `SHOP_CONFIG` (or Supabase `settings` table if you want it editable)
- Mission text from `SHOP_CONFIG`
- Company founding story / brief paragraph

**9b. Our Values**
- 3-4 value cards with icons (e.g., Integrity, Quality, Community, Innovation)

**9c. Our Branches**
- Grid of `BranchCard` components
- Data from `useBranches()` hook (queries Supabase `branches` table)

**BranchCard:**
```
- Branch name (bold, prominent)
- Full address
- Google Maps embed preview (GoogleMapEmbed component, height 'sm')
- "Open in Maps" button (links to maps_link)
- Phone number (tel: link)
- Email (mailto: link)
```

**Data hook:**
```typescript
// src/hooks/useBranches.ts
export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}
```

---

### PHASE 10 — Supabase Project Setup
**Goal:** Initialize the backend, seed data.

**Steps:**
1. Create a new Supabase project at supabase.com
2. Go to SQL Editor → run the full schema from §6
3. Create Storage Buckets:
   - `event-media` (public, 50MB limit)
   - `review-photos` (public, 5MB limit)
   - `hero-carousel` (public, 10MB limit)
   - `company-events` (public, 50MB limit)
4. Set bucket policies to public read (done via Dashboard → Storage → Policies)
5. Seed FAQ data (at least 8 items)
6. Seed branches data (2 initial branches)
7. Add 2-3 example events (1 upcoming, 1 past) to test display
8. Add 2-3 approved reviews
9. Add 3-4 hero carousel images
10. Copy Supabase URL and anon key to `.env`

---

### PHASE 11 — Inventory API Integration
**Goal:** Wire up live product data from your existing inventory system.

**Steps:**
1. Create `src/services/inventory.service.ts` (see §3)
2. Create `src/hooks/useProducts.ts`:
```typescript
export function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      try {
        return category
          ? await inventoryService.getProductsByCategory(category)
          : await inventoryService.getProducts()
      } catch {
        // Fallback to static data
        return PRODUCTS.filter(p => !category || p.category === category)
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
```
3. Update `ProductGrid` to use `useProducts()` instead of static `PRODUCTS`
4. Update `ProductModal` to show stock data from `useQuery` on `inventoryService.getStockByBranch()`
5. Test with actual API endpoint; confirm stock levels display correctly

**Note on CORS:** If the inventory server doesn't allow requests from your website domain, you will need to add your website's domain to the inventory server's CORS allowed origins list. Contact your inventory system admin about this.

---

### PHASE 12 — Polish, Animations & Accessibility
**Goal:** Production-quality interactions across all sections.

**Global Framer Motion patterns to apply:**

```typescript
// Scroll-triggered section entrance (apply to every section)
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
}
// Use with useInView hook: animate={isInView ? "visible" : "hidden"}

// Staggered card grids
const containerVariants = {
  visible: { transition: { staggerChildren: 0.1 } }
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// Tab switching
// Use layoutId on the active indicator pill for smooth sliding effect
```

**Accessibility checklist:**
- All interactive elements have `aria-label`
- Images have meaningful `alt` text
- Modals trap focus and respond to `Escape` key
- Color contrast meets WCAG AA (test bfsuma-green #006837 on white: passes)
- `prefers-reduced-motion` respected: wrap Framer Motion with `useReducedMotion()`

---

## 9. Section-by-Section Specifications Summary

| Section | Route | Data Source | Key Features |
|---|---|---|---|
| Hero | `/` (section) | Supabase `hero_carousel` | Embla autoplay carousel, animated text |
| Products | `/products` | Inventory API + fallback | Branch stock filter, Framer Modal |
| Events | `/events` | Supabase `events` + `event_media` | Tab filter, media gallery, YouTube embed |
| FAQ | `/faq` | Supabase `faqs` | Animated accordion |
| Reviews | `/reviews` | Supabase `reviews` | Public submission form, image upload |
| Join Us | `/join-us` | Supabase `company_events` | Distributor marketing, events carousel |
| About | `/about` | Supabase `branches` + config | Branch map embeds, contact info |

---

## 10. Admin Content Management

For managing events, FAQ, reviews, branches, and hero images, you have two options:

### Option A: Supabase Dashboard (Recommended to Start)
Use the Supabase Table Editor directly at `supabase.com/dashboard`. This is:
- Free and immediate
- No extra code to write
- Storage files manageable via the Storage UI

For media uploads in events: upload files to the relevant Storage bucket, copy the public URL, paste it into the `event_media` table record.

### Option B: Lightweight Admin Panel (Phase 13 — Future)
Build a protected admin panel at `/admin` using:
- `@supabase/auth-ui-react` for login screen
- Simple forms for each entity (CRUD)
- Drag-and-drop media upload using Supabase Storage JS API
- Row-by-row approval for reviews

This is recommended once content updates become frequent. Estimated 2-3 days of additional work.

---

## 11. Deployment Strategy

### Frontend
```bash
# Vercel (recommended — free, automatic deploys from Git)
npm i -g vercel
vercel --prod

# Set environment variables in Vercel Dashboard:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
# VITE_INVENTORY_API_KEY
# VITE_INVENTORY_BASE_URL
```

### CORS Configuration
Add your deployed Vercel domain to:
1. Supabase: Dashboard → Settings → API → Allowed CORS origins (add `https://your-site.vercel.app`)
2. Your inventory server: Add to allowed origins list

### Custom Domain
If using a custom domain (e.g., `eagleshop.co.ke`):
- Add it in Vercel → Domains
- Update CORS origins to include `https://eagleshop.co.ke`

---

## Quick-Start Checklist for CLI Agent

Execute in this order:

```
[ ] Phase 1:  npm install new deps, create folder structure, setup routing
[ ] Phase 1:  Create shop.config.ts with all BF SUMA data
[ ] Phase 1:  Verify site loads with existing sections
[ ] Phase 2:  Build all shared UI components (Modal, Carousel, Accordion, etc.)
[ ] Phase 3:  Hero carousel (connect Supabase after Phase 10)
[ ] Phase 4:  Products with Framer Modal (use static data until Phase 11)
[ ] Phase 5:  Events section (use mock data until Phase 10)
[ ] Phase 6:  FAQ section (use mock data until Phase 10)
[ ] Phase 7:  Reviews section (use mock data until Phase 10)
[ ] Phase 8:  Join Us section
[ ] Phase 9:  About Us section with branch cards
[ ] Phase 10: Supabase project setup + schema + seed data
[ ] Phase 11: Inventory API integration
[ ] Phase 12: Polish, stagger animations, accessibility pass
[ ] Deploy:   Vercel deployment + env vars
```

---

## Summary of Key Architectural Decisions

| Decision | Choice | Reason |
|---|---|---|
| Backend | Supabase | No custom server needed, free, built-in storage |
| Routing | React Router v6 | Multi-page navigation is required |
| Data fetching | TanStack Query | Caching, loading states, automatic refetch |
| Carousel | Embla | Lightweight, accessible, smooth |
| Video | react-player | Handles YouTube, MP4, many sources |
| Forms | react-hook-form + zod | Type-safe validation, performance |
| Modularity | shop.config.ts | Single file controls all shop identity |
| Animations | Framer Motion (existing) | Already installed, powerful, performant |
| Hosting | Vercel | Git integration, free, global CDN |

---

*Plan version: 1.0 | Prepared for BF SUMA Eagle Shop Nairobi | June 2026*
