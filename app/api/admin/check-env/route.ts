import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    cloudinary: {
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
    },
    auth: {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    },
    database: {
      DATABASE_URL: !!process.env.DATABASE_URL,
    },
    maps: {
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      NEXT_PUBLIC_GOOGLE_MAP_ID: true,
    }
  }

  const allConfigured = Object.values(checks).every(section =>
    Object.values(section).every(v => v === true)
  )

  if (allConfigured) {
    return NextResponse.json({
      status: 'success',
      message: 'All required environment variables are configured',
      checks
    })
  } else {
    const missing = Object.entries(checks)
      .flatMap(([section, vars]) =>
        Object.entries(vars)
          .filter(([, configured]) => !configured)
          .map(([varName]) => `${section}.${varName}`)
      )

    return NextResponse.json({
      status: 'error',
      message: 'Some environment variables are missing',
      missing,
      checks
    }, { status: 400 })
  }
}
