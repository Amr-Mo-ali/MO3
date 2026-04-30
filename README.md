# MO3 Production

Portfolio and admin dashboard for MO3 Production, built with Next.js 14, TypeScript, Prisma, NextAuth, Cloudinary, and Tailwind CSS.

## Setup

1. Install dependencies with `npm install`.
2. Configure `.env.local`.
3. Sync the database with `npx prisma db push`.
4. Start the app with `npm run dev`.

## Required Environment Variables

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `DATABASE_URL`
- `DIRECT_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_GOOGLE_MAP_ID` (optional, falls back to `DEMO_MAP_ID`)

## Main Routes

- `/` public portfolio
- `/admin-login` admin sign-in
- `/admin` admin overview
- `/admin/sections` section management
- `/admin/works` work management
- `/admin/clients` client management
- `/admin/places` work-location overview
- `/admin/settings` site settings
