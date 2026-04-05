import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create sections
  const commercial = await prisma.section.upsert({
    where: { slug: 'commercial-ads' },
    update: {},
    create: {
      title: 'Commercial Ads',
      slug: 'commercial-ads',
      order: 1,
      isVisible: true,
    },
  })

  const reels = await prisma.section.upsert({
    where: { slug: 'reels' },
    update: {},
    create: {
      title: 'Reels',
      slug: 'reels',
      order: 2,
      isVisible: true,
    },
  })

  const podcast = await prisma.section.upsert({
    where: { slug: 'podcast' },
    update: {},
    create: {
      title: 'Podcast',
      slug: 'podcast',
      order: 3,
      isVisible: true,
    },
  })

  const videoClip = await prisma.section.upsert({
    where: { slug: 'video-clips' },
    update: {},
    create: {
      title: 'Video Clips',
      slug: 'video-clips',
      order: 4,
      isVisible: true,
    },
  })

  // Create site config
  const configs = [
    { key: 'about_text', value: 'At MO3, we believe in the power of stories. Born from a passion for visual storytelling, we are more than a media company — we are architects of emotion.' },
    { key: 'whatsapp', value: '+201000000000' },
    { key: 'instagram', value: 'https://instagram.com/mo3production' },
    { key: 'behance', value: 'https://behance.net/mo3production' },
    { key: 'facebook', value: 'https://facebook.com/mo3production' },
  ]

  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    })
  }

  console.log('✅ Seed completed successfully')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
