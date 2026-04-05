# MO3 Work Locations Feature - Integration Guide

## STEP 1: Install Dependencies

Run this command in your project:

```bash
npm install react-leaflet leaflet @supabase/supabase-js
npm install -D @types/leaflet
```

If you don't have Tailwind configured with Bebas Neue, add to your `app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

@font-face {
  font-family: 'Bebas Neue';
  src: url('https://fonts.googleapis.com/css2?family=Bebas+Neue');
}

.font-bebas {
  font-family: 'Bebas Neue', cursive;
}
```

---

## STEP 2: Setup Supabase

1. Go to your Supabase project dashboard
2. Open SQL Editor
3. Run this SQL:

```sql
create table work_locations (
  id uuid default gen_random_uuid() primary key,
  project_name text not null,
  client_name text not null,
  city text not null,
  governorate text,
  lat numeric not null,
  lng numeric not null,
  category text not null,
  description text,
  project_url text,
  created_at timestamp with time zone default now()
);

alter table work_locations enable row level security;
create policy "Public read" on work_locations for select using (true);
create policy "Admin all" on work_locations for all using (true);
```

---

## STEP 3: Add Environment Variables

Create/update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Find these values in Supabase:
- Settings → API → Project URL
- Settings → API → Project API keys → anon public key

---

## STEP 4: Seed Sample Data (Optional)

In Supabase SQL Editor, run:

```sql
insert into work_locations 
  (project_name, client_name, city, governorate, lat, lng, category, description)
values
  ('Brand Identity Film', 'Rich Key Real Estate', 'Cairo', 'القاهرة', 
   30.0444, 31.2357, 'Commercial Ad', 
   'Full brand commercial shot across downtown Cairo'),
  ('Product Launch Reel', 'Ottroja Restaurant', 'Alexandria', 'الإسكندرية', 
   31.2001, 29.9187, 'Reel', 
   'Fast-cut product reel for social media launch'),
  ('CEO Podcast Series', 'EraaSoft', 'Giza', 'الجيزة', 
   30.0131, 31.2089, 'Podcast', 
   'Monthly podcast series filmed at client headquarters'),
  ('Course Promo Video', 'Prof99 Education', 'Beni Suef', 'بني سويف', 
   29.0661, 31.0994, 'Video Clip', 
   'Promotional video for online education platform');
```

---

## STEP 5: Add WorkMap to Homepage

### Option A: Import into existing page

Edit `components/Homepage.tsx` (or your main homepage):

```tsx
import WorkMap from '@/components/WorkMap'
import { supabase } from '@/lib/supabase'

export default async function Homepage() {
  // Fetch locations server-side
  const { data: locations, error } = await supabase
    .from('work_locations')
    .select('*')

  return (
    <div>
      {/* Existing homepage content */}
      
      {/* Work Map Section */}
      <section className="relative bg-black py-20 md:py-32">
        <WorkMap locations={locations || []} />
      </section>
    </div>
  )
}
```

### Option B: Create a separate route

Create `app/works/page.tsx`:

```tsx
import WorkMap from '@/components/WorkMap'
import { supabase } from '@/lib/supabase'

export default async function WorksPage() {
  const { data: locations, error } = await supabase
    .from('work_locations')
    .select('*')

  if (error) {
    console.error('Error fetching locations:', error)
  }

  return (
    <main className="bg-black min-h-screen pt-20">
      <WorkMap locations={locations || []} />
    </main>
  )
}
```

---

## STEP 6: Test Everything

### Admin Dashboard
1. Navigate to `/admin/places`
2. You should see a table with sample data
3. Test:
   - Click "Add New Location" → opens modal
   - Click on map to set coordinates
   - Fill form and submit
   - Edit existing location
   - Delete a location

### Public Map
1. Navigate to your homepage/works page
2. You should see the interactive map
3. Test:
   - Map loads with markers
   - Click markers to see popups
   - Click category filters
   - Click sidebar cards to fly to marker
   - Try on mobile (map top, cards below)

---

## TROUBLESHOOTING

### "Leaflet is not defined"
- Ensure all map components have `'use client'` at top
- Check dynamic imports are using `ssr: false`

### Map not showing
- Check Supabase environment variables
- Verify CartoDB tiles are loading (browser DevTools Network tab)
- Check console for JavaScript errors

### Markers not appearing
- Verify work_locations table has data
- Check lat/lng values are within Egypt bounds (~19-32°N, ~24-35°E)
- Ensure Leaflet default icons are loading from CDN

### NextAuth not intercepting admin route
- Verify NextAuth is properly configured
- Check [providers.tsx] is wrapping your app
- Ensure session exists before accessing /admin/places

### Supabase connection error
- Verify API keys in .env.local
- Check Supabase project status
- Ensure RLS policies are set to allow public read

---

## FILE STRUCTURE

```
lib/
  └─ supabase.ts
types/
  └─ place.ts
components/
  ├─ WorkMap.tsx
  └─ WorkMapCard.tsx
app/
  └─ admin/
      └─ places/
          ├─ page.tsx
          └─ components/
              ├─ PlaceModal.tsx
              └─ PlaceTable.tsx
```

---

## API ENDPOINTS

The admin dashboard handles all operations through Supabase client directly (no API routes needed).

Available operations:
- `GET /admin/places` → All locations
- `POST /admin/places` → Create location (via modal)
- `PUT /admin/places/{id}` → Update location (via modal)
- `DELETE /admin/places/{id}` → Delete location (via table)

---

## CUSTOMIZATION

### Change Map Colors
Edit `components/WorkMap.tsx` line ~80:
```tsx
<style>{`
  .leaflet-marker-custom {
    background: #E31212; // Change red here
    box-shadow: 0 0 0 0 rgba(227, 18, 18, 0.7); // Adjust alpha
    animation: pulse 2s infinite; // Change speed
  }
`}</style>
```

### Change Map Center/Zoom
Edit `components/WorkMap.tsx`:
```tsx
<MapContainer
  center={[26.8206, 30.8025]} // lat, lng
  zoom={6} // 1-18
  ...
>
```

### Customize Card Styling
Edit `components/WorkMapCard.tsx` for card appearance
Edit `components/WorkMap.tsx` sidebar section for layout

### Change Categories
Add/remove from `const CATEGORIES` array in:
- `components/WorkMap.tsx`
- `app/admin/places/components/PlaceModal.tsx`
- `app/admin/places/components/PlaceTable.tsx`

---

## Performance Notes

- WorkMap uses dynamic imports with `ssr: false` for Leaflet
- Locations are fetched server-side when homepage is accessed
- Supabase queries use RLS for security
- Mobile: use CSS media queries (already included)
- Consider pagination if you have 100+ locations

