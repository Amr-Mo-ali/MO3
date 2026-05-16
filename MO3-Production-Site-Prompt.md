# 🎯 Interactive Site Build Prompt — MO3 Production

> **Version:** 1.0
> **Last Updated:** 2026-05-16
> **Project:** MO3 Production Portfolio & Admin Dashboard
> **Live URL:** https://mo-3-pi.vercel.app
> **Repo:** github.com/Amr-Mo-ali/MO3

---

## 📋 Quick Start

1. Push this file to Copilot Chat with `@workspace`
2. Say: *"Build or edit this site per the attached spec"*
3. Reference the Color Identity section for brand consistency

---

## 1. PROJECT OVERVIEW

| Field | Value |
|-------|-------|
| **Project Name** | MO3 Production — Media Portfolio + Admin Dashboard |
| **Project Type** | Portfolio / Admin Dashboard |
| **Target Audience** | Egyptian businesses & startups seeking media production (Real Estate, F&B, Education, Retail) |
| **Mood/Vibe** | Dark, cinematic, premium, emotional — "architects of emotion" |
| **Reference Sites** | Netflix.com, high-end film studio websites, Apple.com level polish |
| **Stack** | Next.js 14, TypeScript, Tailwind CSS, Prisma, Supabase, Cloudinary |

---

## 2. CORE INTERACTION MODEL

- [x] **Scroll-driven narrative** — Sections reveal as user scrolls
- [x] **Mouse-driven exploration** — 3D card tilt on hover, custom cursor
- [x] **Time-based animation** — Hero video autoplay, animated counters
- [x] **Hybrid** — Scroll reveal + hover effects + canvas particles

**Primary Choice:** Scroll-driven narrative

**Secondary:** Mouse-driven exploration + Time-based animation

---

## 3. USER JOURNEY MAP

| Stage | User Action | System Response | Metric |
|-------|-------------|-----------------|--------|
| **Entry** | Lands on homepage | Full-screen hero video + cinematic reveal | < 2s load |
| **Hook** | First scroll | About Us section slides in with animation | 70% scroll past hero |
| **Explore** | Scrolls through work sections | 3D tilt cards, video lightbox on click | 3+ sections viewed |
| **Convert** | Clicks CTA or social link | Opens WhatsApp or Instagram | 10% CTR |
| **Exit** | Leaves or contacts | Contact form sends via WhatsApp | Return via social |

---

## 4. MOTION ARCHITECTURE

### 4.1 Scroll Behavior

| Setting | Value |
|---------|-------|
| **Native Scroll** | Yes |
| **Smooth Scroll Library** | CSS scroll-behavior smooth |
| **Scroll Hijacking** | None — natural scroll |
| **Pinned Sections** | Navbar only |
| **Scroll Direction** | Vertical |

### 4.2 Transition Philosophy

| Transition Type | Style | Duration | Easing |
|-----------------|-------|----------|--------|
| **Page transitions** | Fade | 400ms | ease-smooth |
| **Section transitions** | Slide up + fade | 600ms | ease-expo-out |
| **Micro-interactions** | Card tilt + red glow | 150ms | ease-smooth |

### 4.3 Easing Tokens

```css
:root {
  --ease-expo-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-expo-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-dramatic: cubic-bezier(0.87, 0, 0.13, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 5. SPATIAL SYSTEM

### 5.1 Viewport Zones

```
┌─────────────────────────────────────────┐
│  [MO3 Logo]         [Nav + Lang Toggle] │  z-index: 100
├─────────────────────────────────────────┤
│                                         │
│    [Hero Video / Section Content]       │  z-index: 10
│    [Canvas Particles Background]        │
│                                         │
├─────────────────────────────────────────┤
│  [Scroll Indicator — bouncing arrow]    │  z-index: 50
│  [Contact + Footer]                     │
└─────────────────────────────────────────┘
```

| Zone | Content | z-index | Behavior |
|------|---------|---------|----------|
| **A** | MO3 Logo (SVG — white MO + red play + red 3) | 100 | Fixed, hides on scroll down, shows on scroll up |
| **B** | Nav links + Language Toggle (AR/EN) + Dark always | 100 | Fixed, transparent → black/blur on scroll |
| **C** | Hero video, work sections, map, FAQ | 10 | Scroll-driven reveal |
| **D** | Scroll bounce arrow | 50 | Fades after first scroll |
| **E** | Contact section + Footer | 50 | Reveals at end |

### 5.2 Depth Structure

| Layer | Content | Parallax Speed | Blur/Opacity |
|-------|---------|----------------|--------------|
| **Background** | Black #000000 + canvas particles | 0.1x | None |
| **Midground** | Work cards, section headings | 0.5x | None |
| **Foreground** | Video lightbox, modals, toasts | 1.0x | backdrop-filter blur |
| **Floating** | Canvas particles, custom cursor ring | 1.2x | Subtle |

---

## 6. COMPONENT INTERACTION MATRIX

### 6.1 Global Components

| Component | Trigger | Enter Animation | Active State | Exit Animation |
|-----------|---------|-----------------|--------------|----------------|
| **Navigation** | Page load | Slide down from top | Red underline on active section | Hides on scroll down |
| **Language Toggle** | Click | Instant | Shows flag + language name | N/A |
| **Custom Cursor** | Mouse move | Scale from 0 | Red ring morphs on hover | Scale to 0 on leave |
| **Scroll Indicator** | After load | Bounce in | Pulse animation | Fade after first scroll |
| **Video Lightbox** | Work card click | Fade in + scale | YouTube/Vimeo embed | Fade out on X or backdrop |

### 6.2 Section-Specific Components

| Component | Section | Trigger | Animation | Notes |
|-----------|---------|---------|-----------|-------|
| **HeroVideo** | Hero | Page load | Fade in video + staggered text | autoplay, muted, loop, playsInline |
| **AnimatedCounter** | Stats | Scroll into view | Count up from 0 | IntersectionObserver |
| **TiltCard** | Works | Mouse hover | 3D perspective tilt + red glare | CSS transform only, disabled on mobile |
| **WorkLightbox** | Works | Card click | Fade overlay + YouTube iframe | ESC key closes |
| **ClientsMarquee** | Clients | Auto | Infinite CSS scroll | Pauses on hover, reverses in RTL |
| **MapMarker** | Map | Load | Red pulse ripple | Leaflet.js markers, NO Google Maps |
| **FAQAccordion** | FAQ | Click | Height expand + rotate icon | One open at a time |
| **ContactForm** | Contact | Submit | Opens WhatsApp with pre-filled text | No page reload |

---

## 7. STATE MACHINE

```
[LOADING]
  ├── page_ready ──→ [HERO]

[HERO]
  ├── first_scroll ──→ [ABOUT]

[ABOUT → STATS → CLIENTS → WORKS → TESTIMONIALS → MAP → FAQ → CONTACT]
  Each section: scroll_into_view ──→ [ANIMATE_IN]

[WORK_CARD_CLICK]
  ├── has_video ──→ [LIGHTBOX_OPEN]
  └── no_video ──→ [NOTHING]

[LIGHTBOX_OPEN]
  ├── click_backdrop ──→ [LIGHTBOX_CLOSE]
  ├── click_X ────────→ [LIGHTBOX_CLOSE]
  └── press_ESC ──────→ [LIGHTBOX_CLOSE]

[LANGUAGE_TOGGLE]
  ├── EN → AR ──→ [APPLY_RTL + CAIRO_FONT + ARABIC_TEXT]
  └── AR → EN ──→ [APPLY_LTR + DM_SANS_FONT + ENGLISH_TEXT]

[ADMIN_LOGIN]
  ├── correct_credentials ──→ [ADMIN_DASHBOARD]
  └── wrong_credentials ───→ [LOGIN_ERROR]

[ADMIN_DASHBOARD]
  ├── sections CRUD
  ├── works CRUD + Cloudinary upload
  ├── clients CRUD + Cloudinary upload
  ├── testimonials CRUD
  ├── faq CRUD
  ├── stats edit
  ├── hero config
  ├── map locations CRUD
  └── settings (social links)
```

---

## 8. TECH STACK

### 8.1 Core

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 14.2.18 | App Router, SSR, API Routes |
| **Language** | TypeScript | 5.0+ | Type safety |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **State** | React Context | Built-in | Language + Theme state |
| **ORM** | Prisma | 5.22.0 | Database queries |
| **Database** | Supabase (PostgreSQL) | Latest | Cloud database |
| **Auth** | NextAuth.js | Latest | Admin login |
| **Media** | Cloudinary | Latest | Image/video uploads |

### 8.2 Animation & Motion

| Library | Version | Use Case |
|---------|---------|----------|
| Framer Motion | Installed | Page transitions, scroll reveal |
| CSS Transforms | Native | 3D card tilt, hover effects |
| Canvas API | Native | Hero particles background |
| IntersectionObserver | Native | Scroll-triggered animations |

### 8.3 Maps

| Library | Version | Use Case |
|---------|---------|----------|
| react-leaflet | 4.2.1 | Work locations map — NO Google Maps |
| Leaflet.js | 1.9.4 | Map tiles from CartoDB Dark Matter |
| @supabase/supabase-js | Latest | work_locations table |

---

## 9. PAGES & ROUTES

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — all sections |
| `/work/[slug]` | Individual section page |

### Admin Pages (Protected by NextAuth)

| Route | Description |
|-------|-------------|
| `/admin/login` | Admin login page |
| `/admin` | Dashboard overview with stats |
| `/admin/sections` | Manage work sections |
| `/admin/works` | Manage work items + uploads |
| `/admin/clients` | Manage client logos + uploads |
| `/admin/testimonials` | Manage testimonials |
| `/admin/faq` | Manage FAQ |
| `/admin/stats` | Edit animated counters |
| `/admin/hero` | Hero video + text config |
| `/admin/places` | Map locations CRUD |
| `/admin/settings` | Social links + about text |

---

## 10. COLOR IDENTITY

### 10.1 Brand Colors (from MO3 Logo)

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-primary` | `#E31212` | rgb(227, 18, 18) | Buttons, accents, active states, markers |
| `--color-black` | `#000000` | rgb(0, 0, 0) | Page background |
| `--color-surface` | `#111111` | rgb(17, 17, 17) | Cards, panels, admin bg |
| `--color-surface-2` | `#1a1a1a` | rgb(26, 26, 26) | Elevated cards, modals |
| `--color-border` | `#222222` | rgb(34, 34, 34) | Dividers, card borders |
| `--color-white` | `#FFFFFF` | rgb(255, 255, 255) | Primary text, logo MO |
| `--color-text-muted` | `#888888` | rgb(136, 136, 136) | Secondary text, labels |
| `--color-red-dim` | `#8B0000` | rgb(139, 0, 0) | Hover/pressed red |

### 10.2 Logo Description

```
MO3 Logo:
- Background: #000000 (black square/circle)
- "MO": Bold white text, Arial Black style
- "O": Has a red play button triangle inside
- "3": Bold red #E31212
- Below: "media production" in red spaced letters

Files available:
- PNG: /mnt/user-data/uploads/MO_3_20260325_195138_0000.png
- Secondary: /mnt/user-data/uploads/MO_3_20260325_233928_0000.png
  (shows camera icon + "Media outlet / Pre shoot Post")
```

### 10.3 Dark Mode Only

The site is **always dark**. No light mode on public site.
Admin panel also always dark.
`forcedTheme="dark"` in ThemeProvider.

### 10.4 Color Usage Rules

- 60% black background
- 30% surface cards #111111
- 10% red accent #E31212
- Red NEVER changes between modes
- Hover: red buttons darken to #c01010
- Text on red: always white #FFFFFF

---

## 11. TYPOGRAPHY

| Use | Font | Weight | Notes |
|-----|------|--------|-------|
| Display/Hero | Bebas Neue | 400 | Section titles, hero title |
| Body (EN) | DM Sans | 400, 500, 700 | All body text in English |
| Body (AR) | Cairo | 400, 600, 700 | All text when Arabic active |
| Monospace | None | — | Not used |

```css
/* English (LTR) */
font-family: 'DM Sans', sans-serif;

/* Arabic (RTL) */
[dir="rtl"] {
  font-family: 'Cairo', sans-serif;
}

/* Display headings */
.font-bebas {
  font-family: 'Bebas Neue', cursive;
}
```

---

## 12. HOMEPAGE SECTION ORDER

```
1.  HeroVideo          — fullscreen autoplay video + title + CTA
2.  AboutUs            — company story + 3 stat cards
3.  StatsSection       — animated counters (videos, clients, commercials, years)
4.  ClientsMarquee     — infinite scroll logos, grayscale → color on hover
5.  WorkSections       — one section per category (Commercial Ads, Reels, Podcast, Video Clips)
6.  TestimonialsSection — client reviews with stars
7.  WorkMap            — Leaflet map of Egypt with red markers
8.  EgyptMapSection    — governorates coverage (if enabled)
9.  FAQSection         — accordion style
10. ContactSection     — WhatsApp form + social links
11. Footer             — copyright + links
```

---

## 13. LANGUAGE SYSTEM (AR/EN)

| Setting | Value |
|---------|-------|
| **Default** | English (LTR) |
| **Toggle** | Button in navbar — shows flag + language name |
| **Arabic direction** | RTL — `dir="rtl"` on `<html>` |
| **Arabic font** | Cairo from Google Fonts |
| **Storage** | localStorage key: `mo3-lang` |
| **Admin** | Always English, no toggle |
| **Translations** | All public UI text in both languages |
| **Numbers** | Always LTR even in Arabic |
| **Marquee** | Reverses direction in RTL |

---

## 14. DATABASE SCHEMA

### Prisma Models

```prisma
model Section {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  order     Int      @default(0)
  isVisible Boolean  @default(true)
  works     Work[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Work {
  id          String   @id @default(cuid())
  title       String
  client      String?
  videoUrl    String?
  thumbnail   String?
  description String?
  tags        String[]
  isVisible   Boolean  @default(true)
  order       Int      @default(0)
  sectionId   String
  section     Section  @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Client {
  id        String  @id @default(cuid())
  name      String
  logo      String
  order     Int     @default(0)
  isVisible Boolean @default(true)
}

model SiteConfig {
  id    String @id @default(cuid())
  key   String @unique
  value String
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  role      String?
  company   String?
  content   String
  image     String?
  rating    Int      @default(5)
  isVisible Boolean  @default(true)
  order     Int      @default(0)
  createdAt DateTime @default(now())
}

model FAQ {
  id        String  @id @default(cuid())
  question  String
  answer    String
  order     Int     @default(0)
  isVisible Boolean @default(true)
}

model Stat {
  id     String @id @default(cuid())
  label  String
  value  Int
  suffix String @default("+")
  prefix String @default("")
  order  Int    @default(0)
}

model HeroConfig {
  id       String  @id @default(cuid())
  videoUrl String?
  title    String  @default("ARCHITECTS OF EMOTION")
  tagline  String  @default("Media outlet — Pre · shoot · Post")
  ctaText  String  @default("View Our Work")
}
```

### Supabase Tables (separate from Prisma)

```sql
-- Work locations for the interactive map
create table work_locations (
  id uuid default gen_random_uuid() primary key,
  project_name text not null,
  client_name text,
  city text not null,
  governorate text,
  lat numeric not null,
  lng numeric not null,
  category text not null,
  description text,
  project_url text,
  created_at timestamp with time zone default now()
);
```

---

## 15. ENVIRONMENT VARIABLES

### .env (for Prisma CLI)
```
DATABASE_URL=postgresql://postgres.ditdnwlfatyqoddtutli:PASSWORD@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ditdnwlfatyqoddtutli:PASSWORD@aws-1-eu-west-3.pooler.supabase.com:5432/postgres
```

### .env.local (for Next.js)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=mo3productionsecretkey2025verylongstring
ADMIN_EMAIL=admin@mo3production.com
ADMIN_PASSWORD=1234567890

DATABASE_URL=... (same as above)
DIRECT_URL=... (same as above)

NEXT_PUBLIC_SUPABASE_URL=https://ditdnwlfatyqoddtutli.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Vercel Environment Variables
Same as .env.local but:
- `NEXTAUTH_URL` = `https://mo-3-pi.vercel.app`

---

## 16. SOCIAL MEDIA LINKS

| Platform | URL |
|----------|-----|
| WhatsApp | https://wa.me/201066298201 |
| Phone | 01066298201 |
| Instagram | https://www.instagram.com/mo3_production |
| Facebook | https://www.facebook.com/MO3Production |
| Behance | https://www.behance.net/mo3team |

---

## 17. RESPONSIVE BEHAVIOR

### 17.1 Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| **Mobile** | < 768px | Single column, hamburger nav, no 3D tilt, touch-friendly |
| **Tablet** | 768–1024px | 2 columns, reduced animations |
| **Desktop** | > 1024px | Full experience, custom cursor, multi-column |
| **Wide** | > 1440px | Max-width container, increased spacing |

### 17.2 Mobile Rules

- No horizontal scroll
- Min touch target: 44×44px
- Min font size: 14px
- Padding on all sides: min 16px
- Hero text: max 64px on mobile
- Work grid: 1 column on mobile, 2 on tablet
- Admin panel: fully usable on mobile
- Video autoplay: requires muted + playsInline for iOS

---

## 18. PERFORMANCE CONTRACT

| Metric | Target |
|--------|--------|
| **FCP** | < 1.5s |
| **LCP** | < 2.5s |
| **TTI** | < 3.5s |
| **CLS** | < 0.1 |
| **Frame Rate** | 60fps |

### Optimization Rules

- All images: Next.js `<Image>` with lazy loading
- Leaflet map: `dynamic(() => import(), { ssr: false })`
- Canvas particles: disabled on mobile (< 768px)
- 3D tilt: disabled on touch devices
- Video: lazy load, only autoplay when in viewport
- Fonts: next/font for zero layout shift
- API routes: return proper error codes

---

## 19. KNOWN ISSUES & FIXES APPLIED

| Issue | Fix Applied |
|-------|-------------|
| Google Maps quota exceeded | Replaced with Leaflet + CartoDB tiles |
| Prisma 7 breaking changes | Downgraded to Prisma 5.22.0 |
| Leaflet SSR error | Used `dynamic()` with `ssr: false` |
| TypeScript strict mode | Set `strict: false` in tsconfig.json |
| Windows node_modules lock | Delete node_modules + reinstall |
| Cloudinary not configured | Must set real values in .env.local |
| favicon 404 | Add favicon.svg to /public |
| Light mode inconsistency | Removed light mode, forced dark always |

---

## 20. QA CHECKLIST

Before every deployment verify:

### Public Website
- [ ] Homepage loads all sections
- [ ] Hero video plays (if configured)
- [ ] Stats counters animate on scroll
- [ ] Client logos marquee scrolls
- [ ] Work cards show real content
- [ ] Work card click opens video lightbox
- [ ] Lightbox closes on X, backdrop, ESC
- [ ] Language toggle switches EN↔AR
- [ ] RTL layout correct in Arabic
- [ ] All text translates
- [ ] Social links work
- [ ] Contact form opens WhatsApp
- [ ] Map shows markers
- [ ] FAQ accordion works
- [ ] Mobile layout at 375px — no overflow
- [ ] No console errors

### Admin Panel
- [ ] Login works
- [ ] All CRUD for: Sections, Works, Clients, Testimonials, FAQ, Stats, Hero, Locations, Settings
- [ ] Image upload works (Cloudinary)
- [ ] Toast notifications on success/error
- [ ] Admin always dark regardless of toggle

### Build
- [ ] `npm run build` passes with zero errors
- [ ] `npx prisma db push` synced
- [ ] `git push` triggers successful Vercel deployment

---

## 21. EDITS & REVISIONS LOG

| Date | Change | Reason |
|------|--------|--------|
| 2026-05-16 | Initial template filled | Project documentation |
| 2026-04-05 | Added Leaflet map for work locations | Google Maps quota hit |
| 2026-04-05 | Downgraded Prisma to 5.22.0 | v7 breaking changes |
| 2026-04-05 | Added AR/EN language toggle | Client requirement |
| 2026-04-05 | Removed light mode completely | Brand consistency |
| 2026-04-05 | Added new sections: Stats, Testimonials, FAQ, Contact | Client requirement |
| 2026-03-25 | Initial project setup | New project |

---

## 22. APPENDIX

### Reference Materials

| Type | Link |
|------|------|
| **Live Site** | https://mo-3-pi.vercel.app |
| **Admin Panel** | https://mo-3-pi.vercel.app/admin |
| **GitHub Repo** | github.com/Amr-Mo-ali/MO3 |
| **Supabase Project** | ditdnwlfatyqoddtutli.supabase.co |
| **Cloudinary** | cloudinary.com dashboard |
| **Portfolio PDF** | MO3 Production Portfolio (uploaded) |
| **Logo PNG** | MO_3_20260325_195138_0000.png |

### Special Notes for AI Agent

```
- NEVER use Google Maps — always Leaflet.js
- NEVER add light mode — site is always dark
- NEVER use <form> tags in admin — use <div> + type="button"
- NEVER break existing features when adding new ones
- ALWAYS use react-hot-toast for notifications
- ALWAYS use Next.js Image component for images
- ALWAYS add 'use client' to components using hooks
- ALWAYS use dynamic() with ssr:false for map components
- Arabic numbers still display LTR even when dir="rtl"
- Admin panel stays English always, no language toggle there
- Cloudinary folder for uploads: 'mo3-production'
- Map tiles: https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
```

---

## ✅ PRE-FLIGHT CHECKLIST

- [x] Project details filled
- [x] Color system defined from logo
- [x] Tech stack versions specified
- [x] All routes documented
- [x] Database schema complete
- [x] Environment variables listed
- [x] Responsive rules defined
- [x] Performance targets set
- [x] Known issues documented
- [x] QA checklist ready
- [x] Social links added
- [x] Special AI instructions noted
