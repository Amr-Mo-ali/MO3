import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const sections = [
    { title: "Commercial Ads", slug: "commercial-ads", order: 1 },
    { title: "Reels", slug: "reels", order: 2 },
    { title: "Podcast", slug: "podcast", order: 3 },
    { title: "Video Clips", slug: "video-clips", order: 4 },
  ];

  for (const section of sections) {
    await prisma.section.upsert({
      where: { slug: section.slug },
      update: {},
      create: {
        ...section,
        isVisible: true,
      },
    });
  }

  const configs = [
    {
      key: "about_text",
      value:
        "At MO3, we believe in the power of stories. Born from a passion for visual storytelling, we are more than a media company - we are architects of emotion.",
    },
    { key: "whatsapp", value: "https://wa.me/201066298201" },
    { key: "phone", value: "01066298201" },
    { key: "instagram", value: "https://www.instagram.com/mo3_production?igsh=eWxyMTZkaXRxa3Nq" },
    { key: "behance", value: "https://www.behance.net/mo3team" },
    { key: "facebook", value: "https://www.facebook.com/MO3Production" },
  ];

  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }

  const existingHero = await prisma.heroConfig.findFirst();
  if (!existingHero) {
    await prisma.heroConfig.create({
      data: {
        title: "Cinematic stories built for brands that need to be remembered.",
        subtitle: "Commercials, reels, branded films, and premium post-production from concept to delivery.",
        ctaLabel: "Start Your Project",
        ctaLink: "https://wa.me/201066298201",
        videoUrl: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
        isVisible: true,
      },
    });
  }

  const statCount = await prisma.stat.count();
  if (statCount === 0) {
    await prisma.stat.createMany({
      data: [
        { label: "Videos Produced", value: 120, suffix: "+", order: 1, isVisible: true },
        { label: "Clients", value: 45, suffix: "+", order: 2, isVisible: true },
        { label: "Commercials", value: 65, suffix: "+", order: 3, isVisible: true },
        { label: "Years Experience", value: 8, suffix: "+", order: 4, isVisible: true },
      ],
    });
  }

  const faqCount = await prisma.fAQ.count();
  if (faqCount === 0) {
    await prisma.fAQ.createMany({
      data: [
        {
          question: "What does MO3 handle?",
          answer: "MO3 handles creative development, production, editing, color, and delivery for commercials, reels, and branded content.",
          order: 1,
          isVisible: true,
        },
        {
          question: "How do we start?",
          answer: "Send the brief on WhatsApp with your timeline, goals, and deliverables, and MO3 will guide the next step.",
          order: 2,
          isVisible: true,
        },
      ],
    });
  }

  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.create({
      data: {
        name: "MO3 Client",
        role: "Marketing Lead",
        company: "Brand Partner",
        quote: "MO3 brought speed, polish, and sharp creative direction from pre-production through final delivery.",
        rating: 5,
        order: 1,
        isVisible: true,
      },
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
