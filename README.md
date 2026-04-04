<<<<<<< HEAD
# MO3 Production

A dark cinematic portfolio and admin dashboard for MO3 Production built with Next.js 14, TypeScript, Tailwind CSS, Prisma, NextAuth.js, Cloudinary, and dnd-kit.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from the template and update the values:

```bash
cp .env.local .env.local
```

3. Push the Prisma schema to the database:

```bash
npx prisma db push
```

4. Seed the database with sample sections, works, clients, and settings:

```bash
npm run seed
```

5. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Required Environment Variables

Update the following variables in `.env.local`:

- `NEXTAUTH_URL` - Your app base URL (e.g. `http://localhost:3000` locally).
- `NEXTAUTH_SECRET` - A secure random string used by NextAuth.
- `ADMIN_EMAIL` - The admin login email.
- `ADMIN_PASSWORD` - The admin login password.
- `DATABASE_URL` - PostgreSQL connection string for Supabase.
- `SUPABASE_URL` - Your Supabase project URL.
- `SUPABASE_ANON_KEY` - Supabase anonymous public API key.
- `CLOUDINARY_URL` - Cloudinary URL in the format `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`.
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name.
- `CLOUDINARY_API_KEY` - Cloudinary API key.
- `CLOUDINARY_API_SECRET` - Cloudinary API secret.

## Project Structure

- `app/` - Next.js App Router pages and layouts.
- `app/admin/` - Protected admin dashboard routes.
- `app/api/admin/` - CRUD API routes for sections, works, clients, and settings.
- `lib/` - Shared helpers and Prisma client.
- `prisma/` - Prisma schema and seed script.

## Admin Dashboard

- `http://localhost:3000/admin/login` - Admin login page.
- `http://localhost:3000/admin/overview` - Admin overview stats.
- `http://localhost:3000/admin/sections` - Manage sections.
- `http://localhost:3000/admin/works` - Manage works.
- `http://localhost:3000/admin/clients` - Manage clients.
- `http://localhost:3000/admin/settings` - Manage site settings.

## Deployment

### Vercel

1. Create a Vercel project and connect your repository.
2. Add the same environment variables from `.env.local` to Vercel.
3. Set `NEXTAUTH_URL` to your deployed Vercel URL.
4. Deploy the app.

### Supabase

- Use Supabase PostgreSQL for `DATABASE_URL`.
- If you want to use Supabase authentication or storage later, configure the project in Supabase.

## Useful Commands

- `npm run dev` - Start development server.
- `npm run build` - Build production app.
- `npm run start` - Start the production server.
- `npm run lint` - Run ESLint.
- `npm run seed` - Seed the database with sample demo content.

## Notes

- The public homepage pulls content from the database and only displays items where `isVisible = true`.
- The admin dashboard uses credential-based login with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- Cloudinary is used for image uploads and thumbnails.
=======
# MO3
>>>>>>> 7046d4c0773d5e4db5f8a85669286af10b5bbd00
