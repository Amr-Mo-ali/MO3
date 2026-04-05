/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'cdnjs.cloudflare.com',
      'unpkg.com',
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback, 
      fs: false 
    }
    return config
  },
}

export default nextConfig
