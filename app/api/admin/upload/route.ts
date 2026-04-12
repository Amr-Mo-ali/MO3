import { v2 as cloudinary } from 'cloudinary'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    // Validate Cloudinary credentials before proceeding
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName) {
      console.error('CLOUDINARY_CLOUD_NAME is not set')
      return NextResponse.json(
        { error: 'Cloudinary is not configured. Missing CLOUDINARY_CLOUD_NAME.' },
        { status: 500 }
      )
    }

    if (!apiKey) {
      console.error('CLOUDINARY_API_KEY is not set')
      return NextResponse.json(
        { error: 'Cloudinary is not configured. Missing CLOUDINARY_API_KEY.' },
        { status: 500 }
      )
    }

    if (!apiSecret) {
      console.error('CLOUDINARY_API_SECRET is not set')
      return NextResponse.json(
        { error: 'Cloudinary is not configured. Missing CLOUDINARY_API_SECRET.' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const allowedTypes = [
      'image/jpeg', 
      'image/png', 
      'image/webp', 
      'image/gif'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      console.warn(`Invalid file type attempted: ${file.type}`)
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, GIF allowed.' },
        { status: 400 }
      )
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      console.warn(`File too large: ${file.size} bytes (max: ${maxSize})`)
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    console.log(`Starting upload for file: ${file.name} (${file.size} bytes)`)

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'mo3-production',
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    })

    // Check for Cloudinary API errors
    if (result.error) {
      const errorCode = result.error?.http_code || 500
      console.error(`Cloudinary API error (${errorCode}): ${result.error?.message}`)
      
      if (errorCode === 401 || errorCode === 403) {
        return NextResponse.json(
          { error: 'Cloudinary authentication failed. Check your API credentials.' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: `Upload failed: ${result.error.message}` },
        { status: 500 }
      )
    }

    console.log(`Upload successful: ${result.public_id} (${result.width}x${result.height})`)

    return NextResponse.json({ 
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    })

  } catch (error: any) {
    console.error('Upload error:', {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      http_code: error?.http_code,
      stack: error?.stack
    })

    // Handle specific Cloudinary authentication errors
    if (error?.http_code === 401 || error?.code === 'AUTH_ERROR') {
      return NextResponse.json(
        { error: 'Cloudinary authentication failed. Verify API key and secret.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: error?.message || 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}
